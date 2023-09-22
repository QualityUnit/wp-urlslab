<?php

class Urlslab_Api_Serp_Urls extends Urlslab_Api_Table {
	const SLUG = 'serp-urls';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
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
			$row->my_clicks             = (int) $row->my_clicks;
			$row->my_impressions        = (int) $row->my_impressions;
			$row->my_urls_ranked_top10  = (int) $row->my_urls_ranked_top10;
			$row->my_urls_ranked_top100 = (int) $row->my_urls_ranked_top100;
			$row->top_queries           = explode( ',', $row->top_queries );
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
