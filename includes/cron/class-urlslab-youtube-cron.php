<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Youtube_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		if ( ! get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING, false ) || 0 == strlen( $this->get_youtube_key() ) ) {
			return false;
		}

		global $wpdb;
		$youtube_row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE status = %s LIMIT 1', Urlslab_Youtube_Data::YOUTUBE_NEW ), ARRAY_A ); // phpcs:ignore
		if ( empty( $youtube_row ) ) {
			return false;
		}

		$youtube_obj = new Urlslab_Youtube_Data( $youtube_row );
		if ( $youtube_obj->get_status() != Urlslab_Youtube_Data::YOUTUBE_NEW ) {
			return true;
		}

		//update status to processing
		$wpdb->update(
			URLSLAB_YOUTUBE_CACHE_TABLE,
			array(
				'status' => Urlslab_Youtube_Data::YOUTUBE_PROCESSING,
			),
			array(
				'videoid' => $youtube_obj->get_videoid(),
				'status'  => Urlslab_Youtube_Data::YOUTUBE_NEW,
			)
		);

		$microdata = $this->get_youtube_microdata( $youtube_obj );
		if ( $microdata ) {
			//update status to active
			$wpdb->update(
				URLSLAB_YOUTUBE_CACHE_TABLE,
				array(
					'status'    => Urlslab_Youtube_Data::YOUTUBE_AVAILABLE,
					'microdata' => $microdata,
				),
				array(
					'videoid' => $youtube_obj->get_videoid(),
				)
			);
		} else {
			$wpdb->update(
				URLSLAB_YOUTUBE_CACHE_TABLE,
				array(
					'status' => Urlslab_Youtube_Data::YOUTUBE_NEW,
				),
				array(
					'videoid' => $youtube_obj->get_videoid(),
					'status'  => Urlslab_Youtube_Data::YOUTUBE_PROCESSING,
				)
			);

			//something went wrong, wait with next processing
			return false;
		}

		return true;
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

	private function get_youtube_microdata( Urlslab_Youtube_Data $youtube_obj ) {
		$url      = 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2CcontentDetails&contentDetails.duration&id=' . $youtube_obj->get_videoid() . '&key=' . $this->get_youtube_key(); // json source
		$response = wp_remote_get( $url, array( 'sslverify' => false ) );
		if ( ! is_wp_error( $response ) ) {
			$value = json_decode( $response['body'] );
			if ( property_exists( $value, 'error' ) ) {
				//TODO log debug message
				return false;
			}

			return $response['body'];
		}

		return false;
	}
}
