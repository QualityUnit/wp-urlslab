<?php

class Urlslab_Url {
	const BLACKLIST_REGEXP = '/(\/wp-admin\/|\/wp-json\/|\/wp-login.php|\)\)\)|%5C%5C%5C|%7B%7B|\\\\\\|md5\(|print\(|sysdate|XOR|ping|nslookup|cname|union(\s+select)?|select(\s*[\*])?|insert(\s+into)?|delete(\s+from)?|update\s+|drop\s+table|drop\s+database|truncate\s+|alert(\s*\()|<script>|<\/script>|document\.cookie|onerror\(|onload\(|onmouseenter\(|onmouseleave\(|onclick\(|eval\(|now\(|exec(\s*\()|execute(\s*\()|system(\s*\()|shell_exec(\s*\()|passthru(\s*\()|popen(\s*\()|`.*?`|<iframe.*?>|iframe\s+src|srcdoc=|onmouseover=|onmouseout=|on\w+\s*=|style=|href=|xlink:href|src=|data:text\/html|data:application\/xhtml+xml|data:application\/xml|Content-Type:\s*text\/html|\.php\?|\.asp\?|\.jsp\?|\.jspx\?|\.cfm\?|\.pl\?|\.py\?|bash\s+-i|perl\s+-e|x\s*:\s*y|<\?php|<%|\.\.\.|<object.*?>|<embed.*?>|<applet.*?>|<svg.*?>|<source.*?>|<video.*?>|<audio.*?>|<img.*?>|<figure.*?>|<picture.*?>|javascript:|vbscript:|data:text\/javascript|ftp:\/\/|file:\/\/|phar:\/\/|gopher:\/\/|ldapi:\/\/|expect:\/\/)/i';
	const BLACKLIST_HOSTS_REGEXP = '/(example\.com|google\.com|facebook\.com|instagram\.com|linkedin\.com|twitter\.com|localhost|wa\.me|m\.me|pinterest\.com|tumblr\.com|snapchat\.com|reddit\.com|flickr\.com|whatsapp\.com|telegram\.org|tiktok\.com|weibo\.com|line\.me|vk\.com|odnoklassniki.ru|baidu\.com|yandex\.com|ebay\.com|alibaba\.com|taobao\.com|wordpress\.com|waybackmachine\.org|archive\.org|yahoo\.com|bing\.com|duckduckgo\.com|ask\.com)$/i';
	private static string $current_page_protocol = '';
	/**
	 * @var array|false|string[]
	 */
	private static $custom_domain_blacklist = false;
	private static $custom_path_blacklist = false;
	private static $wordpress_domains = array();
	private string $urlslab_parsed_url;
	private $url_id = null;
	private static $current_page_url;
	private array $url_components = array();
	private const BLACKLISTED_QUERY_PARAMS = array(
		'utm_[a-zA-Z0-9]*',
		'gi',
		'_gl',
		'_ga.*',
		'gclid',
		'fbclid',
		'fb_[a-zA-Z0-9]*',
		'msclkid',
		'zenid',
		'lons1',
		'appns',
		'lpcid',
		'mm_src',
		'muid',
		'phpsessid',
		'jsessionid',
		'aspsessionid',
		'doing_wp_cron',
		'sid',
		'pk_vid',
		'source',
	);

	private array $query_params = array();
	private $is_blacklisted = null;

	private $fix_double_slashes = false;

	/**
	 * @param string $url
	 *
	 * @throws Exception
	 */
	public function __construct( $url, $add_current_page_protocol = false, $fix_double_slashes = false ) {
		if ( empty( $url ) ) {
			throw new Exception( 'Empty Input URL' );
		}
		$this->fix_double_slashes = $fix_double_slashes;

		if ( $add_current_page_protocol ) {
			$url = self::add_current_page_protocol( $url );
		}
		$this->urlslab_url_init( $url );
	}

	/**
	 * @return bool
	 */
	public function is_url_valid(): bool {
		return ! empty( $this->urlslab_parsed_url ) && ! $this->is_current_404();
	}

	public function is_current_404(): bool {
		return is_404() && $this->get_url_id() === Urlslab_Url::get_current_page_url()->get_url_id();
	}

