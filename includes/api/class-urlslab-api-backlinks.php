<?php

class Urlslab_Api_Backlinks extends Urlslab_Api_Table {
	const SLUG = 'backlinks';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<from_url_id>[0-9]+)/(?P<to_url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'note'             => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'labels'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'from_http_status' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return - 1 === (int) $param;
							},
						),
					),
				),
			)
		);

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
			$row->from_url_id = (int) $row->from_url_id;
			$row->to_url_id   = (int) $row->to_url_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'from_url_name', 'to_url_name' ) );

		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( $this->get_row_object()->get_columns() as $column => $type ) {
			$sql->add_select_column( $column, 'b' );
		}
		$sql->add_select_column( 'url_name', 'f', 'from_url_name' );
		$sql->add_select_column( 'http_status', 'f', 'from_http_status' );
		$sql->add_select_column( 'attributes', 'f', 'from_attributes' );
		$sql->add_select_column( 'url_name', 't', 'to_url_name' );

		$sql->add_from( $this->get_row_object()->get_table_name() . ' b' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_URLS_TABLE . ' f ON b.from_url_id = f.url_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_URLS_TABLE . ' t ON b.to_url_id = t.url_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'from_url_name'    => '%s',
					'from_attributes'  => '%s',
					'to_url_name'      => '%s',
					'from_http_status' => '%d',
				)
			)
		);

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'from_url_name' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						try {
							$url_obj = new Urlslab_Url( $param, true );

							return $url_obj->is_url_valid() && ! $url_obj->is_blacklisted();
						} catch ( Exception $e ) {
							return false;
						}
					},
				),
				'to_url_name'   => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						try {
							$url_obj = new Urlslab_Url( $param, true );

							return $url_obj->is_url_valid() && ! $url_obj->is_blacklisted();
						} catch ( Exception $e ) {
							return false;
						}
					},
				),
				'note'          => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'labels'        => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			$row = new Urlslab_Data_Backlink_Monitor();
			foreach ( $row->get_columns() as $column => $format ) {
				if ( $request->has_param( $column ) ) {
					$row->set_public( $column, $request->get_param( $column ) );
				}
			}

			try {
				$url_from = new Urlslab_Url( $request->get_param( 'from_url_name' ), true );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Invalid From URL: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}
			try {
				$url_to = new Urlslab_Url( $request->get_param( 'to_url_name' ), true );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Invalid To URL: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}

			$urls = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( array( $url_from, $url_to ) );

			if ( ! isset( $urls[ $url_from->get_url_id() ] ) ) {
				return new WP_Error( 'error', __( 'Failed to create URL From', 'urlslab' ), array( 'status' => 400 ) );
			}
			if ( ! isset( $urls[ $url_to->get_url_id() ] ) ) {
				return new WP_Error( 'error', __( 'Failed to create URL To', 'urlslab' ), array( 'status' => 400 ) );
			}

			$row->set_from_url_id( $url_from->get_url_id() );
			$row->set_to_url_id( $url_to->get_url_id() );

			try {
				$this->validate_item( $row );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Validation failed: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}

			if ( $row->insert() ) {
				$this->on_items_updated( array( $row ) );
				$from_url = new Urlslab_Data_Url( array( 'url_id' => $row->get_from_url_id() ) );
				if ( $from_url->load() ) {
					$from_url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED );
					if ( $from_url->update() ) {
						$from_url->update_http_response();
					}
				}

				return new WP_REST_Response( $row->as_array(), 200 );
			}

			return new WP_Error( 'error', __( 'Insert failed', 'urlslab' ), array( 'status' => 409 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	public function update_item( $request ) {
		if ( ! $request->has_param( 'last_seen' ) && Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED === (int) $request->get_param( 'from_http_status' ) ) {
			$from_url = new Urlslab_Data_Url( array( 'url_id' => $request->get_param( 'from_url_id' ) ) );
			if ( $from_url->load() ) {
				$from_url->set_http_status( Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED );
				if ( $from_url->update() ) {
					$from_url->update_http_response();

					return new WP_REST_Response( array(), 200 );
				}
			}

			return new WP_Error( 'error', __( 'Failed', 'urlslab' ), array( 'status' => 404 ) );
		}

		return parent::update_item( $request );
	}

	public function before_import( Urlslab_Data $row_obj, array $row ): Urlslab_Data {
		try {
			$from_url = new Urlslab_Url( $row['from_url_name'], true );
			$to_url   = new Urlslab_Url( $row['to_url_name'], true );

			Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( array( $from_url, $to_url ) );
			$row_obj->set_public( 'from_url_id', $from_url->get_url_id() );
			$row_obj->set_public( 'to_url_id', $to_url->get_url_id() );
			$row_obj->set_public( 'created', Urlslab_Data::get_now() );
			$row_obj->set_public( 'updated', '' );
			$row_obj->set_public( 'last_seen', '' );
			$row_obj->set_public( 'anchor_text', '' );
			$row_obj->set_public( 'status', Urlslab_Data_Backlink_Monitor::STATUS_NOT_CHECKED );
			$row_obj->set_public( 'link_attributes', '' );
		} catch ( Exception $e ) {
		}

		return parent::before_import( $row_obj, $row );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Backlink_Monitor( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'labels',
			'note',
		);
	}
}
