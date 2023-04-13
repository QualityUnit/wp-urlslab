<?php

class Urlslab_Api_Css_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/css-cache';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<url_id>[0-9]+)',
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
							'required'          => true,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_CSS_Cache_Row::STATUS_ACTIVE:
									case Urlslab_CSS_Cache_Row::STATUS_DISABLED:
									case Urlslab_CSS_Cache_Row::STATUS_NEW:
									case Urlslab_CSS_Cache_Row::STATUS_PENDING:
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

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id   = (int) $row->url_id;
			$row->filesize = (int) $row->filesize;
			if ( 0 === $row->filesize ) {
				$row->filesize = strlen( $row->css_content );
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_CSS_Cache_Row( $params );
	}

	public function get_editable_columns(): array {
		return array( 'status' );
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
						'filter_url'            => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_status'         => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_status_changed' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_css_content'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_filesize'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
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
		$sql->add_from( URLSLAB_CSS_CACHE_TABLE );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_url' );
		$sql->add_filter( 'filter_status' );
		$sql->add_filter( 'filter_status_changed' );
		$sql->add_filter( 'filter_filesize' );
		$sql->add_filter( 'filter_css_content' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'url_id' );

		return $sql;
	}
}