	public function is_blacklisted(): bool {
		if ( null !== $this->is_blacklisted && is_bool( $this->is_blacklisted ) ) {
			return $this->is_blacklisted;
		}

		if ( isset( $this->url_components['query'] ) ) {
			if ( strlen( $this->url_components['query'] ) > 300 ) {
				$this->is_blacklisted = true;

				return true;
			}

			if ( preg_match( self::BLACKLIST_REGEXP, $this->url_components['query'] ) ) {
				$this->is_blacklisted = true;

				return true;
			}
		}

		if ( isset( $this->url_components['path'] ) ) {

			if ( strlen( $this->url_components['path'] ) > 200 ) {
				$this->is_blacklisted = true;

				return true;
			}

			if ( preg_match( self::BLACKLIST_REGEXP, $this->url_components['path'] ) ) {
				$this->is_blacklisted = true;

				return true;
			}
		}

		if ( isset( $this->url_components['host'] ) ) {
			if ( strlen( $this->url_components['host'] ) > 250 ) {
				$this->is_blacklisted = true;

				return true;
			}

			if ( ! preg_match( '/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/i', $this->url_components['host'] ) ) {
				$this->is_blacklisted = true;

				return true;
			}

			if ( preg_match( self::BLACKLIST_HOSTS_REGEXP, $this->url_components['host'] ) ) {
				$this->is_blacklisted = true;

				return true;
			}

			if ( ! is_array( self::$custom_domain_blacklist ) ) {
				self::$custom_domain_blacklist = preg_split( '/\r\n|\r|\n|,|;/', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_DOMAIN_BLACKLIST ), -1, PREG_SPLIT_NO_EMPTY );
				foreach ( self::$custom_domain_blacklist as $id => $domain_blacklist ) {
					self::$custom_domain_blacklist[ $id ] = preg_quote( trim( $domain_blacklist ) );
				}
			}

			foreach ( self::$custom_domain_blacklist as $domain_blacklist ) {
				if ( preg_match( '/^' . $domain_blacklist . '$/i', $this->url_components['host'] ) ) {
					$this->is_blacklisted = true;

					return true;
				}
			}
			if ( ! is_array( self::$custom_path_blacklist ) ) {
				self::$custom_path_blacklist = preg_split( '/\r\n|\r|\n|,|;/', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URL_PATH_BLACKLIST ), -1, PREG_SPLIT_NO_EMPTY );
				foreach ( self::$custom_path_blacklist as $id => $blacklist ) {
					self::$custom_path_blacklist[ $id ] = preg_quote( trim( $blacklist ), '/' );
				}
			}
			foreach ( self::$custom_path_blacklist as $blacklist ) {
				if ( preg_match( '/' . $blacklist . '/i', $this->get_url() ) ) {
					$this->is_blacklisted = true;

					return true;
				}
			}
		}

		$this->is_blacklisted = false;

		return false;
	}

	/**
	 * @return string
	 */
	public function get_url(): string {
		return $this->urlslab_parsed_url;
	}

	/**
	 * @throws Exception
	 */
	private function urlslab_url_init( string $input_url ): void {
		if ( preg_match( '/^(bitcoin|ftp|ftps|geo|im|irc|ircs|magnet|mailto|matrix|mms|news|nntp|openpgp4fpr|sftp|sip|sms|smsto|ssh|tel|urn|webcal|wtai|xmpp):/', $input_url ) ) {
			throw new Exception( 'protocol handlers as url not supported' );
		}
		if ( str_starts_with( $input_url, 'javascript:' ) ) {
			throw new Exception( 'javascript as url not supported' );
		}
		$parsed_url = parse_url( $input_url );
		if ( ! $parsed_url ) {
			throw new Exception( 'url not valid' );
		}

		if ( ! is_array( $parsed_url ) ) {
			$this->url_components     = array( 'path' => '' );
			$this->urlslab_parsed_url = '';

			return;
		}

		$this->url_components = $parsed_url;

		if ( ! isset( $this->url_components['path'] ) ) {
			$this->url_components['path'] = '';
		}

		if ( ! isset( $this->url_components['scheme'] ) ) {
			$this->url_components['scheme'] = self::get_current_page_protocol();
		}

		$current_site_host = strtolower( parse_url( get_site_url(), PHP_URL_HOST ) );
		if ( ! isset( $this->url_components['host'] ) ) {
			$this->url_components['host'] = $current_site_host;
			if ( substr( $this->url_components['path'], 0, 2 ) == './' ) {
				$this->url_components['path'] = substr( $this->url_components['path'], 2 );
			}
			if ( substr( $this->url_components['path'], 0, 1 ) != '/' ) {
				global $wp;
				$this->url_components['path'] = '/' . ltrim( rtrim( $wp->request, '/' ) . '/' . $this->url_components['path'], '/' );
			}
		}

		$this->url_components['path'] = $this->resolve_path( $this->url_components['path'] );
		if ( $this->fix_double_slashes ) {
			// replace in path any number of slashes with single slash
			$this->url_components['path'] = preg_replace( '/\/+/', '/', $this->url_components['path'] );
		}

		$url                = $this->url_components['host'] . ( isset( $this->url_components['port'] ) ? ':' . $this->url_components['port'] : '' ) . ( $this->url_components['path'] ?? '' );
		$this->query_params = array();
		if ( isset( $this->url_components['query'] ) ) {
			parse_str( $this->url_components['query'], $query_params );
			if ( is_array( $query_params ) ) {
				$query_params = self::get_clean_params( $query_params );
				if ( ! empty( $query_params ) ) {
					$this->url_components['query'] = http_build_query( $query_params );
					$this->query_params            = $query_params;
				} else {
					unset( $this->url_components['query'] );
				}
			}
			if ( isset( $this->url_components['query'] ) ) {
				$url .= '?' . $this->url_components['query'];
			}
		}
		$this->urlslab_parsed_url = trim( $url );
	}

	private static function get_clean_params( $params ): array {
		if ( ! is_array( $params ) ) {
			return array();
		}
		$regexp = '/^(' . implode( '|', self::BLACKLISTED_QUERY_PARAMS ) . ')$/';
		foreach ( $params as $param_name => $param_value ) {
			if ( preg_match( $regexp, $param_name ) ) {
				unset( $params[ $param_name ] );
			}
		}

		return $params;
	}


	private function resolve_path( $path ) {
		if ( false === strpos( $path, './' ) ) {
			return $path;
		}
		if ( '../' == $path ) {
			return '';
		}
		// Explode the path into its parts
		$path_parts = explode( '/', $path );

		// Initialize a stack to store the resolved path
		$resolved_path_parts = array();

		// Iterate through the path parts and resolve any "." or ".."
		foreach ( $path_parts as $part ) {
			if ( '..' === $part ) {
				// Remove the last element from the resolved path stack
				if ( ! empty( $resolved_path_parts ) ) {
					array_pop( $resolved_path_parts );
				}
			} else {
				if ( '.' !== $part && '' !== $part ) {
					// Add the current part to the resolved path stack
					$resolved_path_parts[] = $part;
				}
			}
		}

		// Rebuild the path from the resolved path stack
		$resolved_path = '/' . implode( '/', $resolved_path_parts );
		if ( '' === $path_parts[ count( $path_parts ) - 1 ] ) {
			$resolved_path .= '/';
		}

		return $resolved_path;
	}

	public function get_url_id(): int {
		if ( null === $this->url_id ) {
			$this->url_id = crc32( md5( $this->urlslab_parsed_url ) );
		}

		return $this->url_id;
	}

	public function get_url_path(): string {
		return $this->url_components['path'] ?? '';
	}

	public function get_url_query(): string {
		return $this->url_components['query'] ?? '';
	}

	public function get_url_scheme_prefix(): string {
		return $this->url_components['scheme'] . ( strpos( $this->url_components['scheme'], '://' ) ? '' : '://' );
	}

	public function get_url_with_protocol() {
		return $this->get_url_scheme_prefix() . $this->get_url();
	}

	public function get_url_with_protocol_relative() {
		return '//' . $this->get_url();
	}

	public static function add_current_page_protocol( $url ): string {
		if ( str_starts_with( $url, 'http' ) ) {
			return $url;
		}

		return self::get_current_page_protocol() . $url;
	}

	public static function get_current_page_protocol(): string {
		if ( empty( self::$current_page_protocol ) ) {
			$protocol = parse_url( get_site_url(), PHP_URL_SCHEME );
			if ( empty( $protocol ) ) {
				return 'http://';
			}

			self::$current_page_protocol = $protocol . '://';
		}

		return self::$current_page_protocol;
	}

	public function get_domain_name(): string {
		return $this->url_components['host'] ?? '';
	}

	public function get_domain_id() {
		$url = new Urlslab_Url( $this->get_domain_name(), true );

		return $url->get_url_id();
	}

	public function get_extension() {
		if ( isset( $this->url_components['path'] ) ) {
			return pathinfo( $this->url_components['path'], PATHINFO_EXTENSION );
		}

		return '';
	}

	public static function reset_current_page_url() {
		self::$current_page_url = null;
	}

	public static function get_current_page_url(): Urlslab_Url {
		if ( is_object( self::$current_page_url ) ) {
			return self::$current_page_url;
		}

		if ( is_singular() && wp_get_canonical_url() ) {
			try {
				self::$current_page_url = new Urlslab_Url( wp_get_canonical_url(), true );

				return self::$current_page_url;
			} catch ( Exception $e ) {
			}
		} else if ( is_category() ) {
			$cat = get_category_link( get_query_var( 'cat' ) );
			if ( ! empty( $cat ) ) {
				try {
					self::$current_page_url = new Urlslab_Url( $cat, true );

					return self::$current_page_url;
				} catch ( Exception $e ) {
				}
			}
		} else {
			try {
				self::$current_page_url = new Urlslab_Url( home_url( $_SERVER['REQUEST_URI'] ?? '' ), true );
			} catch ( Exception $e ) {
			}
		}

		return self::$current_page_url;
	}

	public function get_filename() {
		if ( isset( $this->url_components['path'] ) ) {
			return pathinfo( $this->url_components['path'], PATHINFO_BASENAME );
		}

		return $this->get_url_id();
	}

	public function get_query_params(): array {
		return $this->query_params;
	}

	public function get_protocol() {
		return $this->url_components['scheme'] ?? '';
	}

	public function get_request_as_json() {
		$result = array();
		foreach ( $_REQUEST as $key => $value ) {
			$result[ $key ] = is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : sanitize_text_field( $value );
		}

		if ( empty( $result ) ) {
			return '';
		}

		return json_encode( $result );
	}


	public static function enhance_urls_with_protocol( $urls ): array {
		$results = array();
		if ( ! is_array( $urls ) && strlen( $urls ) > 0 ) {
			$arr_urls = explode( ',', $urls );
			foreach ( $arr_urls as $url ) {
				try {
					$url_obj = new Urlslab_Url( $url, true );
					if ( ! $url_obj->is_blacklisted() ) {
						$results[] = $url_obj->get_url_with_protocol();
					}
				} catch ( Exception $e ) {
				}
			}
		}

		return $results;
	}

	public function download_url( $url = false, $result = array(), $iteration = 0, $max_terations = 10, $cookies = array() ): array {
		if ( false === $url ) {
			$url = $this->get_url_with_protocol();
		}
		$url = wp_http_validate_url( $url );
		if ( false === $url ) {
			$result['status_code'] = 400;
			$result['body']        = '';
			$result['headers']     = array();
			$result['error']       = 'Invalid URL';

			return $result;
		}

		add_filter( 'http_request_timeout', array( $this, 'set_timeout' ), 10, 2 );
		add_filter( 'http_request_redirection_count', array( $this, 'http_request_redirection_count' ), 10, 2 );
		add_filter( 'http_headers_useragent', array( $this, 'set_user_agent' ), 10, 2 );

		$args = array();
		if ( ! empty( $cookies ) ) {
			$args['cookies'] = $cookies;
		}

		$response = wp_safe_remote_get( $url, $args );

		remove_filter( 'http_request_timeout', array( $this, 'set_timeout' ), 10 );
		remove_filter( 'http_request_redirection_count', array( $this, 'http_request_redirection_count' ), 10 );
		remove_filter( 'http_headers_useragent', array( $this, 'set_user_agent' ), 10 );

		if ( is_wp_error( $response ) ) {
			$result['status_code'] = 400;
			$result['body']        = '';
			$result['headers']     = array();
			$result['error']       = $response->get_error_message();

			return $result;
		}

		if ( 0 === $iteration ) {
			$result['first_status_code'] = $response['response']['code'];
			$result['first_url']         = $url;
		}
		$result['status_code'] = $response['response']['code'];
		$result['headers']     = wp_remote_retrieve_headers( $response )->getAll();
		$result['url']         = $url;

		if ( 300 < $result['status_code'] && 399 > $result['status_code'] && $iteration <= $max_terations && isset( $result['headers']['location'] ) && $result['headers']['location'] !== $url ) {
			if ( str_starts_with( $result['headers']['location'], '//' ) ) {
				//add protocol of original url
				$url_obj                       = new Urlslab_Url( $url, true );
				$result['headers']['location'] = $url_obj->get_protocol() . ':' . $result['headers']['location'];
			}
			if ( false === strpos( $result['headers']['location'], 'http' ) ) {
				//relative url handling
				try {
					$url_obj                       = new Urlslab_Url( $url, true );
					$result['headers']['location'] = $url_obj->get_protocol() . '://' . $url_obj->get_domain_name() . '/' . ltrim( $result['headers']['location'], '/' );
				} catch ( Exception $e ) {
				}
			}
			if ( isset( $result['headers']['set-cookie'] ) && is_array( $result['headers']['set-cookie'] ) ) {
				$new_cookies = array();
				foreach ( $result['headers']['set-cookie'] as $set_cookie ) {
					$arr_set_cookie                    = explode( '=', $set_cookie, 2 );
					$new_cookies[ $arr_set_cookie[0] ] = $arr_set_cookie[1];
				}
				$cookies = array_merge( $cookies, $new_cookies );
			}

			return $this->download_url( $result['headers']['location'], $result, $iteration + 1, $max_terations, $cookies );
		}

		$result['iteration'] = $iteration;
		$result['body']      = wp_remote_retrieve_body( $response );

		return $result;
	}

	public function set_timeout( $orig_valu, $url ) {
		return 10;
	}

	public function http_request_redirection_count( $orig_valu, $url ) {
		return 0;
	}

	public function set_user_agent( $orig_valu, $url ) {
		return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
	}

	public static function get_wp_domains(): array {
		if ( empty( self::$wordpress_domains ) ) {
			if ( empty( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_DOMAIN_WHITELIST ) ) ) {
				self::$wordpress_domains[ self::get_current_page_url()->get_domain_id() ] = self::get_current_page_url()->get_domain_name();
				if ( function_exists( 'icl_get_languages' ) ) {
					$languages = icl_get_languages();
					if ( ! empty( $languages ) ) {
						foreach ( $languages as $lang_code => $language ) {
							$url_obj                                              = new Urlslab_Url( $language['url'], true );
							self::$wordpress_domains[ $url_obj->get_domain_id() ] = $url_obj->get_domain_name();
						}
					}
				}

				if ( function_exists( 'get_sites' ) && is_multisite() ) {
					$sites = get_sites();
					foreach ( $sites as $site ) {
						// Switch to the blog to get the correct domain for each site.
						switch_to_blog( $site->blog_id );
						$url_obj                                              = new Urlslab_Url( get_option( 'siteurl' ), true );
						self::$wordpress_domains[ $url_obj->get_domain_id() ] = $url_obj->get_domain_name();
						restore_current_blog();
					}
				}
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_DOMAIN_WHITELIST, implode( "\n", self::$wordpress_domains ) );
			} else {
				$domains = preg_split( '/\r\n|\r|\n|,|;/', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_DOMAIN_WHITELIST ), -1, PREG_SPLIT_NO_EMPTY );
				foreach ( $domains as $domain ) {
					$url_obj                                              = new Urlslab_Url( $domain, true );
					self::$wordpress_domains[ $url_obj->get_domain_id() ] = $url_obj->get_domain_name();
				}
			}
		}

		return self::$wordpress_domains;
	}

	public function is_wp_domain(): bool {
		if ( isset( self::get_wp_domains()[ $this->get_domain_id() ] ) ) {
			return true;
		}

		return false;
	}
}
