<?php

class Urlslab_Screenshot_Cron {

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->url_data_fetcher = $url_data_fetcher;
	}

	public function urlslab_cron_exec() {
		$start_time = time();
		while ( true ) {
			$schedules = $this->url_data_fetcher->fetch_scheduling_urls();

			try {
				if ( $schedules ) {
					$this->handle_schedules( $schedules );
				}           
			} catch ( Exception $e ) {
				break;
			}


			if ( count( $schedules ) < 100 or ( time() - $start_time > 30 ) ) {
				break;
			}
		}
	}

	private function handle_schedules( array $schedules ) {
		$request_body = array();
		foreach ( $schedules as $schedule ) {
			$request_body[] = $schedule->get_url()->get_url();
		}
		$rsp = $this->url_data_fetcher->schedule_urls_batch( $request_body );
		if ( ! empty( $rsp ) ) {
			$new_status_urls = array();
			foreach ( $schedules as $i => $schedule ) {
				$new_status_urls[] = $rsp[ $i ]->to_url_data( $schedule->get_url()->get_url_id() );
			}
			$this->url_data_fetcher->save_urls_batch( $new_status_urls );
		}
	}

}
