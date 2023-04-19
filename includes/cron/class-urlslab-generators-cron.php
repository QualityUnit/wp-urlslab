<?php

use OpenAPI\Client\ApiException;
use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use OpenAPI\Client\Model\DomainDataRetrievalContentQuery;
use OpenAPI\Client\Urlslab\ContentApi;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Generators_Cron extends Urlslab_Cron {
	private ContentApi $content_client;

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating content', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_SCHEDULE )
			 || ! $this->init_client()
		) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );

		global $wpdb;

		$query_data = array( Urlslab_Content_Generator_Row::STATUS_NEW );
		$active_sql = '';
		if ( Urlslab_Widget::FREQ_NEVER != $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_REFRESH_INTERVAL ) ) {
			$query_data[] = Urlslab_Content_Generator_Row::STATUS_ACTIVE;
			$query_data[] = Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_REFRESH_INTERVAL ) );
			$active_sql   = '(status = %s AND status_changed < %s) OR ';
		}
		// PENDING or UPDATING urls will be retried in one hour again
		$query_data[] = Urlslab_Content_Generator_Row::STATUS_PENDING;
		$query_data[] = Urlslab_Data::get_now( time() - 3600 );

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

		$command = $row_obj->get_command();
		$command = str_replace( '|$lang|', $row_obj->get_lang(), $command );

		try {
			$request = new DomainDataRetrievalAugmentRequest();
			$request->setAugmentingModelName( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_GENERATOR_MODEL ) );
			$request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );
			$prompt = new DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( "Additional information to your memory:\n--\n{context}\n----\n" . $command );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$request->setPrompt( $prompt );

			$filter = new DomainDataRetrievalContentQuery();
			$filter->setLimit( 5 );
			if ( strlen( $row_obj->get_semantic_context() ) ) {
				$request->setAugmentCommand( $row_obj->get_semantic_context() );
				$filter->setAdditionalQuery(
					(object) array(
						'match' => (object) array( 'metadata.url' => $row_obj->get_url_filter() ),
					)
				);
			} else {
				$filter->setUrls( array( $row_obj->get_url_filter() ) );
			}
			$request->setFilter( $filter );

			$response = $this->content_client->memoryLessAugment( $request, 'false', 'false' );

			if ( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_ACTIVE );
			} else {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_WAITING_APPROVAL );
			}

			if ( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_AUTOAPPROVE ) ) {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_ACTIVE );
			} else {
				$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_WAITING_APPROVAL );
			}

			$row_obj->set_result( $response->getResponse() );
			$row_obj->update();
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 404:
				case 422:
				case 429:
				case 504:
					$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_PENDING );
					$row_obj->set_result( $e->getMessage() );
					$row_obj->update();

					break;

				case 500:
				default:
					$row_obj->set_status( Urlslab_Content_Generator_Row::STATUS_DISABLED );
					$row_obj->set_result( $e->getMessage() );
					$row_obj->update();
			}

			return false;
		}

		return true;
	}

	private function init_client(): bool {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new ContentApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}
}
