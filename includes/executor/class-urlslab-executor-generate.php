<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;

class Urlslab_Executor_Generate extends Urlslab_Executor {
	const TYPE = 'generate';

	protected function schedule_subtasks( Urlslab_Data_Task $task_row ): bool {
		try {
			//schedule
			$augment_request = new DomainDataRetrievalAugmentRequest();
			$augment_request->setAugmentingModelName( $task_row->get_data()['model'] );
			$prompt = new DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( $task_row->get_data()['prompt'] );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$augment_request->setPrompt( $prompt );
			$augment_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );
			$process_id = Urlslab_Connection_Augment::get_instance()->async_augment( $augment_request )->getProcessId();
			$task_row->set_data( $process_id, false );
			$this->execution_postponed( $task_row, 5 );

			return true;
		} catch ( Exception $exception ) {
			$this->execution_failed( $task_row );

			return false;
		}
	}

	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		//load result
		try {
			$rsp = Urlslab_Connection_Augment::get_instance()->get_process_result( $task_row->get_data() );

			switch ( $rsp->getStatus() ) {
				case 'SUCCESS':
					$task_row->set_result( Urlslab_Connection_Augment::get_instance()->remove_markdown( $rsp->getResponse()[0] ) );
					$this->execution_finished( $task_row );
					break;
				case 'ERROR':
					$task_row->set_result( $rsp->getResponse()[0] );
					$this->execution_failed( $task_row );
					break;
				default: //pending
					$this->execution_postponed( $task_row, 3 );

					return false;
			}
		} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $exception ) {
			$this->execution_failed( $task_row );

			return true;
		}

		return parent::on_all_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}


}
