<?php

class Urlslab_Url {

	private string $urlslab_parsed_url;
	private array $url_components = array();
	private array $domain_blacklists = array(
		'google.com',
		'facebook.com',
		'instagram.com',
		'twitter.com',
		'localhost',
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

	public function is_url_blacklisted(): bool {
		foreach ( $this->domain_blacklists as $domain_blacklist ) {
			if ( str_contains( $this->url_components['host'], $domain_blacklist ) ) {
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

	/**
	 * @throws Exception
	 */
	private function urlslab_url_init( string $input_url ): void {
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

		if ( ! isset( $this->url_components['host'] ) ) {
			$this->url_components['host'] = parse_url( get_site_url(), PHP_URL_HOST );
			if ( substr( $this->url_components['path'], 0, 1 ) != '/' ) {
				$this->url_components['path'] = '/' . $this->url_components['path'];
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
		return crc32( md5( $this->urlslab_parsed_url ) );
	}

	public function get_url_path(): string {
		return $this->url_components['path'] ?? '';
	}

	public function is_main_page(): bool {
		return empty( $this->url_components['path'] ) &&
			   empty( $this->url_components['query'] ) &&
			   ! empty( $this->url_components['host'] );
	}

}
