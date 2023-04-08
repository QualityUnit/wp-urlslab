<?php

class Urlslab_Content_Cache_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $content_cache = array(), $loaded_from_db = true ) {
		$this->set_cache_content( $content_cache['cache_content'] ?? '', $loaded_from_db );
		$this->set_cache_crc32( $content_cache['cache_crc32'] ?? crc32( $content_cache['cache_content'] ?? '' ), $loaded_from_db );
		$this->set_cache_len( $content_cache['cache_len'] ?? strlen( $content_cache['cache_content'] ?? '' ), $loaded_from_db );
		$this->set_date_changed( $content_cache['date_changed'] ?? self::get_now(), $loaded_from_db );
	}

	public function set_cache_content( string $cache_content, $loaded_from_db = false ): void {
		$this->set( 'cache_content', $cache_content, $loaded_from_db );
	}

	public function set_cache_crc32( int $cache_crc32, $loaded_from_db = false ): void {
		$this->set( 'cache_crc32', $cache_crc32, $loaded_from_db );
	}

	public function set_cache_len( int $cache_len, $loaded_from_db = false ): void {
		$this->set( 'cache_len', $cache_len, $loaded_from_db );
	}

	public function set_date_changed( string $date_changed, $loaded_from_db = false ): void {
		$this->set( 'date_changed', $date_changed, $loaded_from_db );
	}

	public function get_cache_content(): string {
		return $this->get( 'cache_content' );
	}

	public function get_cache_crc32(): int {
		return $this->get( 'cache_crc32' );
	}

	public function get_cache_len(): int {
		return $this->get( 'cache_len' );
	}

	public function get_date_changed(): string {
		return $this->get( 'date_changed' );
	}

	public function get_table_name(): string {
		return URLSLAB_CONTENT_CACHE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'cache_crc32', 'cache_len' );
	}

	public function get_columns(): array {
		return array(
			'cache_crc32'   => '%d',
			'cache_len'     => '%d',
			'cache_content' => '%s',
			'date_changed'  => '%s',
		);
	}
}
