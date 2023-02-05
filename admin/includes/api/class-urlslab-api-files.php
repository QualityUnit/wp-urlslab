<?php

class Urlslab_Api_Files extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/file';

		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(
						array(
							'filter_fileid'           => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 32 >= strlen( $param );
								},
							),
							'filter_url'              => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 1024 >= strlen( $param );
								},
							),
							'filter_parent_url'       => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 1024 >= strlen( $param );
								},
							),
							'filter_local_file'       => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 1024 >= strlen( $param );
								},
							),
							'filter_filename'         => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 750 >= strlen( $param );
								},
							),
							'filter_filetype'         => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 32 >= strlen( $param );
								},
							),
							'filter_filestatus'       => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									switch ( $param ) {
										case Urlslab_Driver::STATUS_NEW:
										case Urlslab_Driver::STATUS_ACTIVE:
										case Urlslab_Driver::STATUS_PENDING:
										case Urlslab_Driver::STATUS_ERROR:
											return true;
										default:
											return false;
									}
								},
							),
							'filter_filehash'         => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 32 >= strlen( $param );
								},
							),
							'filter_filesize'         => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
							'filter_webp_fileid'      => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 32 >= strlen( $param );
								},
							),
							'filter_avif_fileid'      => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 32 >= strlen( $param );
								},
							),
							'filter_file_usage_count' => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
						)
					),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
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
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'filestatus' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Driver::STATUS_NEW:
									case Urlslab_Driver::STATUS_ACTIVE:
									case Urlslab_Driver::STATUS_PENDING:
									case Urlslab_Driver::STATUS_ERROR:
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
					'callback'            => array( $this, 'detele_all_items' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<fileid>[0-9a-zA-Z]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<fileid>[0-9a-zA-Z]+)/urls',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_file_urls' ),
					'args'                => array(
						'rows_per_page' => array(
							'required'          => true,
							'default'           => self::ROWS_PER_PAGE,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 0 < $param && 200 > $param;
							},
						),
						'from_urlMd5'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param );
							},
						),
					),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);
	}


	public function get_items( $request ) {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'f' );
		$sql->add_select_column( '*', 'p' );
		$sql->add_select_column( 'SUM(!ISNULL(m.urlMd5))', false, 'file_usage_count' );
		$sql->add_from(
			URLSLAB_FILES_TABLE . ' f' . ' LEFT JOIN ' . URLSLAB_FILE_URLS_TABLE . ' m ON m.fileid = f.fileid' .
			' LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON p.filehash = f.filehash and p.filesize=f.filesize'
		);

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_fileid' );
		$sql->add_filter( 'filter_url', '%s', 'LIKE' );
		$sql->add_filter( 'filter_parent_url', '%s', 'LIKE' );
		$sql->add_filter( 'filter_local_file', '%s', 'LIKE' );
		$sql->add_filter( 'filter_filename', '%s', 'LIKE' );
		$sql->add_filter( 'filter_filetype', '%s', 'LIKE' );
		$sql->add_filter( 'filter_filestatus' );
		$sql->add_filter( 'filter_filehash' );
		$sql->add_filter( 'filter_filesize', '%d' );
		$sql->add_filter( 'filter_webp_fileid' );
		$sql->add_filter( 'filter_avif_fileid' );
		$sql->add_having_filter( 'filter_file_usage_count', '%d' );

		$sql->add_group_by( 'fileid', 'f' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'fileid' );

		$rows = $sql->get_results();

		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			$row->file_usage_count = (int) $row->file_usage_count;
			$row->filesize         = (int) $row->filesize;
			$row->width            = (int) $row->width;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_file_urls( $request ) {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'urlMd5', 'm' );
		$sql->add_select_column( 'urlName', 'u' );
		$sql->add_from( URLSLAB_FILE_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.urlMd5 = u.urlMd5)' );
		$sql->add_filter( 'fileid' );
		$sql->add_filter( 'from_urlMd5', '%d' );
		$sql->add_order( 'urlMd5' );
		$rows = $sql->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}
		foreach ( $rows as $row ) {
			$row->urlMd5 = (int) $row->urlMd5;// phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function delete_item( $request ) {
		global $wpdb;

		$delete_params           = array();
		$delete_params['fileid'] = $request->get_param( 'fileid' );


		if ( false === $wpdb->delete( URLSLAB_FILES_TABLE, $delete_params ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}
		if ( false === $wpdb->delete( URLSLAB_FILE_URLS_TABLE, $delete_params ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	public function detele_all_items( $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_FILES_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_FILE_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_File_Data( $params );
	}

	function get_editable_columns(): array {
		return array( 'filestatus' );
	}


}
