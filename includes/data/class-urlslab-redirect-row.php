<?php

class Urlslab_Redirect_Row extends Urlslab_Data {

	const MATCH_TYPE_EXACT = 'E';
	const MATCH_TYPE_SUBSTRING = 'S';
	const MATCH_TYPE_REGEXP = 'R';

	const LOGIN_STATUS_LOGIN_REQUIRED = 'Y';
	const LOGIN_STATUS_NOT_LOGGED = 'N';
	const LOGIN_STATUS_ANY = '';


	const NOT_FOUND_STATUS_NOT_FOUND = 'Y';
	const NOT_FOUND_STATUS_FOUND = 'N';
	const NOT_FOUND_STATUS_ANY = '';

	/**
	 * @param array $redirect
	 */
	public function __construct( array $redirect = array(), $loaded_from_db = true ) {
		$this->set_match_type( $redirect['match_type'] ?? self::MATCH_TYPE_EXACT, $loaded_from_db );
		$this->set_match_url( $redirect['match_url'] ?? '', $loaded_from_db );
		$this->set_replace_url( $redirect['replace_url'] ?? '', $loaded_from_db );
		$this->set_is_logged( $redirect['is_logged'] ?? self::LOGIN_STATUS_ANY, $loaded_from_db );
		$this->set_capabilities( $redirect['capabilities'] ?? '', $loaded_from_db );
		$this->set_roles( $redirect['roles'] ?? '', $loaded_from_db );
		$this->set_browser( $redirect['browser'] ?? '', $loaded_from_db );
		$this->set_cookie( $redirect['cookie'] ?? '', $loaded_from_db );
		$this->set_headers( $redirect['headers'] ?? '', $loaded_from_db );
		$this->set_params( $redirect['params'] ?? '', $loaded_from_db );
		$this->set_if_not_found( $redirect['if_not_found'] ?? self::NOT_FOUND_STATUS_ANY, $loaded_from_db );
		$this->set_cnt( $redirect['cnt'] ?? 0, $loaded_from_db );
		$this->set_redirect_code( $redirect['redirect_code'] ?? 301, $loaded_from_db );
		$this->set_redirect_id( $redirect['redirect_id'] ?? 0, $loaded_from_db );
	}

	public function get_redirect_id(): int {
		return $this->get( 'redirect_id' );
	}

	public function set_redirect_id( int $redirect_id, $loaded_from_db = true ): void {
		$this->set( 'redirect_id', $redirect_id, $loaded_from_db );
	}

	public function get_match_type(): string {
		return $this->get( 'match_type' );
	}

	public function set_match_type( string $match_type, $loaded_from_db = true ): void {
		$this->set( 'match_type', $match_type, $loaded_from_db );
	}

	public function get_match_url(): string {
		return $this->get( 'match_url' );
	}

	public function set_match_url( string $match_url, $loaded_from_db = true ): void {
		$this->set( 'match_url', $match_url, $loaded_from_db );
	}

	public function get_replace_url(): string {
		return $this->get( 'replace_url' );
	}

	public function set_replace_url( string $replace_url, $loaded_from_db = true ): void {
		$this->set( 'replace_url', $replace_url, $loaded_from_db );
	}

	public function get_is_logged(): string {
		return $this->get( 'is_logged' );
	}

	public function set_is_logged( string $is_logged, $loaded_from_db = true ): void {
		$this->set( 'is_logged', $is_logged, $loaded_from_db );
	}

	public function get_capabilities(): string {
		return $this->get( 'capabilities' );
	}

	public function get_roles(): string {
		return $this->get( 'roles' );
	}

	public function set_capabilities( string $capabilities, $loaded_from_db = true ): void {
		$this->set( 'capabilities', $capabilities, $loaded_from_db );
	}

	public function set_roles( string $roles, $loaded_from_db = true ): void {
		$this->set( 'roles', $roles, $loaded_from_db );
	}

	public function get_cookie(): string {
		return $this->get( 'cookie' );
	}

	public function set_cookie( string $cookie, $loaded_from_db = true ): void {
		$this->set( 'cookie', $cookie, $loaded_from_db );
	}

	public function get_browser(): string {
		return $this->get( 'browser' );
	}

	public function set_browser( string $browser, $loaded_from_db = true ): void {
		$this->set( 'browser', $browser, $loaded_from_db );
	}

	public function get_headers(): string {
		return $this->get( 'headers' );
	}

	public function set_headers( string $headers, $loaded_from_db = true ): void {
		$this->set( 'headers', $headers, $loaded_from_db );
	}

	public function get_params(): string {
		return $this->get( 'params' );
	}

	public function set_params( string $params, $loaded_from_db = true ): void {
		$this->set( 'params', $params, $loaded_from_db );
	}

	public function get_if_not_found(): string {
		return $this->get( 'if_not_found' );
	}

	public function set_if_not_found( string $if_not_found, $loaded_from_db = true ): void {
		$this->set( 'if_not_found', $if_not_found, $loaded_from_db );
	}

	public function get_cnt(): int {
		return $this->get( 'cnt' );
	}

	public function set_cnt( int $cnt, $loaded_from_db = true ): void {
		$this->set( 'cnt', $cnt, $loaded_from_db );
	}

	public function get_redirect_code(): int {
		return $this->get( 'redirect_code' );
	}

	public function set_redirect_code( int $redirect_code, $loaded_from_db = true ): void {
		$this->set( 'redirect_code', $redirect_code, $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_REDIRECTS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'redirect_id' );
	}

	function has_autoincrement_primary_column(): bool {
		return true;
	}

	function get_columns(): array {
		return array(
			'redirect_id'   => '%d',
			'match_type'    => '%s',
			'match_url'     => '%s',
			'replace_url'   => '%s',
			'is_logged'     => '%s',
			'capabilities'  => '%s',
			'roles'  => '%s',
			'cookie'        => '%s',
			'browser'       => '%s',
			'headers'       => '%s',
			'params'        => '%s',
			'if_not_found'  => '%s',
			'cnt'           => '%d',
			'redirect_code' => '%d',
		);
	}

	public function increase_cnt() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "UPDATE {$this->get_table_name()} SET cnt = cnt + 1 WHERE redirect_id = %d", $this->get_redirect_id() ) );// phpcs:ignore
	}

}
