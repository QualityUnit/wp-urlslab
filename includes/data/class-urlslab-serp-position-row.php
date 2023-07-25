<?php

class Urlslab_Serp_Position_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_query_id( $url['query_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $url['url_id'] ?? 0, $loaded_from_db );
		$this->set_domain_id( $url['domain_id'] ?? 0, $loaded_from_db );
		$this->set_updated( $url['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_position( $url['position'] ?? 1, $loaded_from_db );
	}


	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_position(): int {
		return $this->get( 'position' );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_position( int $position, $loaded_from_db = false ): void {
		$this->set( 'position', $position, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_POSITIONS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'query_id', 'url_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'query_id' => '%d',
			'url_id'   => '%d',
			'domain_id'   => '%d',
			'updated'  => '%s',
			'position' => '%d',
		);
	}
}
