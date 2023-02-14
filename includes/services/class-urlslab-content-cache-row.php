<?php

class Urlslab_Content_Cache_Row extends Urlslab_Data {

	/**
	 * @param array $content_cache
	 */
	public function __construct( array $content_cache = array(), $loaded_from_db = true ) {
		$this->set( 'cache_content', $content_cache['cache_content'] ?? '', ! $loaded_from_db );
		$this->set( 'cache_crc32', $content_cache['cache_crc32'] ?? crc32( $content_cache['cache_content'] ?? '' ), ! $loaded_from_db );
		$this->set( 'cache_len', $content_cache['cache_len'] ?? strlen( $content_cache['cache_content'] ?? '' ), ! $loaded_from_db );
		$this->set( 'date_changed', $content_cache['date_changed'] ?? self::get_now(), ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_CONTENT_CACHE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'cache_crc32', 'cache_len' );
	}

	function get_columns(): array {
		return array(
			'cache_crc32'   => '%d',
			'cache_len'     => '%d',
			'cache_content' => '%s',
			'date_changed'  => '%s',
		);
	}

}
