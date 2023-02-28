<?php

/**
 * Manages all operation about URL Details
 */
class Urlslab_Url_Data_Fetcher {

	private array $urls_cache = array();

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

		$values      = array();
		$placeholder = array();
		foreach ( $urls as $url ) {
			array_push(
				$values,
				$url->get_url_id(),
				$url->get_url(),
				Urlslab_Url_Row::STATUS_BROKEN,
			);
			$placeholder[] = '(%d, %s, %s)';
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query       = "INSERT IGNORE INTO $table (
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
	 * @return Urlslab_Url_Row
	 */
	public function fetch_schedule_url( Urlslab_Url $url ): ?Urlslab_Url_Row {
		$array = $this->fetch_schedule_urls_batch( array( $url ) );
		if ( empty( $array ) ) {
			return null;
		}

		return reset( $array );
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return Urlslab_Url_Row[]
	 */
	public function fetch_schedule_urls_batch( $urls ): array {
		$results = array();
		if ( empty( $urls ) ) {
			return $results;
		}

		$valid_urls  = array();
		$broken_urls = array();
		foreach ( $urls as $url ) {
			if ( isset( $this->urls_cache[ $url->get_url_id() ] ) ) {
				$results[ $url->get_url_id() ] = $this->urls_cache[ $url->get_url_id() ];
			} else if ( $url->is_url_valid() ) {
				$valid_urls[ $url->get_url_id() ] = $url;
			} else {
				$broken_urls[] = $url;
			}
		}

		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		if ( ! empty( $valid_urls ) ) {
			$placeholders  = implode( ', ', array_fill( 0, count( $valid_urls ), '%d' ) );
			$query_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM $table WHERE urlMd5 IN ($placeholders)", // phpcs:ignore
					array_keys( $valid_urls ),
				),
				ARRAY_A
			);
		}

		if ( ! empty( $query_results ) ) {
			foreach ( $query_results as $res ) {
				try {
					$results[ $res['urlMd5'] ]          = new Urlslab_Url_Row( $res );
					$this->urls_cache[ $res['urlMd5'] ] = $results[ $res['urlMd5'] ];
					unset( $valid_urls[ $res['urlMd5'] ] );
				} catch ( Exception $e ) {
				}
			}
		}


		//# Adding only urls that are no scheduled
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
		$insert_values       = array();
		foreach ( $urls as $url ) {
			array_push(
				$insert_values,
				$url->get_url_id(),
				$url->get_url(),
				Urlslab_Url_Row::STATUS_NEW,
				Urlslab_Data::get_now()
			);
			$insert_placeholders[] = '(%d, %s, %s, %s, %s, %s)';
		}

		$insert_query = "INSERT IGNORE INTO $table (urlMd5, urlName, status, updateStatusDate) VALUES";
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

}
