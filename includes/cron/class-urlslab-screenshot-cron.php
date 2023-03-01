<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshot_Cron extends Urlslab_Cron {
	private Urlslab_Screenshot_Api $api;

	public function __construct() {
		parent::__construct();

		$this->api = new Urlslab_Screenshot_Api();
	}

	protected function execute(): bool {
		try {
			$schedules = $this->fetch_scheduling_urls();
			if ( $schedules ) {
				if ( ! $this->handle_schedules( $schedules ) ) {
					return false;
				}

				return 100 === count( $schedules );
			}
		} catch ( Exception $e ) {
			$this->debug_log( $e );
		}

		return false;
	}


	/**
	 * @return Urlslab_Url[]
	 */
	public function fetch_scheduling_urls(): array {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;


		if ( $this->api->has_api_key() ) {

			$urls = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . // phpcs:ignore
					' WHERE (status = %s) or (updateStatusDate < %s AND status = %s) or (updateStatusDate < %s AND status = %s)
or (updateStatusDate < %s AND status = %s)
				ORDER BY updateStatusDate ASC LIMIT 100',
					Urlslab_Url_Row::STATUS_NEW,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 month' ) ),
					Urlslab_Url_Row::STATUS_BLOCKED,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Url_Row::STATUS_PENDING,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Url_Row::STATUS_RECURRING_UPDATE
				),
				ARRAY_A
			);
		} else {
			$urls = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . // phpcs:ignore
					' WHERE (status = %s) or (updateStatusDate < %s AND status = %s)
or (updateStatusDate < %s AND status = %s)
				ORDER BY updateStatusDate ASC LIMIT 100',
					Urlslab_Url_Row::STATUS_NEW,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Url_Row::STATUS_PENDING,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Url_Row::STATUS_RECURRING_UPDATE
				),
				ARRAY_A
			);
		}

		//# updating the date
		$res = array();
		if ( is_array( $urls ) && count( $urls ) > 0 ) {
			foreach ( $urls as $url_row ) {
				try {
					$res[] = ( new Urlslab_Url_Row( $url_row ) )->get_url();
				} catch ( Exception $e ) {
				}
			}
		}

		return $res;
	}


	/**
	 * @param Urlslab_Url[] $schedules
	 *
	 * @return void
	 * @throws Exception
	 */
	private function handle_schedules( array $schedules ): bool {
		$rsp = $this->schedule_urls_batch( $schedules );

		if ( ! empty( $rsp ) ) {
			$new_status_urls = array();
			foreach ( $schedules as $i => $schedule ) {
				if ( isset( $rsp[ $i ] ) ) {
					$new_status_urls[] = $rsp[ $i ];
				}
			}
			$this->save_urls_batch( $new_status_urls );

			return true;
		}

		return false;
	}


	/**
	 * @param Urlslab_Url_Row[] $urls
	 *
	 * @return void
	 */
	public function save_urls_batch( array $urls ) {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		$values      = array();
		$placeholder = array();
		foreach ( $urls as $url ) {
			if ( ! is_null( $url ) ) {
				array_push(
					$values,
					$url->get_url()->get_url_id(),
					$url->get_url()->get_url(),
					$url->get( 'status' ),
					$url->get( 'domainId' ),
					$url->get( 'urlId' ),
					$url->get( 'screenshotDate' ),
					Urlslab_Data::get_now(),
					$url->get( 'urlTitle' ),
					$url->get( 'urlMetaDescription' ),
					$url->get( 'urlSummary' ),
				);
				$placeholder[] = '(%d, %s, %s, %s, %s, %d, %s, %s, %s, %s)';
			}
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query       = "INSERT INTO $table (urlMd5, urlName, status, domainId, urlId, screenshotDate, updateStatusDate, urlTitle, urlMetaDescription, urlSummary) VALUES $placeholder_string
                   ON DUPLICATE KEY UPDATE
                   urlName = VALUES(urlName),
                   status = VALUES(status),
                   domainId = VALUES(domainId),
                   urlId = VALUES(urlId),
                   domainId = VALUES(domainId),
                   screenshotDate = VALUES(screenshotDate),
                   updateStatusDate = VALUES(updateStatusDate),
                   urlTitle = VALUES(urlTitle),
                   urlMetaDescription = VALUES(urlMetaDescription),
                   urlSummary = VALUES(urlSummary)";

		$wpdb->query(
			$wpdb->prepare(
				$update_query, // phpcs:ignore
				$values
			)
		);
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return Urlslab_Url_Row[]
	 * @throws Exception
	 */
	public function schedule_urls_batch( array $urls ): array {
		$grouped_urls = $this->filter_schedules_batch( $urls );
		$scheduled    = array();

		if ( $this->api->has_api_key() ) {
			$scheduling_urls = array_merge(
				$grouped_urls['main_page_urls'],
				$grouped_urls['possibly_blocked_urls'],
			);
		} else {
			//# Getting main page url schedules
			$scheduling_urls = $grouped_urls['main_page_urls'];
			foreach ( $grouped_urls['possibly_blocked_urls'] as $possibly_blocked ) {
				$scheduled[ $possibly_blocked->get_url_id() ] = new Urlslab_Url_Row(
					array(
						'urlName' => $possibly_blocked->get_url(),
						'status'  => Urlslab_Url_Row::STATUS_BLOCKED,
					),
					false
				);
			}
		}
		try {
			$schedule_response = $this->api->schedule_batch( $scheduling_urls );
			foreach ( $scheduling_urls as $i => $schedule ) {
				$scheduled[ $schedule->get_url_id() ] = $schedule_response[ $i ];
			}
		} catch ( Exception $e ) {
			$this->debug_log( $e );

			return array();
		}
		foreach ( $grouped_urls['not_crawling_urls'] as $broken_url ) {
			$scheduled[ $broken_url->get_url_id() ] = new Urlslab_Url_Row(
				array(
					'urlName' => $broken_url->get_url(),
					'status'  => Urlslab_Url_Row::STATUS_BLOCKED,
				),
				false
			);
		}
		$returning_data = array();
		foreach ( $urls as $url ) {
			if ( isset( $scheduled[ $url->get_url_id() ] ) ) {
				$returning_data[] = $scheduled[ $url->get_url_id() ];
			}
		}

		return $returning_data;
	}

	private function debug_log( Exception $e ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			@error_log( $e->getTraceAsString(), 3, URLSLAB_PLUGIN_LOG );
			// phpcs:enable
		}
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return array
	 */
	private function filter_schedules_batch( array $urls ) {
		$not_crawling_urls     = array();
		$main_page_urls        = array();
		$possibly_blocked_urls = array();
		foreach ( $urls as $url ) {
			if ( ! $url->is_url_valid() ) {
				$not_crawling_urls[] = $url;
				continue;
			}

			if ( $url->is_main_page() ) {
				$main_page_urls[] = $url;
				continue;
			}

			$possibly_blocked_urls[] = $url;
		}

		return array(
			'not_crawling_urls'     => $not_crawling_urls,
			'main_page_urls'        => $main_page_urls,
			'possibly_blocked_urls' => $possibly_blocked_urls,
		);
	}

}
