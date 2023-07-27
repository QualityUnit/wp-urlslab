<?php

class Urlslab_Serp_Domain_Row extends Urlslab_Data {
	const TYPE_OTHER = 'X';
	const TYPE_MY_DOMAIN = 'M';
	const TYPE_COMPETITOR = 'C';
	const UNDEFINED = - 1;
	private static array $my_domains = array( self::UNDEFINED => '' );
	private static array $competitor_domains = array( self::UNDEFINED => '' );
	private static array $monitored_domains = array( self::UNDEFINED => '' );

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $domain = array(), $loaded_from_db = true ) {
		$this->set_domain_name( $domain['domain_name'] ?? '', $loaded_from_db );
		$this->set_domain_type( $domain['domain_type'] ?? self::TYPE_OTHER, $loaded_from_db );
		$this->set_domain_id( $domain['domain_id'] ?? $this->compute_domain_id(), $loaded_from_db );
	}

	public function get_domain_id(): int {
		return $this->get( 'domain_id' );
	}

	public function get_domain_name(): string {
		return $this->get( 'domain_name' );
	}

	public function get_domain_type(): string {
		return $this->get( 'domain_type' );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_domain_name( string $domain_name, $loaded_from_db = false ): void {
		$this->set( 'domain_name', $domain_name, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_domain_id( $this->compute_domain_id() );
		}
	}

	public function set_domain_type( string $domain_type, $loaded_from_db = false ): void {
		$this->set( 'domain_type', $domain_type, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_DOMAINS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'domain_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'domain_id'   => '%d',
			'domain_name' => '%s',
			'domain_type' => '%s',
		);
	}

	private function compute_domain_id() {
		if ( empty( $this->get_domain_name() ) ) {
			return 0;
		}
		try {
			$url = new Urlslab_Url( $this->get_domain_name(), true );

			return $url->get_domain_id();
		} catch ( Exception $e ) {
			return 0;
		}
	}

	private static function get_domains( $domain_type, $operator = '=' ): array {
		global $wpdb;
		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_SERP_DOMAINS_TABLE . ' WHERE domain_type ' . esc_sql( $operator ) . ' %s', $domain_type ), ARRAY_A ); // phpcs:ignore
		$domains = array();
		foreach ( $results as $result ) {
			$domains[ $result['domain_id'] ] = $result['domain_name'];
		}

		return $domains;
	}

	public static function get_my_domains(): array {
		if ( isset( self::$my_domains[ self::UNDEFINED ] ) ) {
			self::$my_domains = self::get_domains( self::TYPE_MY_DOMAIN );
		}

		return self::$my_domains;
	}

	public static function get_competitor_domains(): array {
		if ( isset( self::$competitor_domains[ self::UNDEFINED ] ) ) {
			self::$competitor_domains = self::get_domains( self::TYPE_COMPETITOR );
		}

		return self::$competitor_domains;
	}

	public static function get_monitored_domains(): array {
		if ( isset( self::$monitored_domains[ self::UNDEFINED ] ) ) {
			self::$monitored_domains = self::get_domains( self::TYPE_OTHER, '<>' );
		}

		return self::$monitored_domains;
	}
}
