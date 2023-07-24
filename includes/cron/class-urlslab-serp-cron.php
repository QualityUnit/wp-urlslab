<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-js-cache-row.php';

require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Serp_Cron extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;
	private $domains = array();
	private $serp_queries_count = - 1;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! $this->has_rows || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Serp::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG );
		if ( ! $widget->get_option( Urlslab_Serp::SETTING_NAME_SERP_API ) ) {
			return false;
		}

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

			$widget        = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG );
			$str_domains   = $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES_DOMAINS );
			$arr_domains   = preg_split( '/(,|\n|\t)\s*/', $str_domains );
			$this->domains = array();
			foreach ( $arr_domains as $domain ) {
				$domain = trim( $domain );
				if ( strlen( $domain ) ) {
					try {
						$domain_url                                    = new Urlslab_Url( $domain, true );
						$this->domains[ $domain_url->get_domain_id() ] = $domain_url->get_domain_name();
					} catch ( Exception $e ) {
					}
				}
			}
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

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG );

		switch ( $widget->get_option( Urlslab_Serp::SETTING_NAME_SYNC_FREQ ) ) {
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

		global $wpdb;
		$row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE `status` = %s OR (status = %s AND updated < %s ) ORDER BY updated LIMIT 1', // phpcs:ignore
				Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
				Urlslab_Serp_Query_Row::STATUS_PROCESSED,
				Urlslab_Data::get_now( time() - $update_delay )
			),
			ARRAY_A
		); // phpcs:ignore

		if ( empty( $row ) ) {
			$this->has_rows = false;

			return false;
		}

		$query = new Urlslab_Serp_Query_Row( $row );
		$query->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSING );
		$query->update();

		$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();
		$request->setSerpQuery( $query->get_query() );
		$request->setLocale( $query->get_lang() );
		$request->setCountry( $query->get_country() );
		$request->setAllResults( true );
		$request->setNotOlderThan( $widget->get_option( Urlslab_Serp::SETTING_NAME_SYNC_FREQ ) );
		$has_monitored_domain = false;
		$urls                 = array();
		$positions            = array();

		try {
			$serp_response = $this->serp_client->search( $request );
			$organic       = $serp_response->getOrganicResults();

			if ( empty( $organic ) ) {
				$query->set_status( Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED );
				$query->update();

				return false;
			} else {
				foreach ( $organic as $organic_result ) {
					$url_obj = new Urlslab_Url( $organic_result->link, true );
					if ( isset( $this->domains[ $url_obj->get_domain_id() ] ) && $organic_result->position <= $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION ) ) {
						$has_monitored_domain = true;
					}

					$url         = new Urlslab_Serp_Url_Row(
						array(
							'url_name'        => $organic_result->link,
							'url_title'       => $organic_result->title,
							'url_description' => $organic_result->snippet,
							'url_id'          => $url_obj->get_url_id(),
							'domain_id'       => $url_obj->get_domain_id(),
						)
					);
					$urls[]      = $url;
					$positions[] = new Urlslab_Serp_Position_Row(
						array(
							'position' => $organic_result->position,
							'query_id' => $query->get_query_id(),
							'url_id'   => $url->get_url_id(),
						)
					);
				}
			}

			if ( $has_monitored_domain ) {
				if ( ! empty( $urls ) ) {
					$urls[0]->insert_all( $urls, true );
				}
				if ( ! empty( $positions ) ) {
					$positions[0]->insert_all( $positions, true );
				}

				$fqs = $serp_response->getFaqs();
				if ( ! empty( $fqs ) && $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_FAQS ) ) {
					foreach ( $fqs as $faq ) {
						$faq_row = new Urlslab_Faq_Row( array( 'question' => $faq->question ), false );
						if ( $faq_row->load( array( 'question' ) ) ) {
							continue;
						}
						$faq_row->set_status( Urlslab_Faq_Row::STATUS_EMPTY );
						$faq_row->insert();
					}
				}

				$related = $serp_response->getRelatedSearches();
				if ( ! empty( $related ) && $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES ) && $this->get_serp_queries_count() <= $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_LIMIT ) ) {
					$queries = array();
					foreach ( $related as $related_search ) {
						$queries[] = new Urlslab_Serp_Query_Row(
							array(
								'query'   => strtolower( trim( $related_search->query ) ),
								'lang'    => $query->get_lang(),
								'country' => $query->get_country(),
								'status'  => Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
							)
						);
					}
					if ( ! empty( $queries ) ) {
						$queries[0]->insert_all( $queries, true );
					}
				}
			}

			$query = new Urlslab_Serp_Query_Row( $row );
			if ( $has_monitored_domain ) {
				$query->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSED );
			} else {
				$query->set_status( Urlslab_Serp_Query_Row::STATUS_SKIPPED );
			}
			$query->update();
		} catch ( ApiException $e ) {
			$query->set_status( Urlslab_Serp_Query_Row::STATUS_ERROR );

			if ( in_array( $e->getCode(), array( 402, 429 ) ) ) {
				$query->set_status( Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED );
			}

			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}

			$query->update();

			return false;
		}

		return true;
	}

	private function get_serp_queries_count(): int {
		global $wpdb;
		if ( 0 > $this->serp_queries_count ) {
			$this->serp_queries_count = $wpdb->get_var( 'SELECT COUNT(*) FROM ' . URLSLAB_SERP_QUERIES_TABLE ); // phpcs:ignore
		}

		return $this->serp_queries_count;
	}
}
