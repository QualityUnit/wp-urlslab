<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;

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


	public function fetch_tasks_to_process() {
		global $wpdb;

		$rows = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status = %s OR task_status = %s ORDER BY r.date_changed LIMIT 10', // phpcs:ignore
				Urlslab_Generator_Task_Row::STATUS_ACTIVE,
				Urlslab_Generator_Task_Row::STATUS_PROCESSING
			),
			ARRAY_A
		);

		if ( empty( $url_row ) ) {
			return false;
		}

		return new Urlslab_Generator_Task_Row( $rows[ rand( 0, count( $rows ) - 1 ) ] );
	}

	public function start_generator_process( Urlslab_Generator_Task_Row $task ) {
		$task->set_task_status( Urlslab_Generator_Task_Row::STATUS_PROCESSING );
		$task->set_updated_at( Urlslab_Data::get_now() );
		$task->update();

		try {

			if ( $task->get_task_status() === Urlslab_Generator_Task_Row::STATUS_PROCESSING ) {
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
							return $this->process_shortcode_res( $task );
						case Urlslab_Generator_Task_Row::GENERATOR_TYPE_POST_CREATION:
							return $this->process_post_creation_res( $task );
						default:
							$task->set_task_status( Urlslab_Generator_Result_Row::STATUS_DISABLED );
							$task->update();
							return false;
					}
				}
			}

			// creating a new process


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
					$task->set_task_status( Urlslab_Generator_Result_Row::STATUS_DISABLED );
					$task->update();
					return false;
				default:
					$task->set_task_status( Urlslab_Generator_Result_Row::STATUS_DISABLED );
					$task->update();
					return true;
			}
		}

		return true;
	}

	private function process_shortcode_res( Urlslab_Generator_Task_Row $task ): bool {
		$task_data = (array) json_decode( $task->get_task_data() );

		// creating the request
		$request = new DomainDataRetrievalAugmentRequest();
		$request->setAugmentingModelName( $task->get_mo );
		$request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

		switch ( $task_data['shortcode_type'] ) {
			case Urlslab_Generator_Shortcode_Row::TYPE_SEMANTIC_SEARCH_CONTEXT:
				return $this->process_row_augment_res( $task );

			case Urlslab_Generator_Shortcode_Row::TYPE_VIDEO:
				return $this->process_row_video_res( $task );
		}

		$row_shortcode = new Urlslab_Generator_Shortcode_Row(  );

		$request = new DomainDataRetrievalAugmentRequest();
		$prompt = new DomainDataRetrievalAugmentPrompt();

		if ( Urlslab_Generator_Shortcode_Row::TYPE_VIDEO === $row_shortcode->get_shortcode_type() ) {
			if ( ! isset( $attributes['video_captions_text'] ) || empty( $attributes['video_captions_text'] ) ) {
				$row_obj->set_result( 'Video captions not available' );
				$row_obj->set_status( Urlslab_Generator_Result_Row::STATUS_PENDING );
				$row_obj->update();

				return true;
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
			$response = Urlslab_Augment_Connection::get_instance()->augment( $request );
		} else {
			$attributes = $widget->get_att_values( $row_shortcode, $attributes );
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

			if ( strlen( $row_obj->get_url_filter() ) ) {
				$filter->setUrls( array( $row_obj->get_url_filter() ) );
			}

			if ( strlen( $row_obj->get_semantic_context() ) ) {
				$request->setAugmentCommand( $row_obj->get_semantic_context() );
				if ( ! strlen( $row_obj->get_url_filter() ) ) {
					$filter->setUrls( array( Urlslab_Url::get_current_page_url()->get_domain_name() ) );
				}
			}
			$request->setFilter( $filter );

			$response = Urlslab_Augment_Connection::get_instance()->augment( $request );
		}
	}

	private function process_post_creation_res( Urlslab_Generator_Task_Row $task ): bool {
		return true;
	}

	private function process_row_augment_res( Urlslab_Generator_Shortcode_Row $row_shortcode, $input_data, $model_name ) {
		$prompt = new DomainDataRetrievalAugmentPrompt();

	}

	private function create_shortcode_gen_process( Urlslab_Generator_Task_Row $task ): bool {
		// create shortcode generator

	}

	private function create_post_creation_gen_process( Urlslab_Generator_Task_Row $task ): bool {
		// create post creation generator
	}

}

