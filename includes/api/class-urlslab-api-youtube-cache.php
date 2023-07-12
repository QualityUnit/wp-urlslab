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
							'required'          => false,
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
							'validate_callback' => function( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/generate-yt-data/(?P<videoid>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'generate_yt_data' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(
						'show_summarization' => array(
							'required'          => true,
							'default'          => true,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
						'show_topics' => array(
							'required'          => true,
							'default'          => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
						'model' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'language' => array(
							'required'          => false,
							'default'          => get_locale(),
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);


		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls', $this->get_route_video_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<videoid>[0-9a-zA-Z_\-]+)/urls/count', $this->get_count_route( $this->get_route_video_urls() ) );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
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
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'videoid'   => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'microdata' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'captions'  => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'status'    => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Youtube_Row::STATUS_NEW:
							case Urlslab_Youtube_Row::STATUS_AVAILABLE:
							case Urlslab_Youtube_Row::STATUS_DISABLED:
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
	public function delete_item( $request ) {
		if ( 'delete-all' === $request->get_param( 'videoid' ) ) {
			return $this->delete_all_items( $request );
		}

		return parent::delete_item( $request );
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

		return new WP_REST_Response( __( 'Truncated' ), 200 );
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

	public function generate_yt_data( $request ) {
		$yt_id = $request->get_param( 'video_id' );
		$show_topics = $request->get_param( 'show_topics' );
		$show_summarization = $request->get_param( 'show_summarization' );
		$aug_model = $request->get_param( 'model' );
		$language = $request->get_param( 'language' );

		if ( empty( $yt_id ) || empty( $generate_additional_data ) ) {
			return new WP_REST_Response(
				(object) array(
					'message' => 'missing required parameters',
				),
				400
			);
		}

        $yt_helper = Urlslab_Yt_Helper::get_instance();
        $yt_data = $yt_helper->get_yt_data( $yt_id );

		if ( ! $yt_data ) {
			return new WP_REST_Response(
				(object) array(
					'message' => 'youtube data cannot be fetched',
				),
				404
			);
		}
		$yt_data->set_last_ai_generation_attempt( current_time( 'mysql' ) );
		$yt_data->update();

		if ( $yt_helper->should_fetch_additional_data( $yt_data, $show_topics, $show_summarization ) ) {
			try {
				$response = $yt_helper->augment_yt_data( $yt_data, $aug_model, $yt_helper->get_default_yt_data_prompt( $language ) );
				$output = json_decode( $response );
				if ( json_last_error() == JSON_ERROR_NONE ) {
					// No errors, proceed accessing $data
					$yt_data->set_topics( $output->topics );
					$yt_data->set_summarization( $output->summarization );
					$yt_data->update();
					return new WP_REST_Response( (object) array( 'message' => 'successfully fetched youtube data' ), 200 );

				} else {
					return new WP_REST_Response(
						(object) array(
							'message' => 'Invalid JSON as output of model',
						),
						500
					);

				}

				return new WP_REST_Response( (object) array( 'message' => 'successfully fetched youtube data' ), 200 );
			} catch ( Exception $e ) {
				return new WP_REST_Response(
					(object) array(
						'message' => $e->getMessage(),
					),
					500
				);
			}
		}

		return new WP_REST_Response(
			(object) array(
				'message' => 'successfully fetched youtube data',
			),
			200
		);

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
				$row_obj       = new Urlslab_Youtube_Row( (array) $row );
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
