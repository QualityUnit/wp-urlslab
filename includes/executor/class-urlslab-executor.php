<?php

abstract class Urlslab_Executor {
	private static $deadline = 0;
	private static int $lock_id;

	private static function get_lock_id() {
		if ( empty( self::$lock_id ) ) {
			self::$lock_id = rand( 0, 1000000 );
		}

		return self::$lock_id;
	}

	public static function get_executor( string $executor_type ): ?Urlslab_Executor {
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-gap-analyses.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-urls-batch.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-generate.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-url-intersection.php';

		switch ( $executor_type ) {
			case Urlslab_Executor_Download_Url::TYPE:
				return new Urlslab_Executor_Download_Url();
			case Urlslab_Executor_Download_Urls_Batch::TYPE:
				return new Urlslab_Executor_Download_Urls_Batch();
			case Urlslab_Executor_Gap_Analyses::TYPE:
				return new Urlslab_Executor_Gap_Analyses();
			case Urlslab_Executor_Generate::TYPE:
				return new Urlslab_Executor_Generate();
			case Urlslab_Executor_Url_Intersection::TYPE:
				return new Urlslab_Executor_Url_Intersection();
			default:
				return null;
		}
	}

	public function schedule( $data, Urlslab_Task_Row $parent = null ): Urlslab_Task_Row {
		$row_data                  = array();
		$row_data['data']          = $data;
		$row_data['executor_type'] = $this->get_type();
		if ( $parent ) {
			$row_data['slug']          = $parent->get_slug();
			$row_data['priority']      = $parent->get_priority() - 1;
			$row_data['parent_id']     = $parent->get_task_id();
			$row_data['top_parent_id'] = $parent->get_top_parent_id() ? $parent->get_top_parent_id() : $parent->get_task_id();
		}
		$task = new Urlslab_Task_Row( $row_data, false );

		if ( $task->insert() ) {
			if ( $parent ) {
				$parent->increase_subtasks();
			}
		}

		return $task;
	}

	public function execute( Urlslab_Task_Row $task_row ): bool {
		try {
			while ( ! $this->is_deadline_reached() && $task_row->get_time_from() <= time() ) {
				if ( Urlslab_Task_Row::STATUS_NEW === $task_row->get_status() ) {
					if ( $this->lock_task( $task_row ) ) {
						if ( ! $this->init_execution( $task_row ) ) {
							$this->execution_failed( $task_row );

							return false;
						}
					}
				}

				if ( Urlslab_Task_Row::STATUS_IN_PROGRESS === $task_row->get_status() && ! $this->is_deadline_reached() && $task_row->get_time_from() <= time() ) {
					$not_finished = $task_row->count_not_finished_subtasks();
					while ( 0 < $not_finished && $this->execute_one_subtask( $task_row ) ) {
						$not_finished = $task_row->count_not_finished_subtasks();
					}
					if ( 0 == $not_finished ) {
						if ( ! $this->on_subtasks_done( $task_row ) ) {
							return false;
						}
						$this->execution_finished( $task_row );

						return true;
					} else {
						$this->execution_postponed( $task_row );

						return false;
					}
				}

				if ( Urlslab_Task_Row::STATUS_FINISHED === $task_row->get_status() ) {
					return true;
				}
			}

			//executor time expired
			$this->execution_postponed( $task_row, 0 );

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

	protected function lock_task( Urlslab_Task_Row $task_row ): bool {
		if ( $task_row->get_executor_type() != $this->get_type() ) {
			return false;
		}

		//maybe we should check expire time here
		if ( Urlslab_Task_Row::STATUS_IN_PROGRESS === $task_row->get_status() && $task_row->get_lock_id() ) {
			return true;
		}

		$task_row->set_status( Urlslab_Task_Row::STATUS_IN_PROGRESS );
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

	protected function execution_postponed( Urlslab_Task_Row $task_row, $delay = 5 ) {
		$task_row->set_lock_id( 0 );
		$task_row->set_time_from( time() + $delay );
		$task_row->update( array( 'status', 'result', 'lock_id', 'time_from', 'data' ) );
	}

	protected abstract function init_execution( Urlslab_Task_Row $task_row ): bool;

	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		return true;
	}

	protected abstract function get_type(): string;

	protected function execution_finished( Urlslab_Task_Row $task_row ): bool {
		$task_row->set_status( Urlslab_Task_Row::STATUS_FINISHED );
		$task_row->set_lock_id( 0 );

		if ( $task_row->update( array( 'status', 'result', 'lock_id' ) ) ) {
			$task_row->increase_subtasks_done();

			return true;
		}

		return false;
	}

	protected function execution_failed( Urlslab_Task_Row $task_row ) {
		$task_row->set_status( Urlslab_Task_Row::STATUS_ERROR );
		$task_row->set_lock_id( 0 );

		if ( $task_row->update( array( 'status', 'result', 'lock_id' ) ) ) {
			$task_row->increase_subtasks_done();

			return true;
		}

		return false;
	}

	private function execute_one_subtask( Urlslab_Task_Row $task_row ): bool {
		global $wpdb;
		$rows = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE (parent_id=%d OR top_parent_id=%d) AND status IN (%s,%s) AND (lock_id is null or lock_id=0 or lock_id=%d) AND time_from<=%d ORDER BY priority LIMIT 1', $task_row->get_task_id(), $task_row->get_task_id(), Urlslab_Task_Row::STATUS_NEW, Urlslab_Task_Row::STATUS_IN_PROGRESS, self::get_lock_id(), time() ), ARRAY_A ); // phpcs:ignore
		if ( count( $rows ) == 0 ) {
			return false;
		}
		foreach ( $rows as $row ) {
			$task     = new Urlslab_Task_Row( $row );
			$executor = self::get_executor( $task->get_executor_type() );
			if ( $executor ) {
				if ( ! $executor->execute( $task ) ) {
					return false;
				}
			} else {
				$this->execution_failed( $task );

				return false;
			}
		}

		return true;
	}

	/**
	 * @param Urlslab_Task_Row $task_row
	 *
	 * @return Urlslab_Task_Row[]
	 */
	protected function get_child_tasks( Urlslab_Task_Row $task_row ): array {
		global $wpdb;
		$tasks   = array();
		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE parent_id=%d', $task_row->get_task_id() ), ARRAY_A ); // phpcs:ignore
		foreach ( $results as $result ) {
			$result_row = new Urlslab_Task_Row( $result );
			$tasks[]    = $result_row;
		}

		return $tasks;
	}


	public function get_task_result( Urlslab_Task_Row $child ) {
		return $child->get_result();
	}

	protected function is_deadline_reached(): bool {
		return self::$deadline && self::$deadline < time();
	}

	public function set_max_execution_time( int $int ) {
		self::$deadline = time() + $int;
	}

}
