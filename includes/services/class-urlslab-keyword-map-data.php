<?php

class Urlslab_Keyword_Map_Data extends Urlslab_Data {

	public function __construct( array $data, $loaded_from_db = false ) {
		$this->set( 'kw_id', $data['kw_id'] ?? '', ! $loaded_from_db );
		$this->set( 'urlMd5', $data['urlMd5'] ?? '', ! $loaded_from_db );
		$this->set( 'destUrlMd5', $data['urlMd5'] ?? '', ! $loaded_from_db );
		$this->set( 'linkType', $data['urlMd5'] ?? '', ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_KEYWORDS_MAP_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'kw_id', 'urlMd5', 'destUrlMd5' );
	}

	function get_columns(): array {
		return array(
			'kw_id'      => '%d',
			'urlMd5'     => '%d',
			'destUrlMd5' => '%d',
			'linkType'   => '%s',
		);
	}
}
