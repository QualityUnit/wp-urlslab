<?php

class Urlslab_Executor_Gap_Analyses extends Urlslab_Executor {
	const TYPE = 'gap_analyses';

	public function schedule( $data, Urlslab_Task_Row $parent = null ): Urlslab_Task_Row {
		$task = new Urlslab_Task_Row(
			array(
				'data'          => $data,
				'priority'      => 255,
				'slug'          => Urlslab_Serp::SLUG,
				'executor_type' => $this->get_type(),
			),
			false
		);
		$task->insert();

		return $task;
	}

	protected function execute_new( Urlslab_Task_Row $task_row ): bool {
		$data = $task_row->get_data();
		if ( isset( $data['urls'] ) ) {
			$executor = new Urlslab_Executor_Download_Url();
			foreach ( $data['urls'] as $url ) {
				$executor->schedule( $url, $task_row );
			}
			$task_row->update();
		}

		return true;
	}

	protected function get_type(): string {
		return self::TYPE;
	}

	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		//schedule GPT4 request as task if it was not set yet
		if ( empty( $task_row->get_result() ) ) {

		}

		return true;
	}

}
