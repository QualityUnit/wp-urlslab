<?php

class Urlslab_Data_Not_Found_Log extends Urlslab_Data {
	const STATUS_NEW = 'N';
	const STATUS_PENDING = 'P';
	const STATUS_REDIRECT = 'R';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $log = array(), $loaded_from_db = true ) {
		$this->set_url( $log['url'] ?? '', $loaded_from_db );
		$this->set_cnt( $log['cnt'] ?? 0, $loaded_from_db );
		$this->set_created( $log['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_updated( $log['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_status( $log['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_url_id( $log['url_id'] ?? $this->compute_url_id(), $loaded_from_db );
		$this->set_ip( $log['ip'] ?? '', $loaded_from_db );
		$this->set_browser( $log['browser'] ?? '', $loaded_from_db );
		$this->set_country( $log['country'] ?? '', $loaded_from_db );
		$this->set_referrer( $log['referrer'] ?? '', $loaded_from_db );
		$this->set_request( $log['request'] ?? '', $loaded_from_db );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ) {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_status( string $status, $loaded_from_db = false ) {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function get_url(): string {
		return $this->get( 'url' );
	}

	public function set_url( string $url, $loaded_from_db = false ) {
		$this->set( 'url', $url, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_url_id( $this->compute_url_id(), $loaded_from_db );
		}
	}

	public function get_cnt(): int {
		return $this->get( 'cnt' );
	}

	public function set_cnt( int $cnt, $loaded_from_db = false ) {
		$this->set( 'cnt', $cnt, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_created( string $created, $loaded_from_db = false ) {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function set_updated( string $updated, $loaded_from_db = false ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function get_ip(): string {
		return $this->get( 'ip' );
	}

	public function set_ip( string $ip, $loaded_from_db = false ) {
		$this->set( 'ip', $ip, $loaded_from_db );
	}

	public function get_browser(): string {
		return $this->get( 'browser' );
	}

	public function set_browser( string $browser, $loaded_from_db = false ) {
		$this->set( 'browser', $browser, $loaded_from_db );
	}

	public function get_country(): string {
		return $this->get( 'country' );
	}

	public function set_country( string $country, $loaded_from_db = false ) {
		$this->set( 'country', $country, $loaded_from_db );
	}

	public function get_referrer(): string {
		return $this->get( 'referrer' );
	}

	public function set_referrer( string $referrer, $loaded_from_db = false ) {
		$this->set( 'referrer', $referrer, $loaded_from_db );
	}

	public function get_request(): string {
		return $this->get( 'request' );
	}

	public function set_request( string $request, $loaded_from_db = false ) {
		$this->set( 'request', $request, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_NOT_FOUND_LOG_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id' );
	}

	public function get_columns(): array {
		return array(
			'url_id'       => '%d',
			'url'          => '%s',
			'cnt'          => '%d',
			'created'      => '%s',
			'updated'      => '%s',
			'status'      => '%s',
			'ip' => '%s',
			'browser' => '%s',
			'country' => '%s',
			'referrer' => '%s',
			'request' => '%s',
		);
	}

	private function compute_url_id(): int {
		try {
			return ( new Urlslab_Url( $this->get_url() ) )->get_url_id();
		} catch ( Exception $e ) {
			return 0;
		}
	}
}
