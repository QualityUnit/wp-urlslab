<?php

/**
 * Manages all operation about URL Details
 */
class Urlslab_Url_Data_Fetcher {

	private array $urls_cache = array();
	private static ?Urlslab_Url_Data_Fetcher $instance = null;

	public static function get_instance(): Urlslab_Url_Data_Fetcher {
		if ( null === self::$instance ) {
			self::$instance = new Urlslab_Url_Data_Fetcher();
		}

		return self::$instance;
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
					"SELECT * FROM $table WHERE url_id IN ($placeholders)", // phpcs:ignore
					array_keys( $valid_urls ),
				),
				ARRAY_A
			);
		}

		if ( ! empty( $query_results ) ) {
			foreach ( $query_results as $res ) {
				try {
					$results[ $res['url_id'] ]          = new Urlslab_Url_Row( $res );
					$this->urls_cache[ $res['url_id'] ] = $results[ $res['url_id'] ];
					if ( Urlslab_Url_Row::URL_TYPE_EXTERNAL == $results[ $res['url_id'] ]->get_url_type() && $valid_urls[ $res['url_id'] ]->is_same_domain_url() ) {
						$results[ $res['url_id'] ]->set_url_type( Urlslab_Url_Row::URL_TYPE_INTERNAL );
					}
					unset( $valid_urls[ $res['url_id'] ] );
				} catch ( Exception $e ) {
				}
			}
		}


		//# Adding only urls that are no scheduled
		$url_row_obj = new Urlslab_Url_Row();
		$url_row_obj->insert_urls( $valid_urls );
		$url_row_obj->insert_urls( $broken_urls, Urlslab_Url_Row::SCR_STATUS_ERROR, Urlslab_Url_Row::SUM_STATUS_ERROR, 400, Urlslab_Url_Row::REL_ERROR );

		return $results;
	}
}
