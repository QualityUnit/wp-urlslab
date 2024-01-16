<?php

class Urlslab_Api_Serp_Gap extends Urlslab_Api_Table {
	const SLUG = 'serp-gap';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_gap() );
		register_rest_route( self::NAMESPACE, $base . '/prepare', array( $this->get_route_prepare_urls() ) );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_gap() ) ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
			)
		);
	}

	public function update_item_permissions_check( $request ) {
		return parent::admin_permission_check( $request );
	}

	public function get_gap_count( WP_REST_Request $request ) {
		return new WP_REST_Response( $this->get_gap_sql( $request )->get_count(), 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_gap( $request ) {
		$rows = $this->get_gap_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			Urlslab_Api_Serp_Queries::normalize_query_row( $row );
			$row->rating = round( $row->rating, 1 );
			$properties  = get_object_vars( $row );
			foreach ( $properties as $id => $value ) {
				if ( false !== strpos( $id, 'position_' ) ) {
					$row->$id = (int) $value;
				} else if ( false !== strpos( $id, 'words_' ) ) {
					$row->$id = (int) $value;
				} else if ( $value && false !== strpos( $id, 'url_name_' ) ) {
					try {
						$url      = new Urlslab_Url( $value, true );
						$row->$id = $url->get_url_with_protocol();
					} catch ( Exception $e ) {
					}
				}
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function prepare_urls( $request ) {
		$urls = array();
		foreach ( $request->get_param( 'urls' ) as $id => $url_name ) {
			try {
				$url         = new Urlslab_Url( $url_name, true );
				$urls[ $id ] = array(
					'url'     => $url->get_url_with_protocol(),
					'message' => '',
					'status'  => 'ok',
				);
			} catch ( Exception $e ) {
				$urls[ $id ] = array(
					'url'     => $url_name,
					'message' => $e->getMessage(),
					'status'  => 'error',
				);
			}
		}

		$executor = Urlslab_Executor::get_executor( Urlslab_Executor_Download_Urls_Batch::TYPE );
		$task_row = new Urlslab_Data_Task(
			array(
				'slug'          => 'serp-gap',
				'executor_type' => Urlslab_Executor_Download_Urls_Batch::TYPE,
				'data'          => $request->get_param( 'urls' ),
			),
			false
		);
		$task_row->insert();
		$executor->set_max_execution_time( 25 );
		if ( ! $executor->execute( $task_row ) ) {
			$task_row->delete_task();

			return new WP_REST_Response( $urls, 404 );
		}

		$results = $executor->get_task_result( $task_row );
		foreach ( $results as $url_id => $url_result ) {
			if ( isset( $url_result['error'] ) ) {
				$all_valid_urls = false;
				foreach ( $urls as $id => $url_value ) {
					if ( $url_value['url'] === $url_result['url'] ) {
						$urls[ $id ]['message'] = $url_result['error'];
						$urls[ $id ]['status']  = 'error';
						break;
					}
				}
			}
		}

		$task_row->delete_task();

		//create intersections
		$executor = Urlslab_Executor::get_executor( Urlslab_Executor_Url_Intersection::TYPE );
		$task_row = new Urlslab_Data_Task(
			array(
				'slug'          => 'serp-gap',
				'executor_type' => Urlslab_Executor_Url_Intersection::TYPE,
				'data'          => array(
					'urls'          => $request->get_param( 'urls' ),
					'parse_headers' => $request->get_param( 'parse_headers' ),
					'ngrams'        => $request->get_param( 'ngrams' ),
				),
			),
			false
		);
		$task_row->insert();
		$executor->set_max_execution_time( 25 );
		$task_result = $executor->execute( $task_row );
		$task_row->delete_task();

		return new WP_REST_Response( $urls, $task_result ? 200 : 400 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Serp_Query( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'labels' );
	}

	protected function get_gap_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$urls      = array();
		$urlids    = array();
		$domainids = array();


		foreach ( $request->get_param( 'urls' ) as $id => $url_name ) {
			try {
				$url              = new Urlslab_Url( $url_name, true );
				$urlids[ $id ]    = $url->get_url_id();
				$domainids[ $id ] = $url->get_domain_id();
				$urls[ $id ]      = $url;
			} catch ( Exception $e ) {
				$urls[ $id ] = null;
			}
		}

		$hash_id = Urlslab_Data_Kw_Intersections::compute_hash_id( $request->get_param( 'urls' ), $request->get_param( 'parse_headers' ) );

		$serp_sql     = new Urlslab_Api_Table_Sql( $request );
		$query_object = new Urlslab_Data_Serp_Query();

		foreach ( array_keys( ( new Urlslab_Data_Serp_Query() )->get_columns() ) as $column ) {
			$serp_sql->add_select_column( $column, 'q' );
		}

		$serp_sql->add_select_column( 'rating', 'k' );

		$serp_sql->add_from( URLSLAB_SERP_QUERIES_TABLE . ' q' );
		if ( $request->get_param( 'show_keyword_cluster' ) ) {
			$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		} else {
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		}

		$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_INTERSECTIONS_TABLE . ' k ON k.query_id=q.query_id AND k.hash_id=' . $hash_id );

		$serp_columns = $this->prepare_columns( $query_object->get_columns(), 'q' );
		$word_columns = $this->prepare_columns( ( new Urlslab_Data_Kw_Intersections() )->get_columns(), 'k' );
		$columns      = $this->prepare_columns( $query_object->get_columns() );

		if ( $request->get_param( 'compare_domains' ) ) {
			//Performance reasons - more domains than 5 are not supported
			$valid_domains = 0;
			foreach ( $urls as $id => $url_obj ) {
				if ( null === $url_obj ) {
					$serp_sql->add_select_column( '0', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( '0', false, 'words_' . $id );
				} else {
					$valid_domains++;
					if ( 5 >= $valid_domains ) {
						$serp_sql->add_select_column( 'MIN(p' . $id . '.position)', false, 'position_' . $id );
						$serp_sql->add_select_column( 'url_name', 'u' . $id, 'url_name_' . $id );
						$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.domain_id=' . $url_obj->get_domain_id() );
						$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );
					} else {
						$serp_sql->add_select_column( '-1', false, 'position_' . $id );
						$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					}
					$serp_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $url_obj->get_url_id() . ' AND ku' . $id . '.query_id=q.query_id AND ku' . $id . '.hash_id=' . $hash_id );
				}
				$col          = $this->prepare_columns(
					array(
						'position_' . $id => '%d',
						'words_' . $id    => '%d',
						'url_name_' . $id => '%s',
					)
				);
				$serp_columns = array_merge( $serp_columns, $col );
				$word_columns = array_merge( $word_columns, $col );
				$columns      = array_merge( $columns, $col );

			}
			$serp_sql->add_filter_str( '(', 'AND' );
			$serp_sql->add_filter_str( 'q.country=%s' );
			$serp_sql->add_query_data( $request->get_param( 'country' ) );
			$serp_sql->add_filter_str( ')' );
			if ( ! $request->get_param( 'show_keyword_cluster' ) ) {
				$serp_sql->add_filter_str( ' AND (' );
				$serp_sql->add_filter_str( 'p.domain_id IN (' . implode( ',', $domainids ) . ')' );
				$serp_sql->add_filter_str( ')' );
			}
		} else {
			foreach ( $urls as $id => $url_obj ) {
				if ( null === $url_obj ) {
					$serp_sql->add_select_column( '0', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( '0', false, 'words_' . $id );
				} else {
					$serp_sql->add_select_column( 'p' . $id . '.position', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.url_id=' . $url_obj->get_url_id() );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $url_obj->get_url_id() . ' AND ku' . $id . '.query_id=q.query_id AND ku' . $id . '.hash_id=' . $hash_id );
				}
				$col          = $this->prepare_columns(
					array(
						'words_' . $id    => '%d',
						'position_' . $id => '%d',
						'url_name_' . $id => '%s',
					)
				);
				$serp_columns = array_merge( $serp_columns, $col );
				$word_columns = array_merge( $word_columns, $col );
				$columns      = array_merge( $columns, $col );
			}
			if ( ! $request->get_param( 'show_keyword_cluster' ) ) {
				$serp_sql->add_filter_str( '(', 'AND' );
				$serp_sql->add_filter_str( 'p.url_id IN (' . implode( ',', $urlids ) . ')' );
				$serp_sql->add_filter_str( ')' );
			}
		}

		$serp_sql->add_group_by( 'query_id', 'p' );

		if ( $request->get_param( 'show_keyword_cluster' ) ) {
			$query = new Urlslab_Data_Serp_Query( array( 'query' => $request->get_param( 'query' ) ) );
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq ON pq.query_id=' . $query->get_query_id() );
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq2 ON pq.url_id=pq2.url_id AND pq2.position<=' . $request->get_param( 'max_position' ) . ' AND pq.country=pq2.country AND q.query_id=pq2.query_id AND q.country=pq2.country' );
			$serp_sql->add_group_by( 'query_id', 'pq2' );
			$serp_sql->add_having_filter_str( '(' );
			$serp_sql->add_having_filter_str( 'COUNT(DISTINCT pq2.url_id)>=' . $request->get_param( 'matching_urls' ) );
			$serp_sql->add_having_filter_str( ')' );
		}

		$serp_columns = array_merge( $serp_columns, $this->prepare_columns( array( 'rating' => '%d' ) ) );
		$word_columns = array_merge(
			$word_columns,
			$this->prepare_columns(
				array(
					'comp_intersections' => '%d',
					'country_volume'     => '%d',
					'country_kd'         => '%s',
					'country_level'      => '%s',
					'country_high_bid'   => '%f',
					'country_low_bid'    => '%f',
					'country_vol_status' => '%s',
					'internal_links'     => '%d',
					'rating'             => '%d',
					'type'               => '%s',
				)
			)
		);
		$columns      = array_merge( $columns, $this->prepare_columns( array( 'rating' => '%d' ) ) );

		$serp_sql->add_having_filters( $serp_columns, $request );
		$serp_sql->set_limit( 5000 );

		$words_sql = new Urlslab_Api_Table_Sql( $request );

		foreach ( ( new Urlslab_Data_Serp_Query() )->get_columns() as $column => $format ) {
			switch ( $column ) {
				case 'query_id':
					$words_sql->add_select_column( 'query_id', 'k' );
					break;
				case 'query':
					$words_sql->add_select_column( 'query', 'k' );
					break;
				case 'comp_intersections':
					$words_sql->add_select_column( '-1', false, 'comp_intersections' );
					break;
				case 'internal_links':
					$words_sql->add_select_column( '-1', false, 'internal_links' );
					break;
				case 'type':
					$words_sql->add_select_column( "IFNULL(q.type, '-')", false, 'type', false );
					break;
				default:
					if ( '%s' === $format ) {
						$words_sql->add_select_column( 'NULL', false, $column, false );
					} else {
						$words_sql->add_select_column( '0', false, $column, false );
					}
					break;
			}
		}
		$words_sql->add_select_column( 'rating', 'k' );

		$words_sql->add_from( URLSLAB_KW_INTERSECTIONS_TABLE . ' k' );
		$words_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_QUERIES_TABLE . " q ON q.query_id=k.query_id AND q.country='" . esc_sql( $request->get_param( 'country' ) ) . "'" );
		foreach ( $urls as $id => $url_obj ) {
			$words_sql->add_select_column( '-2', false, 'position_' . $id );
			$words_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
			$words_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
			$words_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $url_obj->get_url_id() . ' AND ku' . $id . '.query_id=k.query_id AND ku' . $id . '.hash_id=' . $hash_id );
		}

		$words_sql->add_filter_str( '(', 'AND' );
		if ( $request->get_param( 'show_keyword_cluster' ) ) {
			$words_sql->set_limit( 0 );
			$words_sql->add_filter_str( 'k.hash_id=-1' ); //Skip words that are not in the cluster
		} else {
			$words_sql->add_filter_str( 'k.hash_id=' . $hash_id );
		}
		$words_sql->add_filter_str( ')' );


		$words_sql->add_having_filters( $word_columns, $request );

		$sql_union = new Urlslab_Api_Table_Sql( $request );
		$sql_union->add_select_column( '*' );
		$sql_union->add_from( '(' . $serp_sql->get_query() . ') serp' );
		$sql_union->add_from( 'UNION (' . $words_sql->get_query() . ')' );

		$sql_top = new Urlslab_Api_Table_Sql( $request );
		$sql_top->add_select_column( '*' );
		$sql_top->add_from( '(' . $sql_union->get_query() . ') un' );
		$sql_top->add_group_by( 'query_id' );

		$sql_top->add_sorting( $columns, $request );


		return $sql_top;
	}

	private function get_route_get_gap(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_gap' ),
			'args'                => array_merge(
				$this->get_table_arguments(),
				array(
					'compare_domains'      => array(
						'required'          => false,
						'default'           => false,
						'validate_callback' => function ( $param ) {
							return is_bool( $param );
						},
					),
					'parse_headers'        => array(
						'required'          => false,
						'default'           => array( 'title', 'h1', 'h2', 'h3' ),
						'validate_callback' => function ( $param ) {
							return is_array( $param );
						},
					),
					'ngrams'               => array(
						'required'          => false,
						'default'           => array( 1, 2, 3, 4, 5 ),
						'validate_callback' => function ( $param ) {
							return is_array( $param );
						},
					),
					'show_keyword_cluster' => array(
						'required'          => false,
						'default'           => false,
						'validate_callback' => function ( $param ) {
							return is_bool( $param ) || 0 === $param || 1 === $param;
						},
					),
					'urls'                 => array(
						'required'          => false,
						'default'           => array(),
						'validate_callback' => function ( $param ) {
							return is_array( $param ) && count( $param ) > 0 && count( $param ) < 16;
						},
					),
					'query'                => array(
						'required'          => false,
						'default'           => '',
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
					'country'              => array(
						'required'          => false,
						'default'           => 'us',
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && 5 > strlen( $param );
						},
					),
					'matching_urls'        => array(
						'required'          => false,
						'default'           => 5,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
					'max_position'         => array(
						'required'          => false,
						'default'           => 15,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
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

	private function get_route_prepare_urls(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'prepare_urls' ),
			'args'                => array_merge(
				$this->get_table_arguments(),
				array(
					'urls'          => array(
						'required'          => false,
						'default'           => array(),
						'validate_callback' => function ( $param ) {
							return is_array( $param ) && count( $param ) > 0 && count( $param ) < 16;
						},
					),
					'parse_headers' => array(
						'required'          => false,
						'default'           => array( 'title', 'h1', 'h2', 'h3' ),
						'validate_callback' => function ( $param ) {
							return is_array( $param );
						},
					),
					'ngrams'        => array(
						'required'          => false,
						'default'           => array( 1, 2, 3, 4, 5 ),
						'validate_callback' => function ( $param ) {
							return is_array( $param );
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
