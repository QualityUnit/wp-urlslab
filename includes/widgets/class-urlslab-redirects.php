<?php

class Urlslab_Redirects extends Urlslab_Widget {
	const SLUG = 'redirects';
	const SETTING_NAME_LOGGING = 'urlslab_redir_log';
	const SETTING_NAME_LOG_HISTORY_MAX_TIME = 'urlslab_redir_log_max_time';
	const SETTING_NAME_LOG_HISTORY_MAX_ROWS = 'urlslab_redir_log_max_rows';
	const SETTING_NAME_DEFAULT_REDIRECT_URL = 'urlslab_redir_default_url';
	const SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE = 'urlslab_redir_default_url_image';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'template_redirect', $this, 'template_redirect', PHP_INT_MAX, 0 );
	}

	function template_redirect() {
		if ( is_404() ) {
			$this->log_not_found_url();
			$this->default_redirect(); //last option should be default redirect
		}
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Redirects::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Redirects' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Manage redirects and monitor not found pages (404) in your installation' );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	public function log_not_found_url(): void {
		if ( $this->get_option( self::SETTING_NAME_LOGGING ) ) {
			$request = wp_unslash( filter_var( $_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL ) );
			$url     = new Urlslab_Url( $request );
			$log     = new Urlslab_Not_Found_Log_Row(
				array(
					'url'    => $url->get_url_with_protocol(),
					'url_id' => $url->get_url_id(),
					'cnt'    => 1,
				)
			);
			$log->upsert();
		}
	}

	/**
	 * @return void
	 */
	public function default_redirect(): void {
		if ( preg_match( '/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif)/i', $_SERVER['REQUEST_URI'] ) ) {
			if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE ) ) ) {
				wp_redirect( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE ), 301, 'URLsLab' );
				exit;
			}
		}

		if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ) ) ) {
			wp_redirect( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ), 301, 'URLsLab'  );
			exit;
		}
	}

	protected function add_options() {
		$this->add_options_form_section( 'redirecting', __( '404 Redirect setting' ), __( 'Customize default behavior of redirects if visitor hits 404 Not found URL.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_REDIRECT_URL,
			'',
			false,
			__( 'Default redirect URL' ),
			__( 'If no other redirect rule matched, redirect every 404 Not found request to default URL. Leave empty if standard 404 page should be used. Value must be valid URL!' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || filter_var( $value, FILTER_VALIDATE_URL );
			},
			'redirecting'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE,
			'',
			false,
			__( 'Default redirect URL for images' ),
			__( 'If the 404 url is image (identified based on the extension), plugin can redirect browser to any default image of your choice. We recommend at least to use 1px image. Value must be valid URL!' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || filter_var( $value, FILTER_VALIDATE_URL );
			},
			'redirecting'
		);


		$this->add_options_form_section( 'logging', __( 'Logging' ), __( 'Logging of all 404 redirects and not found pages helps you to setup effective redirect rules. On the other hand it can easily overload your system in case of attacks.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_LOGGING,
			false,
			false,
			__( 'Activate logging' ),
			__( 'Log each 404 event in database' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'logging'
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOG_HISTORY_MAX_TIME,
			604800,
			false,
			__( 'Delete old logs' ),
			__( 'Define how long you want to keep history of old rows in log. If there was no 404 certain amount of time, we delete such row automatically.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400   => __( '1 day' ),
				604800  => __( '1 week' ),
				2419200 => __( '1 month' ),
				0       => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'logging'
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOG_HISTORY_MAX_ROWS,
			10000,
			false,
			__( 'Limit rows' ),
			__( 'Define maximum rows in redirects log table. Once your DB reach this limit, we will delete all rows at once and logging starts with empty table. This setting helps you to keep your database size under control.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				0       => __( 'Unlimited' ),
				100     => __( '100' ),
				1000    => __( '1.000' ),
				10000   => __( '10.000' ),
				50000   => __( '50.000' ),
				100000  => __( '100.000' ),
				1000000 => __( '1.000.000' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'logging'
		);

	}
}
