<?php

class Urlslab_Serp_Domain_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $domain = array(), $loaded_from_db = true ) {
		$this->set_domain_name( $domain['domain_name'] ?? '', $loaded_from_db );
		$this->set_domain_id( $domain['domain_id'] ?? $this->compute_domain_id(), $loaded_from_db );
	}

	public function get_domain_id(): int {
		return $this->get( 'domain_id' );
	}

	public function get_domain_name(): string {
		return $this->get( 'domain_name' );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_domain_name( string $domain_name, $loaded_from_db = false ): void {
		$this->set( 'domain_name', $domain_name, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_DOMAINS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'domain_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'domain_id'   => '%d',
			'domain_name' => '%s',
		);
	}

	private function compute_domain_id() {
		try {
			$url = new Urlslab_Url( $this->get_domain_name(), true );

			return $url->get_domain_id();
		} catch ( Exception $e ) {
			return 0;
		}
	}
}
