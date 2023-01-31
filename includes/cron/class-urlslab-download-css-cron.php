<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-css-cache-row.php';

class Urlslab_Download_CSS_Cron extends Urlslab_Cron {

	private Urlslab_CSS_Optimizer $widget;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ) {
		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DELETE ' . URLSLAB_CSS_CACHE_TABLE . " WHERE status IN (%s, %s) AND status_changed < %s", // phpcs:ignore
				array(
					Urlslab_CSS_Cache_Row::STATUS_DISABLED,
					Urlslab_CSS_Cache_Row::STATUS_ACTIVE,
					Urlslab_CSS_Cache_Row::get_now( time() - $this->widget->get_option( Urlslab_CSS_Optimizer::SETTING_NAME_CSS_CACHE_TTL ) ),
				),
			)
		);
		parent::cron_exec( $max_execution_time );
	}

	protected function execute(): bool {
		global $wpdb;

		$this->widget = Urlslab_Available_Widgets::get_instance()->get_widget( Urlslab_CSS_Optimizer::SLUG );


		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_CSS_CACHE_TABLE . " WHERE status=%s OR ( status= %s AND status_changed < %s) ORDER BY status_changed LIMIT 1", // phpcs:ignore
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
		$css->set( 'status', Urlslab_CSS_Cache_Row::STATUS_PENDING );
		$css->set( 'status_changed', Urlslab_CSS_Cache_Row::get_now() );
		$css->update();    //lock the entry, so no other process will start working on it

		return $this->download( $css );
	}

	private function download( Urlslab_CSS_Cache_Row $css ) {
		$css->set( 'status_changed', Urlslab_CSS_Cache_Row::get_now() );
		try {
			$page_content_file_name = download_url( $css->get_url()->get_url_with_protocol() );
			if ( is_wp_error( $page_content_file_name ) || empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
				$css->set( 'status', Urlslab_CSS_Cache_Row::STATUS_DISABLED );
				$css->set( 'filesize', 0 );
				$css->set( 'css_content', '' );
			} else {
				if ( $this->widget->get_option( Urlslab_CSS_Optimizer::SETTING_NAME_CSS_MAX_SIZE ) < filesize( $page_content_file_name ) ) {
					$css->set( 'status', Urlslab_CSS_Cache_Row::STATUS_DISABLED );
					$css->set( 'filesize', filesize( $page_content_file_name ) );
				} else {
					$css->set( 'status', Urlslab_CSS_Cache_Row::STATUS_ACTIVE );
					$css->set( 'filesize', filesize( $page_content_file_name ) );
					$css->set( 'css_content', file_get_contents( $page_content_file_name ) );
				}
			}
		} catch ( Exception $e ) {
			$css->set( 'status', Urlslab_CSS_Cache_Row::STATUS_DISABLED );
			$css->set( 'filesize', 0 );
			$css->set( 'css_content', '' );
		}
		if ( file_exists( $page_content_file_name ) ) {
			unlink( $page_content_file_name );
		}

		return $css->update();
	}
}
