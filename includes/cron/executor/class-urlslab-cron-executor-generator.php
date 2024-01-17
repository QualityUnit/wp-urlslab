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
