<?php

class Urlslab_Url {

	private string $urlslab_parsed_url;
	private bool $is_same_domain_url = false;
	private $url_id = null;
	private array $url_components = array();
	private static $domain_blacklists = array(
		'google.com',
		'facebook.com',
		'instagram.com',
		'twitter.com',
		'localhost',
		'wa.me',
	);
	private const SKIP_QUERY_PARAMS_REGEXP = '/^(utm_[a-zA-Z0-9]*|_gl|_ga.*|gclid|fbclid|fb_[a-zA-Z0-9]*|msclkid|zenid|lons1|appns|lpcid|mm_src|muid|phpsessid|jsessionid|aspsessionid|doing_wp_cron|sid|pk_vid|source)$/';

	/**
	 * @param string $url
	 */
	public function __construct( string $url ) {
		$this->urlslab_url_init( $url );
	}

	/**
	 * @return bool
	 */
	public function is_url_valid(): bool {
		if ( empty( $this->urlslab_parsed_url ) ) {
			return false;
		}

		return true;
	}

	private function is_url_blacklisted(): bool {
		$host = strtolower($this->url_components['host']);
		foreach ( self::$domain_blacklists as $domain_blacklist ) {
			if ( str_contains( $host, $domain_blacklist ) ) {
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
			$this->url_components['scheme'] = parse_url( get_site_url(), PHP_URL_SCHEME ) ?? 'http';
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
				if ( $this->is_url_blacklisted() ) {
					throw new Exception( 'domain not supported' );
				}
			}
		}

		$url = $this->url_components['host'] . ( $this->url_components['path'] ?? '' );
		if ( isset( $this->url_components['query'] ) ) {
			parse_str( $this->url_components['query'], $query_params );
			if ( is_array( $query_params ) ) {
				foreach ( $query_params as $param_name => $param_value ) {
					if ( preg_match( self::SKIP_QUERY_PARAMS_REGEXP, $param_name ) ) {
						unset( $query_params[ $param_name ] );
					}
				}
				if ( ! empty( $query_params ) ) {
					$this->url_components['query'] = http_build_query( $query_params );
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

	public function get_url_id(): int {
		if ( null === $this->url_id ) {
			$this->url_id = crc32( md5( $this->urlslab_parsed_url ) );
		}

		return $this->url_id;
	}

	public function get_url_path(): string {
		return $this->url_components['path'] ?? '';
	}

	public function is_main_page(): bool {
		return empty( $this->url_components['path'] ) &&
			   empty( $this->url_components['query'] ) &&
			   ! empty( $this->url_components['host'] );
	}

	public function get_url_with_protocol() {
		return $this->url_components['scheme'] . '://' . $this->get_url();
	}

}
