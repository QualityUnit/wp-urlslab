<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-js-cache-row.php';

require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Serp_Cron extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;

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

		global $wpdb;
		$row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE `status` = %s OR (status = %s AND updated < %s ) ORDER BY updated LIMIT 1', // phpcs:ignore
				Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
				Urlslab_Serp_Query_Row::STATUS_PROCESSED,
				date( 'Y-m-d H:i:s', time() - 60 * 60 * 24 * 7 )
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
		$request->setCountry( 'us' );
		$request->setAllResults( true );
		$request->setNotOlderThan( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY );

		try {
			$serp_response = $this->serp_client->search( $request );
			$fqs           = $serp_response->getFaqs();
			if ( ! empty( $fqs ) && $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_FAQS ) ) {
				foreach ( $fqs as $faq ) {

					$faq_row = new Urlslab_Faq_Row(
						array(
							'question' => $faq->question
						)
					);
					if ( $faq_row->load( array( 'question' ) ) ) {
						continue;
					}
					$faq_row->set_status( Urlslab_Faq_Row::STATUS_EMPTY );
					$faq_row->insert();
				}
			}
			$organic = $serp_response->getOrganicResults();
			if ( ! empty( $organic ) ) {
				$urls = array();
				$positions = array();
				foreach ( $organic as $organic_result ) {
					$url = new Urlslab_Serp_Url_Row(
						array(
							'url_name' => $organic_result->link,
							'url_title'    => $organic_result->title,
							'url_description' => $organic_result->snippet,
						)
					);
					$urls[] = $url;
					$positions[] = new Urlslab_Serp_Position_Row(
						array(
							'position' => $organic_result->position,
							'query_id' => $query->get_query_id(),
							'url_id' => $url->get_url_id(),
						)
					);
				}
				if (!empty($urls)) {
					$urls[0]->insert_all($urls, true);
				}
				if (!empty($positions)) {
					$positions[0]->insert_all($positions, true);
				}
			}
			$related = $serp_response->getRelatedSearches();
			if ( ! empty( $related ) && $widget->get_option( Urlslab_Serp::SETTING_NAME_IMPORT_RELATED_QUERIES ) ) {
				$queries = array();
				foreach ( $related as $related_search ) {
					$queries[] = new Urlslab_Serp_Query_Row(
						array(
							'query' => strtolower( trim( $related_search->query ) ),
							'lang' => $query->get_lang(),
							'status' => Urlslab_Serp_Query_Row::STATUS_NOT_PROCESSED,
						)
					);
				}
				if (!empty($queries)) {
					$queries[0]->insert_all($queries, true);
				}
			}

			$query = new Urlslab_Serp_Query_Row( $row );
			$query->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSED );
			$query->update();
		} catch ( Exception $e ) {
			$query->set_status( Urlslab_Serp_Query_Row::STATUS_ERROR );
			$query->update();

			return false;
		}

		return true;
	}
}
