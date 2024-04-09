<?php

class Urlslab_Widget_Security extends Urlslab_Widget {
	public const SLUG = 'urlslab-security';
	const SETTING_NAME_CSP_DEFAULT = 'urlslab-sec-csp-default';
	const SETTING_NAME_CSP_CHILD = 'urlslab-sec-csp-child';
	const SETTING_NAME_CSP_FONT = 'urlslab-sec-csp-font';
	const SETTING_NAME_CSP_FRAME = 'urlslab-sec-csp-frame';
	const SETTING_NAME_CSP_IMG = 'urlslab-sec-csp-img';
	const SETTING_NAME_CSP_MANIFEST = 'urlslab-sec-csp-manifest';
	const SETTING_NAME_CSP_MEDIA = 'urlslab-sec-csp-media';
	const SETTING_NAME_CSP_SCRIPT = 'urlslab-sec-csp-script';
	const SETTING_NAME_CSP_ELEM = 'urlslab-sec-csp-elem';
	const SETTING_NAME_CSP_SCR_ATTR = 'urlslab-sec-csp-scr-attr';
	const SETTING_NAME_CSP_STYLE = 'urlslab-sec-csp-style';
	const SETTING_NAME_SET_CSP = 'urlslab-sec-set-csp';
	const SETTING_NAME_CSP_SRC_ELEM = 'urlslab-sec-csp-src-elem';
	const SETTING_NAME_CSP_SRC_ATTR = 'urlslab-sec-csp-src-attr';
	const SETTING_NAME_CSP_WORKER = 'urlslab-sec-csp-worker';
	const SETTING_NAME_CSP_ACTION = 'urlslab-sec-csp-action';
	const SETTING_NAME_BLOCK_404_IP_SECONDS = 'urlslab-sec-block-404-ttl';
	const SETTING_NAME_BLOCK_404_IP_COUNT = 'urlslab-sec-block-404-cnt';
	const SETTING_NAME_RATELIMIT_IP_SECONDS = 'urlslab-sec-ratelimit-ttl';
	const SETTING_NAME_RATELIMIT_IP_COUNT = 'urlslab-sec-ratelimit-cnt';
	const SETTING_NAME_RATELIMIT = 'urlslab-sec-ratelimit';
	const SETTING_NAME_BLOCK_404_IP = 'urlslab-sec-block-404';
	const SETTING_NAME_CSP_REPORT = 'urlslab-sec-csp-report';
	const SETTING_NAME_CSP_REPORT_URL_DETAIL = 'urlslab-sec-csp-url-detail';
	const SETTING_NAME_REFERRER_POLICY = 'urlslab-sec-referrer-policy';
	const SETTING_NAME_PERMISSIONS_POLICY = 'urlslab-sec-permissions-policy';
	const SETTING_NAME_STRICT_TRANSPORT_SECURITY = 'urlslab-sec-strict-transp-sec';
	const SETTING_NAME_X_CONTENT_TYPE_OPTIONS = 'urlslab-sec-x-content-type-opt';
	const SETTING_NAME_X_FRAME_OPTIONS = 'urlslab-sec-x-frame-opt';
	const SETTING_NAME_CSP_CONNECT = 'urlslab-sec-csp-connect';
	const SETTING_NAME_CSP_BASE_URI = 'urlslab-sec-csp-base-uri';
	const SETTING_NAME_CSP_OBJECT = 'urlslab-sec-csp-object';
	const SETTING_NAME_CSP_SANDBOX = 'urlslab-sec-csp-sandbox';
	const SETTING_NAME_CSP_UPGRADE_INSECURE_REQUESTS = 'urlslab-sec-csp-up-insec';
	const SETTING_NAME_CSP_REPORT_TRACKING = 'urlslab-sec-csp-report-javascript';
	const TRACK_WITH_JAVASCRIPT = 'js';

	const KEYWORDS = array(
		"'none'",
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
		"'unsafe-hashes'",
		"'wasm-unsafe-eval'",
		"'strict-dynamic'",
		"'report-sample'",
		"'inline-speculation-rules'",
		'blob:',
		'data:',
	);

