<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\VideoApi;
use Urlslab_Vendor\GuzzleHttp;

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
		if ( ! $widget->get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING ) ) {
			return false;
		}

		global $wpdb;
		$youtube_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE status = %s OR (status=%s AND status_changed < %s) ORDER BY status_changed DESC LIMIT 1', // phpcs:ignore
				Urlslab_Youtube_Row::STATUS_NEW,
				Urlslab_Youtube_Row::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $youtube_row ) ) {
			return false;
		}

		$youtube_obj = new Urlslab_Youtube_Row( $youtube_row, true );
		$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_PROCESSING );
		$youtube_obj->update();

		try {
			if ( ! strlen( $youtube_obj->get_microdata() ) ) {
				Urlslab_Yt_Helper::get_instance()->process_yt_microdata( $youtube_obj );
			}
			if ( ! strlen( $youtube_obj->get_captions() ) ) {
				Urlslab_Yt_Helper::get_instance()->process_yt_captions( $youtube_obj );
			}
			if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
				$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
			}
			$youtube_obj->update();

			return true;
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}

	}

}
