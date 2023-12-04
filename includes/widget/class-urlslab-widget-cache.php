<?php

class Urlslab_Widget_Cache extends Urlslab_Widget {
	public const SLUG = 'urlslab-cache';
	const SETTING_NAME_PAGE_CACHING = 'urlslab-cache-page';
	const PAGE_CACHE_GROUP = 'cache-page';
	const CACHE_RULES_GROUP = 'cache-rules';
	const SETTING_NAME_CACHE_VALID_FROM = 'urlslab-cache-rules-valid-from';
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
	const SETTING_NAME_MULTISERVER = 'urlslab-multiserver';
	const SETTING_NAME_CACHE_404 = 'urlslab-cache-404';
	const SETTING_NAME_HTACCESS = 'urlslab-cache-htaccess';
	const SETTING_NAME_REDIRECT_TO_HTTPS = 'urlslab-cache-redirect-to-https';
	const SETTING_NAME_REDIRECT_WWW = 'urlslab-cache-redirect-to-www';
	const SETTING_NAME_FORCE_WEBP = 'urlslab-cache-force-webp';
	const SETTING_NAME_CSP_DEFAULT = 'urlslab-cache-csp-default';
	const SETTING_NAME_CSP_CHILD = 'urlslab-cache-csp-child';
	const SETTING_NAME_CSP_FONT = 'urlslab-cache-csp-font';
	const SETTING_NAME_CSP_FRAME = 'urlslab-cache-csp-frame';
	const SETTING_NAME_CSP_IMG = 'urlslab-cache-csp-img';
	const SETTING_NAME_CSP_MANIFEST = 'urlslab-cache-csp-manifest';
	const SETTING_NAME_CSP_MEDIA = 'urlslab-cache-csp-media';
	const SETTING_NAME_CSP_SCRIPT = 'urlslab-cache-csp-script';
	const SETTING_NAME_CSP_ELEM = 'urlslab-cache-csp-elem';
	const SETTING_NAME_CSP_SCR_ATTR = 'urlslab-cache-csp-scr-attr';
	const SETTING_NAME_CSP_STYLE = 'urlslab-cache-csp-style';
	const SETTING_NAME_SET_CSP = 'urlslab-cache-set-csp';
	const SETTING_NAME_CSP_SRC_ELEM = 'urlslab-cache-csp-src-elem';
	const SETTING_NAME_CSP_SRC_ATTR = 'urlslab-cache-csp-src-attr';
	const SETTING_NAME_CSP_WORKER = 'urlslab-cache-csp-worker';
	const SETTING_NAME_CSP_ACTION = 'urlslab-cache-csp-action';
	private static bool $cache_started = false;
	private static bool $cache_enabled = false;
	private static Urlslab_Data_Cache_Rule $active_rule;
	private static string $page_cache_key = '';

