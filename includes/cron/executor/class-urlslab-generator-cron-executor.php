<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Generator_Cron_Executor {

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
		$task->update();

		try {

			if ( $task->get_task_status() === Urlslab_Generator_Task_Row::STATUS_PROCESSING ) {
				return $this->process_pending_gen( $task );
			}

			// Creating new process
			switch ( $task->get_generator_type() ) {
				case Urlslab_Generator_Task_Row::GENERATOR_TYPE_SHORTCODE:
					return $this->create_shortcode_gen_process( $task );
				case Urlslab_Generator_Task_Row::GENERATOR_TYPE_POST_CREATION:
					return $this->create_post_creation_gen_process( $task );
				default:
					$task->set_task_status( Urlslab_Generator_Result_Row::STATUS_DISABLED );
					$task->update();
					return false;
			}       
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

	private function process_pending_gen( Urlslab_Generator_Task_Row $task ): bool {

	}

	private function create_shortcode_gen_process( Urlslab_Generator_Task_Row $task ): bool {

	}

	private function create_post_creation_gen_process( Urlslab_Generator_Task_Row $task ): bool {

	}

}

