<?php

class Urlslab_Api_Serp_Urls extends Urlslab_Api_Table {
	const SLUG = 'serp-urls';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route( self::NAMESPACE, $base . '/url/queries', $this->get_route_get_url_queries() );
		register_rest_route( self::NAMESPACE, $base . '/url/queries/count', $this->get_count_route( array( $this->get_route_get_url_queries() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/url/similar-urls', $this->get_route_get_similar_urls() );
		register_rest_route( self::NAMESPACE, $base . '/url/similar-urls/count', $this->get_count_route( array( $this->get_route_get_similar_urls() ) ) );
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
			$row->url_id                = (int) $row->url_id;
			$row->domain_id             = (int) $row->domain_id;
			$row->top100_queries_cnt    = (int) $row->top100_queries_cnt;
			$row->top10_queries_cnt     = (int) $row->top10_queries_cnt;
			$row->best_position         = (int) $row->best_position;
			$row->comp_intersections    = (int) $row->comp_intersections;
			$row->country_volume        = (int) $row->country_volume;
			$row->country_value         = (int) $row->country_value;
			$row->my_urls_ranked_top10  = (int) $row->my_urls_ranked_top10;
			$row->my_urls_ranked_top100 = (int) $row->my_urls_ranked_top100;
			$row->top_queries           = explode( ',', $row->top_queries );
			try {
				$row->url_name = ( new Urlslab_Url( $row->url_name, true ) )->get_url_with_protocol();
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}


	private function prepare_request_url_queries( WP_REST_Request $request ): bool {
		$url     = new Urlslab_Url( $request->get_param( 'url' ), true );
		$url_row = new Urlslab_Data_Serp_Url( array( 'url_id' => $url->get_url_id() ) );
		if ( ! $url_row->load() ) {
			return false;
		}

		$body = $request->get_json_params();
		if ( ! isset( $body['filters'] ) || ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}
		$body['filters'][] = array(
			'col' => 'url_id',
			'op'  => '=',
			'val' => $url->get_url_id(),
		);
		$request->set_body( json_encode( $body ) );

		return true;
	}

	public function get_url_queries_count( WP_REST_Request $request ) {
		if ( ! $this->prepare_request_url_queries( $request ) ) {
			return new WP_REST_Response( 0, 200 );
		}

		return new WP_REST_Response( $this->get_url_queries_sql( $request )->get_count(), 200 );
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_url_queries( $request ) {
		if ( ! $this->prepare_request_url_queries( $request ) ) {
			return new WP_REST_Response( __( 'URL does not exit' ), 404 );
		}

		$rows = $this->get_url_queries_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->query_id           = (int) $row->query_id;
			$row->position           = (int) $row->position;
			$row->my_position        = round( (float) $row->my_position, 1 );
			$row->comp_intersections = (int) $row->comp_intersections;
			$row->internal_links     = (int) $row->internal_links;
			$row->country_volume     = (int) $row->country_volume;
			$row->my_urls            = Urlslab_Url::enhance_urls_with_protocol( $row->my_urls );
			$row->comp_urls          = Urlslab_Url::enhance_urls_with_protocol( $row->comp_urls );
			$row->country_kd         = (int) $row->country_kd;
			$row->country_high_bid   = round( (float) $row->country_high_bid, 2 );
			$row->country_low_bid    = round( (float) $row->country_low_bid, 2 );
			if ( strlen( $row->country_monthly_volumes ) ) {
				$row->country_monthly_volumes = null;
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}


	private function prepare_request_similar_urls( $request ): bool {
		$url     = new Urlslab_Url( $request->get_param( 'url' ), true );
		$url_row = new Urlslab_Data_Serp_Url( array( 'url_id' => $url->get_url_id() ) );
		if ( ! $url_row->load() ) {
			return false;
		}

		$body = $request->get_json_params();
		if ( ! isset( $body['filters'] ) || ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}
		$body['filters'][] = array(
			'col' => 'url_id',
			'op'  => '=',
			'val' => $url->get_url_id(),
		);
		if ( strlen( $request->get_param( 'domain_type' ) ) ) {
			$body['filters'][] = array(
				'col' => 'domain_type',
				'op'  => '=',
				'val' => $request->get_param( 'domain_type' ),
			);
		}
		$request->set_body( json_encode( $body ) );

		return true;
	}


	public function get_similar_urls_count( WP_REST_Request $request ) {
		if ( ! $this->prepare_request_similar_urls( $request ) ) {
			return new WP_REST_Response( 0, 200 );
		}

		return new WP_REST_Response( $this->get_similar_urls_sql( $request )->get_count(), 200 );
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_similar_urls( $request ) {
		if ( ! $this->prepare_request_similar_urls( $request ) ) {
			return new WP_REST_Response( __( 'URL does not exit' ), 404 );
		}

		$rows = $this->get_similar_urls_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id             = (int) $row->url_id;
			$row->comp_intersections = (int) $row->comp_intersections;
			$row->country_volume     = (int) $row->country_volume;
			$row->country_value      = (int) $row->country_value;
			$row->cnt_queries        = (int) $row->cnt_queries;
			$row->url_name           = ( new Urlslab_Url( $row->url_name, true ) )->get_url_with_protocol();
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Serp_Url( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}
		$sql->add_select_column( 'domain_type', 'd' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' u' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON u.domain_id = d.domain_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'u' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'domain_type' => '%s' ) ) );

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}


	protected function get_url_queries_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql     = new Urlslab_Api_Table_Sql( $request );
		$rob_obj = new Urlslab_Data_Serp_Query();
		foreach ( array_keys( $rob_obj->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}
		$sql->add_select_column( 'position', 'p' );

		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' p' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON p.query_id=q.query_id AND p.country=q.country' );

		$columns = $this->prepare_columns( $rob_obj->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'url_id'   => '%d',
					'position' => '%d',
				)
			)
		);
		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	protected function get_similar_urls_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql     = new Urlslab_Api_Table_Sql( $request );
		$rob_obj = new Urlslab_Data_Serp_Url();
		foreach ( array_keys( $rob_obj->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}
		$sql->add_select_column( 'url_id', 'p', 'p_url_id' );
		$sql->add_select_column( 'domain_type', 'd' );
		$sql->add_select_column( 'COUNT(DISTINCT p.query_id)', false, 'cnt_queries' );

		$sql->add_from( URLSLAB_SERP_POSITIONS_TABLE . ' p' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p2 ON p.query_id=p2.query_id AND p.country=p2.country AND p.url_id<>p2.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON p2.url_id=u.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON u.domain_id=d.domain_id' );

		$columns = $this->prepare_columns( $rob_obj->get_columns(), 'u' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'url_id' => '%d',
				),
				'p'
			)
		);
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'cnt_queries' => '%d',
				)
			)
		);
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'domain_type' => '%s',
				),
				'd'
			)
		);

		//SQL speed optimization ... having filter is too slow
		if ( isset( $request->get_json_params()['filters'] ) && is_array( $request->get_json_params()['filters'] ) ) {
			foreach ( $request->get_json_params()['filters'] as $filter ) {
				if ( isset( $filter['col'] ) ) {
					if ( 'url_id' === $filter['col'] ) {
						$sql->add_filter_str( '(', 'AND' );
						$sql->add_filter_str( 'p.url_id=' . esc_sql( $filter['val'] ) );
						$sql->add_filter_str( ')' );
					}
					if ( 'domain_type' === $filter['col'] ) {
						$sql->add_filter_str( '(', 'AND' );
						$sql->add_filter_str( "d.domain_type='" . esc_sql( $filter['val'] ) . "'" );
						$sql->add_filter_str( ')' );
					}
				}
			}
		}


		$sql->add_group_by( 'url_id', 'u' );
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

	private function get_route_get_url_queries() {
		$args        = $this->get_table_arguments();
		$args['url'] = array(
			'required'          => true,
			'validate_callback' => function( $param ) {
				return is_string( $param );
			},
		);

		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_url_queries' ),
			'args'                => $args,
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}

	private function get_route_get_similar_urls() {
		$args        = $this->get_table_arguments();
		$args['url'] = array(
			'required'          => true,
			'validate_callback' => function( $param ) {
				return is_string( $param );
			},
		);

		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_similar_urls' ),
			'args'                => $args,
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}

}
