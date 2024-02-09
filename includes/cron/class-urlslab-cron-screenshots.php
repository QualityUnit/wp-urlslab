<?php

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalDataRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalScreenshotResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\SnapshotApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Cron_Screenshots extends Urlslab_Cron {
	private SnapshotApi $client;

	public function get_description(): string {
		return __( 'Syncing screenshots from URLsLab service to local database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Urls::SLUG ) || ! $this->init_client() ) {
			return false;
		}
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG );
		global $wpdb;

		$query_data            = array();
		$sql_where_http_status = '';
		$use_index             = '';
		if ( $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_VALIDATE_LINKS ) ) {
			$query_data[]          = Urlslab_Data_Url::HTTP_STATUS_OK;
			$sql_where_http_status = ' http_status = %d AND';
			$use_index             = ' USE INDEX (idx_scr_cron)';
		}

		$query_data[]    = Urlslab_Data_Url::SCR_STATUS_NEW;
		$where_status_or = '';

		switch ( $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) ) {
			case DomainDataRetrievalDataRequest::RENEW_FREQUENCY_ONE_TIME:
				break;
			case DomainDataRetrievalDataRequest::RENEW_FREQUENCY_DAILY:
				$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
				$query_data[]    = Urlslab_Data_Url::SCR_STATUS_ACTIVE;
				$query_data[]    = Urlslab_Data::get_now( time() - 86400 );
				break;
			case DomainDataRetrievalDataRequest::RENEW_FREQUENCY_WEEKLY:
				$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
				$query_data[]    = Urlslab_Data_Url::SCR_STATUS_ACTIVE;
				$query_data[]    = Urlslab_Data::get_now( time() - 86400 * 7 );
				break;
			case DomainDataRetrievalDataRequest::RENEW_FREQUENCY_MONTHLY:
				$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
				$query_data[]    = Urlslab_Data_Url::SCR_STATUS_ACTIVE;
				$query_data[]    = Urlslab_Data::get_now( time() - 86400 * 30 );
				break;
			case DomainDataRetrievalDataRequest::RENEW_FREQUENCY_YEARLY:
				$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
				$query_data[]    = Urlslab_Data_Url::SCR_STATUS_ACTIVE;
				$query_data[]    = Urlslab_Data::get_now( time() - 86400 * 365 );
				break;
			default:
				//No schedules, don't update
				return false;
		}
		// PENDING or UPDATING urls will be retried in 12 hours again
		$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
		$query_data[]    = Urlslab_Data_Url::SCR_STATUS_PENDING;
		$query_data[]    = Urlslab_Data::get_now( time() - 12 * 3600 );

		$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
		$query_data[]    = Urlslab_Data_Url::SCR_STATUS_UPDATING;
		$query_data[]    = Urlslab_Data::get_now( time() - 12 * 3600 );

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . $use_index . ' WHERE' . $sql_where_http_status . ' (scr_status = %s' . $where_status_or . ') ORDER BY update_scr_date LIMIT 100', // phpcs:ignore
				$query_data
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$data   = array();
		$data[] = Urlslab_Data::get_now();
		$data[] = Urlslab_Data_Url::SCR_STATUS_ACTIVE;//if active
		$data[] = Urlslab_Data_Url::SCR_STATUS_UPDATING;//or updating
		$data[] = Urlslab_Data_Url::SCR_STATUS_UPDATING;//set updating
		$data[] = Urlslab_Data_Url::SCR_STATUS_PENDING;//else set pending

		$url_names = array();

		$url_objects = array();

		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Data_Url( $row );
			if ( $row_obj->get_url()->is_url_valid() ) {
				$url_objects[] = $row_obj;
				$data[]        = $row['url_id'];
				$url_names[]   = $row['url_name'];
			} else {
				$row_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
				$row_obj->update();
			}
		}

		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . " SET update_scr_date=%s, scr_status = CASE WHEN scr_status=%s OR scr_status=%s THEN %s ELSE %s END WHERE url_id IN (" . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		$request = new DomainDataRetrievalDataRequest();
		$request->setUrls( $url_names );
		$request->setRenewFrequency( $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) );

		try {
			$urlslab_screenshots = $this->client->getSnapshots( $request );
		} catch ( Exception $e ) {
			$urlslab_screenshots = array();
		}

		$some_urls_updated = false;
		foreach ( $urlslab_screenshots as $id => $screenshot ) {
			switch ( $screenshot->getScreenshotStatus() ) {
				case DomainDataRetrievalScreenshotResponse::SCREENSHOT_STATUS_REDIRECTED:
				case DomainDataRetrievalScreenshotResponse::SCREENSHOT_STATUS_BLOCKED:
					$url_objects[ $id ]->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
					$url_objects[ $id ]->update();
					break;

				case DomainDataRetrievalScreenshotResponse::SCREENSHOT_STATUS_AVAILABLE:
					$url_objects[ $id ]->set_urlslab_domain_id( $screenshot->getDomainId() );
					$url_objects[ $id ]->set_urlslab_url_id( $screenshot->getUrlId() );
					$url_objects[ $id ]->set_urlslab_scr_timestamp( $screenshot->getScreenshotId() );
					$url_objects[ $id ]->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ACTIVE );
					$url_objects[ $id ]->update();
					$some_urls_updated = true;
					break;

				case DomainDataRetrievalScreenshotResponse::SCREENSHOT_STATUS_PENDING:
					$url_objects[ $id ]->set_scr_status( Urlslab_Data_Url::SCR_STATUS_PENDING );
					$url_objects[ $id ]->update();
					break;

				case DomainDataRetrievalScreenshotResponse::SCREENSHOT_STATUS_UPDATING:
					$url_objects[ $id ]->set_urlslab_domain_id( $screenshot->getDomainId() );
					$url_objects[ $id ]->set_urlslab_url_id( $screenshot->getUrlId() );
					$url_objects[ $id ]->set_urlslab_scr_timestamp( $screenshot->getScreenshotId() );
					$url_objects[ $id ]->set_scr_status( Urlslab_Data_Url::SCR_STATUS_UPDATING );
					$url_objects[ $id ]->update();
					break;

				default:
					// we will leave object in the status pending
			}
		}

		return $some_urls_updated;    // 100 URLs per execution is enought if there was no url updated
	}

	private function init_client(): bool {
		if ( empty( $this->client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key      = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config       = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->client = new SnapshotApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->client );
	}
}
