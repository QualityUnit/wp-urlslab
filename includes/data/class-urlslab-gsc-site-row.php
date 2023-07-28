<?php

class Urlslab_Gsc_Site_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $gsc = array(), $loaded_from_db = true ) {
		$this->set_site_name( $gsc['site_name'] ?? '', $loaded_from_db );
		$this->set_updated( $gsc['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_row_offset( $gsc['row_offset'] ?? 0, $loaded_from_db );
		$this->set_date_to( $gsc['date_to'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_site_name(): string {
		return $this->get( 'site_name' );
	}

	public function get_row_offset(): int {
		return $this->get( 'row_offset' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_date_to(): string {
		return $this->get( 'date_to' );
	}

	public function set_site_name( string $site_name, $loaded_from_db = false ): void {
		$this->set( 'site_name', $site_name, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}


	public function set_date_to( string $date_to, $loaded_from_db = false ): void {
		$this->set( 'date_to', $date_to, $loaded_from_db );
	}

	public function set_row_offset( int $offset, $loaded_from_db = false ): void {
		$this->set( 'row_offset', $offset, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GSC_SITES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'site_name' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'site_name' => '%s',
			'updated'  => '%s',
			'row_offset' => '%d',
			'date_to'=> '%s',
		);
	}
}
