<?php

class Urlslab_Keyword_Data extends Urlslab_Data {

	public function __construct( array $data, $loaded_from_db = false ) {
		$this->set( 'keyword', $data['keyword'] ?? '', ! $loaded_from_db );
		$this->set( 'urlLink', $data['urlLink'] ?? '', ! $loaded_from_db );
		$this->set( 'kw_priority', $data['kw_priority'] ?? 10, ! $loaded_from_db );
		$this->set( 'kw_length', $data['kw_length'] ?? strlen( $this->get( 'keyword' ) ), ! $loaded_from_db );
		$this->set( 'lang', $data['lang'] ?? 'all', ! $loaded_from_db );
		$this->set( 'urlFilter', $data['kw_id'] ?? '.*', ! $loaded_from_db );
		$this->set( 'kwType', $data['kwType'] ?? Urlslab_Keywords_Links::KW_TYPE_MANUAL, ! $loaded_from_db );
		$this->set( 'kw_id', $data['kw_id'] ?? crc32( md5( $this->get( 'keyword' ) . '|' . $this->get( 'urlLink' ) . '|' . $this->get( 'lang' ) ) ), ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_KEYWORDS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'kw_id' );
	}

	function get_columns(): array {
		return array(
			'kw_id'       => '%d',
			'keyword'     => '%s',
			'urlLink'     => '%s',
			'kw_priority' => '%d',
			'kw_length'   => '%d',
			'lang'        => '%s',
			'urlFilter'   => '%s',
			'kwType'      => '%s',
		);
	}
}
