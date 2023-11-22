<?php

/**
 * Manages all operation about URL Details.
 */
class Urlslab_Data_Url_Fetcher {
	private array $urls_cache = array();
	private static ?Urlslab_Data_Url_Fetcher $instance = null;

	public static function get_instance(): Urlslab_Data_Url_Fetcher {
		if ( null === self::$instance ) {
			self::$instance = new Urlslab_Data_Url_Fetcher();
		}

		return self::$instance;
	}

	/**
	 * @return Urlslab_Data_Url
	 */
	public function load_and_schedule_url( Urlslab_Url $url ): ?Urlslab_Data_Url {
		$array = $this->load_and_schedule_urls( array( $url ) );
		if ( empty( $array ) ) {
			return null;
		}

		return reset( $array );
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return Urlslab_Data_Url[]
	 */
	public function load_and_schedule_urls( $urls ): array {
		$results = array();
		if ( empty( $urls ) ) {
			return $results;
		}

		$valid_urls  = array();
		$broken_urls = array();
		foreach ( $urls as $url ) {
			if ( isset( $this->urls_cache[ $url->get_url_id() ] ) ) {
				$results[ $url->get_url_id() ] = $this->urls_cache[ $url->get_url_id() ];
			} else {
				if ( ! $url->is_current_404() && ! $url->is_blacklisted() ) {
					if ( $url->is_url_valid() ) {
						$valid_urls[ $url->get_url_id() ] = $url;
					} else {
						$broken_urls[] = $url;
					}
				}
			}
		}

		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		if ( ! empty( $valid_urls ) ) {
			$placeholders  = implode( ', ', array_fill( 0, count( $valid_urls ), '%d' ) );
			$query_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM {$table} WHERE url_id IN ({$placeholders})", // phpcs:ignore
					array_keys( $valid_urls ),
				),
				ARRAY_A
			);
		}

		if ( ! empty( $query_results ) ) {
			foreach ( $query_results as $res ) {
				try {
					$results[ $res['url_id'] ]          = new Urlslab_Data_Url( $res );
					$this->urls_cache[ $res['url_id'] ] = $results[ $res['url_id'] ];
					unset( $valid_urls[ $res['url_id'] ] );
				} catch ( Exception $e ) {
				}
			}
		}

		if ( ! is_search() && ! is_user_logged_in() ) {
			// # Adding only urls that are no scheduled
			$url_row_obj = new Urlslab_Data_Url();
			if ( $url_row_obj->insert_urls( $valid_urls ) ) {
				foreach ( $valid_urls as $url ) {
					$results[ $url->get_url_id() ] = new Urlslab_Data_Url(
						array(
							'url_id'   => $url->get_url_id(),
							'url_name' => $url->get_url(),
						),
						false
					);
				}
			}
			$url_row_obj->insert_urls( $broken_urls, Urlslab_Data_Url::SCR_STATUS_ERROR, Urlslab_Data_Url::SUM_STATUS_ERROR, 400, Urlslab_Data_Url::REL_ERROR );
		}

		return $results;
	}
}
