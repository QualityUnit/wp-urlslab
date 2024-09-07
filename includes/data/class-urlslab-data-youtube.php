<?php


use FlowHunt_Vendor\OpenAPI\Client\Model\YoutubeContent;

class Urlslab_Data_Youtube extends Urlslab_Data {
	public const STATUS_NEW = 'N';
	public const STATUS_AVAILABLE = 'A';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_DISABLED = 'D';
	private static array $video_cache = array();

	private ?YoutubeContent $microdata_obj = null;

	public function __construct( array $video = array(), $loaded_from_db = false ) {
		if ( isset( $video['videoid'] ) ) {
			$this->set_video_id( self::parse_video_id( $video['videoid'] ) ?? '', $loaded_from_db );
		} else {
			$this->set_video_id( '', $loaded_from_db );
		}
		$this->set_microdata( $video['microdata'] ?? null, $loaded_from_db );
		$this->set_status( $video['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $video['status_changed'] ?? self::get_now(), $loaded_from_db );
	}

	public static function parse_video_id( $video_id ) {
		if ( false !== strpos( $video_id, 'http' ) ) {
			$pattern = '/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/[^\/]+\/u\/[^\/]+\/[0-9]+\/[^\/]+\/(?!.*\/u\/[0-9]+\/)[^\/]+\/))([\w-]{10,12})(?:$|&|\?)/';
			preg_match( $pattern, $video_id, $matches );

			return isset( $matches[1] ) ? $matches[1] : false;
		}

		return $video_id;
	}

	public function get_video_id() {
		return $this->get( 'videoid' );
	}

	public function get_microdata() {
		return $this->get( 'microdata' );
	}

	public function get_captions() {
		return $this->get_microdata_obj()->getContent();
	}

	public function get_status() {
		return $this->get( 'status' );
	}

	public function get_status_changed() {
		return $this->get( 'status_changed' );
	}

	public function get_channel_title() {
		return $this->get_microdata_obj()->getChannelTitle();
	}

	public function get_video_tags(): array {
		return $this->get_microdata_obj()->getKeywords();
	}

	public function get_microdata_obj(): YoutubeContent {
		if ( $this->microdata_obj ) {
			return $this->microdata_obj;
		}
		if ( strlen( $this->get_microdata() ) ) {
			$this->microdata_obj = new YoutubeContent( json_decode( $this->get_microdata(), true ) );
			return $this->microdata_obj;
		}
		return new YoutubeContent( array() );
	}

	public function set_video_id( $video_id, $loaded_from_db = false ) {
		$this->set( 'videoid', $video_id, $loaded_from_db );
	}

	public function set_microdata( $microdata, $loaded_from_db = false ) {
		$this->set( 'microdata', $microdata, $loaded_from_db );
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
		return $this->get_microdata_obj()->getTitle();
	}

	public function get_description() {
		return $this->get_microdata_obj()->getDescription();
	}

	public function get_published_at() {
		return $this->get_microdata_obj()->getCreatedAt();
	}

	public function get_img_url() {
		$url = $this->get_microdata_obj()->getImgUrl();
		if ( strlen( $url ) ) {
			return $url;
		}
		return "https://img.youtube.com/vi/{$this->get_video_id()}/0.jpg";
	}

	public function get_duration() {
		return $this->get_microdata_obj()->getDuration();
	}

	public function get_thumbnail_url() {
		if ( strlen( $this->get_microdata_obj()->getImgUrl() ) ) {
			return $this->get_microdata_obj()->getImgUrl();
		}

		return 'https://i.ytimg.com/vi/' . $this->get_video_id() . '/hqdefault.jpg';
	}

	protected function before_insert() {
		parent::before_insert();
		if ( 1 !== preg_match( '/^[0-9a-zA-Z_\-]+$/', $this->get_video_id() ) ) {
			$this->set_status( self::STATUS_DISABLED );
		}
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
			'status'         => '%s',
			'status_changed' => '%s',
		);
	}

	public function is_active(): bool {
		return self::STATUS_AVAILABLE == $this->get_status();
	}

	public function has_microdata(): bool {
		return strlen( $this->get_title() ) > 0;
	}


	public static function get_video_obj( $videoid ): Urlslab_Data_Youtube {
		$videoid = self::parse_video_id( $videoid );

		if ( ! isset( self::$video_cache[ $videoid ] ) ) {
			self::$video_cache[ $videoid ] = new Urlslab_Data_Youtube( array( 'videoid' => $videoid ) );
			if ( ! self::$video_cache[ $videoid ]->load() && strlen( $videoid ) ) {
				self::$video_cache[ $videoid ]->insert();
			}
		}

		return self::$video_cache[ $videoid ];
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'status_changed':
				return self::COLUMN_TYPE_DATE;
		}

		if ( 'status' === $column ) {
			return self::COLUMN_TYPE_ENUM;
		}


		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		if ( 'status' === $column ) {
			return array(
				self::STATUS_NEW        => __( 'New', 'urlslab' ),
				self::STATUS_AVAILABLE  => __( 'Available', 'urlslab' ),
				self::STATUS_PROCESSING => __( 'Processing', 'urlslab' ),
				self::STATUS_DISABLED   => __( 'Disabled', 'urlslab' ),
			);
		}

		return parent::get_enum_column_items( $column );
	}
}
