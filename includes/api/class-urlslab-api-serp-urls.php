<?php

class Urlslab_Api_Serp_Urls extends Urlslab_Api_Table {
	const SLUG = 'serp-urls';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route( self::NAMESPACE, $base . '/url/queries', $this->get_route_get_url_queries() );
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_url_queries( $request ) {
		$url     = new Urlslab_Url( $request->get_param( 'url' ), true );
		$url_row = new Urlslab_Serp_Url_Row( array( 'url_id' => $url->get_url_id() ) );
		if ( ! $url_row->load() ) {
			return new WP_REST_Response( __( 'URL does not exit' ), 404 );
		}

		$body = $request->get_json_params();
		if ( ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}
		$body['filters'][] = array(
			'col' => 'url_id',
			'op'  => '=',
			'val' => $url->get_url_id(),
		);
		$request->set_body( json_encode( $body ) );


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
			$row->my_urls            = Urlslab_Url::enhance_urls_with_protocol( $row->my_urls );
			$row->comp_urls          = Urlslab_Url::enhance_urls_with_protocol( $row->comp_urls );
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Url_Row( $params, $loaded_from_db );
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
		$rob_obj = new Urlslab_Serp_Query_Row();
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

}
