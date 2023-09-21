<?php

class Urlslab_Api_Serp_Competitors extends Urlslab_Api_Table {
	const SLUG = 'serp-competitors';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Domain_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}


	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'd' );
		}

		$sql->add_select_column( 'COUNT(*)', false, 'cnt_top100_intersections' );
		$sql->add_select_column( 'SUM(CASE WHEN p.position < 11 AND pm.position < 11 THEN 1 ELSE 0 END)', false, 'cnt_top10_intersections' );
		$sql->add_select_column( 'AVG( p.position )', false, 'avg_position' );
		$sql->add_select_column( '(SUM(p.position) / (SELECT SUM(p.position) FROM ' . URLSLAB_SERP_DOMAINS_TABLE . ' d INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON p.domain_id=d.domain_id INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pm ON pm.query_id=p.query_id AND pm.domain_id IN (SELECT domain_id FROM ' . URLSLAB_SERP_DOMAINS_TABLE . " WHERE domain_type='" . Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN . "') WHERE d.domain_type = '" . Urlslab_Serp_Domain_Row::TYPE_COMPETITOR . "')) * 100", false, 'coverage', false );

		$sql->add_from( URLSLAB_SERP_DOMAINS_TABLE . ' d' );

		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . " p ON p.domain_id=d.domain_id AND d.domain_type='" . Urlslab_Serp_Domain_Row::TYPE_COMPETITOR . "'" );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' pm ON pm.query_id=p.query_id AND pm.domain_id IN (SELECT domain_id FROM ' . URLSLAB_SERP_DOMAINS_TABLE . " WHERE domain_type='" . Urlslab_Serp_Domain_Row::TYPE_MY_DOMAIN . "')" );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'd' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'cnt_top10_intersections' => '%d',
					'cnt_top100_intersections' => '%d',
					'avg_position'   => '%s',
					'coverage'       => '%d',
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
			$row->domain_id = (int) $row->domain_id;
			$row->cnt_top10_intersections = (int) $row->cnt_top10_intersections;
			$row->cnt_top100_intersections = (int) $row->cnt_top100_intersections;
			$row->avg_position = round( (float) $row->avg_position, 1 );
			$row->coverage = round( (float) $row->coverage, 2 );
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
