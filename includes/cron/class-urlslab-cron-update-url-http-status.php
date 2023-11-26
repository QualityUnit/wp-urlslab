<?php

class Urlslab_Cron_Update_Url_Http_Status extends Urlslab_Cron {
	const VALIDATION_UNTIL = 'urlslab_validation_until_timestamp';

	public function get_description(): string {
		return __( 'Checking HTTP status of scheduled URLs in the plugin database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Urls::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG );
		if ( ! $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_VALIDATE_LINKS ) ) {
			return false;
		}

		if ( ! get_transient( self::VALIDATION_UNTIL ) ) {
			set_transient( self::VALIDATION_UNTIL, time() - $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) );
		}


		global $wpdb;
		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = %d OR (http_status > 0 AND update_http_date < %s) OR (http_status = %d AND update_http_date < %s) LIMIT 1', // phpcs:ignore
				Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED,
				Urlslab_Data::get_now( get_transient( self::VALIDATION_UNTIL ) ),                                                                  // PENDING urls will be retried in one hour again
				Urlslab_Data_Url::HTTP_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			//all processed
			set_transient( self::VALIDATION_UNTIL, time() - $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) );
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$url = new Urlslab_Data_Url( $url_row );

		if ( ! $url->get_url()->is_url_valid() ) {
			$url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_CLIENT_ERROR );
			$url->update();

			return true;
		}

		if ( $url->get_url()->is_blacklisted() ) {
			$url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_OK );
			$url->update();

			return true;
		}

		if ( ! strlen( trim( $url->get_url_title() ) ) ) {
			$url->set_url_title( Urlslab_Data_Url::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_h1() ) ) ) {
			$url->set_url_h1( Urlslab_Data_Url::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_meta_description() ) ) ) {
			$url->set_url_meta_description( Urlslab_Data_Url::VALUE_EMPTY );
		}
		$url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_PENDING );
		$url->update();    // lock the entry, so no other process will start working on it

		return $url->update_http_response();
	}

}
