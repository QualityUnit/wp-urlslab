<?php

class Urlslab_Executor {
	protected static $deadline = 0;
	protected static int $lock_id;

	private static function get_lock_id() {
		if ( empty( self::$lock_id ) ) {
			self::$lock_id = rand( 0, 1000000 );
		}

		return self::$lock_id;
	}

	public static function get_executor( string $executor_type ): ?Urlslab_Executor {
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-urls-batch.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-generate.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-url-intersection.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-generate-url-context.php';

		switch ( $executor_type ) {
			case Urlslab_Executor_Download_Url::TYPE:
				return new Urlslab_Executor_Download_Url();
			case Urlslab_Executor_Download_Urls_Batch::TYPE:
				return new Urlslab_Executor_Download_Urls_Batch();
			case Urlslab_Executor_Generate::TYPE:
				return new Urlslab_Executor_Generate();
			case Urlslab_Executor_Url_Intersection::TYPE:
				return new Urlslab_Executor_Url_Intersection();
			case Urlslab_Executor_Generate_Url_Context::TYPE:
				return new Urlslab_Executor_Generate_Url_Context();
			default:
				return null;
		}
	}

	public function schedule( $data, ?Urlslab_Data_Task $parent = null ): Urlslab_Data_Task {
		$row_data                  = array();
		$row_data['data']          = $data;
		$row_data['executor_type'] = $this->get_type();
		if ( $parent ) {
			$row_data['slug']          = $parent->get_slug();
			$row_data['priority']      = $parent->get_priority() - 1;
			$row_data['parent_id']     = $parent->get_task_id();
			$row_data['top_parent_id'] = $parent->get_top_parent_id() ? $parent->get_top_parent_id() : $parent->get_task_id();
		}
		$task = new Urlslab_Data_Task( $row_data, false );

		$task->insert();

		return $task;
	}

	public function execute( Urlslab_Data_Task $task_row ): bool {
		try {
			while ( ! $this->is_deadline_reached() && $task_row->get_time_from() <= time() ) {
				if ( Urlslab_Data_Task::STATUS_NEW === $task_row->get_status() ) {
					if ( $this->lock_task( $task_row ) ) {
						if ( ! $this->schedule_subtasks( $task_row ) ) {
							$this->execution_failed( $task_row );

							return false;
						}
					}
				}

				if ( Urlslab_Data_Task::STATUS_IN_PROGRESS === $task_row->get_status() && ! $this->is_deadline_reached() && $task_row->get_time_from() <= time() ) {
					while ( 0 < $task_row->count_not_finished_subtasks() && $this->execute_one_subtask( $task_row ) ) {
					}
					if ( 0 === $task_row->count_not_finished_subtasks() ) {
						if ( ! $this->on_all_subtasks_done( $task_row ) ) {
							return false;
						}
						$this->execution_finished( $task_row );

						return true;
					} else {
						$this->execution_postponed( $task_row );

						return false;
					}
				}

				if ( Urlslab_Data_Task::STATUS_FINISHED === $task_row->get_status() || Urlslab_Data_Task::STATUS_ERROR === $task_row->get_status() ) {
					return true;
				}
			}

			//executor time expired
			$this->execution_postponed( $task_row, 1 );

			return false;
		} catch ( Throwable $e ) {
			$task_row->set_result( $e->getMessage() );
			$this->execution_failed( $task_row );

			return false;
		}
	}

