<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchResponse;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest;

class Urlslab_Connection_Serp {

	private static Urlslab_Connection_Serp $instance;
	private static SerpApi $serp_client;

	public static function get_instance(): Urlslab_Connection_Serp {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$serp_client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key           = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config            = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			self::$serp_client = new SerpApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore

			return ! empty( self::$serp_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );

	}

	public function search_serp( Urlslab_Data_Serp_Query $query, string $not_older_than ) {
		// preparing needed operators
		$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();
		$request->setSerpQuery( $query->get_query() );
		$request->setCountry( $query->get_country() );
		$request->setAllResults( true );
		$request->setNotOlderThan( $not_older_than );

		return self::$serp_client->search( $request );
	}

	/**
	 * @param Urlslab_Data_Serp_Query[] $queries
	 * @param string $not_older_than
	 *
	 * @return \OpenAPI\Client\Model\DomainDataRetrievalSerpApiBulkSearchResponse
	 * @throws \OpenAPI\Client\ApiException
	 */
	public function bulk_search_serp( array $queries, string $not_older_than ) {

		if ( DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_ONE_TIME === $not_older_than ) {
			$not_older_than = DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY;
		}

		// preparing needed operators
		$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiBulkSearchRequest();

		$qs = array();
		foreach ( $queries as $query ) {
			$qs[] = $query->get_query();
		}

		$request->setSerpQueries( $qs );
		$request->setAllResults( true );
		$request->setNotOlderThan( $not_older_than );

		return self::$serp_client->bulkSearch( $request );
	}

	public function extract_serp_data( Urlslab_Data_Serp_Query $query, $serp_response, int $max_import_pos ) {
		$has_monitored_domain = 0;
		$urls                 = array();
		$domains              = array();
		$positions            = array();
		$positions_history    = array();

		$organic = $serp_response->getOrganicResults();

		if ( empty( $organic ) ) {

			return false;
		} else {
			foreach ( $organic as $organic_result ) {
				$url_obj = new Urlslab_Url( $organic_result->getLink(), true );
				if ( isset( Urlslab_Data_Serp_Domain::get_monitored_domains()[ $url_obj->get_domain_id() ] ) && $organic_result->getPosition() <= $max_import_pos ) {
					$has_monitored_domain ++;
				}

				if ( 20 >= $organic_result->getPosition() || isset( Urlslab_Data_Serp_Domain::get_monitored_domains()[ $url_obj->get_domain_id() ] ) ) {
					$url    = new Urlslab_Data_Serp_Url(
						array(
							'url_name'        => $organic_result->getLink(),
							'url_title'       => $organic_result->getTitle(),
							'url_description' => $organic_result->getDescription(),
							'url_id'          => $url_obj->get_url_id(),
							'domain_id'       => $url_obj->get_domain_id(),
						)
					);
					$urls[] = $url;

					$domains[] = new Urlslab_Data_Serp_Domain(
						array(
							'domain_id'   => $url->get_domain_id(),
							'domain_name' => $url_obj->get_domain_name(),
						),
						false
					);

					$positions[]         = new Urlslab_Data_Serp_Position(
						array(
							'position'  => $organic_result->getPosition(),
							'query_id'  => $query->get_query_id(),
							'country'   => $query->get_country(),
							'url_id'    => $url->get_url_id(),
							'domain_id' => $url->get_domain_id(),
						)
					);
					$positions_history[] = new Urlslab_Data_Serp_Position_History(
						array(
							'position'  => $organic_result->getPosition(),
							'query_id'  => $query->get_query_id(),
							'country'   => $query->get_country(),
							'url_id'    => $url->get_url_id(),
							'domain_id' => $url->get_domain_id(),
						)
					);
				}
			}
		}

		return array(
			'has_monitored_domain' => $has_monitored_domain,
			'urls'                 => $urls,
			'domains'              => $domains,
			'positions'            => $positions,
			'positions_history'    => $positions_history,
		);
	}

