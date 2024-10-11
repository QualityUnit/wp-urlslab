<?php


class Urlslab_Cron_Executor_Generator {

	public function fetch_tasks_to_process( Urlslab_Widget_Content_Generator $widget ) {
		global $wpdb;

		// first rows are processing
		$processing_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status=%s AND updated_at <%s LIMIT 10', // phpcs:ignore
				Urlslab_Data_Generator_Task::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 300 )
			),
			ARRAY_A
		);

		if ( count( $processing_rows ) >= 10 ) {
			// processing the current processing tasks
			$returning_arr = array();
			foreach ( $processing_rows as $row ) {
				$returning_arr[] = new Urlslab_Data_Generator_Task( $row );
			}
		} else {
			// some new tasks can be picked for processing
			$status_new_rows = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status=%s LIMIT 10', // phpcs:ignore
					Urlslab_Data_Generator_Task::STATUS_NEW
				),
				ARRAY_A
			);
			$returning_arr   = array();
			foreach ( $processing_rows as $row ) {
				$returning_arr[] = new Urlslab_Data_Generator_Task( $row );
			}
			foreach ( $status_new_rows as $row ) {
				$returning_arr[] = new Urlslab_Data_Generator_Task( $row );
			}
		}

		return $returning_arr;
	}
}
