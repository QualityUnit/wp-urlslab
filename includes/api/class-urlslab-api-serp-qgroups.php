<?php

class Urlslab_Api_Serp_Qgroups extends Urlslab_Api_Table {
	const SLUG = 'serp-qgroups';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/delete-all',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_all_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<qgroup_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/recompute',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'recompute' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'max_serp_position'  => array(
							'required'          => false,
							'default'           => 50,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 0 < $param && 100 >= $param;
							},
						),
						'min_url_occurences' => array(
							'required'          => false,
							'default'           => 3,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 0 < $param && 100 >= $param;
							},
						),
					),
				),
			)
		);
	}

	public function recompute( WP_REST_Request $request ) {
		global $wpdb;
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_QGROUPS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT 
    					DISTINCT(qs) as fullname, qids 
						FROM (
							SELECT 
							    GROUP_CONCAT(query order by query) as qs, 
							    GROUP_CONCAT(q.query_id) as qids, 
							    COUNT(*) as kw_cnt, 
							    cluster 
							FROM (
								SELECT 
									DISTINCT a.query_id, 
									GROUP_CONCAT(a.url_id order by a.url_id) as cluster, 
									COUNT(*) as cnt 
								FROM ' . $wpdb->quote_identifier( URLSLAB_SERP_POSITIONS_TABLE ) . ' a ' . // phpcs:ignore
				'INNER JOIN ' . $wpdb->quote_identifier( URLSLAB_SERP_POSITIONS_TABLE ) . // phpcs:ignore
				' b ON a.url_id=b.url_id AND a.position<%d AND b.position<%d AND a.query_id <> b.query_id 
								GROUP BY a.query_id, b.query_id 
								HAVING cnt > %d 
							) x
						INNER JOIN ' . $wpdb->quote_identifier( URLSLAB_SERP_QUERIES_TABLE ) . // phpcs:ignore
				' q ON q.query_id = x.query_id
						GROUP BY cluster
						HAVING kw_cnt > 1
						) r',
				$request->get_param( 'max_serp_position' ),
				$request->get_param( 'max_serp_position' ),
				$request->get_param( 'min_url_occurences' )
			),
			ARRAY_A
		);

		$qgroups = array();
		$queries = array();
		foreach ( $results as $row ) {
			$group     = new Urlslab_Serp_Qgroup_Row( array( 'name' => $row['fullname'] ) );
			$qgroups[] = $group;

			$query_ids = explode( ',', $row['qids'] );
			foreach ( $query_ids as $query_id ) {
				$queries[] = new Urlslab_Serp_Qgroup_Query_Row(
					array(
						'qgroup_id' => $group->get_qgroup_id(),
						'query_id'  => $query_id,
					)
				);
			}
		}

		if ( ! empty( $qgroups ) ) {
			$qgroups[0]->insert_all( $qgroups, true );
		}
		if ( ! empty( $queries ) ) {
			$queries[0]->insert_all( $queries, true );
		}

		return new WP_REST_Response( __( 'Recomputed' ), 200 );
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
			$row->qgroup_id = (int) $row->qgroup_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Qgroup_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( $this->get_row_object()->get_table_name() );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
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

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		return parent::delete_all_items( $request );
	}

}
