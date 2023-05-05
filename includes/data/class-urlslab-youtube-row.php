<?php

class Urlslab_Youtube_Row extends Urlslab_Data {
	public const STATUS_NEW = 'N';
	public const STATUS_AVAILABLE = 'A';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_DISABLED = 'D';

	public function __construct( array $video = array(), $loaded_from_db = false ) {
		$this->set_video_id( $video['videoid'] ?? '', $loaded_from_db );
		$this->set_microdata( $video['microdata'] ?? null, $loaded_from_db );
		$this->set_captions( $video['captions'] ?? '', $loaded_from_db );
		$this->set_status( $video['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $video['status_changed'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_video_id() {
		return $this->get( 'videoid' );
	}

	public function get_microdata() {
		return $this->get( 'microdata' );
	}

	public function get_captions() {
		return $this->get( 'captions' );
	}

	public function get_captions_as_text() {

		$lines  = explode( "\n", $this->get( 'captions' ) );
		$output = '';

		foreach ( $lines as $line ) {
			if ( ! preg_match( '/^\d{1,2}:\d{2}:\d{2},\d{3}/', $line ) && ! is_numeric( trim( $line ) ) && strlen( trim( $line ) ) > 0 ) {
				$output .= $line . "\n";
			}
		}

		return trim( $output );
	}

	public function get_status() {
		return $this->get( 'status' );
	}

	public function get_status_changed() {
		return $this->get( 'status_changed' );
	}

	public function get_channel_title() {
		$microdata = $this->get_microdata_obj();
		if ( is_array( $microdata ) && isset( $microdata['items'][0]['snippet']['channelTitle'] ) ) {
			return $microdata['items'][0]['snippet']['channelTitle'];
		}

		return '';
	}

	public function get_microdata_obj() {
		if ( strlen( $this->get_microdata() ) ) {
			return json_decode( $this->get_microdata(), true );
		}
	}

	public function set_video_id( $video_id, $loaded_from_db = false ) {
		$this->set( 'videoid', $video_id, $loaded_from_db );
	}

	public function set_microdata( $microdata, $loaded_from_db = false ) {
		$this->set( 'microdata', $microdata, $loaded_from_db );
	}

	public function set_captions( $captions, $loaded_from_db = false ) {
		$this->set( 'captions', $captions, $loaded_from_db );
		$this->captions_obj = json_decode( $captions );
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
		$microdata = $this->get_microdata_obj();
		if ( is_array( $microdata ) && isset( $microdata['items'][0]['snippet']['title'] ) ) {
			return $microdata['items'][0]['snippet']['title'];
		}

		if ( strlen( $this->get_channel_title() ) ) {
			return $this->get_channel_title();
		}

		return '';
	}

	public function get_description() {
		$microdata = $this->get_microdata_obj();
		if ( is_array( $microdata ) && isset( $microdata['items'][0]['snippet']['description'] ) ) {
			return $microdata['items'][0]['snippet']['description'];
		}

		return '';
	}

	public function get_published_at() {
		$microdata = $this->get_microdata_obj();
		if ( is_array( $microdata ) && isset( $microdata['items'][0]['snippet']['publishedAt'] ) ) {
			return $microdata['items'][0]['snippet']['publishedAt'];
		}

		return '';
	}

	public function get_duration() {
		$microdata = $this->get_microdata_obj();
		if ( is_array( $microdata ) && isset( $microdata['items'][0]['snippet']['duration'] ) ) {
			return $microdata['items'][0]['snippet']['duration'];
		}

		if ( is_array( $microdata ) && isset( $microdata['items'][0]['contentDetails']['duration'] ) ) {
			return $microdata['items'][0]['contentDetails']['duration'];
		}

		return 'PT60s';
	}

	public function get_thumbnail_url() {
		$microdata = $this->get_microdata_obj();
		if ( empty( $microdata ) || ! is_array( $microdata ) ) {
			return '';
		}
		if ( isset( $microdata['items'][0]['thumbnails']['maxres']['url'] ) ) {
			return $microdata['items'][0]['thumbnails']['maxres']['url'];
		}
		if ( isset( $microdata['items'][0]['thumbnails']['standard']['url'] ) ) {
			return $microdata['items'][0]['thumbnails']['standard']['url'];
		}
		if ( isset( $microdata['items'][0]['thumbnails']['high']['url'] ) ) {
			return $microdata['items'][0]['thumbnails']['high']['url'];
		}
		if ( isset( $microdata['items'][0]['thumbnails']['high']['url'] ) ) {
			return $microdata['items'][0]['thumbnails']['high']['url'];
		}
		if ( isset( $microdata['items'][0]['thumbnails']['default']['url'] ) ) {
			return $microdata['items'][0]['thumbnails']['default']['url'];
		}

		return '';
	}

	public function get_table_name(): string {
		return URLSLAB_YOUTUBE_CACHE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'videoid' );
	}

	public function get_columns(): array {
		return array(
			'videoid'        => '%s',
			'microdata'      => '%s',
			'captions'       => '%s',
			'status'         => '%s',
			'status_changed' => '%s',
		);
	}

	public function is_active(): bool {
		return self::STATUS_AVAILABLE == $this->get_status();
	}
}
