<?php

class Urlslab_Api_Roles extends Urlslab_Api_Base {
	public function register_routes() {
		$base = '/permission';
		register_rest_route(
			self::NAMESPACE,
			$base . '/role',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_roles' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/capabilities',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_capabilities' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}



	public function get_capabilities( $request ) {
		global $wp_roles;
		$all_capabilities = array();

		// Loop through all roles
		foreach ( $wp_roles->roles as $role_key => $role ) {
			foreach ( $role['capabilities'] as $capability => $value ) {
				$all_capabilities[ $capability ] = (object) array( 'capability' => $capability );
			}
		}

		return new WP_REST_Response( array_values( $all_capabilities ), 200 );
	}

	public function get_roles( $request ) {
		global $wp_roles;
		$all_roles = array();

		// Loop through all roles
		foreach ( $wp_roles->roles as $role_key => $role ) {
			$all_roles[] = (object) array(
				'role_key' => $role_key,
				'role'     => $role,
			);
		}

		return new WP_REST_Response( $all_roles, 200 );
	}


}
