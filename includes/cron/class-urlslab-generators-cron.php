<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Generators_Cron extends Urlslab_Cron {
	//private \OpenAPI\Client\Urlslab\SummaryApi $client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client() {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			//TODO
			$config = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			//$this->client = new \OpenAPI\Client\Urlslab\SummaryApi( new GuzzleHttp\Client(), $config );
		}
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG ) ) {
			return false;
		}

		$this->init_client();

		//TODO
		//if ( empty( $this->client ) ) {
		//return false;
		//}

		global $wpdb;

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_CONTENT_GENERATORS_TABLE . ' WHERE status = %s OR (status =%s AND status_changed < %s) OR (status = %s AND status_changed < %s) ORDER BY status_changed LIMIT 1', // phpcs:ignore
				Urlslab_Content_Generator_Row::STATUS_NEW,
				Urlslab_Content_Generator_Row::STATUS_ACTIVE,
				Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_REFRESH_INTERVAL ) ),
				//PENDING or UPDATING urls will be retried in one hour again
				Urlslab_Content_Generator_Row::STATUS_PENDING,
				Urlslab_Data::get_now( time() - 12 * 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			return false;
		}


		//there should be just one row
		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Content_Generator_Row( $row );
			$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_PENDING );
			$row_obj->update();

			//TODO generate content
			$query = $row_obj->get_query();
			$query = str_replace( '|$lang|', $row_obj->get_lang(), $query );


			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_ACTIVE );
			} else {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_WAITING_APPROVAL );
			}
			$row_obj->set_result( 'test' );
			$row_obj->update();
		}

		return true;
	}

	public function get_description(): string {
		return __( 'Generating content', 'urlslab' );
	}
}
