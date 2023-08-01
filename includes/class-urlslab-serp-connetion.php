<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\SerpApi;

class Urlslab_Serp_Connetion {

	private static Urlslab_Serp_Connetion $instance;
	private static SerpApi $serp_client;

	public static function get_instance(): Urlslab_Serp_Connetion {
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
		}

		return ! empty( self::$serp_client );
	}

	public function search_serp( Urlslab_Serp_Query_Row $query, string $not_older_than ) {
		// preparing needed operators
		$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();
		$request->setSerpQuery( $query->get_query() );
		$request->setAllResults( true );
		$request->setNotOlderThan( $not_older_than );

		return self::$serp_client->search( $request );
	}


}
