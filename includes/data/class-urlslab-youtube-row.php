<?php

class Urlslab_Youtube_Row extends Urlslab_Data {

	const STATUS_NEW = 'N';
	const STATUS_AVAILABLE = 'A';
	const STATUS_PROCESSING = 'P';
	const STATUS_DISABLED = 'D';
	private $microdata_obj;

	public function __construct( array $video, $loaded_from_db = false ) {
		$this->set_video_id( $video['videoid'] ?? '', $loaded_from_db );
		$this->set_microdata( $video['microdata'] ?? null, $loaded_from_db );
		$this->set_status( $video['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $video['status_changed'] ?? self::get_now(), $loaded_from_db );
		if ( strlen( $this->get_microdata() ) ) {
			$this->microdata_obj = json_decode( $this->get_microdata() );
		}
	}

	public function get_video_id() {
		return $this->get( 'videoid' );
	}

	public function get_microdata() {
		return $this->get( 'microdata' );
	}

	public function get_status() {
		return $this->get( 'status' );
	}

	public function get_status_changed() {
		return $this->get( 'status_changed' );
	}

	public function get_channel_title() {
		return $this->microdata_obj->items[0]->snippet->channelTitle;
	}

	public function set_video_id( $video_id, $loaded_from_db = false ) {
		$this->set( 'videoid', $video_id, $loaded_from_db );
	}

	public function set_microdata( $microdata, $loaded_from_db = false ) {
		$this->set( 'microdata', $microdata, $loaded_from_db );
		$this->microdata_obj = json_decode( $microdata );
	}

	public function set_status( $status, $loaded_from_db = false ) {
		$this->set( 'status', $status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_status_changed( self::get_now(), $loaded_from_db );
		}
	}

	public function set_status_changed( $status_changed, $loaded_from_db = false ) {
		$this->set( 'status_changed', $status_changed, $loaded_from_db );
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

	function get_table_name(): string {
		return URLSLAB_YOUTUBE_CACHE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'videoid' );
	}

	function get_columns(): array {
		return array(
			'videoid'        => '%s',
			'microdata'      => '%s',
			'status'         => '%s',
			'status_changed' => '%s',
		);
	}
}
