<?php

class Urlslab_Screenshot_Response {

	private string $url_name;
	private $domain_id;
	private $url_id;
	private $screenshot_date;
	private $url_title;
	private $screenshot_status;

	/**
	 * @param string $url_name
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $url_title
	 * @param $screenshot_status
	 */
	public function __construct( string $url_name, $domain_id, $url_id, $screenshot_date, $url_title, $screenshot_status ) {
		$this->url_name          = $url_name;
		$this->domain_id         = $domain_id;
		$this->url_id            = $url_id;
		$this->screenshot_date   = $screenshot_date;
		$this->url_title         = $url_title;
		$this->screenshot_status = $screenshot_status;
	}


	/**
	 * @return string
	 */
	public function get_url_name(): string {
		return $this->url_name;
	}

	/**
	 * @param string $url_name
	 */
	public function set_url_name( string $url_name ): void {
		$this->url_name = $url_name;
	}

	/**
	 * @return mixed
	 */
	public function get_domain_id() {
		return $this->domain_id;
	}

	/**
	 * @param mixed $domain_id
	 */
	public function set_domain_id( $domain_id ): void {
		$this->domain_id = $domain_id;
	}

	/**
	 * @return mixed
	 */
	public function get_url_id() {
		return $this->url_id;
	}

	/**
	 * @param mixed $url_id
	 */
	public function set_url_id( $url_id ): void {
		$this->url_id = $url_id;
	}

	/**
	 * @return mixed
	 */
	public function get_screenshot_date() {
		return $this->screenshot_date;
	}

	/**
	 * @param mixed $screenshot_date
	 */
	public function set_screenshot_date( $screenshot_date ): void {
		$this->screenshot_date = $screenshot_date;
	}

	/**
	 * @return mixed
	 */
	public function get_url_title() {
		return $this->url_title;
	}

	/**
	 * @param mixed $url_title
	 */
	public function set_url_title( $url_title ): void {
		$this->url_title = $url_title;
	}

	/**
	 * @return mixed
	 */
	public function get_screenshot_status() {
		return $this->screenshot_status;
	}

	/**
	 * @param mixed $screenshot_status
	 */
	public function set_screenshot_status( $screenshot_status ): void {
		$this->screenshot_status = $screenshot_status;
	}



}
