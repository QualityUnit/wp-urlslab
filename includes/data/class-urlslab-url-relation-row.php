<?php

class Urlslab_Url_Relation_Row extends Urlslab_Data {

	/**
	 * @param array $url
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set( 'src_url_id', $url['src_url_id'] ?? 0, ! $loaded_from_db );
		$this->set( 'dest_url_id', $url['dest_url_id'] ?? 0, ! $loaded_from_db );
		$this->set( 'pos', $url['pos'] ?? 0, ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_RELATED_RESOURCE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'src_url_id', 'dest_url_id' );
	}

	function get_columns(): array {
		return array(
			'src_url_id'  => '%d',
			'dest_url_id' => '%d',
			'pos'        => '%d',
		);
	}
}
