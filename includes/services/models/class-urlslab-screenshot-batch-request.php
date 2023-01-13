<?php

class Urlslab_Screenshot_Batch_Request implements Urlslab_Api_Model {

	private array $url_request_batch = array();

	/**
	 * @param Urlslab_Url[] $url_request_batch
	 */
	public function __construct( array $url_request_batch = array() ) {
		foreach ( $url_request_batch as $url_request ) {
			$this->url_request_batch[] = array("url" => $url_request->get_url());
		}
	}

	public function add_url( $url ) {
		$this->url_request_batch[] = $url;
		$this->url_request_batch   = array_unique( $this->url_request_batch );
	}


	public function to_json() {
		return json_encode( $this->url_request_batch );
	}

}
