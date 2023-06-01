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
	const SETTING_NAME_DNS_PREFETCH = 'urlslab-cache-dns-prefetch';
	const SETTING_NAME_PREFETCH = 'urlslab-cache-prefetch';
	const SETTING_NAME_CLOUDFRONT_ACCESS_KEY = 'urlslab-cloudfront-access-key';
	const SETTING_NAME_CLOUDFRONT_SECRET = 'urlslab-cloudfront-secret';
	const SETTING_NAME_CLOUDFRONT_REGION = 'urlslab-cloudfront-region';
	const SETTING_NAME_CLOUDFRONT_PATTERN_DROP = 'urlslab-cloudfront-pattern-drop';
	const SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID = 'urlslab-cloudfront-distribution-id';
	const SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS = 'urlslab-cloudfront-distributions';
	const SETTING_NAME_DEFAULT_CACHE_TTL = 'urlslab-cache-default-ttl';
	const SETTING_NAME_FORCE_SHORT_TTL = 'urlslab-cache-force-short-ttl';
	private static bool $cache_started = false;
	private static bool $cache_enabled = false;
	private static Urlslab_Cache_Rule_Row $active_rule;
	private static string $page_cache_key = '';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Cache' );
	}

	public function get_widget_description(): string {
		return __( 'Enhance page loading speed by enabling efficient caching of content, ensuring seamless user experience without compromising on performance.' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'page_cache_headers', PHP_INT_MAX, 1 );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'page_cache_start', PHP_INT_MAX, 0 );
		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_cache_save', 0, 0 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 15 );
		Urlslab_Loader::get_instance()->add_action( 'wp_resource_hints', $this, 'resource_hints', 15, 2 );
	}

	private function is_cache_enabled(): bool {
		return ! is_admin() && ! is_user_logged_in() && isset( $_SERVER['REQUEST_URI'] ) && ! is_404() && $this->get_option( self::SETTING_NAME_PAGE_CACHING ) && Urlslab_File_Cache::get_instance()->is_active();
	}

	private function start_rule(): bool {
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}

		if ( $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ) ) {
			$last_modified = get_the_modified_time( 'U' );
			if ( is_numeric( $last_modified ) && $last_modified && $last_modified > time() - 60 * 60 * 24 ) {
				self::$active_rule = new Urlslab_Cache_Rule_Row(
					array(
						'match_type' => Urlslab_Cache_Rule_Row::MATCH_TYPE_ALL_PAGES,
						'is_active'  => Urlslab_Cache_Rule_Row::ACTIVE_YES,
						'cache_ttl'  => $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ),
						'valid_from' => time() - $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ) - 5,
					)
				);

				return true;
			}
		}

		try {
			$rules = $this->get_cache_rules();
			$url   = Urlslab_Widget::get_current_page_url();
			foreach ( $rules as $rule ) {
				if ( $this->is_match( $rule, $url ) ) {
					self::$active_rule = $rule;

					return true;
				}
			}
		} catch ( Exception $e ) {
		}

		if ( $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ) > 0 ) {
			self::$active_rule = new Urlslab_Cache_Rule_Row(
				array(
					'match_type' => Urlslab_Cache_Rule_Row::MATCH_TYPE_ALL_PAGES,
					'is_active'  => Urlslab_Cache_Rule_Row::ACTIVE_YES,
					'cache_ttl'  => $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ),
					'valid_from' => time() - $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ) - 5,
				)
			);

			return true;
		}

		return false;
	}

	private function get_page_cache_key() {
		if ( empty( self::$page_cache_key ) ) {
			self::$page_cache_key = $this->get_current_page_url()->get_url() . json_encode( $_REQUEST ) . self::$active_rule->get_rule_id();
		}

		return self::$page_cache_key;
	}


	function resource_hints( $hints, $relation_type ) {
		if ( ! self::$cache_enabled ) {
			return $hints;
		}

		if ( 'dns-prefetch' === $relation_type && strlen( trim( $this->get_option( self::SETTING_NAME_DNS_PREFETCH ) ) ) ) {
			$dns_hints = preg_split( '/(,|\n|\t)\s*/', $this->get_option( self::SETTING_NAME_DNS_PREFETCH ) );
			foreach ( $dns_hints as $dns_hint ) {
				if ( strlen( trim( $dns_hint ) ) ) {
					$hints[] = trim( $dns_hint );
				}
			}
		}
		if ( 'prefetch' === $relation_type && strlen( trim( $this->get_option( self::SETTING_NAME_PREFETCH ) ) ) ) {
			$url_hints = preg_split( '/(,|\n|\t)\s*/', $this->get_option( self::SETTING_NAME_PREFETCH ) );
			foreach ( $url_hints as $url_hint ) {
				if ( strlen( trim( $url_hint ) ) ) {
					$hints[] = trim( $url_hint );
				}
			}
		}

		return $hints;
	}


	private function get_cache_valid_from() {
		$post_time = get_the_modified_time( 'U' );
		if ( $post_time ) {
			return max( self::$active_rule->get_valid_from(), $post_time );
		}

		return self::$active_rule->get_valid_from();
	}

	public function page_cache_headers( $headers ) {
		if ( ! $this->is_cache_enabled() || ! $this->start_rule() ) {
			self::$cache_enabled = false;

			return $headers;
		}
		self::$cache_enabled = true;
		if ( Urlslab_File_Cache::get_instance()->exists( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, array( 'Urlslab_Cache_Rule_Row' ), $this->get_cache_valid_from() ) ) {
			$headers['X-URLSLAB-CACHE'] = 'hit';
		} else {
			$headers['X-URLSLAB-CACHE'] = 'miss';
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
		if ( Urlslab_File_Cache::get_instance()->exists( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, array( 'Urlslab_Cache_Rule_Row' ), $this->get_cache_valid_from() ) ) {
			$content = Urlslab_File_Cache::get_instance()->get( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, $found, array( 'Urlslab_Cache_Rule_Row' ), $this->get_cache_valid_from() );
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
		$this->add_options_form_section( 'page', __( 'Page Caching' ), __( 'Page caching is an efficient way to drastically improve page speed by storing a webpage copy, allowing subsequent requests to be served from cache. This eliminates resource-heavy server processing, reducing latency and expediting page load times for a seamless user experience.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHING,
			false,
			true,
			__( 'Page Content Caching' ),
			__( 'Enable disk-based page caching according to specified caching rules. To activate cache, ensure a minimum of one cache rule is created. ' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_CACHE_TTL,
			3600,
			true,
			__( 'Default cache validity (TTL)' ),
			__( 'If no cache rule is applied, you can define default time to live for cache object. If it is set to 0, we don\'t add the cache header' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $param ) {
				return is_numeric( $param ) || empty( $param );
			},
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FORCE_SHORT_TTL,
			900,
			true,
			__( 'Force short cache life for new/modified content (Seconds)' ),
			__( 'Common way how to release the post is to publish it and than modify content in many iterations until it is perfect. This option allows you to set time to live for cache objects of recently (last 24h) modified post. If set to 0 or empty, setting is not applied. Setting overwrites other cache rules.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $param ) {
				return is_numeric( $param ) || empty( $param );
			},
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
			__( 'Invalidate all existing cache files on disk. Upon revisiting the page, cache files will be automatically regenerated.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'page'
		);

		$this->add_options_form_section( 'preload', __( 'Link Preloading' ), __( 'Link preloading is a sophisticated performance optimization method that intelligently predicts user navigation by preloading content associated with probable links, facilitating immediate page rendering upon click. This technique bolsters user experience by reducing latency and expediting seamless page transitions.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_ON_OVER_PRELOADING,
			false,
			true,
			__( 'Link Preloading - On Hover ' ),
			__( 'When users hover over a link, the linked page begins downloading in the background. Upon clicking, the preloaded page instantly displays, enhancing website performance and user experience.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_SCROLL_PRELOADING,
			false,
			true,
			__( 'Link Preloading - During Page Scroll' ),
			__( 'When users scroll, the browser efficiently preloads visible links, ensuring instant display upon clicking and enhancing site responsiveness. This method increases traffic compared to the on hover method preloading.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);

		$this->add_options_form_section( 'prefetch', __( 'Browser Prefetch' ), __( 'Prefetching is a process that proactively downloads and caches content in the background, based on the likelihood of user requests. This enables seamless and instantaneous content loading when needed, improving user experience by reducing wait times, all without requiring an explicit request from the user.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DNS_PREFETCH,
			'',
			true,
			__( 'DNS Prefetch' ),
			__( 'Specify a list of domains for DNS prefetching on each page, such as fonts.google.com. This setting is applied only for non-logged-in users.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_option_definition(
			self::SETTING_NAME_PREFETCH,
			'',
			true,
			__( 'Prefetch Content' ),
			__( 'Specify a list of URLs for prefetching on each page. This setting is applied only for non-logged-in users.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_options_form_section( 'cloudfront', __( 'CloudFront Integration' ), __( 'Amazon CloudFront is a web service that accelerates the delivery of your static and dynamic web content, including .html, .css, .js, and image files, ensuring a seamless experience for users. The IAM role must be granted permissions to list distributions and invalidate objects.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_ACCESS_KEY,
			'',
			false,
			__( 'CloudFront Access Key' ),
			__( 'Leave empty if the AWS Access Key should be loaded from the environment variable.' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'cloudfront'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_SECRET,
			'',
			false,
			__( 'CloudFront Key Secret' ),
			__( 'Leave empty if the AWS Secret Key should be loaded from the environment variable.' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			null,
			'cloudfront'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_REGION,
			'',
			false,
			__( 'CloudFront Region' ),
			'Select the correct region where your CloudFront is hosted.',
			self::OPTION_TYPE_LISTBOX,
			Urlslab_Driver_S3::AWS_REGIONS,
			null,
			'cloudfront'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS,
			array(),
			false,
			__( 'CloudFront Distributions' ),
			'Array of CloudFront distributions that are automatically updated upon successful validation.',
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'cloudfront'
		);
		$this->add_option_definition(
			'btn_cloudfront_validate',
			'cache-rules/validate-cloudfront',
			false,
			__( 'Validate Connection' ),
			__( 'Validate, if connection to CloudFront is working.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'cloudfront'
		);


		$this->add_options_form_section( 'drop-cloudfront', __( 'CloudFront Invalidation' ), __( 'Invalidation enables the removal of CloudFront cache objects before expiration. It supports targeted removal of specific objects, wildcard characters for multiple objects, or "/*" parameters for clearing the entire cache. The process duration may vary depending on the website cache size.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID,
			'',
			false,
			__( 'Distribution ID' ),
			__( 'Select a CloudFront Distribution ID from the available options. Update the available selection by validating the connection.' ),
			! empty( $this->get_option( self::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS ) ) ? self::OPTION_TYPE_LISTBOX : self::OPTION_TYPE_TEXT,
			function() {
				if ( is_array( $this->get_option( self::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS ) ) ) {
					return $this->get_option( self::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS );
				}

				return array();
			},
			null,
			'drop-cloudfront'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_PATTERN_DROP,
			'/*',
			false,
			__( 'Object Paths to Drop' ),
			__( 'Define object paths to invalidate cache. Use "/*" to clear all objects or list specific paths e.g., /blog/*, /pricing/.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'drop-cloudfront'
		);
		$this->add_option_definition(
			'btn_cloudfront_cache',
			'cache-rules/drop-cloudfront',
			false,
			__( 'Invalidate CloudFront Cache' ),
			__( 'Invalidate all objects from the CloudFront cache that match the specified patterns defined above.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'drop-cloudfront'
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
			$ips         = preg_split( '/(,|\n|\t)\s*/', $rule->get_ip() );
			$visitor_ips = $this->get_visitor_ip();
			if ( ! empty( $visitor_ips ) ) {
				$has_ip      = false;
				$visitor_ips = preg_split( '/(,|\n|\t)\s*/', $visitor_ips );
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
			$browsers = preg_split( '/(,|\n|\t)\s*/', strtolower( $rule->get_browser() ) );
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
			$cookies = preg_split( '/(,|\n|\t)\s*/', $rule->get_cookie() );
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
			$headers = preg_split( '/(,|\n|\t)\s*/', $rule->get_headers() );
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
			$params = preg_split( '/(,|\n|\t)\s*/', $rule->get_params() );
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
								if ( $url->get_domain_name() == Urlslab_Widget::get_current_page_url()->get_domain_name() && $url->get_url_id() !== Urlslab_Widget::get_current_page_url()->get_url_id() ) {
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
