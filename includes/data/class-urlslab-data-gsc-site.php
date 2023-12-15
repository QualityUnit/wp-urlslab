<?php

class Urlslab_Data_Gsc_Site extends Urlslab_Data {
	const IMPORTING_NO = 'N';
	const IMPORTING_YES = 'Y';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $gsc = array(), $loaded_from_db = true ) {
		$this->set_site_id( $gsc['site_id'] ?? 0, $loaded_from_db );
		$this->set_site_name( $gsc['site_name'] ?? '', $loaded_from_db );
		$this->set_updated( $gsc['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_row_offset( $gsc['row_offset'] ?? 0, $loaded_from_db );
		$this->set_importing( $gsc['importing'] ?? self::IMPORTING_NO, $loaded_from_db );
		$this->set_date_to( $gsc['date_to'] ?? gmdate( 'Y-m-d', strtotime( '-1 days' ) ), $loaded_from_db );
	}

	public function get_site_id(): int {
		return $this->get( 'site_id' );
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

	public function get_importing(): string {
		return $this->get( 'importing' );
	}

	public function set_site_id( int $site_id, $loaded_from_db = false ): void {
		$this->set( 'site_id', $site_id, $loaded_from_db );
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

	public function set_importing( $importing, $loaded_from_db = false ): void {
		$this->set( 'importing', $importing, $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( 'importing' === $name && is_bool( $value ) ) {
			$value = $value ? self::IMPORTING_YES : self::IMPORTING_NO;
		}
		parent::set( $name, $value, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GSC_SITES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'site_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'site_id'    => '%d',
			'site_name'  => '%s',
			'updated'    => '%s',
			'row_offset' => '%d',
			'date_to'    => '%s',
			'importing'  => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'updated':
			case 'date_to':
				return 'date';
		}

		return parent::get_column_type( $column, $format );
	}
}
