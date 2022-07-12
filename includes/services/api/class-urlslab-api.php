<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-api-key.php';

abstract class Urlslab_Api {

	private Urlslab_Api_Key $api_key;

	protected string $base_url = 'https://www.urlslab.com/api/v1/';

	/**
	 * @param Urlslab_Api_Key $api_key
	 */
	public function __construct( $api_key ) {
		if ( ! empty( $api_key ) ) {
			$this->api_key = $api_key;
		}
	}

	/**
	 * @return Urlslab_Api_Key
	 */
	public function get_api_key(): Urlslab_Api_Key {
		return $this->api_key;
	}

	/**
	 * @return bool
	 */
	public function has_api_key(): bool {
		return ! $this->api_key->is_empty();
	}

	protected function urlslab_get_response( $url, $body ): array {
		if ( ! empty( $this->api_key ) ) {
			$request_args = array(
				'body' => $body,
				'headers' => $this->api_key->add_key_to_header( array() ),
			);

			$request = wp_remote_get( $url, $request_args );

			return array(
				wp_remote_retrieve_response_code( $request ),
				wp_remote_retrieve_body( $request ),
			);
		}

		return array();
	}

	protected function urlslab_post_response( $url, $body ): array {
		$request_args = array();
		if ( ! empty( $this->api_key ) ) {
			$request_args = array(
				'body' => $body,
				'headers' => $this->api_key->add_key_to_header(
					array(
						'Content-Type' => 'application/json',
					) 
				),
			);

		} else {
			$request_args = array(
				'body' => $body,
				'headers' => array(
					'Content-Type' => 'application/json',
				),
			);
		}

		$request = wp_remote_post( $url, $request_args );

		return array(
			wp_remote_retrieve_response_code( $request ),
			wp_remote_retrieve_body( $request ),
		);

	}


}
