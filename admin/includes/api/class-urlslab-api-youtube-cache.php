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
					'args'                => array(),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$namespace,
			$base . '/(?P<setting_name>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'args'                => array(),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array( 'value' => array( 'required' => true ) ),
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

}
