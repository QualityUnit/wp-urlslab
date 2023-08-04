<?php

class Urlslab_Api_Serp_Gap extends Urlslab_Api_Table {
	const SLUG = 'serp-gap';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Query_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}


	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		//add having condition HAVING competitors_count > 1
		$has_filter = false;
		$body       = $request->get_json_params();
		if ( ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}
		foreach ( $body['filters'] as $filter ) {
			if ( isset( $filter['col'] ) && 'competitors_count' === $filter['col'] ) {
				$has_filter = true;
				break;
			}
		}
		if ( ! $has_filter ) {
			$body['filters'][] = array(
				'col' => 'competitors_count',
				'op'  => '>',
				'val' => 1,
			);
		}
		$request->set_body( json_encode( $body ) );


		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}

		$sql->add_select_column( 'COUNT(DISTINCT p.domain_id)', false, 'competitors_count' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT d.domain_name ORDER BY p.position)', false, 'top_competitors' );

		$sql->add_select_column( 'MIN(mp.position)', false, 'my_position' );

		$sql->add_select_column( 'SUM(mp.impressions)', false, 'my_impressions' );
		$sql->add_select_column( 'SUM(mp.clicks)', false, 'my_clicks' );
		$sql->add_select_column( 'AVG(mp.ctr)', false, 'my_ctr' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT mu.url_name ORDER BY mp.clicks, mp.impressions, mp.position)', false, 'my_url_name' );


		$sql->add_from( URLSLAB_GSC_POSITIONS_TABLE . ' p' );

		// serp domain table sql join
		$serp_domain_table_join = ' d ON p.position < 11 AND d.domain_id=p.domain_id';
		$gsc_domain_table_join  = ' mp ON mp.query_id = q.query_id';
		if ( ! empty( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) {
			$serp_domain_table_join .= ' AND d.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . ')';
		}
		if ( ! empty( Urlslab_Serp_Domain_Row::get_my_domains() ) ) {
			$gsc_domain_table_join .= ' AND mp.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) ) . ')';
		}
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . $serp_domain_table_join );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = p.query_id' );


		// GSC Position sql join

		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . $gsc_domain_table_join );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' mu ON mp.url_id=mu.url_id' );


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'competitors_count' => '%d',
					'top_competitors'   => '%s',
					'my_position'       => '%d',
					'my_impressions'    => '%d',
					'my_clicks'         => '%d',
					'my_ctr'            => '%d',
					'my_url_name'       => '%s',
				)
			)
		);

		$sql->add_group_by( 'query_id', 'q' );
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
			$row->query_id          = (int) $row->query_id;
			$row->my_position       = round( (float) $row->my_position, 1 );
			$row->my_ctr            = round( (float) $row->my_ctr, 2 );
			$row->my_clicks         = (int) $row->my_clicks;
			$row->my_impressions    = (int) $row->my_impressions;
			$row->competitors_count = (int) $row->competitors_count;
			$row->top_competitors   = str_replace( ',', ', ', $row->top_competitors );
			$row->my_url_name       = str_replace( ',', ', ', $row->my_url_name );
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
