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
			$base . '/(?P<query_id>[0-9]+)',
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
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
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
						'delete_item_permissions_check',
					),
					'args'                => array(
						'query' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return
									is_string( $param );
							},
						),
						'limit' => array(
							'required'          => false,
							'default'           => 10,
							'validate_callback' => function ( $param ) {
								return
									is_numeric( $param );
							},
						),
						'domain_type' => array(
							'required'          => false,
							'default'           => Urlslab_Serp_Domain_Row::TYPE_OTHER,
							'validate_callback' => function ( $param ) {
								return
									is_string( $param ) && in_array( $param, array( Urlslab_Serp_Domain_Row::TYPE_OTHER, Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN, Urlslab_Serp_Domain_Row::TYPE_COMPETITOR ) );
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
						'with_stats' => array(
							'required'          => false,
							'default'           => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
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
					'validate_callback' => function ( $param ) {
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
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'labels' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_query_cluster( $request ) {
		$query = new Urlslab_Serp_Query_Row( array( 'query' => $request->get_param( 'query' ) ) );
		if ( ! $query->load() ) {
			return new WP_REST_Response( __( 'Query not found' ), 404 );
		}
		$with_stats = $request->get_param( 'with_stats' );


		// Creating the Query
		$params = array();
		if ( $with_stats ) {
			$my_domains = implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) );
			$comp_domains = implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) );

			if ( '' == $my_domains ) {
				$my_domains = '0';
			}
			if ( '' == $comp_domains ) {
				$comp_domains = '0';
			}
			$sql = "SELECT k.query as query, k.matching_urls as matching_urls, GROUP_CONCAT(DISTINCT u1.url_name ORDER BY p1.position SEPARATOR ',') as my_urls, GROUP_CONCAT(DISTINCT u2.url_name ORDER BY p2.position SEPARATOR ',') as comp_urls, AVG(p1.position) as my_avg_pos, AVG(p2.position) as comp_avg_pos, AVG(p1.impressions) as my_avg_imp, AVG(p1.ctr) as my_avg_ctr, AVG(p1.clicks) as my_avg_clk, min(p1.position) as my_min_pos" .
				   ' FROM (SELECT b.query_id, q.query as query, GROUP_CONCAT(f.url_name) as matching_urls' .
				   ' FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' a ' .
				   ' INNER JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' b ON a.url_id = b.url_id AND b.position <= %d' .
				   ' INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = b.query_id' .
				   ' INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' f ON f.url_id = b.url_id' .
				   ' WHERE a.query_id = %d AND a.position <= %d AND b.query_id != %d GROUP BY a.query_id, b.query_id ' .
				   ' HAVING COUNT(*) > %d) k' .
				   ' LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p1 ' .
				   ' ON p1.query_id = k.query_id AND p1.domain_id IN (' . $my_domains . ')' .
				   ' LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u1 ON p1.url_id = u1.url_id ' .
				   ' LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p2 ' .
				   ' ON p2.query_id = k.query_id AND p2.domain_id IN ( ' . $comp_domains . ') AND p2.position <= %d' .
				   ' LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u2 ON p2.url_id = u2.url_id' .
				   ' GROUP BY k.query_id, k.matching_urls';

			$params[] = $request->get_param( 'max_position' );
			$params[] = $query->get_query_id();
			$params[] = $request->get_param( 'max_position' );
			$params[] = $query->get_query_id();
			$params[] = $request->get_param( 'competitors' );
			$params[] = $request->get_param( 'max_position' );
		} else {
			$sql = 'SELECT q.* FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' a' .
				   ' INNER JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' b ON a.url_id = b.url_id' .
				   ' INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = b.query_id AND b.query_id != a.query_id' .
				   ' WHERE a.query_id=%d GROUP BY b.query_id, b.url_id HAVING COUNT(*) > %d';
			$params[] = $query->get_query_id();
			$params[] = $request->get_param( 'competitors' );
		}
		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				$sql, // phpcs:ignore
				$params
			),
			ARRAY_A
		);

		$rows = array();
		foreach ( $results as $result ) {
			$row    = new Urlslab_Serp_Query_Row( $result );
			$to_add = $row->as_array();
			if ( $with_stats ) {
				$to_add['my_urls']  = $result['my_urls'];
				$to_add['matching_urls']  = $result['matching_urls'];
				$to_add['comp_urls']  = $result['comp_urls'];
				$to_add['my_avg_pos']  = round( (float) $result['my_avg_pos'], 2 );
				$to_add['my_avg_imp']  = round( (float) $result['my_avg_imp'], 2 );
				$to_add['my_avg_ctr']  = round( (float) $result['my_avg_ctr'], 2 );
				$to_add['my_avg_clk']  = round( (float) $result['my_avg_clk'], 2 );
				$to_add['my_min_pos']  = round( (float) $result['my_min_pos'], 2 );
				$to_add['comp_avg_pos']  = round( (float) $result['comp_avg_pos'], 2 );
			}

			$rows[] = (object) $to_add;
		}

		return new WP_REST_Response( $rows, 200 );
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
			$row->query_id       = (int) $row->query_id;
			$row->my_position    = round( (float) $row->my_position, 1 );
			$row->my_ctr         = round( (float) $row->my_ctr, 2 );
			$row->my_clicks      = (int) $row->my_clicks;
			$row->my_impressions = (int) $row->my_impressions;
			$row->comp_position  = (int) $row->comp_position;
			$row->comp_count     = (int) $row->comp_count;
			$row->my_url_name    = str_replace( ',', ', ', $row->my_url_name );
			try {
				if ( ! empty( $row->comp_url_name ) ) {
					$url                = new Urlslab_Url( $row->comp_url_name, true );
					$row->comp_url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {
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
				'query' => $request->get_param( 'query' ),
			)
		);
		$domain_type = $request->get_param( 'domain_type' );
		$limit = $request->get_param( 'limit' );
		if ( $limit > 100 ) {
			$limit = 100;
		}

		$whitelist_domains = array();
		if ( Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN === $domain_type ) {
			$whitelist_domains = array_keys( Urlslab_Serp_Domain_Row::get_my_domains() );
		}
		if ( Urlslab_Serp_Domain_Row::TYPE_COMPETITOR === $domain_type ) {
			$whitelist_domains = array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() );
		}

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
							'error'       => $e->getMessage(),
						);

						return new WP_REST_Response( $response_obj, $e->getCode() );
				}
			}
		} else {
			global $wpdb;

			if ( Urlslab_Serp_Domain_Row::TYPE_OTHER === $domain_type ) {
				$results = $wpdb->get_results(
					$wpdb->prepare(
						'SELECT u.*, p.position as position, p.clicks as clicks, p.impressions as impressions, p.ctr as ctr FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' p INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE p.query_id=%d ORDER BY p.position LIMIT ' . $limit, // phpcs:ignore
						$query->get_query_id()
					),
					ARRAY_A
				);
			} else {
				if ( empty( $whitelist_domains ) ) {
					return new WP_REST_Response( array(), 200 );
				}

				$results = $wpdb->get_results(
					$wpdb->prepare(
						'SELECT u.*, p.position as position, p.clicks as clicks, p.impressions as impressions, p.ctr as ctr FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' p INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE p.query_id=%d AND p.domain_id IN (' . implode( ',', $whitelist_domains ) . ') ORDER BY p.position LIMIT ' . $limit, // phpcs:ignore
						$query->get_query_id()
					),
					ARRAY_A
				);
			}

			$rows = array();
			foreach ( $results as $result ) {
				$row    = new Urlslab_Serp_Url_Row( $result, true );
				$ret = (object) $row->as_array();
				$ret->position = (float) $result['position'];
				$ret->clicks = (int) $result['clicks'];
				$ret->impressions = (float) $result['impressions'];
				$ret->ctr = (float) $result['ctr'];
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
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}
		$sql->add_select_column( 'AVG(p.position)', false, 'my_position' );
		$sql->add_select_column( 'SUM(p.impressions)', false, 'my_impressions' );
		$sql->add_select_column( 'SUM(p.clicks)', false, 'my_clicks' );
		$sql->add_select_column( 'AVG(p.ctr)', false, 'my_ctr' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT u.url_name ORDER BY p.clicks, p.impressions)', false, 'my_url_name' );

		$sql->add_select_column( 'MIN(cp.position)', false, 'comp_position' );
		$sql->add_select_column( 'COUNT(DISTINCT cp.domain_id)', false, 'comp_count' );
		$sql->add_select_column( 'url_name', 'cu', 'comp_url_name' );

		$first_gsc_join  = ' p ON q.query_id = p.query_id';
		$second_gsc_join = ' cp ON q.query_id = cp.query_id AND cp.position<11';
		if ( ! empty( Urlslab_Serp_Domain_Row::get_my_domains() ) ) {
			$first_gsc_join .= ' AND p.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) ) . ')';
		}
		if ( ! empty( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) {
			$second_gsc_join .= ' AND cp.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . ')';
		}

		$sql->add_from( $this->get_row_object()->get_table_name() . ' q' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . $first_gsc_join );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON p.url_id=u.url_id' );

		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . $second_gsc_join );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' cu ON cp.url_id=cu.url_id' );


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'my_position'    => '%d',
					'comp_position'  => '%d',
					'comp_count'     => '%d',
					'my_impressions' => '%d',
					'my_clicks'      => '%d',
					'my_ctr'         => '%d',
					'my_url_name'    => '%s',
					'comp_url_name'  => '%s',
				)
			)
		);

		$sql->add_group_by( 'query_id', 'q' );
		$sql->add_having_filters( $columns, $request );

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
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GSC_POSITIONS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		return parent::delete_all_items( $request );
	}

	private function get_serp_results( $query ): WP_REST_Response {
		$serp_conn = Urlslab_Serp_Connection::get_instance();
		$serp_res        = $serp_conn->search_serp( $query, DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY );
		$serp_data = $serp_conn->extract_serp_data( $query, $serp_res, 50 ); // max_import_pos doesn't matter here
		$serp_conn->save_extracted_serp_data( $serp_data['urls'], $serp_data['positions'], $serp_data['domains'] );
		$query->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSED );
		$query->update();

		$ret = array();
		foreach ( $serp_data['urls'] as $url ) {
			$ret[] = (object) $url->as_array();
		}

		return new WP_REST_Response( $ret, 200 );
	}

}
