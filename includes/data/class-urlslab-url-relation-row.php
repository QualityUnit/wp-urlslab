<?php

class Urlslab_Url_Relation_Row extends Urlslab_Data {
	const IS_LOCKED_YES = 'Y';
	const IS_LOCKED_NO = 'N';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_src_url_id( $url['src_url_id'] ?? 0, $loaded_from_db );
		$this->set_dest_url_id( $url['dest_url_id'] ?? 0, $loaded_from_db );
		$this->set_pos( $url['pos'] ?? 0, $loaded_from_db );
		$this->set_created_date( $url['created_date'] ?? Urlslab_Data::get_now(), $loaded_from_db );
		$this->set_is_locked( $url['is_locked'] ?? self::IS_LOCKED_NO, $loaded_from_db );
	}

	public function get_src_url_id(): int {
		return $this->get( 'src_url_id' );
	}

	public function get_dest_url_id(): int {
		return $this->get( 'dest_url_id' );
	}

	public function get_pos(): int {
		return $this->get( 'pos' );
	}

	public function get_is_locked(): string {
		return $this->get( 'is_locked' );
	}

	public function set_src_url_id( int $src_url_id, $loaded_from_db = false ): void {
		$this->set( 'src_url_id', $src_url_id, $loaded_from_db );
	}

	public function set_dest_url_id( int $dest_url_id, $loaded_from_db = false ): void {
		$this->set( 'dest_url_id', $dest_url_id, $loaded_from_db );
	}

	public function set_pos( int $pos, $loaded_from_db = false ): void {
		$this->set( 'pos', $pos, $loaded_from_db );
	}

	public function get_created_date(): string {
		return $this->get( 'created_date' );
	}

	public function set_created_date( string $created_date, $loaded_from_db = false ): void {
		$this->set( 'created_date', $created_date, $loaded_from_db );
	}

	public function set_is_locked( $is_locked, $loaded_from_db = false ): void {
		if ( is_bool( $is_locked ) ) {
			$is_locked = $is_locked ? self::IS_LOCKED_YES : self::IS_LOCKED_NO;
		}
		$this->set( 'is_locked', self::IS_LOCKED_YES === $is_locked ? self::IS_LOCKED_YES : self::IS_LOCKED_NO, $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( 'is_locked' === $name && is_bool( $value ) ) {
			$value = $value ? self::IS_LOCKED_YES : self::IS_LOCKED_NO;
		}

		return parent::set( $name, $value, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_RELATED_RESOURCE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'src_url_id', 'dest_url_id' );
	}

	public function get_columns(): array {
		return array(
			'src_url_id'   => '%d',
			'dest_url_id'  => '%d',
			'pos'          => '%d',
			'created_date' => '%s',
			'is_locked'    => '%s',
		);
	}
}
