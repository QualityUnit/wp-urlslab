<?php

class Urlslab_Serp_Query_Row extends Urlslab_Data {
	public const STATUS_NOT_PROCESSED = '';
	public const STATUS_NOT_APPROVED = 'N';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_PROCESSED = 'A';
	public const STATUS_ERROR = 'E';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $query = array(), $loaded_from_db = true ) {
		$this->set_lang( $query['lang'] ?? 'en', $loaded_from_db );
		$this->set_query( $query['query'] ?? '', $loaded_from_db );
		$this->set_updated( $query['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_status( $query['status'] ?? self::STATUS_NOT_PROCESSED, $loaded_from_db );
		$this->set_query_id( $query['query_id'] ?? $this->compute_query_id(), $loaded_from_db );
	}


	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function get_lang(): string {
		return $this->get( 'lang' );
	}

	public function get_query(): string {
		return $this->get( 'query' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function set_lang( string $lang, $loaded_from_db = false ): void {
		$this->set( 'lang', $lang, $loaded_from_db );
	}

	public function set_query( string $query, $loaded_from_db = false ): void {
		$this->set( 'query', $query, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_query_id( $this->compute_query_id() );
		}
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_updated( self::get_now(), $loaded_from_db );
		}
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_QUERIES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'query_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'query_id' => '%d',
			'lang'     => '%s',
			'query'    => '%s',
			'updated'  => '%s',
			'status'   => '%s',
		);
	}

	private function compute_query_id() {
		return crc32( $this->get_lang() . '-' . $this->get_query() );
	}

}
