<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/urlslab-api-model.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-batch-request.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-url-data-response.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-error-response.php';

/**
 * Urlslab Service Interface
 *
 * For Intergation with URLSLAB Services
 */
class Urlslab_Screenshot_Api extends Urlslab_Api {

	public function schedule_batch( array $scheduling_urls ) {
		$url = $this->base_url . 'screenshots/batch';

		$batch = new Urlslab_Screenshot_Batch_Request( $scheduling_urls );
		$response = $this->urlslab_post_response(
			$url,
			$batch->to_json()
		);

		if ( 200 == $response[0] ) {
			$returning_obj = array();
			foreach ( json_decode( $response[1] ) as $result_obj ) {
				$returning_obj[] = new Urlslab_Url_Data_Response(
					$result_obj->domainId, // phpcs:ignore
					$result_obj->urlId, // phpcs:ignore
					$result_obj->screenshotDate, // phpcs:ignore
					$result_obj->urlTitle, // phpcs:ignore
					$result_obj->urlMetaDescription, // phpcs:ignore
					$result_obj->urlSummary, // phpcs:ignore
					$this->convert_status_to_char( $result_obj->screenshotStatus ) // phpcs:ignore
				);
			}

			return $returning_obj;
		} else if ( 400 == $response[0] ) {
			return new Urlslab_Screenshot_Error_Response(
				$response[1]['errorType'],
				$response[1]['errorMsg']
			);
		} else if ( 429 == $response[0] ) {
			throw new Exception( 'Rate limit reached' );
		}

		return '';
	}

	private function convert_status_to_char( string $status ): string {
		switch ( $status ) {
			case 'AWAITING_PENDING':
				return Urlslab_Status::$pending;

			case 'AVAILABLE':
				return Urlslab_Status::$available;

			case 'NOT_CRAWLING_URL':
				return Urlslab_Status::$not_crawling;

			case 'AWAITING_UPDATE':
				return Urlslab_Status::$recurring_update;

			case 'BLOCKED':
				return Urlslab_Status::$blocked;

			default:
				return Urlslab_Status::$not_scheduled;
		}
	}

}

