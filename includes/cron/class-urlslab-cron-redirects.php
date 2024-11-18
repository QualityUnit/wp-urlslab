<?php

use FlowHunt_Vendor\FlowHunt\ApiException;
use FlowHunt_Vendor\FlowHunt\Model\PointerType;
use FlowHunt_Vendor\FlowHunt\Model\VectorDocumentType;

class Urlslab_Cron_Redirects extends Urlslab_Cron {

	public function get_description(): string {
		return __( 'Calculating AI redirects', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Redirects::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG )->get_option( Urlslab_Widget_Redirects::SETTING_NAME_AI_REDIRECTS )
			 || empty( Urlslab_Connection_Related_Urls::get_instance() )
		) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_NOT_FOUND_LOG_TABLE . ' WHERE updated>%s AND cnt>%d AND status=%s LIMIT 1', // phpcs:ignore
				Urlslab_Data::get_now( time() - 3600 ), //just if 404 happen in the last hour
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG )->get_option( Urlslab_Widget_Redirects::SETTING_NAME_MIN_404_COUNT ), // retry if scheduled
				Urlslab_Data_Not_Found_Log::STATUS_NEW, // retry if scheduled
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );
			return false;
		}

		$url = new Urlslab_Data_Not_Found_Log( $url_row );
		$url->set_status( Urlslab_Data_Not_Found_Log::STATUS_PENDING );
		$url->update();

		if ( $this->is_valid_url( $url ) ) {
			return $this->compute_redirect( $url );
		}

		return true;
	}

	private function compute_redirect( Urlslab_Data_Not_Found_Log $url ) {
		$url_obj = new Urlslab_Url( $url->get_url(), true );

		try {
			$urls = Urlslab_Connection_Related_Urls::get_instance()->get_related_urls_to_query( $url_obj->get_url(), 1, VectorDocumentType::U, PointerType::U );

			if ( empty( $urls ) ) {
				return true;
			}
			foreach ( $urls as $new_url ) {
				return $this->create_redirect( $url, $new_url );
			}
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 );
					//continue
				case 429:
					$url->set_status( Urlslab_Data_Not_Found_Log::STATUS_NEW );
					$url->update();
					break;
				default:
			}
		}

		return false;
	}

	private function create_redirect( Urlslab_Data_Not_Found_Log $url, string $dest_url ) {

		$redirect = new Urlslab_Data_Redirect();
		$redirect->set_redirect_code( 301 );
		$redirect->set_if_not_found( Urlslab_Data_Redirect::NOT_FOUND_STATUS_NOT_FOUND );
		$redirect->set_is_logged( Urlslab_Data_Redirect::LOGIN_STATUS_NOT_LOGGED_IN );
		$redirect->set_match_type( Urlslab_Data_Redirect::MATCH_TYPE_EXACT );
		$redirect->set_match_url( $url->get_url() );

		$url_obj = new Urlslab_Url( $dest_url, true );
		$redirect->set_replace_url( $url_obj->get_url_with_protocol() );

		if ( $redirect->insert() ) {
			$url->set_status( Urlslab_Data_Not_Found_Log::STATUS_REDIRECT );
			$url->update();

			return true;
		}

		return false;
	}

	private function is_valid_url( Urlslab_Data_Not_Found_Log $url ) {
		return ! preg_match( '/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif|js|map|css)/i', $url->get_url() );
	}
}
