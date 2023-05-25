<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Custom_Html extends Urlslab_Widget {
	public const SLUG = 'urlslab-custom-html';
	const SETTING_NAME_BODY_START = 'urlslab-custom-body_start';
	const SETTING_NAME_BODY_END = 'urlslab-custom-body_end';
	const SETTING_NAME_HEAD_START = 'urlslab-custom-head_start';
	const SETTING_NAME_HEAD_END = 'urlslab-custom-head_end';
	const SETTING_NAME_HEADERS = 'urlslab-custom-headers';
	const CACHE_GROUP = 'urlslab-custom-html';
	const URLSLAB_CUSTOM_HTML_RULES = 'urlslab_custom_html_rules';
	private static $rules;

	public static function delete_cache() {
		if ( wp_using_ext_object_cache() ) {
			if ( wp_cache_supports( 'flush_group' ) ) {
				wp_cache_flush_groups( self::CACHE_GROUP );
			} else {
				wp_cache_delete( self::URLSLAB_CUSTOM_HTML_RULES, self::CACHE_GROUP );
			}
		}
		Urlslab_File_Cache::get_instance()->clear( self::CACHE_GROUP );
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_head_content_raw', $this, 'raw_head_content', 1 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_body_content', $this, 'raw_body_content', 1 );
		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'custom_headers', PHP_INT_MAX, 1 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Custom_Html::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Custom HTML Injection' );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_FREE );
	}

	public function get_widget_description(): string {
		return __( 'Elevate your website using our seamless integration hub for tools like GTM, while effortlessly tailoring content to your unique requirements.' );
	}

	public function custom_headers( $headers ) {
		if ( is_admin() ) {
			return $headers;
		}

		if ( strlen( $this->get_option( self::SETTING_NAME_HEADERS ) ) ) {
			$lines = explode( "\n", $this->get_option( self::SETTING_NAME_HEADERS ) );
			foreach ( $lines as $line ) {
				$parts = explode( '=', $line, 2 );
				if ( count( $parts ) == 2 && strlen( $parts[0] ) ) {
					$headers[ $parts[0] ] = $parts[1];
				}
			}
		}

		foreach ( $this->get_rules() as $rule ) {
			if ( strlen( $rule->get_add_http_headers() ) ) {
				$lines = explode( "\n", $rule->get_add_http_headers() );
				foreach ( $lines as $line ) {
					$parts = explode( '=', $line, 2 );
					if ( count( $parts ) == 2 && strlen( $parts[0] ) ) {
						$headers[ $parts[0] ] = $parts[1];
					}
				}
			}
		}


		return $headers;
	}

	public function raw_head_content( $content ) {
		if ( strlen( $this->get_option( self::SETTING_NAME_HEAD_START ) ) > 0 ) {
			$content = $this->get_option( self::SETTING_NAME_HEAD_START ) . $content;
		}

		if ( strlen( $this->get_option( self::SETTING_NAME_HEAD_END ) ) > 0 ) {
			$content = $content . $this->get_option( self::SETTING_NAME_HEAD_END );
		}

		foreach ( $this->get_rules() as $rule ) {
			if ( strlen( $rule->get_add_start_headers() ) ) {
				$content = $rule->get_add_start_headers() . $content;
			}
			if ( strlen( $rule->get_add_end_headers() ) ) {
				$content = $content . $rule->get_add_end_headers();
			}
		}

		return $content;
	}

	public function raw_body_content( $content ) {
		if ( strlen( $this->get_option( self::SETTING_NAME_BODY_START ) ) > 0 ) {
			$content = $this->get_option( self::SETTING_NAME_BODY_START ) . $content;
		}
		if ( strlen( $this->get_option( self::SETTING_NAME_BODY_END ) ) > 0 ) {
			$content = $content . $this->get_option( self::SETTING_NAME_BODY_END );
		}

		foreach ( $this->get_rules() as $rule ) {
			if ( strlen( $rule->get_add_start_body() ) ) {
				$content = $rule->get_add_start_body() . $content;
			}
			if ( strlen( $rule->get_add_end_body() ) ) {
				$content = $content . $rule->get_add_end_body();
			}
		}

		return $content;
	}

	/**
	 * @return Urlslab_Custom_Html_Row[]
	 */
	private function get_rules(): array {
		if ( is_array( self::$rules ) ) {
			return self::$rules;
		}
		if ( wp_using_ext_object_cache() ) {
			self::$rules = wp_cache_get( $this->get_cache_key(), self::CACHE_GROUP );
			if ( false === self::$rules ) {
				self::$rules = $this->get_rules_from_db();
				wp_cache_set( $this->get_cache_key(), self::$rules, self::CACHE_GROUP, 3600 );
			}
		} else {
			if ( Urlslab_File_Cache::get_instance()->is_active() ) {
				self::$rules = Urlslab_File_Cache::get_instance()->get( $this->get_cache_key(), self::CACHE_GROUP, $found, array( 'Urlslab_Custom_Html_Row' ) );
				if ( false === self::$rules ) {
					self::$rules = $this->get_rules_from_db();
					Urlslab_File_Cache::get_instance()->set( $this->get_cache_key(), self::$rules, self::CACHE_GROUP );
				}
			} else {
				self::$rules = $this->get_rules_from_db();
			}
		}

		foreach ( self::$rules as $id => $rule ) {
			if ( ! $this->is_match( $rule, $this->get_current_page_url() ) ) {
				unset( self::$rules[ $id ] );
			}
		}

		return self::$rules;
	}

	protected function add_options() {
		$this->add_options_form_section( 'default_html', __( 'Custom HTML Applied on All Pages' ), __( 'Default rules is automatically applied to every page. For page-specific, use custom rules with appropriate conditions. CAUTION: Ensure accurate HTML code to prevent website corruption.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_HEAD_START,
			'',
			true,
			__( 'After `<head>`' ),
			__( 'Custom HTML code inserted immediately after the opening `&lt;head>` tag, applicable to all pages.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'default_html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HEAD_END,
			'',
			true,
			__( 'Before `</head>`' ),
			__( 'Custom HTML code inserted immediately before the closing `&lt;/head>` tag, applicable to all pages.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'default_html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_BODY_START,
			'',
			true,
			__( 'After `<body>`' ),
			__( 'Custom HTML code inserted immediately after the opening `&lt;body>` tag, applicable to all pages.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'default_html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_BODY_END,
			'',
			true,
			__( 'Before `</body>`' ),
			__( 'Custom HTML code inserted immediately before the closing `&lt;/body>` tag, applicable to all pages.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'default_html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HEADERS,
			'',
			true,
			__( 'Custom HTTP Headers' ),
			__( 'Insert custom HTTP headers in server response. Example: `X-URLSLAB-CUSTOM-HEADER=custom_value`.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'default_html'
		);

	}

	private function get_cache_key() {
		return self::URLSLAB_CUSTOM_HTML_RULES;
	}

	private function get_rules_from_db() {
		$rules = array();
		global $wpdb;
		$where_data   = array();
		$where_data[] = Urlslab_Custom_Html_Row::ACTIVE_YES;
		$results      = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_CUSTOM_HTML_RULES_TABLE . ' WHERE is_active=%s', $where_data ), 'ARRAY_A' ); // phpcs:ignore
		foreach ( $results as $result ) {
			$rules[] = new Urlslab_Custom_Html_Row( $result );
		}

		return $rules;
	}

	public function is_match( Urlslab_Custom_Html_Row $rule, Urlslab_Url $url ) {
		switch ( $rule->get_match_type() ) {
			case Urlslab_Custom_Html_Row::MATCH_TYPE_ALL:
				break;
			case Urlslab_Custom_Html_Row::MATCH_TYPE_EXACT:
				if ( $rule->get_match_url() != $url->get_url_with_protocol() ) {
					return false;
				}

				break;

			case Urlslab_Custom_Html_Row::MATCH_TYPE_SUBSTRING:
				if ( false === strpos( $url->get_url_with_protocol(), $rule->get_match_url() ) ) {
					return false;
				}

				break;

			case Urlslab_Custom_Html_Row::MATCH_TYPE_REGEXP:
				if ( ! @preg_match( '|' . str_replace( '|', '\\|', $rule->get_match_url() ) . '|uim', $url->get_url_with_protocol() ) ) {
					return false;
				}

				break;

			default:
				return false;
		}

		switch ( $rule->get_is_logged() ) {
			case Urlslab_Custom_Html_Row::LOGIN_STATUS_LOGIN_REQUIRED:
				if ( ! is_user_logged_in() ) {
					return false;
				}

				break;

			case Urlslab_Custom_Html_Row::LOGIN_STATUS_NOT_LOGGED_IN:
				if ( is_user_logged_in() ) {
					return false;
				}

				break;

			case Urlslab_Custom_Html_Row::LOGIN_STATUS_ANY:
				break;

			default:
		}


		if ( ! empty( $rule->get_match_ip() ) ) {
			$ips         = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_ip() );
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


		if ( ! empty( $rule->get_match_capabilities() ) ) {
			$capabilities = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_capabilities() );
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

		if ( ! empty( $rule->get_match_roles() ) ) {
			$user  = wp_get_current_user();
			$roles = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_roles() );
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

		if ( ! empty( $rule->get_match_browser() )
			 && isset( $_SERVER['HTTP_USER_AGENT'] )
		) {
			$browsers = preg_split( '/(,|\n|\t)\s*/', strtolower( $rule->get_match_browser() ) );
			if ( ! empty( $browsers ) ) {
				$has_browser = false;
				$agent       = strtolower( $_SERVER['HTTP_USER_AGENT'] ); // phpcs:ignore
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

		if ( ! empty( $rule->get_match_cookie() ) ) {
			$cookies = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_cookie() );
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

		if ( ! empty( $rule->get_match_headers() ) ) {
			$headers = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_headers() );
			if ( ! empty( $headers ) ) {
				$has_header = false;
				if ( ! empty( $_SERVER ) ) {
					foreach ( $headers as $header_str ) {
						$header = explode( '=', $header_str );

						if ( isset( $_SERVER[ trim( $header[0] ) ] ) && ( ! isset( $header[1] ) || $_SERVER[ trim( $header[0] ) ] == trim( $header[1] ) ) ) {// phpcs:ignore
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

		if ( ! empty( $rule->get_match_params() ) ) {
			$params = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_params() );
			if ( ! empty( $params ) ) {
				$has_param = false;
				if ( ! empty( $_REQUEST ) ) {
					foreach ( $params as $param_str ) {
						$param = explode( '=', $param_str );

						if ( isset( $_REQUEST[ trim( $param[0] ) ] ) && ( ! isset( $param[1] ) || $_REQUEST[ trim( $param[0] ) ] == trim( $param[1] ) ) ) {// phpcs:ignore
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

		if ( ! empty( trim( $rule->get_match_posttypes() ) ) ) {
			$post_types        = preg_split( '/(,|\n|\t)\s*/', $rule->get_match_posttypes() );
			$current_post_type = get_post_type();
			if ( ! empty( $post_types ) ) {
				$has_posttype = false;
				if ( ! empty( get_post_type() ) ) {
					foreach ( $post_types as $post_type ) {
						if ( $post_type == $current_post_type ) {
							$has_posttype = true;
							break;
						}
					}
				}
				if ( ! $has_posttype ) {
					return false;
				}
			}
		}

		return true;
	}
}
