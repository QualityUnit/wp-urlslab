<?php

class Urlslab_Faq_Cron extends Urlslab_Cron {

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating answer to FAQ Questions', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Faq::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_SCHEDULE )
		) {
			return false;
		}

		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FAQS_TABLE . ' WHERE task_status = %s OR (task_status = %s AND updated_at < %s) ORDER BY updated_at LIMIT 30', // phpcs:ignore
				Urlslab_Faq_Row::STATUS_EMPTY,
				Urlslab_Generator_Task_Row::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 86400 ) // retry processing for processes that started more than 24 hours ago
			),
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			return false;
		}


		/** @var Urlslab_Faq_Row[] $faqs */
		$faqs = array();
		for ( $i = 0; $i < min( count( $rows ), 5 ); $i ++ ) {
			$rand_idx = rand( 0, count( $rows ) - 1 );
			$new_faq    = new Urlslab_Faq_Row( $rows[ $rand_idx ] );
			$new_faq->set_status( Urlslab_Faq_Row::STATUS_PROCESSING );
			$new_faq->update();
			array_splice( $rows, $rand_idx, 1 );
			$faqs[] = $new_faq;
		}

		// Getting the Prompt Template to use
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Faq::SLUG );
		$prompt_template_id = $widget->get_option( Urlslab_Faq::SETTING_NAME_FAQ_PROMPT_TEMPLATE_ID );
		if ( $prompt_template_id < 0 ) {
			// using one of the prompt template of type question answering
			$row = $wpdb->get_row(
				$wpdb->prepare(
				'SELECT prompt_template FROM ' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE prompt_type = %s LIMIT 1', // phpcs:ignore
					Urlslab_Prompt_Template_Row::ANSWERING_TASK_PROMPT_TYPE
				)
			);
		} else {
			$row = $wpdb->get_row(
				$wpdb->prepare(
				'SELECT prompt_template FROM ' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE template_id = %d AND prompt_type = %s LIMIT 1', // phpcs:ignore
					$prompt_template_id,
					Urlslab_Prompt_Template_Row::ANSWERING_TASK_PROMPT_TYPE
				)
			);
		}
		if ( empty( $row ) ) {
			return false;
		}
		$prompt_template = $row['prompt_template'];
		// Getting the Prompt Template to use

		// Fetching URLs From SERP
		$serp_conn = Urlslab_Serp_Connection::get_instance();
		$queries = array_map(
			function( $item ) {
				return new Urlslab_Serp_Query_Row(
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

		/** @var Urlslab_Generator_Task_Row[] $inserting_tasks */
		$inserting_tasks = array();
		foreach ( $faqs as $faq ) {
			$task_data              = array();
			$task_data['model']     = $widget->get_option( Urlslab_Faq::SETTING_NAME_FAQ_GENERATOR_MODEL );
			$task_data['faq']   = $faq->as_array();
			$row_prompt_template        = $prompt_template;
			if ( str_contains( $row_prompt_template, '{question}' ) ) {
				$row_prompt_template = str_replace( '{question}', $faq->get_question(), $row_prompt_template );
			}
			$task_data['prompt'] = $row_prompt_template;
			$task_data['urls'] = $serp_urls[ $faq->get_question() ] ?? array();
			$inserting_tasks[] = new Urlslab_Generator_Task_Row(
				array(
					'generator_type' => Urlslab_Generator_Task_Row::GENERATOR_TYPE_FAQ,
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
