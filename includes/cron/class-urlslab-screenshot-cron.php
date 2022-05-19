<?php

class Urlslab_Screenshot_Cron {
	public function urlslab_cron_exec() {
		global $wpdb;

		$table = $wpdb->prefix . 'urlslab_screenshot';

		while ( true ) {
			$schedules = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . // phpcs:ignore
					' WHERE (status = %s) or (UNIX_TIMESTAMP(updateStatusDate) + 3600 < %d AND status = %s) 
or (UNIX_TIMESTAMP(updateStatusDate) + 3600 < %d AND status = %s)
				ORDER BY updateStatusDate ASC LIMIT 100',
					Urlslab::$link_status_not_scheduled,
					time(),
					Urlslab::$link_status_waiting_for_screenshot,
					time(),
					Urlslab::$link_status_waiting_for_update
				),
				'ARRAY_A'
			);

			if ( $schedules ) {
				$this->handle_schedules( $schedules );
			}

			if ( count( $schedules ) < 100 ) {
				break;
			}
		}
	}

	private function handle_schedules( $schedules ) {
		$urlslab_screenshot = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-screenshot' );
		$request_body = array();
		foreach ( $schedules as $schedule ) {
			array_push( $request_body, $schedule['urlName'] );
		}
		$rsp = $urlslab_screenshot->schedule_batch_urls( $request_body );
		if ( ! empty( $rsp ) ) {
			foreach ( $schedules as $i => $schedule ) {
				$this->save_new_schedule_status( $rsp[ $i ], md5( $schedule['urlName'] ) );
			}
		}
	}

	private function save_new_schedule_status( $urlslab_screenshot, $url_md5_hash ) {
		global $wpdb;

		$table = $wpdb->prefix . 'urlslab_screenshot';
		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . $table . // phpcs:ignore
				' SET status = %s, updateStatusDate = %s, screenshotDate = %d, domainId = %s, urlId = %s, urlTitle = %s 
				WHERE urlMd5 = %s',
				$urlslab_screenshot->get_screenshot_status(),
				gmdate( 'Y-m-d H:i:s' ),
				$urlslab_screenshot->get_screenshot_date(),
				$urlslab_screenshot->get_domain_id(),
				$urlslab_screenshot->get_url_id(),
				$urlslab_screenshot->get_url_title(),
				$url_md5_hash
			)
		);

	}

}
