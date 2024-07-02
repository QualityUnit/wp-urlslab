<?php

use OpenAPI\Client\Configuration;
use OpenAPI\Client\Flowhunt\CreditsApi;
use OpenAPI\Client\Model\CreditDailyTransactionSearchRequest;
use OpenAPI\Client\Model\CreditTransactionSearchRequest;

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
			$credit = $this->get_client()->getCreditBalance();
			Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, $credit->getCredits() );
			$credit['credits'] = round( $credit['credits'] / 1000000, 2 );

			return new WP_REST_Response( $credit, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	public function get_credit_events( WP_REST_Request $request ) {
		try {
			$result = $this->get_client()->searchCreditTransactions(
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_WORKSPACE_ID ),
				new CreditTransactionSearchRequest( array( 'limit' => 500 ) )
			);
			foreach ( $result as $key => $value ) {
				$result[ $key ]->amount = $value->amount / 1000000;
			}

			return new WP_REST_Response( $result, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	public function get_credit_aggregation( WP_REST_Request $request ) {
		try {
			$credit_aggregations = $this->get_client()->searchDailyCreditTransactions(
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_WORKSPACE_ID ),
				new CreditDailyTransactionSearchRequest( array( 'limit' => 500 ) )
			);

			foreach ( $credit_aggregations as $key => $value ) {
				$credit_aggregations[ $key ]->amount = round( $value->amount / 1000000, 2 );
			}

			return new WP_REST_Response( $credit_aggregations, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}


	private function get_client(): CreditsApi {
		return new CreditsApi( new GuzzleHttp\Client(), Urlslab_Connection_Flowhunt::getConfiguration() );
	}
}
