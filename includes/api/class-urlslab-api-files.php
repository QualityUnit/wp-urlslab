<?php

class Urlslab_Api_Files extends Urlslab_Api_Table {
	const SLUG = 'file';

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
			$base . '/(?P<fileid>[0-9a-zA-Z]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'filestatus' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Driver::STATUS_NEW:
									case Urlslab_Driver::STATUS_ACTIVE:
									case Urlslab_Driver::STATUS_ACTIVE_SYSTEM:
									case Urlslab_Driver::STATUS_PENDING:
									case Urlslab_Driver::STATUS_ERROR:
									case Urlslab_Driver::STATUS_NOT_PROCESSING:
										return true;

									default:
										return false;
								}
							},
						),
						'labels'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);


		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<fileid>[0-9a-zA-Z]+)/transfer',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'transfer_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'driver' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return in_array( $param, Urlslab_Driver::DRIVERS );
							},
						),
					),
				),
			)
		);

		register_rest_route( self::NAMESPACE, $base . '/(?P<fileid>[0-9a-zA-Z]+)/urls', $this->get_route_file_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<fileid>[0-9a-zA-Z]+)/urls/count', $this->get_count_route( $this->get_route_file_urls() ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<fileid>[0-9a-zA-Z]+)/urls/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_filter_file_urls_columns',
				)
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$cron = new Urlslab_Cron_Update_Usage_Stats();
		$cron->reset_locks( 900 );


		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row_obj            = new Urlslab_Data_File( (array) $row );
			$row->usage_count   = (int) $row->usage_count;
			$row->filesize      = (int) $row->filesize;
			$row->width         = (int) $row->width;
			$row->height        = (int) $row->height;
			$row->avif_filesize = (int) $row->avif_filesize;
			$row->webp_filesize = (int) $row->webp_filesize;
			if ( $row_obj->get_file_pointer()->get_filesize() ) {
				$row->download_url = $row_obj->get_file_pointer()->get_driver_object()->get_url( $row_obj );
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_file_urls( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'fileid' ) );
		$rows = $this->get_file_urls_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
		foreach ( $rows as $row ) {
			$row->url_id  = (int) $row->url_id;
			$row->post_id = (int) $row->post_id;
			try {
				if ( strlen( $row->url_name ) ) {
					$url           = new Urlslab_Url( $row->url_name, true );
					$row->url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {
			}
			if ( $row->post_id > 0 ) {
				$row->edit_url_name = get_edit_post_link( $row->post_id, 'js' );
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_file_urls_count( WP_REST_Request $request ) {
		return new WP_REST_Response( $this->get_file_urls_sql( $request )->get_count(), 200 );
	}

	protected function delete_rows( array $rows ): bool {
		( new Urlslab_Data_File_Url() )->delete_rows( $rows, array( 'fileid' ) );

		return parent::delete_rows( $rows );
	}

	public function transfer_item( WP_REST_Request $request ) {
		$file_obj = Urlslab_Data_File::get_file( $request->get_param( 'fileid' ) );
		if ( null !== $file_obj ) {
			if ( Urlslab_Driver::transfer_file_to_storage( $file_obj, $request->get_json_params()['driver'] ) ) {
				return new WP_REST_Response(
					(object) array(
						'message' => __( 'File transferred', 'urlslab' ),
					),
					200
				);
			} else {
				return new WP_REST_Response(
					(object) array(
						'message' => __( 'Transfer failed', 'urlslab' ),
					),
					500
				);
			}
		} else {
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'Transfer failed, file not found', 'urlslab' ),
				),
				404
			);
		}
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_FILES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_FILE_POINTERS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_FILE_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Deleted', 'urlslab' ),
			),
			200
		);
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_File( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'filestatus', 'labels' );
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

	public function get_file_urls_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_select_column( 'post_id', 'u' );
		$sql->add_from( URLSLAB_FILE_URLS_TABLE . ' m INNER JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$sql->add_filters( $this->get_filter_file_urls_columns(), $request );
		$sql->add_sorting( $this->get_filter_file_urls_columns(), $request );

		return $sql;
	}

	protected function get_filter_file_urls_columns() {
		return array_merge( $this->prepare_columns( ( new Urlslab_Data_File_Url() )->get_columns(), 'm' ), $this->prepare_columns( ( new Urlslab_Data_Url() )->get_columns(), 'u' ) );
	}

	/**
	 * @return array[]
	 */
	public function get_route_file_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_file_urls' ),
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

		$file_obj = new Urlslab_Data_File();
		foreach ( array_keys( $file_obj->get_columns() ) as $column ) {
			$sql->add_select_column( $column, 'f' );
		}

		$fil_pointer_obj = new Urlslab_Data_File_Pointer();
		foreach ( array_keys( $fil_pointer_obj->get_columns() ) as $column ) {
			switch ( $column ) {
				case 'filehash':
				case 'filesize':
					break;
				default:
					$sql->add_select_column( $column, 'p' );
			}
		}

		$sql->add_from( URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON p.filehash = f.filehash and p.filesize=f.filesize' );

		$sql->add_group_by( 'fileid', 'f' );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		$fil_pointer_obj = new Urlslab_Data_File_Pointer();

		return array_merge(
			$this->prepare_columns( $fil_pointer_obj->get_columns(), 'p' ),
			$this->prepare_columns( $this->get_row_object()->get_columns(), 'f' )
		);
	}


	protected function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'filestatus':
			case 'driver':
				return Urlslab_Data::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		if ( 'filestatus' === $column ) {
			return array(
				Urlslab_Driver::STATUS_NEW            => __( 'New', 'urlslab' ),
				Urlslab_Driver::STATUS_ACTIVE         => __( 'Available', 'urlslab' ),
				Urlslab_Driver::STATUS_ACTIVE_SYSTEM  => __( 'System File', 'urlslab' ),
				Urlslab_Driver::STATUS_PENDING        => __( 'Processing', 'urlslab' ),
				Urlslab_Driver::STATUS_NOT_PROCESSING => __( 'Not Processing', 'urlslab' ),
				Urlslab_Driver::STATUS_ERROR          => __( 'Error', 'urlslab' ),
				Urlslab_Driver::STATUS_DISABLED       => __( 'Disabled', 'urlslab' ),
			);
		}

		if ( 'driver' === $column ) {
			return array(
				Urlslab_Driver::DRIVER_NONE => __( 'None', 'urlslab' ),
				Urlslab_Driver::DRIVER_LOCAL_FILE => __( 'Local file', 'urlslab' ),
				Urlslab_Driver::DRIVER_DB         => __( 'Database', 'urlslab' ),
			);
		}

		return parent::get_enum_column_items( $column );
	}
}
