<?php

use OpenAPI\Client\ApiException;
use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\DomainDataRetrievalDataRequest;
use OpenAPI\Client\Model\DomainDataRetrievalSummaryResponse;
use OpenAPI\Client\Urlslab\SummaryApi;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Summaries_Cron extends Urlslab_Cron {
	private SummaryApi $client;

	public function get_description(): string {
		return __( 'Syncing summaries generated by URLsLab service to local database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! $this->init_client() ) {
			return false;
		}

		global $wpdb;

		$query_data = array();

		if (
			Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Link_Enhancer::SLUG )
			&& Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Link_Enhancer::SLUG )->get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS )
		) {
			$query_data[]          = Urlslab_Url_Row::HTTP_STATUS_OK;
			$sql_where_http_status = ' http_status = %d AND';
		} else {
			$sql_where_http_status = '';
		}

		$query_data[] = Urlslab_Url_Row::SUM_STATUS_NEW;
		$query_data[] = Urlslab_Url_Row::SUM_STATUS_ACTIVE;
		$query_data[] = Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL ) );
		// PENDING or UPDATING urls will be retried in one hour again
		$query_data[] = Urlslab_Url_Row::SUM_STATUS_PENDING;
		$query_data[] = Urlslab_Data::get_now( time() - 24 * 3600 );

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE ' . $sql_where_http_status . ' (sum_status = %s OR (sum_status =%s AND update_sum_date < %s) OR (sum_status = %s AND update_sum_date < %s)) ORDER BY update_sum_date LIMIT 500', // phpcs:ignore
				$query_data,
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			return false;
		}

		$data   = array();
		$data[] = Urlslab_Data::get_now();
		$data[] = Urlslab_Url_Row::SUM_STATUS_PENDING;

		$url_names = array();

		$url_objects = array();

		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Url_Row( $row );
			if ( $row_obj->get_url()->is_url_valid() ) {
				$url_objects[] = $row_obj;
				$data[]        = $row['url_id'];
				$url_names[]   = $row['url_name'];
			} else {
				$row_obj->set_sum_status( Urlslab_Url_Row::SCR_STATUS_ERROR );
				$row_obj->update();
			}
		}

		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET update_sum_date=%s, sum_status=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		$some_urls_updated = false;

		try {
			$request = new DomainDataRetrievalDataRequest();
			$request->setUrls( $url_names );
			$request->setRenewFrequency( DomainDataRetrievalDataRequest::RENEW_FREQUENCY_ONE_TIME );
			$urlslab_summaries = $this->client->getSummary( $request );
			foreach ( $urlslab_summaries as $id => $summary ) {
				switch ( $summary->getSummaryStatus() ) {
					case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_REDIRECTED:
					case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_BLOCKED:
						$url_objects[ $id ]->set_sum_status( Urlslab_Url_Row::SUM_STATUS_ERROR );
						$url_objects[ $id ]->update();

						break;

					case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_AVAILABLE:
						$url_objects[ $id ]->set_urlslab_domain_id( $summary->getDomainId() );
						$url_objects[ $id ]->set_urlslab_url_id( $summary->getUrlId() );
						$url_objects[ $id ]->set_urlslab_sum_timestamp( time() );       // TODO: api has no info when was summary generated?
						$url_objects[ $id ]->set_url_summary( $summary->getSummary() ); // TODO: api has no info when was summary generated?
						$url_objects[ $id ]->set_sum_status( Urlslab_Url_Row::SUM_STATUS_ACTIVE );
						$url_objects[ $id ]->update();
						$some_urls_updated = true;

						break;

					case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_PENDING:
					case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_UPDATING:
					default:
						// we will leave object in the status pending
				}
			}
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );

				return false;
			}
		}

		return $some_urls_updated;    // 100 URLs per execution is enought if there was no url updated
	}

	private function init_client(): bool {
		if ( empty( $this->client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key      = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config       = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->client = new SummaryApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->client );
	}
}
