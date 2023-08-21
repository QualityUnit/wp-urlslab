<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalComplexAugmentResponse;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;

class Urlslab_Generator_Cron_Executor {
	private Configuration $config;
	private Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi $api_client;

	/**
	 * @param $config
	 */
	public function __construct() {
		$this->config = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) );
		$this->api_client = new Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $this->config );
	}


	public function fetch_tasks_to_process( Urlslab_Content_Generator_Widget $widget ) {
		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status = %s OR task_status = %s ORDER BY updated_at LIMIT 10', // phpcs:ignore
				Urlslab_Generator_Task_Row::STATUS_NEW,
				Urlslab_Generator_Task_Row::STATUS_PROCESSING,
			),
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			return false;
		}

		return new Urlslab_Generator_Task_Row( $rows[ rand( 0, count( $rows ) - 1 ) ] );
	}

	public function start_generator_process( Urlslab_Generator_Task_Row $task, Urlslab_Content_Generator_Widget $widget ) {
		$initial_status = $task->get_task_status();
		$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_PROCESSING );
		$task->set_updated_at( Urlslab_Data::get_now() );
		$task->update();

		try {

			if ( $initial_status === Urlslab_Generator_Task_Row::STATUS_PROCESSING ) {
				// get status of the process
				$process_id = $task->get_urlslab_process_id();

				if ( empty( $process_id ) ) {
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
					$task->update();
					return false;
				}

				$rsp = $this->api_client->getProcessResult( $process_id );

				if ( $rsp->getStatus() === 'ERROR' ) {
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
					$task->update();
					return false;
				}

				if ( $rsp->getStatus() === 'SUCCESS' ) {
					switch ( $task->get_generator_type() ) {
						case Urlslab_Generator_Task_Row::GENERATOR_TYPE_SHORTCODE:
							$ret = $this->process_shortcode_res( $task, $rsp, $widget );
							break;
						case Urlslab_Generator_Task_Row::GENERATOR_TYPE_POST_CREATION:
							$ret = $this->process_post_creation_res( $task );
							break;
						default:
							$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
							$task->update();
							return false;
					}

					$task->delete();

					return $ret;
				}
			}

			// creating a new process
			switch ( $task->get_generator_type() ) {
				case Urlslab_Generator_Task_Row::GENERATOR_TYPE_SHORTCODE:
					$process_id = $this->create_shortcode_gen_process( $task, $widget );
					break;
				case Urlslab_Generator_Task_Row::GENERATOR_TYPE_POST_CREATION:
					$process_id = $this->create_post_creation_gen_process( $task );
					break;
				default:
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
					$task->update();

					return false;
			}
			$task->set_urlslab_process_id( $process_id );
			$task->set_updated_at( Urlslab_Data::get_now() );
			$task->update();

			return true;
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 422:
				case 429:
				case 504:
				case 500:
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_PROCESSING );
					$task->update();
					return false;
				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
					$task->update();
					return false;
				default:
					$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
					$task->update();
					return true;
			}
		}

		return true;
	}

	private function process_shortcode_res( Urlslab_Generator_Task_Row $task, DomainDataRetrievalComplexAugmentResponse $task_rsp, Urlslab_Content_Generator_Widget $widget ): bool {
		$task_data = (array) json_decode( $task->get_task_data() );
		$results_data = new Urlslab_Generator_Result_Row( $task_data );

		if ( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
			$results_data->set_status( Urlslab_Generator_Result_Row::STATUS_ACTIVE );
		} else {
			$results_data->set_status( Urlslab_Generator_Result_Row::STATUS_WAITING_APPROVAL );
		}
		$results_data->set_result( $task_rsp->getResponse()[0] );
		$results_data->insert( true );

		return true;
	}

	private function process_post_creation_res( Urlslab_Generator_Task_Row $task ): bool {
		return true;
	}

	private function create_shortcode_gen_process( Urlslab_Generator_Task_Row $task, Urlslab_Content_Generator_Widget $widget ): string {
		// create shortcode generator
		$task_data     = (array) json_decode( $task->get_task_data() );
		$row_shortcode = new Urlslab_Generator_Shortcode_Row( $task_data );
		$request       = new DomainDataRetrievalAugmentRequest();
		$request->setAugmentingModelName( $task_data['model'] );
		$request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

		$prompt = new DomainDataRetrievalAugmentPrompt();

		if ( Urlslab_Generator_Shortcode_Row::TYPE_VIDEO === $task_data['shortcode_type'] ) {
			$attributes = $widget->get_att_values( $row_shortcode, $task_data, array( 'video_captions_text' ) );
			if ( ! isset( $attributes['video_captions_text'] ) || empty( $attributes['video_captions_text'] ) ) {
				$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_DISABLED );
				$task->update();

				return false;
			}
			$command = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Generator_Result_Row::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
				"\n\n--VIDEO CAPTIONS:\n{context}\n--VIDEO CAPTIONS END\nANSWER:",
				$attributes
			);
			$prompt->setPromptTemplate( $command );
			$prompt->setDocumentTemplate( $widget->get_template_value( '{{video_captions_text}}', $attributes ) );

			$prompt->setMetadataVars( array() );
			$request->setPrompt( $prompt );
			$response = Urlslab_Augment_Connection::get_instance()->async_augment( $request );
		} else {
			$attributes = $widget->get_att_values( $row_shortcode, $task_data );
			$command    = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Generator_Result_Row::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
				'ANSWER:',
				$attributes
			);
			$prompt->setPromptTemplate( "Additional information to your memory:\n--\n{context}\n----\n" . $command );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$request->setPrompt( $prompt );

			$filter = new DomainDataRetrievalContentQuery();
			$filter->setLimit( 5 );

			if ( $task_data['url_filter'] ) {
				$filter->setUrls( array( $task_data['url_filter'] ) );
			}

			if ( strlen( $task_data['semantic_context'] ) ) {
				$request->setAugmentCommand( $task_data['semantic_context'] );
				if ( ! strlen( $task_data['url_filter'] ) ) {
					$filter->setUrls( array( Urlslab_Url::get_current_page_url()->get_domain_name() ) );
				}
			}
			$request->setFilter( $filter );

			$response = Urlslab_Augment_Connection::get_instance()->async_augment( $request );
		}

		return $response->getProcessId();
	}

	private function create_post_creation_gen_process( Urlslab_Generator_Task_Row $task ): string {
		// create post creation generator
		return '';
	}

}

