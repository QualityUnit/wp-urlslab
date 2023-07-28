<?php

class Urlslab_Gsc_Position_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $gsc = array(), $loaded_from_db = true ) {
		$this->set_query_id( $gsc['query_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $gsc['url_id'] ?? 0, $loaded_from_db );
		$this->set_domain_id( $gsc['domain_id'] ?? 0, $loaded_from_db );
		$this->set_updated( $gsc['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_position( $gsc['position'] ?? 0, $loaded_from_db );
		$this->set_clicks( $gsc['clicks'] ?? 0, $loaded_from_db );
		$this->set_impressions( $gsc['impressions'] ?? 0, $loaded_from_db );
		$this->set_ctr( $gsc['ctr'] ?? 0, $loaded_from_db );
	}


	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_position(): float {
		return $this->get( 'position' );
	}

	public function get_clicks(): int {
		return $this->get( 'clicks' );
	}

	public function get_impressions(): int {
		return $this->get( 'impressions' );
	}

	public function get_ctr(): float {
		return $this->get( 'ctr' );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_position( float $position, $loaded_from_db = false ): void {
		$this->set( 'position', $position, $loaded_from_db );
	}

	public function set_clicks( int $clicks, $loaded_from_db = false ): void {
		$this->set( 'clicks', $clicks, $loaded_from_db );
	}

	public function set_impressions( int $impressions, $loaded_from_db = false ): void {
		$this->set( 'impressions', $impressions, $loaded_from_db );
	}

	public function set_ctr( float $ctr, $loaded_from_db = false ): void {
		$this->set( 'ctr', $ctr, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GSC_POSITIONS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'query_id', 'url_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'query_id' => '%d',
			'url_id'   => '%d',
			'domain_id'   => '%d',
			'updated'  => '%s',
			'position' => '%d',
			'clicks' => '%d',
			'impressions' => '%d',
			'ctr' => '%d',
		);
	}
}
