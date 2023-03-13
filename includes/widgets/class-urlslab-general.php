<?php

// phpcs:disable WordPress

class Urlslab_General extends Urlslab_Widget {
	const SLUG = 'general';

	const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';
	const SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL = 'urlslab-refresh-scr';
	const SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL = 'urlslab-refresh-sum';

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_General::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Urlslab Integration' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Connect Urlslab.com services to your Wordpress.' );
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'api', __( 'Urlslab Integration' ), __( 'To activate all features in your get API key from www.urlslab.com and connect your plugin with your Urlslab plugin.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_API_KEY,
			'',
			true,
			__( 'API Key' ),
			__( 'Get Urlslab API key from https://www.urlslab.com' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			function( $value ) {
				if ( ! strlen( $value ) ) {
					return false;
				}

				$config = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $value );

				$apiInstance = new Swagger\Client\Urlslab\ApikeyApi(
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

		$this->add_options_form_section( 'cron', __( 'Cron tasks' ), __( 'Plugin connects periodically to www.urlslab.com and updates data in your installation. It is independent process to your domain schedules.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL,
			2419200,
			false,
			__( 'Reload Screenshots Interval' ),
			__( 'Define how often should check your wordpress plugin availability of new version of screenshot in your urlslab account. Even we reload the data on the background by cron task, it can use a lot of computation time. We recommend Monthly or Quarterly updates.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400     => __( 'Daily' ),
				604800    => __( 'Weekly' ),
				2419200   => __( 'Monthly' ),
				7257600   => __( 'Quarterly' ),
				31536000  => __( 'Yearly' ),
				999999999 => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'cron',
		);
		$this->add_option_definition(
			self::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL,
			2419200,
			false,
			__( 'Reload Summarization Interval' ),
			__( 'Define how often should check your wordpress plugin availability of new url summarization in your urlslab account. Even we reload the data on the background by cron task, it can use a lot of computation time. We recommend Monthly or Quarterly updates.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400     => __( 'Daily' ),
				604800    => __( 'Weekly' ),
				2419200   => __( 'Monthly' ),
				7257600   => __( 'Quarterly' ),
				31536000  => __( 'Yearly' ),
				999999999 => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'cron',
		);
	}
}
