<?php
require_once ABSPATH . 'wp-admin/includes/file.php';

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;

class Urlslab_Cron_Serp_Volumes extends Urlslab_Cron {
	private \Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi $serp_client;
	private $has_rows = true;
	private ?Urlslab_Widget_Serp $widget;

	private const BLACKLISTED_SYMBOLS = array(
		',',
		'!',
		'@',
		'%',
		'^',
		'(',
		')',
		'=',
		'{',
		'}',
		';',
		'~',
		'`',
		'<',
		'>',
		'?',
		'\\',
		'|',
		'―',
		'_',
		'*',
		'"',
		"'",
		'’',
	);

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

	private function get_rows(): array {
		global $wpdb;
		$query_data   = array();
		$query_data[] = Urlslab_Data_Serp_Query::STATUS_PROCESSED;

		$status_cond = '';
		$update_freq = (int) $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP_VOLUMES_SYNC_FREQ );
		$query_data[] = Urlslab_Data_Serp_Query::VOLUME_STATUS_NEW;
		$query_data[] = Urlslab_Data_Serp_Query::VOLUME_STATUS_PENDING;
		$query_data[] = Urlslab_Data_Serp_Query::get_now( time() - 3600 * 10 ); // update every 10 hours
		if ( 0 === $update_freq ) {
			$status_cond  = 'AND (country_vol_status=%s OR (country_vol_status=%s AND (country_last_updated<%s)))';
		} else {
			$status_cond  = 'AND (country_vol_status=%s OR (country_vol_status=%s AND (country_last_updated<%s))) OR (country_vol_status=%s AND country_last_updated<%s)';
			$query_data[] = Urlslab_Data_Serp_Query::VOLUME_STATUS_FINISHED;
			$query_data[] = Urlslab_Data_Serp_Query::get_now( time() - $update_freq );
		}

		$query_data[] = Urlslab_Data_Serp_Query::get_now();
		$rows         = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' USE INDEX (idx_country_scheduled) WHERE status=%s ' . $status_cond . ' LIMIT 100', // phpcs:ignore
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

		$rows = $this->get_rows();

		if ( empty( $rows ) ) {
			$this->has_rows = false;
			$this->lock( 300, self::LOCK );

			return false;
		}

		$country_queries = array();
		$country_objects = array();
		foreach ( $rows as $row ) {
			$query = new Urlslab_Data_Serp_Query( $row );
			if ( ! $query->is_valid() ) {
				$query->set_country_vol_status( Urlslab_Data_Serp_Query::VOLUME_STATUS_ERROR );
				$query->update();
			} else {
				$query->set_country_vol_status( Urlslab_Data_Serp_Query::VOLUME_STATUS_PENDING );
				$query->set_country_last_updated( Urlslab_Data_Serp_Query::get_now() );
				$query->update();
				$country_queries[ $query->get_country() ][] = strtolower( preg_replace( '!\s+!', ' ', trim( str_replace( self::BLACKLISTED_SYMBOLS, ' ', $query->get_query() ) ) ) );
				$country_objects[ $query->get_country() ][] = $query;
			}
		}

		try {
			$serp_conn = Urlslab_Connection_Serp::get_instance();

			foreach ( $country_queries as $country => $queries ) {
				$results = $serp_conn->bulk_search_volumes( $queries, $country );
				foreach ( $results->getKeywordAnalytics() as $idx => $result ) {
					switch ( $result->getKeywordStatus() ) {
						case \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalKeywordAnalyticsResponse::KEYWORD_STATUS_AVAILABLE:
							$country_objects[ $country ][ $idx ]->set_country_vol_status( Urlslab_Data_Serp_Query::VOLUME_STATUS_FINISHED );
							$country_objects[ $country ][ $idx ]->set_country_last_updated( Urlslab_Data_Serp_Query::get_now() );

							$country_objects[ $country ][ $idx ]->set_country_volume( $result->getSearchVolume() );
							$country_objects[ $country ][ $idx ]->set_country_kd( $result->getCompetitionIndex() );
							$country_objects[ $country ][ $idx ]->set_country_level( $result->getCompetitionLevel() );
							$country_objects[ $country ][ $idx ]->set_country_high_bid( $result->getHighTopOfPageBidMicros() );
							$country_objects[ $country ][ $idx ]->set_country_low_bid( $result->getLowTopOfPageBidMicros() );
							$country_objects[ $country ][ $idx ]->set_country_monthly_volumes( json_encode( $result->getMonthlySearches() ) );
							$country_objects[ $country ][ $idx ]->update();

							break;
						case \Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalKeywordAnalyticsResponse::KEYWORD_STATUS_ERROR:
							$country_objects[ $country ][ $idx ]->set_country_vol_status( Urlslab_Data_Serp_Query::VOLUME_STATUS_ERROR );
							$country_objects[ $country ][ $idx ]->update();
							break;
						default:
							break;
					}
				}
			}
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
			}
			$this->lock( 300, self::LOCK );

			return false;
		}

		return true;
	}

}
