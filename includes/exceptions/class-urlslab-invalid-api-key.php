<?php

class Urlslab_Invalid_Api_Key extends Exception {

	public function __construct( $message, $code = 0, Throwable $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}

	// custom string representation of object
	public function __toString() {
		return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
	}
}
