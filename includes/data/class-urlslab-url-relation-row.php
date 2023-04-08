<?php

class Urlslab_Url_Relation_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_src_url_id( $url['src_url_id'] ?? 0, $loaded_from_db );
		$this->set_dest_url_id( $url['dest_url_id'] ?? 0, $loaded_from_db );
		$this->set_pos( $url['pos'] ?? 0, $loaded_from_db );
	}

	public function get_src_url_id(): int {
		return $this->get( 'src_url_id' );
	}

	public function get_dest_url_id(): int {
		return $this->get( 'dest_url_id' );
	}

	public function get_pos(): int {
		return $this->get( 'pos' );
	}

	public function set_src_url_id( int $src_url_id, $loaded_from_db = false ): void {
		$this->set( 'src_url_id', $src_url_id, $loaded_from_db );
	}

	public function set_dest_url_id( int $dest_url_id, $loaded_from_db = false ): void {
		$this->set( 'dest_url_id', $dest_url_id, $loaded_from_db );
	}

	public function set_pos( int $pos, $loaded_from_db = false ): void {
		$this->set( 'pos', $pos, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_RELATED_RESOURCE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'src_url_id', 'dest_url_id' );
	}

	public function get_columns(): array {
		return array(
			'src_url_id'  => '%d',
			'dest_url_id' => '%d',
			'pos'         => '%d',
		);
	}
}
