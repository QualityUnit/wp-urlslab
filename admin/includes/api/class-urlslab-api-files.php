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
		global $wpdb;
		$query_data = array();
		$where_data = array();

		if ( $request->get_param( 'from_id' ) ) {
			$where_data[] = 'fileid>%s';
			$query_data[] = $request->get_param( 'from_id' );
		}
		if ( $request->get_param( 'from_sort_column' ) ) {
			if ( 'DESC' == $request->get_param( 'sort_direction' ) ) {
				$where_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . '<%s';
			} else {
				$where_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . '>%s';
			}
			$query_data[] = $request->get_param( 'from_sort_column' );
		}

		if ( strlen( $request->get_param( 'filter_fileid' ) ) ) {
			$where_data[] = 'fileid=%s';
			$query_data[] = $request->get_param( 'filter_fileid' );
		}
		if ( strlen( $request->get_param( 'filter_url' ) ) ) {
			$where_data[] = 'url LIKE %s';
			$query_data[] = $request->get_param( 'filter_url' );
		}
		if ( strlen( $request->get_param( 'filter_parent_url' ) ) ) {
			$where_data[] = 'parent_url LIKE %s';
			$query_data[] = $request->get_param( 'filter_parent_url' );
		}
		if ( strlen( $request->get_param( 'filter_local_file' ) ) ) {
			$where_data[] = 'local_file LIKE %s';
			$query_data[] = $request->get_param( 'filter_local_file' );
		}
		if ( strlen( $request->get_param( 'filter_filename' ) ) ) {
			$where_data[] = 'filename LIKE %s';
			$query_data[] = $request->get_param( 'filter_filename' );
		}
		if ( strlen( $request->get_param( 'filter_filetype' ) ) ) {
			$where_data[] = 'filetype LIKE %s';
			$query_data[] = $request->get_param( 'filter_filetype' );
		}
		if ( strlen( $request->get_param( 'filter_filestatus' ) ) ) {
			$where_data[] = 'filestatus=%s';
			$query_data[] = $request->get_param( 'filter_filestatus' );
		}
		if ( strlen( $request->get_param( 'filter_filehash' ) ) ) {
			$where_data[] = 'filehash=%s';
			$query_data[] = $request->get_param( 'filter_filehash' );
		}
		if ( strlen( $request->get_param( 'filter_filesize' ) ) ) {
			$where_data[] = 'filesize=%d';
			$query_data[] = $request->get_param( 'filter_filesize' );
		}
		if ( strlen( $request->get_param( 'filter_webp_fileid' ) ) ) {
			$where_data[] = 'webp_fileid=%s';
			$query_data[] = $request->get_param( 'filter_webp_fileid' );
		}
		if ( strlen( $request->get_param( 'filter_avif_fileid' ) ) ) {
			$where_data[] = 'avif_fileid=%s';
			$query_data[] = $request->get_param( 'filter_avif_fileid' );
		}

		$having_data = array();
		if ( strlen( $request->get_param( 'filter_file_usage_count' ) ) ) {
			$having_data[] = 'file_usage_count=%d';
			$query_data[]  = (int) $request->get_param( 'filter_file_usage_count' );
		}


		$order_data = array();
		if ( $request->get_param( 'sort_column' ) ) {
			$order_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . ( $request->get_param( 'sort_direction' ) ? ' ' . $request->get_param( 'sort_direction' ) : '' );
		}
		$order_data[] = 'fileid ASC';

		$limit_string = '';
		if ( $request->get_param( 'rows_per_page' ) ) {
			$limit_string = '%d';
			$query_data[] = (int) $request->get_param( 'rows_per_page' );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT f.*, p.*, SUM(!ISNULL(m.urlMd5)) AS file_usage_count' .
				' FROM ' . URLSLAB_FILES_TABLE . ' f' . // phpcs:ignore
				' LEFT JOIN ' . URLSLAB_FILE_URLS_TABLE . ' m ON m.fileid = f.fileid' . // phpcs:ignore
				' LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON p.filehash = f.filehash and p.filesize=f.filesize' . // phpcs:ignore

				// phpcs:ignore
				( ! empty( $where_data ) ? ' WHERE ' . implode( ' AND ', $where_data ) : '' ) . // phpcs:ignore
				' GROUP BY f.fileid' .
				( ! empty( $having_data ) ? ' HAVING ' . implode( ' AND ', $having_data ) : '' ) . // phpcs:ignore
				( ! empty( $order_data ) ? ' ORDER BY ' . implode( ',', $order_data ) : '' ) . // phpcs:ignore
				( strlen( $limit_string ) ? ' LIMIT ' . $limit_string : '' ), // phpcs:ignore
				$query_data
			),
			OBJECT ); // phpcs:ignore
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
		global $wpdb;
		$query_data = array();
		$where_data = array();

		if ( $request->get_param( 'fileid' ) ) {
			$where_data[] = 'fileid=%s';
			$query_data[] = $request->get_param( 'fileid' );
		}
		if ( $request->get_param( 'from_urlMd5' ) ) {
			$where_data[] = 'urlMd5>%d';
			$query_data[] = $request->get_param( 'from_urlMd5' );
		}

		$order_data   = array();
		$order_data[] = 'urlMd5 ASC';

		$limit_string = '';
		if ( $request->get_param( 'rows_per_page' ) ) {
			$limit_string = '%d';
			$query_data[] = (int) $request->get_param( 'rows_per_page' );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT m.urlMd5,	u.urlName' .
				' FROM ' . URLSLAB_FILE_URLS_TABLE . ' m ' .  // phpcs:ignore
				' LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.urlMd5 = u.urlMd5)' . // phpcs:ignore
				( ! empty( $where_data ) ? ' WHERE ' . implode( ' AND ', $where_data ) : '' ) . // phpcs:ignore
				( ! empty( $order_data ) ? ' ORDER BY ' . implode( ',', $order_data ) : '' ) . // phpcs:ignore
				( strlen( $limit_string ) ? ' LIMIT ' . $limit_string : '' ), // phpcs:ignore
				$query_data
			),
			OBJECT ); // phpcs:ignore
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
