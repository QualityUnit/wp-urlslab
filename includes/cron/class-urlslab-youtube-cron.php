<?php

use OpenAPI\Client\Urlslab\ContentApi;
use OpenAPI\Client\Configuration;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Youtube_Cron extends Urlslab_Cron {

	private \OpenAPI\Client\Urlslab\VideoApi $content_client;

	public function get_description(): string {
		return __( 'Loading microdata about scheduled YouTube videos used in your website', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Lazy_Loading::SLUG ) ) {
			return false;
		}
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Lazy_Loading::SLUG );
		if ( ! $widget->get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING ) || ! $this->init_client() ) {
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

		if ( ! strlen( $youtube_obj->get_microdata() ) ) {
			try {
				$microdata = $this->get_youtube_microdata( $youtube_obj );
				if ( strlen( $microdata ) ) {
					$youtube_obj->set_microdata( $microdata );
					$obj_microdata = json_decode( $microdata, true );
					if ( ! is_array( $obj_microdata ) || ! isset( $obj_microdata['items'] ) || ! isset( $obj_microdata['items'][0] ) ) {
						$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_DISABLED );
						$youtube_obj->update();

						return true;
					}
					$youtube_obj->update();
				}
			} catch ( \OpenAPI\Client\ApiException $e ) {
				if ( 402 === $e->getCode() ) {
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
				}

				return false;
			} catch ( Exception $e ) {
				return false;
			}
		}
		if ( ! strlen( $youtube_obj->get_captions() ) ) {
			try {
				$captions = $this->get_youtube_captions( $youtube_obj );
				$youtube_obj->set_captions( '' );
				if ( strlen( $captions ) > 10 ) {
					$youtube_obj->set_captions( $captions );
				} else if ( false === $captions ) {
					if ( strlen( $youtube_obj->get_microdata() ) ) {
						$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
					} else {
						$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_DISABLED );
					}
					$youtube_obj->update();

					return true;
				}
			} catch ( \OpenAPI\Client\ApiException $e ) {
				if ( 402 === $e->getCode() ) {
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
				}

				return false;
			}
		}
		if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
			$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
		}
		$youtube_obj->update();

		return true;
	}


	private function get_youtube_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$response = $this->content_client->getYTMicrodata( $youtube_obj->get_video_id() );

		return $response->getRawData();
	}

	private function init_client(): bool {
		if ( empty( $this->content_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new \OpenAPI\Client\Urlslab\VideoApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}


	private function get_youtube_captions( Urlslab_Youtube_Row $youtube_obj ) {
		$response = $this->content_client->getYTVidCaption( $youtube_obj->get_video_id() );
		switch ( $response->getStatus() ) {
			case \OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse::STATUS_AVAILABLE:
				return $response->getTranscript();
			case \OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse::STATUS_PENDING:
				return true;
			default:
				return false;
		}
	}
}
