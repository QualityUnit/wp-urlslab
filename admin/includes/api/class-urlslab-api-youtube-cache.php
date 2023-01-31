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
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'read' );
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
			$query_data[] = $request->get_param( 'from_id' );
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

	public function delete_item( $request ) {
		global $wpdb;

		if ( false === $wpdb->delete( URLSLAB_YOUTUBE_CACHE_TABLE, array( 'videoid' => $request->get_param( 'videoid' ) ) ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( 'Youtube video cache object deleted', 200 );
	}
}
