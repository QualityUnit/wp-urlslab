<?php

require_once ABSPATH . 'wp-admin/includes/file.php';

class Urlslab_Cron_Download_Css extends Urlslab_Cron {
	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Html_Optimizer::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG );

		if ( ! $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_CSS_PROCESSING ) ) {
			return false;
		}

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE status IN (%s, %s) AND status_changed < %s', // phpcs:ignore
				array(
					Urlslab_Data_CSS_Cache::STATUS_DISABLED,
					Urlslab_Data_CSS_Cache::STATUS_ACTIVE,
					Urlslab_Data_CSS_Cache::get_now( time() - $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_CSS_CACHE_TTL ) ),
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
				'SELECT * FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE status=%s OR ( status= %s AND status_changed < %s) LIMIT 1', // phpcs:ignore
				array(
					Urlslab_Data_CSS_Cache::STATUS_NEW,
					Urlslab_Data_CSS_Cache::STATUS_PENDING,
					Urlslab_Data_CSS_Cache::get_now( time() - 120 ),
				),
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );
			return false;
		}

		$css = new Urlslab_Data_CSS_Cache( $url_row );
		$css->set_status( Urlslab_Data_CSS_Cache::STATUS_PENDING );
		$css->update();    // lock the entry, so no other process will start working on it

		return $this->download( $css );
	}

	private function download( Urlslab_Data_CSS_Cache $css ) {
		$page_content_file_name = null;
		try {
			$page_content_file_name = download_url( $css->get_url_object()->get_url_with_protocol() );
			if ( is_wp_error( $page_content_file_name ) || empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$css->set_status( Urlslab_Data_CSS_Cache::STATUS_DISABLED );
				$css->set_css_content( '' );
			} else {
				/** @var Urlslab_Widget_Html_Optimizer $widget */
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG );

				$css->set_status( Urlslab_Data_CSS_Cache::STATUS_ACTIVE );

				// Adjusting the links in the css based on the settings
				$css_page_content = file_get_contents( $page_content_file_name );
				$css_page_content = $this->adjustCssUrlLinks( $css_page_content, $css->get_url_object() );
				if ( $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_CSS_MINIFICATION ) ) {
					$minifier = new \MatthiasMullie\Minify\CSS( $css_page_content );
					$minifier->setMaxImportSize( 0 );
					$css_page_content = $minifier->minify();
				}

				$css->set_css_content( $css_page_content );
			}
		} catch ( Exception $e ) {
			$css->set_status( Urlslab_Data_CSS_Cache::STATUS_DISABLED );
			$css->set_css_content( '' );
		}
		if ( is_string( $page_content_file_name ) && file_exists( $page_content_file_name ) ) {
			unlink( $page_content_file_name );
		}

		return $css->update();
	}

	private function adjustCssUrlLinks( string $css_content, Urlslab_Url $base_url ): string {
		// correct css prefix without query param
		$truncated_url_path_dirs = dirname( $base_url->get_url_path() );

		// Match the URLs inside the CSS content using regex
		$url_pattern = "/url\\(['\"]{0,1}(.*?)['\"]{0,1}\\)/i";
		preg_match_all( $url_pattern, $css_content, $matched_urls );

		// Iterate through each relative URL, convert it to an absolute URL, and replace it in the CSS content
		for ( $i = 0; $i < count( $matched_urls[0] ); $i ++ ) {
			if ( preg_match( '/^(https?:\/\/|data:)/', $matched_urls[1][ $i ] ) ) {
				continue;
			}
			// Convert the relative URL to an absolute URL
			if ( '/' === $matched_urls[1][ $i ][0] ) {
				$absolute_url = $base_url->get_url_scheme_prefix() . $base_url->get_domain_name() . $matched_urls[1][ $i ];
			} else {
				$absolute_url = $base_url->get_url_scheme_prefix() . $base_url->get_domain_name() . '/' . $this->normalize_path( $truncated_url_path_dirs . '/' . $matched_urls[1][ $i ] );
			}

			// Replace the relative URL with the absolute URL in the CSS content
			$css_content = str_replace( $matched_urls[0][ $i ], "url({$absolute_url})", $css_content );
		}

		return $css_content;
	}

	private function normalize_path( $path ) {
		$parts     = array_filter( explode( '/', $path ), 'strlen' );
		$absolutes = array();
		foreach ( $parts as $part ) {
			if ( '.' == $part ) {
				continue;
			}
			if ( '..' == $part ) {
				array_pop( $absolutes );
			} else {
				$absolutes[] = $part;
			}
		}

		return implode( '/', $absolutes );
	}
}
