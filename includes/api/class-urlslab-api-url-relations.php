<?php

class Urlslab_Api_Url_Relations extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/url-relation';

		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				$this->get_route_get_items(),
				$this->get_route_create_item(),
			)
		);
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<src_url_id>[0-9]+)/(?P<dest_url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'pos' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param );
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
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}


	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->src_url_id  = (int) $row->src_url_id;
			$row->dest_url_id = (int) $row->dest_url_id;
			$row->pos         = (int) $row->pos;
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
						'src_url_id'  => $src_url_obj->get_url_id(),
						'dest_url_id' => $dest_url_obj->get_url_id(),
						'pos'         => $arr_row['pos'],
					)
				);
				$rows[] = $obj;
			} catch ( Exception $e ) {
			}
		}

		$url_row_obj = new Urlslab_Url_Row();
		if ( ! $url_row_obj->insert_urls( $schedule_urls, '', Urlslab_Url_Row::SUM_STATUS_NEW, Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED, Urlslab_Url_Row::REL_AVAILABLE ) ) {
			return new WP_REST_Response( 'Import failed.', 500 );
		}

		$result = $this->get_row_object()->import( $rows );

		if ( false === $result ) {
			return new WP_REST_Response( 'Import failed', 500 );
		}

		return new WP_REST_Response( $result, 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Url_Relation_Row( $params );
	}

	function get_editable_columns(): array {
		return array( 'pos' );
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(
				array(
					'filter_src_url_id'    => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
					'filter_dest_url_id'   => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
					'filter_src_url_name'  => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_dest_url_name' => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_string_filter_value( $param );
						},
					),
					'filter_pos'           => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return Urlslab_Api_Table::validate_numeric_filter_value( $param );
						},
					),
				)
			),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
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
						return is_int( $param );
					},
				),
			),
			'permission_callback' => array( $this, 'create_item_permissions_check' ),
		);
	}

	public function create_item( $request ) {

		try {
			$src_url_obj                                             = new Urlslab_Url( $request->get_param( 'src_url_name' ) );
			$dest_url_obj                                            = new Urlslab_Url( $request->get_param( 'dest_url_name' ) );
			$schedule_urls[ $request->get_param( 'src_url_name' ) ]  = $src_url_obj;
			$schedule_urls[ $request->get_param( 'dest_url_name' ) ] = $dest_url_obj;

			$obj = $this->get_row_object(
				array(
					'src_url_id'  => $src_url_obj->get_url_id(),
					'dest_url_id' => $dest_url_obj->get_url_id(),
					'pos'         => $request->get_param( 'pos' ),
				)
			);
			$obj->insert();

			return new WP_REST_Response( $obj->as_array(), 200 );
		} catch ( Exception $e ) {
			return new WP_REST_Response( 'Insert failed', 500 );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return Urlslab_Api_Table_Sql
	 */
	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'src_url_id' );
		$sql->add_select_column( 'dest_url_id' );
		$sql->add_select_column( 'pos' );
		$sql->add_select_column( 'url_name', 'u_src', 'src_url_name' );
		$sql->add_select_column( 'url_name', 'u_dest', 'dest_url_name' );
		$sql->add_from( URLSLAB_RELATED_RESOURCE_TABLE . ' r LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_src ON u_src.url_id = r.src_url_id LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_dest ON u_dest.url_id = r.dest_url_id ' );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'src_url_id' );
		$sql->add_filter( 'dest_url_id' );
		$sql->add_filter( 'filter_pos', '%d' );

		$sql->add_having_filter( 'filter_src_url_name' );
		$sql->add_having_filter( 'filter_dest_url_name' );


		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'src_url_id' );
		$sql->add_order( 'dest_url_id' );

		return $sql;
	}
}
