<?php

class Urlslab_Api_Configs extends Urlslab_Api_Table {
	const SLUG = 'configs';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base . '/write_htaccess',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'write_htaccess' ),
					'permission_callback' => array(
						$this,
						'write_htaccess_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	public function write_htaccess_permissions_check( $request ) {
		return current_user_can( 'administrator' );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Cache_Rule( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function write_htaccess( $request ) {
		/** @var Urlslab_Widget_General $widget */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );

		if ( ! defined( 'ABSPATH' ) ) {
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'Not supported', 'urlslab' ),
				),
				400
			);
		}


		$htaccess = new Urlslab_Tool_Htaccess();

		if ( $widget->get_option( Urlslab_Widget_General::SETTING_NAME_USE_HTACCESS ) ) {
			if ( ! $htaccess->is_writable() ) {
				return new WP_REST_Response(
					(object) array(
						'message' => __( 'File is not writable.', 'urlslab' ),
					),
					400
				);
			}

			if ( $htaccess->update() ) {
				return new WP_REST_Response(
					(object) array(
						'message' => __( '.htaccess file updated.', 'urlslab' ),
					),
					200
				);
			}
		} else {
			if ( $htaccess->cleanup() && Urlslab_Tool_Config::clear_advanced_cache() ) {
				return new WP_REST_Response(
					(object) array(
						'message' => __( '.htaccess file cleaned up.', 'urlslab' ),
					),
					200
				);
			}
		}

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Update failed', 'urlslab' ),
			),
			400
		);
	}
}
