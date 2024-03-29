<?php

class Urlslab_Data_Label extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_label_id( $data['label_id'] ?? 0, $loaded_from_db );
		$this->set_name( $data['name'] ?? '', $loaded_from_db );
		$this->set_bgcolor( $data['bgcolor'] ?? $this->random_color(), $loaded_from_db );
		$this->set_modules( $data['modules'] ?? '', $loaded_from_db );
	}

	public function as_array(): array {
		$data            = $this->data;
		$data['modules'] = $this->get_modules();

		return $data;
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

	private function random_color() {
		$dt = '';
		for ( $o = 1; $o <= 3; $o++ ) {
			$dt .= str_pad( dechex( mt_rand( 127, 255 ) ), 2, '0', STR_PAD_LEFT );
		}

		return '#' . $dt;
	}

	public function set_modules( $modules, $loaded_from_db = false ) {
		$this->set( 'modules', $modules, $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( 'modules' === $name && is_array( $value ) ) {
			if ( empty( $value ) ) {
				$value = '';
			} else {
				$value = implode( ',', $value );
			}
		}

		return parent::set( $name, $value, $loaded_from_db ); // TODO: Change the autogenerated stub
	}

	protected function get( $name ) {
		if ( 'modules' === $name ) {
			$modules = parent::get( $name );
			if ( ! is_array( $modules ) ) {
				if ( empty( $modules ) ) {
					$modules = array();
				} else {
					$modules = explode( ',', $modules );
				}
			}

			return $modules;
		}

		return parent::get( $name ); // TODO: Change the autogenerated stub
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

	public function get_modules() {
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
