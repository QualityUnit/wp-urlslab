<?php

class Urlslab_Api_Redirects extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/redirects';
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				$this->get_route_get_items(),
				$this->get_route_create_item(),
			)
		);
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<redirect_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'match_type'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Redirect_Row::MATCH_TYPE_SUBSTRING == $param || Urlslab_Redirect_Row::MATCH_TYPE_EXACT == $param || Urlslab_Redirect_Row::MATCH_TYPE_REGEXP == $param;
							},
						),
						'match_url'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'replace_url'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'is_logged'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Redirect_Row::LOGIN_STATUS_ANY == $param || Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED == $param || Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN == $param;
							},
						),
						'capabilities'  => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'ip'  => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'roles'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'browser'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'cookie'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'headers'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'params'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'redirect_code' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param ) && 300 <= $param && 400 > $param;
							},
						),
						'if_not_found'  => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND == $param || Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND == $param || Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY == $param;
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/delete-all',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_all_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<redirect_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/import',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'import_items' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'rows' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
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

		register_rest_route(
			self::NAMESPACE,
			$base . '/roles',
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
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'match_type'    => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return Urlslab_Redirect_Row::MATCH_TYPE_SUBSTRING == $param || Urlslab_Redirect_Row::MATCH_TYPE_EXACT == $param || Urlslab_Redirect_Row::MATCH_TYPE_REGEXP == $param;
					},
				),
				'match_url'     => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'replace_url'   => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'is_logged'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Redirect_Row::LOGIN_STATUS_ANY == $param || Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED == $param || Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN == $param;
					},
				),
				'capabilities'  => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'ip'  => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'roles'         => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'browser'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'cookie'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'headers'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'params'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'if_not_found'  => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND == $param || Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND == $param || Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY == $param;
					},
				),
				'redirect_code' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param ) && 300 <= $param && 400 > $param;
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->redirect_id = (int) $row->redirect_id;
			$row->redirect_code = (int) $row->redirect_code;
			$row->cnt = (int) $row->cnt;
		}

		return new WP_REST_Response( $rows, 200 );
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

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Redirect_Row( $params );
	}

	public function get_editable_columns(): array {
		return array(
			'match_type',
			'match_url',
			'replace_url',
			'is_logged',
			'capabilities',
			'ip',
			'roles',
			'browser',
			'cookie',
			'headers',
			'params',
			'if_not_found',
			'redirect_code',
		);
	}

	protected function get_items_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( $this->get_row_object()->get_table_name() );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_match_type' );
		$sql->add_filter( 'filter_match_url' );
		$sql->add_filter( 'filter_replace_url' );
		$sql->add_filter( 'filter_is_logged' );
		$sql->add_filter( 'filter_capabilities' );
		$sql->add_filter( 'filter_ip' );
		$sql->add_filter( 'filter_roles' );
		$sql->add_filter( 'filter_browser' );
		$sql->add_filter( 'filter_cookie' );
		$sql->add_filter( 'filter_headers' );
		$sql->add_filter( 'filter_params' );
		$sql->add_filter( 'filter_if_not_found' );
		$sql->add_filter( 'filter_cnt', '%d' );
		$sql->add_filter( 'filter_redirect_code', '%d' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}

		$sql->add_order( 'redirect_id' );

		return $sql;
	}

	protected function on_items_updated( array $row = array() ) {
		Urlslab_Redirects::delete_cache();

		return parent::on_items_updated( $row );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( Urlslab_Redirect_Row::MATCH_TYPE_REGEXP == $row->get_public( 'match_type' ) ) {
			@preg_match( '|' . str_replace( '|', '\\|', $row->get_public( 'match_url' ) ) . '|uim', 'any text to match' );
			if ( PREG_NO_ERROR !== preg_last_error() ) {
				throw new Exception( __( 'Invalid regular expression', 'urlslab' ) );
			}
		}
	}

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(
				array(
					'filter_match_type'    => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_match_url'     => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_replace_url'   => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_is_logged'     => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_capabilities'  => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_ip'  => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_roles'         => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_browser'       => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_cookie'        => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_headers'       => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_params'        => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_if_not_found'  => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_cnt'           => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
					'filter_redirect_code' => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
				)
			),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}
}
