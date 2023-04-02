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
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$url = new Urlslab_Url( $_SERVER['REQUEST_URI'] );

			$redirects = $this->get_redirects();
			foreach ( $redirects as $redirect ) {
				if ( $this->is_match( $redirect, $url ) ) {
					$redirect->increase_cnt();
					wp_redirect( $redirect->get_replace_url(), $redirect->get_redirect_code() );
					exit;
				}
			}
		}


		if ( is_404() ) {
			$this->log_not_found_url();
			$this->default_image_redirect();
			$this->default_redirect(); //last option should be default redirect
		}
	}

	public function is_match( Urlslab_Redirect_Row $redirect, Urlslab_Url $url ) {

		switch ( $redirect->get_match_type() ) {
			case Urlslab_Redirect_Row::MATCH_TYPE_EXACT:
				if ( $redirect->get_match_url() != $url->get_url_with_protocol() ) {
					return false;
				}
				break;
			case Urlslab_Redirect_Row::MATCH_TYPE_SUBSTRING:
				if ( false === strpos( $url->get_url_with_protocol(), $redirect->get_match_url() ) ) {
					return false;
				}
				break;
			case Urlslab_Redirect_Row::MATCH_TYPE_REGEXP:
				if ( ! preg_match( '|' . str_replace( '|', '\\|', $redirect->get_match_url() ) . '|uim', $url->get_url_with_protocol() ) ) {
					return false;
				}
				break;
			default:
				return false;
		}

		if ( Urlslab_Redirect_Row::IF_NOT_FOUND == $redirect->get_if_not_found() && ! is_404() ) {
			return false;
		}

		if ( ! empty( $redirect->get_is_logged() ) ) {
			if ( Urlslab_Redirect_Row::IS_LOGGED_LOGIN_REQUIRED == $redirect->get_is_logged() && ! is_user_logged_in() ) {
				return false;
			} else if ( Urlslab_Redirect_Row::IS_LOGGED_NOT_LOGGED == $redirect->get_is_logged() && is_user_logged_in() ) {
				return false;
			}
		}

		if ( ! empty( $redirect->get_capabilities() ) ) {
			$capabilities = explode( ',', $redirect->get_capabilities() );
			if ( ! empty( $capabilities ) ) {
				$has_cap = false;
				foreach ( $capabilities as $capability ) {
					if ( current_user_can( trim( $capability ) ) ) {
						$has_cap = true;
						break;
					}
				}
				if ( ! $has_cap ) {
					return false;
				}
			}
		}

		if ( ! empty( $redirect->get_browser() ) && isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
			$browsers = explode( ',', $redirect->get_browser() );
			if ( ! empty( $browsers ) ) {
				$has_browser = false;
				foreach ( $browsers as $browser_name ) {
					if ( preg_match( '|' . preg_quote( trim( $browser_name ), '|' ) . '|mui', $_SERVER['HTTP_USER_AGENT'] ) ) {//phpcs:ignore
						$has_browser = true;
						break;
					}
				}
				if ( ! $has_browser ) {
					return false;
				}
			}
		}

		if ( ! empty( $redirect->get_cookie() ) ) {
			$cookies = explode( ',', $redirect->get_cookie() );
			if ( ! empty( $cookies ) ) {
				$has_cookie = false;
				if ( ! empty( $_COOKIE ) ) {
					foreach ( $cookies as $cookie_str ) {
						$cookie = explode( '=', $cookie_str );

						if ( isset( $_COOKIE[ trim( $cookie[0] ) ] ) && ( ! isset( $cookie[1] ) || $_COOKIE[ trim( $cookie[0] ) ] == trim( $cookie[1] ) ) ) {//phpcs:ignore
							$has_cookie = true;
							break;
						}
					}
				}
				if ( ! $has_cookie ) {
					return false;
				}
			}
		}

		if ( ! empty( $redirect->get_headers() ) ) {
			$headers = explode( ',', $redirect->get_headers() );
			if ( ! empty( $headers ) ) {
				$has_header = false;
				if ( ! empty( $_SERVER ) ) {
					foreach ( $headers as $header_str ) {
						$header = explode( '=', $header_str );

						if ( isset( $_SERVER[ trim( $header[0] ) ] ) && ( ! isset( $header[1] ) || $_SERVER[ trim( $header[0] ) ] == trim( $header[1] ) ) ) {//phpcs:ignore
							$has_header = true;
							break;
						}
					}
				}
				if ( ! $has_header ) {
					return false;
				}
			}
		}

		if ( ! empty( $redirect->get_params() ) ) {
			$params = explode( ',', $redirect->get_params() );
			if ( ! empty( $params ) ) {
				$has_param = false;
				if ( ! empty( $_REQUEST ) ) {
					foreach ( $params as $param_str ) {
						$param = explode( '=', $param_str );

						if ( isset( $_REQUEST[ trim( $param[0] ) ] ) && ( ! isset( $param[1] ) || $_REQUEST[ trim( $param[0] ) ] == trim( $param[1] ) ) ) {//phpcs:ignore
							$has_param = true;
							break;
						}
					}
				}
				if ( ! $has_param ) {
					return false;
				}
			}
		}


		return true;
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
		if ( $this->get_option( self::SETTING_NAME_LOGGING ) && isset( $_SERVER['REQUEST_URI'] ) ) {
			$url = new Urlslab_Url( wp_unslash( filter_var( $_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL ) ) );
			$log = new Urlslab_Not_Found_Log_Row(
				array(
					'url'    => $url->get_url_with_protocol(),
					'url_id' => $url->get_url_id(),
					'cnt'    => 1,
				)
			);
			$log->upsert();
		}
	}

	private function default_image_redirect() {
		if ( isset( $_SERVER['REQUEST_URI'] ) && preg_match( '/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif)/i', $_SERVER['REQUEST_URI'] ) ) {
			if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE ) ) ) {
				wp_redirect( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE ), 301, 'URLsLab' );
				exit;
			}
		}
	}

	/**
	 * @return void
	 */
	public function default_redirect(): void {
		if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ) ) ) {
			wp_redirect( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ), 301, 'URLsLab' );
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

	/**
	 * @return Urlslab_Redirect_Row[]
	 */
	private function get_redirects(): array {
		$redirects = wp_cache_get( 'redirects', 'urlslab' );
		if ( false === $redirects ) {
			$redirects = $this->get_redirects_from_db();
			wp_cache_set( 'redirects', $redirects, 'urlslab', 300 );
		}

		return $redirects;
	}

	private function get_redirects_from_db() {
		$redirects = array();
		global $wpdb;
		$results = $wpdb->get_results( 'SELECT * FROM ' . URLSLAB_REDIRECTS_TABLE, 'ARRAY_A' ); // phpcs:ignore
		foreach ( $results as $result ) {
			$redirects[] = new Urlslab_Redirect_Row( $result );
		}

		return $redirects;
	}


	public static function delete_cache() {
		wp_cache_delete( 'redirects', 'urlslab' );
	}
}
