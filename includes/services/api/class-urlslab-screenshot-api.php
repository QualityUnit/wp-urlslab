<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';

/**
 * Urlslab Service Interface
 *
 * For Intergation with URLSLAB Services
 */
class Urlslab_Screenshot_Api extends Urlslab_Api {

	public function schedule_batch( array $scheduling_urls ) {
		$url = $this->base_url . '/batch/screenshot';

		$response = $this->urlslab_get_response(
			$url,
			new Urlslab_Screenshot_Batch_Request( $scheduling_urls ) 
		);

		if ( 200 == $response[0] ) {
			$returning_obj = array();
			foreach ( json_decode( $response[1] ) as $result_obj ) {
				$returning_obj[] = new Urlslab_Screenshot_Response(
					$result_obj['urlName'],
					$result_obj['domainId'],
					$result_obj['urlId'],
					$result_obj['screenshotDate'],
					$result_obj['urlTitle'],
					$result_obj['screenshotStatus']
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

