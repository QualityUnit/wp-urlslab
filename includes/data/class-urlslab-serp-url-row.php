<?php

class Urlslab_Serp_Url_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_url_name( $url['url_name'] ?? '', $loaded_from_db );
		$this->set_url_title( $url['url_title'] ?? '', $loaded_from_db );
		$this->set_url_description( $url['url_description'] ?? '', $loaded_from_db );
		$this->set_url_id( $url['url_id'] ?? $this->compute_url_id(), $loaded_from_db );
		$this->set_domain_id( $url['domain_id'] ?? $this->compute_domain_id(), $loaded_from_db );
	}


	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_domain_id(): int {
		return $this->get( 'domain_id' );
	}

	public function get_url_name(): string {
		return $this->get( 'url_name' );
	}

	public function get_url_title(): string {
		return $this->get( 'url_title' );
	}

	public function get_url_description(): string {
		return $this->get( 'url_description' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_url_name( string $url_name, $loaded_from_db = false ): void {
		$this->set( 'url_name', $url_name, $loaded_from_db );
	}

	public function set_url_title( string $url_title, $loaded_from_db = false ): void {
		$this->set( 'url_title', $url_title, $loaded_from_db );
	}

	public function set_url_description( string $url_description, $loaded_from_db = false ): void {
		$this->set( 'url_description', $url_description, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'url_id'          => '%d',
			'domain_id'       => '%d',
			'url_name'        => '%s',
			'url_title'       => '%s',
			'url_description' => '%s',
		);
	}

	private function compute_url_id(): int {
		$url = new Urlslab_Url( $this->get_url_name(), true );

		return $url->get_url_id();
	}

	private function compute_domain_id() {
		$url = new Urlslab_Url( $this->get_url_name(), true );

		return $url->get_domain_id();
	}
}
