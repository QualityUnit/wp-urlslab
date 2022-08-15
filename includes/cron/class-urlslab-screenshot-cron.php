<?php

class Urlslab_Screenshot_Cron {

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->url_data_fetcher = $url_data_fetcher;
	}

	public function urlslab_cron_exec() {
		global $wpdb;
		$start_time = time();
		while ( true ) {
			$schedules = $this->url_data_fetcher->fetch_scheduling_urls();

			try {
				if ( $schedules ) {
					$this->handle_schedules( $schedules );
				}
			} catch ( Exception $e ) {
				urlslab_debug_log( $e );
				break;
			}


			if ( count( $schedules ) < 100 or ( time() - $start_time > 10 ) ) {
				break;
			}
		}
	}

	/**
	 * @param Urlslab_Url[] $schedules
	 *
	 * @return void
	 * @throws Exception
	 */
	private function handle_schedules( array $schedules ) {
		$rsp = $this->url_data_fetcher->schedule_urls_batch( $schedules );


		if ( ! empty( $rsp ) ) {
			$new_status_urls = array();
			foreach ( $schedules as $i => $schedule ) {
				$new_status_urls[] = $rsp[ $i ];
			}
			$this->url_data_fetcher->save_urls_batch( $new_status_urls );
		}
	}

}
