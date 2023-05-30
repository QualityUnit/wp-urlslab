<?php

use OpenAPI\Client\Configuration;

class Urlslab_Api_Billing extends Urlslab_Api_Base {
	const SLUG = 'billing';

	public function register_routes() {
		$base = '/' . self::SLUG;

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
			Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, $credit->getCredits() );

			return new WP_REST_Response( $credit, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	public function get_credit_events( WP_REST_Request $request ) {
		try {
			$credit_events = $this->get_client()->getCreditEvents( 500 );

			$events = $credit_events->getEvents();
			foreach ( $events as $id => $event ) {
				$event->setOperationDate( date( 'Y-m-d H:i:s', $event->getOperationDate() ) ); //phpcs:ignore
				try {
					if ( is_string( $event->getUrl() ) ) {
						$url_obj = new Urlslab_Url( $event->getUrl(), true );
						$event->setUrl( $url_obj->get_url_with_protocol() );
					}
				} catch ( Exception $e ) {
				}
			}

			return new WP_REST_Response( $events, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	public function get_credit_aggregation( WP_REST_Request $request ) {
		try {
			$credit_aggregations = $this->get_client()->getCreditEventsAggregation();
			foreach ( $credit_aggregations->getData() as $id => $credit_aggregation ) {
				$credit_aggregation->setGroupBucketTitle( date( 'Y-m-d', strtotime( $credit_aggregation->getGroupBucketTitle() ) ) ); //phpcs:ignore
			}

			return new WP_REST_Response( $credit_aggregations->getData(), 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	private function get_client(): \OpenAPI\Client\Urlslab\CreditsApi {
		if ( ! strlen( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) ) {
			throw new Exception( 'Urlslab API key not defined' );
		}

		return new \OpenAPI\Client\Urlslab\CreditsApi( new GuzzleHttp\Client(), Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) );
	}
}
