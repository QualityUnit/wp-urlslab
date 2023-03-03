<?php

class Urlslab_Api_Keywords extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/keyword';

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<kw_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'kwType'      => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Keywords_Links::KW_TYPE_MANUAL:
									case Urlslab_Keywords_Links::KW_TYPE_IMPORTED_FROM_CONTENT:
									case Urlslab_Keywords_Links::KW_TYPE_NONE:
										return true;
									default:
										return false;
								}
							},
						),
						'kw_priority' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param );
							},
						),
						'lang'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 10 > strlen( $param );
							},
						),
						'urlFilter'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 250 > strlen( $param );
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
			$base . '/(?P<kw_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/(?P<kw_id>[0-9]+)/(?P<destUrlMd5>[0-9]+)', $this->get_route_get_kw_mapping() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<kw_id>[0-9]+)/(?P<destUrlMd5>[0-9]+)/count', $this->get_count_route( $this->get_route_get_kw_mapping() ) );


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

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			try {
				$row_url         = new Urlslab_Url( $row->urlLink ); // phpcs:ignore
				$row->destUrlMd5 = $row_url->get_url_id(); // phpcs:ignore
			} catch ( Exception $e ) {
			}
			$row->kw_id            = (int) $row->kw_id;
			$row->kw_length        = (int) $row->kw_length;
			$row->kw_priority      = (int) $row->kw_priority;
			$row->kw_usage_count   = (int) $row->kw_usage_count;
			$row->link_usage_count = (int) $row->link_usage_count;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_kw_mapping( $request ) {
		$rows = $this->get_kw_mapping_sql( $request )->get_results();

		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			$row->urlMd5 = (int) $row->urlMd5;// phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_kw_mapping_count( $request ) {
		return new WP_REST_Response( $this->get_kw_mapping_sql( $request )->get_count(), 200 );
	}

	public function delete_item( $request ) {
		global $wpdb;

		$delete_params          = array();
		$delete_params['kw_id'] = $request->get_param( 'kw_id' );

		if ( false === $wpdb->delete( URLSLAB_KEYWORDS_TABLE, $delete_params ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->delete( URLSLAB_KEYWORDS_MAP_TABLE, $delete_params ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	public function delete_all_items( $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KEYWORDS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KEYWORDS_MAP_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	public function import_items( WP_REST_Request $request ) {
		$schedule_urls = array();
		$rows          = array();

		foreach ( $request->get_json_params()['rows'] as $row ) {
			$obj = $this->get_row_object( (array) $row );
			try {
				$schedule_urls[ $obj->get( 'urlLink' ) ] = new Urlslab_Url( $obj->get( 'urlLink' ) );
				$rows[]                                  = $obj;
			} catch ( Exception $e ) {
			}
		}

		$url_fetcher = new Urlslab_Url_Data_Fetcher();
		if ( ! $url_fetcher->prepare_url_batch_for_scheduling( $schedule_urls ) ) {
			return new WP_REST_Response( 'Import failed.', 500 );
		}

		$result = $this->get_row_object()->import( $rows );

		if ( false === $result ) {
			return new WP_REST_Response( 'Import failed', 500 );
		}

		return new WP_REST_Response( $result, 200 );
	}


	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Keyword_Row( $params );
	}

	function get_editable_columns(): array {
		return array( 'kwType', 'kw_priority', 'lang', 'urlFilter' );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return Urlslab_Api_Table_Sql
	 */
	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'kw_id', 'v', 'kw_id' );
		$sql->add_select_column( 'keyword', 'v', 'keyword' );
		$sql->add_select_column( 'kw_priority', 'v', 'kw_priority' );
		$sql->add_select_column( 'kw_length', 'v', 'kw_length' );
		$sql->add_select_column( 'lang', 'v', 'lang' );
		$sql->add_select_column( 'urlLink', 'v', 'urlLink' );
		$sql->add_select_column( 'urlFilter', 'v', 'urlFilter' );
		$sql->add_select_column( 'kwType', 'v', 'kwType' );
		$sql->add_select_column( 'SUM(!ISNULL(d.urlMd5))', false, 'kw_usage_count' );
		$sql->add_select_column( 'SUM(!ISNULL(d.destUrlMd5))', false, 'link_usage_count' );

		$sql->add_from( URLSLAB_KEYWORDS_TABLE . ' AS v LEFT JOIN ' . URLSLAB_KEYWORDS_MAP_TABLE . ' AS d ON d.kw_id = v.kw_id' );

		$this->add_filter_table_fields( $sql, 'v' );

		$sql->add_filter( 'filter_keyword' );
		$sql->add_filter( 'filter_urlLink' );
		$sql->add_filter( 'filter_kw_priority', '%d' );
		$sql->add_filter( 'filter_kw_length', '%d' );
		$sql->add_filter( 'filter_lang' );
		$sql->add_filter( 'filter_urlFilter' );
		$sql->add_filter( 'filter_kwType' );

		$sql->add_having_filter( 'filter_kw_usage_count', '%d' );
		$sql->add_having_filter( 'filter_link_usage_count', '%d' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'kw_id', 'v' );

		$sql->add_group_by( 'kw_id', 'v' );

		return $sql;
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_keyword'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_urlLink'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_kw_priority'      => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_kw_length'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_lang'             => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_urlFilter'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_kwType'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_kw_usage_count'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_link_usage_count' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
					)
				),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_kw_mapping(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_kw_mapping' ),
				'args'                => array(
					'rows_per_page'   => array(
						'required'          => true,
						'default'           => self::ROWS_PER_PAGE,
						'validate_callback' => function( $param ) {
							return is_numeric( $param ) && 0 < $param && 200 > $param;
						},
					),
					'from_urlMd5'     => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return is_numeric( $param );
						},
					),
					'filter_linkType' => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
				),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		);
	}

	/**
	 * @param $request
	 *
	 * @return Urlslab_Api_Table_Sql
	 */
	public function get_kw_mapping_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'urlMd5', 'm' );
		$sql->add_select_column( 'linkType', 'm' );
		$sql->add_select_column( 'urlName', 'u' );

		$sql->add_from( URLSLAB_KEYWORDS_MAP_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON m.urlMd5 = u.urlMd5' );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'kw_id', '%d' );
		$sql->add_filter( 'destUrlMd5', '%d' );
		$sql->add_filter( 'from_urlMd5', '%d' );
		$sql->add_filter( 'filter_linkType', '%d' );

		$sql->add_order( 'urlMd5' );
		$sql->add_order( 'destUrlMd5' );

		return $sql;
	}
}
