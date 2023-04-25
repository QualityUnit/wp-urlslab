<?php

class Urlslab_Label_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $redirect = array(), $loaded_from_db = true ) {
		$this->set_label_id( $redirect['label_id'] ?? 0, $loaded_from_db );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function set_label_id( int $label_id, $loaded_from_db = false ) {
		$this->set( 'label_id', $label_id, $loaded_from_db );
	}

	public function set_name( string $name, $loaded_from_db = false ) {
		$this->set( 'name', $name, $loaded_from_db );
	}

	public function set_bgcolor( string $bgcolor, $loaded_from_db = false ) {
		$this->set( 'bgcolor', $bgcolor, $loaded_from_db );
	}

	public function set_modules( string $modules, $loaded_from_db = false ) {
		$this->set( 'modules', $modules, $loaded_from_db );
	}

	public function get_label_id(): int {
		return $this->get( 'label_id' );
	}

	public function get_name(): string {
		return $this->get( 'name' );
	}

	public function get_bgcolor(): string {
		return $this->get( 'bgcolor' );
	}

	public function get_modules(): string {
		return $this->get( 'modules' );
	}

	public function get_columns(): array {
		return array(
			'label_id' => '%d',
			'name'     => '%s',
			'bgcolor'  => '%s',
			'modules'  => '%s',
		);
	}

	public function get_table_name(): string {
		return URLSLAB_LABELS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'label_id' );
	}
}
