<?php

class Urlslab_Api_Permissions extends Urlslab_Api_Base {
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
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_role' ),
					'permission_callback' => array(
						$this,
						'create_item_permissions_check',
					),
					'args'                => array(
						'role_id'      => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'role_name'    => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'capabilities' => array(
							'required'          => false,
							'default'           => array(),
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/role/(?P<role_id>[a-z0-9_]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_role' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_role' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(
						'role_name'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'capabilities' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param ) || empty( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/capability',
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


	public function create_role( WP_REST_Request $request ) {
		$capabilities = array();
		foreach ( $request->get_json_params()['capabilities'] as $capability_id ) {
			$capabilities[ $capability_id ] = true;
		}
		$role = add_role( $request->get_json_params()['role_id'], $request->get_json_params()['role_name'], $capabilities );
		if ( $role ) {
			return new WP_REST_Response( $role, 200 );
		} else {
			return new WP_REST_Response( 'Failed to create role', 500 );
		}
	}

	public function update_role( WP_REST_Request $request ) {
		$role = get_role( $request->get_param( 'role_id' ) );
		if ( empty( $role ) ) {
			return new WP_REST_Response( __( 'Role not found.' ), 404 );
		}

		if ( isset( $request->get_json_params()['role_name'] ) && $request->get_json_params()['role_name'] != $role->name ) {
			$capabilities = $role->capabilities;

			// Remove the old role
			remove_role( $request->get_param( 'role_id' ) );

			// Add the new role with the same capabilities as the old role
			$role = add_role( $request->get_param( 'role_id' ), $request->get_json_params()['role_name'], $capabilities );
		}

		if ( isset( $request->get_json_params()['capabilities'] ) ) {
			$capabilities = $request->get_json_params()['capabilities'];
			foreach ( $role->capabilities as $capability_id => $is_used ) {
				if ( ! in_array( $capability_id, $capabilities ) ) {
					$role->remove_cap( $capability_id );
				}
			}

			foreach ( $capabilities as $capability_id ) {
				if ( ! $role->has_cap( $capability_id ) ) {
					$role->add_cap( $capability_id, true );
				}
			}
		}


		return new WP_REST_Response( $role, 200 );
	}

	public function delete_role( WP_REST_Request $request ) {
		remove_role( $request->get_param( 'role_id' ) );

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	public function get_capabilities( WP_REST_Request $request ) {
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

	public function get_roles( WP_REST_Request $request ) {
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
