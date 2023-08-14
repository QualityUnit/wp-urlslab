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


	}

	public function update_item_permissions_check( $request ) {
		return parent::update_item_permissions_check( $request ) && current_user_can( self::CAPABILITY_ADMINISTRATION );
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
			$row->avg_pos     = round( (float) $row->avg_pos, 1 );
			$row->top_10_cnt  = (int) $row->top_10_cnt;
			$row->top_100_cnt = (int) $row->top_100_cnt;
			try {
				$url              = new Urlslab_Url( $row->domain_name, true );
				$row->domain_name = $url->get_url_with_protocol();
			} catch ( Exception $e ) {
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
		$positions_count = $wpdb->get_var( 'SELECT COUNT(*) FROM ' . URLSLAB_GSC_POSITIONS_TABLE ); // phpcs:ignore

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'd' );
		}

		$sql->add_from( $this->get_row_object()->get_table_name() . ' d' );

		if ( 0 === $positions_count ) {
			$sql->add_select_column( '0', false, 'top_100_cnt' );
			$sql->add_select_column( '0', false, 'top_10_cnt' );
			$sql->add_select_column( '0', false, 'avg_pos' );
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		} else if ( 1000 < $positions_count ) {
			$sql->add_select_column( 'SUM(CASE WHEN position <= 100 THEN 1 ELSE 0 END)', false, 'top_100_cnt' );
			$sql->add_select_column( 'SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END)', false, 'top_10_cnt' );
			$sql->add_select_column( 'AVG(position)', false, 'avg_pos' );
			$sql->add_from( 'INNER JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		} else {
			$sql->add_select_column( 'SUM(CASE WHEN position <= 100 THEN 1 ELSE 0 END)', false, 'top_100_cnt' );
			$sql->add_select_column( 'SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END)', false, 'top_10_cnt' );
			$sql->add_select_column( 'AVG(position)', false, 'avg_pos' );
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		}


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'd' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'top_100_cnt' => '%d',
					'top_10_cnt'  => '%d',
					'avg_pos'     => '%d',
				)
			)
		);

		$sql->add_group_by( 'domain_id', 'd' );
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
}
