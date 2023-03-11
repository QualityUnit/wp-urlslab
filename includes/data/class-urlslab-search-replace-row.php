<?php

class Urlslab_Search_Replace_Row extends Urlslab_Data {

	const TYPE_PLAIN_TEXT = 'T';
	const TYPE_REGEXP = 'R';


	public function __construct( array $row_data, $loaded_from_db = false ) {
		$this->set( 'id', $row_data['id'] ?? '', ! $loaded_from_db );
		$this->set( 'str_search', $row_data['str_search'] ?? '', ! $loaded_from_db );
		$this->set( 'str_replace', $row_data['str_replace'] ?? '', ! $loaded_from_db );
		$this->set( 'search_type', $row_data['search_type'] ?? self::TYPE_PLAIN_TEXT, ! $loaded_from_db );
		$this->set( 'url_filter', $row_data['url_filter'] ?? '', ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_SEARCH_AND_REPLACE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'id' );
	}

	function get_columns(): array {
		return array(
			'id'          => '%d',
			'str_search'  => '%s',
			'str_replace' => '%s',
			'search_type' => '%s',
			'url_filter'   => '%s',
		);
	}
}
