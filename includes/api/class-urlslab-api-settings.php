<?php

class Urlslab_Api_Settings extends Urlslab_Api_Base {
	const SLUG = 'settings';

	public function register_routes() {
		$base   = '/' . self::SLUG;
		$module = '(?P<module_id>[0-9a-zA-Z_\-]+)';
		register_rest_route(
			self::NAMESPACE,
			$base . '/' . $module . '/',
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
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/' . $module . '/(?P<setting_name>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array( 'value' => array( 'required' => true ) ),
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
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'module_id' ) );
			if ( null == $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 400 ) );
			}

			return new WP_REST_Response( $this->prepare_options_and_sections( $widget ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of modules', 'urlslab' ) );
		}
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		try {
			$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $request->get_param( 'module_id' ) );
			if ( null == $widget ) {
				return new WP_Error( 'not-found', __( 'Module not found', 'urlslab' ), array( 'status' => 400 ) );
			}

			if ( ! isset( $widget->get_options()[ $request->get_param( 'setting_name' ) ] ) ) {
				return new WP_Error( 'error', __( 'Setting name is not defined in module', 'urlslab' ), array( 'status' => 400 ) );
			}

			if ( $widget->update_option( $request->get_param( 'setting_name' ), $request->get_json_params()['value'] ) ) {
				return new WP_REST_Response( $this->prepare_options_and_sections( $widget ), 200 );
			}

			return new WP_Error( 'error', __( 'Failed to save setting', 'urlslab' ), array( 'status' => 400 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update module', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	private function prepare_options_and_sections( Urlslab_Widget $widget ) {
		$sections = array();

		foreach ( $widget->get_option_sections() as $section ) {
			foreach ( $widget->get_options( $section['id'] ) as $option ) {
				if ( Urlslab_Widget::OPTION_TYPE_HIDDEN !== $option['type'] ) {
					$option['value'] = $widget->get_option( $option['id'] );
					if ( Urlslab_Widget::OPTION_TYPE_PASSWORD == $option['type'] && strlen( $option['value'] ) > 0 ) {
						$option['value'] = Urlslab_Widget::PASSWORD_PLACEHOLDER;
					}
					if ( Urlslab_Widget::OPTION_TYPE_DATETIME == $option['type'] ) {
						$fetched_val = intval( $widget->get_option( $option['id'] ) );
						if ( $fetched_val ) {
							$option['value'] = $fetched_val;
						} else {
							$option['value'] = time();
						}                   
					}
					if ( Urlslab_Widget::OPTION_TYPE_CHECKBOX == $option['type'] ) {
						$option['value'] = (bool) $widget->get_option( $option['id'] );
					}
					$section['options'][ $option['id'] ] = (object) $option;
				}
			}
			$sections[] = (object) $section;
		}

		return $sections;
	}
}
