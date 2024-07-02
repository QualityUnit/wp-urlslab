<?php

use OpenAPI\Client\Configuration;

class Urlslab_Connection_Flowhunt {

	public static function getConfiguration( $optional_api_key = null ): Configuration {
		if ( ! strlen( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_API_KEY ) ) ) {
			throw new Exception( 'FlowHunt API key not defined' );
		}

		$config = Configuration::getDefaultConfiguration();
		if ( $optional_api_key ) {
			$config->setApiKey( 'Api-Key', $optional_api_key );
		} else {
			$config->setApiKey( 'Api-Key', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_API_KEY ) );
		}
		$config->setHost( 'https://api.flowhunt.io' );

		return $config;
	}

	public static function getWorkspaceId(): string {
		return Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_WORKSPACE_ID );
	}
}
