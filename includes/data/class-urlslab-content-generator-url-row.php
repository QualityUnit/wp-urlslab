<?php

class Urlslab_Content_Generator_Url_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_generator_id( $data['generator_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? 0, $loaded_from_db );
	}

	public function get_generator_id(): int {
		return $this->get( 'generator_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_generator_id( int $generator_id, $loaded_from_db = false ): void {
		$this->set( 'generator_id', $generator_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_CONTENT_GENERATOR_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'generator_id', 'url_id' );
	}

	public function get_columns(): array {
		return array(
			'generator_id' => '%d',
			'url_id'        => '%d',
		);
	}
}
