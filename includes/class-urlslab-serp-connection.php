<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchResponse;

class Urlslab_Serp_Connection {

	private static Urlslab_Serp_Connection $instance;
	private static SerpApi $serp_client;

	public static function get_instance(): Urlslab_Serp_Connection {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$serp_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key           = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config            = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			self::$serp_client = new SerpApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore

			return ! empty( self::$serp_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );

	}

	public function search_serp( Urlslab_Serp_Query_Row $query, string $not_older_than ) {
		// preparing needed operators
		$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();
		$request->setSerpQuery( $query->get_query() );
		$request->setAllResults( true );
		$request->setNotOlderThan( $not_older_than );

		return self::$serp_client->search( $request );
	}

	/**
	 * @param Urlslab_Serp_Query_Row[] $queries
	 * @param string $not_older_than
	 *
	 * @return \OpenAPI\Client\Model\DomainDataRetrievalSerpApiBulkSearchResponse
	 * @throws \OpenAPI\Client\ApiException
	 */
	public function bulk_search_serp( array $queries, string $not_older_than ) {
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

	public function extract_serp_data( Urlslab_Serp_Query_Row $query, $serp_response, int $max_import_pos ) {
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
				if ( isset( Urlslab_Serp_Domain_Row::get_monitored_domains()[ $url_obj->get_domain_id() ] ) && $organic_result->position <= $max_import_pos ) {
					$has_monitored_domain ++;
				}

				if ( 10 >= $organic_result->position || isset( Urlslab_Serp_Domain_Row::get_monitored_domains()[ $url_obj->get_domain_id() ] ) ) {
					$url    = new Urlslab_Serp_Url_Row(
						array(
							'url_name'        => $organic_result->getLink(),
							'url_title'       => $organic_result->getTitle(),
							'url_description' => $organic_result->getDescription(),
							'url_id'          => $url_obj->get_url_id(),
							'domain_id'       => $url_obj->get_domain_id(),
						)
					);
					$urls[] = $url;

					$domains[] = new Urlslab_Serp_Domain_Row(
						array(
							'domain_id'   => $url->get_domain_id(),
							'domain_name' => $url_obj->get_domain_name(),
						),
						false
					);

					$positions[]         = new Urlslab_Serp_Position_Row(
						array(
							'position'  => $organic_result->getPosition(),
							'query_id'  => $query->get_query_id(),
							'country'   => $query->get_country(),
							'url_id'    => $url->get_url_id(),
							'domain_id' => $url->get_domain_id(),
						)
					);
					$positions_history[] = new Urlslab_Serp_Position_History_Row(
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
}
