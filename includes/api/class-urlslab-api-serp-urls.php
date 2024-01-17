<?php

class Urlslab_Api_Serp_Urls extends Urlslab_Api_Table {
	const SLUG = 'serp-urls';

	public static function normalize_url_row( $row ) {
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

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
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

		register_rest_route( self::NAMESPACE, $base . '/url/queries', $this->get_route_get_url_queries() );
		register_rest_route( self::NAMESPACE, $base . '/url/queries/count', $this->get_count_route( array( $this->get_route_get_url_queries() ) ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/url/queries/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_filter_url_queries_columns',
				)
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/url/similar-urls', $this->get_route_get_similar_urls() );
		register_rest_route( self::NAMESPACE, $base . '/url/similar-urls/count', $this->get_count_route( array( $this->get_route_get_similar_urls() ) ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/url/similar-urls/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_similar_urls_sorting_columns',
				)
			)
		);
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
			self::normalize_url_row( $row );
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
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'URL does not exit', 'urlslab' ),
				), 
				404 
			);
		}

		$rows = $this->get_url_queries_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			Urlslab_Api_Serp_Queries::normalize_query_row( $row );
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
		if ( strlen( $request->get_param( 'domain_type' ) ) && 'A' !== $request->get_param( 'domain_type' ) ) {
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
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'URL does not exit', 'urlslab' ),
				), 
				404 
			);
		}

		$rows = $this->get_similar_urls_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			self::normalize_url_row( $row );
			$row->cnt_queries = (int) $row->cnt_queries;
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

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return array_merge(
			$this->prepare_columns( $this->get_row_object()->get_columns(), 'u' ),
			$this->prepare_columns( array( 'domain_type' => '%s' ), 'd' )
		);
	}

	public function get_column_type( string $column, $format ) {
		if ( 'domain_type' === $column ) {
			return Urlslab_Data::COLUMN_TYPE_ENUM;
		}
		$obj = new Urlslab_Data_Serp_Query();
		if ( array_key_exists( $column, $obj->get_columns() ) ) {
			return $obj->get_column_type( $column, $format );
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'domain_type':
				return ( new Urlslab_Data_Serp_Domain() )->get_enum_column_items( $column );
		}

		$obj = new Urlslab_Data_Serp_Query();
		if ( array_key_exists( $column, $obj->get_columns() ) ) {
			return $obj->get_enum_column_items( $column );
		}

		return parent::get_enum_column_items( $column );
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

		$sql->add_filters( $this->get_filter_url_queries_columns(), $request );
		$sql->add_sorting( $this->get_filter_url_queries_columns(), $request );

		return $sql;
	}

	public function get_filter_url_queries_columns() {
		$rob_obj = new Urlslab_Data_Serp_Query();

		return array_merge(
			$this->prepare_columns( $rob_obj->get_columns(), 'q' ),
			$this->prepare_columns(
				array(
					'url_id'   => '%d',
					'position' => '%d',
				),
				'p'
			)
		);
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

		$sql->add_group_by( 'url_id', 'u' );

		$sql->add_filters( $this->get_filter_similar_urls_columns(), $request );
		$sql->add_having_filters( $this->get_having_filter_similar_urls_columns(), $request );
		$sql->add_sorting( $this->get_similar_urls_sorting_columns(), $request );

		return $sql;
	}

	public function get_similar_urls_sorting_columns(): array {
		return array_merge( $this->get_filter_similar_urls_columns(), $this->get_having_filter_similar_urls_columns() );
	}

	private function get_filter_similar_urls_columns(): array {
		$rob_obj = new Urlslab_Data_Serp_Url();
		$columns = $this->prepare_columns( $rob_obj->get_columns(), 'u' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_id' => '%d' ), 'p' ) );

		return array_merge( $columns, $this->prepare_columns( array( 'domain_type' => '%s' ), 'd' ) );
	}

	private function get_having_filter_similar_urls_columns(): array {
		return $this->prepare_columns( array( 'cnt_queries' => '%d' ) );
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
			'validate_callback' => function ( $param ) {
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
			'validate_callback' => function ( $param ) {
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
