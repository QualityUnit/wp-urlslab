<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Youtube_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		if ( ! get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING, false ) || 0 == strlen( $this->get_youtube_key() ) ) {
			return false;
		}

		global $wpdb;
		$youtube_row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE status = %s ORDER BY status_changed DESC LIMIT 1', Urlslab_Youtube_Row::STATUS_NEW ), ARRAY_A ); // phpcs:ignore
		if ( empty( $youtube_row ) ) {
			return false;
		}

		$youtube_obj = new Urlslab_Youtube_Row( $youtube_row, true );
		if ( $youtube_obj->get( 'status' ) != Urlslab_Youtube_Row::STATUS_NEW ) {
			return true;
		}

		$youtube_obj->set( 'status', Urlslab_Youtube_Row::STATUS_PROCESSING );
		$youtube_obj->update();

		$microdata = $this->get_youtube_microdata( $youtube_obj );
		if ( $microdata ) {
			//update status to active
			$youtube_obj->set( 'status', Urlslab_Youtube_Row::STATUS_AVAILABLE );
			$youtube_obj->set( 'microdata', $microdata );
			$youtube_obj->update();

			return true;
		} else {
			$youtube_obj->set( 'status', Urlslab_Youtube_Row::STATUS_NEW );
			$youtube_obj->update();

			//something went wrong, wait with next processing
			return false;
		}
	}

	private function get_youtube_key() {
		$key = get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY );
		if ( strlen( $key ) ) {
			return $key;
		}
		$key = env( 'YOUTUBE_API_KEY' );
		if ( strlen( $key ) ) {
			return $key;
		}

		return false;
	}

	private function get_youtube_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$url      = 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2CcontentDetails&contentDetails.duration&id=' . $youtube_obj->get( 'videoid' ) . '&key=' . $this->get_youtube_key(); // json source
		$response = wp_remote_get( $url, array( 'sslverify' => false ) );
		if ( ! is_wp_error( $response ) ) {
			$value = json_decode( $response['body'] );
			if ( property_exists( $value, 'error' ) ) {
				return false;
			}

			return $response['body'];
		}

		return false;
	}
}
