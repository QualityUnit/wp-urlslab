<?php

// phpcs:disable WordPress

class Urlslab_Widget_Html_Optimizer extends Urlslab_Widget {
	public const SLUG = 'urlslab-css-optimizer';

	public const DOWNLOAD_CSS_URL_PATH = 'urlslab-css/';
	public const DOWNLOAD_JS_URL_PATH = 'urlslab-js/';

	public const SETTING_NAME_CSS_MAX_SIZE = 'urlslab_css_max_size';
	const SETTING_NAME_HTML_MINIFICATION = 'urlslab_html_minification';
	const SETTING_NAME_CSS_MINIFICATION = 'urlslab_css_minification';
	const SETTING_NAME_JS_MINIFICATION = 'urlslab_js_minification';
	const SETTING_NAME_CSS_PROCESSING = 'urlslab_css_processing';
	const SETTING_NAME_JS_PROCESSING = 'urlslab_js_processing';
	const SETTING_NAME_CSS_MERGE = 'urlslab_css_merge';
	const SETTING_NAME_JS_MAX_SIZE = 'urlslab_js_max_size';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS = 'urlslab_htmlmin_remove_comments';
	const SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES = 'urlslab_htmlmin_attributes';
	const SETTING_NAME_HTML_MINIFICATION_WHITESPACES = 'urlslab_htmlmin_whitespaces';
	const SETTING_NAME_HTML_MINIFICATION_DEPRECATED = 'urlslab_htmlmin_deprecated';
	const SETTING_NAME_HTML_MINIFICATION_SORT = 'urlslab_htmlmin_sort';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX = 'urlslab_htmlmin_remove_http_prefix';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED = 'urlslab_htmlmin_remove_omitted';
	const SETTING_NAME_JS_REMOVE_WP_EMOJI = 'urlslab_js_wp_emoji';
	const SETTING_NAME_JS_REMOVE_JQ_MIGRATE = 'urlslab_js_jq_migrate';
	const SETTING_NAME_JS_REMOVE_QUERY_STRINGS = 'urlslab_js_del_query_str';
	const SETTING_NAME_HMTL_MAX_SIZE = 'urlslab_html_max_size';
	private static $current_page_size = 0;

