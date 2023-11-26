<?php

class Urlslab_Cron_Update_Backlinks extends Urlslab_Cron {
	public function get_description(): string {
		return __( 'Checking Backlinks status', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Link_Builder::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Link_Builder::SLUG );
		if ( ! $widget->get_option( Urlslab_Widget_Link_Builder::SETTING_NAME_BACKLINK_MONITORING ) ) {
			return false;
		}

		global $wpdb;
		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_BACKLINK_MONITORS_TABLE . ' WHERE updated<%s LIMIT 1', // phpcs:ignore
				Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_Widget_Link_Builder::SETTING_NAME_BACKLINK_MONITORING_INTERVAL ) * 24 * 3600 ),
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			//all processed
			$this->lock( 12000, Urlslab_Cron::LOCK );

			return false;
		}

		$backlink_object = new Urlslab_Data_Backlink_Monitor( $url_row );
		$backlink_object->set_updated( Urlslab_Data::get_now() );
		$backlink_object->update();

		$from_url = new Urlslab_Data_Url( array( 'url_id' => $backlink_object->get_from_url_id() ) );
		if ( $from_url->load() ) {
			$from_url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED );
			if ( $from_url->update() ) {
				return $from_url->update_http_response();
			}
		}

		return true;
	}

}
