<?php

class Urlslab_Api_Css_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/css-cache';
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(
						array(
							'filter_url'    => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 255 >= strlen( $param );
								},
							),
							'filter_status' => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									switch ( $param ) {
										case Urlslab_CSS_Cache_Row::STATUS_ACTIVE:
										case Urlslab_CSS_Cache_Row::STATUS_DISABLED:
										case Urlslab_CSS_Cache_Row::STATUS_NEW:
										case Urlslab_CSS_Cache_Row::STATUS_PENDING:
											return true;
										default:
											return false;
									}
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
			$base . '/(?P<url_id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'status' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_CSS_Cache_Row::STATUS_ACTIVE:
									case Urlslab_CSS_Cache_Row::STATUS_DISABLED:
									case Urlslab_CSS_Cache_Row::STATUS_NEW:
									case Urlslab_CSS_Cache_Row::STATUS_PENDING:
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
			$base . '/(?P<url_id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	public function get_items( $request ) {
		global $wpdb;
		$query_data = array();
		$where_data = array();

		if ( $request->get_param( 'from_id' ) ) {
			$where_data[] = 'url_id>%s';
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

		if ( strlen( $request->get_param( 'filter_url' ) ) ) {
			$where_data[] = 'url LIKE %s';
			$query_data[] = $request->get_param( 'filter_url' );
		}

		if ( strlen( $request->get_param( 'filter_status' ) ) ) {
			$where_data[] = 'status=%s';
			$query_data[] = $request->get_param( 'filter_status' );
		}

		$order_data = array();
		if ( $request->get_param( 'sort_column' ) ) {
			$order_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . ( $request->get_param( 'sort_direction' ) ? ' ' . $request->get_param( 'sort_direction' ) : '' );
			$order_data[] = 'url_id ASC';
		}

		$limit_string = '';
		if ( $request->get_param( 'rows_per_page' ) ) {
			$limit_string = '%d';
			$query_data[] = $request->get_param( 'rows_per_page' );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_CSS_CACHE_TABLE . // phpcs:ignore
				( ! empty( $where_data ) ? ' WHERE ' . implode( ' AND ', $where_data ) : '' ) . // phpcs:ignore
				( ! empty( $order_data ) ? ' ORDER BY ' . implode( ',', $order_data ) : '' ) . // phpcs:ignore
				( strlen( $limit_string ) ? ' LIMIT ' . $limit_string : '' ), // phpcs:ignore
				$query_data
			),
			OBJECT ); // phpcs:ignore
		if ( null == $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id;
			$row->filesize = (int) $row->filesize;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_CSS_Cache_Row( $params );
	}

	function get_editable_columns(): array {
		return array( 'status' );
	}
}
