<?php
require_once ABSPATH . 'wp-admin/includes/file.php';

class Urlslab_Cron_Download_Js extends Urlslab_Cron {
	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Html_Optimizer::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG );

		if ( ! $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_JS_PROCESSING ) ) {
			return false;
		}

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . URLSLAB_JS_CACHE_TABLE . ' WHERE status IN (%s, %s) AND status_changed < %s', // phpcs:ignore
				array(
					Urlslab_Data_CSS_Cache::STATUS_DISABLED,
					Urlslab_Data_CSS_Cache::STATUS_ACTIVE,
					Urlslab_Data_CSS_Cache::get_now( time() - $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_JS_CACHE_TTL ) ),
				),
			)
		);

		return parent::cron_exec( $max_execution_time );
	}

	public function get_description(): string {
		return __( 'Downloading scheduled Javascript files to cache', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_JS_CACHE_TABLE . ' WHERE status=%s OR ( status= %s AND status_changed < %s) LIMIT 1', // phpcs:ignore
				array(
					Urlslab_Data_Js_Cache::STATUS_NEW,
					Urlslab_Data_Js_Cache::STATUS_PENDING,
					Urlslab_Data_Js_Cache::get_now( time() - 120 ),
				),
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$js = new Urlslab_Data_Js_Cache( $url_row );
		$js->set_status( Urlslab_Data_Js_Cache::STATUS_PENDING );
		$js->update();    // lock the entry, so no other process will start working on it

		return $this->download( $js );
	}

	private function download( Urlslab_Data_Js_Cache $js ) {
		$page_content_file_name = null;
		try {
			$page_content_file_name = download_url( $js->get_url_object()->get_url_with_protocol() );
			if ( is_wp_error( $page_content_file_name ) || empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$js->set_status( Urlslab_Data_Js_Cache::STATUS_DISABLED );
				$js->set_js_content( '' );
			} else {
				/** @var Urlslab_Widget_Html_Optimizer $widget */
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG );

				$js->set_status( Urlslab_Data_Js_Cache::STATUS_ACTIVE );

				// Adjusting the links in the css based on the settings
				$js_page_content = file_get_contents( $page_content_file_name );
				if ( $widget->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_JS_MINIFICATION ) ) {
					$minifier        = new \MatthiasMullie\Minify\JS( $js_page_content );
					$js_page_content = $minifier->minify();
				}
				$js->set_js_content( $js_page_content );
			}
		} catch ( Exception $e ) {
			$js->set_status( Urlslab_Data_Js_Cache::STATUS_DISABLED );
			$js->set_js_content( '' );
		}
		if ( is_string( $page_content_file_name ) && file_exists( $page_content_file_name ) ) {
			unlink( $page_content_file_name );
		}

		return $js->update();
	}
}
