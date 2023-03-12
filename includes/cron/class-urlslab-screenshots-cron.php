<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshots_Cron extends Urlslab_Cron {
	private Swagger\Client\Urlslab\ScreenshotApi $client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client() {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			$config       = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->client = new Swagger\Client\Urlslab\ScreenshotApi( new GuzzleHttp\Client(), $config );
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
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = 200 AND (scr_status = %s OR (scr_status =%s AND update_scr_date < %s) OR (scr_status IN (%s, %s) AND update_scr_date < %s)) ORDER BY update_scr_date LIMIT 100', // phpcs:ignore
				Urlslab_Url_Row::SCR_STATUS_NEW,
				Urlslab_Url_Row::SCR_STATUS_ACTIVE,
				Urlslab_Data::get_now( time() - get_option( Urlslab_General::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) ),
				//PENDING or UPDATING urls will be retried in one hour again
				Urlslab_Url_Row::SCR_STATUS_PENDING,
				Urlslab_Url_Row::SCR_STATUS_UPDATING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			return false;
		}

		$data   = array();
		$data[] = Urlslab_Data::get_now();
		$data[] = Urlslab_Url_Row::SCR_STATUS_PENDING;

		$url_names = array();

		foreach ( $url_rows as $row ) {
			$data[]      = $row['url_id'];
			$url_names[] = $row['url_name'];
		}

		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET update_scr_date=%s, scr_status=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		$urlslab_screenshots = $this->client->getScreenshots( new \Swagger\Client\Model\DomainDataRetrievalUpdatableRetrieval( array( 'urls' => $url_names ) ) );

		foreach ( $urlslab_screenshots as $screenshot ) {
//TODO save new screenshots
		}

		return false;    //100 URLs per execution is enought
	}


}
