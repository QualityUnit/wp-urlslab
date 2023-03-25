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

	public function exec_all_crons( $request ) {
		try {
			$data         = array();
			$start_time   = time();
			$max_time     = 20;
			$failed_tasks = array();
			while ( $max_time > ( time() - $start_time ) ) {

				$executed_tasks_nr = 0;

				foreach ( Urlslab_Cron_Manager::get_instance()->get_cron_tasks() as $task ) {
					if (
						! in_array( get_class( $task ), $failed_tasks ) &&
						( 'all' == $request->get_param( 'task' ) || get_class( $task ) == $request->get_param( 'task' ) )
					) {
						try {
							$task_time = time();
							if ( $task->api_exec( $start_time, 5 ) ) {
								$executed_tasks_nr ++;
							} else {
								$failed_tasks[] = get_class( $task );
							}
							$exec_time = time() - $task_time;
							if ( $exec_time > 0 ) {
								$data[] = (object) array(
									'exec_time'   => $exec_time,
									'task'        => get_class( $task ),
									'description' => $task->get_description(),
								);
							}
						} catch ( Exception $e ) {
							$data[] = (object) array(
								'exec_time'   => $exec_time,
								'task'        => get_class( $task ),
								'description' => $e->getMessage(),
							);
						}
					}
				}

				if ( 0 == $executed_tasks_nr ) {
					break; //all tasks failed or no tasks wait for execution
				}
			}

			return new WP_REST_Response( $data, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to execute cron', 'urlslab' ) );
		}
	}
}
