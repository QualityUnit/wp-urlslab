<?php
require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;

class Urlslab_Cron_Serp extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;
	private $serp_queries_count = - 1;
	private ?Urlslab_Widget_Serp $widget;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! $this->has_rows || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Serp::SLUG ) ) {
			return false;
		}

		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG );
		if ( ! $this->init_client() ) {
			return false;
		}


		return parent::cron_exec( $max_execution_time );
	}

	private function init_client(): bool {
		if ( empty( $this->serp_client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key           = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config            = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->serp_client = new \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->serp_client );
	}


	public function get_description(): string {
		return __( 'Synchronizing SERP data', 'urlslab' );
	}


	protected function execute(): bool {
		if ( ! $this->has_rows || ! $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP_API ) ) {
			return false;
		}

		$types = explode( ',', $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_QUERY_TYPES ) );
		foreach ( $types as $id => $type ) {
			if ( isset( Urlslab_Widget_Serp::get_available_query_types()[ $type ] ) ) {
				$types[ $id ] = "'" . $type . "'";
			} else {
				unset( $types[ $id ] );
			}
		}
		if ( empty( $types ) ) {
			$this->has_rows = false;

			return false;
		}
		$types = implode( ',', $types );

		global $wpdb;


		$default_is_schedule_once = Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_ONE_TIME === $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SYNC_FREQ );
		$query_data               = array();
		$query_data[]             = Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED;
		$query_data[]             = Urlslab_Data_Serp_Query::STATUS_PROCESSED;
		$query_data[]             = substr( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_ONE_TIME, 0, 1 );
		if ( $default_is_schedule_once ) {
			$query_data[] = '';
		}
		$query_data[] = Urlslab_Data::get_now();


		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type IN (' . $types . ') AND (`status`=%s OR (status=%s AND schedule_interval<>%s' . ( $default_is_schedule_once ? ' AND schedule_interval<>%s' : '' ) . ') AND schedule <= %s ) ORDER BY type DESC, schedule_interval, schedule LIMIT 20', // phpcs:ignore
				$query_data
			),
			ARRAY_A
		); // phpcs:ignore


		if ( empty( $rows ) ) {
			$this->has_rows = false;

			return false;
		}

		$queries = array();
		for ( $i = 0; $i < min( count( $rows ), 5 ); $i ++ ) {
			$rand_idx = rand( 0, count( $rows ) - 1 );
			$new_q    = new Urlslab_Data_Serp_Query( $rows[ $rand_idx ] );
			$new_q->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSING );
			$new_q->update();
			array_splice( $rows, $rand_idx, 1 );
			$queries[] = $new_q;
		}

		try {
			$serp_conn     = Urlslab_Connection_Serp::get_instance();
			$serp_response = $serp_conn->bulk_search_serp( $queries, $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SYNC_FREQ ) );

			foreach ( $serp_response->getSerpData() as $idx => $rsp ) {
				$serp_data = $serp_conn->extract_serp_data( $queries[ $idx ], $rsp, $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION ) );

				if ( is_bool( $serp_data ) && ! $serp_data ) {
					$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED );
					$queries[ $idx ]->update();
				} else {
					// valid data
					$has_monitored_domain = $serp_data['has_monitored_domain'];
					$urls                 = $serp_data['urls'];
					$domains              = $serp_data['domains'];
					$positions            = $serp_data['positions'];
					$positions_history    = $serp_data['positions_history'];

					if (
						$has_monitored_domain >= $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT ) ||
						Urlslab_Data_Serp_Query::TYPE_USER === $queries[ $idx ]->get_type() ||
						count( Urlslab_Data_Serp_Domain::get_monitored_domains() ) < $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT )
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


						$this->discoverNewQueries( $rsp, $queries[ $idx ] );

						$queries[ $idx ]->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSED );

						if ( Urlslab_Data_Serp_Query::TYPE_SERP_FAQ === $queries[ $idx ]->get_type() && $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_FAQS ) ) {
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
				$queries[ $idx ]->update();
			}
			Urlslab_Data_Serp_Query::update_serp_data();
			Urlslab_Data_Serp_Url::update_serp_data();
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}
			foreach ( $queries as $query ) {
				$query->set_status( Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED );
				$query->update();
			}

			return false;
		}

		return true;
	}

	private function get_serp_queries_count(): int {
		global $wpdb;
		if ( 0 > $this->serp_queries_count ) {
			$this->serp_queries_count = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type=%s OR type=%s', Urlslab_Data_Serp_Query::TYPE_SERP_RELATED, Urlslab_Data_Serp_Query::TYPE_SERP_FAQ ) ); // phpcs:ignore
		}

		return $this->serp_queries_count;
	}

	/**
	 * @param $serp_response
	 *
	 * @return void
	 */
	private function discoverNewQueries( $serp_response, Urlslab_Data_Serp_Query $query ): void {
		//Discover new queries
		$fqs     = $serp_response->getFaqs();
		$queries = array();
		if ( ! empty( $fqs ) && $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_FAQS_AS_QUERY ) ) {
			foreach ( $fqs as $faq ) {
				$queries[] = new Urlslab_Data_Serp_Query(
					array(
						'query'           => strtolower( trim( $faq->question ) ),
						'parent_query_id' => $query->get_query_id(),
						'country' => $query->get_country(),
						'status'  => Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
						'type'    => Urlslab_Data_Serp_Query::TYPE_SERP_FAQ,
					)
				);
			}
		}

		$related = $serp_response->getRelatedSearches();
		if ( ! empty( $related ) && $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES ) && $this->get_serp_queries_count() <= $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP_IMPORT_LIMIT ) ) {
			foreach ( $related as $related_search ) {
				$queries[] = new Urlslab_Data_Serp_Query(
					array(
						'query'   => strtolower( trim( $related_search->query ) ),
						'country' => $query->get_country(),
						'parent_query_id' => $query->get_query_id(),
						'status'  => Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED,
						'type'    => Urlslab_Data_Serp_Query::TYPE_SERP_RELATED,
					)
				);
			}
		}
		if ( ! empty( $queries ) ) {
			$queries[0]->insert_all( $queries, true );
		}
	}
}
