<?php

class Urlslab_Executor_Download_Urls_Batch extends Urlslab_Executor {
	const TYPE = 'download_batch';


	protected function execute_new( Urlslab_Task_Row $task_row ): bool {
		$data = json_decode( $task_row->get_data(), true );
		if ( is_array( $data ) ) {
			$executor = new Urlslab_Executor_Download_Url();
			foreach ( $data as $url ) {
				$executor->schedule( $url, $task_row );
			}
		}

		return true;
	}

	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		$prompt = '';

		$childs = $this->get_child_tasks( $task_row );

		if ( empty( $childs ) ) {
			$this->execution_failed( $task_row );

			return true;
		}
		$i = 1;
		foreach ( $childs as $child ) {
			if ( $child->get_status() === Urlslab_Task_Row::STATUS_FINISHED ) {
				$prompt .= "\n-- WEBPAGE: " . $i . ' url: ' . $child->get_data() . "\n" . $child->get_result() . "\n --END OF WEBPAGE " . $i . " --\n";
				$i ++;
			}
		}

		if ( empty( $prompt ) ) {
			$this->execution_failed( $task_row );

			return true;
		}

		$task_row->set_result( $prompt );

		return parent::on_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
