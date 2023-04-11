<?php

class Urlslab_Api_Not_Found_Log extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/not-found-log';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );
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
			$base . '/(?P<url_id>[0-9]+)',
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
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id;
			$row->cnt    = (int) $row->cnt;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Not_Found_Log_Row( $params );
	}

	public function get_editable_columns(): array {
		return array();
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_url'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_created'      => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_updated'      => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_cnt'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_request_data' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
					)
				),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( $this->get_row_object()->get_table_name() );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_url' );
		$sql->add_filter( 'filter_created' );
		$sql->add_filter( 'filter_updated' );
		$sql->add_filter( 'filter_request_data' );
		$sql->add_filter( 'filter_cnt', '%d' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'url_id', 'DESC' );

		return $sql;
	}
}
