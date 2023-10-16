<?php

class Urlslab_Api_Permissions extends Urlslab_Api_Base {
	const SLUG = 'permission';

	public function register_routes() {
		$base = '/' . self::SLUG;
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

		register_rest_route(
			self::NAMESPACE,
			$base . '/user',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_users' ),
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
						'update_item_permissions_check',
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
			$base . '/user/(?P<user_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_user_permissions' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'capabilities' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param ) || empty( $param );
							},
						),
						'roles'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param ) || empty( $param );
							},
						),
					),
				),
			)
		);
	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function create_role( WP_REST_Request $request ) {
		$capabilities = array();
		foreach ( $request->get_json_params()['capabilities'] as $capability_id ) {
			$capabilities[ $capability_id ] = true;
		}
		$role = add_role( $request->get_json_params()['role_id'], $request->get_json_params()['role_name'], $capabilities );//phpcs:ignore
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
			$role = add_role( $request->get_param( 'role_id' ), $request->get_json_params()['role_name'], $capabilities );//phpcs:ignore
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

	public function get_users( WP_REST_Request $request ) {
		$users = get_users();

		$resultset = array();
		foreach ( $users as $user_id => $user ) {
			$resultset[] = (object) array(
				'user_id'             => $user_id,
				'user_login'          => $user->user_login,
				'user_email'          => $user->data->user_email,
				'user_status'         => $user->data->user_status,
				'display_name'        => $user->data->display_name,
				'roles'               => (array) $user->roles,
				'custom_capabilities' => array_keys( $user->caps ),
				'all_capabilities'    => array_keys( $user->allcaps ),
			);
		}

		return new WP_REST_Response( $resultset, 200 );
	}

	public function update_user_permissions( WP_REST_Request $request ) {
		$user = get_user_by( 'id', $request->get_param( 'user_id' ) );
		if ( $user ) {
			if ( isset( $request->get_json_params()['roles'] ) ) {
				foreach ( $user->roles as $role ) {
					if ( ! in_array( $role, $request->get_json_params()['roles'] ) ) {
						$user->remove_role( $role );
					}
				}

				foreach ( $request->get_json_params()['roles'] as $role ) {
					if ( ! in_array( $role, $user->roles ) ) {
						$user->add_role( $role );
					}
				}
			}
			if ( isset( $request->get_json_params()['capabilities'] ) ) {
				$user_capabilities = array_keys( $user->caps );
				foreach ( $user_capabilities as $capability ) {
					if ( ! in_array( $capability, $request->get_json_params()['capabilities'] ) && ! in_array( $capability, $user->roles ) ) {
						$user->remove_cap( $capability );
					}
				}

				foreach ( $request->get_json_params()['capabilities'] as $capability ) {
					if ( ! isset( $user->caps[ $capability ] ) ) {
						$user->add_cap( $capability );
					}
				}
			}
		} else {
			return new WP_REST_Response( __( 'User not found' ), 404 );
		}

		return new WP_REST_Response( $user, 200 );
	}

}
