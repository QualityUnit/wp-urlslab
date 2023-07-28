<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';
require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Gsc_Cron extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\AnalyticsApi $analytics_client;
	private $has_rows = true;

	const MAX_ROWS = 5000;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if (
			! $this->has_rows ||
			! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Serp::SLUG ) ||
			! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG )->get_option( Urlslab_Serp::SETTING_NAME_GSC_IMPORT )
		) {
			return false;
		}

		if ( ! $this->init_client() ) {
			return false;
		}

		return parent::cron_exec( $max_execution_time );
	}

	private function init_client(): bool {
		if ( empty( $this->analytics_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key                = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config                 = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->analytics_client = new \Urlslab_Vendor\OpenAPI\Client\Urlslab\AnalyticsApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->analytics_client );
	}


	public function get_description(): string {
		return __( 'Synchronizing Google Search Console data', 'urlslab' );
	}


	protected function execute(): bool {
		global $wpdb;

		$site_row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_GSC_SITES_TABLE . ' WHERE date_to < %s ORDER BY updated ASC LIMIT 1', gmdate( 'Y-m-d' ) ), ARRAY_A ); // phpcs:ignore
		if ( empty( $site_row ) ) {
			$this->has_rows = false;

			return false;
		}

		$site = new Urlslab_Gsc_Site_Row( $site_row );
		$site->set_updated( Urlslab_Gsc_Site_Row::get_now() );
		if ( $site->get_date_to() !== gmdate( 'Y-m-d', strtotime( '-1 days' ) ) ) {
			$site->set_date_to( gmdate( 'Y-m-d', strtotime( '-1 days' ) ) );
			$site->set_row_offset( 0 );
		} else {
			$site->set_row_offset( $site->get_row_offset() + self::MAX_ROWS );
		}
		$site->update();


		$request = new \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAnalyticsSearchRequest();
		$request->setRowLimit( self::MAX_ROWS );
		$request->setOffset( $site->get_row_offset() );
		$request->setSiteUrl( $site->get_site_name() );
		$request->setStartDate( gmdate( 'Y-m-d', strtotime( '-31 days' ) ) );
		$request->setEndDate( gmdate( 'Y-m-d', strtotime( '-1 days' ) ) );
		try {
			$results = $this->analytics_client->getTopKeywords( $request );
			$rows    = $results->getRows();
			if ( empty( $rows ) || count( $rows ) < self::MAX_ROWS || $site->get_row_offset() > Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG )->get_option( Urlslab_Serp::SETTING_NAME_GSC_LIMIT ) ) {
				$this->has_rows = false;
				$site->set_date_to( gmdate( 'Y-m-d' ) );
				$site->set_row_offset( 0 );
				$site->set_updated( Urlslab_Gsc_Site_Row::get_now() );
				$site->update();
			}
			$positions = array();
			$queries   = array();
			$urls      = array();
			$domains   = array();
			foreach ( $rows as $row ) {
				$key = $row->getKey();

				$url    = new Urlslab_Url( $key[1], true );
				$urls[] = new Urlslab_Serp_Url_Row(
					array(
						'url_id'    => $url->get_url_id(),
						'domain_id' => $url->get_domain_id(),
						'url_name'  => $url->get_url(),
					),
					false
				);

				$domain                           = new Urlslab_Serp_Domain_Row(
					array(
						'domain_id'   => $url->get_domain_id(),
						'domain_name' => $url->get_domain_name(),
					),
					false
				);
				$domains[ $url->get_domain_id() ] = $domain;

				$query                             = new Urlslab_Serp_Query_Row(
					array(
						'query'   => $key[0],
						'lang'    => 'en',    //TODO
						'type'    => Urlslab_Serp_Query_Row::TYPE_GSC,
						'country' => 'us', //TODO
					),
					false
				);
				$queries[ $query->get_query_id() ] = $query;

				$positions[] = new Urlslab_Gsc_Position_Row(
					array(
						'query_id'    => $query->get_query_id(),
						'url_id'      => $url->get_url_id(),
						'domain_id'   => $url->get_domain_id(),
						'position'    => $row->getPosition(),
						'clicks'      => $row->getClicks(),
						'impressions' => $row->getImpressions(),
						'ctr'         => $row->getCtr(),
					),
					false
				);
			}
			if ( ! empty( $urls ) ) {
				$urls[0]->insert_all( $urls, true );
			}
			if ( ! empty( $domains ) ) {
				$d = new Urlslab_Serp_Domain_Row();
				$d->insert_all( $domains, true );
			}
			if ( ! empty( $queries ) ) {
				$q = new Urlslab_Serp_Query_Row();
				$q->insert_all( $queries, true );
			}
			if ( ! empty( $positions ) ) {
				$positions[0]->insert_all(
					$positions,
					false,
					array(
						'position',
						'clicks',
						'impressions',
						'ctr',
						'updated',
					)
				);
			}
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}
			$site->set_date_to( gmdate( 'Y-m-d' ) );
			$site->set_row_offset( 0 );
			$site->set_updated( Urlslab_Gsc_Site_Row::get_now() );
			$site->update();

			return false;
		}

		return true;
	}
}
