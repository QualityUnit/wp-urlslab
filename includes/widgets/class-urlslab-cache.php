<?php

class Urlslab_Cache extends Urlslab_Widget {
	public const SLUG = 'urlslab-cache';
	const SETTING_NAME_PAGE_CACHING = 'urlslab-cache-page';
	const PAGE_CACHE_GROUP = 'cache-page';
	const CACHE_RULES_GROUP = 'cache-rules';
	const SETTING_NAME_RULES_VALID_FROM = 'urlslab-cache-rules-valid-from';
	const RULES_CACHE_KEY = 'rules';
	const SETTING_NAME_ON_OVER_PRELOADING = 'urlslab-cache-over-preload';
	const SETTING_NAME_ON_SCROLL_PRELOADING = 'urlslab-cache-scroll-preload';
	private static bool $cache_started = false;
	private static bool $cache_enabled = false;
	private static Urlslab_Cache_Rule_Row $active_rule;
	private static string $page_cache_key = '';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Caching' );
	}

	public function get_widget_description(): string {
		return __( 'Increase speed of page loading with simple caching of content to disk.' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE, self::LABEL_EXPERT );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'page_cache_headers', PHP_INT_MAX, 1 );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'page_cache_start', PHP_INT_MAX, 0 );
		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_cache_save', 0, 0 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'content_hook', 15 );
	}

	private function is_cache_enabled(): bool {
		return ! is_user_logged_in() && isset( $_SERVER['REQUEST_URI'] ) && $this->get_option( self::SETTING_NAME_PAGE_CACHING ) && Urlslab_File_Cache::get_instance()->is_active();
	}

	private function start_rule(): bool {
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}
		try {
			$rules = $this->get_cache_rules();
			$url   = $this->get_current_page_url();
			foreach ( $rules as $rule ) {
				if ( $this->is_match( $rule, $url ) ) {
					self::$active_rule = $rule;

					return true;
				}
			}
		} catch ( Exception $e ) {
		}

		return false;
	}

	private function get_page_cache_key() {
		if ( empty( self::$page_cache_key ) ) {
			self::$page_cache_key = $this->get_current_page_url()->get_url() . json_encode( $_REQUEST ) . self::$active_rule->get_rule_id();
		}

		return self::$page_cache_key;
	}

	public function page_cache_headers( $headers ) {
		if ( ! $this->is_cache_enabled() || ! $this->start_rule() ) {
			self::$cache_enabled = false;

			return $headers;
		}
		self::$cache_enabled = true;
		if ( Urlslab_File_Cache::get_instance()->exists( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, array( 'Urlslab_Cache_Rule_Row' ), self::$active_rule->get_valid_from() ) ) {
			$headers['X-URLSLAB-CACHE-HIT'] = 'Y';
		}
		$headers['Cache-Control'] = 'public, max-age=' . self::$active_rule->get_cache_ttl();
		$headers['Expires']       = gmdate( 'D, d M Y H:i:s', time() + self::$active_rule->get_cache_ttl() ) . ' GMT';
		$headers['Pragma']        = 'public';

		return $headers;
	}


	public function page_cache_start() {
		if ( ! self::$cache_enabled ) {
			return;
		}
		if ( Urlslab_File_Cache::get_instance()->exists( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, array( 'Urlslab_Cache_Rule_Row' ), self::$active_rule->get_valid_from() ) ) {
			$content = Urlslab_File_Cache::get_instance()->get( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, $found, array( 'Urlslab_Cache_Rule_Row' ), self::$active_rule->get_valid_from() );
			if ( strlen( $content ) > 0 ) {
				echo $content; // phpcs:ignore
				exit;
			}
		}
		ob_start();
		self::$cache_started = true;
	}

	public function page_cache_save() {
		if ( ! self::$cache_started ) {
			return;
		}
		Urlslab_File_Cache::get_instance()->set( $this->get_page_cache_key(), ob_get_contents(), self::PAGE_CACHE_GROUP, self::$active_rule->get_cache_ttl() );
		ob_end_flush();
	}

	protected function add_options() {
		$this->add_options_form_section( 'page', __( 'Page Caching' ), __( 'Speedup loading of your wordpress page with caching whole content to disk and servering content certain time from disk cache. Cached are just pages generated for not logged in users!' ) );

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHING,
			false,
			true,
			__( 'Page content caching' ),
			__( 'Activate page caching to disk based on the defined caching rules. Create at least one cache rule to activate cache.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_RULES_VALID_FROM,
			0,
			true,
			__( 'Rules Validity' ),
			__( 'Internal rules cache validity' ),
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			'btn_invalidate_cache',
			'cache-rules/invalidate',
			false,
			__( 'Invalidate Cache' ),
			__( 'Invalidate all cache files on disk. Files will not be deleted, but set as invalid. Once the page is visited again, cache file will be regenerated.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'page'
		);

		$this->add_options_form_section( 'preload', __( 'Link Preloader' ), __( 'Improve your website\'s user experience with the Link Preloader plugin! By leveraging the power of link preloading, this plugin aims to enhance the perceived load time of your site\'s pages, making navigation faster and smoother for your site visitors.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_ON_OVER_PRELOADING,
			false,
			true,
			__( 'Link Preloading - On Over ' ),
			__( 'When a user hovers over a link on your website, the Link Preloader plugin will intelligently start downloading the linked page in the background. When the user clicks on the link, the preloaded page will be displayed instantly, making your site feel incredibly responsive and snappy.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_SCROLL_PRELOADING,
			false,
			true,
			__( 'Link Preloading - On Page Scroll' ),
			__( 'As a user scrolls down on your website, the Link Preloader plugin will start downloading every link visible in visitor\'s browser. When the user clicks on the link, the preloaded page will be displayed instantly, making your site feel incredibly responsive and snappy. This methond generates much more traffic as preloading based on onOver event.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);
	}

	/**
	 * @return Urlslab_Cache_Rule_Row[]
	 */
	private function get_cache_rules_from_db(): array {
		$cache_rules = array();
		global $wpdb;
		$where_data   = array();
		$where_data[] = Urlslab_Cache_Rule_Row::ACTIVE_YES;

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_CACHE_RULES_TABLE . ' WHERE is_active = %s ORDER BY rule_order', $where_data ), 'ARRAY_A' ); // phpcs:ignore
		foreach ( $results as $result ) {
			$cache_rules[] = new Urlslab_Cache_Rule_Row( $result );
		}

		return $cache_rules;
	}

	/**
	 * @return Urlslab_Cache_Rule_Row[]
	 */
	private function get_cache_rules(): array {
		if ( Urlslab_File_Cache::get_instance()->is_active() ) {
			$cache_rules = Urlslab_File_Cache::get_instance()->get( self::RULES_CACHE_KEY, self::CACHE_RULES_GROUP, $found, array( 'Urlslab_Cache_Rule_Row' ), $this->get_option( self::SETTING_NAME_RULES_VALID_FROM ) );
			if ( false === $cache_rules ) {
				$cache_rules = $this->get_cache_rules_from_db();
				Urlslab_File_Cache::get_instance()->set( self::RULES_CACHE_KEY, $cache_rules, self::CACHE_RULES_GROUP );
			}
		} else {
			$cache_rules = $this->get_cache_rules_from_db();
		}

		return $cache_rules;
	}

	public function is_match( Urlslab_Cache_Rule_Row $rule, Urlslab_Url $url ) {
		switch ( $rule->get_match_type() ) {
			case Urlslab_Cache_Rule_Row::MATCH_TYPE_ALL_PAGES:
				break;

			case Urlslab_Cache_Rule_Row::MATCH_TYPE_EXACT:
				if ( $rule->get_match_url() != $url->get_url_with_protocol() ) {
					return false;
				}
				break;

			case Urlslab_Cache_Rule_Row::MATCH_TYPE_SUBSTRING:
				if ( false === strpos( $url->get_url_with_protocol(), $rule->get_match_url() ) ) {
					return false;
				}
				break;

			case Urlslab_Cache_Rule_Row::MATCH_TYPE_REGEXP:
				if ( ! @preg_match( '|' . str_replace( '|', '\\|', $rule->get_match_url() ) . '|uim', $url->get_url_with_protocol() ) ) {
					return false;
				}
				break;

			default:
				return false;
		}

		if ( ! empty( $rule->get_ip() ) ) {
			$ips         = explode( ',', $rule->get_ip() );
			$visitor_ips = $this->get_visitor_ip();
			if ( ! empty( $visitor_ips ) ) {
				$has_ip      = false;
				$visitor_ips = explode( ',', $visitor_ips );
				$visitor_ip  = trim( $visitor_ips[0] );
				foreach ( $ips as $ip_pattern ) {
					if ( ! str_contains( $ip_pattern, '/' ) ) {
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

		if ( ! empty( $rule->get_browser() ) && isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
			$browsers = explode( ',', strtolower( $rule->get_browser() ) );
			if ( ! empty( $browsers ) ) {
				$has_browser = false;
				$agent       = strtolower( $_SERVER['HTTP_USER_AGENT'] ); // phpcs:ignore
				foreach ( $browsers as $browser_name ) {
					if ( str_contains( $agent, trim( $browser_name ) ) ) {
						$has_browser = true;

						break;
					}
				}
				if ( ! $has_browser ) {
					return false;
				}
			}
		}

		if ( ! empty( $rule->get_cookie() ) ) {
			$cookies = explode( ',', $rule->get_cookie() );
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

		if ( ! empty( $rule->get_headers() ) ) {
			$headers = explode( ',', $rule->get_headers() );
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

		if ( ! empty( $rule->get_params() ) ) {
			$params = explode( ',', $rule->get_params() );
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

		return true;
	}

	public function content_hook( DOMDocument $document ) {
		if ( ! $this->is_cache_enabled() ) {
			return;
		}
		$on_scroll_preload = $this->get_option( self::SETTING_NAME_ON_SCROLL_PRELOADING );
		if ( $on_scroll_preload || $this->get_option( self::SETTING_NAME_ON_OVER_PRELOADING ) ) {

			try {
				$xpath    = new DOMXPath( $document );
				$elements = $xpath->query( "//a[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-preloading')])]" );

				if ( $elements instanceof DOMNodeList ) {
					foreach ( $elements as $dom_element ) {
						// skip processing if A tag contains attribute "urlslab-skip-all" or urlslab-skip-preloading
						if ( $this->is_skip_elemenet( $dom_element, 'preloading' ) ) {
							continue;
						}

						if ( ! empty( trim( $dom_element->getAttribute( 'href' ) ) ) ) {
							try {
								$url = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
								if ( $url->get_domain_name() == $this->get_current_page_url()->get_domain_name() && $url->get_url_id() !== $this->get_current_page_url()->get_url_id() ) {
									if ( $on_scroll_preload ) {
										$dom_element->setAttribute( 'scroll-preload', '1' );
									} else {
										$dom_element->setAttribute( 'onover-preload', '1' );
									}
								}
							} catch ( Exception $e ) {
							}
						}
					}
				}
			} catch ( Exception $e ) {
			}
		}
	}

}
