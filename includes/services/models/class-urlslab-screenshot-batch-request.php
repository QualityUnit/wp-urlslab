<?php

class Urlslab_Screenshot_Batch_Request implements Urlslab_Api_Model {

	private array $url_request_batch;

	/**
	 * @param array $url_request_batch
	 */
	public function __construct( array $url_request_batch = array() ) {
		$this->url_request_batch = $url_request_batch;
	}

	public function add_url( $url ) {
		array_push( $this->url_request_batch, $url );
		$this->url_request_batch = array_unique( $this->url_request_batch );
	}


	public function to_json() {
		return json_encode( $this->url_request_batch );
	}

}
