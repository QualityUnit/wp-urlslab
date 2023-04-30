<?php

class Urlslab_Generator_Url_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_shortcode_id( $data['shortcode_id'] ?? 0, $loaded_from_db );
		$this->set_hash_id( $data['hash_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_shortcode_id(): int {
		return $this->get( 'shortcode_id' );
	}

	public function get_hash_id(): int {
		return $this->get( 'hash_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_shortcode_id( int $shortcode_id, $loaded_from_db = false ): void {
		$this->set( 'shortcode_id', $shortcode_id, $loaded_from_db );
	}

	public function set_hash_id( int $hash_id, $loaded_from_db = false ): void {
		$this->set( 'hash_id', $hash_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_created( string $created, $loaded_from_db = false ): void {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GENERATOR_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'shortcode_id', 'hash_id', 'url_id' );
	}

	public function get_columns(): array {
		return array(
			'shortcode_id' => '%d',
			'hash_id' => '%d',
			'url_id'       => '%d',
			'created'       => '%s',
		);
	}
}
