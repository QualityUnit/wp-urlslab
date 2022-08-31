<?php

class Urlslab_Youtube_Data {

	const YOUTUBE_NEW = 'N';
	const YOUTUBE_AVAILABLE = 'A';
	const YOUTUBE_PROCESSING = 'P';
	const YOUTUBE_DISABLED = 'D';

	private $videoid;
	private $microdata;
	private $status;
	private $microdata_obj;

	/**
	 * @param Urlslab_Url $url
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $last_status_change_date
	 * @param $url_title
	 * @param $url_meta_description
	 * @param $url_summary
	 * @param $screenshot_status
	 */
	public function __construct(
		array $video
	) {
		$this->videoid = $video['videoid'];
		$this->microdata = $video['microdata'] ?? null;
		$this->status = $video['status'] ?? self::YOUTUBE_NEW;
		if ( strlen( $this->microdata ) ) {
			$this->microdata_obj = json_decode( $this->microdata );
		}
	}

	public function as_array() {
		return array(
			'videoid' => $this->get_videoid(),
			'microdata' => $this->get_microdata(),
			'status' => $this->get_status(),
		);
	}

	public function get_videoid() {
		return $this->videoid;
	}

	public function get_status() {
		return $this->status;
	}

	public function get_microdata() {
		return $this->microdata;
	}

	public function get_channel_title() {
		return $this->microdata_obj->items[0]->snippet->channelTitle;
	}

	public function get_title() {
		if ( is_object( $this->microdata_obj ) && property_exists( $this->microdata_obj, 'items' ) && property_exists( $this->microdata_obj->items[0], 'snippet' ) ) {
			return $this->microdata_obj->items[0]->snippet->title;
		}
		return false;
	}

	public function get_description() {
		return $this->microdata_obj->items[0]->snippet->description;
	}

	public function get_published_at() {
		return $this->microdata_obj->items[0]->snippet->publishedAt;
	}

	public function get_duration() {
		return $this->microdata_obj->items[0]->snippet->duration;
	}

	public function get_thumbnail_url() {
		return $this->microdata_obj->items[0]->snippet->thumbnails->maxres->url;
	}

}
