<?php

class Urlslab_Api_Cron extends Urlslab_Api_Base {
	public function register_routes() {
		$base = '/cron';
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
					'args'                => array(),
				),
			)
		);
	}

	public function get_items( WP_REST_Request $request ) {
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
			return new WP_Error( 'exception', __( 'Failed to get list of cron tasks', 'urlslab' ) );
		}
	}

	public function exec_all_crons( WP_REST_Request $request ) {
		try {
			$task_name = $request->get_param( 'task' );
			if ( 'all' == $request->get_param( 'task' ) ) {
				$task_name = false;
			}

			return new WP_REST_Response( Urlslab_Cron_Manager::get_instance()->exec_cron_task( $task_name ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to execute cron', 'urlslab' ) );
		}
	}
}
