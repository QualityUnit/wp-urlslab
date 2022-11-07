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
		$this->videoid   = $video['videoid'];
		$this->microdata = $video['microdata'] ?? null;
		$this->status    = $video['status'] ?? self::YOUTUBE_NEW;
		if ( strlen( $this->microdata ) ) {
			$this->microdata_obj = json_decode( $this->microdata );
		}
	}

	public function as_array() {
		return array(
			'videoid'   => $this->get_videoid(),
			'microdata' => $this->get_microdata(),
			'status'    => $this->get_status(),
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

		if ( strlen( $this->get_channel_title() ) ) {
			return $this->get_channel_title();
		}

		return 'Youtube video';
	}

	public function get_description() {
		if ( ! empty( $this->microdata_obj->items[0]->snippet->description ) ) {
			return $this->microdata_obj->items[0]->snippet->description;
		}

		return 'Topic: ' . $this->get_title();
	}

	public function get_published_at() {
		return $this->microdata_obj->items[0]->snippet->publishedAt;
	}

	public function get_duration() {
		if ( ! empty( $this->microdata_obj->items[0]->snippet->duration ) ) {
			return $this->microdata_obj->items[0]->snippet->duration;
		}
		if ( ! empty( $this->microdata_obj->items[0]->contentDetails->duration ) ) {
			return $this->microdata_obj->items[0]->contentDetails->duration;
		}

		return 'PT60s';
	}

	public function get_thumbnail_url() {
		if ( ! empty( $this->microdata_obj->items[0]->snippet->thumbnails->maxres->url ) ) {
			return $this->microdata_obj->items[0]->snippet->thumbnails->maxres->url;
		} else if ( ! empty( $this->microdata_obj->items[0]->snippet->thumbnails->standard->url ) ) {
			return $this->microdata_obj->items[0]->snippet->thumbnails->standard->url;
		} else if ( ! empty( $this->microdata_obj->items[0]->snippet->thumbnails->high->url ) ) {
			return $this->microdata_obj->items[0]->snippet->thumbnails->high->url;
		} else if ( ! empty( $this->microdata_obj->items[0]->snippet->thumbnails->default->url ) ) {
			return $this->microdata_obj->items[0]->snippet->thumbnails->default->url;
		}

		return '';
	}

}
