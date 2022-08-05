<?php

/**
 * Urlslab class for managing API Keys of URLSLAB
 */
class Urlslab_Api_Key {

	private string $api_key;

	public function __construct( string $api_key ) {
		$this->api_key = $api_key;
	}

	/**
	 * @return string
	 */
	public function get_api_key_masked(): string {
		return urlslab_masked_info( $this->api_key );
	}

	public function is_empty(): bool {
		return empty( $this->api_key );
	}

	/**
	 * @return string
	 */
	public function get_api_key(): string {
		return $this->api_key;
	}

	public function save_api_key() {
		Urlslab::update_option( 'api-key', $this->api_key );
	}

	public function add_key_to_header( array $header ): array {
		$header['x-Api-Key'] = $this->api_key;
		return $header;
	}

	public function get_api_key_hash(): string {
		return md5( $this->api_key );
	}

}
