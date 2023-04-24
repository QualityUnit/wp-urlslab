<?php

class Urlslab_Api_Youtube_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/youtube-cache';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Youtube_Row::STATUS_NEW:
									case Urlslab_Youtube_Row::STATUS_DISABLED:
									case Urlslab_Youtube_Row::STATUS_AVAILABLE:
									case Urlslab_Youtube_Row::STATUS_PROCESSING:
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
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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

		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls', $this->get_route_video_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls/count', $this->get_count_route( $this->get_route_video_urls() ) );
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Youtube_Row( $params );
	}

	public function get_editable_columns(): array {
		return array( 'status' );
	}



	/**
	 * @return array[]
	 */
	public function get_route_video_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_video_urls' ),
				'args'                => array(
					'rows_per_page' => array(
						'required'          => true,
						'default'           => self::ROWS_PER_PAGE,
						'validate_callback' => function( $param ) {
							return is_numeric( $param ) && 0 < $param && 1000 > $param;
						},
					),
					'from_url_id'   => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return empty( $param ) || is_numeric( $param );
						},
					),
				),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	public function get_video_urls( $request ) {
		$rows = $this->get_video_urls_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id; // phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_video_urls_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_YOUTUBE_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );
		$sql->add_filter( 'videoid' );
		$sql->add_filter( 'from_url_id', '%d', 'm' );
		$sql->add_order( 'url_id', 'ASC', 'm' );

		return $sql;
	}

	protected function get_items_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'y' );
		$sql->add_select_column( 'SUM(!ISNULL(m.url_id))', false, 'usage_count' );
		$sql->add_from( URLSLAB_YOUTUBE_CACHE_TABLE . ' y LEFT JOIN ' . URLSLAB_YOUTUBE_URLS_TABLE . ' m ON m.videoid = y.videoid' );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_videoid', '%s', 'y' );
		$sql->add_filter( 'filter_status' );

		$sql->add_having_filter( 'filter_usage_count', '%d' );

		$sql->add_group_by( 'videoid', 'y' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}

		$sql->add_order( 'videoid', 'ASC', 'y' );

		return $sql;
	}

	private function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_videoid' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_status'  => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
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
}
