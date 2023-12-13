<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest;

class Urlslab_Api_Serp_Queries extends Urlslab_Api_Table {
	const SLUG = 'serp-queries';

	public static function normalize_query_row( $row ) {
		$row->query_id              = (int) $row->query_id;
		$row->parent_query_id       = (int) $row->parent_query_id;
		$row->my_position           = round( (float) $row->my_position, 1 );
		$row->comp_intersections    = (int) $row->comp_intersections;
		$row->internal_links        = (int) $row->internal_links;
		$row->my_urls_ranked_top10  = (int) $row->my_urls_ranked_top10;
		$row->my_urls_ranked_top100 = (int) $row->my_urls_ranked_top100;
		$row->country_volume        = (int) $row->country_volume;
		$row->country_kd            = (int) $row->country_kd;
		$row->country_high_bid      = round( (float) $row->country_high_bid, 2 );
		$row->country_low_bid       = round( (float) $row->country_low_bid, 2 );
		$row->my_urls               = Urlslab_Url::enhance_urls_with_protocol( $row->my_urls );
		$row->comp_urls             = Urlslab_Url::enhance_urls_with_protocol( $row->comp_urls );

		if ( strlen( $row->country_monthly_volumes ) ) {
			$row->country_monthly_volumes = null;
		}
	}

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/recompute', $this->get_route_recompute_item() );

