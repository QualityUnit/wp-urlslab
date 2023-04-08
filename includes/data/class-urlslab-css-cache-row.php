<?php

class Urlslab_CSS_Cache_Row extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_NEW = 'N';
	public const STATUS_PENDING = 'P';
	public const STATUS_DISABLED = 'D';

	private Urlslab_Url $url_object;

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_url( 'url', $url['url'] ?? '', $loaded_from_db );
		if ( isset( $url['url_id'] ) ) {
			$url_id = $url['url_id'];
		} else {
			try {
				$url_obj = $this->get_url_object();
				$url_id = $url_obj->get_url_id();
			} catch ( Exception $e ) {
				$url_id = 'invalid_url';
			}
		}
		$this->set_url_id( $url_id, $loaded_from_db );
		$this->set_status( $url['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $url['status_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_filesize( $url['filesize'] ?? 0, $loaded_from_db );
		$this->set_css_content( $url['css_content'] ?? '', $loaded_from_db );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_url(): string {
		return $this->get( 'url' );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function get_status_changed(): string {
		return $this->get( 'status_changed' );
	}

	public function get_filesize(): int {
		return $this->get( 'filesize' );
	}

	public function get_css_content(): string {
		return $this->get( 'css_content' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_url( string $url, $loaded_from_db = false ): void {
		$this->set( 'url', $url, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_status_changed( self::get_now() );
		}
	}

	public function set_status_changed( string $status_changed, $loaded_from_db = false ): void {
		$this->set( 'status_changed', $status_changed, $loaded_from_db );
	}

	public function set_filesize( int $filesize, $loaded_from_db = false ): void {
		$this->set( 'filesize', $filesize, $loaded_from_db );
	}

	public function set_css_content( string $css_content, $loaded_from_db = false ): void {
		$this->set( 'css_content', $css_content, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_CSS_CACHE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id' );
	}

	/**
	 * @throws Exception
	 */
	public function get_url_object(): Urlslab_Url {
		return new Urlslab_Url( $this->get_url(), true );
	}

	public function get_columns(): array {
		return array(
			'url'            => '%s',
			'url_id'         => '%d',
			'status'         => '%s',
			'status_changed' => '%s',
			'filesize'       => '%d',
			'css_content'    => '%s',
		);
	}

	/**
	 * @return Urlslab_CSS_Cache_Row[]
	 */
	public static function get_css_files( array $url_ids ): array {
		global $wpdb;
		$css_files = array();
		if ( ! empty( $url_ids ) ) {
			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT *	FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE url_id in (' . trim( str_repeat( '%s,', count( $url_ids ) ), ',' ) . ')', // phpcs:ignore
					$url_ids
				),
				'ARRAY_A'
			);
			foreach ( $results as $css_file_array ) {
				$css_file_obj = new Urlslab_CSS_Cache_Row( $css_file_array );
				$css_files[ $css_file_obj->get_url_id() ] = $css_file_obj;
			}
		}

		return $css_files;
	}
}
