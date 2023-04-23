<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Url_Http_Status_Cron extends Urlslab_Cron {
	public function get_description(): string {
		return __( 'Checking HTTP status of scheduled URLs in plugin database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Link_Enhancer::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Link_Enhancer::SLUG );
		if ( ! $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS ) ) {
			return false;
		}

		global $wpdb;
		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = %d OR (http_status > 0 AND update_http_date < %s) OR (http_status = %d AND update_http_date < %s) ORDER BY update_http_date LIMIT 1', // phpcs:ignore
				Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED,
				Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) ),                                                                  // PENDING urls will be retried in one hour again
				Urlslab_Url_Row::HTTP_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		if ( ! strlen( trim( $url->get_url_title() ) ) ) {
			$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_h1() ) ) ) {
			$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_meta_description() ) ) ) {
			$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
		}
		$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_PENDING );
		$url->update();    // lock the entry, so no other process will start working on it

		return $this->updateUrl( $url );
	}

	private function get_final_redirect_url( $url, $hop = 1 ): string {
		$response      = wp_remote_head( $url );
		$response_code = (int) wp_remote_retrieve_response_code( $response );
		if ( 15 > $hop && 300 < $response_code && 399 > $response_code ) {
			/** @var WP_HTTP_Requests_Response $http_response */
			$http_response = $response['http_response'];
			if ( strlen( $http_response->get_response_object()->url ) && $url !== $http_response->get_response_object()->url ) {
				return $this->get_final_redirect_url( $http_response->get_response_object()->url, $hop + 1 );
			} else {
				return $url;
			}
		}

		return $url;
	}

	/**
	 * @param $url
	 *
	 * @return object
	 */
	function check_url_status( $url ) {
		$response = wp_remote_head( $url );

		$first_response_code = wp_remote_retrieve_response_code( $response );
		if ( empty( $first_response_code ) ) {
			$first_response_code = 500;
		}

		if ( 300 < $first_response_code && 399 > $first_response_code ) {
			/** @var WP_HTTP_Requests_Response $http_response */
			$http_response = $response['http_response'];
			$url           = $this->get_final_redirect_url( $http_response->get_response_object()->url );
		}

		return (object) array(
			'code' => $first_response_code,
			'url'  => $url,
		);

	}

	private function updateUrl( Urlslab_Url_Row $url ) {
		try {

			$status_obj = $this->check_url_status( $url->get_url()->get_url_with_protocol() );
			$url->set_http_status( $status_obj->code );

			$final_url = new Urlslab_Url( $status_obj->url );
			$url->set_final_url_id( $final_url->get_url_id() );

			if ( 200 == $status_obj->code && $final_url->get_url_id() == $url->get_url_id() ) {
				$page_content_file_name = download_url( $url->get_url()->get_url_with_protocol() );

				if ( is_wp_error( $page_content_file_name ) ) {
					$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
					$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
					$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
				} else {
					if ( empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
						$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
						$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
						$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
					} else {
						$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
						$document->encoding            = 'utf-8';
						$document->strictErrorChecking = false; // phpcs:ignore
						$libxml_previous_state         = libxml_use_internal_errors( true );

						try {
							$document->loadHTML(
								mb_convert_encoding( file_get_contents( $page_content_file_name ), 'HTML-ENTITIES', 'utf-8' ),
								LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
							);
							libxml_clear_errors();
							libxml_use_internal_errors( $libxml_previous_state );

							// find the title
							$titlelist = $document->getElementsByTagName( 'title' );
							if ( $titlelist->length > 0 ) {
								$url->set_url_title( $titlelist->item( 0 )->nodeValue );
								if ( empty( $url->get_url_title() ) ) {
									$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
								}
							}
							// try to load title from H1
							$hlist = $document->getElementsByTagName( 'h1' );
							if ( $hlist->length > 0 && strlen( $hlist->item( 0 )->nodeValue ) ) {
								$url->set_url_h1( $hlist->item( 0 )->nodeValue );
							} else {
								$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
							}
							$xpath            = new DOMXPath( $document );
							$metadescriptions = $xpath->evaluate( '//meta[@name="description"]/@content' );
							if ( $metadescriptions->length > 0 ) {
								$url->set_url_meta_description( $xpath->evaluate( '//meta[@name="description"]/@content' )->item( 0 )->value );
								if ( empty( $url->get_url_meta_description() ) ) {
									$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
								}
							} else {
								$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
							}
						} catch ( Exception $e ) {
						}
						unlink( $page_content_file_name );
					}
				}
			} else {
				$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
				$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
				$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
			}
		} catch ( Exception $e ) {
			$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
			$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
			$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
		}

		return $url->update();
	}
}
