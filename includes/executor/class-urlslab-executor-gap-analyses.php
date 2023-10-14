<?php

class Urlslab_Executor_Gap_Analyses extends Urlslab_Executor {
	const TYPE = 'gap_analyses';

	protected function execute_new( Urlslab_Task_Row $task_row ): bool {
		$data = json_decode( $task_row->get_data(), true );
		if ( isset( $data['urls'] ) ) {
			$executor = new Urlslab_Executor_Download_Urls_Batch();
			$executor->schedule( json_encode( $data['urls'] ), $task_row );
			$task_row->update();
		}

		return true;
	}

	protected function on_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		$childs = $this->get_child_tasks( $task_row );

		if ( count( $childs ) == 1 ) {
			$websites_prompt = '';
			foreach ( $childs as $child ) {
				if ( $child->get_status() === Urlslab_Task_Row::STATUS_IN_PROGRESS ) {
					$this->execution_postponed( $task_row, 3 );

					return false;
				} else if ( $child->get_status() === Urlslab_Task_Row::STATUS_FINISHED ) {
					$websites_prompt .= $child->get_result();
				} else if ( $child->get_status() === Urlslab_Task_Row::STATUS_ERROR ) {
					$this->execution_failed( $task_row );

					return true;
				}
			}

			if ( empty( $websites_prompt ) ) {
				$this->execution_failed( $task_row );

				return true;
			}

			$prompt   = "You are marketing specialist creating brief for copywriter to write best ranking web page content. 

--Analyze WEBPAGES: " . $websites_prompt . "

--TASK: Create structure of paragraphs for new WEBPAGE to rank higher as other pages on Google for given keywords.

--USE KEYWORDS:
" . json_decode( $task_row->get_data(), true )['query'] . "
--OUTPUT only JSON:
[
{'H1':'h1 title'},
{'H2':'h2 title'},
... etc
]

ANSWER:
";
			$executor = new Urlslab_Executor_Generate();
			$executor->schedule( $prompt, $task_row );

			return false;
		}

		if ( count( $childs ) == 2 ) {
			foreach ( $childs as $child ) {
				if ( Urlslab_Executor_Generate::TYPE == $child->get_executor_type() && $child->get_status() === Urlslab_Task_Row::STATUS_FINISHED ) {
					$task_row->set_result( $child->get_result() );
					return true;
				} else if ( $child->get_status() === Urlslab_Task_Row::STATUS_ERROR ) {
					$this->execution_failed( $task_row );

					return true;
				}
			}
		}

		return parent::on_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}


}
