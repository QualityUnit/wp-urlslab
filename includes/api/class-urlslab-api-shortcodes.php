<?php


class Urlslab_Api_Shortcodes extends Urlslab_Api_Table {
	const SLUG = 'generator/shortcode';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
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
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Generator_Shortcode::STATUS_ACTIVE:
									case Urlslab_Data_Generator_Shortcode::STATUS_DISABLED:
										return true;

									default:
										return false;
								}
							},
						),
						'shortcode_name'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && strlen( $param ) <= 255 && strlen( $param ) > 0;
							},
						),
						'default_value'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'template'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/urls', $this->get_route_shortcode_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/urls/count', $this->get_count_route( $this->get_route_shortcode_urls() ) );
	}

	protected function delete_rows( array $rows ): bool {
		( new Urlslab_Data_Generator_Url() )->delete_rows( $rows, array( 'shortcode_id' ) );
		( new Urlslab_Data_Generator_Result() )->delete_rows( $rows, array( 'shortcode_id' ) );

		return parent::delete_rows( $rows );
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

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Truncated', 'urlslab' ),
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

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
		foreach ( $rows as $row ) {
			$row->shortcode_id = (int) $row->shortcode_id;
			$atts              = array( 'id' => $row->shortcode_id );
			$row->shortcode = $widget->get_placeholder_txt( $atts, Urlslab_Widget_Content_Generator::SLUG );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Generator_Shortcode( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'shortcode_name',
			'default_value',
			'status',
			'template',
			'flow_id',
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

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		$sql->add_group_by( 'shortcode_id', 'g' );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns(), 'g' );
	}

	protected function get_having_columns(): array {
		return $this->prepare_columns( array( 'usage_count' => '%d' ) );
	}

	/**
	 * @return array[]
	 */
	public function get_route_shortcode_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_generator_urls' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
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
		$this->prepare_url_filter( $request, array( 'url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'created', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_GENERATOR_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$sql->add_filters( $this->get_filter_generator_urls_columns(), $request );
		$sql->add_having_filters( $this->get_filter_generator_urls_columns(), $request );
		$sql->add_sorting( $this->get_filter_generator_urls_columns(), $request );

		return $sql;
	}

	protected function get_filter_generator_urls_columns(): array {
		return array_merge(
			$this->prepare_columns( ( new Urlslab_Data_Generator_Url() )->get_columns(), 'm' ),
			$this->prepare_columns( array( 'url_name' => '%s' ), 'u' )
		);
	}

	private function get_route_create_item() {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'status'           => array(
					'required'          => false,
					'default'           => Urlslab_Data_Generator_Shortcode::STATUS_ACTIVE,
					'validate_callback' => function ( $param ) {
						switch ( $param ) {
							case Urlslab_Data_Generator_Shortcode::STATUS_ACTIVE:
							case Urlslab_Data_Generator_Shortcode::STATUS_DISABLED:
								return true;

							default:
								return false;
						}
					},
				),
				'default_value'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'template'         => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
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
