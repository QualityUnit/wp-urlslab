<?php

class Urlslab_Serp_Qgroup_Query_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $qgroup = array(), $loaded_from_db = true ) {
		$this->set_qgroup_id( $qgroup['qgroup_id'] ?? 0, $loaded_from_db );
		$this->set_query_id( $qgroup['query_id'] ?? 0, $loaded_from_db );
	}


	public function get_qgroup_id(): int {
		return $this->get( 'qgroup_id' );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function set_qgroup_id( int $qgroup_id, $loaded_from_db = false ) {
		$this->set( 'qgroup_id', $qgroup_id, $loaded_from_db );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ) {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_QGROUP_QUERIES_TABLE;
	}

	public function get_primary_columns(): array {
		return array(
			'qgroup_id',
			'query_id',
		);
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'qgroup_id' => '%d',
			'query_id'  => '%d',
		);
	}

}
