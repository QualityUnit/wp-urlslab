<?php

class Urlslab_Api_Modules extends WP_REST_Controller {
	public function register_routes() {
		$namespace = 'urlslab/v1';
		$base      = '/module';
		register_rest_route(
			$namespace,
			$base,
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
			$base . '/(?P<id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'active' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
					),
				),
			)
		);
	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'read' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'administrator' );
	}

	public function get_items( $request ) {
		try {
			$data = array();
			foreach ( Urlslab_Available_Widgets::get_instance()->get_available_widgets() as $widget ) {
				$data[] = $this->get_widget_data( $widget );
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'urlslab' ) );
		}
	}

	private function get_widget_data( Urlslab_Widget $widget ): stdClass {
		return (object) array(
			'id'          => $widget->get_widget_slug(),
			'title'       => $widget->get_widget_title(),
			'apikey'      => $widget->is_api_key_required(),
			'description' => $widget->get_widget_description(),
			'active'      => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
		);
	}

	public function get_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( false === $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
			}

			return new WP_REST_Response( $this->get_widget_data( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get module', 'urlslab' ) );
		}
	}

	public function update_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( false === $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
			}

			if ( $request->get_json_params()['active'] ) {
				Urlslab_User_Widget::get_instance()->activate_widget( $widget );
			} else {
				Urlslab_User_Widget::get_instance()->deactivate_widget( $widget );
			}
			return new WP_REST_Response( $this->get_widget_data( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'urlslab' ), array( 'status' => 500 ) );
		}
	}
}
