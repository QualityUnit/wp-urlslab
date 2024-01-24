<?php

class Urlslab_Api_Faq extends Urlslab_Api_Table {
	const SLUG = 'faq';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
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
			$base . '/(?P<faq_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'question' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'answer'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'language' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'status'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Faq::STATUS_EMPTY:
									case Urlslab_Data_Faq::STATUS_NEW:
									case Urlslab_Data_Faq::STATUS_ACTIVE:
									case Urlslab_Data_Faq::STATUS_DISABLED:
									case Urlslab_Data_Faq::STATUS_PROCESSING:
									case Urlslab_Data_Faq::STATUS_WAITING_FOR_APPROVAL:
										return true;

									default:
										return false;
								}
							},
						),
						'labels'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'urls'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_array( $param ) || is_string( $param );
							},
						),
					),
				),
			)
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'question' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'answer'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'language' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'status'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						switch ( $param ) {
							case Urlslab_Data_Faq::STATUS_EMPTY:
							case Urlslab_Data_Faq::STATUS_NEW:
							case Urlslab_Data_Faq::STATUS_ACTIVE:
							case Urlslab_Data_Faq::STATUS_DISABLED:
							case Urlslab_Data_Faq::STATUS_PROCESSING:
							case Urlslab_Data_Faq::STATUS_WAITING_FOR_APPROVAL:
								return true;

							default:
								return false;
						}
					},
				),
				'labels'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'urls'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_array( $param ) || is_string( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Faq( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'question',
			'answer',
			'language',
			'status',
			'labels',
		);
	}

	private function update_faq_urls( int $faq_id, WP_REST_Request $request ) {
		if ( ! $request->has_param( 'urls' ) ) {
			return array();
		}
		$urls = $request->get_param( 'urls' );
		if ( ! is_array( $urls ) ) {
			$urls = preg_split( '/\r\n|\r|\n|,/', $urls );
		}

		$return_urls = array();
		$url_objects = array();
		$faq_urls    = array();
		$sorting     = 1;
		foreach ( $urls as $url ) {
			$url = trim( $url );
			if ( ! strlen( $url ) ) {
				continue;
			}
			try {
				$url_obj       = new Urlslab_Url( $url, true );
				$return_urls[] = $url_obj->get_url_with_protocol();
				$url_objects[] = $url_obj;

				$faq_url    = new Urlslab_Data_Faq_Url(
					array(
						'faq_id'  => $faq_id,
						'url_id'  => $url_obj->get_url_id(),
						'sorting' => $sorting++,
					),
					false
				);
				$faq_urls[] = $faq_url;
			} catch ( Exception $e ) {
				// Ignore.
			}
		}
		Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( $url_objects );

		global $wpdb;
		$wpdb->delete( URLSLAB_FAQ_URLS_TABLE, array( 'faq_id' => $request->get_param( 'faq_id' ) ) );
		if ( ! empty( $faq_urls ) ) {
			$faq_url->insert_all( $faq_urls, true );
		}

		return $return_urls;
	}

	public function create_item( $request ) {
		$result = parent::create_item( $request );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		$data         = $result->get_data();
		$data['urls'] = $this->update_faq_urls( $result->get_data()['faq_id'], $request );
		$result->set_data( $data );

		return $result;
	}

	public function update_item( $request ) {
		$result = parent::update_item( $request );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		$data         = $result->get_data();
		$data['urls'] = $this->update_faq_urls( $result->get_data()['faq_id'], $request );
		$result->set_data( $data );

		return $result;
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( $this->get_row_object()->get_columns() as $column => $type ) {
			$sql->add_select_column( $column, 'f' );
		}
		$sql->add_select_column( 'SUM(!ISNULL(u.faq_id))', false, 'urls_count' );
		$sql->add_select_column( 'GROUP_CONCAT(DISTINCT ut.url_name ORDER BY u.sorting ASC)', false, 'urls' );

		$sql->add_from( URLSLAB_FAQS_TABLE . ' f' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_FAQ_URLS_TABLE . ' u ON u.faq_id = f.faq_id' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_URLS_TABLE . ' ut ON ut.url_id = u.url_id' );

		$sql->add_group_by( 'faq_id', 'f' );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns(), 'f' );
	}

	protected function get_having_columns(): array {
		return $this->prepare_columns(
			array(
				'urls_count' => '%d',
				'urls'       => '%s',
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
			$row->faq_id = (int) $row->faq_id;
			$row->urls   = Urlslab_Url::enhance_urls_with_protocol( $row->urls );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( $this->get_row_object()->get_table_name() ) ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( URLSLAB_FAQ_URLS_TABLE ) ) ) ) { // phpcs:ignore
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

	protected function delete_rows( array $rows ): bool {
		( new Urlslab_Data_Faq_Url() )->delete_rows( $rows, array( 'faq_id' ) );

		return parent::delete_rows( $rows );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( ! strlen( $row->get_public( 'question' ) ) ) {
			throw new Exception( esc_html( __( 'Question is required', 'urlslab' ) ) );
		}
	}
}
