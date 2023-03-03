<?php

class Urlslab_Api_Url_Relations extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/url-relation';

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<srcUrlMd5>[0-9]+)/(?P<destUrlMd5>[0-9]+)',
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
			$base . '/(?P<srcUrlMd5>[0-9]+)/(?P<destUrlMd5>[0-9]+)',
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
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			$row->srcUrlMd5  = (int) $row->srcUrlMd5; // phpcs:ignore
			$row->destUrlMd5 = (int) $row->destUrlMd5; // phpcs:ignore
			$row->pos        = (int) $row->pos; // phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function import_items( WP_REST_Request $request ) {
		$schedule_urls = array();
		$rows          = array();

		foreach ( $request->get_json_params()['rows'] as $row ) {
			$arr_row = (array) $row;

			try {
				$src_url_obj                              = new Urlslab_Url( $arr_row['srcUrlName'] );
				$dest_url_obj                             = new Urlslab_Url( $arr_row['destUrlName'] );
				$schedule_urls[ $arr_row['srcUrlName'] ]  = $src_url_obj;
				$schedule_urls[ $arr_row['destUrlName'] ] = $dest_url_obj;

				$obj    = $this->get_row_object(
					array(
						'srcUrlMd5'  => $src_url_obj->get_url_id(),
						'destUrlMd5' => $dest_url_obj->get_url_id(),
						'pos'        => $arr_row['pos'],
					)
				);
				$rows[] = $obj;
			} catch ( Exception $e ) {
			}
		}

		$url_fetcher = new Urlslab_Url_Data_Fetcher();
		if ( ! $url_fetcher->prepare_url_batch_for_scheduling( $schedule_urls ) ) {
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
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_srcUrlMd5'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_destUrlMd5'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
						'filter_srcUrlName'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_destUrlName' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_pos'         => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_numeric_filter_value( $param );
							},
						),
					)
				),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return Urlslab_Api_Table_Sql
	 */
	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'srcUrlMd5' );
		$sql->add_select_column( 'destUrlMd5' );
		$sql->add_select_column( 'pos' );
		$sql->add_select_column( 'urlName', 'u_src', 'srcUrlName' );
		$sql->add_select_column( 'urlName', 'u_dest', 'destUrlName' );
		$sql->add_from( URLSLAB_RELATED_RESOURCE_TABLE . ' r LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_src ON u_src.urlMd5 = r.srcUrlMd5 LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u_dest ON u_dest.urlMd5 = r.destUrlMd5 ' );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'srcUrlMd5' );
		$sql->add_filter( 'destUrlMd5' );
		$sql->add_filter( 'filter_srcUrlName' );
		$sql->add_filter( 'filter_destUrlName' );
		$sql->add_filter( 'filter_pos', '%d' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'srcUrlMd5' );
		$sql->add_order( 'destUrlMd5' );

		return $sql;
	}
}
