<?php

// phpcs:disable WordPress

use OpenAPI\Client\Configuration;
use OpenAPI\Client\Urlslab\ApikeyApi;

class Urlslab_General extends Urlslab_Widget {
	public const SLUG = 'general';

	public const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';
	public const SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL = 'urlslab-refresh-sum';

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
		$this->add_options_form_section( 'api', __( 'URLsLab Integration' ), __( 'With URLsLab service, you can unlock the full potential of the module and reap the benefits of automation. Save yourself hours of tedious work and get accurate results - it\'s the smart way to automate data processing!' ) );
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_API_KEY,
			'',
			true,
			__( 'URLsLab API Key' ),
			__( 'Connect the website and URLsLab service with an API Key. Get your API Key on www.urlslab.com.' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			function ( $value ) {
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

		$this->add_options_form_section( 'cron', __( 'Synchronisation' ), __( 'Some data are generated by the URLsLab service. You can adjust the frequency of data synchronisation between the URLsLab service and plugin here.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL,
			2419200,
			false,
			__( 'Synchronisation Frequency of Summaries with URLsLab service' ),
			__( 'The synchronisation frequency of summaries with the URLsLab service is different from how often URLsLab generates summaries of the pages. Even when we sync the data in the background by cron, it can use a lot of computation time. Therefore, we recommend Monthly or Quarterly synchronisations.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31536000         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function ( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'cron',
		);
	}
}
