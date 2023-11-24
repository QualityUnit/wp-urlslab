<?php

class Urlslab_Widget_Cache extends Urlslab_Widget {
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
	const SETTING_NAME_MULTISERVER = 'urlslab-multiserver';
	private static bool $cache_started = false;
	private static bool $cache_enabled = false;
	private static Urlslab_Data_Cache_Rule $active_rule;
	private static string $page_cache_key = '';
	private static $cache_content;
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
		return ! is_admin() && ! is_user_logged_in() && isset( $_SERVER['REQUEST_URI'] ) && ! is_404() && $this->get_option( self::SETTING_NAME_PAGE_CACHING );
	}

	private function start_rule(): bool {
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}

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

	private function get_page_cache_key() {
		if ( empty( self::$page_cache_key ) ) {
			self::$page_cache_key = Urlslab_Url::get_current_page_url()->get_url() . Urlslab_Url::get_current_page_url()->get_request_as_json();
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

	public function init_check() {
		if ( ! $this->is_cache_enabled() || ! $this->start_rule() ) {
			self::$cache_enabled = false;

			return;
		}
		self::$cache_enabled = true;

		self::$cache_content = Urlslab_Cache::get_instance()->get( $this->get_page_cache_key(), self::PAGE_CACHE_GROUP, $found, array( 'Urlslab_Data_Cache_Rule' ), $this->get_cache_valid_from() );
		if ( ! $found || ! strlen( self::$cache_content ) ) {
			self::$found = false;

			return;
		}
		$pos = strpos( self::$cache_content, '|||' );
		if ( false === $pos ) {
			self::$found = false;

			return;
		}
		$headers = json_decode( substr( self::$cache_content, 0, $pos ), true );
		if ( ! is_array( $headers ) || empty( $headers ) ) {
			self::$found = false;

			return;
		}
		$content = substr( self::$cache_content, $pos + 3 );
		if ( ! strlen( $content ) ) {
			self::$found = false;

			return;
		}
		$headers['X-URLSLAB-CACHE'] = 'hit';
		foreach ( $headers as $header => $value ) {
			header( $header . ': ' . $value );
		}

		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		self::$found = true;
		die();
	}

	public function page_cache_headers( $headers ) {
		if ( ! self::$cache_enabled ) {
			return $headers;
		}
		$headers['X-URLSLAB-CACHE'] = 'miss';
		$headers['Cache-Control']   = 'public, max-age=' . self::$active_rule->get_cache_ttl();
		$headers['Expires']         = gmdate( 'D, d M Y H:i:s', time() + self::$active_rule->get_cache_ttl() ) . ' GMT';
		$headers['Pragma']          = 'public';
		self::$headers              = $headers;

		return $headers;
	}


	public function page_cache_start() {
		if ( ! self::$cache_enabled ) {
			return;
		}
		ob_start();
		self::$cache_started = true;
	}

	public function page_cache_save() {
		if ( ! self::$cache_started ) {
			return;
		}
		Urlslab_Cache::get_instance()->set( $this->get_page_cache_key(), json_encode( self::$headers ) . '|||' . ob_get_contents(), self::PAGE_CACHE_GROUP, self::$active_rule->get_cache_ttl() );
		ob_end_flush();
	}

	protected function add_options() {
		$this->add_options_form_section(
			'page',
			__( 'Page Cache', 'urlslab' ),
			__( 'Page caching significantly enhances page speed by saving a duplicate of a webpage, enabling future requests to be fulfilled from cache. It bypasses the need for intensive server processing, cuts down on delay, and accelerates page loading times for a smooth user experience.', 'urlslab' ),
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHING,
			true,
			true,
			__( 'Page Cache', 'urlslab' ),
			__( 'Activate disk-based page caching accordance with defined caching rules. To initiate cache, ensure at least one cache rule is created. ', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_CACHE_TTL,
			604800,
			true,
			__( 'Default Cache Validity (TTL)', 'urlslab' ),
			__( 'Define the default lifespan for cached objects if no caching rule is in place.', 'urlslab' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $param ) {
				return is_numeric( $param ) || empty( $param );
			},
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FORCE_SHORT_TTL,
			3600,
			true,
			__( 'Cache Validity for Newly Added/Updated Content', 'urlslab' ),
			__( 'Allows you to establish a lifespan for cache items from a content that has been edited in the last 24 hours, a common practice of fine-tuning published content. This configuration overrides any other cache regulations.', 'urlslab' ),
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
			__( 'Rules Validity', 'urlslab' ),
			__( 'Validity of internal rules cache.', 'urlslab' ),
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			'btn_invalidate_cache',
			'cache-rules/invalidate',
			false,
			__( 'Clear Cache', 'urlslab' ),
			__( 'Clear all current cache files saved on the disk. When the page is accessed again, cache files will be recreated automatically.', 'urlslab' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_MULTISERVER,
			false,
			false,
			__( 'Multi-Server Installation', 'urlslab' ),
			__( 'Enable this setting if your site operates across multiple servers. Some features may be restricted in a multi-server installation.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page',
			array( self::LABEL_EXPERT ),
		);

		$this->add_options_form_section(
			'preload',
			__( 'Link Preloading', 'urlslab' ),
			__( 'Link preloading is an advanced performance enhancement technique that smartly anticipates user navigation by preloading content linked with likely URLs, enabling instant page rendering upon selection. This method improves user experience by minimizing delay and speeding up smooth page shifts.', 'urlslab' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_OVER_PRELOADING,
			true,
			true,
			__( 'Link Preloading - On Hover ', 'urlslab' ),
			__( 'When users hover over a link, the linked page preloads in the background. Upon clicking, the already loaded page displays immediately.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ON_SCROLL_PRELOADING,
			false,
			true,
			__( 'Link Preloading - During Page Scroll', 'urlslab' ),
			__( 'When users scroll, the browser preloads visible links efficiently, guaranteeing immediate viewing upon clicking and boosting website speed. This approach sees more traffic compared to preloading when hovering.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'preload'
		);

		$this->add_options_form_section(
			'prefetch',
			__( 'Browser Prefetch', 'urlslab' ),
			__( 'Prefetching initiates automatic downloading and caching of content in line with potential user inquiries. It promotes prompt loading of content when required, cuts down on waiting times, and enhances user experience without the need for a specific user request.', 'urlslab' ),
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_DNS_PREFETCH,
			'',
			true,
			__( 'DNS Prefetch', 'urlslab' ),
			__( 'List the domains for DNS prefetching on every page, for instance, fonts.google.com. This setting is only applicable for users who are not logged in.', 'urlslab' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_option_definition(
			self::SETTING_NAME_PREFETCH,
			'',
			true,
			__( 'Prefetch Content', 'urlslab' ),
			__( 'Specify URLs for prefetching on every page. This setting only applies to users who are not signed in.', 'urlslab' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'prefetch'
		);
		$this->add_options_form_section(
			'cloudfront',
			__( 'CloudFront Integration' ),
			__( 'Amazon CloudFront is a web service that enhances the delivery speed of both static and dynamic web content like .html, .css, .js, and image files, guaranteeing a smooth user experience. The IAM role should have permissions to list distributions and invalidate objects.' ),
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
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
			'Select the appropriate region where your CloudFront is hosted.',
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
			'Automatically updates the CloudFront distribution array upon successful validation.',
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
			__( 'Verify that the connection to CloudFront is working.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'cloudfront'
		);


		$this->add_options_form_section(
			'drop-cloudfront',
			__( 'CloudFront Invalidation' ),
			__( 'Invalidation allows for purging CloudFront cache items prior to their expiry.' ),
			array( self::LABEL_FREE, self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID,
			'',
			false,
			__( 'Distribution ID' ),
			__( 'Choose a CloudFront Distribution ID from the list.' ), // phpcs:ignore
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
			__( 'Invalidation Paths' ),
			__( 'Specify object paths for cache invalidation. Use `/*` to purge all objects or input particular paths like `/blog/*`, `/pricing/`.' ),
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
			__( 'Invalidate all items from the CloudFront cache that align with the specified patterns above.' ),
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
		$cache_rules = Urlslab_Cache::get_instance()->get( self::RULES_CACHE_KEY, self::CACHE_RULES_GROUP, $found, array( 'Urlslab_Data_Cache_Rule' ), $this->get_option( self::SETTING_NAME_RULES_VALID_FROM ) );
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

}
