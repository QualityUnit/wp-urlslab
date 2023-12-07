<?php

class Urlslab_Api_Security extends Urlslab_Api_Table {
	const SLUG = 'security';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base . '/report_csp',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'report_csp' ),
					'permission_callback' => array(
						$this,
						'report_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	public function report_permissions_check( $request ) {
		return true;
	}

	public function report_csp( $request ) {
		return new WP_REST_Response( '', 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Security( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
