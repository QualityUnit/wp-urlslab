<?php

class Urlslab_Redirects extends Urlslab_Widget {
	public const SLUG = 'redirects';
	public const SETTING_NAME_LOGGING = 'urlslab_redir_log';
	public const SETTING_NAME_LOG_HISTORY_MAX_TIME = 'urlslab_redir_log_max_time';
	public const SETTING_NAME_LOG_HISTORY_MAX_ROWS = 'urlslab_redir_log_max_rows';
	public const SETTING_NAME_DEFAULT_REDIRECT_URL = 'urlslab_redir_default_url';
	public const SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE = 'urlslab_redir_default_url_image';

	public const CACHE_GROUP = 'urlslab_redirects';
	const SETTING_NAME_AI_REDIRECTS = 'urlslab_redir_ai_redirects';
	const SETTING_NAME_MIN_404_COUNT = 'urlslab_redir_min_404_count';

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_AI, self::LABEL_FREE, self::LABEL_PAID );
	}

	public static function delete_cache() {
		if ( wp_using_ext_object_cache() ) {
			if ( wp_cache_supports( 'flush_group' ) ) {
				wp_cache_flush_groups( self::CACHE_GROUP );
			} else {
				wp_cache_delete( 'redirects', self::CACHE_GROUP );
				wp_cache_delete( 'redirects_404', self::CACHE_GROUP );
				wp_cache_delete( 'redirects_logged', self::CACHE_GROUP );
				wp_cache_delete( 'redirects_404_logged', self::CACHE_GROUP );
			}
		}
		Urlslab_Cache::get_instance()->delete_group( self::CACHE_GROUP );
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'template_redirect', $this, 'template_redirect', PHP_INT_MAX, 0 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Redirects::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Redirects and 404 Monitor' );
	}

	public function get_widget_description(): string {
		return __(
			'Effortlessly identify 404 errors and set up redirects on your site for a smoother user experience and enhanced SEO'
		);
	}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'logging',
			__( 'Logging Configuration' ),
			__( 'Easily track all 404 URLs and establish effective redirect guidelines, while protecting your system from possible overload during attacks.' ),
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOGGING,
			true,
			false,
			__( 'Activate Logging' ),
			__( 'Record all 404 error instances in the database.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'logging'
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOG_HISTORY_MAX_TIME,
			2419200,
			false,
			__( 'Delete Old Logs' ),
			__(
				'Control the duration of 404 error log history; auto-removal of old entries after a pre-determined period without errors.'
			),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400   => __( '1 day' ),
				172800  => __( '3 days' ),
				604800  => __( '1 week' ),
				1209600 => __( '2 weeks' ),
				2419200 => __( '1 month' ),
				7257600 => __( '3 months' ),
				0       => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'logging'
		);

		$this->add_options_form_section(
			'redirecting',
			__( 'Default Redirects Configuration' ),
			__( 'Easily customize redirects for 404 error URLs.' ),
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_REDIRECT_URL,
			'',
			false,
			__( 'Default Redirect URL' ),
			__(
				'Redirect unmet 404 requests to a default URL, or leave blank for the standard 404 page.'
			),
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
			__( 'Default Redirect URL for Images' ),
			__(
				'Redirect unmet 404 image requests to a default URL, or leave blank for the standard 404 page.'
			),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || filter_var( $value, FILTER_VALIDATE_URL );
			},
			'redirecting'
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOG_HISTORY_MAX_ROWS,
			50000,
			false,
			__( 'Limit Rows' ),
			__(
				'Set a maximum for rows in the log table. Once this limit is hit, all rows will be purged, and logging will recommence with a clear table. This ensures efficient database size control.'
			),
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

		$this->add_options_form_section(
			'ai_redirects',
			__( 'AI Redirects' ),
			__( 'In case of recurrent 404 errors from a URL request, our AI automatically redirects users to the closest matching URL. Always confirm the accuracy of the redirected link.' ),
			array( self::LABEL_PAID, self::LABEL_AI )
		);

		$this->add_option_definition(
			self::SETTING_NAME_AI_REDIRECTS,
			false,
			false,
			__( 'AI Auto-redirects' ),
			__( 'Auto-generate redirects by determining the closest matching URL in your domain.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'ai_redirects'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MIN_404_COUNT,
			10,
			false,
			__( 'Minimal Occurrences of 404 Errors' ),
			__( 'Set the minimum count of 404 errors needed to generate a redirect.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value );
			},
			'ai_redirects'
		);

	}

	public function template_redirect() {
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			try {
				$url = new Urlslab_Url( sanitize_url( $_SERVER['REQUEST_URI'] ) );

				$redirects = $this->get_redirects();
				foreach ( $redirects as $redirect ) {
					if ( $this->is_match( $redirect, $url ) ) {
						$redirect->increase_cnt();
						wp_redirect( $redirect->get_replace_url(), $redirect->get_redirect_code(), 'URLsLab' );

						exit;
					}
				}
			} catch ( Exception $e ) {
			}
		}

		if ( is_404() ) {
			$this->log_not_found_url();
			$this->default_image_redirect();
			$this->default_redirect(); // last option should be default redirect
		}
	}

	/**
	 * @return Urlslab_Redirect_Row[]
	 */
	private function get_redirects(): array {
		if ( wp_using_ext_object_cache() ) {
			$redirects = wp_cache_get( $this->get_cache_key(), self::CACHE_GROUP );
			if ( false === $redirects ) {
				$redirects = $this->get_redirects_from_db();
				wp_cache_set( $this->get_cache_key(), $redirects, self::CACHE_GROUP, 3600 );
			}
		} else {
			$redirects = Urlslab_Cache::get_instance()->get( $this->get_cache_key(), self::CACHE_GROUP, $found, array( 'Urlslab_Redirect_Row' ) );
			if ( ! $found || false === $redirects ) {
				$redirects = $this->get_redirects_from_db();
				Urlslab_Cache::get_instance()->set( $this->get_cache_key(), $redirects, self::CACHE_GROUP );
			}
		}

		return $redirects;
	}

	private function get_cache_key() {
		return 'redirects' . ( is_404() ? '_404' : '' ) . ( is_user_logged_in() ? '_logged' : '' );
	}

	/**
	 * @return Urlslab_Redirect_Row[]
	 */
	private function get_redirects_from_db() {
		$redirects = array();
		global $wpdb;
		$where_data   = array();
		$where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY;
		if ( is_404() ) {
			$where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND;
		} else {
			$where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND;
		}
		$where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_ANY;
		if ( is_user_logged_in() ) {
			$where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED;
		} else {
			$where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN;
		}

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_REDIRECTS_TABLE . ' WHERE if_not_found IN (%s,%s) AND is_logged IN (%s,%s)', $where_data ), 'ARRAY_A' ); // phpcs:ignore
		foreach ( $results as $result ) {
			$redirects[] = new Urlslab_Redirect_Row( $result );
		}

		return $redirects;
	}

	public function is_match( Urlslab_Redirect_Row $redirect, Urlslab_Url $url ) {
		switch ( $redirect->get_match_type() ) {
			case Urlslab_Redirect_Row::MATCH_TYPE_EXACT:
				if (
					$redirect->get_match_url() != $url->get_url_with_protocol()
				) {
					return false;
				}

				break;

			case Urlslab_Redirect_Row::MATCH_TYPE_SUBSTRING:
				if (
					false === strpos(
						$url->get_url_with_protocol(),
						$redirect->get_match_url()
					)
				) {
					return false;
				}

				break;

			case Urlslab_Redirect_Row::MATCH_TYPE_REGEXP:
				if ( ! @preg_match(
					'|'
					. str_replace( '|', '\\|', $redirect->get_match_url() )
					. '|uim',
					$url->get_url_with_protocol()
				)
				) {
					return false;
				}

				break;

			default:
				return false;
		}

		switch ( $redirect->get_if_not_found() ) {
			case Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY:
				break;

			case Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND:
				if ( ! is_404() ) {
					return false;
				}

				break;

			case Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND:
				if ( is_404() ) {
					return false;
				}

				break;

			default:
		}

		switch ( $redirect->get_is_logged() ) {
			case Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED:
				if ( ! is_user_logged_in() ) {
					return false;
				}

				break;

			case Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN:
				if ( is_user_logged_in() ) {
					return false;
				}

				break;

			case Urlslab_Redirect_Row::LOGIN_STATUS_ANY:
				break;

			default:
		}


		if ( ! empty( $redirect->get_ip() ) ) {
			$ips         = preg_split( '/(,|\n|\t)\s*/', $redirect->get_ip() );
			$visitor_ips = $this->get_visitor_ip();
			if ( ! empty( $visitor_ips ) ) {
				$has_ip      = false;
				$visitor_ips = preg_split( '/(,|\n|\t)\s*/', $visitor_ips );
				$visitor_ip  = trim( $visitor_ips[0] );
				foreach ( $ips as $ip_pattern ) {
					if ( false === strpos( $ip_pattern, '/' ) ) {
						if ( fnmatch( $ip_pattern, $visitor_ip ) ) {
							$has_ip = true;
							break;
						}
					} else {
						list( $subnet_ip, $subnet_mask ) = explode( '/', $ip_pattern );
						if ( ( ip2long( $visitor_ip ) & ~( 1 << ( 32 - $subnet_mask ) - 1 ) ) == ip2long( $subnet_ip ) ) {
							$has_ip = true;
							break;
						}
					}
				}
				if ( ! $has_ip ) {
					return false;
				}
			}
		}


		if ( ! empty( $redirect->get_capabilities() ) ) {
			$capabilities = preg_split( '/(,|\n|\t)\s*/', $redirect->get_capabilities() );
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

		if ( ! empty( $redirect->get_roles() ) ) {
			$user  = wp_get_current_user();
			$roles = preg_split( '/(,|\n|\t)\s*/', $redirect->get_roles() );
			if ( ! empty( $roles ) ) {
				$has_role = false;
				foreach ( $roles as $role ) {
					if ( in_array( $role, $user->roles ) ) {
						$has_role = true;

						break;
					}
				}
				if ( ! $has_role ) {
					return false;
				}
			}
		}

		if ( ! empty( $redirect->get_browser() )
			 && isset( $_SERVER['HTTP_USER_AGENT'] )
		) {
			$browsers = preg_split( '/(,|\n|\t)\s*/', strtolower( $redirect->get_browser() ) );
			if ( ! empty( $browsers ) ) {
				$has_browser = false;
				$agent       = sanitize_text_field( strtolower( $_SERVER['HTTP_USER_AGENT'] ) ); // phpcs:ignore
				foreach ( $browsers as $browser_name ) {
					if ( false !== strpos( $agent, trim( $browser_name ) ) ) {
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
			$cookies = preg_split( '/(,|\n|\t)\s*/', $redirect->get_cookie() );
			if ( ! empty( $cookies ) ) {
				$has_cookie = false;
				if ( ! empty( $_COOKIE ) ) {
					foreach ( $cookies as $cookie_str ) {
						$cookie = explode( '=', $cookie_str );

						if ( isset( $_COOKIE[ trim( $cookie[0] ) ] ) && ( ! isset( $cookie[1] ) || $_COOKIE[ trim( $cookie[0] ) ] == trim( $cookie[1] ) ) ) {// phpcs:ignore
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
			$headers = preg_split( '/(,|\n|\t)\s*/', $redirect->get_headers() );
			if ( ! empty( $headers ) ) {
				$has_header = false;
				if ( ! empty( $_SERVER ) ) {
					foreach ( $headers as $header_str ) {
						$header = explode( '=', $header_str );

						if ( isset( $_SERVER[ trim( $header[0] ) ] ) && ( ! isset( $header[1] ) || sanitize_text_field( $_SERVER[ trim( $header[0] ) ] ) == trim( $header[1] ) ) ) {// phpcs:ignore
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
			$params = preg_split( '/(,|\n|\t)\s*/', $redirect->get_params() );
			if ( ! empty( $params ) ) {
				$has_param = false;
				if ( ! empty( $_REQUEST ) ) {
					foreach ( $params as $param_str ) {
						$param = explode( '=', $param_str );

						if ( isset( $_REQUEST[ trim( $param[0] ) ] ) && ( ! isset( $param[1] ) || sanitize_text_field( $_REQUEST[ trim( $param[0] ) ] ) == trim( $param[1] ) ) ) {// phpcs:ignore
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
	 * @throws Exception
	 */
	public function log_not_found_url(): void {
		if (
			$this->get_option( self::SETTING_NAME_LOGGING )
			&& isset( $_SERVER['REQUEST_URI'] )
		) {
			try {
				$url = new Urlslab_Url( wp_unslash( filter_var( sanitize_url( $_SERVER['REQUEST_URI'] ), FILTER_SANITIZE_URL ) ) );
				$log = new Urlslab_Not_Found_Log_Row(
					array(
						'url'          => $url->get_url_with_protocol(),
						'url_id'       => $url->get_url_id(),
						'cnt'          => 1,
						'request_data' => wp_json_encode(
							array(
								'request' => Urlslab_Url::get_current_page_url()->get_request_as_json(),
								'server'  => array(
									'lang'     => sanitize_text_field( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '' ),
									'encoding' => sanitize_text_field( $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '' ),
									'accept'   => sanitize_text_field( $_SERVER['HTTP_ACCEPT'] ?? '' ),
									'agent'    => sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] ?? '' ), // phpcs:ignore
									// phpcs:ignore
									'referer'  => sanitize_text_field( $_SERVER['HTTP_REFERER'] ?? '' ),
									'ip'       => $this->get_visitor_ip(),
								),
							)
						),
					)
				);
				$log->upsert();
			} catch ( Exception $e ) {
			}
		}
	}


	private function default_image_redirect() {
		if (
			isset( $_SERVER['REQUEST_URI'] )
			&& preg_match(
				'/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif)/i',
				sanitize_url( $_SERVER['REQUEST_URI'] )
			)
		) {
			if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE ) ) ) {
				wp_redirect(
					$this->get_option(
						self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE
					),
					301,
					'URLsLab'
				);

				exit;
			}
		}
	}

	public function default_redirect(): void {
		if ( ! empty( $this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ) ) ) {
			wp_redirect(
				$this->get_option( self::SETTING_NAME_DEFAULT_REDIRECT_URL ),
				301,
				'URLsLab'
			);

			exit;
		}
	}
}
