<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\VideoApi;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Yt_Helper {

	private static Urlslab_Yt_Helper $instance;
	private static VideoApi $video_client;

	public static function get_instance(): Urlslab_Yt_Helper {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$video_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
            self::$video_client = new VideoApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore
		}

		return ! empty( self::$video_client );
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
            $rsp = $wpdb->query( $wpdb->prepare( $query, array($yt_id, Urlslab_Youtube_Row::STATUS_NEW, Urlslab_Data::get_now()) ) ); // phpcs:ignore
			return $this->get_yt_data( $yt_id );
		}

		$youtube_obj = new Urlslab_Youtube_Row( $youtube_row, true );

		try {
			if ( $youtube_obj->get_status() === Urlslab_Youtube_Row::STATUS_AVAILABLE ) {
				return $youtube_obj;
			}

			if ( $youtube_obj->get_status() === Urlslab_Youtube_Row::STATUS_DISABLED ) {
				return false;
			}

			if ( ! strlen( $youtube_obj->get_microdata() ) ) {
				$this->process_yt_microdata( $youtube_obj );
			}

			if ( ! strlen( $youtube_obj->get_captions() ) ) {
				$this->process_yt_captions( $youtube_obj );
			}

			if ( strlen( $youtube_obj->get_captions() ) && strlen( $youtube_obj->get_microdata() ) ) {
				$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_AVAILABLE );
			}

			$youtube_obj->update();
			return $youtube_obj;
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}
	}

	public function process_yt_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$youtube_obj->set_status( Urlslab_Youtube_Row::STATUS_PROCESSING );
		$youtube_obj->update();

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
	}

	public function process_yt_captions( Urlslab_Youtube_Row $youtube_obj ) {
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
	}

	public function should_fetch_additional_data( Urlslab_Youtube_Row $youtube_obj, $show_topics, $show_summarization ) {
		return empty( $youtube_obj->get_video_summary() ) && ( $show_topics || $show_summarization );
	}

	public function get_default_yt_data_prompt( $language ): string {
		return "TASK: You are marketing specialist writing text for web page localized into $language. Analyze video captions and generate summary of video and 3 main topics discussed in video. Output summary and topics just in $language. OUTPUT FORMAT JSON: { \"video_summary\":\"300 words long summary of video in $language\", \"discussed_topics\": [\"topic1\", \"topic2\", \"topic3\"], \"language_code\": \"$language\" } ";
	}

	public function augment_yt_data( Urlslab_Youtube_Row $youtube_obj, $model, $prompt_text ) {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );
		if ( empty( $model ) ) {
			$aug_model = $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_GENERATOR_MODEL );
		} else {
			$aug_model = $model;
		}


		$aug_request = new DomainDataRetrievalAugmentRequest();
		$aug_request->setAugmentingModelName( $aug_model );

		if ( empty( $youtube_obj->get_captions() ) ) {
			throw new Exception( 'No captions available' );
		}

		$prompt = new DomainDataRetrievalAugmentPrompt();
		$prompt->setPromptTemplate( $prompt_text );
		$prompt->setDocumentTemplate( $youtube_obj->get_captions_as_text() );
		$prompt->setMetadataVars( array() );

		$aug_request->setPrompt( $prompt );
		$aug_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_NO_SCHEDULE );
		$response = Urlslab_Augment_Helper::get_instance()->augment( $aug_request );
		return $response->getResponse();
	}

	private function get_urlslab_youtube_captions( Urlslab_Youtube_Row $youtube_obj ) {
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

	private function get_urlslab_youtube_microdata( Urlslab_Youtube_Row $youtube_obj ) {
		$response = self::$video_client->getYTMicrodata( $youtube_obj->get_video_id() );

		return $response->getRawData();
	}



}
