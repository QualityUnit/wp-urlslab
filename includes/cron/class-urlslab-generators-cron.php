<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Generators_Cron extends Urlslab_Cron {
	private \OpenAPI\Client\Urlslab\ContentApi $content_client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client(): bool {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			$config               = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new \OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG ) ||
			 ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_SCHEDULE ) ||
			 ! $this->init_client()
		) {
			return false;
		};

		global $wpdb;

		$query_data = array( Urlslab_Content_Generator_Row::STATUS_NEW );
		$active_sql = '';
		if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_REFRESH_INTERVAL ) != Urlslab_Widget::FREQ_NEVER ) {
			$query_data[] = Urlslab_Content_Generator_Row::STATUS_ACTIVE;
			$query_data[] = Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_REFRESH_INTERVAL ) );
			$active_sql   = '(status = %s AND status_changed < %s) OR ';
		}
		//PENDING or UPDATING urls will be retried in one hour again
		$query_data[] = Urlslab_Content_Generator_Row::STATUS_PENDING;
		$query_data[] = Urlslab_Data::get_now( time() - 20 * 3600 );

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_CONTENT_GENERATORS_TABLE . ' WHERE status = %s OR ' . $active_sql . '(status = %s AND status_changed < %s) ORDER BY status_changed LIMIT 1', // phpcs:ignore
				$query_data
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$row_obj = new Urlslab_Content_Generator_Row( $url_row );
		$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_PENDING );
		$row_obj->update();

		$query = $row_obj->get_query();
		$query = str_replace( '|$lang|', $row_obj->get_lang(), $query );

		try {

			$request = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest();
			$request->setAugmentCommand( $query );
			$prompt = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( "You are generating data for website. Follows pieces of additional information which should help you to generate content:\n{context}{query}" );
			$prompt->setDocumentTemplate( "--\n{context}\n--" );
			$request->setPrompt( $prompt );

			$response = $this->content_client->memoryLessAugment( $request );


			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_ACTIVE );
			} else {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_WAITING_APPROVAL );
			}

			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_ACTIVE );
			} else {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_WAITING_APPROVAL );
			}

			$row_obj->set_result( $response->getResponse() );
			$row_obj->update();
		} catch ( \OpenAPI\Client\ApiException $e ) {
			$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_DISABLED );
			$row_obj->set_result( $e->getMessage() );
			$row_obj->update();

			return false;
		}

		return true;
	}

	public function get_description(): string {
		return __( 'Generating content', 'urlslab' );
	}
}
