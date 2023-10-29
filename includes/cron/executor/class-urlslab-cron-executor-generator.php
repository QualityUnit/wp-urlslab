<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequestWithURLContext;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalComplexAugmentResponse;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;

class Urlslab_Cron_Executor_Generator {
	private Configuration $config;
	private Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi $api_client;

	/**
	 * @param $config
	 */
	public function __construct() {
		$this->config     = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY ) );
		$this->api_client = new Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $this->config );
	}


	public function fetch_tasks_to_process( Urlslab_Widget_Content_Generator $widget ) {
		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status=%s OR (task_status=%s AND updated_at<%s) LIMIT 10', // phpcs:ignore
				Urlslab_Data_Generator_Task::STATUS_NEW,
				Urlslab_Data_Generator_Task::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 30 )
			),
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			return false;
		}

		return new Urlslab_Data_Generator_Task( $rows[ rand( 0, count( $rows ) - 1 ) ] );
	}

	public function start_generator_process( Urlslab_Data_Generator_Task $task, Urlslab_Widget_Content_Generator $widget ) {
		$initial_status = $task->get_task_status();
		$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_PROCESSING );
		$task->set_updated_at( Urlslab_Data::get_now() );
		$task->update();

		try {

			if ( Urlslab_Data_Generator_Task::STATUS_PROCESSING === $initial_status ) {
				// get status of the process
				$process_id = $task->get_urlslab_process_id();

				if ( empty( $process_id ) ) {
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
					$task->set_res_log( 'Process Expired!' );
					$task->update();

					return false;
				}

				$rsp = $this->api_client->getProcessResult( $process_id );

				if ( $rsp->getStatus() === 'ERROR' ) {
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
					$task->set_res_log( $rsp->getResponse()[0] );
					$task->update();

					return false;
				}

				if ( $rsp->getStatus() === 'SUCCESS' ) {
					switch ( $task->get_generator_type() ) {
						case Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE:
							$ret = $this->process_shortcode_res( $task, $rsp, $widget );
							$task->delete();

							return $ret;
						case Urlslab_Data_Generator_Task::GENERATOR_TYPE_POST_CREATION:
							$this->process_post_creation_res( $task, $rsp );
							$task->delete();

							return true;
						case Urlslab_Data_Generator_Task::GENERATOR_TYPE_FAQ:
							$this->process_faq_answer_generation( $task, $rsp );
							$task->delete();

							return true;
						default:
							$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
							$task->update();

							return false;
					}
				}

				return true;
			}

			// creating a new process
			switch ( $task->get_generator_type() ) {
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE:
					$process_id = $this->create_shortcode_gen_process( $task, $widget );
					break;
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_POST_CREATION:
					$process_id = $this->create_post_creation_gen_process( $task );
					break;
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_FAQ:
					$process_id = $this->create_url_context_process( $task );
					break;
				default:
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
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
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_PROCESSING );
					$task->update();

					return false;
				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
					$task->set_res_log( $e->getMessage() );
					$task->update();

					return false;
				default:
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
					$task->set_res_log( $e->getMessage() );
					$task->update();

					return true;
			}
		}

		return true;
	}

	private function process_shortcode_res( Urlslab_Data_Generator_Task $task, DomainDataRetrievalComplexAugmentResponse $task_rsp, Urlslab_Widget_Content_Generator $widget ): bool {
		$task_data    = (array) json_decode( $task->get_task_data() );
		$results_data = new Urlslab_Data_Generator_Result( $task_data );

		if ( $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_AUTOAPPROVE ) ) {
			$results_data->set_status( Urlslab_Data_Generator_Result::STATUS_ACTIVE );
		} else {
			$results_data->set_status( Urlslab_Data_Generator_Result::STATUS_WAITING_APPROVAL );
		}
		$results_data->set_result( $task_rsp->getResponse()[0] );
		$results_data->insert( true );

		return true;
	}

	private function process_post_creation_res( Urlslab_Data_Generator_Task $task, DomainDataRetrievalComplexAugmentResponse $task_rsp ): string {
		$task_data = (array) json_decode( $task->get_task_data() );
		$post_id   = wp_insert_post(
			array(
				'post_title'   => $task_data['keyword'],
				'post_content' => $task_rsp->getResponse()[0],
				'post_status'  => 'draft',
				'post_type'    => $task_data['post_type'],
			)
		);

		return html_entity_decode( get_edit_post_link( $post_id ) );
	}

	private function create_shortcode_gen_process( Urlslab_Data_Generator_Task $task, Urlslab_Widget_Content_Generator $widget ): string {
		// create shortcode generator
		$task_data     = (array) json_decode( $task->get_task_data() );
		$row_shortcode = new Urlslab_Data_Generator_Shortcode( (array) $task_data['shortcode_row'] );
		$request       = new DomainDataRetrievalAugmentRequest();
		$request->setAugmentingModelName( $task_data['model'] ?? DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO );
		$request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

		$prompt                = new DomainDataRetrievalAugmentPrompt();
		$shortcode_prompt_vars = (array) json_decode( $task_data['prompt_variables'] );

		if ( Urlslab_Data_Generator_Shortcode::TYPE_VIDEO === $row_shortcode->get_shortcode_type() ) {
			$attributes = $widget->get_att_values( $row_shortcode, $shortcode_prompt_vars, array( 'video_captions_text' ) );
			if ( ! isset( $attributes['video_captions_text'] ) || empty( $attributes['video_captions_text'] ) ) {
				$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
				$task->update();

				return false;
			}
			$command = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Data_Generator_Result::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
				"\n\n--VIDEO CAPTIONS:\n{context}\n--VIDEO CAPTIONS END\nANSWER:",
				$attributes
			);
			$prompt->setPromptTemplate( $command );
			$prompt->setDocumentTemplate( $widget->get_template_value( '{{video_captions_text}}', $attributes ) );

			$prompt->setMetadataVars( array() );
			$request->setPrompt( $prompt );
			$response = Urlslab_Connection_Augment::get_instance()->async_augment( $request );
		} else {
			$attributes = $widget->get_att_values( $row_shortcode, $shortcode_prompt_vars );
			$command    = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Data_Generator_Result::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
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

			$response = Urlslab_Connection_Augment::get_instance()->async_augment( $request );
		}

		return $response->getProcessId();
	}

	private function create_post_creation_gen_process( Urlslab_Data_Generator_Task $task ): string {
		// create post creation generator
		$task_data = (array) json_decode( $task->get_task_data() );

		if ( ! empty( $task_data['urls'] ) ) {
			// with datasource
			return $this->create_url_context_process( $task );
		} else {
			// no data source
			$augment_request = new DomainDataRetrievalAugmentRequest();
			$augment_request->setAugmentingModelName( $task_data['model'] );
			$prompt = new DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( $task_data['prompt'] );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$augment_request->setPrompt( $prompt );

			$augment_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

			return Urlslab_Connection_Augment::get_instance()->async_augment( $augment_request )->getProcessId();
		}
	}

	private function create_url_context_process( Urlslab_Data_Generator_Task $task ) {
		// with datasource
		$task_data = (array) json_decode( $task->get_task_data() );

		$augment_request = new DomainDataRetrievalAugmentRequestWithURLContext();
		$augment_request->setUrls( $task_data['urls'] );
		$augment_request->setPrompt(
			(object) array(
				'map_prompt'             => 'Summarize the given context: \n CONTEXT: \n {context}',
				'reduce_prompt'          => $task_data['prompt'],
				'document_variable_name' => 'context',
			)
		);
		$augment_request->setModeName( $task_data['model'] );
		$augment_request->setGenerationStrategy( 'map_reduce' );
		$augment_request->setTopKChunks( 3 );

		return Urlslab_Connection_Augment::get_instance()->complex_augment( $augment_request )->getProcessId();
	}

	private function process_faq_answer_generation( Urlslab_Data_Generator_Task $task, DomainDataRetrievalComplexAugmentResponse $rsp ) {
		$task_data = (array) json_decode( $task->get_task_data() );
		$faq       = new Urlslab_Data_Faq( (array) $task_data['faq'] );
		$faq->set_answer( $rsp->getResponse()[0] );
		if ( $task_data['auto_approval'] ) {
			$faq->set_status( Urlslab_Data_Faq::STATUS_ACTIVE );
		} else {
			$faq->set_status( Urlslab_Data_Faq::STATUS_WAITING_FOR_APPROVAL );
		}
		$faq->update();
	}

}

