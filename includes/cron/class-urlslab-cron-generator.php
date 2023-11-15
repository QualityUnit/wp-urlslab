<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;

class Urlslab_Cron_Generator extends Urlslab_Cron {
	private ContentApi $content_client;

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating content', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Content_Generator::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG )->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_SCHEDULE )
			 || ! $this->init_client()
		) {
			return false;
		}

		/**
		 * @var Urlslab_Widget_Content_Generator $widget
		 */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
		$generator_cron_executor = new Urlslab_Cron_Executor_Generator();
		$task                    = $generator_cron_executor->fetch_tasks_to_process( $widget );
		if ( empty( $task ) ) {
			$this->lock( 5, Urlslab_Cron::LOCK );
			return false;
		}

		foreach ( $task as $task_row ) {
			$this->start_generator_process( $task_row, $widget );
		}
		return true;
	}

	private function init_client(): bool {
		if ( empty( $this->content_client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new ContentApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}

	private function start_generator_process( Urlslab_Data_Generator_Task $task, Urlslab_Widget_Content_Generator $widget ): bool {
		if ( Urlslab_Data_Generator_Task::STATUS_NEW == $task->get_task_status() ) {
			$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_PROCESSING );
			$task->update();

			switch ( $task->get_generator_type() ) {
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE:
					$task_row = $this->process_shortcode_creation( $task, $widget );
					break;
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_POST_CREATION:
				case Urlslab_Data_Generator_Task::GENERATOR_TYPE_FAQ:
					$task_row = $this->process_augmentation( $task );
					break;
				default:
					$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
					$task->update();
					return false;
			}

			$task_row->insert();
			$task->set_internal_task_id( $task_row->get_task_id() );
			$task->update();
		}

		try {
			$internal_task = new Urlslab_Data_Task( array( 'task_id' => $task->get_internal_task_id() ), false );
			if ( $internal_task->load() ) {
				$executor = Urlslab_Executor::get_executor( $internal_task->get_executor_type() );
				$executor->set_max_execution_time( 25 );
				$executor->execute( $internal_task );
				$executor->unlock_all_tasks();
				$internal_task->load();    //reload task to get latest results

				switch ( $internal_task->get_status() ) {
					case Urlslab_Data_Task::STATUS_FINISHED:
						switch ( $task->get_generator_type() ) {
							case Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE:
								$this->process_shortcode_res( $task, $internal_task->get_result(), $widget );
								break;
							case Urlslab_Data_Generator_Task::GENERATOR_TYPE_POST_CREATION:
								$this->process_post_creation_res( $task, $internal_task->get_result() );
								break;
							case Urlslab_Data_Generator_Task::GENERATOR_TYPE_FAQ:
								$this->process_faq_answer_generation( $task, $internal_task->get_result() );
								break;
							default:
								break;
						}
						$task->delete();
						$internal_task->delete_task();
						break;

					case Urlslab_Data_Task::STATUS_ERROR:
						$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
						$task->set_res_log( $internal_task->get_result() );
						$task->update();
						return false;

					default:
						break;
				}

				return true;
			} else {
				$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
				$task->set_res_log( 'Task not found' );
				$task->update();
				return false;
			}
		} catch ( Exception $e ) {
			$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
			$task->set_res_log( $e->getMessage() );
			$task->update();
			return false;
		}
	}

	private function process_shortcode_creation( $task, $widget ) {
		$task_data     = (array) json_decode( $task->get_task_data() );
		$row_shortcode = new Urlslab_Data_Generator_Shortcode( (array) $task_data['shortcode_row'] );
		$shortcode_prompt_vars = (array) json_decode( $task_data['prompt_variables'] );

		$model = $task_data['model'] ?? DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106;
		$prompt = '';

		if ( Urlslab_Data_Generator_Shortcode::TYPE_VIDEO === $row_shortcode->get_shortcode_type() ) {
			$attributes = $widget->get_att_values( $row_shortcode, $shortcode_prompt_vars, array( 'video_captions_text' ) );
			if ( ! isset( $attributes['video_captions_text'] ) || empty( $attributes['video_captions_text'] ) ) {
				$task->set_task_status( Urlslab_Data_Generator_Task::STATUS_DISABLED );
				$task->update();

				return false;
			}
			$prompt = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Data_Generator_Result::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
				"\n\n--VIDEO CAPTIONS:\n{context}\n--VIDEO CAPTIONS END\nANSWER:",
				$attributes
			);
		} else {
			$attributes = $widget->get_att_values( $row_shortcode, $shortcode_prompt_vars );
			$prompt    = $widget->get_template_value(
				'Never appologize! If you do NOT know the answer, return just text: ' . Urlslab_Data_Generator_Result::DO_NOT_KNOW . "!\n" . $row_shortcode->get_prompt() .
				'ANSWER:',
				$attributes
			);
		}

		if ( ! empty( $task_data['url_filter'] ) ) {
			// with context
			if ( '{{page_url}}' == $task_data['url_filter'] ) {
				$url = $shortcode_prompt_vars['page_url'];
			} else {
				$url = $task_data['url_filter'];
			}
			$task_row = new Urlslab_Data_Task(
				array(
					'slug'          => 'cron-generator',
					'executor_type' => Urlslab_Executor_Generate_Url_Context::TYPE,
					'data'          => array(
						'urls' => array( $url ),
						'model' => $model,
						'prompt' => $prompt,
					),
				),
				false
			);
		} else {
			// no context, simple generator
			$task_row = new Urlslab_Data_Task(
				array(
					'slug'          => 'cron-generator',
					'executor_type' => Urlslab_Executor_Generate::TYPE,
					'data'          => array(
						'model' => $model,
						'prompt' => $prompt,
					),
				),
				false
			);
		}
		return $task_row;
	}

	private function process_augmentation( $task ): Urlslab_Data_Task {
		// create post creation generator
		$task_data = (array) json_decode( $task->get_task_data() );

		if ( ! empty( $task_data['urls'] ) ) {
			$task_row = new Urlslab_Data_Task(
				array(
					'slug'          => 'cron-generator',
					'executor_type' => Urlslab_Executor_Generate_Url_Context::TYPE,
					'data'          => array(
						'urls' => array( $task_data['urls'] ),
						'model' => $task_data['model'],
						'prompt' => $task_data['prompt'],
					),
				),
				false
			);
		} else {
			// no context, simple generator
			$task_row = new Urlslab_Data_Task(
				array(
					'slug'          => 'cron-generator',
					'executor_type' => Urlslab_Executor_Generate::TYPE,
					'data'          => array(
						'model' => $task_data['model'],
						'prompt' => $task_data['prompt'],
					),
				),
				false
			);
		}

		return $task_row;
	}

	private function process_shortcode_res( Urlslab_Data_Generator_Task $task, string $rsp, Urlslab_Widget_Content_Generator $widget ): bool {
		$task_data    = (array) json_decode( $task->get_task_data() );
		$results_data = new Urlslab_Data_Generator_Result( array( 'hash_id' => $task_data['hash_id'] ) );
		$results_data->load();

		if ( $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_AUTOAPPROVE ) ) {
			$results_data->set_status( Urlslab_Data_Generator_Result::STATUS_ACTIVE );
		} else {
			$results_data->set_status( Urlslab_Data_Generator_Result::STATUS_WAITING_APPROVAL );
		}
		$results_data->set_result( $rsp );
		$results_data->insert( true );

		return true;
	}

	private function process_post_creation_res( Urlslab_Data_Generator_Task $task, string $rsp ): string {
		$task_data = (array) json_decode( $task->get_task_data() );
		$post_id   = wp_insert_post(
			array(
				'post_title'   => $task_data['keyword'],
				'post_content' => $rsp,
				'post_status'  => 'draft',
				'post_type'    => $task_data['post_type'],
			)
		);

		return html_entity_decode( get_edit_post_link( $post_id ) );
	}

	private function process_faq_answer_generation( Urlslab_Data_Generator_Task $task, string $rsp ) {
		$task_data = (array) json_decode( $task->get_task_data() );
		$faq       = new Urlslab_Data_Faq( (array) $task_data['faq'] );
		$faq->set_answer( $rsp );
		if ( $task_data['auto_approval'] ) {
			$faq->set_status( Urlslab_Data_Faq::STATUS_ACTIVE );
		} else {
			$faq->set_status( Urlslab_Data_Faq::STATUS_WAITING_FOR_APPROVAL );
		}
		$faq->update();
	}
}
