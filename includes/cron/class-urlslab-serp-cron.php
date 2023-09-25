<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-js-cache-row.php';

require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;

class Urlslab_Serp_Cron extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;
	private $serp_queries_count = - 1;
	private ?Urlslab_Serp $widget;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! $this->has_rows || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Serp::SLUG ) ) {
			return false;
		}

		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG );
		if ( ! $this->init_client() ) {
			return false;
		}


		return parent::cron_exec( $max_execution_time );
	}

	private function init_client(): bool {
		if ( empty( $this->serp_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key           = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config            = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->serp_client = new \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->serp_client );
	}


	public function get_description(): string {
		return __( 'Synchronizing SERP data', 'urlslab' );
	}


	protected function execute(): bool {
		if ( ! $this->has_rows ) {
			return false;
		}


		switch ( $this->widget->get_option( Urlslab_Serp::SETTING_NAME_SYNC_FREQ ) ) {
			case Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_DAILY:
				$update_delay = 86400;
				break;
			case Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_WEEKLY:
				$update_delay = 86400 * 7;
				break;
			case Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY:
				$update_delay = 86400 * 365;
				break;
			case Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY:
				$update_delay = 86400 * 30;
				break;
			default:
				$update_delay = 86400 * 30;
				break;
		}

		$types = explode( ',', $this->widget->get_option( Urlslab_Serp::SETTING_NAME_QUERY_TYPES ) );
		foreach ( $types as $id => $type ) {
			if ( isset( Urlslab_Serp::get_available_query_types()[ $type ] ) ) {
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

		if ( ! $this->widget->get_option( Urlslab_Serp::SETTING_NAME_SERP_API ) ) {
			// just selecting not processed ones
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type IN (' . $types . ') AND `status` = %s ORDER BY updated LIMIT 10', // phpcs:ignore
					Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
				),
				ARRAY_A
			); // phpcs:ignore
		} else {
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type IN (' . $types . ') AND `status` = %s OR (status = %s AND updated < %s ) ORDER BY updated LIMIT 10', // phpcs:ignore
					Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
					Urlslab_Serp_Query_Row::STATUS_PROCESSED,
					Urlslab_Data::get_now( time() - $update_delay )
				),
				ARRAY_A
			); // phpcs:ignore
		}


		if ( empty( $rows ) ) {
			$this->has_rows = false;

			return false;
		}

		$queries = array();
		for ( $i = 0 ; $i < min( count( $rows ), 5 ) ; $i ++ ) {
			$rand_idx = rand( 0, count( $rows ) - 1 );
			$new_q    = new Urlslab_Serp_Query_Row( $rows[ $rand_idx ] );
			$new_q->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSING );
			$new_q->update();
			array_splice( $rows, $rand_idx, 1 );
			$queries[] = $new_q;
		}

		try {
			$serp_conn     = Urlslab_Serp_Connection::get_instance();
			$serp_response = $serp_conn->bulk_search_serp( $queries, $this->widget->get_option( Urlslab_Serp::SETTING_NAME_SYNC_FREQ ) );

			foreach ( $serp_response->getSerpData() as $idx => $rsp ) {
				$serp_data = $serp_conn->extract_serp_data( $queries[ $idx ], $rsp, $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION ) );

				if ( is_bool( $serp_data ) && ! $serp_data ) {
					$queries[ $idx ]->set_status( Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED );
					$queries[ $idx ]->update();
				} else {
					// valid data
					$has_monitored_domain = $serp_data['has_monitored_domain'];
					$urls                 = $serp_data['urls'];
					$domains              = $serp_data['domains'];
					$positions            = $serp_data['positions'];

					if (
						$has_monitored_domain >= $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT ) ||
						Urlslab_Serp_Query_Row::TYPE_USER === $queries[ $idx ]->get_type() ||
						count( Urlslab_Serp_Domain_Row::get_monitored_domains() ) < $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IRRELEVANT_QUERY_LIMIT )
					) {

						$serp_conn->save_extracted_serp_data( $urls, $positions, $domains );

						$this->discoverNewQueries( $rsp );

						$queries[ $idx ]->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSED );

						if ( Urlslab_Serp_Query_Row::TYPE_SERP_FAQ === $queries[ $idx ]->get_type() && $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_FAQS ) ) {
							//if the question is relevant FAQ, add it to the FAQ table
							$faq_row = new Urlslab_Faq_Row( array( 'question' => ucfirst( $queries[ $idx ]->get_query() ) ), false );
							if ( ! $faq_row->load( array( 'question' ) ) ) {
								$faq_row->set_status( Urlslab_Faq_Row::STATUS_EMPTY );
								$faq_row->insert();
							}
						}
					} else {
						$queries[ $idx ]->set_status( Urlslab_Serp_Query_Row::STATUS_SKIPPED ); //irrelevant query
					}
				}
				$queries[ $idx ]->update();
			}
			Urlslab_Serp_Query_Row::update_serp_data();
			Urlslab_Serp_Url_Row::update_serp_data();
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}
			foreach ( $queries as $query ) {
				$query->set_status( Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED );
				$query->update();
			}

			return false;
		}

		return true;
	}

	private function get_serp_queries_count(): int {
		global $wpdb;
		if ( 0 > $this->serp_queries_count ) {
			$this->serp_queries_count = $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type=%s OR type=%s', Urlslab_Serp_Query_Row::TYPE_SERP_RELATED, Urlslab_Serp_Query_Row::TYPE_SERP_FAQ ) ); // phpcs:ignore
		}

		return $this->serp_queries_count;
	}

	/**
	 * @param $serp_response
	 *
	 * @return void
	 */
	private function discoverNewQueries( $serp_response ): void {
		//Discover new queries
		$fqs     = $serp_response->getFaqs();
		$queries = array();
		if ( ! empty( $fqs ) && $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_FAQS_AS_QUERY ) ) {
			foreach ( $fqs as $faq ) {
				$queries[] = new Urlslab_Serp_Query_Row(
					array(
						'query'  => strtolower( trim( $faq->question ) ),
						'status' => Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
						'type'   => Urlslab_Serp_Query_Row::TYPE_SERP_FAQ,
					)
				);
			}
		}

		$related = $serp_response->getRelatedSearches();
		if ( ! empty( $related ) && $this->widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES ) && $this->get_serp_queries_count() <= $this->widget->get_option( Urlslab_Serp::SETTING_NAME_SERP_IMPORT_LIMIT ) ) {
			foreach ( $related as $related_search ) {
				$queries[] = new Urlslab_Serp_Query_Row(
					array(
						'query'  => strtolower( trim( $related_search->query ) ),
						'status' => Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
						'type'   => Urlslab_Serp_Query_Row::TYPE_SERP_RELATED,
					)
				);
			}
		}
		if ( ! empty( $queries ) ) {
			$queries[0]->insert_all( $queries, true );
		}
	}
}
