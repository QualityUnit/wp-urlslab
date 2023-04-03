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
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'match_type'    => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return Urlslab_Redirect_Row::MATCH_TYPE_EXACT == $param || Urlslab_Redirect_Row::MATCH_TYPE_REGEXP == $param;
							},
						),
						'match_url'     => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'replace_url'   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'is_logged'     => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Redirect_Row::IS_LOGGED_NOT_CHECKED == $param ||
									   Urlslab_Redirect_Row::IS_LOGGED_LOGIN_REQUIRED == $param ||
									   Urlslab_Redirect_Row::IS_LOGGED_NOT_LOGGED == $param;
							},
						),
						'capabilities'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'browser'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'cookie'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'headers'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'params'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'redirect_code' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 300 <= $param && 400 > $param;
							},
						),
						'if_not_found'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return empty( $param ) || Urlslab_Redirect_Row::IF_NOT_FOUND == $param;
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
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
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'rows' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

	}

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(
				array(
					'filter_match_type'    => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_match_url'     => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_replace_url'   => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_is_logged'     => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_capabilities'  => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_browser'       => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_cookie'        => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_headers'       => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_params'        => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_if_not_found'  => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_cnt'           => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
					'filter_redirect_code' => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
				)
			),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
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
					'validate_callback' => function( $param ) {
						return Urlslab_Redirect_Row::MATCH_TYPE_EXACT == $param || Urlslab_Redirect_Row::MATCH_TYPE_REGEXP == $param;
					},
				),
				'match_url'     => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'replace_url'   => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'is_logged'     => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return Urlslab_Redirect_Row::IS_LOGGED_NOT_CHECKED == $param ||
							   Urlslab_Redirect_Row::IS_LOGGED_LOGIN_REQUIRED == $param ||
							   Urlslab_Redirect_Row::IS_LOGGED_NOT_LOGGED == $param;
					},
				),
				'capabilities'  => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'browser'       => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'cookie'        => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'headers'       => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'params'        => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'if_not_found'  => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return empty( $param ) || Urlslab_Redirect_Row::IF_NOT_FOUND == $param;
					},
				),
				'redirect_code' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_numeric( $param ) && 300 <= $param && 400 > $param;
					},
				),
			),
			'permission_callback' => array( $this, 'create_item_permissions_check' ),
		);
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->redirect_id = (int) $row->redirect_id;
			$row->redirect_code         = (int) $row->redirect_code;
			$row->cnt         = (int) $row->cnt;
		}

		return new WP_REST_Response( $rows, 200 );
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


	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Redirect_Row( $params );
	}

	function get_editable_columns(): array {
		return array(
			'match_type',
			'match_url',
			'replace_url',
			'is_logged',
			'capabilities',
			'browser',
			'cookie',
			'headers',
			'params',
			'if_not_found',
			'redirect_code',
		);
	}

	protected function on_items_updated( array $row = array() ) {
		Urlslab_Redirects::delete_cache();

		return parent::on_items_updated( $row );
	}
}
