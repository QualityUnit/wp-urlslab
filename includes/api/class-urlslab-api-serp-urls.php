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
		try {
			$rows = $this->get_items_sql( $request )->get_results();

			if ( is_wp_error( $rows ) ) {
				return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
			}

			foreach ( $rows as $row ) {
				$row->url_id            = (int) $row->url_id;
				$row->domain_id         = (int) $row->domain_id;
				$row->queries_cnt       = (int) $row->queries_cnt;
				$row->top10_queries_cnt = (int) $row->top10_queries_cnt;
				$row->best_position     = (int) $row->best_position;
				$row->match_competitors = (int) $row->match_competitors;
				$row->my_clicks         = (int) $row->my_clicks;
				$row->my_impressions    = (int) $row->my_impressions;
			}

			return new WP_REST_Response( $rows, 200 );
		} catch ( Urlslab_Bad_Request_Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get items: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get items: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 500 ) );
		}
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Url_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'u' );
		}
		$sql->add_select_column( 'MIN(p.position)', false, 'best_position' );
		$sql->add_select_column( 'SUM(p.impressions)', false, 'my_impressions' );
		$sql->add_select_column( 'SUM(p.clicks)', false, 'my_clicks' );
		$sql->add_select_column( 'COUNT(*)', false, 'queries_cnt' );
		$sql->add_select_column( 'SUM(CASE WHEN p.position <= 10 THEN 1 ELSE 0 END)', false, 'top10_queries_cnt' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT query order by p.position)', false, 'queries' );
		$sql->add_select_column( 'domain_type', 'd' );
		$sql->add_select_column( 'COUNT(DISTINCT po.domain_id)', false, 'match_competitors' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' u' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' p ON u.url_id = p.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON q.query_id = p.query_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_DOMAINS_TABLE . ' d ON u.domain_id = d.domain_id' );

		$sql->add_from( 'LEFT JOIN ' . URLSLAB_GSC_POSITIONS_TABLE . ' po ON p.query_id=po.query_id AND po.position<10 AND po.url_id <> p.url_id AND po.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . ')' );


		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'u' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'best_position'     => '%d',
					'match_competitors' => '%d',
					'queries_cnt'       => '%d',
					'top10_queries_cnt' => '%d',
					'queries'           => '%s',
					'domain_type'       => '%s',
				)
			)
		);

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

}
