<?php

class Urlslab_Url {
	private string $urlslab_parsed_url;
	private array $url_components;

	/**
	 * @param string $url
	 */
	public function __construct( string $url ) {
		$this->urlslab_url_init( $url );
		return ! empty( $this->parsed_url );
	}


	/**
	 * @return string
	 */
	public function get_url(): string {
		return $this->urlslab_parsed_url;
	}

	private function urlslab_url_init( string $input_url ): void {
		if ( empty( $input_url ) ) {
			return;
		}

		if ( ! isset( parse_url( $input_url )['scheme'] ) ) {
			$scheme = parse_url( get_site_url(), PHP_URL_SCHEME ) ?? 'http';
			$host = parse_url( get_site_url(), PHP_URL_HOST );
			if ( str_starts_with( $input_url, '/' ) ) { //# Relative path
				$this->url_components = parse_url( $scheme . '://' . $host . $input_url );
			} else {
				$this->url_components = parse_url( $scheme . '://' . $input_url );
			}
		} else {
			$this->url_components = parse_url( $input_url );
		}

		$url = '';
		$url .= $this->url_components['host'] ?? parse_url( get_site_url(), PHP_URL_HOST );
		$url .= $this->url_components['path'] ?? '';
		if ( isset( $this->url_components['query'] ) ) {
			$url .= '?' . $this->url_components['query'];
		}
		$this->urlslab_parsed_url = $url;
	}

	public function get_url_id(): string {
		return md5( $this->urlslab_parsed_url );
	}

	public function get_url_path(): string {
		return $this->url_components['path'] ?? '';
	}

}
