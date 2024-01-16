<?php

class Urlslab_Api_Youtube_Cache extends Urlslab_Api_Table {
	const SLUG = 'youtube-cache';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );

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
							'validate_callback' => function ( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

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
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Youtube::STATUS_NEW:
									case Urlslab_Data_Youtube::STATUS_DISABLED:
									case Urlslab_Data_Youtube::STATUS_AVAILABLE:
									case Urlslab_Data_Youtube::STATUS_PROCESSING:
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

		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls', $this->get_route_video_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls/count', $this->get_count_route( $this->get_route_video_urls() ) );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Youtube( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'status' );
	}


	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'videoid'   => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'microdata' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'captions'  => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'status'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						switch ( $param ) {
							case Urlslab_Data_Youtube::STATUS_NEW:
							case Urlslab_Data_Youtube::STATUS_AVAILABLE:
							case Urlslab_Data_Youtube::STATUS_DISABLED:
								return true;
							default:
								return false;
						}
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
	public function update_item( $request ) {
		if ( 'import' == $request->get_param( 'videoid' ) ) {
			return $this->import_items( $request );
		}

		return parent::update_item( $request );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( ! preg_match( '/^[0-9a-zA-Z_\-]+$/', $row->get_public( 'videoid' ) ) ) {
			throw new Exception( __( 'Invalid videoid: ', 'urlslab' ) . $row->get_public( 'videoid' ) );
		}
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_YOUTUBE_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_YOUTUBE_CACHE_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Truncated', 'urlslab' ),
			),
			200 
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_video_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_video_urls' ),
				'args'                => array(
					'rows_per_page' => array(
						'required'          => true,
						'default'           => self::ROWS_PER_PAGE,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param ) && 0 < $param && 1000 > $param;
						},
					),
					'from_url_id'   => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
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

	public function get_video_urls( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'videoid' ) );
		$rows = $this->get_video_urls_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id; // phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_video_urls_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_YOUTUBE_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$sql->add_filters( $this->get_filter_video_urls_columns(), $request );
		$sql->add_sorting( $this->get_filter_video_urls_columns(), $request );

		return $sql;
	}

	private function get_filter_video_urls_columns(): array {
		return array_merge(
			$this->prepare_columns( ( new Urlslab_Data_Youtube_Url() )->get_columns(), 'm' ),
			$this->prepare_columns( array( 'url_name' => '%s' ), 'u' )
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'y' );
		$sql->add_select_column( 'SUM(!ISNULL(m.url_id))', false, 'usage_count' );
		$sql->add_from( URLSLAB_YOUTUBE_CACHE_TABLE . ' y LEFT JOIN ' . URLSLAB_YOUTUBE_URLS_TABLE . ' m ON m.videoid = y.videoid' );

		$sql->add_group_by( 'videoid', 'y' );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns(), 'y' );
	}

	protected function get_having_columns(): array {
		return $this->prepare_columns( array( 'usage_count' => '%d' ) );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			if ( strlen( $row->captions ) ) {
				$row_obj       = new Urlslab_Data_Youtube( (array) $row );
				$row->captions = $row_obj->get_captions();
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	private function get_route_get_items(): array {
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
}
