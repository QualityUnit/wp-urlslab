<?php

class Urlslab_Api_Tasks extends Urlslab_Api_Table {
	const SLUG = 'task';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/(?P<task_id>[0-9]+)', $this->get_route_get_task() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<task_id>[0-9]+)', $this->get_route_delete_task() );
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );

		register_rest_route(
			self::NAMESPACE,
			$base . '/delete-all',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_all_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/delete',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'delete_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

	}


	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'priority'      => array(
					'required'          => false,
					'default'           => 255,
					'validate_callback' => function( $param ) {
						return is_int( $param );
					},
				),
				'time_from'     => array(
					'required'          => false,
					'default'           => time(),
					'validate_callback' => function( $param ) {
						return is_int( $param );
					},
				),
				'slug'          => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && ! empty( $param );
					},
				),
				'executor_type' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return null !== Urlslab_Executor::get_executor( $param );
					},
				),
				'data'          => array(
					'required'          => false,
					'default'           => '',
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => array( $this, 'create_item_permissions_check' ),
		);
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->task_id       = (int) $row->task_id;
			$row->top_parent_id = (int) $row->top_parent_id;
			$row->parent_id     = (int) $row->parent_id;
			$row->priority      = (int) $row->priority;
			$row->lock_id       = (int) $row->lock_id;
			$row->time_from     = (int) $row->time_from;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Task( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
		);
	}

	private function get_route_get_task(): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_task' ),
			'args'                => array(
				'max_execution_time' => array(
					'required'          => false,
					'default'           => 5,
					'validate_callback' => function( $param ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
		);
	}

	private function get_route_delete_task(): array {
		return array(
			'methods'             => WP_REST_Server::DELETABLE,
			'callback'            => array( $this, 'delete_task' ),
			'args'                => array(),
			'permission_callback' => array( $this, 'delete_item_permissions_check' ),
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_task( $request ) {
		try {
			$task = new Urlslab_Data_Task( array( 'task_id' => ( (int) $request->get_param( 'task_id' ) ) ), false );
			if ( $task->load() ) {
				$executor = Urlslab_Executor::get_executor( $task->get_executor_type() );
				$executor->set_max_execution_time( $request->get_param( 'max_execution_time' ) );
				$executor->execute( $task );
				$executor->unlock_all_tasks();
				$task->load();    //reload task to get latest results
				$result           = $task->as_array();
				$result['result'] = json_decode( $result['result'], true );

				return new WP_REST_Response( $result, 200 );
			} else {
				return new WP_REST_Response(
					(object) array(
						'message' => __( 'Task not found', 'urlslab' ),
					), 
					404 
				);
			}
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_task( $request ) {
		try {
			$task = new Urlslab_Data_Task( array( 'task_id' => $request->get_param( 'task_id' ) ), false );
			$task->delete_task();

			return new WP_REST_Response(
				(object) array(
					'message' => __( 'Deleted', 'urlslab' ),
				),
				200 
			);
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
	}
}
