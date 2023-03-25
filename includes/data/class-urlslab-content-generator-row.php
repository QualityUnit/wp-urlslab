<?php

class Urlslab_Content_Generator_Row extends Urlslab_Data {
	const STATUS_ACTIVE = 'A';
	const STATUS_NEW = 'N';
	const STATUS_PENDING = 'P';
	const STATUS_WAITING_APPROVAL = 'W';
	const STATUS_DISABLED = 'D';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_query( $data['query'] ?? '', $loaded_from_db );
		$this->set_lang( $data['lang'] ?? '', $loaded_from_db );
		$this->set_context( $data['context'] ?? '', $loaded_from_db );
		$this->set_result( $data['result'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $data['status_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_generator_id( $data['generator_id'] ?? $this->compute_generator_id(), $loaded_from_db );
	}

	private function compute_generator_id(): int {
		return crc32( md5( $this->get_query() . $this->get_context() . $this->get_lang() ) );
	}

	public function is_valid(): bool {
		return ! empty( $this->get_query() ) && self::STATUS_DISABLED !== $this->get_status();
	}

	public function get_generator_id(): int {
		return $this->get( 'generator_id' );
	}

	public function get_query(): string {
		return $this->get( 'query' );
	}

	public function get_lang(): string {
		return $this->get( 'lang' );
	}

	public function get_context(): string {
		return $this->get( 'context' );
	}

	public function get_result(): string {
		return $this->get( 'result' );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function get_status_changed(): string {
		return $this->get( 'status_changed' );
	}

	public function set_generator_id( int $generator_id, $loaded_from_db = false ): void {
		$this->set( 'generator_id', $generator_id, $loaded_from_db );
	}

	public function set_query( string $query, $loaded_from_db = false ): void {
		$this->set( 'query', $query, $loaded_from_db );
	}

	public function set_lang( string $lang, $loaded_from_db = false ): void {
		$this->set( 'lang', $lang, $loaded_from_db );
	}

	public function set_context( string $context, $loaded_from_db = false ): void {
		$this->set( 'context', $context, $loaded_from_db );
	}

	public function set_result( string $result, $loaded_from_db = false ): void {
		$this->set( 'result', $result, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
		$this->set_status_changed( self::get_now(), $loaded_from_db );
	}

	public function set_status_changed( string $status_changed, $loaded_from_db = false ): void {
		$this->set( 'status_changed', $status_changed, $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_CONTENT_GENERATORS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'generator_id' );
	}

	function get_columns(): array {
		return array(
			'generator_id'   => '%d',
			'query'          => '%s',
			'context'        => '%s',
			'result'         => '%s',
			'status'         => '%s',
			'lang'           => '%s',
			'status_changed' => '%s',
		);
	}

	public function is_active(): bool {
		return self::STATUS_ACTIVE === $this->get_status() || self::STATUS_PENDING === $this->get_status();
	}
}
