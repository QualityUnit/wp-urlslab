<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\VideoApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Connection_Youtube {

	private static Urlslab_Connection_Youtube $instance;
	private static VideoApi $video_client;

	public static function get_instance(): Urlslab_Connection_Youtube {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$video_client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
            self::$video_client = new VideoApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore
			return ! empty( self::$video_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );

	}

	private function get_yt_microdata_from_db( string $yt_id ) {
		global $wpdb;
		return $wpdb->get_row(
			$wpdb->prepare(
                'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE videoid = %s LIMIT 1', // phpcs:ignore
				$yt_id,
			),
			ARRAY_A
		);

	}

	public function get_yt_data( string $yt_id ) {
		$youtube_row = self::get_yt_microdata_from_db( $yt_id );

		if ( ! $youtube_row ) {
			global $wpdb;
			$query = 'INSERT INTO ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' (videoid, status, status_changed) VALUES (%s, %s, %s)';
            $rsp = $wpdb->query( $wpdb->prepare( $query, array($yt_id, Urlslab_Data_Youtube::STATUS_NEW, Urlslab_Data::get_now()) ) ); // phpcs:ignore
			return $this->get_yt_data( $yt_id );
		}

		$youtube_obj = new Urlslab_Data_Youtube( $youtube_row, true );

		try {
			if ( $youtube_obj->get_status() === Urlslab_Data_Youtube::STATUS_AVAILABLE ) {
				return $youtube_obj;
			}

			if ( $youtube_obj->get_status() === Urlslab_Data_Youtube::STATUS_DISABLED ) {
				return false;
			}

			if ( ! strlen( $youtube_obj->get_microdata() ) ) {
				$this->process_yt_microdata( $youtube_obj );
			}

			if ( ! strlen( $youtube_obj->get_captions() ) ) {
				$this->process_yt_captions( $youtube_obj );
			}

			if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
				$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_AVAILABLE );
			}

			$youtube_obj->update();
			return $youtube_obj;
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}
	}

	public function process_yt_microdata( Urlslab_Data_Youtube $youtube_obj ) {
		$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_PROCESSING );
		$youtube_obj->update();

		$microdata = $this->get_urlslab_youtube_microdata( $youtube_obj );
		if ( strlen( $microdata ) ) {
			$youtube_obj->set_microdata( $microdata );
			$obj_microdata = json_decode( $microdata, true );
			if ( ! is_array( $obj_microdata ) || ! isset( $obj_microdata['items'] ) || ! isset( $obj_microdata['items'][0] ) ) {
				$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_DISABLED );
				$youtube_obj->update();

				return true;
			}
			$youtube_obj->update();
		}
	}

	public function process_yt_captions( Urlslab_Data_Youtube $youtube_obj ) {
		$captions = $this->get_urlslab_youtube_captions( $youtube_obj );
		$youtube_obj->set_captions( '' );
		if ( strlen( $captions ) > 10 ) {
			$youtube_obj->set_captions( $captions );
		} else if ( false === $captions ) {
			if ( strlen( $youtube_obj->get_microdata() ) ) {
				$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_AVAILABLE );
			} else {
				$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_DISABLED );
			}
			$youtube_obj->update();

			return true;
		}
	}

	private function get_urlslab_youtube_captions( Urlslab_Data_Youtube $youtube_obj ) {
		$response = self::$video_client->getYTVidCaption( $youtube_obj->get_video_id() );
		switch ( $response->getStatus() ) {
			case DomainDataRetrievalVideoCaptionResponse::STATUS_AVAILABLE:
				return $response->getTranscript();
			case DomainDataRetrievalVideoCaptionResponse::STATUS_PENDING:
				return true;
			default:
				return false;
		}
	}

	private function get_urlslab_youtube_microdata( Urlslab_Data_Youtube $youtube_obj ) {
		$response = self::$video_client->getYTMicrodata( $youtube_obj->get_video_id() );

		return $response->getRawData();
	}



}
