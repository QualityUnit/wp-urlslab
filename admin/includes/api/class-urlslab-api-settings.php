<?php

class Urlslab_Api_Settings extends WP_REST_Controller {
	public function register_routes() {
		$namespace = 'urlslab/v1';
		$base      = '/settings';
		$module    = '(?P<module_id>[0-9a-zA-Z_\-]+)';
		register_rest_route(
			$namespace,
			$base . '/' . $module . '/',
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
			$base . '/' . $module . '/(?P<setting_name>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array( 'value' => array( 'required' => true ) ),
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

	private function prepare_options_and_sections( Urlslab_Widget $widget ) {
		$sections   = array();
		$sections[] = array(
			'id'          => 'default',
			'title'       => '',
			'description' => '',
			'options'     => $widget->get_options( 'default' ),
		);
		foreach ( $widget->get_option_sections() as $section ) {
			foreach ( $widget->get_options( $section['id'] ) as $option ) {
				$section['options'][] = (object) $option;
			}
			$sections[] = (object) $section;
		}

		return $sections;
	}

	public function get_items( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'module_id' ) );
			if ( false == $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
			}

			return new WP_REST_Response( $this->prepare_options_and_sections( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'urlslab' ) );
		}
	}

	public function update_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'module_id' ) );
			if ( false == $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
			}

			if ( ! isset( $widget->get_options()[ $request->get_param( 'setting_name' ) ] ) ) {
				return new WP_Error( 'error', __( 'Setting name is not defined in module', 'urlslab' ), array( 'status' => 500 ) );
			}

			if ( $widget->update_option( $request->get_param( 'setting_name' ), $request->get_json_params()['value'] ) ) {
				return new WP_REST_Response( $this->prepare_options_and_sections( $widget ), 200 );
			}

			return new WP_Error( 'error', __( 'Failed to save setting', 'urlslab' ), array( 'status' => 500 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'urlslab' ), array( 'status' => 500 ) );
		}
	}
}
