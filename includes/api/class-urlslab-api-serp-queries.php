<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest;

class Urlslab_Api_Serp_Queries extends Urlslab_Api_Table {
	const SLUG = 'serp-queries';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<query_id>[0-9]+)/(?P<country>[a-z]{2,3})',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'status' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return
									is_string( $param ) &&
									in_array(
										$param,
										array(
											Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
											Urlslab_Serp_Query_Row::STATUS_PROCESSED,
											Urlslab_Serp_Query_Row::STATUS_ERROR,
										)
									);
							},
						),
						'labels' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/query/query-urls',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_query_urls' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(
						'query'       => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return
									is_string( $param );
							},
						),
						'country'     => array(
							'required'          => true,
							'default'           => 'us',
							'validate_callback' => function( $param ) {
								return is_string( $param ) && 2 === strlen( $param );
							},
						),
						'limit'       => array(
							'required'          => false,
							'default'           => 10,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 1 <= $param && 100 >= $param;
							},
						),
						'domain_type' => array(
							'required'          => false,
							'default'           => '',
							'validate_callback' => function( $param ) {
								return
									in_array(
										$param,
										array(
											'',
											Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN,
											Urlslab_Serp_Domain_Row::TYPE_COMPETITOR,
										)
									);
							},
						),
					),
				),
			)
		);


		$args                = $this->get_table_arguments();
		$args['query']       = array(
			'required'          => true,
			'validate_callback' => function( $param ) {
				return is_string( $param );
			},
		);
		$args['country']     = array(
			'required'          => true,
			'validate_callback' => function( $param ) {
				return is_string( $param ) && 2 === strlen( $param );
			},
		);
		$args['domain_type'] = array(
			'required'          => false,
			'default'           => '',
			'validate_callback' => function( $param ) {
				return is_string( $param );
			},
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/query/top-urls',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_top_urls' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => $args,
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
							'validate_callback' => function( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/query-cluster',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_query_cluster' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(
						'query'        => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && 0 < strlen( $param ) && 255 >= strlen( $param );
							},
						),
						'country'      => array(
							'required'          => false,
							'default'           => 'us',
							'validate_callback' => function( $param ) {
								return is_string( $param ) && 2 === strlen( $param );
							},
						),
						'max_position' => array(
							'required'          => false,
							'default'           => 10,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 1 <= strlen( $param ) && 100 >= strlen( $param );
							},
						),
						'competitors'  => array(
							'required'          => false,
							'default'           => 4,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 1 <= strlen( $param ) && 10 >= strlen( $param );
							},
						),
					),
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
				'status' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return
							is_string( $param ) &&
							in_array(
								$param,
								array(
									Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
									Urlslab_Serp_Query_Row::STATUS_PROCESSED,
									Urlslab_Serp_Query_Row::STATUS_ERROR,
								)
							);
					},
				),
				'query'  => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'labels' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function update_item_permissions_check( $request ) {
		return parent::admin_permission_check( $request );
	}


	protected function get_query_cluster_sql( WP_REST_Request $request, Urlslab_Serp_Query_Row $query ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );

		$sql->add_select_column( 'query_id', 'q' );
		$sql->add_select_column( 'query', 'q' );

		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT f.url_name)', false, 'matching_urls' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT u1.url_name ORDER BY p1.position)', false, 'my_urls' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT u2.url_name ORDER BY p2.position)', false, 'comp_urls' );
		$sql->add_select_column( 'min(p1.position)', false, 'my_min_pos' );

		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' a' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' b ON a.url_id = b.url_id AND b.position <= %d AND a.country=b.country AND a.query_id != b.query_id' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );

		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = b.query_id AND q.country=b.country' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' f ON f.url_id = b.url_id' );


		$my_domains = implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) );
		if ( empty( $my_domains ) ) {
			$my_domains = '0';
		}
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p1 ON p1.query_id = q.query_id AND p1.country=q.country AND p1.domain_id IN (' . $my_domains . ')' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u1 ON p1.url_id = u1.url_id ' );

		$comp_domains = implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) );
		if ( empty( $comp_domains ) ) {
			$comp_domains = '0';
		}
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p2 ON p2.query_id = q.query_id AND p2.country=q.country AND p2.domain_id IN (' . $comp_domains . ') AND p2.position<=%d' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u2 ON p2.url_id = u2.url_id' );

		$sql->add_filter_str( '(' );
		$sql->add_filter_str( 'a.query_id=%d' );
		$sql->add_query_data( $query->get_query_id() );

		$sql->add_filter_str( 'AND a.country=%s' );
		$sql->add_query_data( $query->get_country() );

		$sql->add_filter_str( 'AND a.position<=%d' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );
		$sql->add_filter_str( ')' );

		$sql->add_group_by( 'query_id', 'a' );
		$sql->add_group_by( 'query_id', 'b' );

		$sql->add_having_filter_str( '(' );
		$sql->add_having_filter_str( 'COUNT(DISTINCT f.url_id)>=%d' );
		$sql->add_query_data( $request->get_param( 'competitors' ) );
		$sql->add_having_filter_str( ')' );

		$columns = $this->prepare_columns( ( new Urlslab_Serp_Query_Row() )->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'matching_urls' => '%s',
					'my_urls'       => '%s',
					'comp_urls'     => '%s',
					'my_min_pos'    => '%d',
				)
			)
		);

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_query_cluster( $request ) {
		$query = new Urlslab_Serp_Query_Row(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response( __( 'Query not found' ), 404 );
		}

		$results = $this->get_query_cluster_sql( $request, $query )->get_results();

		foreach ( $results as $result ) {
			$result->my_urls       = Urlslab_Url::enhance_urls_with_protocol( $result->my_urls );
			$result->matching_urls = Urlslab_Url::enhance_urls_with_protocol( $result->matching_urls );
			$result->comp_urls     = Urlslab_Url::enhance_urls_with_protocol( $result->comp_urls );
			$result->my_min_pos    = round( (float) $result->my_min_pos, 2 );
		}

		return new WP_REST_Response( $results, 200 );
	}


	/**
	 *
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
			$row->query_id           = (int) $row->query_id;
			$row->my_position        = round( (float) $row->my_position, 1 );
			$row->comp_intersections = (int) $row->comp_intersections;
			$row->internal_links     = (int) $row->internal_links;
			$row->my_urls_ranked_top10     = (int) $row->my_urls_ranked_top10;
			$row->my_urls_ranked_top100     = (int) $row->my_urls_ranked_top100;
			if ( is_string( $row->my_urls ) ) {
				$row->my_urls = Urlslab_Url::enhance_urls_with_protocol( $row->my_urls );
			} else {
				$row->my_urls = array();
			}
			if ( is_string( $row->comp_urls ) ) {
				$row->comp_urls = Urlslab_Url::enhance_urls_with_protocol( $row->comp_urls );
			} else {
				$row->comp_urls = array();
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Query_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'status', 'labels' );
	}

	public function get_top_urls( $request ) {
		// First Trying to get the query from DB
		$query = new Urlslab_Serp_Query_Row(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);

		if ( ! $query->load() ) {
			return new WP_REST_Response( __( 'Query not found' ), 404 );
		}

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( ( new Urlslab_Serp_Url_Row() )->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}
		$sql->add_select_column( 'position', 'p' );
		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' p' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON d.domain_id = p.domain_id' );

		$sql->add_filter_str( '(' );
		$sql->add_filter_str( 'p.query_id=%d' );
		$sql->add_query_data( $query->get_query_id() );
		$sql->add_filter_str( 'AND p.country=%s' );
		$sql->add_query_data( $query->get_country() );
		if ( strlen( $request->get_param( 'domain_type' ) ) > 0 ) {
			$sql->add_filter_str( 'AND d.domain_type=%s' );
			$sql->add_query_data( $request->get_param( 'domain_type' ) );
		}
		$sql->add_filter_str( ')' );

		$columns = $this->prepare_columns( ( new Urlslab_Serp_Url_Row() )->get_columns(), 'u' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'position' => '%d',
				),
				'p'
			)
		);

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		$results = $sql->get_results();

		foreach ( $results as $row ) {
			$row->position              = (float) $row->position;
			$row->url_id                = (int) $row->url_id;
			$row->domain_id             = (int) $row->domain_id;
			$row->top100_queries_cnt    = (int) $row->top100_queries_cnt;
			$row->top10_queries_cnt     = (int) $row->top10_queries_cnt;
			$row->best_position         = (int) $row->best_position;
			$row->comp_intersections    = (int) $row->comp_intersections;
			$row->my_urls_ranked_top10  = (int) $row->my_urls_ranked_top10;
			$row->my_urls_ranked_top100 = (int) $row->my_urls_ranked_top100;
			$row->top_queries           = explode( ',', $row->top_queries );
			try {
				$row->url_name = ( new Urlslab_Url( $row->url_name, true ) )->get_url_with_protocol();
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $results, 200 );
	}


	public function get_query_urls( $request ) {
		// First Trying to get the query from DB
		$query       = new Urlslab_Serp_Query_Row(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		$domain_type = $request->get_param( 'domain_type' );


		if ( ! $query->load() || Urlslab_Serp_Query_Row::STATUS_SKIPPED === $query->get_status() ) {
			try {
				return $this->get_serp_results( $query );
			} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
				switch ( $e->getCode() ) {
					case 402:
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 ); //continue

						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => 'not enough credits',
							),
							402
						);
					default:
						$response_obj = (object) array(
							'error' => $e->getMessage(),
						);

						return new WP_REST_Response( $response_obj, $e->getCode() );
				}
			}
		} else {
			global $wpdb;

			if ( empty( $domain_type ) ) {
				$results = $wpdb->get_results(
					$wpdb->prepare(
						'SELECT u.*, p.position as position FROM ' . URLSLAB_SERP_POSITIONS_TABLE . ' p INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE p.query_id=%d AND p.country=%s ORDER BY p.position LIMIT %d', // phpcs:ignore
						$query->get_query_id(),
						$query->get_country(),
						$request->get_param( 'limit' )
					),
					ARRAY_A
				);
			} else {
				$whitelist_domains = array();
				if ( Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN === $domain_type ) {
					$whitelist_domains = array_keys( Urlslab_Serp_Domain_Row::get_my_domains() );
				} else if ( Urlslab_Serp_Domain_Row::TYPE_COMPETITOR === $domain_type ) {
					$whitelist_domains = array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() );
				}

				if ( empty( $whitelist_domains ) ) {
					return new WP_REST_Response( array(), 200 );
				}

				$results = $wpdb->get_results(
					$wpdb->prepare(
						'SELECT u.*, p.position as position FROM ' . URLSLAB_SERP_POSITIONS_TABLE . ' p INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE p.query_id=%d AND p.country=%s AND p.domain_id IN (' . implode( ',', $whitelist_domains ) . ') ORDER BY p.position LIMIT %d', // phpcs:ignore
						$query->get_query_id(),
						$query->get_country(),
						$request->get_param( 'limit' )
					),
					ARRAY_A
				);
			}

			$rows = array();
			foreach ( $results as $result ) {
				$row           = new Urlslab_Serp_Url_Row( $result, true );
				$ret           = (object) $row->as_array();
				$ret->position = (float) $result['position'];
				try {
					$ret->url_name = ( new Urlslab_Url( $ret->url_name, true ) )->get_url_with_protocol();
				} catch ( Exception $e ) {
				}
				$rows[] = $ret;
			}

			return new WP_REST_Response( $rows, 200 );
		}
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			$row = $this->get_row_object( array(), false );
			foreach ( $row->get_columns() as $column => $format ) {
				if ( $request->has_param( $column ) ) {
					$row->set_public( $column, $request->get_param( $column ) );
				}
			}

			try {
				$this->validate_item( $row );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Validation failed: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}

			$row->set_type( Urlslab_Serp_Query_Row::TYPE_USER );

			$queries = preg_split( '/\r\n|\r|\n/', $row->get_query() );
			foreach ( $queries as $query ) {
				$query = trim( $query );
				if ( ! empty( $query ) ) {
					$row->set_query( $query );
					$row->insert();
					$this->on_items_updated( array( $row ) );
				}
			}

			return new WP_REST_Response( $row->as_array(), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}

		$sql->add_from( $this->get_row_object()->get_table_name() . ' q' );
		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'q' );
		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
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

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_POSITIONS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		return parent::delete_all_items( $request );
	}

	private function get_serp_results( Urlslab_Serp_Query_Row $query ): WP_REST_Response {
		$serp_conn = Urlslab_Serp_Connection::get_instance();
		$serp_res  = $serp_conn->search_serp( $query, DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY );
		$serp_data = $serp_conn->extract_serp_data( $query, $serp_res, 50 ); // max_import_pos doesn't matter here

		$ret = array();
		foreach ( $serp_data['urls'] as $url ) {
			$ret[] = (object) $url->as_array();
		}

		return new WP_REST_Response( $ret, 200 );
	}


	protected function on_items_updated( array $row = array() ) {
		Urlslab_Serp_Query_Row::update_serp_data();
		parent::on_items_updated( $row );
	}
}
