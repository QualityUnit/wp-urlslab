<?php

abstract class Urlslab_Executor {

	private static function get_executor( string $executor_type ): ?Urlslab_Executor {
		switch ( $executor_type ) {
			case Urlslab_Executor_Download_Url::TYPE:
				return new Urlslab_Executor_Download_Url();
			case Urlslab_Executor_Gap_Analyses::TYPE:
				return new Urlslab_Executor_Gap_Analyses();
			default:
				return null;
		}
	}

	abstract public function schedule( $data, Urlslab_Task_Row $parent = null ): Urlslab_Task_Row;

	public function execute( Urlslab_Task_Row $task_row ): bool {
		if ( Urlslab_Task_Row::STATUS_NEW == $task_row->get_status() ) {
			if ( $this->lock_task( $task_row ) ) {
				$this->execute_new( $task_row );
			}
		}

		if ( Urlslab_Task_Row::STATUS_IN_PROGRESS == $task_row->get_status() ) {
			if ( $task_row->get_subtasks() > $task_row->get_subtasks_done() && $this->execute_subtasks( $task_row ) ) {
				$this->on_subtasks_done( $task_row );
			}
			if ( $task_row->get_subtasks() === $task_row->get_subtasks_done() ) {
				$this->execution_finished( $task_row );
			}
		}

		if ( Urlslab_Task_Row::STATUS_FINISHED == $task_row->get_status() ) {
			return true;
		}

		return true;
	}

	protected
	function lock_task(
		Urlslab_Task_Row $task_row
	): bool {
		if ( $task_row->get_executor_type() != $this->get_type() ) {
			return false;
		}

		//maybe we should check expire time here
		if ( Urlslab_Task_Row::STATUS_IN_PROGRESS === $task_row->get_status() && $task_row->get_lock_id() ) {
			return true;
		}

		$task_row->set_status( Urlslab_Task_Row::STATUS_IN_PROGRESS );
		$lock_id = $task_row->get_lock_id();
		if ( ! $lock_id ) {
			$lock_id = rand( 1, 1000000 );
			$task_row->set_lock_id( $lock_id );
		}
		if ( $task_row->update() ) {
			$task_row->load();
			if ( $task_row->get_lock_id() !== $lock_id ) {
				return false;
			}
		}

		return true;
	}

	protected

	abstract function execute_new(
		Urlslab_Task_Row $task_row
	): bool;

	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		return true;
	}

	protected abstract function get_type(): string;

	protected function execution_finished( Urlslab_Task_Row $task_row ): bool {
		$task_row->set_status( Urlslab_Task_Row::STATUS_FINISHED );

		return $task_row->update();
	}

	protected function execution_failed( Urlslab_Task_Row $task_row ) {
		$task_row->set_status( Urlslab_Task_Row::STATUS_ERROR );

		return $task_row->update();
	}

	private function execute_subtasks( Urlslab_Task_Row $task_row ): bool {
		if ( $task_row->get_subtasks() === $task_row->get_subtasks_done() ) {
			return true;
		}

		global $wpdb;
		$rows = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_TASKS_TABLE . ' WHERE parent_id=%d OR top_parent_id=%d ORDER BY priority, task_id', $task_row->get_task_id(), $task_row->get_task_id() ), ARRAY_A );
		foreach ( $rows as $row ) {
			$task     = new Urlslab_Task_Row( $row );
			$executor = Urlslab_Executor::get_executor( $task->get_executor_type() );
			if ( $executor ) {
				if ( ! $executor->execute( $task ) ) {
					return false;
				} else {
					$task_row->set_subtasks_done( $task_row->get_subtasks_done() + 1 );
				}
			}
		}
		$task_row->update();

		return true;
	}

}
