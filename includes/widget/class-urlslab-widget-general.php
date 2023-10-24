<?php

// phpcs:disable WordPress

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ApikeyApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Widget_General extends Urlslab_Widget {
	public const SLUG = 'general';

	public const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';
	public const SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL = 'urlslab-refresh-sum';
	public const SETTING_NAME_URLSLAB_CREDITS = 'urlslab-credits';
	const SETTING_NAME_DOMAIN_BLACKLIST = 'urlslab-url-blacklist';
	const SETTING_NAME_CLASSNAMES_BLACKLIST = 'urlslab-classnames-blacklist';

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

		$this->add_options_form_section( 'disallowed', __( 'Disallowed Domains' ), __( 'Preserve your server\'s computational capacity and cut down on costs associated with operations such as screen captures or summaries on unrelated domains or URLs to your SEO strategy.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DOMAIN_BLACKLIST,
			'',
			true,
			__( 'Disallowed Domains' ),
			__( 'Enter a list of disallowed domain names, excluding www and protocol. URLs with hostnames that match these domain names will be bypassed for processing specific actions in your plugin. This can significantly cut down processing power and expenses. Domains already internally disallowed: <i>' ) . implode( ', ', Urlslab_Url::$domain_blacklists ) . __( '</i>' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'disallowed',
		);

		$this->add_options_form_section( 'dom', __( 'DOM modifications' ), __( 'Multiple modules in this plugin modify HTML DOM objects what could in some places damage parts of your website. To skip processing some parts of your website simply define list of classnames we should never touch in yur HTML.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_CLASSNAMES_BLACKLIST,
			'blogbutton, wp-block-archives, readmore-btn, post_meta',
			true,
			__( 'CSS Classnames to skip' ),
			__( 'Comma-separated list of CSS classnames. If any HTML element contains one of these CSS classnames (or substring in classname), we will not process it with any of UrlsLab plugin modules.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'dom',
		);

	}

	public static function is_urlslab_active(): bool {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );

		return strlen( $widget->get_option( self::SETTING_NAME_URLSLAB_API_KEY ) ) > 0 && $widget->get_option( self::SETTING_NAME_URLSLAB_CREDITS ) > 0;
	}

	public function register_routes() {
		( new Urlslab_Api_Modules() )->register_routes();
		( new Urlslab_Api_Settings() )->register_routes();
		( new Urlslab_Api_Labels() )->register_routes();
		( new Urlslab_Api_Billing() )->register_routes();
		( new Urlslab_Api_Cron() )->register_routes();
		( new Urlslab_Api_Schedules() )->register_routes();
		( new Urlslab_Api_Permissions() )->register_routes();
		( new Urlslab_Api_Tasks() )->register_routes();
		( new Urlslab_Api_Urls() )->register_routes();
		( new Urlslab_Api_Screenshots() )->register_routes();
		( new Urlslab_Api_Meta_Tags() )->register_routes();
	}
}
