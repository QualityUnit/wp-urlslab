<?php

class Urlslab_Screenshot_Response {

	private string $url_name;
	private $domain_id;
	private $url_id;
	private $screenshot_date;
	private $url_title;
	private $url_meta_description;
	private $url_summary;
	private $screenshot_status;

	/**
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $url_title
	 * @param $url_meta_description
	 * @param $url_summary
	 * @param $screenshot_status
	 */
	public function __construct(
		$domain_id,
		$url_id,
		$screenshot_date,
		$url_title,
		$url_meta_description,
		$url_summary,
		$screenshot_status
	) {
		$this->domain_id            = $domain_id;
		$this->url_id               = $url_id;
		$this->screenshot_date      = $screenshot_date;
		$this->url_title            = $url_title;
		$this->url_meta_description = $url_meta_description;
		$this->url_summary          = $url_summary;
		$this->screenshot_status    = $screenshot_status;
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
	public function get_url_meta_description() {
		return $this->url_meta_description;
	}

	/**
	 * @param mixed $url_meta_description
	 */
	public function set_url_meta_description( $url_meta_description ): void {
		$this->url_meta_description = $url_meta_description;
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

	/**
	 * @return mixed
	 */
	public function get_url_summary() {
		return $this->url_summary;
	}

	/**
	 * @param mixed $url_summary
	 */
	public function set_url_summary( $url_summary ): void {
		$this->url_summary = $url_summary;
	}


}