	public function add_to_csp_settings( Urlslab_Data_Csp $csp_violation ): bool {
		switch ( $csp_violation->get_violated_directive() ) {
			case 'script-src':
				$setting_name = self::SETTING_NAME_CSP_SCRIPT;
				break;
			case 'script-src-elem':
				$setting_name = self::SETTING_NAME_CSP_ELEM;
				break;
			case 'script-src-attr':
				$setting_name = self::SETTING_NAME_CSP_SCR_ATTR;
				break;
			case 'style-src':
				$setting_name = self::SETTING_NAME_CSP_STYLE;
				break;
			case 'style-src-elem':
				$setting_name = self::SETTING_NAME_CSP_SRC_ELEM;
				break;
			case 'style-src-attr':
				$setting_name = self::SETTING_NAME_CSP_SRC_ATTR;
				break;
			case 'img-src':
				$setting_name = self::SETTING_NAME_CSP_IMG;
				break;
			case 'font-src':
				$setting_name = self::SETTING_NAME_CSP_FONT;
				break;
			case 'connect-src':
				$setting_name = self::SETTING_NAME_CSP_CONNECT;
				break;
			case 'media-src':
				$setting_name = self::SETTING_NAME_CSP_MEDIA;
				break;
			case 'object-src':
				$setting_name = self::SETTING_NAME_CSP_OBJECT;
				break;
			case 'child-src':
				$setting_name = self::SETTING_NAME_CSP_CHILD;
				break;
			case 'frame-src':
				$setting_name = self::SETTING_NAME_CSP_FRAME;
				break;
			case 'manifest-src':
				$setting_name = self::SETTING_NAME_CSP_MANIFEST;
				break;
			case 'worker-src':
				$setting_name = self::SETTING_NAME_CSP_WORKER;
				break;
			case 'base-uri':
				$setting_name = self::SETTING_NAME_CSP_BASE_URI;
				break;
			case 'form-action':
				$setting_name = self::SETTING_NAME_CSP_ACTION;
				break;
			case 'default-src':
				$setting_name = self::SETTING_NAME_CSP_DEFAULT;
				break;
			default:
				return false;
		}

		$setting_values = explode( ' ', $this->get_option( $setting_name ) );
		$value          = $csp_violation->get_blocked_url();
		switch ( $value ) {
			case 'self':
				$value = "'self'";
				break;
			case 'unsafe-inline':
				$value = "'unsafe-inline'";
				break;
			case 'unsafe-eval':
				$value = "'unsafe-eval'";
				break;
			case 'unsafe-hashes':
				$value = "'unsafe-hashes'";
				break;
			case 'wasm-unsafe-eval':
				$value = "'wasm-unsafe-eval'";
				break;
			case 'strict-dynamic':
				$value = "'strict-dynamic'";
				break;
			case 'report-sample':
				$value = "'report-sample'";
				break;
			case 'inline-speculation-rules':
				$value = "'inline-speculation-rules'";
				break;
			case 'blob':
				$value = 'blob:';
				break;
			case 'data':
				$value = 'data:';
				break;
			default:
				try {
					$url   = new Urlslab_Url( $value, true );
					$value = $url->get_domain_name();
				} catch ( Exception $e ) {
					return false;
				}
				break;
		}

		if ( ! in_array( $value, $setting_values, true ) ) {
			$setting_values[] = $value;
			return $this->update_option( $setting_name, trim( implode( ' ', $setting_values ) ) );
		}

		return false;
	}

