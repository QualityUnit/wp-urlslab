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
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( true ),
				),
			)
		);

		register_rest_route(
			$namespace,
			$base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'context' => array(
							'default' => 'view',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( false ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(
						'force' => array(
							'default' => false,
						),
					),
				),
			)
		);
	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'read' );
	}

	public function create_item_permissions_check( $request ) {
		return false;    //It is not possible to create any module aby api
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_plugins' );
	}

	public function delete_item_permissions_check( $request ) {
		return false;
	}

	public function create_item( $request ) {
		return new WP_Error( 'invalid-method', __( 'New module can not be created by API call', 'urlslab' ), array( 'status' => 500 ) );
	}

	public function delete_item( $request ) {
		return new WP_Error( 'invalid-method', __( 'Module can not be deleted by API call', 'urlslab' ), array( 'status' => 500 ) );
	}

	public function get_items( $request ) {
		try {
			$data = array();
			foreach ( Urlslab_Available_Widgets::get_instance()->get_available_widgets() as $widget ) {
				$data[] = (object) array(
					'id'          => $widget->get_widget_slug(),
					'title'       => $widget->get_widget_title(),
					'apikey'      => false,
					'description' => $widget->get_widget_description(),
					'active'      => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
				);
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'urlslab' ) );
		}
	}

	public function get_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( false !== $widget ) {
				$data = (object) array(
					'id'          => $widget->get_widget_slug(),
					'title'       => $widget->get_widget_title(),
					'apikey'      => false,
					'description' => $widget->get_widget_description(),
					'active'      => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
				);

				return new WP_REST_Response( $data, 200 );
			}

			return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get module', 'urlslab' ) );
		}
	}

	public function update_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( false !== $widget ) {
				if ( false == $request->get_param( 'active' ) ) {
					Urlslab_User_Widget::get_instance()->activate_widget( $widget );
				} else {
					Urlslab_User_Widget::get_instance()->deactivate_widget( $widget );
				}

				$data = (object) array(
					'id'          => $widget->get_widget_slug(),
					'title'       => $widget->get_widget_title(),
					'apikey'      => false,
					'description' => $widget->get_widget_description(),
					'active'      => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
				);

				return new WP_REST_Response( $data, 200 );
			}

			return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 404 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'urlslab' ), array( 'status' => 500 ) );
		}
	}
}
