<?php

class Urlslab_Redirect_Row extends Urlslab_Data {
	public const MATCH_TYPE_EXACT = 'E';
	public const MATCH_TYPE_SUBSTRING = 'S';
	public const MATCH_TYPE_REGEXP = 'R';

	public const LOGIN_STATUS_LOGIN_REQUIRED = 'Y';
	public const LOGIN_STATUS_NOT_LOGGED_IN = 'N';
	public const LOGIN_STATUS_ANY = 'A';

	public const NOT_FOUND_STATUS_NOT_FOUND = 'Y';
	public const NOT_FOUND_STATUS_FOUND = 'N';
	public const NOT_FOUND_STATUS_ANY = 'A';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $redirect = array(), $loaded_from_db = true ) {
		$this->set_match_type( $redirect['match_type'] ?? self::MATCH_TYPE_SUBSTRING, $loaded_from_db );
		$this->set_match_url( $redirect['match_url'] ?? '', $loaded_from_db );
		$this->set_replace_url( $redirect['replace_url'] ?? '', $loaded_from_db );
		$this->set_is_logged( empty( $redirect['is_logged'] ) ? self::LOGIN_STATUS_ANY : $redirect['is_logged'], $loaded_from_db );
		$this->set_capabilities( $redirect['capabilities'] ?? '', $loaded_from_db );
		$this->set_roles( $redirect['roles'] ?? '', $loaded_from_db );
		$this->set_browser( $redirect['browser'] ?? '', $loaded_from_db );
		$this->set_cookie( $redirect['cookie'] ?? '', $loaded_from_db );
		$this->set_headers( $redirect['headers'] ?? '', $loaded_from_db );
		$this->set_params( $redirect['params'] ?? '', $loaded_from_db );
		$this->set_ip( $redirect['ip'] ?? '', $loaded_from_db );
		$this->set_if_not_found( empty( $redirect['if_not_found'] ) ? self::NOT_FOUND_STATUS_ANY : $redirect['if_not_found'], $loaded_from_db );
		$this->set_cnt( $redirect['cnt'] ?? 0, $loaded_from_db );
		$this->set_redirect_code( (int) ( $redirect['redirect_code'] ?? 301 ), $loaded_from_db );
		$this->set_redirect_id( $redirect['redirect_id'] ?? 0, $loaded_from_db );
		$this->set_labels( $redirect['labels'] ?? '', $loaded_from_db );
		$this->set_created( $redirect['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_row_hash( $redirect['row_hash'] ?? 0, $loaded_from_db );
	}

	public function get_redirect_id(): int {
		return $this->get( 'redirect_id' );
	}

	public function set_redirect_id( int $redirect_id, $loaded_from_db = false ): void {
		$this->set( 'redirect_id', $redirect_id, $loaded_from_db );
	}

	public function get_row_hash(): int {
		return $this->get( 'row_hash' );
	}

	public function set_row_hash( int $row_hash, $loaded_from_db = false ): void {
		if ( ! $row_hash ) {
			$row_hash       = crc32( $this->get_match_type() . '|' . $this->get_match_url() . '|' . $this->get_is_logged() . '|' . $this->get_capabilities() . '|' . $this->get_roles() . '|' . $this->get_browser() . '|' . $this->get_cookie() . '|' . $this->get_headers() . '|' . $this->get_params() . '|' . $this->get_ip() . '|' . $this->get_if_not_found() );
			$loaded_from_db = false;
		}
		$this->set( 'row_hash', $row_hash, $loaded_from_db );
	}

	public function get_match_type(): string {
		return $this->get( 'match_type' );
	}

	public function set_match_type( string $match_type, $loaded_from_db = false ): void {
		$this->set( 'match_type', $match_type, $loaded_from_db );
	}

	public function get_match_url(): string {
		return $this->get( 'match_url' );
	}

	public function set_match_url( string $match_url, $loaded_from_db = false ): void {
		$this->set( 'match_url', $match_url, $loaded_from_db );
	}

	public function get_replace_url(): string {
		return $this->get( 'replace_url' );
	}

	public function set_replace_url( string $replace_url, $loaded_from_db = false ): void {
		$this->set( 'replace_url', $replace_url, $loaded_from_db );
	}

	public function get_is_logged(): string {
		return $this->get( 'is_logged' );
	}

	public function set_is_logged( string $is_logged, $loaded_from_db = false ): void {
		$this->set( 'is_logged', $is_logged, $loaded_from_db );
	}

	public function get_capabilities(): string {
		return $this->get( 'capabilities' );
	}

	public function get_roles(): string {
		return $this->get( 'roles' );
	}

	public function set_capabilities( string $capabilities, $loaded_from_db = false ): void {
		$this->set( 'capabilities', $capabilities, $loaded_from_db );
	}

	public function set_roles( string $roles, $loaded_from_db = false ): void {
		$this->set( 'roles', $roles, $loaded_from_db );
	}

	public function get_cookie(): string {
		return $this->get( 'cookie' );
	}

	public function set_cookie( string $cookie, $loaded_from_db = false ): void {
		$this->set( 'cookie', $cookie, $loaded_from_db );
	}

	public function get_browser(): string {
		return $this->get( 'browser' );
	}

	public function set_browser( string $browser, $loaded_from_db = false ): void {
		$this->set( 'browser', $browser, $loaded_from_db );
	}

	public function get_headers(): string {
		return $this->get( 'headers' );
	}

	public function set_headers( string $headers, $loaded_from_db = false ): void {
		$this->set( 'headers', $headers, $loaded_from_db );
	}

	public function get_params(): string {
		return $this->get( 'params' );
	}

	public function set_params( string $params, $loaded_from_db = false ): void {
		$this->set( 'params', $params, $loaded_from_db );
	}

	public function get_if_not_found(): string {
		return $this->get( 'if_not_found' );
	}

	public function set_if_not_found( string $if_not_found, $loaded_from_db = false ): void {
		$this->set( 'if_not_found', $if_not_found, $loaded_from_db );
	}

	public function get_cnt(): int {
		return $this->get( 'cnt' );
	}

	public function set_cnt( int $cnt, $loaded_from_db = false ): void {
		$this->set( 'cnt', $cnt, $loaded_from_db );
	}

	public function get_redirect_code(): int {
		return $this->get( 'redirect_code' );
	}

	public function set_redirect_code( int $redirect_code, $loaded_from_db = false ): void {
		$this->set( 'redirect_code', $redirect_code, $loaded_from_db );
	}

	public function get_ip(): string {
		return $this->get( 'ip' );
	}

	public function set_ip( string $ip, $loaded_from_db = false ): void {
		$this->set( 'ip', $ip, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_created( string $created, $loaded_from_db = false ): void {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_REDIRECTS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'redirect_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'redirect_id'   => '%d',
			'row_hash'      => '%d',
			'match_type'    => '%s',
			'match_url'     => '%s',
			'replace_url'   => '%s',
			'is_logged'     => '%s',
			'capabilities'  => '%s',
			'roles'         => '%s',
			'cookie'        => '%s',
			'browser'       => '%s',
			'headers'       => '%s',
			'params'        => '%s',
			'ip'            => '%s',
			'if_not_found'  => '%s',
			'cnt'           => '%d',
			'redirect_code' => '%d',
			'labels' => '%s',
			'created' => '%s',
		);
	}

	public function increase_cnt() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "UPDATE {$this->get_table_name()} SET cnt = cnt + 1 WHERE redirect_id = %d", $this->get_redirect_id() ) ); // phpcs:ignore
	}

	protected function before_insert() {
		$this->set_row_hash( 0 );    //refresh hash
		parent::before_insert();
	}
}
