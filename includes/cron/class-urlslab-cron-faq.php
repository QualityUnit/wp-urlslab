<?php

use FlowHunt_Vendor\OpenAPI\Client\Model\FlowInvokeRequest;
use FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus;

class Urlslab_Cron_Faq extends Urlslab_Cron {

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating answer to FAQ Questions', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Faq::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG )->get_option( Urlslab_Widget_Faq::SETTING_NAME_AUTO_GENERATE_ANSWER )
		) {
			return false;
		}

		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FAQS_TABLE . ' WHERE status = %s OR (status = %s and updated < %s) LIMIT 20', // phpcs:ignore
				Urlslab_Data_Faq::STATUS_EMPTY,
				Urlslab_Data_Faq::STATUS_PROCESSING,
				Urlslab_Data::get_now( time() - 3 )
			),
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );
			return false;
		}

		foreach ( $rows as $row ) {
			$new_faq    = new Urlslab_Data_Faq( $row );
			$new_faq->set_status( Urlslab_Data_Faq::STATUS_PROCESSING );
			$new_faq->update();

			$response = Urlslab_Connection_Flows::get_instance()->get_client()->invokeFlow(
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG )->get_option( Urlslab_Widget_Faq::SETTING_NAME_FAQ_FLOW_ID ),
				Urlslab_Connection_FlowHunt::get_workspace_id(),
				new FlowInvokeRequest( array( 'human_input' => $new_faq->get_question() ) )
			);

			switch ( $response->getStatus() ) {
				case TaskStatus::SUCCESS:
					try {
						$result = json_decode( $response->getResult() );
						if ( isset( $result->outputs[0]->outputs[0]->results->message->result ) && strpos( $result->outputs[0]->outputs[0]->results->message->result, 'DONT_KNOW' ) === false ) {
							$new_faq->set_answer( $result->outputs[0]->outputs[0]->results->message->result );
							if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG )->get_option( Urlslab_Widget_Faq::SETTING_NAME_AUTO_APPROVAL_GENERATED_ANSWER ) ) {
								$new_faq->set_status( Urlslab_Data_Faq::STATUS_WAITING_FOR_APPROVAL );
							} else {
								$new_faq->set_status( Urlslab_Data_Faq::STATUS_ACTIVE );
							}

							try {
								$urls = Urlslab_Connection_Related_Urls::get_instance()->get_related_urls_to_query( $new_faq->get_question(), 1 );
								foreach ( $urls as $url ) {
									$url_obj = new Urlslab_Url( $url, true );

									Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( array( $url_obj ) );

									$faq_url = new Urlslab_Data_Faq_Url(
										array(
											'faq_id'  => $new_faq->get_faq_id(),
											'url_id'  => $url_obj->get_url_id(),
											'sorting' => 0,
										),
										false
									);
									$faq_url->insert();
								}
							} catch ( Exception $e ) {
								// Do nothing
							}
						} else {
							$new_faq->set_status( Urlslab_Data_Faq::STATUS_DISABLED );
						}
						$new_faq->update();
					} catch ( Exception $e ) {
						$new_faq->set_status( Urlslab_Data_Faq::STATUS_DISABLED );
						$new_faq->update();
					}
					break;
				case TaskStatus::IGNORED:
				case TaskStatus::FAILURE:
				case TaskStatus::REJECTED:
					$new_faq->set_status( Urlslab_Data_Faq::STATUS_DISABLED );
					$new_faq->update();
					break;
			}
		}

		return true;
	}
}
