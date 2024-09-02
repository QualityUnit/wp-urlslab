<?php

use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\FlowsApi;

class Urlslab_Connection_Flows {

	private static Urlslab_Connection_Flows $instance;
	private static FlowsApi $client;

	public static function get_instance(): Urlslab_Connection_Flows {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			self::$client = new FlowsApi( new Client( array( 'timeout' => 59 ) ), Urlslab_Connection_FlowHunt::getConfiguration() ); //phpcs:ignore
			return ! empty( self::$client );
		}

		throw new ApiException( esc_html( __( 'Not Enough FlowHunt Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}

	public function get_client(): FlowsApi {
		return self::$client;
	}
}
