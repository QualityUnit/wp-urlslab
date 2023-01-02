<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Urls_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;

		if ( empty( get_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START ) ) || 1 != get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS ) ) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . " WHERE urlCheckDate < %s OR urlCheckDate is NULL LIMIT 1", // phpcs:ignore
				get_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		if ( ! strlen( trim( $url->get( 'urlTitle' ) ) ) ) {
			$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get( 'urlMetaDescription' ) ) ) ) {
			$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
		}
		$url->set( 'urlCheckDate', Urlslab_Url_Row::get_now() );
		$url->update();    //lock the entry, so no other process will start working on it

		return $this->updateUrl( $url );
	}

	private function updateUrl( Urlslab_Url_Row $url ) {
		try {
			$page_content_file_name = download_url( $url->get_url()->get_url_with_protocol() );

			if ( is_wp_error( $page_content_file_name ) ) {
				$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
				if ( 'http_404' == $page_content_file_name->get_error_code() ) {
					switch ( $page_content_file_name->get_error_data()['code'] ) {
						case 404:
							$url->set( 'status', Urlslab_Url_Row::STATUS_4XX );
							break;
						case 500:
						case 503:    //not sure if we should invalidate url to 503 page - it can come again online, we can later revalidate it
							$url->set( 'status', Urlslab_Url_Row::STATUS_5XX );
							break;
						default:
					}
				}
			} else if ( empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
				$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
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
					if ( $url->get( 'urlTitle' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
						$titlelist = $document->getElementsByTagName( 'title' );
						if ( $titlelist->length > 0 ) {
							$url->set( 'urlTitle', $titlelist->item( 0 )->nodeValue );
							if ( empty( $url->get( 'urlTitle' ) ) ) {
								$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
							}
						} else {
							$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
						}
					}

					if ( $url->get( 'urlMetaDescription' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
						$xpath            = new DOMXPath( $document );
						$metadescriptions = $xpath->evaluate( '//meta[@name="description"]/@content' );
						if ( $metadescriptions->length > 0 ) {
							$url->set( 'urlMetaDescription', $xpath->evaluate( '//meta[@name="description"]/@content' )->item( 0 )->value );
							if ( empty( $url->get( 'urlMetaDescription' ) ) ) {
								$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
							}
						} else {
							$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
						}
					}
					switch ( $url->get( 'status' ) ) {
						case Urlslab_Url_Row::STATUS_5XX:
						case Urlslab_Url_Row::STATUS_4XX:
							$url->set( 'status', Urlslab_Url_Row::STATUS_ACTIVE );
							$url->set( 'updateStatusDate', Urlslab_Url_Row::get_now() );
							break;
						default:
					}
				} catch ( Exception $e ) {
				}
				unlink( $page_content_file_name );
			}
		} catch ( Exception $e ) {
			$url->set( 'urlTitle', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'urlMetaDescription', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'status', Urlslab_Url_Row::STATUS_BROKEN );
		}
		$url->set( 'urlCheckDate', Urlslab_Url_Row::get_now() );

		return $url->update();
	}
}
