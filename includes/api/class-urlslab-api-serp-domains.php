<?php

class Urlslab_Api_Serp_Domains extends Urlslab_Api_Table {
	const SLUG = 'serp-domains';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );

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
			$base . '/(?P<domain_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'domain_type' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN:
									case Urlslab_Serp_Domain_Row::TYPE_COMPETITOR:
									case Urlslab_Serp_Domain_Row::TYPE_OTHER:
									case Urlslab_Serp_Domain_Row::TYPE_IGNORED:
										return true;

									default:
										return false;
								}
							},
						),
					),
				),
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/gap/', $this->get_route_get_gap() );
	}

	public function update_item_permissions_check( $request ) {
		return parent::admin_permission_check( $request );
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'domain_type' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN:
							case Urlslab_Serp_Domain_Row::TYPE_COMPETITOR:
							case Urlslab_Serp_Domain_Row::TYPE_IGNORED:
								return true;

							default:
								return false;
						}
					},
				),
				'domain_name' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( trim( $param ) ) > 0;
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
	public function create_item( $request ) {
		try {
			/**
			 * @var Urlslab_Serp_Domain_Row $row
			 */
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

			$domains = preg_split( '/\r\n|\r|\n/', $row->get_domain_name() );
			foreach ( $domains as $domain ) {
				$domain = trim( $domain );
				if ( ! empty( $domain ) ) {
					$row->set_domain_name( $domain );
					$row->insert();
					$this->on_items_updated( array( $row ) );
				}
			}

			return new WP_REST_Response( $row->as_array(), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
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
			$row->domain_id   = (int) $row->domain_id;
			$row->top_100_cnt = (int) $row->top_100_cnt;
			try {
				$url              = new Urlslab_Url( $row->domain_name, true );
				$row->domain_name = $url->get_url_with_protocol();
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_gap( $request ) {
		$domain_ids = array();
		$urls       = array();

		foreach ( $request->get_param( 'domains' ) as $id => $domain_name ) {
			try {
				$url = new Urlslab_Url( $domain_name, true );
				$row = new Urlslab_Serp_Domain_Row( array( 'domain_id' => $url->get_domain_id() ) );
				if ( $row->load() ) {
					$domain_ids[ $id ] = $row->get_domain_id();
				} else {
					throw new Exception( __( 'Domain not found', 'urlslab' ) );
				}
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Invalid domain: ', 'urlslab' ) . $domain_name, array( 'status' => 404 ) );
			}
		}
		foreach ( $request->get_param( 'urls' ) as $id => $url_name ) {
			try {
				$url = new Urlslab_Url( $url_name, true );
				$row = new Urlslab_Serp_Url_Row( array( 'url_id' => $url->get_url_id() ) );
				if ( $row->load() ) {
					$urls[ $id ] = $row->get_url_id();
				} else {
					throw new Exception( __( 'URL not found', 'urlslab' ) );
				}
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Invalid URL: ', 'urlslab' ) . $url_name, array( 'status' => 404 ) );
			}
		}

		if ( empty( $domain_ids ) && empty( $urls ) ) {
			return new WP_REST_Response( array(), 200 );
		}

		$rows = $this->get_gap_sql( $request, $domain_ids, $urls )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->query_id = (int) $row->query_id;
			$properties = get_object_vars( $row );
			foreach ($properties as $id => $value) {
				if (strpos($id, 'position_') !== false) {
					$row->$id = (int) $value;
				} else if ($value && strpos($id, 'url_name_') !== false) {
					try {
						$url = new Urlslab_Url( $value, true );
						$row->$id = $url->get_url_with_protocol();
					} catch ( Exception $e ) {
					}
				}
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Domain_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'domain_type', 'domain_name' );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		global $wpdb;
		$positions_count = $wpdb->get_var( 'SELECT COUNT(*) FROM ' . URLSLAB_SERP_POSITIONS_TABLE ); // phpcs:ignore

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'd' );
		}

		$sql->add_from( $this->get_row_object()->get_table_name() . ' d' );

		if ( 0 === $positions_count ) {
			$sql->add_select_column( '0', false, 'top_100_cnt' );
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		} else if ( 1000 < $positions_count ) {
			$sql->add_select_column( 'COUNT(*)', false, 'top_100_cnt' );
			$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		} else {
			$sql->add_select_column( 'COUNT(*)', false, 'top_100_cnt' );
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		}


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'd' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'top_100_cnt' => '%d',
				)
			)
		);

		$sql->add_group_by( 'domain_id', 'd' );
		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	protected function get_gap_sql( WP_REST_Request $request, array $domain_ids, array $urls ): Urlslab_Api_Table_Sql {
		$sql          = new Urlslab_Api_Table_Sql( $request );
		$query_object = new Urlslab_Serp_Query_Row();
		$sql->add_select_column( 'query_id', 'q' );
		$sql->add_select_column( 'country', 'q' );
		$sql->add_select_column( 'query', 'q' );
		$sql->add_select_column( 'comp_intersections', 'q' );
		$sql->add_select_column( 'internal_links', 'q' );
		$sql->add_from( URLSLAB_SERP_QUERIES_TABLE . ' q' );
		if ( strlen( $request->get_param( 'query' ) ) ) {
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		} else {
			$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.query_id=q.query_id AND p.country=q.country' );
		}
		$columns = $this->prepare_columns( $query_object->get_columns(), 'q' );
		if ( ! empty( $domain_ids ) ) {
			foreach ( $domain_ids as $id => $domain_id ) {
				$sql->add_select_column( 'MIN(p' . $id . '.position)', false, 'position_' . $id );
				$sql->add_select_column( 'url_name', 'u' . $id, 'url_name_' . $id );
				$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.domain_id=%d' );
				$sql->add_query_data( $domain_id );
				$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );

				$columns = array_merge(
					$columns,
					$this->prepare_columns(
						array(
							'position_' . $id => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
			}
			if ( ! strlen( $request->get_param( 'query' ) ) ) {
				$sql->add_filter_str( '(' );
				$sql->add_filter_str( 'p.domain_id IN (' . implode( ',', $domain_ids ) . ')' );
				$sql->add_filter_str( ')' );
			}
		} else {
			foreach ( $urls as $id => $url_id ) {
				$sql->add_select_column( 'p' . $id . '.position', false, 'position_' . $id );
				$sql->add_select_column( 'url_name', 'u' . $id, 'url_name_' . $id );
				$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p' . $id . ' ON p' . $id . '.query_id=p.query_id AND p' . $id . '.country=p.country AND p' . $id . '.url_id=%d' );
				$sql->add_query_data( $url_id );
				$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u' . $id . ' ON p' . $id . '.url_id=u' . $id . '.url_id' );

				$columns = array_merge(
					$columns,
					$this->prepare_columns(
						array(
							'position_' . $id => '%d',
							'url_name_' . $id => '%s',
						)
					)
				);
			}
			if ( ! strlen( $request->get_param( 'query' ) ) ) {
				$sql->add_filter_str( '(' );
				$sql->add_filter_str( 'p.url_id IN (' . implode( ',', $urls ) . ')' );
				$sql->add_filter_str( ')' );
			}
		}

		$sql->add_group_by( 'query_id', 'p' );
		$sql->add_group_by( 'country', 'p' );

		if ( strlen( $request->get_param( 'query' ) ) ) {
			$query = new Urlslab_Serp_Query_Row( array( 'query' => $request->get_param( 'query' ) ) );
			$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq ON pq.query_id=%d' );
			$sql->add_query_data( $query->get_query_id() );
			$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pq2 ON pq.url_id=pq2.url_id AND pq2.position<=%d AND pq.country=pq2.country AND q.query_id=pq2.query_id AND q.country=pq2.country' );
			$sql->add_query_data( $request->get_param( 'max_position' ) );
			$sql->add_group_by( 'query_id', 'pq2' );
			$sql->add_group_by( 'country', 'pq2' );
			$sql->add_having_filter_str( '(' );
			$sql->add_having_filter_str( 'COUNT(DISTINCT pq2.url_id)>=%d' );
			$sql->add_having_filter_str( ')' );
			$sql->add_query_data( $request->get_param( 'matching_urls' ) );
		}


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

	private function get_route_get_gap(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_gap' ),
			'args'                => array_merge(
				$this->get_table_arguments(),
				array(
					'domains'       => array(
						'required'          => false,
						'default'           => array(),
						'validate_callback' => function( $param ) {
							return is_array( $param );
						},
					),
					'urls'          => array(
						'required'          => false,
						'default'           => array(),
						'validate_callback' => function( $param ) {
							return is_array( $param );
						},
					),
					'query'         => array(
						'required'          => false,
						'default'           => '',
						'validate_callback' => function( $param ) {
							return is_string( $param );
						},
					),
					'matching_urls' => array(
						'required'          => false,
						'default'           => 5,
						'validate_callback' => function( $param ) {
							return is_numeric( $param );
						},
					),
					'max_position'  => array(
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
