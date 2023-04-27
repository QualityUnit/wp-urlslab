<?php

use OpenAPI\Client\Configuration;

class Urlslab_Api_Billing extends Urlslab_Api_Base {
	public function register_routes() {
		$base = '/billing';

		register_rest_route( self::NAMESPACE, $base . '/credits', $this->read_arguments( 'get_credits' ) );
		register_rest_route( self::NAMESPACE, $base . '/credits/events', $this->read_arguments( 'get_credit_events' ) );
		register_rest_route( self::NAMESPACE, $base . '/credits/aggregation', $this->read_arguments( 'get_credit_aggregation' ) );
	}

	private function read_arguments( string $method_name ) {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, $method_name ),
				'args'                => array(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	public function get_credits( WP_REST_Request $request ) {
		try {
			$credit = $this->get_client()->getLastCreditStatus();

			return new WP_REST_Response( $credit, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	public function get_credit_events( WP_REST_Request $request ) {
		try {
			$credit_events = $this->get_client()->getCreditEvents();

			return new WP_REST_Response( $credit_events, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	public function get_credit_aggregation( WP_REST_Request $request ) {
		try {
			$credit_aggregation = $this->get_client()->getCreditEventsAggregation();

			return new WP_REST_Response( $credit_aggregation, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	private function get_client(): \OpenAPI\Client\Urlslab\CreditsApi {
		if ( ! strlen( get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) ) {
			throw new Exception( 'Urlslab API key not defined' );
		}

		return new \OpenAPI\Client\Urlslab\CreditsApi( new GuzzleHttp\Client(), Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) );
	}
}
