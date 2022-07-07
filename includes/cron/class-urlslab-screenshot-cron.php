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

	/**
	 * @param Urlslab_Url_Data[] $schedules
	 *
	 * @return void
	 * @throws Exception
	 */
	private function handle_schedules( array $schedules ) {
		$request_body = array();
		$valid_schedules = array();
		$broken_urls = array();
		foreach ( $schedules as $schedule ) {
			if ( $schedule->get_url()->is_url_valid() ) {
				$request_body[] = $schedule->get_url()->get_url();
				$valid_schedules[] = $schedule;
			} else {
				$broken_urls[] = $schedule->get_url();
			}
		}
		$rsp = $this->url_data_fetcher->schedule_urls_batch( $request_body );



		if ( ! empty( $rsp ) ) {
			$new_status_urls = array();
			foreach ( $valid_schedules as $i => $valid_schedule ) {
				$new_status_urls[] = $rsp[ $i ]->to_url_data( $valid_schedule->get_url() );
			}
			if ( ! empty( $broken_urls ) ) {
				foreach ( $broken_urls as $broken_url ) {
					$new_status_urls[] = new Urlslab_Url_Data(
						$broken_url,
						null,
						null,
						null,
						time(),
						null,
						null,
						null,
						Urlslab::$link_status_broken
					);
				}
			}
			$this->url_data_fetcher->save_urls_batch( $new_status_urls );
		}
	}

}