	public static bool $found = false;
	private static $headers;

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Cache', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Improve page load speed by turning on effective content caching, guaranteeing a smooth user experience without sacrificing performance', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function register_routes() {
		( new Urlslab_Api_Cache_Rules() )->register_routes();
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'init_check', PHP_INT_MIN );
		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'page_cache_headers', PHP_INT_MAX, 1 );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'page_cache_start', PHP_INT_MAX, 0 );
		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_cache_save', 0, 0 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook_link_preloading', 40 );
		Urlslab_Loader::get_instance()->add_action( 'wp_resource_hints', $this, 'resource_hints', 15, 2 );
	}

	private function is_cloudfront_setup(): bool {
		return ! empty( $this->get_option( self::SETTING_NAME_CLOUDFRONT_ACCESS_KEY ) ) && ! empty( $this->get_option( self::SETTING_NAME_CLOUDFRONT_SECRET ) ) && ! empty( $this->get_option( self::SETTING_NAME_CLOUDFRONT_REGION ) ) && ! empty( $this->get_option( self::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID ) );
	}

	public function init_wp_admin_menu( string $plugin_name, WP_Admin_Bar $wp_admin_bar ) {
		wp_enqueue_script( 'wp-api' );
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG,
				'parent' => Urlslab_Widget::MENU_ID,
				'title'  => __( 'Cache', 'urlslab' ),
				'href'   => admin_url( 'admin.php?page=urlslab-dashboard#/Cache' ),
			)
		);

		if ( wp_get_canonical_url() && $this->get_option( self::SETTING_NAME_PAGE_CACHING ) && ! $this->get_option( self::SETTING_NAME_MULTISERVER ) ) {
			$wp_admin_bar->add_menu(
				array(
					'parent' => $this::SLUG,
					'title'  => __( 'Clear cache for ', 'urlslab' ) . '<u>' . __( 'current page', 'urlslab' ) . '</u>',
					'id'     => self::SLUG . '-page',
					'href'   => '#',
					'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'cache-rules/invalidate', 'POST', json_encode( array( 'url' => Urlslab_Url::get_current_page_url()->get_url() ) ) ) ),
				)
			);
		}
		if ( $this->get_option( self::SETTING_NAME_PAGE_CACHING ) ) {
			$wp_admin_bar->add_menu(
				array(
					'parent' => $this::SLUG,
					'title'  => __( 'Clear cache - ', 'urlslab' ) . '<u>' . __( 'all pages', 'urlslab' ) . '</u>',
					'id'     => self::SLUG . '-page-drop',
					'href'   => '#',
					'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'cache-rules/invalidate' ) ),
				)
			);
		}

		if ( $this->is_cloudfront_setup() ) {
			$url_path = Urlslab_Url::get_current_page_url()->get_url_path();
			if ( '' == $url_path ) {
				$url_path = '/';
			}

			$wp_admin_bar->add_menu(
				array(
					'parent' => $this::SLUG,
					'title'  => __( 'CloudFront - invalidate ', 'urlslab' ) . '<u>' . __( 'current page', 'urlslab' ) . '</u>',
					'id'     => self::SLUG . '-cloudfront-url',
					'href'   => '#',
					'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'cache-rules/drop-cloudfront', 'POST', json_encode( array( 'pattern' => $url_path ) ) ) ),
				)
			);

			if ( ! is_singular() && '/' !== $url_path ) {
				$wp_admin_bar->add_menu(
					array(
						'parent' => $this::SLUG,
						'title'  => __( 'CloudFront - Invalidate pattern: ', 'urlslab' ) . '<u>' . $url_path . '*' . '</u>',
						'id'     => self::SLUG . '-cloudfront-url-wildcard',
						'href'   => '#',
						'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'cache-rules/drop-cloudfront', 'POST', json_encode( array( 'pattern' => $url_path . '*' ) ) ) ),
					)
				);
			}

			$wp_admin_bar->add_menu(
				array(
					'parent' => $this::SLUG,
					'title'  => __( 'CloudFront - Invalidate ', 'urlslab' ) . '<u>' . __( 'all objects', 'urlslab' ) . '</u>',
					'id'     => self::SLUG . '-cloudfront-drop',
					'href'   => '#',
					'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'cache-rules/drop-cloudfront', 'POST', json_encode( array( 'pattern' => '/*' ) ) ) ),
				)
			);
		}

		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Html_Optimizer::SLUG ) ) {
			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG )->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_CSS_PROCESSING ) ) {
				$wp_admin_bar->add_menu(
					array(
						'parent' => $this::SLUG,
						'title'  => __( 'Drop CSS cache', 'urlslab' ),
						'id'     => self::SLUG . '-css',
						'href'   => '#',
						'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'css-cache/delete-all', 'DELETE' ) ),
					)
				);
			}
			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Html_Optimizer::SLUG )->get_option( Urlslab_Widget_Html_Optimizer::SETTING_NAME_JS_PROCESSING ) ) {
				$wp_admin_bar->add_menu(
					array(
						'parent' => $this::SLUG,
						'title'  => __( 'Drop JavaScript cache', 'urlslab' ),
						'id'     => self::SLUG . '-js',
						'href'   => '#',
						'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'js-cache/delete-all', 'DELETE' ) ),
					)
				);
			}
		}
	}

	private function is_cache_enabled(): bool {
		if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
			return false;
		}

		if ( isset( $_SERVER['HTTP_COOKIE'] ) && preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['HTTP_COOKIE'] ) ) {
			return false;
		}

		if ( ! $this->get_option( self::SETTING_NAME_PAGE_CACHING ) ) {
			return false;
		}

		if ( is_404() && ! $this->get_option( self::SETTING_NAME_CACHE_404 ) ) {
			return false;
		}

		return true;
	}

	private function start_rule(): bool {
		if ( $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ) ) {
			$last_modified = get_the_modified_time( 'U' );
			if ( is_numeric( $last_modified ) && $last_modified && $last_modified > time() - 60 * 60 * 24 ) {
				self::$active_rule = new Urlslab_Data_Cache_Rule(
					array(
						'match_type' => Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES,
						'is_active'  => Urlslab_Data_Cache_Rule::ACTIVE_YES,
						'cache_ttl'  => $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ),
						'valid_from' => time() - $this->get_option( self::SETTING_NAME_FORCE_SHORT_TTL ) - 5,
					)
				);

				return true;
			}
		}

		try {
			$rules = $this->get_cache_rules();
			$url   = Urlslab_Url::get_current_page_url();
			foreach ( $rules as $rule ) {
				if ( $this->is_match( $rule, $url ) ) {
					self::$active_rule = $rule;

					return true;
				}
			}
		} catch ( Exception $e ) {
		}

		if ( $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ) > 0 ) {
			self::$active_rule = new Urlslab_Data_Cache_Rule(
				array(
					'match_type' => Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES,
					'is_active'  => Urlslab_Data_Cache_Rule::ACTIVE_YES,
					'cache_ttl'  => $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ),
					'valid_from' => time() - $this->get_option( self::SETTING_NAME_DEFAULT_CACHE_TTL ) - 5,
				)
			);

			return true;
		}

		return false;
	}

	private function get_page_cache_key( $is_404 = false ) {
		if ( $is_404 ) {
			self::$page_cache_key = 'urlslab_404' . URLSLAB_VERSION;
		} else if ( empty( self::$page_cache_key ) ) {
			self::$page_cache_key = Urlslab_Url::get_current_page_url()->get_url() . Urlslab_Url::get_current_page_url()->get_request_as_json() . URLSLAB_VERSION;
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

	public function init_check( $is_404 = false ) {
		if ( ! $is_404 && ( ! $this->is_cache_enabled() || ! $this->start_rule() ) ) {
			self::$cache_enabled = false;

			return;
		}
		self::$cache_enabled = true;


		$filename = $this->get_page_cache_file_name();
		if ( is_file( $filename ) ) {
			header( 'X-URLSLAB-CACHE:hit' );
			$fp = fopen( $filename, 'rb' );
			fpassthru( $fp );
			die();
		} else {
			self::$found = false;
		}
	}

	public function page_cache_headers( $headers ) {
		Urlslab_Url::reset_current_page_url();
		$this->handle_404();

		if ( ! self::$cache_enabled || ! self::$cache_started ) {
			return $headers;
		}
		$headers['X-URLSLAB-CACHE'] = 'miss';
		$headers['Cache-Control']   = 'public, max-age=' . self::$active_rule->get_cache_ttl();
		$headers['Expires']         = gmdate( 'D, d M Y H:i:s', time() + self::$active_rule->get_cache_ttl() ) . ' GMT';
		$headers['Pragma']          = 'public';
		self::$headers              = $headers;

		return $headers;
	}

	private function handle_404() {
		if ( is_404() && $this->get_option( self::SETTING_NAME_CACHE_404 ) ) {
			$this->init_check( true );
		}
	}

	public function page_cache_start() {
		if ( ! self::$cache_enabled ) {
			$this->handle_404();

			return;
		}
		ob_start();
		self::$cache_started = true;
	}

	public function page_cache_save() {
		if ( ! self::$cache_started ) {
			return;
		}

		$fp = fopen( $this->get_page_cache_file_name( true ), 'w' );
		if ( $fp ) {
			fwrite( $fp, ob_get_contents() );
			fclose( $fp );
		}
		ob_end_flush();
	}

	protected function add_options() {


		$this->add_options_form_section(
			'page',
			function() {
				return __( 'Page Cache', 'urlslab' );
			},
			function() {
				return __( 'Page caching significantly enhances page speed by saving a duplicate of a webpage, enabling future requests to be fulfilled from cache. It bypasses the need for intensive server processing, cuts down on delay, and accelerates page loading times for a smooth user experience.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHING,
			true,
			true,
			function() {
				return __( 'Page Cache', 'urlslab' );
			},
			function() {
				return __( 'Activate disk-based page caching accordance with defined caching rules. To initiate cache, ensure at least one cache rule is created. ', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_CACHE_TTL,
			31536000,
			true,
			function() {
				return __( 'Default Cache Validity (TTL)', 'urlslab' );
			},
			function() {
				return __( 'Define the default lifespan for cached objects if no caching rule is in place.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function( $param ) {
				return is_numeric( $param ) || empty( $param );
			},
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FORCE_SHORT_TTL,
			86400,
			true,
			function() {
				return __( 'Cache Validity for Newly Added/Updated Content', 'urlslab' );
			},
			function() {
				return __( 'Allows you to establish a lifespan for cache items from a content that has been edited in the last 24 hours, a common practice of fine-tuning published content. This configuration overrides any other cache regulations.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function( $param ) {
				return is_numeric( $param ) || empty( $param );
			},
			'page'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CACHE_VALID_FROM,
			0,
			true,
			function() {
				return __( 'Rules Validity', 'urlslab' );
			},
			function() {
				return __( 'Validity of internal rules cache.', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			'btn_invalidate_cache',
			'cache-rules/invalidate',
			false,
			function() {
				return __( 'Clear Cache', 'urlslab' );
			},
			function() {
				return __( 'Clear all current cache files saved on the disk. When the page is accessed again, cache files will be recreated automatically.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_MULTISERVER,
			false,
			false,
			function() {
				return __( 'Multi-Server Installation', 'urlslab' );
			},
			function() {
				return __( 'Enable this setting if your site operates across multiple servers. Some features may be restricted in a multi-server installation.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page',
			array( self::LABEL_EXPERT ),
		);
		$this->add_option_definition(
			self::SETTING_NAME_CACHE_404,
			false,
			true,
			function() {
				return __( 'Cache 404 - Page Not Found', 'urlslab' );
			},
			function() {
				return __( 'Caching 404 pages in WordPress helps to reduce server load by preventing the need for the server to fully process each request for a non-existent page. During DDOS attacks, this can significantly improve performance as it minimizes the resources consumed by the large volume of incoming fake requests.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page',
			array( self::LABEL_EXPERT ),
		);


		//CSP
		$this->add_options_form_section(
			'csp',
			function() {
				return __( 'Content-Security-Policy', 'urlslab' );
			},
			function() {
				return __( "Yes, you see here a lot of settings, but if security matters to you, consider this section important.\n\nThe Content-Security-Policy (CSP) is a security feature that helps prevent Cross-Site Scripting (XSS) attacks by defining which origins are allowed to load resources on your webpage. CSP restricts the sources of scripts, styles, and other resources to only those that you trust, effectively reducing the risk of malicious code execution from external sources. By establishing these policies, even if you have a vulnerable plugin, attackers are less likely to inject harmful scripts because CSP only allows the loading of scripts from approved origins. This additional layer of security thus protects your site even in the face of potential plugin vulnerabilities. Implementing CSP is an essential step in securing your website, ensuring that your users' data and your content remain safe from XSS exploits.Unfamiliar with CSP? Let us help you! Our dedicated security experts stand ready to optimize your site's settings for speed and protection. Don't hesitate to contact us by email mailto:support@urlslab.com or contact form on https://www.urlslab.com.\nTo read more visit: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy", 'urlslab' );
			},
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_SET_CSP,
			false,
			false,
			function() {
				return __( 'Add CSP headers', 'urlslab' );
			},
			function() {
				return __( 'Add to each response from your server CSP header to protect your server. Activate it just in case you know what you are doing.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'csp',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_DEFAULT,
			'',
			false,
			function() {
				return __( 'default-src', 'urlslab' );
			},
			function() {
				return __( 'Serves as a fallback for the other fetch directives.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_CHILD,
			'',
			false,
			function() {
				return __( 'child-src', 'urlslab' );
			},
			function() {
				return __( 'Defines the valid sources for web workers and nested browsing contexts loaded using elements such as `frame` and `iframe`', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_FONT,
			'',
			false,
			function() {
				return __( 'font-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for fonts loaded using `@font-face`.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_FRAME,
			'',
			false,
			function() {
				return __( 'frame-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for nested browsing contexts loading using elements such as `frame` and `iframe`.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_IMG,
			'',
			false,
			function() {
				return __( 'img-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources of images and favicons.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_MANIFEST,
			'',
			false,
			function() {
				return __( 'manifest-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources of application manifest files.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_MEDIA,
			'',
			false,
			function() {
				return __( 'media-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for loading media using the `audio` , `video` and `track` elements.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SCRIPT,
			'',
			false,
			function() {
				return __( 'script-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for JavaScript and WebAssembly resources.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_ELEM,
			'',
			false,
			function() {
				return __( 'script-src-elem', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for JavaScript `script` elements.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SCR_ATTR,
			'',
			false,
			function() {
				return __( 'script-src-attr', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for JavaScript inline event handlers.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_STYLE,
			'',
			false,
			function() {
				return __( 'style-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for stylesheets.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SRC_ELEM,
			'',
			false,
			function() {
				return __( 'style-src-elem', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for stylesheets `style` elements and `link` elements with `rel="stylesheet"`', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SRC_ATTR,
			'',
			false,
			function() {
				return __( 'style-src-attr', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for inline styles applied to individual DOM elements.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_WORKER,
			'',
			false,
			function() {
				return __( 'worker-src', 'urlslab' );
			},
			function() {
				return __( 'Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_ACTION,
			'',
			false,
			function() {
				return __( 'form-action', 'urlslab' );
			},
			function() {
				return __( 'Restricts the URLs which can be used as the target of a form submissions from a given context.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'csp'
		);


		$this->add_options_form_section(
			'htaccess',
			function() {
				return __( 'htaccess settings', 'urlslab' );
			},
			function() {
				return __( '.htaccess rules are executed before the wordpress php is executed. Thanks to modifying of this file we can boost performance of your Wordpress installation significantly.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTACCESS,
			false,
			false,
			function() {
				return __( 'Store settings to .htaccess', 'urlslab' );
			},
			function() {
				return __( 'To achieve maximum speed of caching, we need to add some web server configuration rules into file `.htaccess`. These rules are evaluated before PHP script executes first SQL query to your database server and can save processing time of your database server.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'htaccess'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REDIRECT_TO_HTTPS,
			false,
			false,
			function() {
				return __( 'Redirect http traffic to https', 'urlslab' );
			},
			function() {
				return __( 'IMPORTANT: Make sure you your ssl certificate is valid and Apache is configured to handle https traffic before you activate this switch! Redirect all http GET requests to https', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'htaccess',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_REDIRECT_WWW,
			'x',
			false,
			function() {
				return __( 'Redirect www vs non-www traffic', 'urlslab' );
			},
			function() {
				return __( 'IMPORTANT: Make sure your domain name is correctly configured with www. prefix before you will activate this switch! Redirect all GET requests to non-www urls to url with prepended www.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function() {
				return array(
					'x'  => __( 'No change', 'urlslab' ),
					'nw' => __( 'Redirect non-www traffic to www', 'urlslab' ),
					'wn' => __( 'Redirect www traffic to non-www', 'urlslab' ),
				);
			},
			null,
			'htaccess',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_FORCE_WEBP,
			false,
			false,
			function() {
				return __( 'Force webp images', 'urlslab' );
			},
			function() {
				return __( 'You can force your server to serve on place of all jpg, png or gif files more compact webp format. Webp files are generated on the backgroung by cron task if you activated it and by default browser will load the best format of image. We recommend to keep this setting off - activate it only in case you know why you need to force webp mages.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'htaccess',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			'btn_write_htaccess',
			'cache-rules/write_htaccess',
			false,
			function() {
				return __( 'Update .htaccess file', 'urlslab' );
			},
			function() {
				return __( 'Update `.htaccess` file now based on current settings of redirects and caching.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'htaccess'
		);


		$this->add_options_form_section(
			'preload',
			function() {
				return __( 'Link Preloading', 'urlslab' );
			},
			function() {
				return __( 'Link preloading is an advanced performance enhancement technique that smartly anticipates user navigation by preloading content linked with likely URLs, enabling instant page rendering upon selection. This method improves user experience by minimizing delay and speeding up smooth page shifts.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_OVER_PRELOADING,
			true,
			true,
			function() {
				return __( 'Link Preloading - On Hover ', 'urlslab' );
			},
			function() {
				return __( 'When users hover over a link, the linked page preloads in the background. Upon clicking, the already loaded page displays immediately.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_SCROLL_PRELOADING,
			false,
			true,
			function() {
				return __( 'Link Preloading - During Page Scroll', 'urlslab' );
			},
			function() {
				return __( 'When users scroll, the browser preloads visible links efficiently, guaranteeing immediate viewing upon clicking and boosting website speed. This approach sees more traffic compared to preloading when hovering.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);

		$this->add_options_form_section(
			'prefetch',
			function() {
				return __( 'Browser Prefetch', 'urlslab' );
			},
			function() {
				return __( 'Prefetching initiates automatic downloading and caching of content in line with potential user inquiries. It promotes prompt loading of content when required, cuts down on waiting times, and enhances user experience without the need for a specific user request.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_DNS_PREFETCH,
			'',
			true,
			function() {
				return __( 'DNS Prefetch', 'urlslab' );
			},
			function() {
				return __( 'List the domains for DNS prefetching on every page, for instance, fonts.google.com. This setting is only applicable for users who are not logged in.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_option_definition(
			self::SETTING_NAME_PREFETCH,
			'',
			true,
			function() {
				return __( 'Prefetch Content', 'urlslab' );
			},
			function() {
				return __( 'Specify URLs for prefetching on every page. This setting only applies to users who are not signed in.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_options_form_section(
			'cloudfront',
			function() {
				return __( 'CloudFront Integration', 'urlslab' );
			},
			function() {
				return __( 'Amazon CloudFront is a web service that enhances the delivery speed of both static and dynamic web content like .html, .css, .js, and image files, guaranteeing a smooth user experience. The IAM role should have permissions to list distributions and invalidate objects.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_ACCESS_KEY,
			'',
			false,
			function() {
				return __( 'CloudFront Access Key', 'urlslab' );
			},
			function() {
				return __( 'Leave empty if the AWS Access Key should be loaded from the environment variable.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'cloudfront'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_SECRET,
			'',
			false,
			function() {
				return __( 'CloudFront Key Secret', 'urlslab' );
			},
			function() {
				return __( 'Leave empty if the AWS Secret Key should be loaded from the environment variable.', 'urlslab' );
			},
			self::OPTION_TYPE_PASSWORD,
			false,
			null,
			'cloudfront'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_REGION,
			'',
			false,
			function() {
				return __( 'CloudFront Region', 'urlslab' );
			},
			function() {
				return __( 'Select the appropriate region where your CloudFront is hosted.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			Urlslab_Driver_S3::AWS_REGIONS,
			null,
			'cloudfront'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS,
			array(),
			false,
			function() {
				return __( 'CloudFront Distributions', 'urlslab' );
			},
			function() {
				return __( 'Automatically updates the CloudFront distribution array upon successful validation.', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'cloudfront'
		);
		$this->add_option_definition(
			'btn_cloudfront_validate',
			'cache-rules/validate-cloudfront',
			false,
			function() {
				return __( 'Validate Connection', 'urlslab' );
			},
			function() {
				return __( 'Verify that the connection to CloudFront is working.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'cloudfront'
		);


		$this->add_options_form_section(
			'drop-cloudfront',
			function() {
				return __( 'CloudFront Invalidation', 'urlslab' );
			},
			function() {
				return __( 'Invalidation allows for purging CloudFront cache items prior to their expiry.', 'urlslab' );
			},
			array( self::LABEL_FREE, self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID,
			'',
			false,
			function() {
				return __( 'Distribution ID', 'urlslab' );
			},
			function() {
				return __( 'Choose a CloudFront Distribution ID from the list.', 'urlslab' );
			}, // phpcs:ignore
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
			function() {
				return __( 'Invalidation Paths', 'urlslab' );
			},
			function() {
				return __( 'Specify object paths for cache invalidation. Use `/*` to purge all objects or input particular paths like `/blog/*`, `/pricing/`.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'drop-cloudfront'
		);
		$this->add_option_definition(
			'btn_cloudfront_cache',
			'cache-rules/drop-cloudfront',
			false,
			function() {
				return __( 'Invalidate CloudFront Cache', 'urlslab' );
			},
			function() {
				return __( 'Invalidate all items from the CloudFront cache that align with the specified patterns above.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'drop-cloudfront'
		);
	}

	/**
	 * @return Urlslab_Data_Cache_Rule[]
	 */
	private function get_cache_rules_from_db(): array {
		$cache_rules = array();
		global $wpdb;
		$where_data   = array();
		$where_data[] = Urlslab_Data_Cache_Rule::ACTIVE_YES;

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_CACHE_RULES_TABLE . ' WHERE is_active = %s ORDER BY rule_order', $where_data ), 'ARRAY_A' ); // phpcs:ignore
		foreach ( $results as $result ) {
			$cache_rules[] = new Urlslab_Data_Cache_Rule( $result );
		}

		return $cache_rules;
	}

	/**
	 * @return Urlslab_Data_Cache_Rule[]
	 */
	private function get_cache_rules(): array {
		$cache_rules = Urlslab_Cache::get_instance()->get( self::RULES_CACHE_KEY, self::CACHE_RULES_GROUP, $found, array( 'Urlslab_Data_Cache_Rule' ), $this->get_option( self::SETTING_NAME_CACHE_VALID_FROM ) );
		if ( ! $found || false === $cache_rules ) {
			$cache_rules = $this->get_cache_rules_from_db();
			Urlslab_Cache::get_instance()->set( self::RULES_CACHE_KEY, $cache_rules, self::CACHE_RULES_GROUP );
		}

		return $cache_rules;
	}

	public function is_match( Urlslab_Data_Cache_Rule $rule, Urlslab_Url $url ) {
		switch ( $rule->get_match_type() ) {
			case Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES:
				break;

			case Urlslab_Data_Cache_Rule::MATCH_TYPE_EXACT:
				if ( $rule->get_match_url() != $url->get_url_with_protocol() ) {
					return false;
				}
				break;

			case Urlslab_Data_Cache_Rule::MATCH_TYPE_SUBSTRING:
				if ( false === strpos( $url->get_url_with_protocol(), $rule->get_match_url() ) ) {
					return false;
				}
				break;

			case Urlslab_Data_Cache_Rule::MATCH_TYPE_REGEXP:
				if ( ! @preg_match( '|' . str_replace( '|', '\\|', $rule->get_match_url() ) . '|uim', $url->get_url_with_protocol() ) ) {
					return false;
				}
				break;

			default:
				return false;
		}

		if ( ! empty( $rule->get_ip() ) ) {
			$ips         = preg_split( '/(,|\n|\t)\s*/', $rule->get_ip() );
			$visitor_ips = self::get_visitor_ip();
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
				$agent       = sanitize_text_field( strtolower( $_SERVER['HTTP_USER_AGENT'] ) ); //phpcs:ignore
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

		if ( ! empty( $rule->get_params() ) ) {
			$params = preg_split( '/(,|\n|\t)\s*/', $rule->get_params() );
			if ( ! empty( $params ) ) {
				$has_param = false;
				if ( ! empty( $_REQUEST ) ) {
					foreach ( $params as $param_str ) {
						$param = explode( '=', $param_str );

						if ( isset( $_REQUEST[ trim( $param[0] ) ] ) && ( ! isset( $param[1] ) || sanitize_text_field( $_REQUEST[ trim( $param[0] ) ] ) == trim( $param[1] ) ) ) {
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

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_single() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_single() && is_single() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_single() && ! is_single()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_singular() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_singular() && is_singular() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_singular() && ! is_singular()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_attachment() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_attachment() && is_attachment() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_attachment() && ! is_attachment()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_page() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_page() && is_page() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_page() && ! is_page()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_home() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_home() && is_home() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_home() && ! is_home()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_front_page() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_front_page() && is_front_page() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_front_page() && ! is_front_page()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_category() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_category() && is_category() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_category() && ! is_category()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_search() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_search() && is_search() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_search() && ! is_search()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_tag() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_tag() && is_tag() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_tag() && ! is_tag()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_author() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_author() && is_author() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_author() && ! is_author()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_archive() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_archive() && is_archive() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_archive() && ! is_archive()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_sticky() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_sticky() && is_sticky() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_sticky() && ! is_sticky()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_tax() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_tax() && is_tax() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_tax() && ! is_tax()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_feed() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_feed() && is_feed() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_feed() && ! is_feed()
		) {
			//continue
		} else {
			return false;
		}

		if (
			Urlslab_Data_Custom_Html::ANY === $rule->get_is_paged() ||
			Urlslab_Data_Custom_Html::YES === $rule->get_is_paged() && is_paged() ||
			Urlslab_Data_Custom_Html::NO === $rule->get_is_paged() && ! is_paged()
		) {
			//continue
		} else {
			return false;
		}

		if ( ! empty( trim( $rule->get_post_types() ) ) ) {
			$post_types        = preg_split( '/(,|\n|\t)\s*/', $rule->get_post_types() );
			$current_post_type = get_post_type();
			if ( ! empty( $post_types ) && ! empty( $current_post_type ) ) {
				if ( ! in_array( $current_post_type, $post_types ) ) {
					return false;
				}
			}
		}


		return true;
	}

	public function content_hook_link_preloading( DOMDocument $document ) {
		if ( ! $this->is_cache_enabled() ) {
			return;
		}
		$on_scroll_preload = $this->get_option( self::SETTING_NAME_ON_SCROLL_PRELOADING );
		if ( $on_scroll_preload || $this->get_option( self::SETTING_NAME_ON_OVER_PRELOADING ) ) {
			try {
				$xpath    = new DOMXPath( $document );
				$elements = $xpath->query( '//a[' . $this->get_xpath_query( array( 'urlslab-skip-preloading' ) ) . ']' );
				if ( $elements instanceof DOMNodeList ) {
					foreach ( $elements as $dom_element ) {
						if ( ! empty( trim( $dom_element->getAttribute( 'href' ) ) ) ) {
							try {
								$url = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
								if ( $url->is_same_domain_url() && $url->get_url_id() !== Urlslab_Url::get_current_page_url()->get_url_id() && ! $url->is_blacklisted() && $url->is_url_valid() ) {
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

	public function get_widget_group() {
		return __( 'Performance', 'urlslab' );
	}

	public function on_deactivate() {
		$htaccess = new Urlslab_Tool_Htaccess();
		$htaccess->cleanup();
		parent::on_deactivate();
	}

	public function on_activate() {
		if ( $this->get_option( self::SETTING_NAME_HTACCESS ) ) {
			$htaccess = new Urlslab_Tool_Htaccess();
			$htaccess->update();
		}
		parent::on_activate();
	}

	private function get_page_cache_file_name( $create_dir = false ): string {
		$dir_name = Urlslab_Url::get_current_page_url()->get_url_path();
		$dir_name = str_replace( '..', '_', $dir_name );
		$dir_name = trim( preg_replace( '/\/+/', '_', $dir_name ), '_' );
		$dir_name = wp_get_upload_dir()['basedir'] .
					'/urlslab/page/' .
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG )->get_option( Urlslab_Widget_Cache::SETTING_NAME_CACHE_VALID_FROM ) . '/' .
					$_SERVER['HTTP_HOST'] . '/' .
					$dir_name;
		if ( $create_dir && ! is_dir( $dir_name ) ) {
			wp_mkdir_p( $dir_name );
		}
		$filename = $dir_name . '/p' . ( $_SERVER['UL_SSL'] ?? '' ) . ( empty( $_SERVER['URLSLAB_QS'] ) ? '' : md5( $_SERVER['URLSLAB_QS'] ) ) . '.html';

		return $filename;
	}
}
