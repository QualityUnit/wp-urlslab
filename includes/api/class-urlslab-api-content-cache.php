<?php

class Urlslab_Api_Content_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/content-cache';
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

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();
		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->cache_len   = (int) $row->cache_len;
			$row->cache_crc32 = (int) $row->cache_crc32;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_CONTENT_CACHE_TABLE );

		$sql->add_filters( $this->get_row_object()->get_columns(), $request );
		$sql->add_sorting( $this->get_row_object()->get_columns(), $request );

		return $sql;
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Content_Cache_Row( $params );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
