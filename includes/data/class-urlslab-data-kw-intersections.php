<?php

class Urlslab_Data_Kw_Intersections extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_hash_id( $data['hash_id'] ?? 0, $loaded_from_db );
		$this->set_query( $data['query'] ?? '', $loaded_from_db );
		$this->set_query_id( $data['query_id'] ?? $this->compute_query_id(), $loaded_from_db );
		$this->set_rating( $data['rating'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
	}

	private function compute_query_id() {
		return crc32( $this->get_query() );
	}

	public function get_hash_id(): int {
		return $this->get( 'hash_id' );
	}

	public function set_hash_id( int $hash_id, bool $loaded_from_db = false ): void {
		$this->set( 'hash_id', $hash_id, $loaded_from_db );
	}

	public function get_query(): string {
		return $this->get( 'query' );
	}

	public function set_query( string $query, bool $loaded_from_db = false ): void {
		$this->set( 'query', $query, $loaded_from_db );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function set_query_id( int $query_id, bool $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function get_rating(): float {
		return $this->get( 'rating' );
	}

	public function set_rating( float $rating, bool $loaded_from_db = false ): void {
		$this->set( 'rating', $rating, $loaded_from_db );
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
			'rating'   => '%f',
			'created'  => '%s',
			'query'    => '%s',
		);
	}

	public function get_table_name(): string {
		return URLSLAB_KW_INTERSECTIONS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'hash_id', 'query_id' );
	}

	public static function compute_hash_id( array $urls, bool $parse_headers = false ): int {
		$sorted_urls = $urls;
		sort( $sorted_urls );

		return crc32( implode( ',', $sorted_urls ) . ( $parse_headers ? 'headers' : 'all' ) );
	}
}