	private static function is_valid_csp_value( $value ): bool {
		// Split the directive value into parts to validate each source separately
		$parts = explode( ' ', $value );

		foreach ( $parts as $part ) {
			$part = strtolower( trim( $part ) );

			if ( empty( $part ) ) {
				continue;
			}

			// Check if the part is an allowed keyword
			if ( in_array( $part, self::KEYWORDS, true ) ) {
				continue;
			}

			if ( ! preg_match( '/^\'nonce-[A-Za-z0-9+\/]+[=]{0,2}\'$|^\'sha(256|384|512)-[A-Za-z0-9+\/]+[=]{0,2}\'$|^((https?|wss?):\/\/)?[a-zA-Z0-9\-\.\*]+(:[0-9]+)?(\/.*)?$/', $part ) ) {
				return false;
			}
		}

		return true;
	}

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
		( new Urlslab_Api_Security() )->register_routes();
	}

	public function register_public_routes() {
		( new Urlslab_Api_Security() )->register_public_routes();
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'set_404', $this, 'set_404', PHP_INT_MIN );
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'init_check', PHP_INT_MIN );
		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_shutdown', 0, 0 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_head_content_raw', $this, 'raw_head_content', 0 );
		Urlslab_Loader::get_instance()->add_filter( 'wp_headers', $this, 'page_headers', 10, 1 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_cache_hit_headers', $this, 'page_headers', 10, 1 );
	}

	public function page_headers( $headers ) {
		if ( ! isset( $_SERVER['UL_CSP'] ) && ! isset( $headers['Content-Security-Policy'] ) ) {
			$csp = $this->get_csp( true );
			if ( ! empty( $csp ) && 4000 > strlen( $csp ) ) {
				if ( 'report' !== $this->get_option( Urlslab_Widget_Security::SETTING_NAME_SET_CSP ) ) {
					$headers['Content-Security-Policy'] = $csp;
				} else {
					$headers['Content-Security-Policy-Report-Only'] = $csp;
				}
			}
		}

		return $headers;
	}

	public function raw_head_content( $content ) {
		if ( ! $this->is_enabled() ) {
			return $content;
		}

		if ( self::TRACK_WITH_JAVASCRIPT === $this->get_option( self::SETTING_NAME_CSP_REPORT_TRACKING ) && $this->get_option( self::SETTING_NAME_CSP_REPORT ) ) {
			$tracking_script = "<script>(function(){var cspReports=[];var reportTimer;function urlslabSendCspReports(){if(cspReports.length===0)return;var xhr=new XMLHttpRequest();xhr.open('POST','" . rest_url( 'urlslab/v1/security/report_csp' ) . "');xhr.setRequestHeader('Content-Type','application/json');xhr.send(JSON.stringify(cspReports));cspReports=[];}function urlslabCspViolationHandler(e){cspReports.push({'blocked-uri':e.blockedURI,'violated-directive':e.violatedDirective,});clearTimeout(reportTimer);reportTimer=setTimeout(urlslabSendCspReports,5000);}document.addEventListener('securitypolicyviolation',urlslabCspViolationHandler);})();</script>";
			$content         = $tracking_script . $content;
		}

		if ( 'enforce' === $this->get_option( self::SETTING_NAME_SET_CSP ) && ! is_admin() && ! preg_match( '/Content-Security-Policy/i', $content ) ) {
			$csp = $this->get_csp( false );
			if ( 4000 <= strlen( $csp ) ) {
				$content = '<meta http-equiv="Content-Security-Policy" content="' . esc_attr( $csp ) . '"/>' . $content;
			}
		}

		if ( 'none' != $this->get_option( self::SETTING_NAME_REFERRER_POLICY ) && ! is_admin() && ! preg_match( '/<meta[^>]*referrer[^>]*>/i', $content ) ) {
			$content = '<meta name="referrer" content="' . esc_attr( $this->get_option( self::SETTING_NAME_REFERRER_POLICY ) ) . '">' . $content;
		}

		return $content;
	}

	public function get_csp( $is_header ) {
		$csp = '';
		if ( 'none' !== $this->get_option( self::SETTING_NAME_SET_CSP ) ) {
			$csp =
				( $this->get_option( self::SETTING_NAME_CSP_UPGRADE_INSECURE_REQUESTS ) ? 'upgrade-insecure-requests; ' : '' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_DEFAULT ) ) ? '' : 'default-src ' . $this->get_option( self::SETTING_NAME_CSP_DEFAULT ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_BASE_URI ) ) ? '' : 'base-uri ' . $this->get_option( self::SETTING_NAME_CSP_BASE_URI ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_CHILD ) ) ? '' : 'child-src ' . $this->get_option( self::SETTING_NAME_CSP_CHILD ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_CONNECT ) ) ? '' : 'connect-src ' . $this->get_option( self::SETTING_NAME_CSP_CONNECT ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_FONT ) ) ? '' : 'font-src ' . $this->get_option( self::SETTING_NAME_CSP_FONT ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_FRAME ) ) ? '' : 'frame-src ' . $this->get_option( self::SETTING_NAME_CSP_FRAME ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_IMG ) ) ? '' : 'img-src ' . $this->get_option( self::SETTING_NAME_CSP_IMG ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_MANIFEST ) ) ? '' : 'manifest-src ' . $this->get_option( self::SETTING_NAME_CSP_MANIFEST ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_MEDIA ) ) ? '' : 'media-src ' . $this->get_option( self::SETTING_NAME_CSP_MEDIA ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_OBJECT ) ) ? '' : 'object-src ' . $this->get_option( self::SETTING_NAME_CSP_OBJECT ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_SCRIPT ) ) ? '' : 'script-src ' . $this->get_option( self::SETTING_NAME_CSP_SCRIPT ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_ELEM ) ) ? '' : 'script-src-elem ' . $this->get_option( self::SETTING_NAME_CSP_ELEM ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_SCR_ATTR ) ) ? '' : 'script-src-attr ' . $this->get_option( self::SETTING_NAME_CSP_SCR_ATTR ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_STYLE ) ) ? '' : 'style-src ' . $this->get_option( self::SETTING_NAME_CSP_STYLE ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_SRC_ELEM ) ) ? '' : 'style-src-elem ' . $this->get_option( self::SETTING_NAME_CSP_SRC_ELEM ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_SRC_ATTR ) ) ? '' : 'style-src-attr ' . $this->get_option( self::SETTING_NAME_CSP_SRC_ATTR ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_WORKER ) ) ? '' : 'worker-src ' . $this->get_option( self::SETTING_NAME_CSP_WORKER ) . '; ' ) .
				( empty( $this->get_option( self::SETTING_NAME_CSP_ACTION ) ) ? '' : 'form-action ' . $this->get_option( self::SETTING_NAME_CSP_ACTION ) . '; ' ) .
				( $is_header && strlen( $this->get_option( self::SETTING_NAME_CSP_SANDBOX ) ) ? 'sandbox ' . implode( ' ', explode( ',', $this->get_option( self::SETTING_NAME_CSP_SANDBOX ) ) ) . '; ' : '' ) .
				( $is_header && $this->get_option( self::SETTING_NAME_CSP_REPORT ) && self::TRACK_WITH_JAVASCRIPT !== $this->get_option( self::SETTING_NAME_CSP_REPORT_TRACKING ) ? 'report-uri ' . rest_url( 'urlslab/v1/security/report_csp' ) . '; ' : '' );
		}

		return $csp;
	}


	public function update_option( $option_id, $value ): bool {
		$ret = parent::update_option( $option_id, $value );
		if ( $ret ) {
			switch ( $option_id ) {
				case self::SETTING_NAME_CSP_UPGRADE_INSECURE_REQUESTS:
				case self::SETTING_NAME_CSP_DEFAULT:
				case self::SETTING_NAME_CSP_BASE_URI:
				case self::SETTING_NAME_CSP_CHILD:
				case self::SETTING_NAME_CSP_CONNECT:
				case self::SETTING_NAME_CSP_FONT:
				case self::SETTING_NAME_CSP_FRAME:
				case self::SETTING_NAME_CSP_IMG:
				case self::SETTING_NAME_CSP_MANIFEST:
				case self::SETTING_NAME_CSP_MEDIA:
				case self::SETTING_NAME_CSP_OBJECT:
				case self::SETTING_NAME_CSP_SCRIPT:
				case self::SETTING_NAME_CSP_ELEM:
				case self::SETTING_NAME_CSP_SCR_ATTR:
				case self::SETTING_NAME_CSP_STYLE:
				case self::SETTING_NAME_CSP_SRC_ELEM:
				case self::SETTING_NAME_CSP_SRC_ATTR:
				case self::SETTING_NAME_CSP_WORKER:
				case self::SETTING_NAME_CSP_ACTION:
				case self::SETTING_NAME_CSP_SANDBOX:
				case self::SETTING_NAME_CSP_REPORT:
				case self::SETTING_NAME_CSP_REPORT_TRACKING:
				case self::SETTING_NAME_SET_CSP:
				case self::SETTING_NAME_STRICT_TRANSPORT_SECURITY:
					/** @var Urlslab_Widget_General $general_widget */
					$general_widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );
					if ( $general_widget ) {
						$general_widget->update_option( Urlslab_Widget_General::SETTING_NAME_HTACCESS_VERSION, time() );
					}
					break;
				default:
					break;
			}
		}

		return $ret;
	}

	private function is_enabled(): bool {
		if (
			! isset( $_SERVER['REQUEST_METHOD'] ) ||
			'GET' !== $_SERVER['REQUEST_METHOD'] ||
			is_admin() ||
			(
				isset( $_SERVER['HTTP_COOKIE'] ) &&
				preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['HTTP_COOKIE'] )
			) ||
			(
				isset( $_SERVER['REQUEST_URI'] ) &&
				preg_match( '/(comment_author|wp-postpass|loggedout|wptouch_switch_toggle)/', $_SERVER['REQUEST_URI'] )
			)
		) {
			return false;
		}

		return true;
	}


	public function page_shutdown() {
		if ( $this->is_enabled() && $this->get_option( self::SETTING_NAME_RATELIMIT ) ) {
			$ip = self::get_visitor_ip();
			if ( ! $this->is_locked( $ip ) ) {
				$value = get_transient( 'urlslab-rate-limit-' . $ip );
				if ( false === $value ) {
					set_transient( 'urlslab-rate-limit-' . $ip, 1, 60 );
				} else if ( $value < $this->get_option( self::SETTING_NAME_RATELIMIT_IP_COUNT ) ) {
					set_transient( 'urlslab-rate-limit-' . $ip, ++$value, 60 );
				} else {
					$this->lock_ip( $ip, $this->get_option( self::SETTING_NAME_RATELIMIT_IP_SECONDS ) );
				}
			}
		}
	}

	public function init_check( $is_404 = false ) {
		if ( $this->is_locked( self::get_visitor_ip() ) ) {
			self::process_lock_404_page();
		}
	}

	public function set_404() {
		if ( $this->get_option( self::SETTING_NAME_BLOCK_404_IP ) && $this->get_option( self::SETTING_NAME_BLOCK_404_IP_SECONDS ) && 1 < $this->get_option( self::SETTING_NAME_BLOCK_404_IP_COUNT ) ) {
			$ip = self::get_visitor_ip();
			if ( ! $this->is_locked( $ip ) ) {
				$value = get_transient( 'urlslab-404-' . $ip );
				if ( false === $value ) {
					set_transient( 'urlslab-404-' . $ip, 1, 60 );
				} else if ( $value < $this->get_option( self::SETTING_NAME_BLOCK_404_IP_COUNT ) ) {
					set_transient( 'urlslab-404-' . $ip, ++$value, 60 );
				} else {
					$this->lock_ip( $ip, $this->get_option( self::SETTING_NAME_BLOCK_404_IP_SECONDS ) );
					self::process_lock_404_page();
				}
			}
		}
	}

	public static function process_lock_404_page() {
		header_remove();
		@header( 'HTTP/1.1 429 Too Many Requests' );
		@header( 'Expires: Thu, 1 Jan 1970 00:00:00 GMT' );
		@header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
		@header( 'Cache-Control: post-check=0, pre-check=0', false );
		@header( 'Pragma: no-cache' );

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

	private function is_locked( $ip ): bool {
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
			) &&
			! is_admin()
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
			'save',
			function () {
				return __( 'Security settings', 'urlslab' );
			},
			function () {
				return __( 'Most of the security settings are applied to your website through `.htaccess` file rules. To apply your current security settings you need to apply it by updating `.htaccess` file', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			'btn_write_htaccess',
			'configs/write_htaccess',
			false,
			function () {
				return __( 'Apply settings - Update .htaccess file', 'urlslab' );
			},
			function () {
				return __( 'Update `.htaccess` file now based on current settings of redirects, CSP and caching.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'save'
		);
		$this->add_option_definition(
			Urlslab_Widget_General::SETTING_NAME_USE_HTACCESS,
			false,
			false,
			function () {
				return __( 'Allow updating .htaccess and config files', 'urlslab' );
			},
			function () {
				return __( 'To achieve maximum speed of caching, we need to add some web server configuration rules into file `.htaccess`. These rules are evaluated before PHP script executes first SQL query to your database server and can save processing time of your database server.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'save'
		);

		$this->add_options_form_section(
			'sec-headers',
			function () {
				return __( 'Security headers', 'urlslab' );
			},
			function () {
				return __( 'Protect your installation against basic attacks with standard security settings of HTTP headers.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_REFERRER_POLICY,
			'no-referrer',
			true,
			function () {
				return __( 'Add Referrer-Policy header', 'urlslab' );
			},
			function () {
				return __( 'The Referrer-Policy HTTP header controls how much referrer information (sent with the Referer header) should be included with requests. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					'none'                            => __( 'Not used', 'urlslab' ),
					'no-referrer'                     => __( 'no-referrer', 'urlslab' ),
					'no-referrer-when-downgrade'      => __( 'no-referrer-when-downgrade', 'urlslab' ),
					'origin'                          => __( 'origin', 'urlslab' ),
					'origin-when-cross-origin'        => __( 'origin-when-cross-origin', 'urlslab' ),
					'same-origin'                     => __( 'same-origin', 'urlslab' ),
					'strict-origin'                   => __( 'strict-origin', 'urlslab' ),
					'strict-origin-when-cross-origin' => __( 'strict-origin-when-cross-origin', 'urlslab' ),
					'unsafe-url'                      => __( 'unsafe-url', 'urlslab' ),
				);
			},
			null,
			'sec-headers',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_X_FRAME_OPTIONS,
			'SAMEORIGIN',
			true,
			function () {
				return __( 'Add X-Frame-Options header', 'urlslab' );
			},
			function () {
				return __( 'The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a `frame`, `iframe`, `embed` or `object`. Sites can use this to avoid click-jacking attacks, by ensuring that their content is not embedded into other sites. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					'none'       => __( 'Not used', 'urlslab' ),
					'DENY'       => __( 'DENY - The page cannot be displayed in a frame', 'urlslab' ),
					'SAMEORIGIN' => __( 'SAMEORIGIN - Allow if all ancestor frames are same origin', 'urlslab' ),
				);
			},
			null,
			'sec-headers',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_PERMISSIONS_POLICY,
			'',
			false,
			function () {
				return __( 'Add Permissions-Policy header', 'urlslab' );
			},
			function () {
				return __( 'The HTTP Permissions-Policy header provides a mechanism to allow and deny the use of browser features in a document or within any `iframe` elements in the document. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'sec-headers',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_STRICT_TRANSPORT_SECURITY,
			'',
			false,
			function () {
				return __( 'Add Strict-Transport-Security header', 'urlslab' );
			},
			function () {
				return __( 'All present and future subdomains will be HTTPS for a max-age (e.g one year). This blocks access to pages or subdomains that can only be served over HTTP. (Example value: max-age=63072000; includeSubDomains; preload) Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'sec-headers',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_X_CONTENT_TYPE_OPTIONS,
			true,
			false,
			function () {
				return __( 'Add X-Content-Type-Options header', 'urlslab' );
			},
			function () {
				return __( 'The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should be followed and not be changed. The header allows you to avoid MIME type sniffing by saying that the MIME types are deliberately configured. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'sec-headers',
			array( self::LABEL_EXPERT )
		);


		$this->add_options_form_section(
			'rate-limit',
			function () {
				return __( 'Rate limit', 'urlslab' );
			},
			function () {
				return __( 'Implement rate limiting for dynamically generated pages to safeguard server stability. This mechanism restricts users from frequently accessing non-cached content, effectively curbing server strain. If a single IP exhibits rapid requests for these resource-intensive pages, the system can temporarily restrict its access. This ensures that your server remains operational for other users, maintaining seamless site performance.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_RATELIMIT,
			false,
			true,
			function () {
				return __( 'Rate limit', 'urlslab' );
			},
			function () {
				return __( 'Activate rate-limits of page views per IP address of visitor.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'rate-limit',
			array( self::LABEL_EXPERT ),
		);
		$this->add_option_definition(
			self::SETTING_NAME_RATELIMIT_IP_COUNT,
			60,
			true,
			function () {
				return __( 'Rate limit page views from same IP (per minute)', 'urlslab' );
			},
			function () {
				return __( 'Implement a rate limit to restrict the number of page views per minute from a single IP address, to prevent server overload. This security measure helps to deter automated traffic and potential abuse, ensuring fair resource distribution. Users exceeding the set page view limit will temporarily be blocked, maintaining site accessibility for others.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			null,
			'rate-limit',
			array( self::LABEL_EXPERT ),
		);
		$this->add_option_definition(
			self::SETTING_NAME_RATELIMIT_IP_SECONDS,
			300,
			true,
			function () {
				return __( 'IP Blocking Time with Rate Limiting', 'urlslab' );
			},
			function () {
				return __( 'Define the duration for which an IP address is barred from accessing a service if it surpasses a specified number of requests within a given timeframe. It acts as a safeguard against potential abuse and automated traffic, by temporarily restricting access from overly active sources. This mechanism ensures a balanced load on the servers and maintains service availability for legitimate users.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			null,
			'rate-limit',
			array( self::LABEL_EXPERT ),
		);

		$this->add_options_form_section(
			'404',
			function () {
				return __( 'Rate-limit 404 Not Found Page', 'urlslab' );
			},
			function () {
				return __( 'Common attack pattern is to scan your WordPress website and scan wurnerabilities. During such attacks is generated from same IP address huge amount of 404 Not Found pages, what could even overpower your server. URLsLab plugin can protect you against these attacks and block IP address of visitor for defined amount of time.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_BLOCK_404_IP,
			false,
			true,
			function () {
				return __( 'Rate limit 404', 'urlslab' );
			},
			function () {
				return __( 'Activate rate-limits of page views to 404 Not Found pages per IP address of visitor.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'404',
			array( self::LABEL_EXPERT ),
		);

		$this->add_option_definition(
			self::SETTING_NAME_BLOCK_404_IP_COUNT,
			60,
			true,
			function () {
				return __( 'Rate limit 404 attempts from IP (per minute)', 'urlslab' );
			},
			function () {
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
			300,
			true,
			function () {
				return __( 'IP blocking time', 'urlslab' );
			},
			function () {
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
			function () {
				return __( 'Content-Security-Policy', 'urlslab' );
			},
			function () {
				return __( "Yes, you see here a lot of settings, but if security matters to you, consider this section important.\n\nThe Content-Security-Policy (CSP) is a security feature that helps prevent Cross-Site Scripting (XSS) attacks by defining which origins are allowed to load resources on your webpage. CSP restricts the sources of scripts, styles, and other resources to only those that you trust, effectively reducing the risk of malicious code execution from external sources. By establishing these policies, even if you have a vulnerable plugin, attackers are less likely to inject harmful scripts because CSP only allows the loading of scripts from approved origins. This additional layer of security thus protects your site even in the face of potential plugin vulnerabilities. Implementing CSP is an essential step in securing your website, ensuring that your users' data and your content remain safe from XSS exploits.Unfamiliar with CSP? Let us help you! Our dedicated security experts stand ready to optimize your site's settings for speed and protection. Don't hesitate to contact us by email mailto:support@urlslab.com or contact form on https://www.urlslab.com.\nTo read more visit: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy", 'urlslab' );
			},
			array(
				self::LABEL_FREE,
				self::LABEL_EXPERT,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_SET_CSP,
			'none',
			true,
			function () {
				return __( 'Add CSP headers', 'urlslab' );
			},
			function () {
				return __( 'Add to each response from your server CSP header to protect your server. Activate it just in case you know what you are doing. IMPORTANT: Use `Report only` option just for limited amount of time during debugging. Reporting can significantly slow down your server!', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					'none'    => __( 'No CSP headers', 'urlslab' ),
					'report'  => __( 'Report only', 'urlslab' ),
					'enforce' => __( 'Enforce CSP headers', 'urlslab' ),
				);
			},
			null,
			'csp',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_DEFAULT,
			"'self'",
			true,
			function () {
				return __( 'default-src', 'urlslab' );
			},
			function () {
				return __( 'Serves as a fallback for the other fetch directives. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_CHILD,
			"'self'",
			true,
			function () {
				return __( 'child-src', 'urlslab' );
			},
			function () {
				return __( 'Defines the valid sources for web workers and nested browsing contexts loaded using elements such as `frame` and `iframe`. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_BASE_URI,
			"'self'",
			true,
			function () {
				return __( 'base-uri', 'urlslab' );
			},
			function () {
				return __( "The HTTP Content-Security-Policy base-uri directive restricts the URLs which can be used in a document's `base` element. If this value is absent, then any URI is allowed. If this directive is absent, the user agent will use the value in the `base` element. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri", 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_CONNECT,
			"'self'",
			true,
			function () {
				return __( 'connect-src', 'urlslab' );
			},
			function () {
				return __( 'The HTTP Content-Security-Policy (CSP) connect-src directive restricts the URLs which can be loaded using script interfaces. The APIs that are restricted are: `a`, `ping`, `fetch()`, `XMLHttpRequest`, `WebSocket`, `EventSource` and `sendBeacon()`. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_FONT,
			"'self' fonts.gstatic.com data:",
			true,
			function () {
				return __( 'font-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for fonts loaded using `@font-face`. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_FRAME,
			"'self' blob:",
			true,
			function () {
				return __( 'frame-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for nested browsing contexts loading using elements such as `frame` and `iframe`. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_IMG,
			"'self' data: s.w.org ps.w.org secure.gravatar.com",
			true,
			function () {
				return __( 'img-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources of images and favicons. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_MANIFEST,
			"'self'",
			true,
			function () {
				return __( 'manifest-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources of application manifest files. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/manifest-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_MEDIA,
			"'self'",
			true,
			function () {
				return __( 'media-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for loading media using the `audio` , `video` and `track` elements. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/media-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_OBJECT,
			"'self'",
			true,
			function () {
				return __( 'object-src', 'urlslab' );
			},
			function () {
				return __( 'The HTTP Content-Security-Policy object-src directive specifies valid sources for the `object` and `embed` elements. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SCRIPT,
			"'self' 'unsafe-eval' 'unsafe-inline'",
			true,
			function () {
				return __( 'script-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for JavaScript and WebAssembly resources. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SANDBOX,
			'',
			false,
			function () {
				return __( 'sandbox', 'urlslab' );
			},
			function () {
				return __( "The HTTP Content-Security-Policy (CSP) sandbox directive enables a sandbox for the requested resource similar to the `iframe` sandbox attribute. It applies restrictions to a page's actions including preventing popups, preventing the execution of plugins and scripts, and enforcing a same-origin policy. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox", 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function () {
				return array(
					'allow-downloads'                         => __( 'allow-downloads', 'urlslab' ),
					'allow-downloads-without-user-activation' => __( 'allow-downloads-without-user-activation', 'urlslab' ),
					'allow-forms'                             => __( 'allow-forms', 'urlslab' ),
					'allow-modals'                            => __( 'allow-modals', 'urlslab' ),
					'allow-orientation-lock'                  => __( 'allow-orientation-lock', 'urlslab' ),
					'allow-pointer-lock'                      => __( 'allow-pointer-lock', 'urlslab' ),
					'allow-popups'                            => __( 'allow-popups', 'urlslab' ),
					'allow-popups-to-escape-sandbox'          => __( 'allow-popups-to-escape-sandbox', 'urlslab' ),
					'allow-presentation'                      => __( 'allow-presentation', 'urlslab' ),
					'allow-same-origin'                       => __( 'allow-same-origin', 'urlslab' ),
					'allow-scripts'                           => __( 'allow-scripts', 'urlslab' ),
					'allow-storage-access-by-user-activation' => __( 'allow-storage-access-by-user-activation', 'urlslab' ),
					'allow-top-navigation'                    => __( 'allow-top-navigation', 'urlslab' ),
					'allow-top-navigation-by-user-activation' => __( 'allow-top-navigation-by-user-activation', 'urlslab' ),
				);
			},
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_ELEM,
			"'self' 'unsafe-inline'",
			true,
			function () {
				return __( 'script-src-elem', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for JavaScript `script` elements. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src-elem', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SCR_ATTR,
			"'self' 'unsafe-inline'",
			true,
			function () {
				return __( 'script-src-attr', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for JavaScript inline event handlers. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src-attr', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_STYLE,
			"'self'",
			true,
			function () {
				return __( 'style-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for stylesheets. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SRC_ELEM,
			"'unsafe-inline' 'self' fonts.googleapis.com",
			true,
			function () {
				return __( 'style-src-elem', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for stylesheets `style` elements and `link` elements with `rel="stylesheet"`. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src-elem', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_SRC_ATTR,
			"'unsafe-inline' 'self'",
			true,
			function () {
				return __( 'style-src-attr', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for inline styles applied to individual DOM elements.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_WORKER,
			"'self' blob:",
			true,
			function () {
				return __( 'worker-src', 'urlslab' );
			},
			function () {
				return __( 'Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/worker-src', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_ACTION,
			"'self'",
			true,
			function () {
				return __( 'form-action', 'urlslab' );
			},
			function () {
				return __( 'Restricts the URLs which can be used as the target of a form submissions from a given context. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return Urlslab_Widget_Security::is_valid_csp_value( $value );
			},
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_UPGRADE_INSECURE_REQUESTS,
			false,
			true,
			function () {
				return __( 'upgrade-insecure-requests', 'urlslab' );
			},
			function () {
				return __( "The HTTP Content-Security-Policy (CSP) upgrade-insecure-requests directive instructs user agents to treat all of a site's insecure URLs (those served over HTTP) as though they have been replaced with secure URLs (those served over HTTPS). This directive is intended for websites with large numbers of insecure legacy URLs that need to be rewritten. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests", 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_REPORT,
			false,
			true,
			function () {
				return __( 'Report CSP violations', 'urlslab' );
			},
			function () {
				return __( 'IMPORTANT: Reporting can significantly slow down your server! When a browser detects an action, such as an attempt to load a resource that contravenes the site’s CSP, it sends a report to the provided endpoint. This reporting mechanism helps web administrators monitor and identify potential attacks or misconfigurations by receiving detailed reports about each incident that breaches the CSP directives.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_REPORT_TRACKING,
			self::TRACK_WITH_JAVASCRIPT,
			true,
			function () {
				return __( 'Violations Tracking', 'urlslab' );
			},
			function () {
				return __( 'Choose how will be tracked the violation. Javascript version will aggregate multiple violations into single http request, but can fail to be executed. Browser tracking will be independent on javascript, but could trigger huge number of requests to your server and overpower it.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::TRACK_WITH_JAVASCRIPT => __( 'Aggregated with JS', 'urlslab' ),
					'browser'                   => __( 'Browser - one request per violation', 'urlslab' ),
				);
			},
			null,
			'csp'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSP_REPORT_URL_DETAIL,
			false,
			false,
			function () {
				return __( 'Detailed URL logging', 'urlslab' );
			},
			function () {
				return __( 'Most of the time is enough to log just domain names violating your CSP rules. If setting switched to true, also specific URLs can be logged. This will increase significantly number of log entries, but will give you more details during debugging. We recommend to activate this setting just during debugging. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'csp'
		);
	}

	public function get_widget_group() {
		return (object) array( 'Tools' => __( 'Tools', 'urlslab' ) );
	}
}
