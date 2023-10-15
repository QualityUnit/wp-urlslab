<?php

class Urlslab_Executor_Download_Urls_Batch extends Urlslab_Executor {
	const TYPE = 'download_batch';


	protected function init_execution( Urlslab_Task_Row $task_row ): bool {
		$data = json_decode( $task_row->get_data(), true );
		if ( is_array( $data ) ) {
			$executor = self::get_executor( Urlslab_Executor_Download_Url::TYPE );
			foreach ( $data as $url ) {
				$executor->schedule( $url, $task_row );
			}
		}

		return true;
	}

	public function get_task_result( Urlslab_Task_Row $task_row ) {
		$results = array();
		$childs  = $this->get_child_tasks( $task_row );
		foreach ( $childs as $child ) {
			$results[ $child->get_task_id() ] = $child->get_result();
		}

		return $results;
	}


	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		return parent::on_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
