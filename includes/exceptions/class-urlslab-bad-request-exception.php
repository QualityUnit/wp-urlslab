<?php

class Urlslab_Bad_Request_Exception extends Exception {
	// Redefine the exception so message isn't optional
	public function __construct( $message, $code = 0 ) {
		parent::__construct( $message );
	}

	// custom string representation of object
	public function __toString() {
		return __CLASS__ . ": {$this->message}\n";
	}

}
