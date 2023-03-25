<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshot_Schedules_Cron extends Urlslab_Cron {
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

	protected function execute(): bool {
		if (
			! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Screenshot_Widget::SLUG ) ||
			! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Screenshot_Widget::SLUG )->get_option( Urlslab_Screenshot_Widget::SETTING_NAME_SCHEDULE_SCREENSHOTS )
		) {
			return false;
		}

		if ( ! $this->init_client() ) {
			return false;
		}

		global $wpdb;

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE scr_schedule = %s LIMIT 50', // phpcs:ignore
				Urlslab_Url_Row::SCR_SCHEDULE_NEW
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			return false;
		}


		$urls    = array();
		$url_ids = array();
		foreach ( $url_rows as $row ) {
			$url_ids[] = $row['url_id'];
			$urls[]    = $row['url_name'];
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

				$wpdb->query(
					$wpdb->prepare(
						'UPDATE ' . URLSLAB_URLS_TABLE . ' SET scr_schedule = %s WHERE url_name IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', // phpcs:ignore
						Urlslab_Url_Row::SCR_SCHEDULE_SCHEDULED,
						...$url_ids
					)
				);
			} catch ( \OpenAPI\Client\ApiException $e ) {
				$wpdb->query(
					$wpdb->prepare(
						'UPDATE ' . URLSLAB_URLS_TABLE . ' SET scr_schedule = %s WHERE url_name IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', // phpcs:ignore
						Urlslab_Url_Row::SCR_SCHEDULE_ERROR,
						...$url_ids
					)
				);

				return false;
			}
		} catch ( Exception $e ) {
			return false;
		}

		return true;
	}

	public function get_description(): string {
		return __( 'Schedule URLs found in screenshot shortcode to URLslab', 'urlslab' );
	}
}
