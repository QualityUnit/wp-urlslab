<?php

use OpenAPI\Client\ApiException;
use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\DomainDataRetrievalContentQuery;
use OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest;
use OpenAPI\Client\Urlslab\ContentApi;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Redirects_Cron extends Urlslab_Cron {
	private ContentApi $content_client;

	public function get_description(): string {
		return __( 'Calculating AI redirects', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Redirects::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Redirects::SLUG )->get_option( Urlslab_Redirects::SETTING_NAME_AI_REDIRECTS )
			 || ! $this->init_content_client()
		) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_NOT_FOUND_LOG_TABLE . ' WHERE cnt>%d AND status=%s LIMIT 1', // phpcs:ignore
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Redirects::SLUG )->get_option( Urlslab_Redirects::SETTING_NAME_MIN_404_COUNT ), // retry if scheduled
				Urlslab_Not_Found_Log_Row::STATUS_NEW, // retry if scheduled
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Not_Found_Log_Row( $url_row );
		$url->set_status( Urlslab_Not_Found_Log_Row::STATUS_PENDING );
		$url->update();

		if ( $this->is_valid_url( $url ) ) {
			return $this->compute_redirect( $url );
		}

		return true;
	}

	private function init_content_client(): bool {
		if ( empty( $this->content_client ) ) {
			$api_key = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			if ( strlen( $api_key ) ) {
				$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
				$this->content_client = new ContentApi( new GuzzleHttp\Client(), $config );
			}
		}

		return ! empty( $this->content_client );
	}

	private function compute_redirect( Urlslab_Not_Found_Log_Row $url ) {

		$url_obj = new Urlslab_Url( $url->get_url(), true );

		$request = new DomainDataRetrievalRelatedUrlsRequest();
		$request->setChunkLimit( 1 );
		$request->setRenewFrequency( DomainDataRetrievalRelatedUrlsRequest::RENEW_FREQUENCY_ONE_TIME );

		$query = new DomainDataRetrievalContentQuery();
		$query->setLimit( 1 );

		$query->setDomains( array( $url_obj->get_domain_name() ) );
		$request->setQuery( $url->get_url() );
		$request->setFilter( $query );

		try {
			$response = $this->content_client->getRelatedUrls( $request );
			if ( empty( $response->getUrls() ) ) {
				return true;
			}
			foreach ( $response->getUrls() as $chunk ) {
				foreach ( $chunk as $dest_url ) {
					return $this->create_redirect( $url, $dest_url );
				}
			}
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 429:
					$url->set_status( Urlslab_Not_Found_Log_Row::STATUS_NEW );
					$url->update();
					break;
				default:
			}
		}

		return false;
	}

	private function create_redirect( Urlslab_Not_Found_Log_Row $url, string $dest_url ) {

		$redirect = new Urlslab_Redirect_Row();
		$redirect->set_redirect_code( 301 );
		$redirect->set_if_not_found( Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND );
		$redirect->set_is_logged( Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN );
		$redirect->set_match_type( Urlslab_Redirect_Row::MATCH_TYPE_EXACT );
		$redirect->set_match_url( $url->get_url() );

		$url_obj = new Urlslab_Url( $dest_url, true );
		$redirect->set_replace_url( $url_obj->get_url_with_protocol() );

		if ( $redirect->insert() ) {
			$url->set_status( Urlslab_Not_Found_Log_Row::STATUS_REDIRECT );
			$url->update();

			return true;
		}

		return false;
	}

	private function is_valid_url( Urlslab_Not_Found_Log_Row $url ) {
		return ! preg_match( '/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif|js|map)/i', $url->get_url() );
	}

}