		register_rest_route( self::NAMESPACE, $base . '/query-cluster', $this->get_route_query_cluster() );
		register_rest_route( self::NAMESPACE, $base . '/query-cluster/count', $this->get_count_route( array( $this->get_route_query_cluster() ) ) );


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
						'status'            => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param ) &&
									in_array(
										$param,
										array(
											Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
											Urlslab_Data_Serp_Query::STATUS_PROCESSED,
											Urlslab_Data_Serp_Query::STATUS_ERROR,
										)
									);
							},
						),
						'schedule_interval' => array(
							'required'          => false,
							'default'           => '',
							'validate_callback' => function( $param ) {
								if ( empty( $param ) ) {
									return true;
								}
								$obj = new DomainDataRetrievalSerpApiSearchRequest();
								foreach ( $obj->getNotOlderThanAllowableValues() as $value ) {
									if ( substr( $value, 0, 1 ) === $param ) {
										return true;
									}
								}

								return false;
							},
						),
						'labels'            => array(
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
								return is_string( $param );
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
								return in_array(
									$param,
									array(
										'',
										Urlslab_Data_Serp_Domain::TYPE_MY_DOMAIN,
										Urlslab_Data_Serp_Domain::TYPE_COMPETITOR,
									)
								);
							},
						),
					),
				),
			)
		);


		register_rest_route( self::NAMESPACE, $base . '/query/top-urls', $this->get_route_top_urls() );
		register_rest_route( self::NAMESPACE, $base . '/query/top-urls/count', $this->get_count_route( array( $this->get_route_top_urls() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/query/cluster-urls', $this->get_route_cluster_urls() );
		register_rest_route( self::NAMESPACE, $base . '/query/cluster-urls/count', $this->get_count_route( array( $this->get_route_cluster_urls() ) ) );

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


	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'status'            => array(
					'required'          => false,
					'default'           => Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
					'validate_callback' => function( $param ) {
						return is_string( $param ) &&
							in_array(
								$param,
								array(
									Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
									Urlslab_Data_Serp_Query::STATUS_PROCESSED,
									Urlslab_Data_Serp_Query::STATUS_ERROR,
								)
							);
					},
				),
				'query'             => array(
					'required'          => true,
					'default'           => '',
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'schedule_interval' => array(
					'required'          => false,
					'default'           => '',
					'validate_callback' => function( $param ) {
						if ( empty( $param ) ) {
							return true;
						}
						$obj = new DomainDataRetrievalSerpApiSearchRequest();
						foreach ( $obj->getNotOlderThanAllowableValues() as $value ) {
							if ( substr( $value, 0, 1 ) === $param ) {
								return true;
							}
						}

						return false;
					},
				),
				'labels'            => array(
					'required'          => false,
					'default'           => '',
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

	/**
	 * @return array[]
	 */
	public function get_route_recompute_item(): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'recompute' ),
			'args'                => array(),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function update_item_permissions_check( $request ) {
		return parent::admin_permission_check( $request );
	}


	protected function get_query_cluster_sql( WP_REST_Request $request, Urlslab_Data_Serp_Query $query ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'my_urls', 'comp_urls', 'matching_urls' ) );

		$sql = new Urlslab_Api_Table_Sql( $request );

		$cols = ( new Urlslab_Data_Serp_Query() )->get_columns();
		unset( $cols['my_urls'] );
		unset( $cols['comp_urls'] );

		foreach ( array_keys( $cols ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}

		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT f.url_name)', false, 'matching_urls' );
		$sql->add_select_column( 'COUNT(DISTINCT f.url_id)', false, 'competitors' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT u1.url_name ORDER BY p1.position)', false, 'my_urls' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT u2.url_name ORDER BY p2.position)', false, 'comp_urls' );
		$sql->add_select_column( 'min(p1.position)', false, 'my_min_pos' );

		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' a' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' b ON a.url_id = b.url_id AND b.position <= %d AND a.country=b.country' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );

		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = b.query_id AND q.country=b.country' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' f ON f.url_id = b.url_id' );


		$my_domains = implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_my_domains() ) );
		if ( empty( $my_domains ) ) {
			$my_domains = '0';
		}
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p1 ON p1.query_id = q.query_id AND p1.country=q.country AND p1.domain_id IN (' . $my_domains . ')' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u1 ON p1.url_id = u1.url_id ' );

		$comp_domains = implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_competitor_domains() ) );
		if ( empty( $comp_domains ) ) {
			$comp_domains = '0';
		}
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p2 ON p2.query_id = q.query_id AND p2.country=q.country AND p2.domain_id IN (' . $comp_domains . ') AND p2.position<=%d' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u2 ON p2.url_id = u2.url_id' );

		$sql->add_filter_str( '(', 'AND' );
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
		$sql->add_having_filter_str( 'competitors>=%d' );
		$sql->add_query_data( $request->get_param( 'competitors' ) );
		$sql->add_having_filter_str( ')' );

		$columns = $this->prepare_columns( ( new Urlslab_Data_Serp_Query() )->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'matching_urls' => '%s',
					'my_urls'       => '%s',
					'comp_urls'     => '%s',
					'my_min_pos'    => '%d',
					'competitors'   => '%d',
				)
			)
		);

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}


	protected function get_cluster_urls_sql( WP_REST_Request $request, Urlslab_Data_Serp_Query $query ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );

		foreach ( array_keys( ( new Urlslab_Data_Serp_Url() )->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}

		$sql->add_select_column( 'domain_name', 'd' );
		$sql->add_select_column( 'domain_type', 'd' );
		$sql->add_select_column( 'COUNT(DISTINCT b.url_id)', false, 'cluster_level' );
		$sql->add_select_column( 'COUNT(DISTINCT c.query_id)', false, 'queries_cnt' );

		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' a' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' b ON a.url_id = b.url_id AND b.position <= %d AND a.country=b.country' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' c ON c.query_id = b.query_id AND b.position <= %d AND c.country=b.country' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );

		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = c.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON u.domain_id = d.domain_id' );

		$sql->add_filter_str( '(', 'AND' );
		$sql->add_filter_str( 'a.query_id=%d' );
		$sql->add_query_data( $query->get_query_id() );

		$sql->add_filter_str( 'AND a.country=%s' );
		$sql->add_query_data( $query->get_country() );

		$sql->add_filter_str( 'AND a.position<=%d' );
		$sql->add_query_data( $request->get_param( 'max_position' ) );

		$domain_type = $request->get_param( 'domain_type' );
		if ( 'A' !== $domain_type ) {
			$sql->add_filter_str( 'AND d.domain_type=%s' );
			$sql->add_query_data( $domain_type );
		}

		$sql->add_filter_str( ')' );

		$sql->add_group_by( 'url_id', 'c' );

		$sql->add_having_filter_str( '(', 'AND' );
		$sql->add_having_filter_str( 'cluster_level>=%d' );
		$sql->add_query_data( $request->get_param( 'competitors' ) );
		$sql->add_having_filter_str( ')' );

		$columns = $this->prepare_columns( ( new Urlslab_Data_Serp_Url() )->get_columns(), 'u' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'domain_name'   => '%s',
					'domain_type'   => '%s',
					'cluster_level' => '%d',
					'queries_cnt'   => '%d',
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
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response(
				(object) array(
					__( 'Query not found', 'urlslab' ),
				), 
				404 
			);
		}

		$results = $this->get_query_cluster_sql( $request, $query )->get_results();

		foreach ( $results as $result ) {
			self::normalize_query_row( $result );
			$result->matching_urls = Urlslab_Url::enhance_urls_with_protocol( $result->matching_urls );
			$result->my_min_pos    = round( (float) $result->my_min_pos, 2 );
			$result->competitors   = (int) $result->competitors;
		}

		return new WP_REST_Response( $results, 200 );
	}

	public function get_cluster_urls_count( WP_REST_Request $request ) {
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response( 0, 200 );
		}

		return new WP_REST_Response( $this->get_cluster_urls_sql( $request, $query )->get_count(), 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_cluster_urls( $request ) {
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response(
				(object) array(
					__( 'Query not found', 'urlslab' ),
				),
				404 
			);
		}

		$results = $this->get_cluster_urls_sql( $request, $query )->get_results();

		foreach ( $results as $row ) {
			Urlslab_Api_Serp_Urls::normalize_url_row( $row );
			$row->cluster_level = (int) $row->cluster_level;
			$row->queries_cnt   = (int) $row->queries_cnt;
		}

		return new WP_REST_Response( $results, 200 );
	}

	public function get_query_cluster_count( WP_REST_Request $request ) {
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response( 0, 200 );
		}

		return new WP_REST_Response( $this->get_query_cluster_sql( $request, $query )->get_count(), 200 );
	}


	public function recompute( WP_REST_Request $request ) {
		set_transient( Urlslab_Widget_Serp::SETTING_NAME_SERP_DATA_TIMESTAMP, time() );

		return new WP_REST_Response(
			(object) array(
				__( 'Recomputation scheduled.', 'urlslab' ),
			),
			200 
		);
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
			self::normalize_query_row( $row );
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Serp_Query( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'status', 'labels', 'schedule_interval', 'type' );
	}


	public function get_top_urls( $request ) {
		// First Trying to get the query from DB
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);

		if ( ! $query->load() ) {
			return new WP_REST_Response(
				(object) array(
					__( 'Query not found', 'urlslab' ),
				),
				404 
			);
		}

		$results = $this->get_top_urls_sql( $request, $query )->get_results();

		foreach ( $results as $row ) {
			Urlslab_Api_Serp_Urls::normalize_url_row( $row );
			$row->position = (int) $row->position;
		}

		return new WP_REST_Response( $results, 200 );
	}


	public function get_top_urls_count( WP_REST_Request $request ) {
		$query = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		if ( ! $query->load() ) {
			return new WP_REST_Response( 0, 200 );
		}

		return new WP_REST_Response( $this->get_top_urls_sql( $request, $query )->get_count(), 200 );
	}


	public function get_query_urls( $request ) {
		// First Trying to get the query from DB
		$query       = new Urlslab_Data_Serp_Query(
			array(
				'query'   => $request->get_param( 'query' ),
				'country' => $request->get_param( 'country' ),
			)
		);
		$domain_type = $request->get_param( 'domain_type' );


		if ( $query->load() && Urlslab_Data_Serp_Query::STATUS_PROCESSED === $query->get_status() ) {
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
				if ( Urlslab_Data_Serp_Domain::TYPE_MY_DOMAIN === $domain_type ) {
					$whitelist_domains = array_keys( Urlslab_Data_Serp_Domain::get_my_domains() );
				} elseif ( Urlslab_Data_Serp_Domain::TYPE_COMPETITOR === $domain_type ) {
					$whitelist_domains = array_keys( Urlslab_Data_Serp_Domain::get_competitor_domains() );
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
				$row           = new Urlslab_Data_Serp_Url( $result, true );
				$ret           = (object) $row->as_array();
				$ret->position = (float) $result['position'];
				try {
					$ret->url_name = ( new Urlslab_Url( $ret->url_name, true ) )->get_url_with_protocol();
				} catch ( Exception $e ) {
				}
				$rows[] = $ret;
			}
			if ( ! empty( $rows ) ) {
				return new WP_REST_Response( $rows, 200 );
			}
		}


		try {
			return $this->get_serp_results( $query, (int) $request->get_param( 'limit' ) );
		} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
			switch ( $e->getCode() ) {
				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 ); //continue

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

		return new WP_REST_Response( array(), 200 );
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			$imported_queries = array();
			$queries          = preg_split( '/\r\n|\r|\n/', $request->get_param( 'query' ) );
			foreach ( $queries as $query ) {
				$query = trim( $query );
				if ( ! empty( $query ) ) {
					$row = new Urlslab_Data_Serp_Query(
						array(
							'query'             => $query,
							'country'           => $request->get_param( 'country' ),
							'type'              => Urlslab_Data_Serp_Query::TYPE_USER,
							'schedule_interval' => $request->get_param( 'schedule_interval' ),
							'labels'            => $request->get_param( 'labels' ),
						),
						false
					);
					if ( $row->insert() ) {
						$this->on_items_updated( array( $row ) );
						$imported_queries[] = $row;
					} else {
						if ( $row->load() ) {
							$row->set_type( Urlslab_Data_Serp_Query::TYPE_USER );
							$row->set_schedule_interval( $request->get_param( 'schedule_interval' ) );
							$row->set_labels( $request->get_param( 'labels' ) );
							$row->set_status( Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED );
							$row->set_country_vol_status( Urlslab_Data_Serp_Query::VOLUME_STATUS_NEW );
							$row->update();
							$imported_queries[] = $row;
						}
					}
				}
			}

			if ( ! empty( $imported_queries ) && 5 >= count( $imported_queries ) ) {
				try {
					foreach ( $imported_queries as $query ) {
						$query->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSING );
						$query->update();
					}
					$serp_conn     = Urlslab_Connection_Serp::get_instance();
					$serp_response = $serp_conn->bulk_search_serp( $imported_queries, true );
					$serp_conn->save_serp_response( $serp_response, $imported_queries );
				} catch ( ApiException $e ) {
					if ( 402 === $e->getCode() ) {
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
					}
					foreach ( $imported_queries as $query ) {
						$query->set_status( Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED );
						$query->update();
					}
				}
			}

			return new WP_REST_Response( $row->as_array(), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
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

	private function get_serp_results( Urlslab_Data_Serp_Query $query, int $limit = 15 ): WP_REST_Response {
		$serp_conn = Urlslab_Connection_Serp::get_instance();
		$serp_res  = $serp_conn->search_serp( $query, DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_DAILY );
		$serp_data = $serp_conn->extract_serp_data( $query, $serp_res, 50 ); // max_import_pos doesn't matter here

		$ret = array();
		foreach ( $serp_data['urls'] as $url ) {
			$ret[ $url->get_url_id() ] = (object) $url->as_array();
			if ( count( $ret ) >= $limit ) {
				break;
			}
		}

		return new WP_REST_Response( array_values( $ret ), 200 );
	}


	protected function on_items_updated( array $row = array() ) {
		Urlslab_Data_Serp_Query::update_serp_data();
		parent::on_items_updated( $row );
	}

	private function get_route_query_cluster() {
		return array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => array( $this, 'get_query_cluster' ),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
			'args'                => array_merge(
				$this->get_table_arguments(),
				array(
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
				)
			),
		);
	}

	private function get_route_top_urls() {
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

		return array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => array( $this, 'get_top_urls' ),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
			'args'                => $args,
		);
	}

	private function get_route_cluster_urls() {
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

		$args['max_position'] = array(
			'required'          => false,
			'default'           => 10,
			'validate_callback' => function( $param ) {
				return is_numeric( $param ) && 1 <= strlen( $param ) && 100 >= strlen( $param );
			},
		);
		$args['competitors']  = array(
			'required'          => false,
			'default'           => 4,
			'validate_callback' => function( $param ) {
				return is_numeric( $param ) && 1 <= strlen( $param ) && 10 >= strlen( $param );
			},
		);

		return array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => array( $this, 'get_cluster_urls' ),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
			'args'                => $args,
		);
	}

	/**
	 * @param $request
	 * @param Urlslab_Data_Serp_Query $query
	 *
	 * @return Urlslab_Api_Table_Sql
	 */
	private function get_top_urls_sql( $request, Urlslab_Data_Serp_Query $query ): Urlslab_Api_Table_Sql {
		$domain_type = $request->get_param( 'domain_type' );
		$sql         = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( ( new Urlslab_Data_Serp_Url() )->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}
		$sql->add_select_column( 'position', 'p' );
		$sql->add_select_column( 'domain_type', 'd' );
		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' p' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON d.domain_id = p.domain_id' );

		$sql->add_filter_str( '(', 'AND' );
		$sql->add_filter_str( 'p.query_id=%d' );
		$sql->add_query_data( $query->get_query_id() );
		$sql->add_filter_str( 'AND p.country=%s' );
		$sql->add_query_data( $query->get_country() );
		if ( 'A' !== $domain_type ) {
			$sql->add_filter_str( 'AND d.domain_type=%s' );
			$sql->add_query_data( $domain_type );
		}
		$sql->add_filter_str( ')' );

		$columns = $this->prepare_columns( ( new Urlslab_Data_Serp_Url() )->get_columns(), 'u' );
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

		return $sql;
	}
}
