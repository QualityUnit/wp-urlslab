<?php

class Urlslab_Url_Relation_Row extends Urlslab_Data {

	/**
	 * @param array $url
	 */
	public function __construct(
		array $url = array(), $loaded_from_db = true
	) {
		$this->set( 'srcUrlMd5', $url['srcUrlMd5'] ?? 0, ! $loaded_from_db );
		$this->set( 'destUrlMd5', $url['destUrlMd5'] ?? 0, ! $loaded_from_db );
		$this->set( 'pos', $url['pos'] ?? 0, ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_RELATED_RESOURCE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'srcUrlMd5', 'destUrlMd5' );
	}

	function get_columns(): array {
		return array(
			'srcUrlMd5'  => '%d',
			'destUrlMd5' => '%d',
			'pos'        => '%d',
		);
	}
}
