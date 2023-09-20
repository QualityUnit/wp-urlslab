<?php

// phpcs:disable WordPress

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ApikeyApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_General extends Urlslab_Widget {
	public const SLUG = 'general';

	public const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';
	public const SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL = 'urlslab-refresh-sum';
	public const SETTING_NAME_URLSLAB_CREDITS = 'urlslab-credits';
	const SETTING_NAME_DOMAIN_BLACKLIST = 'urlslab-url-blacklist';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'URLsLab Integration' );
	}

	public function get_widget_description(): string {
		return __( 'Connect Urlslab.com services to your Wordpress.' );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'api', __( 'Integration with URLsLab' ), __( 'Use the URLsLab service to automate tasks. Save hours of tedious work and obtain precise results - it\'s the efficient way to automate data processing!' ) );
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_API_KEY,
			'',
			true,
			__( 'URLsLab API Key' ),
			__( 'Link your website with the URLsLab service using an API Key. Obtain your API Key from https://www.urlslab.com.' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			function( $value ) {
				if ( ! strlen( $value ) ) {
					return false;
				}

				if ( Urlslab_Widget::PASSWORD_PLACEHOLDER == $value ) {
					return true;
				}

				$config = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $value );

				$apiInstance = new ApikeyApi(
					new GuzzleHttp\Client(),
					$config
				);

				try {
					$result = $apiInstance->validate();

					return $result->getAcknowledged();
				} catch ( Exception $e ) {
					return false;
				}

				return false;
			},
			'api'
		);
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_CREDITS,
			- 1,
			false,
			__( 'URLsLab Credits' ),
			__( 'Latest known credits balance' ),
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'api'
		);

		$this->add_options_form_section( 'cron', __( 'Synchronization' ), __( 'Some data is produced by the URLsLab service. Adjust the synchronization frequency between URLsLab service and the plugin here.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL,
			2419200,
			false,
			__( 'Frequency of Summary Synchronization with URLsLab Service' ),
			__( 'The frequency of summary sync with URLsLab differs from the rate at which URLsLab creates page summaries. Even with background data sync via cron, significant computation time may be used.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31536000         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'cron',
		);

		$this->add_options_form_section( 'blacklist', __( 'Processing Blacklist' ), __( 'Save processing power of your server and costs required to do certain operation like screenshots or summaries on domains or URLs, which are not interested for your content development and SEO efforts' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DOMAIN_BLACKLIST,
			'',
			true,
			__( 'Domain blacklist' ),
			__( 'Enter list of blacklisted domain names. URLs with hostname matching domain name from blacklist will be skipped for processing of certain operations in your plugin. This could significantly reduce the amount of processing power. Domain names with or without www are handled equaly (e.g. to skip processing of www.anydomain.com, enter just anydomain.com). Internally are blacklisted already domains: ' ) . implode( ', ', Urlslab_Url::$domain_blacklists ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'blacklist',
		);

	}

	public static function is_urlslab_active(): bool {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG );

		return strlen( $widget->get_option( self::SETTING_NAME_URLSLAB_API_KEY ) ) > 0 && $widget->get_option( self::SETTING_NAME_URLSLAB_CREDITS ) > 0;
	}

}
