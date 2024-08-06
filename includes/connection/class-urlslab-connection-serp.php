<?php


use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\SERPApi;
use FlowHunt_Vendor\OpenAPI\Client\Model\SerperResponse;
use FlowHunt_Vendor\OpenAPI\Client\Model\SerpSearchRequest;
use FlowHunt_Vendor\OpenAPI\Client\Model\SerpSearchRequests;

class Urlslab_Connection_Serp {
	private $serp_queries_count = - 1;

	private static Urlslab_Connection_Serp $instance;
	private static SERPApi $serp_client;

	public static function get_instance(): Urlslab_Connection_Serp {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$serp_client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			self::$serp_client = new SERPApi( new Client( array( 'timeout' => 59 ) ), Urlslab_Connection_FlowHunt::getConfiguration() ); //phpcs:ignore

			return ! empty( self::$serp_client );
		}

		throw new ApiException( esc_html( __( 'Not Enough Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}

	public function search_serp( Urlslab_Data_Serp_Query $query ): array {
		$result = $this->bulk_search_serp( array( $query ) );
		return $result[0];
	}


	public function bulk_search_volumes( array $queries, $country ) {
		$request = new DomainDataRetrievalSearchVolumeBulkRequest();
		$request->setKeywords( $queries );
		$request->setCountry( $country );

		return self::$serp_client->scheduleKeywordsAnalysis( $request );
	}

	public function bulk_search_serp( array $queries ) {
		$request = new SerpSearchRequests();

		$qs = array();
		foreach ( $queries as $query ) {
			$q = new SerpSearchRequest();
			$q->setQuery( $query->get_query() );
			if ( strlen( $query->get_country() ) ) {
				$q->setCountry( $query->get_country() );
			}
			$qs[] = $q;
		}
		$request->setRequests( $qs );

		$result = self::$serp_client->serpSearch( Urlslab_Connection_FlowHunt::getWorkspaceId(), $request );
		return$result;
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
					$has_monitored_domain++;
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
			$ret = $this->get_serp_results( $query_batch, $url_per_query );
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

	private function get_serp_results( $queries, $limit ): array {
		$ret = array();

		try {
			$serp_res = $this->bulk_search_serp( $queries, true );

			if ( $serp_res && is_array( $serp_res->getSerpData() ) ) {
				foreach ( $serp_res->getSerpData() as $idx => $rsp ) {
					$query     = $queries[ $idx ];
					$serp_data = $this->extract_serp_data( $query, $rsp, 50 ); // max_import_pos doesn't matter here
					$query->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSED );


					$urls = array();
					foreach ( $serp_data['urls'] as $url ) {
						$urls[] = $url;
						if ( count( $urls ) >= $limit ) {
							break;
						}
					}
					$ret[ $query->get_query() ] = $urls;
				}
			}
		} catch ( ApiException $e ) {
			// do nothing
		}

		return $ret;
	}

	public function save_serp_response($serp_response, array $queries ): void {
		global $wpdb;
		foreach ( $serp_response as $idx => $response ) {


			switch ( $response->getStatus() ) {
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::SUCCESS:

					$data = json_decode($response->getResult());

					$serp_data = $this->extract_serp_data( $queries[ $idx ], $response, Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION ) );

					if ( is_bool( $serp_data ) && ! $serp_data ) {
						$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_ERROR );
					} else {
						// valid data
						$has_monitored_domain = $serp_data['has_monitored_domain'];
						$urls                 = $serp_data['urls'];
						$domains              = $serp_data['domains'];
						$positions            = $serp_data['positions'];
						$positions_history    = $serp_data['positions_history'];

						if (
							$has_monitored_domain >= Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT ) ||
							Urlslab_Data_Serp_Query::TYPE_USER === $queries[ $idx ]->get_type() ||
							count( Urlslab_Data_Serp_Domain::get_monitored_domains() ) < Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT )
						) {
							$wpdb->delete(
								URLSLAB_SERP_POSITIONS_TABLE,
								array(
									'query_id' => $queries[ $idx ]->get_query_id(),
									'country'  => $queries[ $idx ]->get_country(),
								),
								array( '%d', '%s' )
							);

							if ( ! empty( $urls ) ) {
								$urls[0]->insert_all( $urls, true );
							}
							if ( ! empty( $positions ) ) {
								$positions[0]->insert_all(
									$positions,
									false,
									array(
										'position',
										'updated',
									)
								);
							}
							if ( ! empty( $positions_history ) ) {
								$positions_history[0]->insert_all( $positions_history, true );
							}
							if ( ! empty( $domains ) ) {
								$domains[0]->insert_all( $domains, true );
							}


							$this->discover_new_queries( $rsp, $queries[ $idx ] );

							$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSED );

							if ( Urlslab_Data_Serp_Query::TYPE_SERP_FAQ === $queries[ $idx ]->get_type() && Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_FAQS ) ) {
								//if the question is relevant FAQ, add it to the FAQ table
								$faq_row = new Urlslab_Data_Faq( array( 'question' => ucfirst( $queries[ $idx ]->get_query() ) ), false );
								if ( ! $faq_row->load( array( 'question' ) ) ) {
									$faq_row->set_status( Urlslab_Data_Faq::STATUS_EMPTY );
									$faq_row->insert();
								}
							}
						} else {
							$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_SKIPPED ); //irrelevant query
						}
					}

					break;
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::PENDING:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::RECEIVED:
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::STARTED:
					$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSING );
					break;
				case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::FAILURE:
					$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_ERROR );
					break;
				default:
					break;
			}
			$queries[ $idx ]->update();

		}
	}


	/**
	 * @param $serp_response
	 *
	 * @return void
	 */
	private function discover_new_queries( $serp_response, Urlslab_Data_Serp_Query $query ): void {

		if ( $this->get_serp_queries_count() >= Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP_IMPORT_LIMIT ) ) {
			return;
		}

		//Discover new queries
		$fqs     = $serp_response->getFaqs();
		$queries = array();
		if ( ! empty( $fqs ) && Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_FAQS_AS_QUERY ) ) {
			foreach ( $fqs as $faq ) {
				$f_query = new Urlslab_Data_Serp_Query(
					array(
						'query'           => strtolower( trim( $faq->question ) ),
						'parent_query_id' => $query->get_query_id(),
						'country'         => $query->get_country(),
						'status'          => Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
						'type'            => Urlslab_Data_Serp_Query::TYPE_SERP_FAQ,
					)
				);
				if ( $f_query->is_valid() ) {
					$queries[] = $f_query;
				}
			}
		}

		$related = $serp_response->getRelatedSearches();
		if ( ! empty( $related ) && Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES ) ) {
			foreach ( $related as $related_search ) {
				$new_query = new Urlslab_Data_Serp_Query(
					array(
						'query'           => strtolower( trim( $related_search->query ) ),
						'country'         => $query->get_country(),
						'parent_query_id' => $query->get_query_id(),
						'status'          => Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
						'type'            => Urlslab_Data_Serp_Query::TYPE_SERP_RELATED,
					)
				);
				if ( $new_query->is_valid() ) {
					$queries[] = $new_query;
				}
			}
		}
		if ( ! empty( $queries ) ) {
			$queries[0]->insert_all( $queries, true );
		}
	}

	private function get_serp_queries_count(): int {
		if ( 0 <= $this->serp_queries_count ) {
			return $this->serp_queries_count;
		}

		$this->serp_queries_count = get_transient( 'urlslab_serp_queries_count' );
		if ( false === $this->serp_queries_count ) {
			global $wpdb;
			$this->serp_queries_count = $wpdb->get_var( 'SELECT COUNT(*) FROM ' . URLSLAB_SERP_QUERIES_TABLE ); // phpcs:ignore

			set_transient( 'urlslab_serp_queries_count', $this->serp_queries_count, 60 );
		}

		return (int) $this->serp_queries_count;
	}
}
