<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;


class Urlslab_Connection_Related_Urls {
	private static Urlslab_Connection_Related_Urls $instance;
	private static ContentApi $content_client;

	public static function get_instance(): Urlslab_Connection_Related_Urls {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$content_client ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			self::$content_client = new ContentApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore

			return ! empty( self::$content_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );
	}

	public function get_related_urls_to_url( Urlslab_Data_Url $url, int $max_count, string $str_domains, int $not_older_than ) {
		// creating the request
		$domains                            = $this->get_searching_domains( $str_domains );
		$domains[ $url->get_domain_name() ] = $url->get_domain_name();

		return $this->get_related_urls( '', $url->get_url_name(), $max_count, $not_older_than, array_keys( $domains ) );
	}

	public function get_related_urls_to_query( string $query, int $max_count, string $str_domains, int $not_older_than ) {
		$domains = $this->get_searching_domains( $str_domains );

		return $this->get_related_urls( $query, '', $max_count, $not_older_than, array_keys( $domains ) );
	}

	private function get_related_urls( string $query, string $url, int $max_count, int $not_older_than, array $domains ) {
		// creating the request
		$request = new DomainDataRetrievalRelatedUrlsRequest();

		if ( ! empty( $url ) ) {
			$request->setUrl( $url );
		}
		if ( ! empty( $query ) ) {
			$request->setQuery( $query );
		}
		$request->setChunkLimit( 1 );
		$request->setRenewFrequency( DomainDataRetrievalRelatedUrlsRequest::RENEW_FREQUENCY_ONE_TIME );

		$query = new DomainDataRetrievalContentQuery();
		$query->setLimit( $max_count * 3 );
		$query->setDomains( $domains );
		$must_array   = array( (object) array( 'term' => (object) array( 'metadata.chunk_id' => (object) array( 'value' => 1 ) ) ) );
		$must_array[] = (object) array( 'term' => (object) array( 'metadata.indexStatus' => (object) array( 'value' => true ) ) );
		if ( $not_older_than > 0 ) {
			$must_array[] = (object) array( 'range' => (object) array( 'metadata.lastSeen' => (object) array( 'gte' => time() - $not_older_than ) ) );
		}
		$query->setAdditionalQuery( (object) array( 'bool' => (object) array( 'must' => $must_array ) ) );
		$request->setFilter( $query );

		$dest_urls = array();

		try {
			$response = self::$content_client->getRelatedUrls( $request );
			if ( empty( $response->getUrls() ) ) {
				return array();
			}
			foreach ( $response->getUrls() as $chunk ) {
				foreach ( $chunk as $dest_url ) {
					if ( count( $dest_urls ) < $max_count && ! in_array( $dest_url, $dest_urls ) ) {
						$dest_urls[] = $dest_url;
					}
				}
			}
		} catch ( Exception $e ) {
			//do nothing
		}

		return $dest_urls;
	}

	private function get_searching_domains( string $str_domains ): array {
		$domains = array();
		if ( ! empty( $str_domains ) ) {
			$arr_domains = preg_split( '/(,|\n|\t)\s*/', $str_domains );
			foreach ( $arr_domains as $domain ) {
				$domain = trim( $domain );
				if ( strlen( $domain ) ) {
					try {
						$domain_url                                = new Urlslab_Url( $domain, true );
						$domains[ $domain_url->get_domain_name() ] = $domain_url->get_domain_name();
					} catch ( Exception $e ) {
					}
				}
			}
		}

		return $domains;
	}


}
