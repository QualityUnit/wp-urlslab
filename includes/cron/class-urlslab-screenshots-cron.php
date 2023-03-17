<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshots_Cron extends Urlslab_Cron {
	private \OpenAPI\Client\Urlslab\ScreenshotApi $client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client() {
		$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		if ( strlen( $api_key ) ) {
			$config       = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->client = new \OpenAPI\Client\Urlslab\ScreenshotApi( new GuzzleHttp\Client(), $config );
		}
	}

	protected function execute(): bool {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Screenshot_Widget::SLUG );
		if ( empty( $widget ) ) {
			return false;
		}

		$this->init_client();
		if ( empty( $this->client ) ) {
			return false;
		}

		global $wpdb;

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = 200 AND (scr_status = %s OR (scr_status =%s AND update_scr_date < %s) OR (scr_status = %s AND update_scr_date < %s)) ORDER BY update_scr_date LIMIT 500', // phpcs:ignore
				Urlslab_Url_Row::SCR_STATUS_NEW,
				Urlslab_Url_Row::SCR_STATUS_ACTIVE,
				Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_General::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) ),
				//PENDING or UPDATING urls will be retried in one hour again
				Urlslab_Url_Row::SCR_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 12 * 3600 )
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

		$url_objects = array();

		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Url_Row( $row );
			if ( $row_obj->get_url()->is_url_valid() ) {
				$url_objects[] = $row_obj;
				$data[]        = $row['url_id'];
				$url_names[]   = $row['url_name'];
			} else {
				$row_obj->set_scr_status( Urlslab_Url_Row::SCR_STATUS_ERROR );
				$row_obj->update();
			}
		}

		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET update_scr_date=%s, scr_status=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		$urlslab_screenshots = $this->client->getScreenshots( new \OpenAPI\Client\Model\DomainDataRetrievalUpdatableRetrieval( array( 'urls' => $url_names ) ) );

		$some_urls_updated = false;
		foreach ( $urlslab_screenshots as $id => $screenshot ) {
			switch ( $screenshot->getScreenshotStatus() ) {
				case 'BLOCKED':
				case 'NOT_CRAWLING_URL':
					$url_objects[ $id ]->set_scr_status( Urlslab_Url_Row::SCR_STATUS_ERROR );
					$url_objects[ $id ]->update();
					break;
				case 'AVAILABLE':
					$url_objects[ $id ]->set_urlslab_domain_id( $screenshot->getDomainId() );
					$url_objects[ $id ]->set_urlslab_url_id( $screenshot->getUrlId() );
					$url_objects[ $id ]->set_urlslab_scr_timestamp( $screenshot->getScreenshotId() );
					$url_objects[ $id ]->set_scr_status( Urlslab_Url_Row::SCR_STATUS_ACTIVE );
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

	public function get_description(): string {
		return __( 'Syncing URLSLAB Screenshots from www.urlslab.com to local database', 'urlslab' );
	}
}