	public function __construct() {}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_content_before', $this, 'set_page_size' );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', PHP_INT_MAX );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'content_hook', PHP_INT_MAX );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_head_content_final', $this, 'minify_head_content', 0 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_body_content_final', $this, 'minify_body_content', 0 );

		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'output_js' );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'output_css' );
		Urlslab_Loader::get_instance()->add_filter( 'user_trailingslashit', $this, 'user_trailingslashit', 10, 2 );
		Urlslab_Loader::get_instance()->add_filter( 'redirect_canonical', $this, 'redirect_canonical', 10, 2 );

		//remove wp emojis
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'disable_wp_emojis' );
		Urlslab_Loader::get_instance()->add_filter( 'tiny_mce_plugins', $this, 'disable_wp_emojis_tinymce' );
		Urlslab_Loader::get_instance()->add_filter( 'wp_resource_hints', $this, 'disable_wp_emojis_dns_prefetch', 10, 2 );

		//remove jquery migrate
		Urlslab_Loader::get_instance()->add_action( 'wp_default_scripts', $this, 'remove_jquery_migrate' );

		//remove query strings
		Urlslab_Loader::get_instance()->add_filter( 'script_loader_src', $this, 'remove_query_strings', 15 );
		Urlslab_Loader::get_instance()->add_filter( 'style_loader_src', $this, 'remove_query_strings', 15 );
	}

	public function disable_wp_emojis() {
		if ( ! is_admin() && $this->get_option( self::SETTING_NAME_JS_REMOVE_WP_EMOJI ) ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			remove_action( 'admin_print_styles', 'print_emoji_styles' );
			remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
			remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
			remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		}
	}

	public function disable_wp_emojis_tinymce( $plugins ) {
		if ( is_array( $plugins ) ) {
			if ( ! is_admin() && $this->get_option( self::SETTING_NAME_JS_REMOVE_WP_EMOJI ) ) {
				return array_diff( $plugins, array( 'wpemoji' ) );
			}

			return $plugins;
		}

		return array();
	}

	public function disable_wp_emojis_dns_prefetch( $urls, $relation_type ) {
		if ( ! is_admin() && 'dns-prefetch' == $relation_type && $this->get_option( self::SETTING_NAME_JS_REMOVE_WP_EMOJI ) ) {
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
			$urls          = array_diff( $urls, array( $emoji_svg_url ) );
		}

		return $urls;
	}

	public function remove_jquery_migrate( $scripts ) {
		if ( isset( $scripts->registered['jquery'] ) && ! is_admin() && $this->get_option( self::SETTING_NAME_JS_REMOVE_JQ_MIGRATE ) ) {
			$script = $scripts->registered['jquery'];
			if ( $script->deps ) {
				$script->deps = array_diff( $script->deps, array( 'jquery-migrate' ) );
			}
		}
	}

	public function remove_query_strings( $src ) {
		if ( false !== strpos( $src, '?' ) && ! is_admin() && $this->get_option( self::SETTING_NAME_JS_REMOVE_QUERY_STRINGS ) ) {
			$parts = explode( '?', $src, 2 );

			return $parts[0];
		}

		return $src;
	}

	public function rewrite_rules() {
		add_rewrite_rule( '.*?' . self::DOWNLOAD_JS_URL_PATH . '([a-f0-9_]*?).js', 'index.php?ul_js=$matches[1]', 'top' );
		add_rewrite_rule( '.*?' . self::DOWNLOAD_CSS_URL_PATH . '([a-f0-9_]*?).css', 'index.php?ul_css=$matches[1]', 'top' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Html_Optimizer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'HTML Optimisations', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Improve site speed and decrease requests from content-blockers by utilizing in-line Javascript and CSS rather than external documents and minification', 'urlslab' );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_wp_admin_menu( string $plugin_name, WP_Admin_Bar $wp_admin_bar ) {
		if ( false === wp_get_canonical_url() ) {
			return;
		}

		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG,
				'parent' => Urlslab_Widget::MENU_ID,
				'title'  => __( 'Tests', 'urlslab' ),
				'href'   => admin_url( 'admin.php?page=urlslab-dashboard#/CssOptimizer' ),
			)
		);

		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-pagespeed',
				'parent' => $this::SLUG,
				'title'  => __( 'Google Page Speed Test', 'urlslab' ),
				'href'   => 'https://developers.google.com/speed/pagespeed/insights/?url=' . rawurlencode( Urlslab_Url::get_current_page_url()->get_url_with_protocol() ),
				'meta'   => array( 'target' => '_blank' ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-mobile',
				'parent' => $this::SLUG,
				'title'  => __( 'Google Mobile-Friendly Test', 'urlslab' ),
				'href'   => 'https://www.google.com/webmasters/tools/mobile-friendly/?url=' . rawurlencode( Urlslab_Url::get_current_page_url()->get_url_with_protocol() ),
				'meta'   => array( 'target' => '_blank' ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-rich',
				'parent' => $this::SLUG,
				'title'  => __( 'Google Rich Results Test', 'urlslab' ),
				'href'   => 'https://search.google.com/test/rich-results?url=' . rawurlencode( Urlslab_Url::get_current_page_url()->get_url_with_protocol() ),
				'meta'   => array( 'target' => '_blank' ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-facebook',
				'parent' => $this::SLUG,
				'title'  => __( 'Facebook Sharing Debugger', 'urlslab' ),
				'href'   => 'https://developers.facebook.com/tools/debug/?q=' . rawurlencode( Urlslab_Url::get_current_page_url()->get_url_with_protocol() ),
				'meta'   => array( 'target' => '_blank' ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-ssl',
				'parent' => $this::SLUG,
				'title'  => __( 'SSL Certificate Test', 'urlslab' ),
				'href'   => 'https://www.ssllabs.com/ssltest/analyze.html?d=' . rawurlencode( Urlslab_Url::get_current_page_url()->get_domain_name() ) . '&latest',
				'meta'   => array( 'target' => '_blank' ),
			)
		);
	}

	protected function add_options() {
		$this->add_options_form_section(
			'html',
			function () {
				return __( 'HTML', 'urlslab' );
			},
			function () {
				return __( 'Compress HTML source by eliminating redundant whitespaces, comments, and other unnecessary characters without altering the content structure. This reduces page size and accelerates loading speed. Additionally, it optimizes HTML for improved gzip outcomes by alphabetically sorting attributes and CSS class names. WARNING: Some minifications may result in invalid HTML, but most browsers should still render them correctly.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION,
			false,
			true,
			function () {
				return __( 'HTML Minification', 'urlslab' );
			},
			function () {
				return __( 'Enable HTML Minification.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES,
			false,
			true,
			function () {
				return __( 'Optimize Attributes', 'urlslab' );
			},
			function () {
				return __( 'Delete attributes that have a default or empty value.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS,
			true,
			true,
			function () {
				return __( 'Remove Comments', 'urlslab' );
			},
			function () {
				return __( 'Remove HTML comments. Often, comments are unused and merely create additional network traffic with every request.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES,
			false,
			true,
			function () {
				return __( 'Remove Whitespaces', 'urlslab' );
			},
			function () {
				return __( 'Remove spaces in and around tags.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED,
			false,
			true,
			function () {
				return __( 'Remove Deprecated', 'urlslab' );
			},
			function () {
				return __( 'Remove deprecated anchor names, script character set, and type from script tags. Also, remove type from stylesheet links.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED,
			false,
			true,
			function () {
				return __( 'Remove Omitted', 'urlslab' );
			},
			function () {
				return __( 'Remove omitted quotes and HTML tags.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX,
			false,
			true,
			function () {
				return __( 'Remove Prefix From Attributes', 'urlslab' );
			},
			function () {
				return __( 'Shorten links by eliminating protocols and adopting the relative protocol from the current page.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_SORT,
			false,
			true,
			function () {
				return __( 'Sort Classes and Attributes', 'urlslab' );
			},
			function () {
				return __( 'Improved GZIP compression can be achieved for strings if multiple tags use the same class name or attribute order.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'html'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HMTL_MAX_SIZE,
			125000,
			true,
			function () {
				return __( 'Never exceed HTML size (bytes)', 'urlslab' );
			},
			function () {
				return __( 'Web crawlers (e.g. Bing) issue alerts regarding issues encountered during the crawling process if the page size surpasses 125kB. If including CSS or JavaScript files causes the total size to exceed the specified limit, these files will not be incorporated into the HTML.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'html'
		);

		$this->add_options_form_section(
			'css',
			function () {
				return __( 'CSS', 'urlslab' );
			},
			function () {
				return __( 'Improving your website\'s speed is essential and can be accomplished by optimizing resources like CSS files. Configuring these files with a specific size limit and expiry date improves your website\'s performance and loading speed.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_PROCESSING,
			false,
			true,
			function () {
				return __( 'Process CSS files', 'urlslab' );
			},
			function () {
				return __( 'Download CSS files, saves them to the database, and enhances for optimal performance.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CSS_MAX_SIZE,
			70000,
			true,
			function () {
				return __( 'Convert Small CSS Files Into Inline HTML (bytes)', 'urlslab' );
			},
			function () {
				return __( 'Set a size limit for the CSS file that loads into the HTML content. If you don\'t want any CSS file to be included in the main HTML, set this to 0.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MINIFICATION,
			false,
			true,
			function () {
				return __( 'CSS Minification', 'urlslab' );
			},
			function () {
				return __( 'Minify CSS files by eliminating whitespace, deleting comments and refining/abbreviating some common coding patterns.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MERGE,
			false,
			true,
			function () {
				return __( 'Merge CSS', 'urlslab' );
			},
			function () {
				return __( 'Merge all CSS files used on the page into a single file.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);

		$this->add_options_form_section(
			'js',
			function () {
				return __( 'Javascript', 'urlslab' );
			},
			function () {
				return __( 'Improving your website\'s speed is essential and can be accomplished by optimizing resources like JavaScript files. Configuring these files with a specific size limit and expiry date improves your website\'s performance and loading speed.', 'urlslab' );
			},
			array( self::LABEL_FREE, self::LABEL_EXPERIMENTAL, self::LABEL_EXPERT )
		);

		$this->add_option_definition(
			self::SETTING_NAME_JS_PROCESSING,
			false,
			true,
			function () {
				return __( 'Process Javascript files', 'urlslab' );
			},
			function () {
				return __( 'Download JavaScript files, saves them to the database, and enhances for optimal performance.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js',
			array( self::LABEL_EXPERIMENTAL, self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MAX_SIZE,
			0,
			true,
			function () {
				return __( 'Convert Small JavaScript Files Into Inline HTML (bytes)', 'urlslab' );
			},
			function () {
				return __( 'Set a size limit for the JavaScript file that loads into the HTML content. If you don\'t want any JavaScript file to be included in the main HTML, set this to 0.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'js',
			array( self::LABEL_EXPERIMENTAL, self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MINIFICATION,
			false,
			true,
			function () {
				return __( 'JavaScript Minification', 'urlslab' );
			},
			function () {
				return __( 'Minify JavaScript files by eliminating whitespace, deleting comments and refining/abbreviating some common coding patterns.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js',
			array( self::LABEL_EXPERIMENTAL, self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_REMOVE_WP_EMOJI,
			true,
			true,
			function () {
				return __( 'Remove WordPress Emoji', 'urlslab' );
			},
			function () {
				return __( 'To optimize website performance, consider removing WordPress Emoji to reduce unnecessary requests for a JavaScript file. Since WP Emojis are seldom utilized, it is advisable to exclude the loading of this particular JavaScript file if it is not required.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_REMOVE_JQ_MIGRATE,
			true,
			true,
			function () {
				return __( 'Remove JQuery Migrate', 'urlslab' );
			},
			function () {
				return __( 'To optimize website performance, consider removing JQuery Migrate to reduce unnecessary requests for a JavaScript file.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_REMOVE_QUERY_STRINGS,
			true,
			true,
			function () {
				return __( 'Remove Query Strings', 'urlslab' );
			},
			function () {
				return __( 'Removing query strings from static resources offers benefits such as enhanced caching and reduced page load time. However, it is essential to note that you will need to responsibly manage cache clearing when making updates to plugins or designs on your website.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js',
			array( self::LABEL_EXPERT )
		);
	}

	public function register_routes() {
		( new Urlslab_Api_Css_Cache() )->register_routes();
		( new Urlslab_Api_Js_Cache() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'Performance' => __( 'Performance', 'urlslab' ) );
	}

	public function user_trailingslashit( $string, $type_of_url ) {
		// Your custom URL pattern
		if ( str_contains( $string, self::DOWNLOAD_CSS_URL_PATH ) || str_contains( $string, self::DOWNLOAD_JS_URL_PATH ) ) {
			return untrailingslashit( $string );
		}

		return $string;
	}

	public function redirect_canonical( $redirect_url, $requested_url ) {
		// Check if the requested URL is for our custom route
		if ( str_contains( $requested_url, self::DOWNLOAD_CSS_URL_PATH ) || str_contains( $requested_url, self::DOWNLOAD_JS_URL_PATH ) ) {
			return false;
		}

		return $redirect_url; // Return the default behavior
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_404() || is_user_logged_in() ) {
			return;
		}
		$this->css_processing( $document );
		$this->js_processing( $document );
	}

	/**
	 * @param DOMDocument $document
	 *
	 * @return void
	 */
	private function css_processing( DOMDocument $document ): void {
		if ( ! $this->get_option( self::SETTING_NAME_CSS_PROCESSING ) ) {
			return;
		}
		try {
			$xpath     = new DOMXPath( $document );
			$css_links = $xpath->query( "//link[@rel='stylesheet' and (@type='text/css' or not(@type)) and @href ]" );
			$links     = array();
			foreach ( $css_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'href' ) ] ) ) {
					try {
						$url = new Urlslab_Url( $link_object->getAttribute( 'href' ) );
						if ( $url->is_wp_domain() ) {
							$links[ $link_object->getAttribute( 'href' ) ] = $url->get_url_id();
						}
					} catch ( Exception $e ) {
					}
				}
			}

			$css_files = Urlslab_Data_CSS_Cache::get_css_files( $links );

			$remove_elements = array();
			if ( $this->get_option( self::SETTING_NAME_CSS_MAX_SIZE ) > 0 ) {
				foreach ( $css_links as $link_object ) {
					if ( isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
						$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
						if (
							Urlslab_Data_CSS_Cache::STATUS_ACTIVE == $css_object->get_status() &&
							$this->get_option( self::SETTING_NAME_CSS_MAX_SIZE ) > $css_object->get_filesize() &&
							( $this->get_current_page_size() + $css_object->get_filesize() ) < $this->get_option( self::SETTING_NAME_HMTL_MAX_SIZE )
						) {
							$old_error_handler = set_error_handler(
								function ( $errno, $errstr, $errfile, $errline ) {
									throw new Exception( $errstr );
								}
							);
							try {
								$new_elm = $document->createElement( 'style', $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ]->get_css_content() );
								set_error_handler( $old_error_handler );
							} catch ( Exception $e ) {
								set_error_handler( $old_error_handler );
								continue;
							}

							$new_elm->setAttribute( 'type', 'text/css' );
							if ( $link_object->hasAttribute( 'media' ) ) {
								$new_elm->setAttribute( 'media', $link_object->getAttribute( 'media' ) );
							}
							if ( $link_object->hasAttribute( 'id' ) ) {
								$new_elm->setAttribute( 'id', $link_object->getAttribute( 'id' ) );
							}
							$link_object->setAttribute( 'urlslab-old', 'should-remove' );
							$new_elm->setAttribute( 'urlslab-css', '1' );
							$link_object->parentNode->insertBefore( $new_elm, $link_object );
							$remove_elements[] = $link_object;
							$this->current_page_size_increased( $css_object->get_filesize() );
						}
					}
				}
			}

			if ( $this->get_option( self::SETTING_NAME_CSS_MERGE ) ) {
				$merged_css_files = array();
				$first_node       = null;
				foreach ( $css_links as $link_object ) {
					if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
						$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
						if ( Urlslab_Data_CSS_Cache::STATUS_ACTIVE == $css_object->get_status() ) {
							$remove_elements[]  = $link_object;
							$merged_css_files[] = $css_object;
							if ( null === $first_node ) {
								$first_node = $link_object;
							}
						}
					}
				}
				if ( ! empty( $merged_css_files ) && null !== $first_node ) {
					$new_elm = $document->createElement( 'link' );
					$new_elm->setAttribute( 'rel', 'stylesheet' );
					$new_elm->setAttribute( 'href', $this->get_merge_css_url( $merged_css_files ) );
					$first_node->parentNode->insertBefore( $new_elm, $first_node );
				}
			} else {
				if ( $this->get_option( self::SETTING_NAME_CSS_MINIFICATION ) ) {
					foreach ( $css_links as $link_object ) {
						if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
							$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
							if ( Urlslab_Data_CSS_Cache::STATUS_ACTIVE == $css_object->get_status() ) {
								$link_object->setAttribute( 'href', $this->get_merge_css_url( array( $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) );
							}
						}
					}

				}
			}

			foreach ( $remove_elements as $element ) {
				$element->parentNode->removeChild( $element );
			}

			$this->insert_missing_css_files( $links, $css_files );

		} catch ( Exception $e ) {
		}
	}

	/**
	 * @param mixed $css
	 *
	 * @return string
	 */
	private function get_css_content( string $css ): string {
		$css_content = '';
		$css_files   = explode( '_', $css );
		$css_objects = Urlslab_Data_CSS_Cache::get_css_files( $css_files );
		foreach ( $css_files as $css_file_id ) {
			if ( isset( $css_objects[ $css_file_id ] ) && Urlslab_Data_CSS_Cache::STATUS_ACTIVE == $css_objects[ $css_file_id ]->get_status() ) {
				$css_content .= $css_objects[ $css_file_id ]->get_css_content() . "\n\n";
			}
		}

		return $css_content;
	}

	/**
	 * @param Urlslab_Data_CSS_Cache[] $merged_css_files
	 *
	 * @return string|null
	 */
	public function get_merge_css_url( array $merged_css_files ) {
		$ids = array();
		foreach ( $merged_css_files as $css_file ) {
			$ids[] = $css_file->get_url_id();
		}

		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			return trailingslashit( site_url() ) . self::DOWNLOAD_CSS_URL_PATH . urlencode( implode( '_', $ids ) ) . '.css';
		} else {
			return add_query_arg(
				array(
					'action' => self::DOWNLOAD_CSS_URL_PATH,
					'ul_css'    => urlencode( implode( '_', $ids ) ),
				),
				site_url()
			);
		}
	}

	private function insert_missing_css_files( array $links, array $css_files ) {
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();

		foreach ( $links as $url => $urld_id ) {
			if ( ! isset( $css_files[ $urld_id ] ) ) {
				$placeholders[] = '(%d,%s,%s,%s)';
				array_push(
					$values,
					$urld_id,
					$url,
					Urlslab_Data_CSS_Cache::STATUS_NEW,
					$now
				);
			}
		}
		if ( ! empty( $values ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_CSS_CACHE_TABLE . ' (url_id,url,status,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	private function js_processing( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_JS_PROCESSING ) ) {
			return;
		}

		try {
			$xpath    = new DOMXPath( $document );
			$js_links = $xpath->query( '//script[@src]' );
			$links    = array();
			foreach ( $js_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'src' ) ] ) && ! $this->is_blacklisted_url( $link_object->getAttribute( 'src' ) ) ) {
					try {
						$url = new Urlslab_Url( $link_object->getAttribute( 'src' ) );
						if ( $url->is_wp_domain() ) {
							$links[ $link_object->getAttribute( 'src' ) ] = $url->get_url_id();
						}
					} catch ( Exception $e ) {
					}
				}
			}

			$js_files = Urlslab_Data_Js_Cache::get_js_files( $links );

			$remove_elements = array();
			if ( $this->get_option( self::SETTING_NAME_JS_MAX_SIZE ) > 0 ) {
				foreach ( $js_links as $link_object ) {
					if ( isset( $links[ $link_object->getAttribute( 'src' ) ], $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) {
						$js_object = $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ];
						if (
							Urlslab_Data_Js_Cache::STATUS_ACTIVE == $js_object->get_status() &&
							$this->get_option( self::SETTING_NAME_JS_MAX_SIZE ) > $js_object->get_filesize() &&
							( $this->get_current_page_size() + $js_object->get_filesize() ) < $this->get_option( self::SETTING_NAME_HMTL_MAX_SIZE )
						) {
							$old_error_handler = set_error_handler(
								function ( $errno, $errstr, $errfile, $errline ) {
									throw new Exception( $errstr );
								}
							);
							try {
								$new_elm = $document->createElement( 'script', $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ]->get_js_content() );
								set_error_handler( $old_error_handler );
							} catch ( Exception $e ) {
								set_error_handler( $old_error_handler );
								continue;
							}
							if ( $link_object->hasAttribute( 'id' ) ) {
								$new_elm->setAttribute( 'id', $link_object->getAttribute( 'id' ) );
							}
							$link_object->setAttribute( 'urlslab-old', 'should-remove' );
							$new_elm->setAttribute( 'urlslab-js', '1' );
							$link_object->parentNode->insertBefore( $new_elm, $link_object );
							$remove_elements[] = $link_object;
							$this->current_page_size_increased( $js_object->get_filesize() );
						}
					}
				}
			}

			if ( $this->get_option( self::SETTING_NAME_JS_MINIFICATION ) ) {
				foreach ( $js_links as $link_object ) {
					if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'src' ) ], $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) {
						$js_object = $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ];
						if ( Urlslab_Data_Js_Cache::STATUS_ACTIVE == $js_object->get_status() ) {
							$link_object->setAttribute( 'src', $this->get_merge_js_url( array( $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) );
						}
					}
				}

			}

			foreach ( $remove_elements as $element ) {
				$element->parentNode->removeChild( $element );
			}

			$this->insert_missing_js_files( $links, $js_files );

		} catch ( Exception $e ) {
		}
	}

	private function is_blacklisted_url( string $url ): bool {
		return false !== strpos( $url, 'wordfence_syncAttackData' );
	}

	/**
	 * @param mixed $js
	 *
	 * @return string
	 */
	private function get_js_content( string $js ): string {
		$js_content = '';
		$js_files   = explode( '_', $js );
		$js_objects = Urlslab_Data_Js_Cache::get_js_files( $js_files );
		foreach ( $js_files as $js_file_id ) {
			if ( isset( $js_objects[ $js_file_id ] ) && Urlslab_Data_Js_Cache::STATUS_ACTIVE == $js_objects[ $js_file_id ]->get_status() ) {
				$js_content .= $js_objects[ $js_file_id ]->get_js_content() . "\n\n";
			}
		}

		return $js_content;
	}

	/**
	 * @param Urlslab_Data_Js_Cache[] $merged_js_files
	 *
	 * @return string|null
	 */
	public function get_merge_js_url( array $merged_js_files ) {
		$ids = array();
		foreach ( $merged_js_files as $js_file ) {
			$ids[] = $js_file->get_url_id();
		}

		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			return trailingslashit( site_url() ) . self::DOWNLOAD_JS_URL_PATH . urlencode( implode( '_', $ids ) ) . '.js';
		} else {
			return add_query_arg(
				array(
					'action' => self::DOWNLOAD_JS_URL_PATH,
					'ul_js'  => urlencode( implode( '_', $ids ) ),
				),
				site_url()
			);
		}
	}

	private function insert_missing_js_files( array $links, array $js_files ) {
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();

		foreach ( $links as $url => $urld_id ) {
			if ( ! isset( $js_files[ $urld_id ] ) && ! $this->is_blacklisted_url( $url ) ) {
				$placeholders[] = '(%d,%s,%s,%s)';
				array_push(
					$values,
					$urld_id,
					$url,
					Urlslab_Data_Js_Cache::STATUS_NEW,
					$now
				);
			}
		}
		if ( ! empty( $values ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_JS_CACHE_TABLE . ' (url_id,url,status,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	public function minify_head_content( $content ) {
		return $this->minify_content( $content, true );
	}

	public function minify_content( $content, bool $is_head = false ) {
		if ( empty( $content ) || is_404() || is_user_logged_in() || ! $this->get_option( self::SETTING_NAME_HTML_MINIFICATION ) ) {
			return $content;
		}
		try {
			$htmlMin = new \voku\helper\HtmlMin();
			$htmlMin->doOptimizeViaHtmlDomParser();
			$htmlMin->doRemoveComments( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS ) );
			$htmlMin->doSumUpWhitespace( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doRemoveWhitespaceAroundTags( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doOptimizeAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doKeepHttpAndHttpsPrefixOnExternalAttributes( true );
			if ( $is_head ) {
				$htmlMin->doRemoveHttpPrefixFromAttributes( false );
				$htmlMin->doRemoveHttpsPrefixFromAttributes( false );
			} else {
				$htmlMin->doRemoveHttpPrefixFromAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX ) );
				$htmlMin->doRemoveHttpsPrefixFromAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX ) );
			}
			$htmlMin->doKeepHttpAndHttpsPrefixOnExternalAttributes( true );
			$htmlMin->doRemoveDefaultAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveDeprecatedAnchorName( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedScriptCharsetAttribute( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromScriptTag( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromStylesheetLink( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromStyleAndLinkTag( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDefaultTypeFromButton( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveEmptyAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveValueFromEmptyInput( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doSortCssClassNames( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_SORT ) );
			$htmlMin->doSortHtmlAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_SORT ) );
			$htmlMin->doRemoveSpacesBetweenTags( $is_head && $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doRemoveOmittedQuotes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED ) );
			$htmlMin->doRemoveOmittedHtmlTags( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED ) );

			return $htmlMin->minify( $content );
		} catch ( \Exception $e ) {
			return $content;
		}
	}

	public function minify_body_content( $content ) {
		return $this->minify_content( $content );
	}

	public function query_vars( $vars ) {
		if ( ! in_array( 'ul_css', $vars ) ) {
			$vars[] = 'ul_css';
		}
		if ( ! in_array( 'ul_js', $vars ) ) {
			$vars[] = 'ul_js';
		}

		return parent::query_vars( $vars );
	}

	public function output_css() {
		$css = sanitize_key( get_query_var( 'ul_css' ) );
		if ( $css ) {
			$css_content = $this->get_css_content( $css );
			status_header( 200 );
			@header( 'Content-Type: text/css; charset=utf-8' );
			@header( 'Content-Transfer-Encoding: binary' );
			@header( 'Pragma: public' );
			@header( 'Content-length: ' . strlen( $css_content ) );

			// $css_content is a css content. Escaping this kind of data is not necessary
			// (rsp. there is no special escaping function for css designed in WP). In addition, this data is fetched directly
			// from the webpage, so It has been escaped before being offloaded to the database. solely, this function
			// is serving the raw css stored in DB. escaping this data might result in unexpected behavior
			echo $css_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			flush();
			/** @var Urlslab_Widget_Cache $widget_cache */
			$widget_cache = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
			if ( $widget_cache ) {
				$widget_cache->page_cache_save( $css_content );
			}
			exit();
		}
	}

	public function output_js() {
		$js = sanitize_key( get_query_var( 'ul_js' ) );
		if ( $js ) {
			$js_content = $this->get_js_content( $js );
			status_header( 200 );
			@header( 'Content-Type: application/javascript; charset=utf-8' );
			@header( 'Content-Transfer-Encoding: binary' );
			@header( 'Pragma: public' );
			@header( 'Content-length: ' . strlen( $js_content ) );

			// $js_content is a js content. Escaping this kind of data is not necessary
			// (rsp. there is no special escaping function for js designed in WP). In addition, this data is fetched directly
			// from the webpage, so It has been escaped before being offloaded to the database. solely, this function
			// is serving the raw js stored in DB. escaping this data might result in unexpected behavior
			echo $js_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			flush();
			/** @var Urlslab_Widget_Cache $widget_cache */
			$widget_cache = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
			if ( $widget_cache ) {
				$widget_cache->page_cache_save( $js_content );
			}
			exit();
		}
	}

	private function get_current_page_size(): int {
		return self::$current_page_size;
	}

	private function current_page_size_increased( int $size ): void {
		self::$current_page_size += $size;
	}

	public function set_page_size( $content ) {
		$this->current_page_size_increased( strlen( $content ) );

		return $content;
	}
}
