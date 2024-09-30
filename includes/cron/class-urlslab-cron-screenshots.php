<?php


use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\ImagesApi;
use FlowHunt_Vendor\OpenAPI\Client\Model\ScreenshotRequest;
use FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus;

class Urlslab_Cron_Screenshots extends Urlslab_Cron {
	private ImagesApi $client;

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

		if ( (int) ( $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) ) > 0 ) {
			$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
			$query_data[]    = Urlslab_Data_Url::SCR_STATUS_ACTIVE;
			$query_data[]    = Urlslab_Data::get_now( time() - (int) ( $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL ) ) );
		} else {
			return false;
		}
		// PENDING or UPDATING urls will be retried in 12 hours again
		$where_status_or .= ' OR (scr_status =%s AND update_scr_date < %s)';
		$query_data[]    = Urlslab_Data_Url::SCR_STATUS_PENDING;
		$query_data[]    = Urlslab_Data::get_now( time() - 3600 );

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

		$some_urls_updated = false;

		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Data_Url( $row );
			if ( $row_obj->get_url()->is_url_valid() && ! $row_obj->get_url()->is_blacklisted() ) {
				$row_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_PENDING );
				$row_obj->update();
				$request = new ScreenshotRequest();
				$request->setUrl( $row_obj->get_url()->get_url_with_protocol() );
				$validity = new DateTime( 'now' );
				$validity->sub( new DateInterval( 'P1Y' ) );
				$request->setValidity( $validity ); //phpcs:ignore
				try {
					$result = $this->client->getScreenshot( Urlslab_Connection_FlowHunt::get_workspace_id(), $request );
					$some_urls_updated = true;
				} catch ( Exception $e ) {
					$this->lock( 300, Urlslab_Cron::LOCK );
					return false;
				}
				switch ( $result->getStatus() ) {
					case TaskStatus::SUCCESS:
						$row_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ACTIVE );
						$row_obj->set_urlslab_scr_timestamp( $result->getTimestamp() );
						$row_obj->set_urlslab_domain_id( $result->getDomainId() );
						$row_obj->set_urlslab_url_id( $result->getUrlId() );
						break;
					case TaskStatus::FAILURE:
					case TaskStatus::IGNORED:
					case TaskStatus::REJECTED:
						$row_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
						break;
					default:
				}
				$row_obj->update();
			} else {
				$row_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
				$row_obj->update();
			}
		}


		return $some_urls_updated;    // 100 URLs per execution is enought if there was no url updated
	}

	private function init_client(): bool {
		if ( empty( $this->client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			$this->client = new ImagesApi( new Client(), Urlslab_Connection_FlowHunt::get_configuration() );
		}

		return ! empty( $this->client );
	}
}
