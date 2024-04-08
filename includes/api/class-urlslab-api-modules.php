<?php

class Urlslab_Api_Modules extends Urlslab_Api_Base {
	const SLUG = 'module';

	public function get_post_types( $request ) {
		return Urlslab_Widget_Related_Resources::get_available_post_types();
	}

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_items' ),
					'args'                => array(
						'modules' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_array( $param );
							},
						),
					),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/postTypes',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_post_types' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'active' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_bool( $param );
							},
						),
					),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		try {
			$data = array();
			foreach ( Urlslab_Available_Widgets::get_instance()->get_available_widgets() as $widget ) {
				$widget_data              = $this->get_widget_data( $widget );
				$data[ $widget_data->id ] = $widget_data;
			}

			return new WP_REST_Response( (object) $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'wp-urlslab' ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_items( $request ) {
		$available_widgets = Urlslab_Available_Widgets::get_instance();
		foreach ( $request->get_param( 'modules' ) as $module ) {
			if ( ! isset( $module['id'] ) || Urlslab_Widget_General::SLUG === $module['id'] ) {
				return new WP_Error( 'not-found', __( 'Wrong Module to update or no id passed', 'wp-urlslab' ), array( 'status' => 400 ) );
			}
			$widget = $available_widgets->get_widget( $module['id'] );

			if ( null === $widget ) {
				return new WP_Error(
					'not-found',
					__( 'Module not found ', 'wp-urlslab' ) . $module['id'],
					array( 'status' => 400 )
				);
			}

			if ( ! isset( $module['active'] ) ) {
				return new WP_Error(
					'not-found',
					__( 'No active parameter passed', 'wp-urlslab' ),
					array( 'status' => 400 )
				);
			}

			if ( $module['active'] ) {
				Urlslab_User_Widget::get_instance()->activate_widget( $widget );
			} else {
				Urlslab_User_Widget::get_instance()->deactivate_widget( $widget );
			}
			flush_rewrite_rules(); //phpcs:ignore
		}

		return new WP_REST_Response( (object) array( 'acknowledged' => true ), 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( null === $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'wp-urlslab' ), array( 'status' => 400 ) );
			}

			return new WP_REST_Response( $this->get_widget_data( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get module', 'wp-urlslab' ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'id' ) );
			if ( null === $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'wp-urlslab' ), array( 'status' => 400 ) );
			}

			if ( $request->get_json_params()['active'] ) {
				Urlslab_User_Widget::get_instance()->activate_widget( $widget );
			} else {
				Urlslab_User_Widget::get_instance()->deactivate_widget( $widget );
			}
			flush_rewrite_rules(); //phpcs:ignore
			return new WP_REST_Response( $this->get_widget_data( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'wp-urlslab' ), array( 'status' => 500 ) );
		}
	}

	private function get_widget_data( Urlslab_Widget $widget ): stdClass {
		return (object) array(
			'id'           => $widget->get_widget_slug(),
			'title'        => $widget->get_widget_title(),
			'apikey'       => $widget->is_api_key_required(),
			'description'  => $widget->get_widget_description(),
			'labels'       => $widget->get_widget_labels(),
			'active'       => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
			'has_settings' => ! empty( $widget->get_options() ),
			'group'        => $widget->get_widget_group(),
		);
	}
}
