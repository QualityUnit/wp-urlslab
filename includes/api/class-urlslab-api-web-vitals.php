<?php

class Urlslab_Api_Web_Vitals extends Urlslab_Api_Table {
	const SLUG = 'web-vitals';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base . '/wvmetrics',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'log_web_vitals' ),
					'permission_callback' => array(
						$this,
						'create_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/wvimg/(?P<id>[a-z0-9\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'log_image' ),
					'permission_callback' => array(
						$this,
						'create_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	public function log_web_vitals( $request ) {
		$body = json_decode($request->get_body(), true);

		return new WP_REST_Response( '', 200 );
	}

	public function log_image( $request ) {
		$img = $request->get_body();

		return new WP_REST_Response( '', 200 );
	}

	public function create_item_permissions_check( $request ) {
		return true;
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Web_Vital( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