	public function unlock_all_tasks() {
		if ( empty( self::$lock_id ) ) {
			return;
		}
		global $wpdb;
		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_TASKS_TABLE . ' SET lock_id=0 WHERE lock_id=%d', self::$lock_id ) ); // phpcs:ignore
	}

	protected function lock_task( Urlslab_Data_Task $task_row ): bool {
		if ( $task_row->get_executor_type() != $this->get_type() ) {
			return false;
		}

		//maybe we should check expire time here
		if ( Urlslab_Data_Task::STATUS_IN_PROGRESS === $task_row->get_status() && $task_row->get_lock_id() ) {
			return true;
		}

		$task_row->set_status( Urlslab_Data_Task::STATUS_IN_PROGRESS );
		if ( ! $task_row->get_lock_id() ) {
			$task_row->set_lock_id( self::get_lock_id() );
		}
		if ( $task_row->update( array( 'status', 'lock_id' ) ) ) {
			$task_row->load();
			if ( $task_row->get_lock_id() !== self::get_lock_id() ) {
				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	protected function execution_postponed( Urlslab_Data_Task $task_row, $delay = 5 ) {
		$task_row->set_lock_id( 0 );
		$task_row->set_time_from( time() + $delay );
		$task_row->update( array( 'status', 'result', 'lock_id', 'time_from', 'data' ) );
	}

	protected function schedule_subtasks( Urlslab_Data_Task $task_row ): bool {
		return true;
	}

	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		return true;
	}

	protected function get_type(): string {
		return '';
	}

	protected function execution_finished( Urlslab_Data_Task $task_row ): bool {
		$task_row->set_status( Urlslab_Data_Task::STATUS_FINISHED );
		$task_row->set_lock_id( 0 );

		if ( $task_row->update( array( 'status', 'result', 'lock_id' ) ) ) {

			return true;
		}

		return false;
	}

	protected function execution_failed( Urlslab_Data_Task $task_row ) {
		$task_row->set_status( Urlslab_Data_Task::STATUS_ERROR );
		$task_row->set_lock_id( 0 );

		if ( $task_row->update( array( 'status', 'result', 'lock_id' ) ) ) {

			return true;
		}

		return false;
	}

	private function execute_one_subtask( Urlslab_Data_Task $task_row ): bool {
		global $wpdb;
		$rows = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE (parent_id=%d OR top_parent_id=%d) AND status IN (%s,%s) AND (lock_id is null or lock_id=0 or lock_id=%d) AND time_from<=%d ORDER BY priority LIMIT 1', $task_row->get_task_id(), $task_row->get_task_id(), Urlslab_Data_Task::STATUS_NEW, Urlslab_Data_Task::STATUS_IN_PROGRESS, self::get_lock_id(), time() ), ARRAY_A ); // phpcs:ignore
		if ( count( $rows ) == 0 ) {
			return false;
		}
		foreach ( $rows as $row ) {
			$task     = new Urlslab_Data_Task( $row );
			$executor = self::get_executor( $task->get_executor_type() );
			if ( ! $executor || ( ! $executor->execute( $task ) && $executor->are_all_subtasks_are_mandatory() ) ) {
				$this->execution_failed( $task );
			}
		}

		return true;
	}

	/**
	 * @param Urlslab_Data_Task $task_row
	 *
	 * @return Urlslab_Data_Task[]
	 */
	protected function get_child_tasks( Urlslab_Data_Task $task_row, string $executor_type = '' ): array {
		global $wpdb;
		$tasks = array();
		if ( strlen( $executor_type ) ) {
			$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE parent_id=%d AND executor_type=%s', $task_row->get_task_id(), $executor_type ), ARRAY_A ); // phpcs:ignore
		} else {
			$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE parent_id=%d', $task_row->get_task_id() ), ARRAY_A ); // phpcs:ignore
		}
		foreach ( $results as $result ) {
			$result_row = new Urlslab_Data_Task( $result );
			$tasks[]    = $result_row;
		}

		return $tasks;
	}


	public function get_task_result( Urlslab_Data_Task $task_row ) {
		return $task_row->get_result();
	}

	protected function is_deadline_reached(): bool {
		return Urlslab_Executor::$deadline && Urlslab_Executor::$deadline < time();
	}

	public function set_max_execution_time( int $int ) {
		Urlslab_Executor::$deadline = time() + $int;
	}

	public function are_all_subtasks_are_mandatory(): bool {
		return true;
	}
}
