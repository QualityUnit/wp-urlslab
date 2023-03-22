<?php

class Urlslab_Api_Languages extends Urlslab_Api_Base {
	public function register_routes() {
		$base = '/language';
		register_rest_route(
			self::NAMESPACE,
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
	}

	public function get_items( $request ) {
		try {

			$languages          = apply_filters( 'wpml_active_languages', null, 'skip_missing=0&orderby=code' );
			$response_languages = array( (object) array( 'code' => 'all', 'name' => __( 'All', 'urlslab' ) ) );
			if ( empty( $languages ) ) {
				$response_languages = array( (object) array( 'code' => 'en', 'name' => __( 'English', 'urlslab' ) ) );
			} else {
				foreach ( $languages as $language ) {
					$response_languages[] = (object) array(
						'code' => $language['code'],
						'name' => $language['translated_name'],
					);
				}
			}

			return new WP_REST_Response( $response_languages, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'urlslab' ) );
		}
	}
}
