<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Youtube_Cron extends Urlslab_Cron {
	public function get_description(): string {
		return __( 'Loading microdata about scheduled YouTube videos used in your website', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Lazy_Loading::SLUG ) ) {
			return false;
		}
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Lazy_Loading::SLUG );
		if ( ! $widget->get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING )
			 || (
				 0 == strlen( $widget->get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY ) ) &&
				 0 == strlen( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) )
			 )
		) {
			return false;
		}

		global $wpdb;
		$youtube_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE status = %s OR (status=%s AND status_changed < %s) ORDER BY status_changed DESC LIMIT 1', // phpcs:ignore
				Urlslab_Youtube_Row::STATUS_NEW,
				Urlslab_Youtube_Row::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 36000 )
			),
			ARRAY_A
		);
		if ( empty( $youtube_row ) ) {
			return false;
		}

		$youtube_obj = new Urlslab_Youtube_Row( $youtube_row, true );
		if ( Urlslab_Youtube_Row::STATUS_NEW != $youtube_obj->get_status() ) {
			return true;
		}

		$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_PROCESSING );
		$youtube_obj->update();

		if ( ! strlen( $youtube_obj->get_captions() ) ) {
			$captions = $this->get_youtube_captions( $youtube_obj );
			if ( $captions ) {
				$youtube_obj->set_captions( $captions );
			}
		}
		if ( ! strlen( $youtube_obj->get_microdata() ) ) {
			$microdata = $this->get_youtube_microdata( $youtube_obj );
			if ( $microdata ) {
				$youtube_obj->set_microdata( $microdata );
			}
		}
		if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
			$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
		} else {
			$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_PROCESSING );
		}
		$youtube_obj->update();

		// something went wrong, wait with next processing
		return false;
	}


	private function get_youtube_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		if ( strlen( $this->get_youtube_key() ) ) {
			$url      = 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2CcontentDetails&contentDetails.duration&id=' . $youtube_obj->get_video_id() . '&key=' . $this->get_youtube_key(); // json source
			$response = wp_remote_get( $url, array( 'sslverify' => false ) );
			if ( ! is_wp_error( $response ) ) {
				$value = json_decode( $response['body'] );
				if ( property_exists( $value, 'error' ) ) {
					return false;
				}

				return $response['body'];
			}
		}

		//TODO urlslab implementation

		return false;
	}


	private function get_youtube_captions( Urlslab_Youtube_Row $youtube_obj ) {
		return ' ';
	}
}
