<?php

class Urlslab_Api_Backlinks extends Urlslab_Api_Table {
	const SLUG = 'backlinks';

	public function register_routes() {
		$base = '/' . self::SLUG;

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
			$base . '/delete',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'delete_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
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
			$row->from_url_id   = (int) $row->from_url_id;
			$row->to_url_id   = (int) $row->to_url_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name', 'src_url_name', 'dest_url_name' ) );

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( $this->get_row_object()->get_columns() as $column => $type ) {
			$sql->add_select_column( $column, 'b' );
		}
		$sql->add_select_column( 'f.url_name', 'from_url_name' );
		$sql->add_select_column( 'f.http_status', 'from_http_status' );
		$sql->add_select_column( 't.url_name', 'to_url_name' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' b');
		$sql->add_from( 'INNER JOIN ' . URLSLAB_URLS_TABLE . ' f ON b.from_url_id = f.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_URLS_TABLE . ' t ON b.from_url_id = t.url_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'from_url_name'  => '%s',
					'from_url_name' => '%s',
				)
			)
		);

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Backlink_Monitor( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'status',
			'labels',
			'note',
		);
	}
}
