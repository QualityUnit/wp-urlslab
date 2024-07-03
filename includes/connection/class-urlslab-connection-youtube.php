<?php


use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\VideosApi;
use FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatuses;
use FlowHunt_Vendor\OpenAPI\Client\Model\YoutubeTranscriptRequest;

class Urlslab_Connection_Youtube {

	private static Urlslab_Connection_Youtube $instance;
	private static VideosApi $video_client;

	public static function get_instance(): Urlslab_Connection_Youtube {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$video_client ) && Urlslab_Widget_General::is_urlslab_configured() ) {
            self::$video_client = new VideosApi( new Client(), Urlslab_Connection_FlowHunt::getConfiguration() ); //phpcs:ignore
			return ! empty( self::$video_client );
		}

		throw new ApiException( esc_html( __( 'Not Enough Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
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
            $wpdb->query( $wpdb->prepare( $query, array($yt_id, Urlslab_Data_Youtube::STATUS_NEW, Urlslab_Data::get_now()) ) ); // phpcs:ignore
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

			return $youtube_obj;
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 );
			}

			return false;
		} catch ( Exception $e ) {
			return false;
		}
	}

	public function process_yt_microdata( Urlslab_Data_Youtube $youtube_obj ): bool {
		$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_PROCESSING );
		$youtube_obj->update();

		try {
			$response = self::$video_client->getYoutubeTranscript( Urlslab_Connection_FlowHunt::getWorkspaceId(), new YoutubeTranscriptRequest( array( 'video_id' => $youtube_obj->get_video_id() ) ) );
			switch ( $response->getStatus() ) {
				case TaskStatuses::SUCCESS:
					$youtube_obj->set_microdata( json_encode( $response->getResult() ) );
					$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_AVAILABLE );
					$youtube_obj->update();
					return true;
				case TaskStatuses::PENDING:
					return true;
				default:
			}
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 429:
					return false;
				case 404:
					$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_DISABLED );
					$youtube_obj->update();
					return false;
				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 ); //continue
					return false;

				default:
			}
		}
		$youtube_obj->set_status( Urlslab_Data_Youtube::STATUS_DISABLED );
		$youtube_obj->update();
		return false;
	}
}
