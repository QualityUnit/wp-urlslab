<?php

class Urlslab_Cache_Rule_Row extends Urlslab_Data {
	public const MATCH_TYPE_ALL_PAGES = 'A';
	public const MATCH_TYPE_EXACT = 'E';
	public const MATCH_TYPE_SUBSTRING = 'S';
	public const MATCH_TYPE_REGEXP = 'R';

	public const ACTIVE_YES = 'Y';
	public const ACTIVE_NO = 'N';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $cache_rule = array(), $loaded_from_db = true ) {
		$this->set_rule_id( $cache_rule['rule_id'] ?? 0, $loaded_from_db );
		$this->set_match_type( $cache_rule['match_type'] ?? self::MATCH_TYPE_SUBSTRING, $loaded_from_db );
		$this->set_match_url( $cache_rule['match_url'] ?? '', $loaded_from_db );
		$this->set_is_active( empty( $cache_rule['is_active'] ) ? self::ACTIVE_NO : $cache_rule['is_active'], $loaded_from_db );
		$this->set_browser( $cache_rule['browser'] ?? '', $loaded_from_db );
		$this->set_cookie( $cache_rule['cookie'] ?? '', $loaded_from_db );
		$this->set_headers( $cache_rule['headers'] ?? '', $loaded_from_db );
		$this->set_params( $cache_rule['params'] ?? '', $loaded_from_db );
		$this->set_ip( $cache_rule['ip'] ?? '', $loaded_from_db );
		$this->set_valid_from( $cache_rule['valid_from'] ?? time(), $loaded_from_db );
		$this->set_rule_order( $cache_rule['rule_order'] ?? 1, $loaded_from_db );
		$this->set_cache_ttl( $cache_rule['cache_ttl'] ?? 900, $loaded_from_db );
		$this->set_labels( $cache_rule['labels'] ?? '', $loaded_from_db );
	}

	public function as_array(): array {
		$values              = parent::as_array();
		$values['is_active'] = self::ACTIVE_YES === $this->get_is_active();

		return $values;
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( 'is_active' === $name ) {
			if ( is_bool( $value ) && $value || self::ACTIVE_YES === $value ) {
				$value = self::ACTIVE_YES;
			} else {
				$value = self::ACTIVE_NO;
			}
		}

		return parent::set( $name, $value, $loaded_from_db );
	}

	public function get_rule_id(): int {
		return $this->get( 'rule_id' );
	}

	public function set_rule_id( int $rule_id, bool $loaded_from_db = false ): void {
		$this->set( 'rule_id', $rule_id, $loaded_from_db );
	}

	public function get_match_type(): string {
		return $this->get( 'match_type' );
	}

	public function set_match_type( string $match_type, bool $loaded_from_db = false ): void {
		$this->set( 'match_type', $match_type, $loaded_from_db );
	}

	public function get_match_url(): string {
		return $this->get( 'match_url' );
	}

	public function set_match_url( string $match_url, bool $loaded_from_db = false ): void {
		$this->set( 'match_url', $match_url, $loaded_from_db );
	}

	public function get_is_active(): string {
		return $this->get( 'is_active' );
	}

	public function set_is_active( string $is_active, bool $loaded_from_db = false ): void {
		$this->set( 'is_active', $is_active, $loaded_from_db );
	}

	public function get_browser(): string {
		return $this->get( 'browser' );
	}

	public function set_browser( string $browser, bool $loaded_from_db = false ): void {
		$this->set( 'browser', $browser, $loaded_from_db );
	}

	public function get_cookie(): string {
		return $this->get( 'cookie' );
	}

	public function set_cookie( string $cookie, bool $loaded_from_db = false ): void {
		$this->set( 'cookie', $cookie, $loaded_from_db );
	}

	public function get_headers(): string {
		return $this->get( 'headers' );
	}

	public function set_headers( string $headers, bool $loaded_from_db = false ): void {
		$this->set( 'headers', $headers, $loaded_from_db );
	}

	public function get_params(): string {
		return $this->get( 'params' );
	}

	public function set_params( string $params, bool $loaded_from_db = false ): void {
		$this->set( 'params', $params, $loaded_from_db );
	}

	public function get_ip(): string {
		return $this->get( 'ip' );
	}

	public function set_ip( string $ip, bool $loaded_from_db = false ): void {
		$this->set( 'ip', $ip, $loaded_from_db );
	}

	public function get_valid_from(): int {
		return $this->get( 'valid_from' );
	}

	public function set_valid_from( int $valid_from, bool $loaded_from_db = false ): void {
		$this->set( 'valid_from', $valid_from, $loaded_from_db );
	}

	public function get_cache_ttl(): int {
		return $this->get( 'cache_ttl' );
	}

	public function set_cache_ttl( int $cache_ttl, bool $loaded_from_db = false ): void {
		$this->set( 'cache_ttl', $cache_ttl, $loaded_from_db );
	}

	public function get_rule_order(): int {
		return $this->get( 'rule_order' );
	}

	public function set_rule_order( int $rule_order, bool $loaded_from_db = false ): void {
		$this->set( 'rule_order', $rule_order, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_labels( string $labels, bool $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_CACHE_RULES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'rule_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'rule_id'    => '%d',
			'match_type' => '%s',
			'match_url'  => '%s',
			'is_active'  => '%s',
			'cookie'     => '%s',
			'browser'    => '%s',
			'headers'    => '%s',
			'params'     => '%s',
			'ip'         => '%s',
			'rule_order' => '%d',
			'valid_from' => '%d',
			'cache_ttl' => '%d',
			'labels'     => '%s',
		);
	}

}
