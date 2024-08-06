<?php


class Urlslab_Cron_Executor_Generator {
	private Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi $api_client;

	/**
	 * @param $config
	 */
	public function __construct() {
		// TODO new api
		$this->api_client = new Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), Urlslab_Connection_FlowHunt::getConfiguration() );
	}


	public function fetch_tasks_to_process( Urlslab_Widget_Content_Generator $widget ) {
		global $wpdb;

		// first rows are processing
		$processing_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE task_status=%s LIMIT 10', // phpcs:ignore
				Urlslab_Data_Generator_Task::STATUS_PROCESSING
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
