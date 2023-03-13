<?php

class Urlslab_Keyword_Map_Row extends Urlslab_Data {

	public function __construct( array $data, $loaded_from_db = false ) {
		$this->set( 'kw_id', $data['kw_id'] ?? '', ! $loaded_from_db );
		$this->set( 'url_id', $data['url_id'] ?? '', ! $loaded_from_db );
		$this->set( 'dest_url_id', $data['dest_url_id'] ?? '', ! $loaded_from_db );
		$this->set( 'link_type', $data['link_type'] ?? '', ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_KEYWORDS_MAP_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'kw_id', 'url_id', 'dest_url_id' );
	}

	function get_columns(): array {
		return array(
			'kw_id'      => '%d',
			'url_id'     => '%d',
			'dest_url_id' => '%d',
			'link_type'   => '%s',
		);
	}
}
