<?php

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
			$base . '/query_cluster',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
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
	public function get_query_cluster( $request ) {
		$query = new Urlslab_Serp_Query_Row( array( 'query' => $request->get_param( 'query' ) ) );
		if ( ! $query->load() ) {
			return new WP_REST_Response( __( 'Query not found' ), 404 );
		}

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT q.* FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' a' . // phpcs:ignore
				' INNER JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' b ON a.url_id = b.url_id AND a.position<%d AND b.position<%d' . // phpcs:ignore
				' INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = b.query_id' . // phpcs:ignore
				' WHERE a.query_id=%d GROUP BY a.query_id, b.query_id HAVING COUNT(*) > %d',
				$request->get_param( 'max_position' ),
				$request->get_param( 'max_position' ),
				$query->get_query_id(),
				$request->get_param( 'competitors' )
			),
			ARRAY_A
		);

		$rows = array();
		foreach ( $results as $result ) {
			$row    = new Urlslab_Serp_Query_Row( $result );
			$rows[] = (object) $row->as_array();
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
			try {
				if ( ! empty( $row->my_url_name ) ) {
					$url              = new Urlslab_Url( $row->my_url_name, true );
					$row->my_url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {
			}
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
		return array( 'status' );
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
		$sql->add_select_column( 'position', 'p', 'my_position' );
		$sql->add_select_column( 'impressions', 'p', 'my_impressions' );
		$sql->add_select_column( 'clicks', 'p', 'my_clicks' );
		$sql->add_select_column( 'ctr', 'p', 'my_ctr' );
		$sql->add_select_column( 'url_name', 'u', 'my_url_name' );

		$sql->add_select_column( 'MIN(cp.position)', false, 'comp_position' );
		$sql->add_select_column( 'COUNT(DISTINCT cp.domain_id)', false, 'comp_count' );
		$sql->add_select_column( 'url_name', 'cu', 'comp_url_name' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' q' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p ON q.query_id = p.query_id AND p.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) ) . ')' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON p.url_id=u.url_id' );

		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' cp ON q.query_id = cp.query_id AND cp.position<11 AND cp.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . ')' );
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

}
