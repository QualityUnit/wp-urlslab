<?php

class Urlslab_Api_Cron extends Urlslab_Api_Base {
	const SLUG = 'cron';

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
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<task>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'exec_all_crons' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(
						'unlock' => array(
							'required'          => false,
							'default'           => 0,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
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
			foreach ( Urlslab_Cron_Manager::get_instance()->get_cron_tasks() as $task ) {
				$data[] = (object) array(
					'cron_task'   => get_class( $task ),
					'description' => $task->get_description(),
				);
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of cron tasks', 'wp-urlslab' ) );
		}
	}

	public function exec_all_crons( WP_REST_Request $request ) {
		try {
			$task_name = $request->get_param( 'task' );
			if ( 'all' == $request->get_param( 'task' ) ) {
				$task_name = false;
			}

			if ( $request->get_param( 'unlock' ) ) {
				global $wpdb;
				$wpdb->query( 'DELETE FROM ' . $wpdb->prefix . "options WHERE option_name LIKE '_transient_urlslab_cron_%' OR option_name LIKE '_transient_timeout_urlslab_cron_%' LIMIT 1000" ); // phpcs:ignore
			}

			return new WP_REST_Response( Urlslab_Cron_Manager::get_instance()->exec_cron_task( $task_name ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to execute cron', 'wp-urlslab' ) );
		}
	}
}
