<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-data.php';

/**
 * Manages all operation about URL Details
 */
class Urlslab_Url_Data_Fetcher {
	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	public function __construct( ?Urlslab_Screenshot_Api $urlslab_screenshot_api ) {
		if ( isset( $urlslab_screenshot_api ) ) {
			$this->urlslab_screenshot_api = $urlslab_screenshot_api;
		}
	}

	/**
	 * @param array $row
	 *
	 * @return Urlslab_Url_Data
	 */
	private function transform( array $row ): Urlslab_Url_Data {
		return new Urlslab_Url_Data(
			new Urlslab_Url( parse_url( get_site_url(), PHP_URL_SCHEME ) . '://' . $row['urlName'] ),
			$row['domainId'],
			$row['urlId'],
			$row['screenshotDate'],
			$row['updateStatusDate'],
			$row['urlTitle'],
			$row['urlMetaDescription'],
			$row['urlSummary'],
			$row['status'],
			$row['visibility'],
		);
	}

	/**
	 * @return Urlslab_Url[]
	 */
	public function fetch_scheduling_urls(): array {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		if ( $this->urlslab_screenshot_api->has_api_key() ) {

			$schedules = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . // phpcs:ignore
					' WHERE (status = %s) or (updateStatusDate < %d AND status = %s) or (updateStatusDate < %d AND status = %s)
or (updateStatusDate < %d AND status = %s)
				ORDER BY updateStatusDate ASC LIMIT 100',
					Urlslab_Status::$not_scheduled,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Status::$blocked,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Status::$pending,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Status::$recurring_update
				),
				ARRAY_A
			);
		} else {
			$schedules = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . $table . // phpcs:ignore
					' WHERE (status = %s) or (updateStatusDate < %d AND status = %s)
or (updateStatusDate < %d AND status = %s)
				ORDER BY updateStatusDate ASC LIMIT 100',
					Urlslab_Status::$not_scheduled,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Status::$pending,
					gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
					Urlslab_Status::$recurring_update
				),
				ARRAY_A
			);
		}

		//# updating the date
		$res = array();
		if ( is_array( $schedules ) && count( $schedules ) > 0 ) {
			$values = array();
			$placeholder = array();
			foreach ( $schedules as $schedule ) {
				$res[] = $this->transform( $schedule )->get_url();
				array_push(
					$values,
					$schedule['urlMd5'],
					strtotime( gmdate( 'Y-m-d H:i:s' ) ),
				);
				$placeholder[] = '(%s, %d)';
			}

			$placeholder_string = implode( ', ', $placeholder );
			$update_query = "INSERT INTO $table (
                   urlMd5,
                   updateStatusDate
                   ) VALUES
                   $placeholder_string
                   ON DUPLICATE KEY UPDATE
                   updateStatusDate = VALUES(updateStatusDate)";

			$wpdb->query(
				$wpdb->prepare(
					$update_query, // phpcs:ignore
					$values
				)
			);
		}
		//# updating the date

		return $res;
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return bool
	 */
	public function mark_as_broken_batch( array $urls ): bool {
		if ( empty( $urls ) ) {
			return true;
		}

		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		$values = array();
		$placeholder = array();
		foreach ( $urls as $url ) {
			array_push(
				$values,
				$url->get_url_id(),
				$url->get_url(),
				Urlslab_Status::$not_crawling,
			);
			$placeholder[] = '(%s, %s, %s)';
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query = "INSERT IGNORE INTO $table (
                   urlMd5,
                   urlName,
                   status) VALUES
                   $placeholder_string";

		return $wpdb->query(
			$wpdb->prepare(
				$update_query, // phpcs:ignore
				$values
			)
		);
	}


	/**
	 * @param Urlslab_Url $url
	 *
	 * @return void
	 * @throws Exception
	 */
	public function schedule_url( Urlslab_Url $url ) {
		$this->schedule_urls_batch( array( $url ) );
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return Urlslab_Url_Data[]
	 * @throws Exception
	 */
	public function schedule_urls_batch( array $urls ): array {
		$grouped_urls = $this->filter_schedules_batch( $urls );
		$scheduled = array();
		if ( $this->urlslab_screenshot_api->has_api_key() ) {
			$scheduling_urls = array_merge(
				$grouped_urls['main_page_urls'],
				$grouped_urls['possibly_blocked_urls'],
			);
		} else {
			//# Getting main page url schedules
			$scheduling_urls = $grouped_urls['main_page_urls'];
			foreach ( $grouped_urls['possibly_blocked_urls'] as $possibly_blocked ) {
				$scheduled[ $possibly_blocked->get_url_id() ] = Urlslab_Url_Data::empty(
					$possibly_blocked,
					Urlslab_Status::$blocked
				);
			}
		}
		try {
			$schedule_response = $this->urlslab_screenshot_api->schedule_batch( $scheduling_urls );
			foreach ( $scheduling_urls as $i => $schedule ) {
				$scheduled[ $schedule->get_url_id() ] = $schedule_response[ $i ]->to_url_data( $schedule );
			}
		} catch ( Exception $e ) {
			urlslab_debug_log( $e );
		}
		foreach ( $grouped_urls['blocked_urls'] as $blocked_url ) {
			$scheduled[ $blocked_url->get_url_id() ] = Urlslab_Url_Data::empty(
				$blocked_url,
				Urlslab_Status::$blocked
			);
		}
		foreach ( $grouped_urls['not_crawling_urls'] as $broken_url ) {
			$scheduled[ $broken_url->get_url_id() ] = Urlslab_Url_Data::empty(
				$broken_url,
				Urlslab_Status::$not_crawling
			);
		}
		$returning_data = array();
		foreach ( $urls as $url ) {
			$returning_data[] = $scheduled[ $url->get_url_id() ];
		}

		return $returning_data;
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return array
	 */
	private function filter_schedules_batch( array $urls ) {
		$not_crawling_urls = array();
		$main_page_urls = array();
		$blocked_urls = array();
		$possibly_blocked_urls = array();
		foreach ( $urls as $url ) {
			if ( ! $url->is_url_valid() || $url->is_url_blacklisted() ) {
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
			'not_crawling_urls' => $not_crawling_urls,
			'main_page_urls' => $main_page_urls,
			'blocked_urls' => $blocked_urls,
			'possibly_blocked_urls' => $possibly_blocked_urls,
		);
	}

	/**
	 * @param Urlslab_Url_Data_Response $url
	 *
	 * @return void
	 */
	public function save_url( Urlslab_Url_Data_Response $url ) {
		$this->save_urls_batch( array( $url ) );
	}

	/**
	 * @param array $urls
	 *
	 * @return void
	 */
	public function save_urls_batch( array $urls ) {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		$values = array();
		$placeholder = array();
		foreach ( $urls as $url ) {
			if ( ! is_null( $url ) ) {
				array_push(
					$values,
					$url->get_url()->get_url_id(),
					$url->get_url()->get_url(),
					$url->get_screenshot_status(),
					$url->get_domain_id(),
					$url->get_url_id(),
					$url->get_screenshot_date(),
					gmdate( 'Y-m-d H:i:s' ),
					$url->get_url_title(),
					$url->get_url_meta_description(),
					$url->get_url_summary(),
				);
				$placeholder[] = '(%s, %s, %s, %s, %s, %d, %s, %s, %s, %s)';
			}
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query = "INSERT INTO $table (
                   urlMd5,
                   urlName,
                   status,
                   domainId,
                   urlId,
                   screenshotDate,
                   updateStatusDate,
                   urlTitle,
                   urlMetaDescription,
                   urlSummary) VALUES
                   $placeholder_string
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
	 * @param Urlslab_Url $url
	 *
	 * @return mixed
	 */
	public function fetch_schedule_url( Urlslab_Url $url ) {
		$array = $this->fetch_schedule_urls_batch( array( $url ) );
		return reset( $array );
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return array
	 */
	public function fetch_schedule_urls_batch( $urls ): ?array {
		if ( empty( $urls ) ) {
			return null;
		}

		$valid_urls = array();
		$broken_urls = array();
		foreach ( $urls as $url ) {
			if ( $url->is_url_valid() ) {
				$valid_urls[] = $url;
			} else {
				$broken_urls[] = $url;
			}
		}

		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$placeholders = implode( ', ', array_fill( 0, count( $valid_urls ), '%s' ) );
		$url_hashes = array();
		foreach ( $valid_urls as $url ) {
			$url_hashes[] = $url->get_url_id();
		}

		if ( ! empty( $valid_urls ) ) {
			$query_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM $table WHERE urlMd5 IN ($placeholders)", // phpcs:ignore
					$url_hashes,
				),
				ARRAY_A
			);
		}

		$results = array();
		if ( ! empty( $query_results ) ) {
			foreach ( $query_results as $res ) {
				$results[ $res['urlMd5'] ] = $this->transform( $res );
			}
		}


		$this->prepare_url_batch_for_scheduling( $valid_urls );
		$this->mark_as_broken_batch( $broken_urls );
		return $results;
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return void
	 */
	public function prepare_url_batch_for_scheduling( array $urls ): bool {
		if ( empty( $urls ) ) {
			return true;
		}
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		$insert_placeholders = array();
		$insert_values = array();
		foreach ( $urls as $url ) {
			if ( ! isset( $results[ $url->get_url_id() ] ) ) {
				$url_data = Urlslab_Url_Data::empty( $url, Urlslab_Status::$not_crawling );
				array_push(
					$insert_values,
					$url->get_url_id(),
					$url->get_url(),
					$url_data->get_url_title(),
					$url_data->get_url_meta_description(),
					Urlslab_Status::$not_scheduled,
					gmdate( 'Y-m-d H:i:s' )
				);
				$insert_placeholders[] = '(%s, %s, %s, %s, %s, %s)';
			}
		}

		$insert_query = "INSERT IGNORE INTO $table (urlMd5, urlName, urlTitle, urlMetaDescription, status, updateStatusDate) VALUES";
		$insert_query .= implode( ', ', $insert_placeholders );

		return is_numeric(
			$wpdb->query(
				$wpdb->prepare(
				$insert_query, // phpcs:ignore
					$insert_values
				),
			)
		);
	}


	public function fetch_related_urls_to( Urlslab_Url $url, int $limit ): array {
		global $wpdb;
		$urls_table = URLSLAB_URLS_TABLE;
		$related_urls_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$q = "SELECT u.urlName AS urlName,
       				 u.status AS status,
       				 u.domainId AS domainId,
       				 u.urlId AS urlId,
       				 u.screenshotDate AS screenshotDate,
       				 u.updateStatusDate AS updateStatusDate,
       				 u.urlTitle AS urlTitle,
       				 u.urlMetaDescription AS urlMetaDescription,
       				 u.urlSummary AS urlSummary
				FROM $related_urls_table r
                INNER JOIN $urls_table as u ON r.destUrlMd5 = u.urlMd5
				WHERE r.srcUrlMd5 = %s AND u.visibility = '%s'
				LIMIT %d";

		$query_res = $wpdb->get_results(
			$wpdb->prepare(
				$q, // phpcs:ignore
				$url->get_url_id(),
				Urlslab_Url_Data::VISIBILITY_VISIBLE,
				$limit
			),
			ARRAY_A
		);

		$result = array();
		foreach ( $query_res as $res ) {
			$result[] = $this->transform( $res );
		}

		return $result;
	}

	public function count_urls_with_status( string $status = '' ) {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$query = "SELECT COUNT(*) AS cnt FROM $table";
		if ( ! empty( $status ) ) {
			$query .= ' WHERE status = %s';
			return $wpdb->get_row(
				$wpdb->prepare(
					$query, // phpcs:ignore
					$status
				),
				ARRAY_A
			)['cnt'];
		} else {
			return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
		}
	}

	public function count_generated_summaries() {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$query = "SELECT COUNT(*) AS cnt FROM $table WHERE urlSummary IS NOT NULL";
		return $wpdb->get_row( $query, ARRAY_A )['cnt']; // phpcs:ignore
	}

}
