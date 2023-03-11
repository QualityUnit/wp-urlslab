<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Urls_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;

		if ( empty( get_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START ) ) || ! get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS ) ) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . " WHERE update_http_date < %s OR update_http_date is NULL ORDER BY update_http_date LIMIT 1", // phpcs:ignore
				get_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START )
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
					if ( $url->get( 'url_title' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
						$titlelist = $document->getElementsByTagName( 'title' );
						if ( $titlelist->length > 0 ) {
							$url->set( 'url_title', $titlelist->item( 0 )->nodeValue );
							if ( empty( $url->get( 'url_title' ) ) ) {
								$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
							}
						} else {
							$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
						}
					}

					if ( $url->get( 'url_meta_description' ) == Urlslab_Url_Row::VALUE_EMPTY ) {
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
				}
				unlink( $page_content_file_name );
			}
		} catch ( Exception $e ) {
			$url->set( 'url_title', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'url_meta_description', Urlslab_Url_Row::VALUE_EMPTY );
			$url->set( 'http_status', Urlslab_Url_Row::STATUS_HTTP_NOT_PROCESSED );
		}
		$url->set( 'update_http_date', Urlslab_Url_Row::get_now() );

		return $url->update();
	}
}
