<?php

class Urlslab_Widget_Security extends Urlslab_Widget {
	public const SLUG = 'urlslab-security';
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
	const SETTING_NAME_BLOCK_404_IP_SECONDS = 'urlslab-cache-block-404-ip';
	const SETTING_NAME_BLOCK_404_IP_COUNT = 'urlslab-cache-block-404-ip-count';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Security', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Protect your page against some basic attacks on your WordPress installation.', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function register_routes() {

	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'set_404', $this, 'set_404', PHP_INT_MIN );
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'init_check', PHP_INT_MIN );
//		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'page_cache_headers', PHP_INT_MAX, 1 );
//		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'page_cache_start', PHP_INT_MAX, 0 );
//		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_cache_save', 0, 0 );
//		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook_link_preloading', 40 );
//		Urlslab_Loader::get_instance()->add_action( 'wp_resource_hints', $this, 'resource_hints', 15, 2 );
	}


	public function init_check( $is_404 = false ) {
		$ip = self::get_visitor_ip();
		if ( ! is_admin() && $this->is_locked( $ip ) ) {
			Urlslab_Widget_Security::process_lock_404_page();
		}
	}

	public function set_404() {
		if ( $this->get_option( self::SETTING_NAME_BLOCK_404_IP_SECONDS ) && 1 < $this->get_option( self::SETTING_NAME_BLOCK_404_IP_COUNT ) ) {
			$ip = self::get_visitor_ip();
			if ( ! $this->is_locked( $ip ) ) {
				$value = get_transient( 'urlslab-404-' . $ip );
				if ( false === $value ) {
					set_transient( 'urlslab-404-' . $ip, 1, 60 );
				} else if ( $value < $this->get_option( self::SETTING_NAME_BLOCK_404_IP_COUNT ) ) {
					set_transient( 'urlslab-404-' . $ip, ++ $value, 60 );
				} else {
					$this->lock_ip( $ip, $this->get_option( self::SETTING_NAME_BLOCK_404_IP_SECONDS ) );
					self::process_lock_404_page();
				}
			}
		}
	}

	public static function process_lock_404_page() {
		header_remove( 'ETag' );
		header_remove( 'Pragma' );
		header_remove( 'Cache-Control' );
		header_remove( 'Last-Modified' );
		header_remove( 'Expires' );
		header( 'HTTP/1.1 429 Too Many Requests' );
		header( 'Expires: Thu, 1 Jan 1970 00:00:00 GMT' );
		header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
		header( 'Cache-Control: post-check=0, pre-check=0', false );
		header( 'Pragma: no-cache' );

		echo 'IP blocked';
		die();
	}

	private function get_ip_lock_file_name( $ip ): string {
		return wp_upload_dir()['basedir'] . '/urlslab/' . md5( $ip ) . '_lock.html';
	}

	private function lock_ip( $ip, $seconds ) {
		if ( strlen( $ip ) ) {
			$file_name = $this->get_ip_lock_file_name( $ip );
			if ( ! is_file( $file_name ) ) {
				@file_put_contents( $file_name, time() + $seconds );
			}
		}
	}

	private function is_locked( $ip ) {
		if (
			isset( $_SERVER['REQUEST_METHOD'] ) &&
			'GET' === $_SERVER['REQUEST_METHOD'] &&
			(
				! isset( $_SERVER['HTTP_COOKIE'] ) ||
				! preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['HTTP_COOKIE'] )
			) &&
			(
				! isset( $_SERVER['REQUEST_URI'] ) ||
				! preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['REQUEST_URI'] )
			)
		) {


			if ( empty( $ip ) ) {
				return false;
			}

			$file_name = $this->get_ip_lock_file_name( $ip );
			if ( is_file( $file_name ) ) {
				$time = file_get_contents( $file_name );
				if ( 0 < $time - time() ) {
					return true;
				} else {
					@unlink( $file_name );
				}
			}
		}

		return false;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'404',
			function() {
				return __( '404 Not Found Page attacks', 'urlslab' );
			},
			function() {
				return __( 'Common attack pattern is to scan your wordpress website and scan wurnerabilities. During such attacks is generated from same IP address huge amount of 404 Not Found pages, what could even overpower your server. URLsLab plugin can protect you against these attacks and block IP address of visitor for defined amount of time.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_BLOCK_404_IP_COUNT,
			90,
			true,
			function() {
				return __( 'Rate limit 404 attempts from IP (per minute)', 'urlslab' );
			},
			function() {
				return __( 'If visitor from specific address executes more requests per minute to not existing urls, he will be blocked for defined amount of time. Lower the number you set, more strict is the protection. If your page contains e.g. many links to not existing urls, it can lock out even real visitor.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			null,
			'404',
			array( self::LABEL_EXPERT ),
		);
		$this->add_option_definition(
			self::SETTING_NAME_BLOCK_404_IP_SECONDS,
			0,
			true,
			function() {
				return __( 'IP block time', 'urlslab' );
			},
			function() {
				return __( 'Enter time in seconds to block IP address attacking your website through not found pages. If set to 0, no IP will be blocked.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			null,
			'404',
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
	}

	public function get_widget_group() {
		return __( 'Performance', 'urlslab' );
	}

}
