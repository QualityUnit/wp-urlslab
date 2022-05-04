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
	 * Masks a password with asterisks (*).
	 *
	 * @param int $right Length of right-hand unmasked text. Default 0.
	 * @param int $left Length of left-hand unmasked text. Default 0.
	 *
	 * @return string Text of masked password.
	 */
	private function masked( string $text ): string {
		$masked_text = '';
		for ( $x = 0; $x <= strlen( $text ) - 4; $x++ ) {
			$masked_text = $masked_text . '*';
		}

		return $masked_text . substr( $text, -5, -1 );
	}

	/**
	 * @return string
	 */
	public function get_api_key_masked(): string {
		return $this->masked( $this->api_key );
	}

	public function save_api_key() {
		Urlslab::update_option( 'api-key', $this->api_key );
	}

}
