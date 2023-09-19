<?php

class Urlslab_Url {
	private static string $current_page_protocol = '';
	private string $urlslab_parsed_url;
	private bool $is_same_domain_url = false;
	private $url_id = null;
	private static $current_page_url;

	private array $url_components = array();
	private static $domain_blacklists
		= array(
			'google.com',
			'example.com',
			'facebook.com',
			'instagram.com',
			'linkedin.com',
			'twitter.com',
			'localhost',
			'wa.me',
			'm.me',
			'pinterest.com',
			'tumblr.com',
			'snapchat.com',
			'reddit.com',
			'vimeo.com',
			'flickr.com',
			'whatsapp.com',
			'telegram.org',
			'tiktok.com',
			'weibo.com',
			'line.me',
			'vk.com',
			'odnoklassniki.ru',
			'baidu.com',
			'yandex.com',
			'ebay.com',
			'alibaba.com',
			'taobao.com',
			'wordpress.com',
			'waybackmachine.org',
			'archive.org',
			'yahoo.com',
			'bing.com',
			'duckduckgo.com',
			'ask.com',
		);
	private const BLACKLISTED_QUERY_PARAMS = array(
		'utm_[a-zA-Z0-9]*',
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

	/**
	 * @param string $url
	 *
	 * @throws Exception
	 */
	public function __construct( string $url, $add_current_page_protocol = false ) {
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

	public function is_wp_admin_url(): bool {
		return strpos( $this->url_components['path'], '/wp-admin/' ) !== false || strpos( $this->url_components['path'], '/wp-login.php' ) !== false;
	}

	public function is_url_blacklisted(): bool {
		$host = trim( str_replace( 'www', '', strtolower( $this->url_components['host'] ) ), '.' );
		foreach ( self::$domain_blacklists as $domain_blacklist ) {
			if ( str_starts_with( $host, $domain_blacklist ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @return string
	 */
	public function get_url(): string {
		return $this->urlslab_parsed_url;
	}

	public function is_same_domain_url(): bool {
		return $this->is_same_domain_url;
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
			$this->is_same_domain_url     = true;
			$this->url_components['host'] = $current_site_host;
			if ( substr( $this->url_components['path'], 0, 2 ) == './' ) {
				$this->url_components['path'] = substr( $this->url_components['path'], 2 );
			}
			if ( substr( $this->url_components['path'], 0, 1 ) != '/' ) {
				global $wp;
				$this->url_components['path'] = '/' . ltrim( rtrim( $wp->request, '/' ) . '/' . $this->url_components['path'], '/' );
			}
		} else {
			if ( strtolower( $this->url_components['host'] ) == $current_site_host ) {
				$this->is_same_domain_url = true;
			} else {
				$this->is_same_domain_url = false;
			}
		}

		$this->url_components['path'] = $this->resolve_path( $this->url_components['path'] );

		$url                = $this->url_components['host'] . ( $this->url_components['path'] ?? '' );
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
		$this->urlslab_parsed_url = $url;
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

	public static function get_current_page_url(): Urlslab_Url {
		if ( is_object( self::$current_page_url ) ) {
			return self::$current_page_url;
		}

		if ( ! is_object( self::$current_page_url ) && is_singular() && wp_get_canonical_url() ) {
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
			global $wp;
			try {
				self::$current_page_url = new Urlslab_Url( home_url( add_query_arg( self::get_clean_params( $wp->query_vars ), $wp->request ) ), true );
			} catch ( Exception $e ) {
			}
		}

		return self::$current_page_url;
	}

	public function get_filename() {
		if ( isset( $this->url_components['path'] ) ) {
			return pathinfo( $this->url_components['path'], PATHINFO_FILENAME );
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
}
