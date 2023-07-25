<?php

class Urlslab_Api_Serp_Queries extends Urlslab_Api_Table {
	const SLUG = 'serp-queries';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<query_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'status' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return
									is_string( $param ) &&
									in_array(
										$param,
										array(
											Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
											Urlslab_Serp_Query_Row::STATUS_PROCESSED,
											Urlslab_Serp_Query_Row::STATUS_NOT_APPROVED,
											Urlslab_Serp_Query_Row::STATUS_ERROR,
										)
									);
							},
						),
					),
				),
			)
		);

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
			$base . '/(?P<query_id>[0-9]+)',
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
			$base . '/import',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'import_items' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'rows' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'status'  => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return
							is_string( $param ) &&
							in_array(
								$param,
								array(
									Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
									Urlslab_Serp_Query_Row::STATUS_PROCESSED,
									Urlslab_Serp_Query_Row::STATUS_NOT_APPROVED,
									Urlslab_Serp_Query_Row::STATUS_ERROR,
								)
							);
					},
				),
				'query'   => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'lang'    => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'country' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
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
			$row->query_id      = (int) $row->query_id;
			$row->best_position = (int) $row->best_position;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Serp_Query_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'status' );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( array_keys( $this->get_row_object()->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'q' );
		}
		$sql->add_select_column( 'MIN(position)', false, 'best_position' );
		$sql->add_select_column( 'url_name' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' q' );
		/**
		 * @var Urlslab_Serp $widget
		 */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . ' p ON q.query_id = p.query_id AND p.domain_id IN (' . implode( ',', array_keys( $widget->get_my_domains() ) ) . ')' );

		$sql->add_from( 'LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON p.url_id=u.url_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'q' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'best_position' => '%d',
					'url_name'      => '%s',
				)
			)
		);

		$sql->add_group_by( 'query_id', 'q' );
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

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_POSITIONS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_DOMAINS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_SERP_QGROUPS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		return parent::delete_all_items( $request );
	}

}
