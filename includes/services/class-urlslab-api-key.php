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
	private function masked( $text, int $right = 0, $left = 0 ): string {
		$length = strlen( $text );

		$right = absint( $right );
		$left = absint( $left );

		if ( $length < $right + $left ) {
			$right = 0;
			$left = 0;
		}

		if ( $length <= 48 ) {
			$masked = str_repeat( '*', $length - ( $right + $left ) );
		} elseif ( $right + $left < 48 ) {
			$masked = str_repeat( '*', 48 - ( $right + $left ) );
		} else {
			$masked = '****';
		}

		$left_unmasked = $left ? substr( $text, 0, $left ) : '';
		$right_unmasked = $right ? substr( $text, -1 * $right ) : '';

		$text = $left_unmasked . $masked . $right_unmasked;

		return $text;
	}

	/**
	 * @return string
	 */
	public function get_api_key_masked(): string {
		return $this->masked( $this->api_key, 4, 8 );
	}

	public function save_api_key() {
		Urlslab::update_option( 'api-key', $this->api_key );
	}

}
