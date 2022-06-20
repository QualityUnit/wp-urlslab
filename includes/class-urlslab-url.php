<?php

class Urlslab_Url {

	private string $urlslab_parsed_url;
	private array $url_components = array();

	/**
	 * @param string $url
	 */
	public function __construct( string $url ) {
		$this->urlslab_url_init( $url );
	}


	/**
	 * @return string
	 */
	public function get_url(): string {
		return $this->urlslab_parsed_url;
	}

	private function urlslab_url_init( string $input_url ): void {
		$parsed_url = parse_url( $input_url );

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
