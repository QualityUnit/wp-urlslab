<?php

class Urlslab_Screenshot_Error_Response implements Urlslab_Api_Model {
	private string $error_type;
	private string $error_msg;

	/**
	 * @param string $error_type
	 * @param string $error_msg
	 */
	public function __construct( string $error_type, string $error_msg ) {
		$this->error_type = $error_type;
		$this->error_msg  = $error_msg;
	}

	/**
	 * @return string
	 */
	public function get_error_type(): string {
		return $this->error_type;
	}

	/**
	 * @param string $error_type
	 */
	public function set_error_type( string $error_type ): void {
		$this->error_type = $error_type;
	}

	/**
	 * @return string
	 */
	public function get_error_msg(): string {
		return $this->error_msg;
	}

	/**
	 * @param string $error_msg
	 */
	public function set_error_msg( string $error_msg ): void {
		$this->error_msg = $error_msg;
	}


	public function to_json() {

	}

	public function from_json() {
		// TODO: Implement from_json() method.
	}
}
