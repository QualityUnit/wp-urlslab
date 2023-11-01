<?php

class Urlslab_Api_Serp_Competitors extends Urlslab_Api_Table {
	const SLUG = 'serp-competitors';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Serp_Domain( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}


	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'd' );
		}

		$sql->add_select_column( 'COUNT(*)', false, 'urls_cnt' );
		$sql->add_select_column( 'SUM(u.top10_queries_cnt)', false, 'top10_queries_cnt' );
		$sql->add_select_column( 'SUM(u.top100_queries_cnt)', false, 'top100_queries_cnt' );
		$sql->add_select_column( '(SUM(u.top10_queries_cnt) / ( SELECT SUM(u.top10_queries_cnt) FROM ' . URLSLAB_SERP_DOMAINS_TABLE . ' d INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . " u ON d.domain_id=u.domain_id AND u.comp_intersections>3 WHERE d.domain_type IN ('" . Urlslab_Data_Serp_Domain::TYPE_COMPETITOR . "','" . Urlslab_Data_Serp_Domain::TYPE_MY_DOMAIN . "')))*100", false, 'coverage', false );

		$sql->add_from( URLSLAB_SERP_DOMAINS_TABLE . ' d' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON d.domain_id=u.domain_id AND u.comp_intersections>=2' );
		$sql->add_filter_str( '(', 'AND' );
		$sql->add_filter_str( 'd.domain_type IN (%s, %s)' );
		$sql->add_query_data( Urlslab_Data_Serp_Domain::TYPE_COMPETITOR );
		$sql->add_query_data( Urlslab_Data_Serp_Domain::TYPE_MY_DOMAIN );
		$sql->add_filter_str( ')' );


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'd' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'top10_queries_cnt'  => '%d',
					'top100_queries_cnt' => '%d',
					'coverage'           => '%d',
					'urls_cnt'           => '%d',
				)
			)
		);

		$sql->add_group_by( 'domain_id', 'd' );
		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );


		return $sql;
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
			$row->domain_id          = (int) $row->domain_id;
			$row->top10_queries_cnt  = (int) $row->top10_queries_cnt;
			$row->top100_queries_cnt = (int) $row->top100_queries_cnt;
			$row->urls_cnt           = (int) $row->urls_cnt;
			$row->coverage           = round( (float) $row->coverage, 2 );
		}

		return new WP_REST_Response( $rows, 200 );
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
