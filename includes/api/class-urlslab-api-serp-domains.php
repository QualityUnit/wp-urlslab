<?php

class Urlslab_Api_Serp_Domains extends Urlslab_Api_Table {
	const SLUG = 'serp-domains';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

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
			$row->avg_pos     = (float) $row->avg_pos;
			$row->top_10_cnt  = (int) $row->top_10_cnt;
			$row->top_100_cnt = (int) $row->top_100_cnt;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Domain_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'domain_type' );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		global $wpdb;
		$has_positions = $wpdb->get_row( 'SELECT * FROM ' . URLSLAB_SERP_POSITIONS_TABLE . ' LIMIT 1' );


		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'd' );
		}

		$sql->add_from( $this->get_row_object()->get_table_name() . ' d' );

		if ( $has_positions ) {
			$sql->add_select_column( 'SUM(CASE WHEN position <= 100 THEN 1 ELSE 0 END)', false, 'top_100_cnt' );
			$sql->add_select_column( 'SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END)', false, 'top_10_cnt' );
			$sql->add_select_column( 'AVG(position)', false, 'avg_pos' );
			$sql->add_from( 'INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
		} else {
			$sql->add_select_column( '0', false, 'top_100_cnt' );
			$sql->add_select_column( '0', false, 'top_10_cnt' );
			$sql->add_select_column( '0', false, 'avg_pos' );
			$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON d.domain_id = p.domain_id' );
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
