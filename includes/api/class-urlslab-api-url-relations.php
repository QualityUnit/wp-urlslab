<?php

class Urlslab_Api_Url_Relations extends Urlslab_Api_Table {
	const SLUG = 'url-relation';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<src_url_id>[0-9]+)/(?P<dest_url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'pos'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param );
							},
						),
						'is_locked' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param ) || Urlslab_Url_Relation_Row::IS_LOCKED_NO === $param || Urlslab_Url_Relation_Row::IS_LOCKED_YES === $param;
							},
						),
					),
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
			$base . '/(?P<src_url_id>[0-9]+)/(?P<dest_url_id>[0-9]+)',
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
			$row->pos         = (int) $row->pos;
			$row->is_locked   = Urlslab_Url_Relation_Row::IS_LOCKED_YES === $row->is_locked;

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

	public function import_items( WP_REST_Request $request ) {
		$schedule_urls = array();
		$rows          = array();

		foreach ( $request->get_json_params()['rows'] as $row ) {
			$arr_row = (array) $row;

			if ( ! isset( $arr_row['dest_url_name'] ) && ! isset( $arr_row['src_url_name'] ) || empty( $arr_row['dest_url_name'] ) || empty( $arr_row['src_url_name'] ) ) {
				continue;
			}

			try {
				$src_url_obj                                = new Urlslab_Url( $arr_row['src_url_name'] );
				$dest_url_obj                               = new Urlslab_Url( $arr_row['dest_url_name'] );
				$schedule_urls[ $arr_row['src_url_name'] ]  = $src_url_obj;
				$schedule_urls[ $arr_row['dest_url_name'] ] = $dest_url_obj;

				$obj    = $this->get_row_object(
					array(
						'src_url_id'   => $src_url_obj->get_url_id(),
						'dest_url_id'  => $dest_url_obj->get_url_id(),
						'pos'          => $arr_row['pos'],
						'is_locked'    => Urlslab_Url_Relation_Row::IS_LOCKED_YES === $arr_row['pos'] || true === $arr_row['pos'] ? Urlslab_Url_Relation_Row::IS_LOCKED_YES : Urlslab_Url_Relation_Row::IS_LOCKED_NO,
						'created_date' => Urlslab_Data::get_now(),
					),
					false
				);
				$rows[] = $obj;
			} catch ( Exception $e ) {
			}
		}

		$url_row_obj = new Urlslab_Url_Row();
		if ( ! $url_row_obj->insert_urls( $schedule_urls, Urlslab_Url_Row::SCR_STATUS_NEW, Urlslab_Url_Row::SUM_STATUS_NEW, Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED, Urlslab_Url_Row::REL_AVAILABLE ) ) {
			return new WP_REST_Response( 'Import failed.', 500 );
		}

		$result = $this->get_row_object()->import( $rows );

		if ( false === $result ) {
			return new WP_REST_Response( 'Import failed', 500 );
		}
		$this->on_items_updated();

		return new WP_REST_Response( $result, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Url_Relation_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'pos', 'is_locked' );
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

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'src_url_name'  => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'dest_url_name' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'pos'           => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_numeric( $param );
					},
				),
				'is_locked'     => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_bool( $param ) || Urlslab_Url_Relation_Row::IS_LOCKED_NO === $param || Urlslab_Url_Relation_Row::IS_LOCKED_YES === $param;
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
			$src_url_obj                                             = new Urlslab_Url( $request->get_param( 'src_url_name' ) );
			$dest_url_obj                                            = new Urlslab_Url( $request->get_param( 'dest_url_name' ) );
			$schedule_urls[ $request->get_param( 'src_url_name' ) ]  = $src_url_obj;
			$schedule_urls[ $request->get_param( 'dest_url_name' ) ] = $dest_url_obj;

			$obj = $this->get_row_object(
				array(
					'src_url_id'   => $src_url_obj->get_url_id(),
					'dest_url_id'  => $dest_url_obj->get_url_id(),
					'pos'          => $request->get_param( 'pos' ),
					'is_locked'    => true === $request->get_param( 'is_locked' ) || Urlslab_Url_Relation_Row::IS_LOCKED_YES === $request->get_param( 'is_locked' ) ? Urlslab_Url_Relation_Row::IS_LOCKED_YES : Urlslab_Url_Relation_Row::IS_LOCKED_NO,
					'created_date' => Urlslab_Data::get_now(),
				),
				false
			);

			try {
				$this->validate_item( $obj );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Validation failed: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}

			$url_row_obj = new Urlslab_Url_Row();
			if ( ! $url_row_obj->insert_urls( $schedule_urls, Urlslab_Url_Row::SCR_STATUS_NEW, Urlslab_Url_Row::SUM_STATUS_NEW, Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED, Urlslab_Url_Row::REL_AVAILABLE ) ) {
				return new WP_REST_Response( 'Failed to create item', 500 );
			}

			$obj->insert();
			$this->on_items_updated( array( $obj ) );

			return new WP_REST_Response( $obj->as_array(), 200 );
		} catch ( Exception $e ) {
			return new WP_REST_Response( 'Insert failed', 500 );
		}
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'src_url_id' );
		$sql->add_select_column( 'dest_url_id' );
		$sql->add_select_column( 'pos' );
		$sql->add_select_column( 'is_locked' );
		$sql->add_select_column( 'created_date' );
		$sql->add_select_column( 'url_name', 'u_src', 'src_url_name' );
		$sql->add_select_column( 'url_name', 'u_dest', 'dest_url_name' );
		$sql->add_from( URLSLAB_RELATED_RESOURCE_TABLE . ' r LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_src ON u_src.url_id = r.src_url_id LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_dest ON u_dest.url_id = r.dest_url_id ' );

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