	/**
	 * @param Urlslab_Data_Serp_Query[] $queries raw queries (not loaded from DB)
	 * returns the serp results for the given queries. if the query is already in db, it will be loaded from there.
	 * otherwise it will be requested from serp api
	 *
	 * queries count should not be more than 100
	 */
	public function get_serp_top_urls( array $queries, int $url_per_query = 3 ) {
		global $wpdb;

		if ( count( $queries ) > 100 ) {
			return false;
		}

		// batch for IN query in sql
		$serp_urls           = array();
		$missing_queries     = array();
		$internal_db_queries = array();

		// grouping data based on internal DB queries and missing queries
		$db_batching = array_chunk( $queries, 25 );
		foreach ( $db_batching as $query_batch ) {

			$in_clause_array_placeholder = array();
			$in_clause_values            = array();

			foreach ( $query_batch as $query ) {
				$in_clause_array_placeholder[] = '(%d,%s)';
				$in_clause_values[]            = $query->get_query_id();
				$in_clause_values[]            = $query->get_country();
			}
			$res       = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE (query_id, country) IN (' . implode( ',', $in_clause_array_placeholder ) . ')', //phpcs:ignore
					$in_clause_values
				), ARRAY_A ); // phpcs:ignore
			$query_res = array();
			foreach ( $res as $row ) {
				$query_obj                            = new Urlslab_Data_Serp_Query( $row, true );
				$query_res[ $query_obj->get_query() ] = $query_obj;
			}
			foreach ( $query_batch as $query ) {
				if ( isset( $query_res[ $query->get_query() ] ) && ( $query_res[ $query->get_query() ] )->get_status() == Urlslab_Data_Serp_Query::STATUS_PROCESSED ) {
					$internal_db_queries[] = $query;
				} else {
					$missing_queries[] = $query;
				}
			}
		}

		// getting information of queries in internal DB
		$internal_db_query_batch = array_chunk( $internal_db_queries, 25 );
		foreach ( $internal_db_query_batch as $query_batch ) {
			$query_map = array();
			foreach ( $query_batch as $query ) {
				$query_map[ $query->get_query_id() ] = $query;
			}

			$in_clause_array_placeholder = array();
			$in_clause_values            = array();

			foreach ( $query_batch as $query ) {
				$in_clause_array_placeholder[] = '(%d,%s)';
				$in_clause_values[]            = $query->get_query_id();
				$in_clause_values[]            = $query->get_country();
			}
			$in_clause_values[] = $url_per_query;

			$res = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT p.query_id as query_id, GROUP_CONCAT(u.url_name) as urls FROM ' . URLSLAB_SERP_POSITIONS_TABLE . ' p LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE (p.query_id, p.country) IN (' . implode( ',', $in_clause_array_placeholder ) . ") AND p.position <= %d GROUP BY p.query_id", //phpcs:ignore
					$in_clause_values
				), ARRAY_A ); // phpcs:ignore
			foreach ( $res as $row ) {
				$serp_urls[ ( $query_map[ $row['query_id'] ] )->get_query() ] = explode( ',', $row['urls'] );
			}
		}

		// getting information of queries not in internal DB from SERP API
		$missing_query_batch = array_chunk( $missing_queries, 5 );
		foreach ( $missing_query_batch as $query_batch ) {
			$ret = $this->get_serp_results( $query_batch );
			foreach ( $ret as $keyword => $urls ) {
				$data = array();
				foreach ( $urls as $url ) {
					$data[] = $url->get_url_name();
				}
				$serp_urls[ $keyword ] = $data;
			}
		}

		return $serp_urls;
	}

	private function get_serp_results( $queries, string $not_older_than = DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY ): array {
		$serp_res = $this->bulk_search_serp( $queries, $not_older_than );

		$ret = array();
		foreach ( $serp_res->getSerpData() as $idx => $rsp ) {
			$query     = $queries[ $idx ];
			$serp_data = $this->extract_serp_data( $query, $rsp, 50 ); // max_import_pos doesn't matter here
			$query->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSED );

			$cnt  = 0;
			$urls = array();
			foreach ( $serp_data['urls'] as $url ) {
				if ( $cnt >= 4 ) {
					break;
				}
				$cnt ++;
				$urls[] = $url;
			}
			$ret[ $query->get_query() ] = $urls;
		}

		return $ret;
	}
}
