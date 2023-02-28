<?php

/**
 * Urlslab Service Interface
 *
 * For Intergation with URLSLAB Services
 */
class Urlslab_Screenshot_Api extends Urlslab_Api {

	/**
	 * @param array $scheduling_urls
	 *
	 * @return Urlslab_Url[]
	 * @throws Exception
	 */
	public function schedule_batch( array $scheduling_urls ) {
		$url = $this->base_url . 'screenshots/batch';

		$batch    = new Urlslab_Screenshot_Batch_Request( $scheduling_urls );
		$response = $this->urlslab_post_response(
			$url,
			$batch->to_json()
		);

		if ( 200 == $response[0] ) {
			$returning_obj = array();
			foreach ( json_decode( $response[1] ) as $result_obj ) {
				$returning_obj[] = new Urlslab_Url_Row(
					array(
						'domainId'           => $result_obj->domainId, // phpcs:ignore
						'urlId'              => $result_obj->urlId, // phpcs:ignore
						'screenshotDate'     => $result_obj->screenshotDate, // phpcs:ignore
						'urlTitle'           => $result_obj->urlTitle, // phpcs:ignore
						'urlMetaDescription' => $result_obj->urlMetaDescription, // phpcs:ignore
						'urlSummary'         => $result_obj->urlSummary, // phpcs:ignore
						'status'             => $this->convert_status_to_char( $result_obj->screenshotStatus ), // phpcs:ignore
					)
				);
			}

			return $returning_obj;
		} else if ( 429 == $response[0] ) {
			throw new Exception( 'Rate limit reached' );
		} else {
			throw new Exception( 'Server Error' );
		}
	}

	private function convert_status_to_char( string $status ): string {
		switch ( $status ) {
			case 'AWAITING_PENDING':
				return Urlslab_Url_Row::STATUS_PENDING;
			case 'AVAILABLE':
				return Urlslab_Url_Row::STATUS_ACTIVE;
			case 'NOT_CRAWLING_URL':
				return Urlslab_Url_Row::STATUS_BROKEN;
			case 'AWAITING_UPDATE':
				return Urlslab_Url_Row::STATUS_RECURRING_UPDATE;
			case 'BLOCKED':
				return Urlslab_Url_Row::STATUS_BLOCKED;
			default:
				return Urlslab_Url_Row::STATUS_NEW;
		}
	}

}
