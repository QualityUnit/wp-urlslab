<?php

class Urlslab_Api_Youtube_Cache extends Urlslab_Api_Table {
	const SLUG = 'youtube-cache';

	public function register_routes() {
		$base = '/' . self::SLUG;
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
							'validate_callback' => function( $param ) {
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
				'methods'             => WP_REST_Server::CREATABLE,
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

	public function get_video_urls( WP_REST_Request $request ) {
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
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_YOUTUBE_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$columns = $this->prepare_columns( ( new Urlslab_Youtube_Url_Row() )->get_columns(), 'm' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_name' => '%s' ), 'u' ) );
		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'y' );
		$sql->add_select_column( 'SUM(!ISNULL(m.url_id))', false, 'usage_count' );
		$sql->add_from( URLSLAB_YOUTUBE_CACHE_TABLE . ' y LEFT JOIN ' . URLSLAB_YOUTUBE_URLS_TABLE . ' m ON m.videoid = y.videoid' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'y' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'usage_count' => '%d' ) ) );
		$sql->add_group_by( 'videoid', 'y' );
		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
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
