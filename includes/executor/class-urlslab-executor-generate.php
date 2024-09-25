<?php


use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\Model\FlowInvokeRequest;

class Urlslab_Executor_Generate extends Urlslab_Executor {
	const TYPE = 'generate';

	protected function schedule_subtasks( Urlslab_Data_Task $task_row ): bool {
		try {
			$data = $task_row->get_data();

			$request = new FlowInvokeRequest( array( 'human_input' => $data['input'] ) );

			$flow_variables = array();
			foreach ( $data as $key => $value ) {
				if ( in_array( $key, array( 'flow_id', 'input', 'prompt_variables' ) ) ) {
					continue;
				}
				$flow_variables[ $key ] = $value;
			}
			if ( ! empty( $flow_variables ) ) {
				$request->setVariables( $flow_variables );
			}

			$result                 = Urlslab_Connection_Flows::get_instance()->get_client()->invokeFlow(
				$data['flow_id'],
				Urlslab_Connection_FlowHunt::get_workspace_id(),
				$request
			);
			$data['invoke_task_id'] = $result->getId();
			$task_row->set_data( $data );

			switch ( $result->getStatus() ) {
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::SUCCESS:
					try {
						$res = json_decode( $result->getResult() );
					} catch ( Exception $e ) {
						$res = $result->getResult();
					}
					if ( isset( $res->outputs[0]->outputs[0]->results->message->result ) ) {
						$parsedown = new Parsedown();
						$parsedown->setSafeMode( true );
						$task_row->set_result( $parsedown->text( $res->outputs[0]->outputs[0]->results->message->result ) );
					} else {
						$task_row->set_result( $result->getResult() );
					}

					$this->execution_finished( $task_row );
					break;
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::FAILURE:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::REJECTED:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::IGNORED:
					$task_row->set_result( $result->getErrorMessage() );
					$this->execution_failed( $task_row );

					return false;
					break;
				default:
					$this->execution_postponed( $task_row, 600 );
					break;
			}

			return true;
		} catch ( Exception $exception ) {
			$task_row->set_result( $exception->getMessage() );
			$this->execution_failed( $task_row );

			return false;
		}
	}

	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		//load result
		try {

			// task_row->get_data() at this point should be the process_id
			if ( empty( $task_row->get_data() ) ) {
				$this->execution_failed( $task_row );

				return true;
			}

			$data = $task_row->get_data();
			$rsp  = Urlslab_Connection_Flows::get_instance()->get_client()->getInvokedFlowResults(
				$data['flow_id'],
				$data['invoke_task_id'],
				Urlslab_Connection_FlowHunt::get_workspace_id()
			);

			switch ( $rsp->getStatus() ) {
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::SUCCESS:
					try {
						$res = json_decode( $rsp->getResult() );
					} catch ( Exception $e ) {
						$res = $rsp->getResult();
					}
					if ( isset( $res->outputs[0]->outputs[0]->results->message->result ) ) {
						$parsedown = new Parsedown();
						$parsedown->setSafeMode( true );
						$task_row->set_result( $parsedown->text( $res->outputs[0]->outputs[0]->results->message->result ) );
					} else {
						$task_row->set_result( $rsp->getResult() );
					}
					break;
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::FAILURE:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::REJECTED:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::IGNORED:
					$task_row->set_result( $rsp->getErrorMessage() );
					$this->execution_failed( $task_row );

					return false;
				default: //pending
					$this->execution_postponed( $task_row, 600 );

					return false;
			}
		} catch ( ApiException $exception ) {
			$task_row->set_result( $exception->getMessage() );
			$this->execution_failed( $task_row );

			return true;
		}

		return parent::on_all_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}
}
