<?php
require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;

class Urlslab_Cron_Serp_volumes extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;
	private $serp_queries_count = - 1;
	private ?Urlslab_Widget_Serp $widget;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! $this->has_rows || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Serp::SLUG ) ) {
			return false;
		}

		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG );
		if ( ! $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP ) || ! $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP_VOLUMES ) || ! $this->init_client() ) {
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
		return __( 'Synchronizing SERP volumes data', 'urlslab' );
	}

	private function get_new_queries():array {
		global $wpdb;
		$query_data   = array();
		$query_data[] = Urlslab_Data_Serp_Query::STATUS_PROCESSED;
		$query_data[] = Urlslab_Data_Serp_Query::VOLUME_STATUS_NEW;
		$rows         = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE status=%s AND country_vol_status=%s LIMIT 500', // phpcs:ignore
				$query_data
			),
			ARRAY_A
		); // phpcs:ignore

		return $rows;
	}

	protected function execute(): bool {
		if ( ! $this->has_rows ) {
			return false;
		}




		if ( empty( $rows ) ) {
			$this->has_rows = false;

			return false;
		}

		try {
			$serp_conn = Urlslab_Connection_Serp::get_instance();
			$results   = $serp_conn->bulk_search_volumes( $rows, 'us' );

			foreach ( $results->getKeywordAnalytics() as $result ) {
				switch ( $result->getKeywordStatus() ) {
					case \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalKeywordAnalyticsResponse::KEYWORD_STATUS_PENDING:
						break;
					case \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalKeywordAnalyticsResponse::KEYWORD_STATUS_UPDATING:
						break;
					case \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalKeywordAnalyticsResponse::KEYWORD_STATUS_AVAILABLE:
						break;
					default:
						break;
				}
			}

			$analitics = $result->getKeywordAnalytics();
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

}
