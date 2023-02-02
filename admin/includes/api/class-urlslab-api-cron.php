<?php

class Urlslab_Api_Cron extends Urlslab_Api_Base {
	public function register_routes() {
		$base      = '/cron';
		register_rest_route(
			self::NAMESPACE,
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
			self::NAMESPACE,
			$base . '/(?P<task>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'exec_all_crons' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	public function get_items( $request ) {
		try {
			$data = array();
			foreach ( Urlslab_Cron_Manager::get_instance()->get_cron_tasks() as $task ) {
				$data[] = get_class( $task );
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to get list of cron tasks', 'urlslab' ) );
		}
	}

	public function exec_all_crons( $request ) {
		try {
			$data       = array();
			$start_time = time();
			$max_time   = 15;
			foreach ( Urlslab_Cron_Manager::get_instance()->get_cron_tasks() as $task ) {
				if ( $max_time > ( time() - $start_time ) ) {
					if ( 'all' == $request->get_param( 'task' ) || get_class( $task ) == $request->get_param( 'task' ) ) {
						try {
							$task_time = time();
							$task->api_exec( $start_time, 15 );
							$data[ get_class( $task ) ] = time() - $task_time;
						} catch ( Exception $e ) {
							$data[ get_class( $task ) ] = $e->getMessage();
						}
					}
				}
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to execute cron', 'urlslab' ) );
		}
	}
}
