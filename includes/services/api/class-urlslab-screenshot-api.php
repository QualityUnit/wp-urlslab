<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/urlslab-api-model.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-batch-request.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-response.php';
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
				$returning_obj[] = new Urlslab_Screenshot_Response(
					$result_obj->domainId, // phpcs:ignore
					$result_obj->urlId, // phpcs:ignore
					$result_obj->screenshotDate, // phpcs:ignore
					$result_obj->urlTitle, // phpcs:ignore
					$result_obj->screenshotStatus // phpcs:ignore
				);
			}

			return $returning_obj;
		} else if ( 400 == $response[0] ) {
			return new Urlslab_Screenshot_Error_Response(
				$response[1]['errorType'],
				$response[1]['errorMsg']
			);
		}

		return '';
	}

}

