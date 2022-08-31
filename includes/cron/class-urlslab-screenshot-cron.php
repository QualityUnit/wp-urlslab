<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshot_Cron extends Urlslab_Cron {

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->url_data_fetcher = $url_data_fetcher;
		parent::__construct();
	}

	protected function execute(): bool {
		try {
			$schedules = $this->url_data_fetcher->fetch_scheduling_urls();
			if ( $schedules ) {
				if ( ! $this->handle_schedules( $schedules ) ) {
					return false;
				}
				return 100 === count( $schedules );
			}
		} catch ( Exception $e ) {
			urlslab_debug_log( $e );
		}
		return false;
	}

	/**
	 * @param Urlslab_Url[] $schedules
	 *
	 * @return void
	 * @throws Exception
	 */
	private function handle_schedules( array $schedules ): bool {
		$rsp = $this->url_data_fetcher->schedule_urls_batch( $schedules );

		if ( ! empty( $rsp ) ) {
			$new_status_urls = array();
			foreach ( $schedules as $i => $schedule ) {
				if ( isset( $rsp[ $i ] ) ) {
					$new_status_urls[] = $rsp[ $i ];
				}
			}
			$this->url_data_fetcher->save_urls_batch( $new_status_urls );
			return true;
		}

		return false;
	}

}
