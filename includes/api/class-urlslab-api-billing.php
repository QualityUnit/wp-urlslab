<?php

use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\FlowHunt\Api\CreditsApi;

class Urlslab_Api_Billing extends Urlslab_Api_Base {
	const SLUG = 'billing';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/credits', $this->read_arguments( 'get_credits' ) );
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
			$credit = $this->get_client()->getWorkspaceCreditBalance( Urlslab_Connection_FlowHunt::get_workspace_id() );
			Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, $credit->getCredits() );
			$credit['credits'] = round( $credit['credits'] / 1000000, 2 );

			return new WP_REST_Response( $credit, 200 );
		} catch ( Throwable $e ) {
			new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	private function get_client(): CreditsApi {
		return new CreditsApi( new Client(), Urlslab_Connection_FlowHunt::get_configuration() );
	}
}
