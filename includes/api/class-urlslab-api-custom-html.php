<?php

class Urlslab_Api_Custom_Html extends Urlslab_Api_Table {
	const SLUG = 'custom-html';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/columns', $this->get_columns_route( array( $this, 'get_sorting_columns' ) ) );

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
			$base . '/delete',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'delete_items' ),
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
			$base . '/(?P<rule_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'name'               => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_type'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Custom_Html::MATCH_TYPE_ALL == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_SUBSTRING == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_EXACT == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_REGEXP == $param;
							},
						),
						'match_url'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'is_logged'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Custom_Html::LOGIN_STATUS_ANY == $param || Urlslab_Data_Custom_Html::LOGIN_STATUS_LOGIN_REQUIRED == $param || Urlslab_Data_Custom_Html::LOGIN_STATUS_NOT_LOGGED_IN == $param;
							},
						),
						'match_capabilities' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_ip'           => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_roles'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_posttypes'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_browser'      => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_cookie'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_headers'      => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'match_params'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'labels'             => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'rule_order'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'is_active'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_bool( $param ) || is_string( $param );
							},
						),
						'add_http_headers'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'add_start_headers'  => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'add_end_headers'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'add_start_body'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'add_end_body'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'is_single'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_singular'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_attachment'      => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_page'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_home'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_front_page'      => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_category'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_search'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_tag'             => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_author'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_archive'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_sticky'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_tax'             => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_feed'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_paged'           => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
					),
				),
			)
		);
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION ) || current_user_can( 'administrator' );
	}

	public function create_item_permissions_check( $request ) {
		return $this->update_item_permissions_check( $request );
	}

	public function delete_item_permissions_check( $request ) {
		return $this->update_item_permissions_check( $request );
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'match_type'         => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Custom_Html::MATCH_TYPE_ALL == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_SUBSTRING == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_EXACT == $param || Urlslab_Data_Custom_Html::MATCH_TYPE_REGEXP == $param;
					},
				),
				'match_url'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'name'               => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'is_logged'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Custom_Html::LOGIN_STATUS_ANY == $param || Urlslab_Data_Custom_Html::LOGIN_STATUS_LOGIN_REQUIRED == $param || Urlslab_Data_Custom_Html::LOGIN_STATUS_NOT_LOGGED_IN == $param;
					},
				),
				'match_capabilities' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_ip'           => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_roles'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_posttypes'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param ) || is_array( $param );
					},
				),
				'match_browser'      => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_cookie'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_headers'      => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'match_params'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'labels'             => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'rule_order'         => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param );
					},
				),
				'is_active'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_bool( $param ) || is_string( $param );
					},
				),
				'add_http_headers'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'add_start_headers'  => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'add_end_headers'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'add_start_body'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'add_end_body'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'is_single'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_singular'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_attachment'      => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_page'            => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_home'            => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_front_page'      => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_category'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_search'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_tag'             => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_author'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_archive'         => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_sticky'          => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_tax'             => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_feed'            => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_paged'           => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->rule_id    = (int) $row->rule_id;
			$row->rule_order = (int) $row->rule_order;
			$row->is_active  = Urlslab_Data_Custom_Html::ACTIVE_YES === $row->is_active;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Custom_Html( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'name',
			'match_type',
			'match_url',
			'match_browser',
			'match_cookie',
			'match_headers',
			'match_params',
			'match_ip',
			'is_logged',
			'match_capabilities',
			'match_roles',
			'match_posttypes',
			'rule_order',
			'labels',
			'is_active',
			'add_http_headers',
			'add_start_headers',
			'add_end_headers',
			'add_start_body',
			'add_end_body',
			'is_single',
			'is_singular',
			'is_attachment',
			'is_page',
			'is_home',
			'is_front_page',
			'is_category',
			'is_search',
			'is_tag',
			'is_author',
			'is_archive',
			'is_sticky',
			'is_tax',
			'is_feed',
			'is_paged',
		);
	}

	protected function on_items_updated( array $rows = array() ) {
		Urlslab_Widget_Custom_Html::delete_cache();

		return parent::on_items_updated( $rows );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( Urlslab_Data_Custom_Html::MATCH_TYPE_REGEXP == $row->get_public( 'match_type' ) ) {
			@preg_match( '|' . str_replace( '|', '\\|', $row->get_public( 'match_url' ) ) . '|uim', 'any text to match' );
			if ( PREG_NO_ERROR !== preg_last_error() ) {
				throw new Exception( esc_html( __( 'Invalid regular expression', 'urlslab' ) ) );
			}
		}
	}

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}

	public function before_import( Urlslab_Data $row_obj, array $row ): Urlslab_Data {
		$row_obj->set_public( 'cnt', 0 );

		return parent::before_import( $row_obj, $row );
	}
}
