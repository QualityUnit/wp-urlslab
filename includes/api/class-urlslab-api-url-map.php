<?php

class Urlslab_Api_Url_Map extends Urlslab_Api_Table {
	const SLUG = 'url-map';

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
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->src_url_id  = (int) $row->src_url_id;
			$row->dest_url_id = (int) $row->dest_url_id;

			try {
				$row->dest_url_name = Urlslab_Url::add_current_page_protocol( $row->dest_url_name );
			} catch ( Exception $e ) {
			}

			try {
				$row->src_url_name = Urlslab_Url::add_current_page_protocol( $row->src_url_name );
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Url_Map( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
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


	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'src_url_name', 'dest_url_name' ) );

		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'src_url_id' );
		$sql->add_select_column( 'dest_url_id' );
		$sql->add_select_column( 'url_name', 'u_src', 'src_url_name' );
		$sql->add_select_column( 'url_name', 'u_dest', 'dest_url_name' );
		$sql->add_from( URLSLAB_URLS_MAP_TABLE . ' m INNER JOIN ' . URLSLAB_URLS_TABLE . ' u_src ON u_src.url_id = m.src_url_id INNER JOIN ' . URLSLAB_URLS_TABLE . ' u_dest ON u_dest.url_id = m.dest_url_id ' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'src_url_name'  => '%s',
					'dest_url_name' => '%s',
				)
			)
		);

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}
}
