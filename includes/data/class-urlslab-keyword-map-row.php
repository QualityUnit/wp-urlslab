<?php

class Urlslab_Keyword_Map_Row extends Urlslab_Data {
	public function __construct( array $data = array(), $loaded_from_db = false ) {
		$this->set_kw_id( $data['kw_id'] ?? '', $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? '', $loaded_from_db );
		$this->set_dest_url_id( $data['dest_url_id'] ?? '', $loaded_from_db );
		$this->set_link_type( $data['link_type'] ?? '', $loaded_from_db );
	}

	public function get_kw_id(): int {
		return $this->get( 'kw_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_dest_url_id(): int {
		return $this->get( 'dest_url_id' );
	}

	public function get_link_type(): string {
		return $this->get( 'link_type' );
	}

	public function set_kw_id( int $kw_id, $loaded_from_db = false ): void {
		$this->set( 'kw_id', $kw_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_dest_url_id( int $dest_url_id, $loaded_from_db = false ): void {
		$this->set( 'dest_url_id', $dest_url_id, $loaded_from_db );
	}

	public function set_link_type( string $link_type, $loaded_from_db = false ): void {
		$this->set( 'link_type', $link_type, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_KEYWORDS_MAP_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'kw_id', 'url_id', 'dest_url_id' );
	}

	public function get_columns(): array {
		return array(
			'kw_id'       => '%d',
			'url_id'      => '%d',
			'dest_url_id' => '%d',
			'link_type'   => '%s',
		);
	}
}
