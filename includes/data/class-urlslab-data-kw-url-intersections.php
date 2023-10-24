<?php

class Urlslab_Data_Kw_Url_Intersections extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_hash_id( $data['hash_id'] ?? 0, $loaded_from_db );
		$this->set_query_id( $data['query_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? 0, $loaded_from_db );
		$this->set_words( $data['words'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_hash_id(): int {
		return $this->get( 'hash_id' );
	}

	public function set_hash_id( int $hash_id, bool $loaded_from_db = false ): void {
		$this->set( 'hash_id', $hash_id, $loaded_from_db );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function set_query_id( int $query_id, bool $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_url_id( int $url_id, bool $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_words(): int {
		return $this->get( 'words' );
	}

	public function set_words( int $words, bool $loaded_from_db = false ): void {
		$this->set( 'words', $words, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_created( string $created, bool $loaded_from_db = false ): void {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_columns(): array {
		return array(
			'hash_id'  => '%d',
			'query_id' => '%d',
			'url_id' => '%d',
			'words'   => '%d',
			'created'  => '%s',
		);
	}

	public function get_table_name(): string {
		return URLSLAB_KW_URL_INTERSECTIONS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'hash_id', 'query_id', 'url_id' );
	}
}
