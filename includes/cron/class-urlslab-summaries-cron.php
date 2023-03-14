<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Summaries_Cron extends Urlslab_Cron {
	private Swagger\Client\Urlslab\SummaryApi $client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client() {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			$config       = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->client = new Swagger\Client\Urlslab\SummaryApi( new GuzzleHttp\Client(), $config );
		}
	}

	protected function execute(): bool {
		$this->init_client();
		if ( empty( $this->client ) ) {
			return false;
		}

		global $wpdb;

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = 200 AND (sum_status = %s OR (sum_status =%s AND update_sum_date < %s) OR (sum_status = %s AND update_sum_date < %s)) ORDER BY update_sum_date LIMIT 500', // phpcs:ignore
				Urlslab_Url_Row::SUM_STATUS_NEW,
				Urlslab_Url_Row::SUM_STATUS_ACTIVE,
				Urlslab_Data::get_now( time() - get_option( Urlslab_General::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL ) ),
				//PENDING or UPDATING urls will be retried in one hour again
				Urlslab_Url_Row::SUM_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 12 * 3600 )
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
				$row_obj->set( 'sum_status', Urlslab_Url_Row::SCR_STATUS_ERROR );
				$row_obj->set( 'update_sum_date', Urlslab_Data::get_now() );
				$row_obj->update();
			}
		}

		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET update_sum_date=%s, sum_status=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		$urlslab_summaries = $this->client->getSummary( new \Swagger\Client\Model\DomainDataRetrievalUpdatableRetrieval( array( 'urls' => $url_names ) ) );

		$some_urls_updated = false;
		foreach ( $urlslab_summaries as $id => $summary ) {
			switch ( $summary->getSummaryStatus() ) {
				case 'BLOCKED':
				case 'NOT_CRAWLING_URL':
					$url_objects[ $id ]->set( 'sum_status', Urlslab_Url_Row::SUM_STATUS_ERROR );
					$url_objects[ $id ]->set( 'update_sum_date', Urlslab_Data::get_now() );
					$url_objects[ $id ]->update();
					break;
				case 'AVAILABLE':
					$url_objects[ $id ]->set( 'urlslab_domain_id', $summary->getDomainId() );
					$url_objects[ $id ]->set( 'urlslab_url_id', $summary->getUrlId() );
					$url_objects[ $id ]->set( 'urlslab_sum_timestamp', time() );	//TODO: api has no info when was summary generated?
					$url_objects[ $id ]->set( 'sum_status', Urlslab_Url_Row::SUM_STATUS_ACTIVE );
					$url_objects[ $id ]->set( 'update_sum_date', Urlslab_Data::get_now() );
					$url_objects[ $id ]->update();
					$some_urls_updated = true;
					break;
				case 'AWAITING_PENDING':    //no acition
				default:
					//we will leave object in the status pending
			}
		}

		return $some_urls_updated;    //100 URLs per execution is enought if there was no url updated
	}
}
