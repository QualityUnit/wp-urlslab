<?php

class Urlslab_Serp_Qgroup_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $qgroup = array(), $loaded_from_db = true ) {
		$this->set_name( $qgroup['name'] ?? '', $loaded_from_db );
		$this->set_short_name( $qgroup['short_name'] ?? $this->compute_short_name(), $loaded_from_db );
		$this->set_qgroup_id( $qgroup['qgroup_id'] ?? $this->compute_qgroup_id(), $loaded_from_db );
	}

	public function get_qgroup_id(): int {
		return $this->get( 'qgroup_id' );
	}

	public function get_short_name(): string {
		return $this->get( 'short_name' );
	}

	public function get_name(): string {
		return $this->get( 'name' );
	}

	public function set_qgroup_id( int $qgroup_id, $loaded_from_db = false ) {
		$this->set( 'qgroup_id', $qgroup_id, $loaded_from_db );
	}

	public function set_short_name( string $short_name, $loaded_from_db = false ) {
		$this->set( 'short_name', $short_name, $loaded_from_db );
	}

	public function set_name( string $name, $loaded_from_db = false ) {
		$this->set( 'name', $name, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_QGROUPS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'qgroup_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'qgroup_id'  => '%d',
			'short_name' => '%s',
			'name'       => '%s',
		);
	}

	private function compute_short_name(): string {
		$words      = explode( ' ', strtolower( str_replace( ',', ' ', $this->get_name() ) ) );
		$word_count = array_count_values( $words );
		arsort( $word_count );

		return implode( ' ', array_keys( $word_count ) );
	}

	private function compute_qgroup_id(): int {
		return crc32( $this->get_name() );
	}
}
