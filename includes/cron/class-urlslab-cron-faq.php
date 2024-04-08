<?php

class Urlslab_Cron_Faq extends Urlslab_Cron {

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating answer to FAQ Questions', 'wp-urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Content_Generator::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Faq::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG )->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_SCHEDULE )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG )->get_option( Urlslab_Widget_Faq::SETTING_NAME_AUTO_GENERATE_ANSWER )
		) {
			return false;
		}

		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FAQS_TABLE . ' WHERE status = %s LIMIT 5', // phpcs:ignore
				Urlslab_Data_Faq::STATUS_EMPTY
			),
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );
			return false;
		}


		/** @var Urlslab_Data_Faq[] $faqs */
		$faqs = array();
		foreach ( $rows as $row ) {
			$new_faq    = new Urlslab_Data_Faq( $row );
			$new_faq->set_status( Urlslab_Data_Faq::STATUS_PROCESSING );
			$faqs[] = $new_faq;
		}
		$faqs[0]->insert_all( $faqs, false, array( 'status' ) );

		// Getting the Prompt Template to use
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG );
		$prompt_template_id = $widget->get_option( Urlslab_Widget_Faq::SETTING_NAME_FAQ_PROMPT_TEMPLATE_ID );
		if ( $prompt_template_id < 0 ) {
			// using one of the prompt template of type question answering
			$row = $wpdb->get_row(
				$wpdb->prepare(
				'SELECT prompt_template FROM ' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE prompt_type = %s LIMIT 1', // phpcs:ignore
					Urlslab_Data_Prompt_Template::ANSWERING_TASK_PROMPT_TYPE
				),
				ARRAY_A
			);
		} else {
			$row = $wpdb->get_row(
				$wpdb->prepare(
				'SELECT prompt_template FROM ' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE template_id = %d AND prompt_type = %s LIMIT 1', // phpcs:ignore
					$prompt_template_id,
					Urlslab_Data_Prompt_Template::ANSWERING_TASK_PROMPT_TYPE
				),
				ARRAY_A
			);
		}
		if ( empty( $row ) ) {
			return false;
		}
		$prompt_template = $row['prompt_template'];
		// Getting the Prompt Template to use

		// Fetching URLs From SERP
		$serp_conn = Urlslab_Connection_Serp::get_instance();
		$queries = array_map(
			function ( $item ) {
				return new Urlslab_Data_Serp_Query(
					array(
						'query' => $item->get_question(),
						'country' => 'us', //TODO - maybe get the country from Lang?
					)
				);
			},
			$faqs
		);
		$serp_urls = $serp_conn->get_serp_top_urls( $queries );
		// Fetching URLs From SERP

		/** @var Urlslab_Data_Generator_Task[] $inserting_tasks */
		$inserting_tasks = array();
		foreach ( $faqs as $faq ) {
			$task_data              = array();
			$task_data['model']     = $widget->get_option( Urlslab_Widget_Faq::SETTING_NAME_FAQ_GENERATOR_MODEL );
			$task_data['faq']   = $faq->as_array();
			$row_prompt_template        = $prompt_template;
			if ( str_contains( $row_prompt_template, '{question}' ) ) {
				$row_prompt_template = str_replace( '{question}', $faq->get_question(), $row_prompt_template );
			}
			$task_data['prompt'] = $row_prompt_template;
			$task_data['urls'] = $serp_urls[ $faq->get_question() ] ?? array();
			$task_data['auto_approval'] = $widget->get_option( Urlslab_Widget_Faq::SETTING_NAME_AUTO_APPROVAL_GENERATED_ANSWER );
			$inserting_tasks[] = new Urlslab_Data_Generator_Task(
				array(
					'generator_type' => Urlslab_Data_Generator_Task::GENERATOR_TYPE_FAQ,
					'task_data'      => json_encode( $task_data ),
				)
			);
		}

		if ( ! empty( $inserting_tasks ) ) {
			$inserting_tasks[0]->insert_all( $inserting_tasks );
		}

		return true;
	}
}
