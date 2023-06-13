<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\GuzzleHttp;

class Urlslab_Yt_Helper {

	private static Urlslab_Yt_Helper $instance;
	private static ContentApi $content_client;

	public static function get_instance(): Urlslab_Yt_Helper {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$content_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
            self::$content_client = new ContentApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore
		}

		return ! empty( self::$content_client );
	}

	private function get_yt_microdata_from_db( string $yt_id ) {
		global $wpdb;
		return $wpdb->get_row(
			$wpdb->prepare(
                'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE videoid = ? LIMIT 1', // phpcs:ignore
				$yt_id,
			),
			ARRAY_A
		);

	}

	public function get_yt_data( string $yt_id ) {
		$youtube_row = self::get_yt_microdata_from_db( $yt_id );
		$youtube_obj = new Urlslab_Youtube_Row( $youtube_row, true );

		if ( $youtube_obj->get_status() === Urlslab_Youtube_Row::STATUS_AVAILABLE ) {
			return true;
		}

		if ( $youtube_obj->get_status() === Urlslab_Youtube_Row::STATUS_DISABLED ) {
			return false;
		}

		if ( ! strlen( $youtube_obj->get_microdata() ) ) {
			$this->process_yt_microdata( $youtube_obj );
			if ( ! strlen( $youtube_obj->get_captions() ) ) {
				$this->process_yt_captions( $youtube_obj );
				if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
					$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
				}
				$youtube_obj->update();
				return true;
			}       
		}

		return false;
	}

	public function process_yt_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_PROCESSING );
		$youtube_obj->update();

		try {
			$microdata = $this->get_urlslab_youtube_microdata( $youtube_obj );
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
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}
	}

	public function process_yt_captions( Urlslab_Youtube_Row $youtube_obj ) {
		try {
			$captions = $this->get_urlslab_youtube_captions( $youtube_obj );
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
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			return false;
		}
	}

	private function get_urlslab_youtube_captions( Urlslab_Youtube_Row $youtube_obj ) {
		$response = self::$content_client->getYTVidCaption( $youtube_obj->get_video_id() );
		switch ( $response->getStatus() ) {
			case DomainDataRetrievalVideoCaptionResponse::STATUS_AVAILABLE:
				return $response->getTranscript();
			case DomainDataRetrievalVideoCaptionResponse::STATUS_PENDING:
				return true;
			default:
				return false;
		}
	}

	private function get_urlslab_youtube_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$response = self::$content_client->getYTMicrodata( $youtube_obj->get_video_id() );

		return $response->getRawData();
	}



}
