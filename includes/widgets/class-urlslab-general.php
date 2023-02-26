<?php

// phpcs:disable WordPress

class Urlslab_General extends Urlslab_Widget {
	const SLUG = 'general';

	const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return self::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Settings' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Urlslab.com integration' );
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_API_KEY,
			'',
			true,
			__( 'API Key' ),
			__( 'Get Urlslab API key from https://www.urlslab.com' ),
			self::OPTION_TYPE_PASSWORD
		);
	}
}
