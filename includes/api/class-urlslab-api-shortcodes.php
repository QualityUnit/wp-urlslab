<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;

class Urlslab_Api_Shortcodes extends Urlslab_Api_Table {
	const SLUG = 'generator/shortcode';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
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


		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<shortcode_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'status'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Generator_Shortcode_Row::STATUS_ACTIVE:
									case Urlslab_Generator_Shortcode_Row::STATUS_DISABLED:
										return true;

									default:
										return false;
								}
							},
						),
						'shortcode_type'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Generator_Shortcode_Row::TYPE_SEMANTIC_SEARCH_CONTEXT:
									case Urlslab_Generator_Shortcode_Row::TYPE_VIDEO:
										return true;

									default:
										return false;
								}
							},
						),
						'shortcode_name'   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && strlen( $param ) <= 255 && strlen( $param ) > 0;
							},
						),
						'semantic_context' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'prompt'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'default_value'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'url_filter'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'template'         => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'model'            => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 == $param ||
									   DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO == $param ||
									   DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 == $param;
							},
						),
					),
				),
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/urls', $this->get_route_shortcode_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/urls/count', $this->get_count_route( $this->get_route_shortcode_urls() ) );

	}

	protected function delete_row( array $row ): bool {
		global $wpdb;

		if ( ! isset( $row['shortcode_id'] ) ) {
			return false;
		}

		$delete_params                 = array();
		$delete_params['shortcode_id'] = $row['shortcode_id'];

		if ( false === $wpdb->delete( URLSLAB_GENERATOR_SHORTCODES_TABLE, $delete_params ) ) {
			return false;
		}

		if ( false === $wpdb->delete( URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE, $delete_params ) ) {
			return false;
		}

		if ( false === $wpdb->delete( URLSLAB_GENERATOR_URLS_TABLE, $delete_params ) ) {
			return false;
		}

		return true;
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GENERATOR_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response( __( 'Truncated' ), 200 );
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

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );
		foreach ( $rows as $row ) {
			$row->shortcode_id = (int) $row->shortcode_id;
			$atts              = array( 'id' => $row->shortcode_id );
			if ( Urlslab_Generator_Shortcode_Row::TYPE_VIDEO === $row->shortcode_type ) {
				$atts['videoid'] = 'youtube_video_id';
			}
			$row->shortcode = $widget->get_placeholder_txt( $atts, Urlslab_Content_Generator_Widget::SLUG );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Generator_Shortcode_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'shortcode_name',
			'semantic_context',
			'prompt',
			'default_value',
			'url_filter',
			'status',
			'model',
			'template',
			'shortcode_type',
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

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'g' );

		$sql->add_select_column( 'SUM(!ISNULL(m.url_id))', false, 'usage_count' );
		$sql->add_from( URLSLAB_GENERATOR_SHORTCODES_TABLE . ' g LEFT JOIN ' . URLSLAB_GENERATOR_URLS_TABLE . ' m ON m.shortcode_id = g.shortcode_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'g' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'filter_usage_count' => '%d' ) ) );

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		$sql->add_group_by( 'shortcode_id', 'g' );

		return $sql;
	}

	/**
	 * @return array[]
	 */
	public function get_route_shortcode_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_generator_urls' ),
				'args'                => array(
					'rows_per_page' => array(
						'required'          => true,
						'default'           => self::ROWS_PER_PAGE,
						'validate_callback' => function( $param ) {
							return is_numeric( $param ) && 0 < $param && 1000 > $param;
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

	public function get_generator_urls( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'shortcode_id' ) );
		$rows = $this->get_generator_urls_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
		foreach ( $rows as $row ) {
			$row->shortcode_id = (int) $row->shortcode_id; // phpcs:ignore
			$row->url_id       = (int) $row->url_id; // phpcs:ignore
			$row->hash_id      = (int) $row->hash_id; // phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_generator_urls_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'created', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_GENERATOR_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$columns = $this->prepare_columns( ( new Urlslab_Generator_Url_Row() )->get_columns(), 'm' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_name' => '%s' ), 'u' ) );

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	private function get_route_create_item() {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'status'           => array(
					'required'          => false,
					'default'           => Urlslab_Generator_Shortcode_Row::STATUS_ACTIVE,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Generator_Shortcode_Row::STATUS_ACTIVE:
							case Urlslab_Generator_Shortcode_Row::STATUS_DISABLED:
								return true;

							default:
								return false;
						}
					},
				),
				'shortcode_type'   => array(
					'required'          => true,
					'default'           => Urlslab_Generator_Shortcode_Row::TYPE_SEMANTIC_SEARCH_CONTEXT,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Generator_Shortcode_Row::TYPE_SEMANTIC_SEARCH_CONTEXT:
							case Urlslab_Generator_Shortcode_Row::TYPE_VIDEO:
								return true;

							default:
								return false;
						}
					},
				),
				'semantic_context' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'prompt'           => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'default_value'    => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'url_filter'       => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'template'         => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'model'            => array(
					'required'          => false,
					'default'           => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
					'validate_callback' => function( $param ) {
						return DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 == $param ||
							   DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO == $param ||
							   DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 == $param;
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

}
