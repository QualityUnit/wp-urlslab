<?php

class Urlslab_Executor_Download_Urls_Batch extends Urlslab_Executor {
	const TYPE = 'download_batch';


	protected function schedule_subtasks( Urlslab_Data_Task $task_row ): bool {
		$urls = $task_row->get_data();
		if ( is_array( $urls ) ) {
			$executor = self::get_executor( Urlslab_Executor_Download_Url::TYPE );
			foreach ( $urls as $url ) {
				try {
					$url_obj = new Urlslab_Url( $url, true );
					$executor->schedule( $url, $task_row );
				} catch ( Exception $e ) {
				}
			}

			return true;
		} else {
			$this->execution_failed( $task_row );

			return false;
		}
	}

	public function get_task_result( Urlslab_Data_Task $task_row ) {
		$results    = array();
		$child_rows = $this->get_child_tasks( $task_row, Urlslab_Executor_Download_Url::TYPE );
		$executor   = self::get_executor( Urlslab_Executor_Download_Url::TYPE );
		foreach ( $child_rows as $child_row ) {
			try {
				$url_obj                           = new Urlslab_Url( $child_row->get_data(), true );
				$results[ $url_obj->get_url_id() ] = $executor->get_task_result( $child_row );
			} catch ( Exception $e ) {
			}
		}

		return $results;
	}


	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		return parent::on_all_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
