<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-css-cache-row.php';

require_once ABSPATH . 'wp-admin/includes/file.php';

class Urlslab_Download_CSS_Cron extends Urlslab_Cron {
	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_CSS_Optimizer::SLUG ) ) {
			return false;
		}

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE status IN (%s, %s) AND status_changed < %s', // phpcs:ignore
				array(
					Urlslab_CSS_Cache_Row::STATUS_DISABLED,
					Urlslab_CSS_Cache_Row::STATUS_ACTIVE,
					Urlslab_CSS_Cache_Row::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_CSS_Optimizer::SLUG )->get_option( Urlslab_CSS_Optimizer::SETTING_NAME_CSS_CACHE_TTL ) ),
				),
			)
		);

		return parent::cron_exec( $max_execution_time );
	}

	public function get_description(): string {
		return __( 'Downloading scheduled CSS files for CSS caching', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE status=%s OR ( status= %s AND status_changed < %s) ORDER BY status_changed LIMIT 1', // phpcs:ignore
				array(
					Urlslab_CSS_Cache_Row::STATUS_NEW,
					Urlslab_CSS_Cache_Row::STATUS_PENDING,
					Urlslab_CSS_Cache_Row::get_now( time() - 120 ),
				),
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$css = new Urlslab_CSS_Cache_Row( $url_row );
		$css->set_status( Urlslab_CSS_Cache_Row::STATUS_PENDING );
		$css->update();    // lock the entry, so no other process will start working on it

		return $this->download( $css );
	}

	private function download( Urlslab_CSS_Cache_Row $css ) {
		try {
			$page_content_file_name = download_url( $css->get_url_object()->get_url_with_protocol() );
			if ( is_wp_error( $page_content_file_name ) || empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$css->set_status( Urlslab_CSS_Cache_Row::STATUS_DISABLED );
				$css->set_css_content( '' );
			} else {
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( Urlslab_CSS_Optimizer::SLUG );
				if ( $widget->get_option( Urlslab_CSS_Optimizer::SETTING_NAME_CSS_MAX_SIZE ) < filesize( $page_content_file_name ) ) {
					$css->set_status( Urlslab_CSS_Cache_Row::STATUS_DISABLED );
					$css->set_filesize( filesize( $page_content_file_name ) );
				} else {
					$css->set_status( Urlslab_CSS_Cache_Row::STATUS_ACTIVE );

					// Adjusting the links in the css based on the settings
					$css_page_content = file_get_contents( $page_content_file_name );
					if ( $widget->get_option( Urlslab_CSS_Optimizer::SETTING_NAME_CSS_ABSOLUTE_URL_LINKS ) ) {
						// should change the links to absolute urls
						$css_page_content = $this->adjustCssUrlLinks( $css_page_content, $css->get_url() );
					}

					$css->set_css_content( $css_page_content );
				}
			}
		} catch ( Exception $e ) {
			$css->set_status( Urlslab_CSS_Cache_Row::STATUS_DISABLED );
			$css->set_css_content( '' );
		}
		if ( is_string( $page_content_file_name ) && file_exists( $page_content_file_name ) ) {
			unlink( $page_content_file_name );
		}

		return $css->update();
	}

	function adjustCssUrlLinks( string $css_content, string $base_url ): string {
		// Match the URLs inside the CSS content using regex
		$url_pattern = "/url\(['\"]??(.*?)['\"]??\)/i";
		preg_match_all( $url_pattern, $css_content, $matched_urls );

		// Extract the unique URLs from the regex matches
		$relative_urls = array_unique( $matched_urls[1] );

		// Iterate through each relative URL, convert it to an absolute URL, and replace it in the CSS content
		foreach ( $relative_urls as $relative_url ) {
			// Skip absolute URLs or data URIs
			if ( preg_match( '/^(https?:\/\/|data:)/', $relative_url ) ) {
				continue;
			}
			// Convert the relative URL to an absolute URL
			$absolute_url = rtrim( $base_url, '/' ) . '/' . ltrim( $relative_url, '/' );

			// Replace the relative URL with the absolute URL in the CSS content
			$css_content = str_replace( "url({$relative_url})", "url({$absolute_url})", $css_content );
		}
		return $css_content;
	}
}
