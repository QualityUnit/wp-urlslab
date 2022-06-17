<?php

class Urlslab_Url_Data_Response {

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

	public function to_url_data( Urlslab_Url $url ): Urlslab_Url_Data {
		return new Urlslab_Url_Data(
			$url,
			$this->domain_id,
			$this->url_id,
			$this->screenshot_date,
			time(),
			$this->url_title,
			$this->url_meta_description,
			$this->url_summary,
			$this->screenshot_status
		);
	}

}
