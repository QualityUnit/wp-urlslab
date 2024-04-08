<?php

class Urlslab_Api_User_Info extends Urlslab_Api_Base {
	const SLUG = 'user-info';
	const URLSLAB_USER_INFO_SETTING = 'urlslab_user_info';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'onboarding_finished' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_bool( $param );
							},
						),
					),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		try {
			$user_info = $this->serialize_user_info( get_option( self::URLSLAB_USER_INFO_SETTING, array() ) );
			return new WP_REST_Response( (object) $user_info, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get user info', 'wp-urlslab' ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		try {
			add_option( self::URLSLAB_USER_INFO_SETTING, array(), '', 'no' );
			$user_info = $this->serialize_user_info( get_option( self::URLSLAB_USER_INFO_SETTING, array() ) );
			$user_info['onboarding_finished'] = $request->get_param( 'onboarding_finished' );
			update_option( self::URLSLAB_USER_INFO_SETTING, $user_info );

			return new WP_REST_Response( (object) $user_info, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'wp-urlslab' ), array( 'status' => 500 ) );
		}
	}

	private function serialize_user_info( $user_info ) {
		return array(
			'onboarding_finished' => $user_info['onboarding_finished'] ?? false,
		);
	}
}
