<?php

class Urlslab_Data_Cache_Rule extends Urlslab_Data {
	public const MATCH_TYPE_ALL_PAGES = 'A';
	public const MATCH_TYPE_EXACT = 'E';
	public const MATCH_TYPE_SUBSTRING = 'S';
	public const MATCH_TYPE_REGEXP = 'R';

	public const ACTIVE_YES = 'Y';
	public const ACTIVE_NO = 'N';
	const ANY = 'A';
	const YES = 'Y';
	const NO = 'N';

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
		$this->set_post_types( $cache_rule['post_types'] ?? '', $loaded_from_db );
		$this->set_is_single( $cache_rule['is_single'] ?? self::ANY, $loaded_from_db );
		$this->set_is_singular( $cache_rule['is_singular'] ?? self::ANY, $loaded_from_db );
		$this->set_is_attachment( $cache_rule['is_attachment'] ?? self::ANY, $loaded_from_db );
		$this->set_is_page( $cache_rule['is_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_home( $cache_rule['is_home'] ?? self::ANY, $loaded_from_db );
		$this->set_is_front_page( $cache_rule['is_front_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_category( $cache_rule['is_category'] ?? self::ANY, $loaded_from_db );
		$this->set_is_search( $cache_rule['is_search'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tag( $cache_rule['is_tag'] ?? self::ANY, $loaded_from_db );
		$this->set_is_author( $cache_rule['is_author'] ?? self::ANY, $loaded_from_db );
		$this->set_is_archive( $cache_rule['is_archive'] ?? self::ANY, $loaded_from_db );
		$this->set_is_sticky( $cache_rule['is_sticky'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tax( $cache_rule['is_tax'] ?? self::ANY, $loaded_from_db );
		$this->set_is_feed( $cache_rule['is_feed'] ?? self::ANY, $loaded_from_db );
		$this->set_is_paged( $cache_rule['is_paged'] ?? self::ANY, $loaded_from_db );
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

	public function get_post_types(): string {
		return $this->get( 'post_types' );
	}

	public function set_post_types( string $post_types, bool $loaded_from_db = false ): void {
		$this->set( 'post_types', $post_types, $loaded_from_db );
	}

	public function get_is_single(): string {
		return $this->get( 'is_single' );
	}

	public function set_is_single( string $is_single, bool $loaded_from_db = false ): void {
		$this->set( 'is_single', $is_single, $loaded_from_db );
	}

	public function get_is_singular(): string {
		return $this->get( 'is_singular' );
	}

	public function set_is_singular( string $is_singular, bool $loaded_from_db = false ): void {
		$this->set( 'is_singular', $is_singular, $loaded_from_db );
	}

	public function get_is_attachment(): string {
		return $this->get( 'is_attachment' );
	}

	public function set_is_attachment( string $is_attachment, bool $loaded_from_db = false ): void {
		$this->set( 'is_attachment', $is_attachment, $loaded_from_db );
	}

	public function get_is_page(): string {
		return $this->get( 'is_page' );
	}

	public function set_is_page( string $is_page, bool $loaded_from_db = false ): void {
		$this->set( 'is_page', $is_page, $loaded_from_db );
	}

	public function get_is_home(): string {
		return $this->get( 'is_home' );
	}

	public function set_is_home( string $is_home, bool $loaded_from_db = false ): void {
		$this->set( 'is_home', $is_home, $loaded_from_db );
	}

	public function get_is_front_page(): string {
		return $this->get( 'is_front_page' );
	}

	public function set_is_front_page( string $is_front_page, bool $loaded_from_db = false ): void {
		$this->set( 'is_front_page', $is_front_page, $loaded_from_db );
	}

	public function get_is_category(): string {
		return $this->get( 'is_category' );
	}

	public function set_is_category( string $is_category, bool $loaded_from_db = false ): void {
		$this->set( 'is_category', $is_category, $loaded_from_db );
	}

	public function get_is_search(): string {
		return $this->get( 'is_search' );
	}

	public function set_is_search( string $is_search, bool $loaded_from_db = false ): void {
		$this->set( 'is_search', $is_search, $loaded_from_db );
	}

	public function get_is_tag(): string {
		return $this->get( 'is_tag' );
	}

	public function set_is_tag( string $is_tag, bool $loaded_from_db = false ): void {
		$this->set( 'is_tag', $is_tag, $loaded_from_db );
	}

	public function get_is_author(): string {
		return $this->get( 'is_author' );
	}

	public function set_is_author( string $is_author, bool $loaded_from_db = false ): void {
		$this->set( 'is_author', $is_author, $loaded_from_db );
	}

	public function get_is_archive(): string {
		return $this->get( 'is_archive' );
	}

	public function set_is_archive( string $is_archive, bool $loaded_from_db = false ): void {
		$this->set( 'is_archive', $is_archive, $loaded_from_db );
	}

	public function get_is_sticky(): string {
		return $this->get( 'is_sticky' );
	}

	public function set_is_sticky( string $is_sticky, bool $loaded_from_db = false ): void {
		$this->set( 'is_sticky', $is_sticky, $loaded_from_db );
	}

	public function get_is_tax(): string {
		return $this->get( 'is_tax' );
	}

	public function set_is_tax( string $is_tax, bool $loaded_from_db = false ): void {
		$this->set( 'is_tax', $is_tax, $loaded_from_db );
	}

	public function get_is_feed(): string {
		return $this->get( 'is_feed' );
	}

	public function set_is_feed( string $is_feed, bool $loaded_from_db = false ): void {
		$this->set( 'is_feed', $is_feed, $loaded_from_db );
	}

	public function get_is_paged(): string {
		return $this->get( 'is_paged' );
	}

	public function set_is_paged( string $is_paged, bool $loaded_from_db = false ): void {
		$this->set( 'is_paged', $is_paged, $loaded_from_db );
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
			'rule_id'       => '%d',
			'match_type'    => '%s',
			'match_url'     => '%s',
			'is_active'     => '%s',
			'cookie'        => '%s',
			'browser'       => '%s',
			'headers'       => '%s',
			'params'        => '%s',
			'ip'            => '%s',
			'rule_order'    => '%d',
			'valid_from'    => '%d',
			'cache_ttl'     => '%d',
			'labels'        => '%s',
			'post_types'    => '%s',
			'is_single'     => '%s',
			'is_singular'   => '%s',
			'is_attachment' => '%s',
			'is_page'       => '%s',
			'is_home'       => '%s',
			'is_front_page' => '%s',
			'is_category'   => '%s',
			'is_search'     => '%s',
			'is_tag'        => '%s',
			'is_author'     => '%s',
			'is_archive'    => '%s',
			'is_sticky'     => '%s',
			'is_tax'        => '%s',
			'is_feed'       => '%s',
			'is_paged'      => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'match_type':
				return 'menu';
		}

		if ( str_starts_with( $column, 'is_' ) ) {
			return 'menu';
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_menu_column_items( string $column ): array {
		switch ( $column ) {
			case 'match_type':
				return array(
					self::MATCH_TYPE_ALL_PAGES => __( 'All Pages', 'wp-urlslab' ),
					self::MATCH_TYPE_EXACT     => __( 'Exact Match', 'wp-urlslab' ),
					self::MATCH_TYPE_SUBSTRING => __( 'Contains', 'wp-urlslab' ),
					self::MATCH_TYPE_REGEXP    => __( 'Regular Expression', 'wp-urlslab' ),
				);
		}

		if ( str_starts_with( $column, 'is_' ) ) {
			return array(
				self::ANY => __( 'Any', 'wp-urlslab' ),
				self::YES => __( 'Yes', 'wp-urlslab' ),
				self::NO  => __( "Don't check", 'wp-urlslab' ),
			);
		}

		return parent::get_menu_column_items( $column );
	}
}
