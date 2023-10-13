<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;

class Urlslab_Executor_Generate extends Urlslab_Executor {
	const TYPE = 'generate';
	private ContentApi $content_client;

	public function schedule( $data, Urlslab_Task_Row $parent = null ): Urlslab_Task_Row {
		$task = new Urlslab_Task_Row(
			array(
				'data'          => array('prompt' => $data),
				'slug'          => $parent ? $parent->get_slug() : '',
				'parent_id'     => $parent->get_task_id(),
				'top_parent_id' => $parent->get_top_parent_id() ? $parent->get_top_parent_id() : $parent->get_task_id(),
				'executor_type' => $this->get_type(),
			),
			false
		);

		if ( $task->insert() && $parent ) {
			$parent->set_subtasks( $parent->get_subtasks() + 1 );
		}

		return $task;
	}

	protected function execution_finished( Urlslab_Task_Row $task_row ): bool {
		try {
			$data = $task_row->get_data();
			if ( isset( $data['process_id'] ) ) {
				//load result
				$rsp = Urlslab_Augment_Connection::get_instance()->getProcessResult( $data['process_id'] );

				switch ($rsp->getStatus()) {
					case 'SUCCESS':
						$task_row->set_result( $rsp->getResponse()[0] );
						return parent::execution_finished( $task_row );
					case 'ERROR':
						throw new Exception( $rsp->getResponse()[0] );
					default: //pending
						//TODO postpone task execution few seconds
						return false;
				}
			} else {
				//schedule
				$augment_request = new DomainDataRetrievalAugmentRequest();
				$augment_request->setAugmentingModelName( DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 );
				$prompt = new DomainDataRetrievalAugmentPrompt();
				$prompt->setPromptTemplate( $data['prompt'] );
				$augment_request->setPrompt( $prompt );
				$augment_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );
				$data['process_id'] = Urlslab_Augment_Connection::get_instance()->async_augment( $augment_request )->getProcessId();
				$task_row->set_data( $data );
				$task_row->update();
			}
		} catch ( Exception $exception ) {
			$this->execution_failed( $task_row );

			return true;
		}

		return false;
	}

	protected function execute_new( Urlslab_Task_Row $task_row ): bool {
		return true;
	}


	protected function get_type(): string {
		return self::TYPE;
	}


}
