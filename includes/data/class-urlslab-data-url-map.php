<?php

class Urlslab_Data_Url_Map extends Urlslab_Data {

	public const REL_TYPE_ALTERNATE = 'A';
	public const REL_TYPE_LINK = 'L';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_src_url_id( $data['src_url_id'] ?? 0, $loaded_from_db );
		$this->set_dest_url_id( $data['dest_url_id'] ?? 0, $loaded_from_db );
		$this->set_rel_type( $data['rel_type'] ?? self::REL_TYPE_LINK, $loaded_from_db );
		$this->set_rel_attribute( $data['rel_attribute'] ?? '', $loaded_from_db );
	}

	public function set_src_url_id( int $src_url_id, $loaded_from_db = false ): void {
		$this->set( 'src_url_id', $src_url_id, $loaded_from_db );
	}

	public function get_src_url_id(): int {
		return $this->get( 'src_url_id' );
	}

	public function set_dest_url_id( int $dest_url_id, $loaded_from_db = false ): void {
		$this->set( 'dest_url_id', $dest_url_id, $loaded_from_db );
	}

	public function get_dest_url_id(): int {
		return $this->get( 'dest_url_id' );
	}

	public function set_rel_type( string $rel_type, $loaded_from_db = false ): void {
		$this->set( 'rel_type', $rel_type, $loaded_from_db );
	}

	public function get_rel_type(): string {
		return $this->get( 'rel_type' );
	}

	public function set_rel_attribute( string $rel_attribute, $loaded_from_db = false ): void {
		$this->set( 'rel_attribute', $rel_attribute, $loaded_from_db );
	}

	public function get_rel_attribute(): string {
		return $this->get( 'rel_attribute' );
	}

	public function get_table_name(): string {
		return URLSLAB_URLS_MAP_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'src_url_id', 'dest_url_id' );
	}

	public function get_columns(): array {
		return array(
			'src_url_id' => '%d',
			'dest_url_id' => '%d',
			'rel_type' => '%s',
			'rel_attribute' => '%s',
		);
	}
}
