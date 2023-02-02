<?php

class Urlslab_Api_Youtube_Cache extends WP_REST_Controller {
	public function register_routes() {
		$namespace = 'urlslab/v1';
		$base      = '/youtube-cache';
		register_rest_route(
			$namespace,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(
						'rows_per_page'    => array(
							'required'          => true,
							'default'           => 20,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 0 < $param && 100 > $param;
							},
						),
						'sort_column'      => array(
							'required'          => false,
							'default'           => 'status_changed',
							'validate_callback' => function( $param ) {
								return is_string( $param ) && 0 < strlen( $param );
							},
						),
						'sort_direction'   => array(
							'required'          => false,
							'default'           => 'ASC',
							'validate_callback' => function( $param ) {
								return 'ASC' == $param || 'DESC' == $param;
							},
						),
						'from_id'          => array(
							'required' => false,
						),
						'from_sort_column' => array(
							'required' => false,
						),
						'filter_videoid'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 0 == strlen( $param ) || 32 >= strlen( $param );
							},
						),
						'filter_status'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Youtube_Data::STATUS_AVAILABLE:
									case Urlslab_Youtube_Data::STATUS_NEW:
									case Urlslab_Youtube_Data::STATUS_DISABLED:
									case Urlslab_Youtube_Data::STATUS_PROCESSING:
										return true;
									default:
										return false;
								}
							},
						),
					),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$namespace,
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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
									case Urlslab_Youtube_Data::STATUS_NEW:
									case Urlslab_Youtube_Data::STATUS_DISABLED:
									case Urlslab_Youtube_Data::STATUS_AVAILABLE:
									case Urlslab_Youtube_Data::STATUS_PROCESSING:
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
			$namespace,
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'administrator' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'administrator' );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'administrator' );
	}

	public function get_items( $request ) {
		global $wpdb;
		$query_data = array();
		$where_data = array();

		if ( $request->get_param( 'from_id' ) ) {
			$where_data[] = 'videoid>%s';
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

		if ( strlen( $request->get_param( 'filter_videoid' ) ) ) {
			$where_data[] = 'videoid=%s';
			$query_data[] = $request->get_param( 'filter_videoid' );
		}

		if ( strlen( $request->get_param( 'filter_status' ) ) ) {
			$where_data[] = 'status=%s';
			$query_data[] = $request->get_param( 'filter_status' );
		}

		$order_data = array();
		if ( $request->get_param( 'sort_column' ) ) {
			$order_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . ( $request->get_param( 'sort_direction' ) ? ' ' . $request->get_param( 'sort_direction' ) : '' );
			$order_data[] = 'videoid ASC';
		}

		$limit_string = '';
		if ( $request->get_param( 'rows_per_page' ) ) {
			$limit_string = '%d';
			$query_data[] = $request->get_param( 'rows_per_page' );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . // phpcs:ignore
				( ! empty( $where_data ) ? ' WHERE ' . implode( ' AND ', $where_data ) : '' ) . // phpcs:ignore
				( ! empty( $order_data ) ? ' ORDER BY ' . implode( ',', $order_data ) : '' ) . // phpcs:ignore
				( strlen( $limit_string ) ? ' LIMIT ' . $limit_string : '' ), // phpcs:ignore
				$query_data
			),
			OBJECT ); // phpcs:ignore
		if ( null == $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function update_item( $request ) {
		try {

			$row = new Urlslab_Youtube_Data( array( 'videoid' => $request->get_param( 'videoid' ) ) );
			if ( $row->load() ) {
				if ( $row->get( 'status' ) != $request->get_json_params()['status'] ) {
					$row->set( 'status', $request->get_json_params()['status'] );
					$row->update();
				}

				return new WP_REST_Response( $row->as_array(), 200 );
			} else {
				return new WP_Error( 'not-found', __( 'Row not found', 'urlslab' ), array( 'status' => 404 ) );
			}
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update', 'urlslab' ), array( 'status' => 500 ) );
		}
	}


	public function delete_item( $request ) {
		global $wpdb;

		if ( false === $wpdb->delete( URLSLAB_YOUTUBE_CACHE_TABLE, array( 'videoid' => $request->get_param( 'videoid' ) ) ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( 'Youtube video cache object deleted', 200 );
	}
}
