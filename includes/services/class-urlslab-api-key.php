<?php

/**
 * Urlslab class for managing API Keys of URLSLAB
 */
class Urlslab_Api_Key {

	private string $api_key = '';

	public function __construct() {}

	/**
	 * @return string
	 */
	public function get_api_key_masked(): string {
		return urlslab_masked_info( $this->get_api_key() );
	}

	public function is_empty(): bool {
		return empty( $this->get_api_key() );
	}

	public function add_key_to_header( array $header ): array {
		$header['x-Api-Key'] = $this->get_api_key();

		return $header;
	}

	public function get_api_key_hash(): string {
		return md5( $this->get_api_key() );
	}

	private function get_api_key() {
		if ( '' == $this->api_key ) {
			$this->api_key = Urlslab_Available_Widgets::get_instance()->get_widget( 'general' )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
		}

		return $this->api_key;
	}

}
