<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Urls_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Link_Enhancer::SLUG );
		if ( ! $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS ) || 999999999 == $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) ) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . " WHERE 
				http_status = %d OR
				(http_status > 0 AND update_http_date < %s) OR
				(http_status = %d AND update_http_date < %s)
				ORDER BY update_http_date 
				LIMIT 1", // phpcs:ignore
				Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED,
				Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) ),
				//PENDING urls will be retried in one hour again
				Urlslab_Url_Row::HTTP_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		if ( ! strlen( trim( $url->get( 'url_title' ) ) ) ) {
			$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get( 'url_meta_description' ) ) ) ) {
			$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
		}
		$url->set( 'update_http_date', Urlslab_Url_Row::get_now() );
		$url->set( 'http_status', Urlslab_Url_Row::HTTP_STATUS_PENDING );
		$url->update();    //lock the entry, so no other process will start working on it

		return $this->updateUrl( $url );
	}

	private function updateUrl( Urlslab_Url_Row $url ) {
		try {
			$page_content_file_name = download_url( $url->get_url()->get_url_with_protocol() );

			if ( is_wp_error( $page_content_file_name ) ) {
				$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'http_status', (int) $page_content_file_name->get_error_code() );
			} else if ( empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'http_status', 400 );
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
					if ( empty( $url->get( 'url_title' ) ) || $url->get( 'url_title' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
						$titlelist = $document->getElementsByTagName( 'title' );
						if ( $titlelist->length > 0 ) {
							$url->set( 'url_title', $titlelist->item( 0 )->nodeValue );
							if ( empty( $url->get( 'url_title' ) ) ) {
								$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
							}
						} else {
							//try to load title from H1
							$hlist = $document->getElementsByTagName( 'h1' );
							if ( $hlist->length > 0 && strlen( $hlist->item( 0 )->nodeValue ) ) {
								$url->set( 'url_title', $hlist->item( 0 )->nodeValue );
							} else {
								$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
							}
						}
					}

					if ( empty( $url->get( 'url_meta_description' ) ) || $url->get( 'url_meta_description' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
						$xpath            = new DOMXPath( $document );
						$metadescriptions = $xpath->evaluate( '//meta[@name="description"]/@content' );
						if ( $metadescriptions->length > 0 ) {
							$url->set( 'url_meta_description', $xpath->evaluate( '//meta[@name="description"]/@content' )->item( 0 )->value );
							if ( empty( $url->get( 'url_meta_description' ) ) ) {
								$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
							}
						} else {
							$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
						}
					}
					$url->set( 'http_status', 200 );
				} catch ( Exception $e ) {
					$url->set( 'http_status', 400 );
				}
				unlink( $page_content_file_name );
			}
		} catch ( Exception $e ) {
			$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'http_status', 400 );
		}
		$url->set( 'update_http_date', Urlslab_Url_Row::get_now() );

		return $url->update();
	}
}
