<?php

class Urlslab_Api_Serp_Gap extends Urlslab_Api_Table {
	const SLUG = 'serp-gap';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_gap() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_gap() ) ) );
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
			$row->query_id = (int) $row->query_id;
			$row->type     = $row->type ?? '-';
			$row->rating   = round( $row->rating, 1 );
			$properties    = get_object_vars( $row );
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

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Query_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'labels' );
	}

	protected function get_gap_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$urls = array();

		$compare_domains = true === $request->get_param( 'compare_domains' ) || 1 === $request->get_param( 'compare_domains' ) || 'true' === $request->get_param( 'compare_domains' );

		if ( $compare_domains ) {
			foreach ( $request->get_param( 'urls' ) as $id => $domain_name ) {
				try {
					$url = new Urlslab_Url( $domain_name, true );
					$row = new Urlslab_Serp_Domain_Row( array( 'domain_id' => $url->get_domain_id() ) );
					if ( $row->load() ) {
						$urls[ $id ] = $row->get_domain_id();
					} else {
						$urls[ $id ] = 0;
					}
				} catch ( Exception $e ) {
					$urls[ $id ] = 0;
				}
			}
		} else {
			foreach ( $request->get_param( 'urls' ) as $id => $url_name ) {
				try {
					$url = new Urlslab_Url( $url_name, true );
					$row = new Urlslab_Serp_Url_Row( array( 'url_id' => $url->get_url_id() ) );
					if ( $row->load() ) {
						$urls[ $id ] = $row->get_url_id();
					} else {
						$urls[ $id ] = 0;
					}
				} catch ( Exception $e ) {
					$urls[ $id ] = 0;
				}
			}
		}

		if ( empty( $urls ) ) {
			$no_sql = new Urlslab_Api_Table_Sql( $request );
			$no_sql->add_select_column( 'NULL' );

			return $no_sql;
		}


		$hash_id = Urlslab_Kw_Intersections_Row::compute_hash_id( $request->get_param( 'urls' ) );
		$task_id = get_transient( 'urlslab_kw_intersections_' . $hash_id );

		$executor = Urlslab_Executor::get_executor( 'url_intersect' );
		$executor->set_max_execution_time( 25 );
		$task_row = new Urlslab_Task_Row(
			array(
				'task_id'       => $task_id,
				'slug'          => 'serp-gap',
				'executor_type' => Urlslab_Executor_Url_Intersection::TYPE,
				'data'          => $request->get_param( 'urls' ),
			),
			false
		);
		if ( ! $task_row->load() ) {
			$task_row->insert();
		}
		if ( $executor->execute( $task_row ) ) {
			$task_row->delete_task();
			$task_id = true;
		}


		$serp_sql     = new Urlslab_Api_Table_Sql( $request );
		$query_object = new Urlslab_Serp_Query_Row();
		$serp_sql->add_select_column( 'query_id', 'q' );
		$serp_sql->add_select_column( 'type', 'q' );
		$serp_sql->add_select_column( 'query', 'q' );
		$serp_sql->add_select_column( 'labels', 'q' );
		$serp_sql->add_select_column( 'comp_intersections', 'q' );
		$serp_sql->add_select_column( 'internal_links', 'q' );

		if ( $task_id ) {
			$serp_sql->add_select_column( 'rating', 'k' );
		} else {
			$serp_sql->add_select_column( '0', false, 'rating' );
		}

		$serp_sql->add_from( URLSLAB_SERP_QUERIES_TABLE . ' q' );
		if ( strlen( $request->get_param( 'query' ) ) ) {
			$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		} else {
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		}

		if ( $task_id ) {
			$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_INTERSECTIONS_TABLE . ' k ON k.query_id=q.query_id AND k.hash_id=' . $hash_id );
		}

		$serp_columns = $this->prepare_columns( $query_object->get_columns(), 'q' );
		$word_columns = $this->prepare_columns( ( new Urlslab_Kw_Intersections_Row() )->get_columns(), 'k' );
		$columns      = $this->prepare_columns( $query_object->get_columns() );

		if ( $compare_domains ) {
			//Performance reasons - more domains than 5 are not supported
			$valid_domains = 0;
			foreach ( $urls as $id => $domain_id ) {
				if ( 0 === $domain_id ) {
					$serp_sql->add_select_column( '0', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( '0', false, 'words_' . $id );
				} else if ( $valid_domains >= 5 ) {
					$serp_sql->add_select_column( '-1', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( '0', false, 'words_' . $id );
				} else {
					$valid_domains ++;
					$serp_sql->add_select_column( 'MIN(p' . $id . '.position)', false, 'position_' . $id );
					$serp_sql->add_select_column( 'url_name', 'u' . $id, 'url_name_' . $id );
					if ( $task_id ) {
						$serp_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
					} else {
						$serp_sql->add_select_column( '0', false, 'words_' . $id );
					}
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.domain_id=' . $domain_id );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );
					if ( $task_id ) {
						$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $domain_id . ' AND ku' . $id . '.query_id=k.query_id AND ku' . $id . '.hash_id=' . $hash_id );
					}
				}
				$serp_columns = array_merge(
					$serp_columns,
					$this->prepare_columns(
						array(
							'position_' . $id => '%d',
							'words_' . $id    => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);

				$word_columns = array_merge(
					$word_columns,
					$this->prepare_columns(
						array(
							'position_' . $id => '%d',
							'words_' . $id    => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
				$columns      = array_merge(
					$columns,
					$this->prepare_columns(
						array(
							'position_' . $id => '%d',
							'words_' . $id    => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);

			}
			$serp_sql->add_filter_str( '(' );
			$serp_sql->add_filter_str( 'q.country=%s' );
			$serp_sql->add_query_data( $request->get_param( 'country' ) );
			$serp_sql->add_filter_str( ')' );
			if ( ! strlen( $request->get_param( 'query' ) ) ) {
				$serp_sql->add_filter_str( ' AND (' );
				$serp_sql->add_filter_str( 'p.domain_id IN (' . implode( ',', $urls ) . ')' );
				$serp_sql->add_filter_str( ')' );
			}
		} else {
			foreach ( $urls as $id => $url_id ) {
				if ( 0 === $url_id ) {
					$serp_sql->add_select_column( '0', false, 'position_' . $id );
					$serp_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
					$serp_sql->add_select_column( '0', false, 'words_' . $id );
				} else {
					$serp_sql->add_select_column( 'p' . $id . '.position', false, 'position_' . $id );
					$serp_sql->add_select_column( 'url_name', 'u' . $id, 'url_name_' . $id );
					if ( $task_id ) {
						$serp_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
					} else {
						$serp_sql->add_select_column( '0', false, 'words_' . $id );
					}
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.url_id=' . $url_id );
					$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );

					if ( $task_id ) {
						$serp_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $url_id . ' AND ku' . $id . '.query_id=q.query_id AND ku' . $id . '.hash_id=' . $hash_id );
					}
				}
				$serp_columns = array_merge(
					$serp_columns,
					$this->prepare_columns(
						array(
							'words_' . $id    => '%d',
							'position_' . $id => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
				$word_columns = array_merge(
					$word_columns,
					$this->prepare_columns(
						array(
							'words_' . $id    => '%d',
							'position_' . $id => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
				$columns      = array_merge(
					$columns,
					$this->prepare_columns(
						array(
							'words_' . $id    => '%d',
							'position_' . $id => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
			}
			if ( ! strlen( $request->get_param( 'query' ) ) ) {
				$serp_sql->add_filter_str( '(' );
				$serp_sql->add_filter_str( 'p.url_id IN (' . implode( ',', $urls ) . ')' );
				$serp_sql->add_filter_str( ')' );
			}
		}

		$serp_sql->add_group_by( 'query_id', 'p' );

		if ( strlen( $request->get_param( 'query' ) ) ) {
			$query = new Urlslab_Serp_Query_Row( array( 'query' => $request->get_param( 'query' ) ) );
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq ON pq.query_id=%d' );
			$serp_sql->add_query_data( $query->get_query_id() );
			$serp_sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq2 ON pq.url_id=pq2.url_id AND pq2.position<=%d AND pq.country=pq2.country AND q.query_id=pq2.query_id AND q.country=pq2.country' );
			$serp_sql->add_query_data( $request->get_param( 'max_position' ) );
			$serp_sql->add_group_by( 'query_id', 'pq2' );
			$serp_sql->add_having_filter_str( '(' );
			$serp_sql->add_having_filter_str( 'COUNT(DISTINCT pq2.url_id)>=%d' );
			$serp_sql->add_having_filter_str( ')' );
			$serp_sql->add_query_data( $request->get_param( 'matching_urls' ) );
		}

		$serp_columns = array_merge( $serp_columns, $this->prepare_columns( array( 'rating' => '%d' ) ) );
		$word_columns = array_merge( $word_columns, $this->prepare_columns( array( 'rating' => '%d' ) ) );
		$columns      = array_merge( $columns, $this->prepare_columns( array( 'rating' => '%d' ) ) );

		$serp_sql->add_having_filters( $serp_columns, $request );

		$words_sql = new Urlslab_Api_Table_Sql( $request );
		$words_sql->add_select_column( 'query_id', 'k' );
		$words_sql->add_select_column( 'NULL', false, 'type' );
		$words_sql->add_select_column( 'query', 'k' );
		$words_sql->add_select_column( 'NULL', false, 'labels' );
		$words_sql->add_select_column( '-1', false, 'comp_intersections' );
		$words_sql->add_select_column( '-1', false, 'internal_links' );
		$words_sql->add_select_column( 'rating', 'k' );

		$words_sql->add_from( URLSLAB_KW_INTERSECTIONS_TABLE . ' k' );
		foreach ( $urls as $id => $url_id ) {
			$words_sql->add_select_column( '-2', false, 'position_' . $id );
			$words_sql->add_select_column( 'NULL', false, 'url_name_' . $id );
			$words_sql->add_select_column( 'ku' . $id . '.words', false, 'words_' . $id );
			$words_sql->add_from( 'LEFT JOIN ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE . ' ku' . $id . ' ON ku' . $id . '.url_id=' . $url_id . ' AND ku' . $id . '.query_id=k.query_id AND ku' . $id . '.hash_id=' . $hash_id );
		}

		$words_sql->add_filter_str( '(' );
		$words_sql->add_filter_str( 'k.hash_id=' . $hash_id );
		$words_sql->add_filter_str( ')' );
		$words_sql->add_having_filters( $word_columns, $request );

		$sql_union = new Urlslab_Api_Table_Sql( $request );
		$sql_union->add_select_column( '*' );
		$sql_union->add_from( '(' . $serp_sql->get_query() . ') serp' );
		$sql_union->add_from( 'UNION (' . $words_sql->get_query() . ')' );

		$sql_union->add_sorting( $columns, $request );

		return $sql_union;
	}

	private function get_route_get_gap(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_gap' ),
			'args'                => array_merge(
				$this->get_table_arguments(),
				array(
					'compare_domains' => array(
						'required'          => false,
						'default'           => false,
						'validate_callback' => function( $param ) {
							return is_bool( $param ) || 'true' === $param || 'false' === $param || 0 === $param || 1 === $param;
						},
					),
					'urls'            => array(
						'required'          => false,
						'default'           => array(),
						'validate_callback' => function( $param ) {
							return is_array( $param );
						},
					),
					'query'           => array(
						'required'          => false,
						'default'           => '',
						'validate_callback' => function( $param ) {
							return is_string( $param );
						},
					),
					'country'         => array(
						'required'          => false,
						'default'           => 'us',
						'validate_callback' => function( $param ) {
							return is_string( $param ) && 5 > strlen( $param );
						},
					),
					'matching_urls'   => array(
						'required'          => false,
						'default'           => 5,
						'validate_callback' => function( $param ) {
							return is_numeric( $param );
						},
					),
					'max_position'    => array(
						'required'          => false,
						'default'           => 15,
						'validate_callback' => function( $param ) {
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

}
