<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-data.php';

/**
 * Manages all operation about URL Details
 */
class Urlslab_Url_Data_Fetcher {
	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	public function __construct( Urlslab_Screenshot_Api $urlslab_screenshot_api ) {
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
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
		);
	}

	/**
	 * @return Urlslab_Url_Data[]
	 */
	public function fetch_scheduling_urls(): array {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

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
			ARRAY_A
		);

		$res = array();
		foreach ( $schedules as $schedule ) {
			$res[] = $this->transform( $schedule );
		}

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
				Urlslab::$link_status_broken,
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
	 * @param string $url
	 *
	 * @return void
	 * @throws Exception
	 */
	public function schedule_url( string $url ) {
		$this->schedule_urls_batch( array( $url ) );
	}

	/**
	 * @param array $urls
	 *
	 * @return array|false|string|Urlslab_Screenshot_Error_Response
	 * @throws Exception
	 */
	public function schedule_urls_batch( array $urls ) {
		if ( $this->urlslab_screenshot_api->has_api_key() ) {
			return $this->urlslab_screenshot_api->schedule_batch( $urls );
		}

		return false;
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
				$url_data = Urlslab_Url_Data::empty( $url );
				array_push(
					$insert_values,
					$url->get_url_id(),
					$url->get_url(),
					$url_data->get_url_title(),
					$url_data->get_url_meta_description(),
					Urlslab::$link_status_not_scheduled,
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
				WHERE r.srcUrlMd5 = %s
				LIMIT %d";

		$query_res = $wpdb->get_results(
			$wpdb->prepare(
				$q, // phpcs:ignore
				$url->get_url_id(),
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

}
