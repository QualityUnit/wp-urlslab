<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalComplexAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;

class Urlslab_Executor_Generate_Url_Context extends Urlslab_Executor {
	const TYPE = 'generate-url-context';

	protected function schedule_subtasks( Urlslab_Data_Task $task_row ): bool {
		$data = $task_row->get_data();
		if ( is_array( $data ) && ! empty( $data ) ) {
			$urls     = $data['urls'];
			$executor = new Urlslab_Executor_Download_Urls_Batch();
			$executor->schedule( $urls, $task_row );
		} else {
			$this->execution_finished( $task_row );
		}

		return true;
	}

	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		if ( isset( $task_row->get_data()['process_id'] ) ) {
			// waiting for process res
			try {
				$rsp = Urlslab_Connection_Augment::get_instance()->get_process_result( $task_row->get_data()['process_id'] );

				switch ( $rsp->getStatus() ) {
					case 'SUCCESS':
						$task_row->set_result( $rsp->getResponse()[0] );
						$this->execution_finished( $task_row );
						return true;
					case 'ERROR':
						$task_row->set_result( $rsp->getResponse()[0] );
						$this->execution_failed( $task_row );
						return true;
					default: //pending
						$this->execution_postponed( $task_row, 3 );

						return false;
				}
			} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $exception ) {
				$this->execution_failed( $task_row );

				return true;
			}
		}

		$childs = $this->get_child_tasks( $task_row, Urlslab_Executor_Download_Urls_Batch::TYPE );
		if ( empty( $childs ) ) {
			$this->execution_failed( $task_row );

			return false;
		}

		$tag_filter = $task_row->get_data()['tag_filter'] ?? array();
		$batch_result     = self::get_executor( Urlslab_Executor_Download_Urls_Batch::TYPE )->get_task_result( $childs[0] );
		$docs = array();
		foreach ( $batch_result as $url_id => $result ) {
			if ( is_array( $result ) ) {
				$page_data = $result['page_title'] ? 'title: ' . $result['page_title'] : '';

				$has_h1 = isset( $result['texts'][1][0] ) && 'h1' === $result['texts'][1][0];

				foreach ( $result['texts'] as $element_id => $element ) {
					if ( ( ! $has_h1 || $element_id > 0 ) ) {
						if ( ! empty( $tag_filter ) ) {
							if ( in_array( $element[0], $tag_filter ) ) {
								$page_data .= $element[0] . ':' . implode( "\n", $element[1] );
							}
						} else {
							$page_data .= $element[0] . ':' . implode( "\n", $element[1] );
						}                   
					}
				}
				if ( ! empty( $page_data ) ) {
					$docs[] = $page_data;
				}
			}
		}

		try {
			//schedule
			$augment_request = new DomainDataRetrievalComplexAugmentRequest();
			$augment_request->setModeName( $task_row->get_data()['model'] );
			$reduce_prompt = $task_row->get_data()['prompt'];
			if ( ! str_contains( $reduce_prompt, '{context}' ) ) {
				$reduce_prompt .= "\n CONTEXT: \n {context}";
			}
			$augment_request->setPrompt(
				(object) array(
					'map_prompt'             => "summarize the given context. but keep all the important information in the context \n CONTEXT: \n {context}",
					'reduce_prompt'          => $reduce_prompt,
					'document_variable_name' => 'context',
				) 
			);
			$augment_request->setGenerationStrategy( 'map_reduce' );
			$augment_request->setDocs( $docs );
			$process_id = Urlslab_Connection_Augment::get_instance()->complex_augment_docs( $augment_request )->getProcessId();
			$task_row->set_data( array( 'process_id' => $process_id ), false );
			$task_row->update();
			$this->execution_postponed( $task_row, 5 );

			return false;

		} catch ( Exception $exception ) {
			$this->execution_failed( $task_row );

			return true;
		}
	}

	protected function get_type(): string {
		return self::TYPE;
	}


}
