<?php


use FlowHunt_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Cron_Youtube extends Urlslab_Cron {

	public function get_description(): string {
		return __( 'Loading microdata about scheduled YouTube videos used in your website', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Lazy_Loading::SLUG ) || ! Urlslab_Widget_General::is_flowhunt_configured() ) {
			return false;
		}
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Lazy_Loading::SLUG );
		if ( ! $widget->get_option( Urlslab_Widget_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING ) ) {
			return false;
		}

		global $wpdb;
		$youtube_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE status = %s OR (status=%s AND status_changed < %s) LIMIT 1', // phpcs:ignore
				Urlslab_Data_Youtube::STATUS_NEW,
				Urlslab_Data_Youtube::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 300 )
			),
			ARRAY_A
		);
		if ( empty( $youtube_row ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$youtube_obj = new Urlslab_Data_Youtube( $youtube_row, true );
		$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_PROCESSING );
		$youtube_obj->update();

		try {
			if ( ! strlen( $youtube_obj->get_microdata() ) ) {
				Urlslab_Connection_Youtube::get_instance()->process_yt_microdata( $youtube_obj );
			}

			return true;
		} catch ( ApiException $e ) {
			if ( 402 == $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 );
				$this->lock( 300, Urlslab_Cron::LOCK );
			} else if ( 404 == $e->getCode() ) {
				$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_DISABLED );
				$youtube_obj->update();

				return true;
			} else if ( 429 == $e->getCode() || 500 <= $e->getCode() ) {
				$this->lock( 60, Urlslab_Cron::LOCK );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}
	}
}
