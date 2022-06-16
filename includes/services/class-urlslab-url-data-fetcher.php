<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-data.php';

/**
 * Manages all operation about URL Details
 */
class Urlslab_Url_Data_Fetcher
{
	private string $url_table_postfix = 'urlslab_urls';
	private string $rel_table_postfix = 'urlslab_related_urls';

	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	public function __construct(Urlslab_Screenshot_Api $urlslab_screenshot_api)
	{
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
	}

	/**
	 * @param array $row
	 *
	 * @return Urlslab_Url_Data
	 */
	private function transform(array $row): Urlslab_Url_Data
	{
		return new Urlslab_Url_Data(
			new Urlslab_Url(parse_url( get_site_url(), PHP_URL_SCHEME ) . '://' . $row['urlName'] ),
			$row['domainId'],
			$row['urlId'],
			$row['screenshotDate'],
			$row['urlTitle'],
			$row['urlMetaDescription'],
			$row['urlSummary'],
			$row['status'],
		);
	}

	/**
	 * @return array|stdClass[]
	 */
	public function fetch_scheduling_urls(): array
	{
		global $wpdb;
		$table = $wpdb->prefix . $this->url_table_postfix;

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
		foreach ($schedules as $schedule) {
			$res[] = $this->transform($schedule);
		}

		return $res;
	}

	/**
	 * @param string $url
	 *
	 * @return void
	 * @throws Exception
	 */
	public function schedule_url(string $url)
	{
		$this->schedule_urls_batch(array($url));
	}

	/**
	 * @param array $urls
	 *
	 * @return array|false|string|Urlslab_Screenshot_Error_Response
	 * @throws Exception
	 */
	public function schedule_urls_batch(array $urls)
	{
		if ($this->urlslab_screenshot_api->has_api_key()) {
			return $this->urlslab_screenshot_api->schedule_batch($urls);
		}

		return false;
	}

	/**
	 * @param Urlslab_Url_Data_Response $url
	 *
	 * @return void
	 */
	public function save_url(Urlslab_Url_Data_Response $url)
	{
		$this->save_urls_batch(array($url));
	}

	/**
	 * @param array $urls
	 *
	 * @return void
	 */
	public function save_urls_batch(array $urls)
	{
		global $wpdb;
		$table = $wpdb->prefix . $this->url_table_postfix;

		$values = array();
		$placeholder = array();
		foreach ($urls as $url) {
			array_push(
				$values,
				$url->get_url()->get_url_id(),
				$url->get_url()->get_url(),
				$url->get_screenshot_status(),
				$url->get_domain_id(),
				$url->get_url_id(),
				$url->get_screenshot_date(),
				gmdate('Y-m-d H:i:s'),
				$url->get_url_title(),
				$url->get_url_meta_description(),
				$url->get_url_summary(),
			);
			$placeholder[] = '(%s, %s, %s, %s, %s, %d, %s, %s, %s, %s)';
		}

		$placeholder_string = implode(', ', $placeholder);
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
                   AS new ON DUPLICATE KEY UPDATE
                   urlName = new.urlName,
                   status = new.status,
                   domainId = new.domainId,
                   urlId = new.urlId,
                   domainId = new.domainId,
                   screenshotDate = new.screenshotDate,
                   updateStatusDate = new.updateStatusDate,
                   urlTitle = new.urlTitle,
                   urlMetaDescription = new.urlMetaDescription,
                   urlSummary = new.urlSummary";

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
	public function fetch_schedule_url(Urlslab_Url $url)
	{
		$array = $this->fetch_schedule_urls_batch(array($url));
		return reset($array);
	}

	/**
	 * @param array $urls
	 *
	 * @return array
	 */
	public function fetch_schedule_urls_batch(array $urls): ?array
	{
		if (empty($urls)) {
			return null;
		}
		global $wpdb;
		$table = $wpdb->prefix . $this->url_table_postfix;
		$placeholders = implode(', ', array_fill(0, count($urls), '%s'));
		$url_hashes = array();
		foreach ($urls as $url) {
			$url_hashes[] = $url->get_url_id();
		}

		$query_results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE urlMd5 IN ($placeholders)", // phpcs:ignore
				$url_hashes,
			),
			ARRAY_A
		);

		$results = array();
		if (!empty($query_results)) {
			foreach ($query_results as $res) {
				$results[$res['urlMd5']] = $this->transform($res);
			}
		}


		$insert_placeholders = array();
		$insert_values = array();
		foreach ($urls as $url) {
			if (!isset($results[$url->get_url_id()])) {
				array_push(
					$insert_values,
					$url->get_url_id(),
					$url->get_url(),
					Urlslab::$link_status_not_scheduled,
					gmdate('Y-m-d H:i:s')
				);
				$insert_placeholders[] = '(%s, %s, %s, %s)';
			}
		}

		if (!empty($insert_values)) {
			$insert_query = "INSERT IGNORE INTO $table (urlMd5, urlName, status, updateStatusDate) VALUES";
			$insert_query .= implode(', ', $insert_placeholders);

			$wpdb->query(
				$wpdb->prepare(
					$insert_query, // phpcs:ignore
					$insert_values
				),
			);
		}

		return $results;
	}


	public function fetch_related_urls_to(Urlslab_Url $url, int $limit): array
	{
		global $wpdb;
		$urls_table = $wpdb->prefix . $this->url_table_postfix;
		$related_urls_table = $wpdb->prefix . $this->rel_table_postfix;
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
				WHERE r.srcUrlMd5 = %s AND u.status='A'
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
		foreach ($query_res as $res) {
			$result[] = $this->transform($res);
		}

		return $result;
	}

}
