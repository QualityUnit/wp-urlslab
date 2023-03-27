<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Url_Scheduling_Cron extends Urlslab_Cron {
	private \OpenAPI\Client\Urlslab\ScheduleApi $client;

	public function __construct() {
		parent::__construct();
	}

	private function init_client(): bool {
		if ( empty( $this->client ) ) {
			$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			if ( strlen( $api_key ) ) {
				$config       = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
				$this->client = new \OpenAPI\Client\Urlslab\ScheduleApi( new GuzzleHttp\Client(), $config );
			}
		}

		return ! empty( $this->client );
	}


	private function get_rows( string $schedule_type ): array {
		global $wpdb;

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE scr_schedule=%s LIMIT 50', // phpcs:ignore
				$schedule_type
			),
			ARRAY_A
		);
		if ( ! is_array( $url_rows ) ) {
			return array();
		}

		return $url_rows;
	}

	private function update_rows( $url_ids, $new_status ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			return true;
		}

		return $wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . URLSLAB_URLS_TABLE . ' SET scr_schedule=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', // phpcs:ignore
				array_merge( array( $new_status ), $url_ids )
			)
		);
	}

	private function schedule_screenshots() {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Screenshot_Widget::SLUG ) || ! $this->init_client() ) {
			return false;
		}

		$url_rows = $this->get_rows( Urlslab_Url_Row::URL_SCHEDULE_SCREENSHOT_REQUIRED );

		$urls    = array();
		$url_ids = array();
		foreach ( $url_rows as $row ) {
			$url_ids[] = $row['url_id'];
			$urls[]    = $row['url_name'];
		}

		if ( empty( $url_ids ) ) {
			return false;
		}

		try {
			try {
				$config = new \OpenAPI\Client\Model\DomainScheduleScheduleConf();
				$config->setUrls( $urls );
				$config->setTakeScreenshot( true );
				$config->setScanFrequency( \OpenAPI\Client\Model\DomainScheduleScheduleConf::SCAN_FREQUENCY_ONE_TIME );
				$config->setScanSpeedPerMinute( 20 );
				$config->setFetchText( true );
				$config->setLinkFollowingStrategy( \OpenAPI\Client\Model\DomainScheduleScheduleConf::LINK_FOLLOWING_STRATEGY_NO_LINK );
				$config->setAllSitemaps( false );
				$config->setSitemaps( array() );
				$this->client->createSchedule( $config );

				$this->update_rows( $url_ids, Urlslab_Url_Row::URL_SCHEDULE_SCREENSHOT_SCHEDULED );
			} catch ( \OpenAPI\Client\ApiException $e ) {
				$this->update_rows( $url_ids, Urlslab_Url_Row::URL_SCHEDULE_ERROR );

				return false;
			}
		} catch ( Exception $e ) {
			return false;
		}

		return true;
	}

	private function schedule_summaries() {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Link_Enhancer::SLUG ) || ! $this->init_client() ) {
			return false;
		}

		$url_rows = $this->get_rows( Urlslab_Url_Row::URL_SCHEDULE_SUMMARIZATION_REQUIRED );

		$urls    = array();
		$url_ids = array();
		foreach ( $url_rows as $row ) {
			$url_ids[] = $row['url_id'];
			$urls[]    = $row['url_name'];
		}

		if ( empty( $url_ids ) ) {
			return false;
		}

		try {
			try {
				$config = new \OpenAPI\Client\Model\DomainScheduleScheduleConf();
				$config->setUrls( $urls );
				$config->setTakeScreenshot( false );
				$config->setScanFrequency( \OpenAPI\Client\Model\DomainScheduleScheduleConf::SCAN_FREQUENCY_ONE_TIME );
				$config->setScanSpeedPerMinute( 20 );
				$config->setFetchText( true );
				$config->setLinkFollowingStrategy( \OpenAPI\Client\Model\DomainScheduleScheduleConf::LINK_FOLLOWING_STRATEGY_NO_LINK );
				$config->setAllSitemaps( false );
				$config->setSitemaps( array() );
				$this->client->createSchedule( $config );

				$this->update_rows( $url_ids, Urlslab_Url_Row::URL_SCHEDULE_SUMMARIZATION_SCHEDULED );
			} catch ( \OpenAPI\Client\ApiException $e ) {
				$this->update_rows( $url_ids, Urlslab_Url_Row::URL_SCHEDULE_ERROR );

				return false;
			}
		} catch ( Exception $e ) {
			return false;
		}

		return true;
	}

	protected function execute(): bool {
		return $this->schedule_screenshots() || $this->schedule_summaries();
	}

	public function get_description(): string {
		return __( 'Scheduling URLs to URLslab', 'urlslab' );
	}
}
