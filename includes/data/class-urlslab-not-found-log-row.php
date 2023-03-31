<?php

class Urlslab_Not_Found_Log_Row extends Urlslab_Data {

	/**
	 * @param array $log
	 */
	public function __construct( array $log = array(), $loaded_from_db = true ) {
		$this->set_url( $log['url'] ?? '', $loaded_from_db );
		$this->set_cnt( $log['cnt'] ?? 0, $loaded_from_db );
		$this->set_created( $log['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_updated( $log['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_url_id( $log['url_id'] ?? $this->compute_url_id(), $loaded_from_db );
	}

	private function compute_url_id(): int {
		return ( new Urlslab_Url( $this->get_url() ) )->get_url_id();
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = true ) {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_url(): string {
		return $this->get( 'url' );
	}

	public function set_url( string $url, $loaded_from_db = true ) {
		$this->set( 'url', $url, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_url_id( $this->compute_url_id(), $loaded_from_db );
		}
	}

	public function get_cnt(): int {
		return $this->get( 'cnt' );
	}

	public function set_cnt( int $cnt, $loaded_from_db = true ) {
		$this->set( 'cnt', $cnt, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_created( string $created, $loaded_from_db = true ) {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function set_updated( string $updated, $loaded_from_db = true ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_NOT_FOUND_LOG_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'url_id' );
	}

	function get_columns(): array {
		return array(
			'url_id'  => '%d',
			'url'     => '%s',
			'cnt'     => '%d',
			'created' => '%s',
			'updated' => '%s',
		);
	}

	public function upsert() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "INSERT INTO {$this->get_table_name()} (url_id, url, cnt, created, updated) VALUES (%d, %s, %d, %s, %s) ON DUPLICATE KEY UPDATE cnt = cnt + 1, updated = %s", $this->get_url_id(), $this->get_url(), $this->get_cnt(), $this->get_created(), $this->get_updated(), $this->get_updated() ) );//phpcs:ignore
	}
}
