<?php

class Urlslab_Content_Generator_Row extends Urlslab_Data {
	const STATUS_ACTIVE = 'A';
	const STATUS_NEW = 'N';
	const STATUS_PENDING = 'P';
	const STATUS_WAITING_APPROVAL = 'W';
	const STATUS_DISABLED = 'D';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_semantic_context( $data['semantic_context'] ?? '', $loaded_from_db );
		$this->set_command( $data['command'] ?? '', $loaded_from_db );
		$this->set_url_filter( $data['url_filter'] ?? '', $loaded_from_db );
		$this->set_lang( $data['lang'] ?? '', $loaded_from_db );
		$this->set_result( $data['result'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_status_changed( $data['status_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_generator_id( $data['generator_id'] ?? $this->compute_generator_id(), $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		$result = parent::set( $name, $value, $loaded_from_db );

		switch ( $name ) {
			case 'semantic_context':
			case 'lang':
			case 'command':
			case 'url_filter':
				$this->set_generator_id( $this->compute_generator_id(), $loaded_from_db );
				break;
		}

		return $result;
	}

	private function compute_generator_id(): int {
		return crc32( md5( $this->get_semantic_context() . $this->get_command() . $this->get_url_filter() . $this->get_lang() ) );
	}

	public function is_valid(): bool {
		return ! empty( $this->get_command() ) && ! empty( $this->get_url_filter() ) && self::STATUS_DISABLED !== $this->get_status();
	}

	public function get_generator_id(): int {
		return $this->get( 'generator_id' );
	}

	public function get_semantic_context(): string {
		return $this->get( 'semantic_context' );
	}

	public function get_lang(): string {
		return $this->get( 'lang' );
	}

	public function get_command(): string {
		return $this->get( 'command' );
	}

	public function get_url_filter(): string {
		return $this->get( 'url_filter' );
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

	public function set_semantic_context( string $semantic_context, $loaded_from_db = false ): void {
		$this->set( 'semantic_context', $semantic_context, $loaded_from_db );
	}

	public function set_lang( string $lang, $loaded_from_db = false ): void {
		$this->set( 'lang', $lang, $loaded_from_db );
	}

	public function set_command( string $command, $loaded_from_db = false ): void {
		$this->set( 'command', $command, $loaded_from_db );
	}

	public function set_url_filter( string $url_filter, $loaded_from_db = false ): void {
		$this->set( 'url_filter', $url_filter, $loaded_from_db );
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
			'generator_id'     => '%d',
			'semantic_context' => '%s',
			'command'          => '%s',
			'url_filter'       => '%s',
			'result'           => '%s',
			'status'           => '%s',
			'lang'             => '%s',
			'status_changed'   => '%s',
		);
	}

	public function is_active(): bool {
		return self::STATUS_ACTIVE === $this->get_status() || self::STATUS_PENDING === $this->get_status();
	}
}
