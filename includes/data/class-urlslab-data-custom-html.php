<?php

class Urlslab_Data_Custom_Html extends Urlslab_Data {
	public const MATCH_TYPE_ALL = 'A';
	public const MATCH_TYPE_EXACT = 'E';
	public const MATCH_TYPE_SUBSTRING = 'S';
	public const MATCH_TYPE_REGEXP = 'R';

	public const LOGIN_STATUS_LOGIN_REQUIRED = 'Y';
	public const LOGIN_STATUS_NOT_LOGGED_IN = 'N';
	public const LOGIN_STATUS_ANY = 'A';

	public const ACTIVE_YES = 'Y';
	public const ACTIVE_NO = 'N';
	const ANY = 'A';
	const YES = 'Y';
	const NO = 'N';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $custom_html = array(), $loaded_from_db = true ) {
		$this->set_rule_id( $custom_html['rule_id'] ?? 0, $loaded_from_db );
		$this->set_name( $custom_html['name'] ?? '', $loaded_from_db );
		$this->set_match_type( $custom_html['match_type'] ?? self::MATCH_TYPE_ALL, $loaded_from_db );
		$this->set_match_url( $custom_html['match_url'] ?? '', $loaded_from_db );
		$this->set_match_browser( $custom_html['match_browser'] ?? '', $loaded_from_db );
		$this->set_match_cookie( $custom_html['match_cookie'] ?? '', $loaded_from_db );
		$this->set_match_headers( $custom_html['match_headers'] ?? '', $loaded_from_db );
		$this->set_match_params( $custom_html['match_params'] ?? '', $loaded_from_db );
		$this->set_match_ip( $custom_html['match_ip'] ?? '', $loaded_from_db );
		$this->set_is_logged( $custom_html['is_logged'] ?? self::LOGIN_STATUS_ANY, $loaded_from_db );
		$this->set_match_capabilities( $custom_html['match_capabilities'] ?? '', $loaded_from_db );
		$this->set_match_roles( $custom_html['match_roles'] ?? '', $loaded_from_db );
		$this->set_match_posttypes( $custom_html['match_posttypes'] ?? '', $loaded_from_db );
		$this->set_rule_order( $custom_html['rule_order'] ?? 10, $loaded_from_db );
		$this->set_labels( $custom_html['labels'] ?? '', $loaded_from_db );
		$this->set_is_active( $custom_html['is_active'] ?? self::ACTIVE_YES, $loaded_from_db );
		$this->set_add_http_headers( $custom_html['add_http_headers'] ?? '', $loaded_from_db );
		$this->set_add_start_headers( $custom_html['add_start_headers'] ?? '', $loaded_from_db );
		$this->set_add_end_headers( $custom_html['add_end_headers'] ?? '', $loaded_from_db );
		$this->set_add_start_body( $custom_html['add_start_body'] ?? '', $loaded_from_db );
		$this->set_add_end_body( $custom_html['add_end_body'] ?? '', $loaded_from_db );
		$this->set_is_single( $custom_html['is_single'] ?? self::ANY, $loaded_from_db );
		$this->set_is_singular( $custom_html['is_singular'] ?? self::ANY, $loaded_from_db );
		$this->set_is_attachment( $custom_html['is_attachment'] ?? self::ANY, $loaded_from_db );
		$this->set_is_page( $custom_html['is_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_home( $custom_html['is_home'] ?? self::ANY, $loaded_from_db );
		$this->set_is_front_page( $custom_html['is_front_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_category( $custom_html['is_category'] ?? self::ANY, $loaded_from_db );
		$this->set_is_search( $custom_html['is_search'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tag( $custom_html['is_tag'] ?? self::ANY, $loaded_from_db );
		$this->set_is_author( $custom_html['is_author'] ?? self::ANY, $loaded_from_db );
		$this->set_is_archive( $custom_html['is_archive'] ?? self::ANY, $loaded_from_db );
		$this->set_is_sticky( $custom_html['is_sticky'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tax( $custom_html['is_tax'] ?? self::ANY, $loaded_from_db );
		$this->set_is_feed( $custom_html['is_feed'] ?? self::ANY, $loaded_from_db );
		$this->set_is_paged( $custom_html['is_paged'] ?? self::ANY, $loaded_from_db );
	}

	public function set_rule_order( int $rule_order, $loaded_from_db = false ): void {
		$this->set( 'rule_order', $rule_order, $loaded_from_db );
	}

	public function get_rule_order(): int {
		return $this->get( 'rule_order' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_is_active( $is_active, $loaded_from_db = false ): void {
		$this->set( 'is_active', $is_active, $loaded_from_db );
	}

	public function get_is_active(): string {
		return $this->get( 'is_active' );
	}

	public function set_add_http_headers( string $add_http_headers, $loaded_from_db = false ): void {
		$this->set( 'add_http_headers', $add_http_headers, $loaded_from_db );
	}

	public function get_add_http_headers(): string {
		return $this->get( 'add_http_headers' );
	}

	public function get_rule_id(): int {
		return $this->get( 'rule_id' );
	}

	public function set_rule_id( int $rule_id, $loaded_from_db = false ): void {
		$this->set( 'rule_id', $rule_id, $loaded_from_db );
	}

	public function get_name(): string {
		return $this->get( 'name' );
	}

	public function set_name( string $name, $loaded_from_db = false ): void {
		$this->set( 'name', $name, $loaded_from_db );
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

	public function get_match_browser(): string {
		return $this->get( 'match_browser' );
	}

	public function set_match_browser( string $match_browser, $loaded_from_db = false ): void {
		$this->set( 'match_browser', $match_browser, $loaded_from_db );
	}

	public function get_match_cookie(): string {
		return $this->get( 'match_cookie' );
	}

	public function set_match_cookie( string $match_cookie, $loaded_from_db = false ): void {
		$this->set( 'match_cookie', $match_cookie, $loaded_from_db );
	}

	public function get_match_headers(): string {
		return $this->get( 'match_headers' );
	}

	public function set_match_headers( string $match_headers, $loaded_from_db = false ): void {
		$this->set( 'match_headers', $match_headers, $loaded_from_db );
	}

	public function get_match_params(): string {
		return $this->get( 'match_params' );
	}

	public function set_match_params( string $match_params, $loaded_from_db = false ): void {
		$this->set( 'match_params', $match_params, $loaded_from_db );
	}

	public function get_match_ip(): string {
		return $this->get( 'match_ip' );
	}

	public function set_match_ip( string $match_ip, $loaded_from_db = false ): void {
		$this->set( 'match_ip', $match_ip, $loaded_from_db );
	}

	public function get_is_logged(): string {
		return $this->get( 'is_logged' );
	}

	public function set_is_logged( string $is_logged, $loaded_from_db = false ): void {
		$this->set( 'is_logged', $is_logged, $loaded_from_db );
	}

	public function get_match_capabilities(): string {
		return $this->get( 'match_capabilities' );
	}

	public function set_match_capabilities( string $match_capabilities, $loaded_from_db = false ): void {
		$this->set( 'match_capabilities', $match_capabilities, $loaded_from_db );
	}

	public function get_match_roles(): string {
		return $this->get( 'match_roles' );
	}

	public function set_match_roles( string $match_roles, $loaded_from_db = false ): void {
		$this->set( 'match_roles', $match_roles, $loaded_from_db );
	}

	public function get_match_posttypes(): string {
		return $this->get( 'match_posttypes' );
	}

	public function set_match_posttypes( string $match_posttypes, $loaded_from_db = false ): void {
		$this->set( 'match_posttypes', $match_posttypes, $loaded_from_db );
	}

	public function get_add_start_headers(): string {
		return $this->get( 'add_start_headers' );
	}

	public function set_add_start_headers( string $add_start_headers, $loaded_from_db = false ): void {
		$this->set( 'add_start_headers', $add_start_headers, $loaded_from_db );
	}

	public function get_add_end_headers(): string {
		return $this->get( 'add_end_headers' );
	}

	public function set_add_end_headers( string $add_end_headers, $loaded_from_db = false ): void {
		$this->set( 'add_end_headers', $add_end_headers, $loaded_from_db );
	}

	public function get_add_start_body(): string {
		return $this->get( 'add_start_body' );
	}

	public function set_add_start_body( string $add_start_body, $loaded_from_db = false ): void {
		$this->set( 'add_start_body', $add_start_body, $loaded_from_db );
	}

	public function get_add_end_body(): string {
		return $this->get( 'add_end_body' );
	}

	public function set_add_end_body( string $add_end_body, $loaded_from_db = false ): void {
		$this->set( 'add_end_body', $add_end_body, $loaded_from_db );
	}

	public function get_is_single(): string {
		return $this->get( 'is_single' );
	}

	public function set_is_single( string $is_single, $loaded_from_db = false ): void {
		$this->set( 'is_single', $is_single, $loaded_from_db );
	}

	public function get_is_singular(): string {
		return $this->get( 'is_singular' );
	}

	public function set_is_singular( string $is_singular, $loaded_from_db = false ): void {
		$this->set( 'is_singular', $is_singular, $loaded_from_db );
	}

	public function get_is_attachment(): string {
		return $this->get( 'is_attachment' );
	}

	public function set_is_attachment( string $is_attachment, $loaded_from_db = false ): void {
		$this->set( 'is_attachment', $is_attachment, $loaded_from_db );
	}

	public function get_is_page(): string {
		return $this->get( 'is_page' );
	}

	public function set_is_page( string $is_page, $loaded_from_db = false ): void {
		$this->set( 'is_page', $is_page, $loaded_from_db );
	}

	public function get_is_home(): string {
		return $this->get( 'is_home' );
	}

	public function set_is_home( string $is_home, $loaded_from_db = false ): void {
		$this->set( 'is_home', $is_home, $loaded_from_db );
	}

	public function get_is_front_page(): string {
		return $this->get( 'is_front_page' );
	}

	public function set_is_front_page( string $is_front_page, $loaded_from_db = false ): void {
		$this->set( 'is_front_page', $is_front_page, $loaded_from_db );
	}

	public function get_is_category(): string {
		return $this->get( 'is_category' );
	}

	public function set_is_category( string $is_category, $loaded_from_db = false ): void {
		$this->set( 'is_category', $is_category, $loaded_from_db );
	}

	public function get_is_search(): string {
		return $this->get( 'is_search' );
	}

	public function set_is_search( string $is_search, $loaded_from_db = false ): void {
		$this->set( 'is_search', $is_search, $loaded_from_db );
	}

	public function get_is_tag(): string {
		return $this->get( 'is_tag' );
	}

	public function set_is_tag( string $is_tag, $loaded_from_db = false ): void {
		$this->set( 'is_tag', $is_tag, $loaded_from_db );
	}

	public function get_is_author(): string {
		return $this->get( 'is_author' );
	}

	public function set_is_author( string $is_author, $loaded_from_db = false ): void {
		$this->set( 'is_author', $is_author, $loaded_from_db );
	}

	public function get_is_archive(): string {
		return $this->get( 'is_archive' );
	}

	public function set_is_archive( string $is_archive, $loaded_from_db = false ): void {
		$this->set( 'is_archive', $is_archive, $loaded_from_db );
	}

	public function get_is_sticky(): string {
		return $this->get( 'is_sticky' );
	}

	public function set_is_sticky( string $is_sticky, $loaded_from_db = false ): void {
		$this->set( 'is_sticky', $is_sticky, $loaded_from_db );
	}

	public function get_is_tax(): string {
		return $this->get( 'is_tax' );
	}

	public function set_is_tax( string $is_tax, $loaded_from_db = false ): void {
		$this->set( 'is_tax', $is_tax, $loaded_from_db );
	}

	public function get_is_feed(): string {
		return $this->get( 'is_feed' );
	}

	public function set_is_feed( string $is_feed, $loaded_from_db = false ): void {
		$this->set( 'is_feed', $is_feed, $loaded_from_db );
	}

	public function get_is_paged(): string {
		return $this->get( 'is_paged' );
	}

	public function set_is_paged( string $is_paged, $loaded_from_db = false ): void {
		$this->set( 'is_paged', $is_paged, $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( 'is_active' === $name ) {
			if ( is_bool( $value ) && $value || self::ACTIVE_YES === $value || 'true' === $value ) {
				$value = self::ACTIVE_YES;
			} else {
				$value = self::ACTIVE_NO;
			}
		}

		return parent::set( $name, $value, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_CUSTOM_HTML_RULES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'rule_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'rule_id'            => '%d',
			'name'               => '%s',
			'match_type'         => '%s',
			'match_url'          => '%s',
			'match_browser'      => '%s',
			'match_cookie'       => '%s',
			'match_headers'      => '%s',
			'match_params'       => '%s',
			'match_ip'           => '%s',
			'is_logged'          => '%s',
			'match_capabilities' => '%s',
			'match_roles'        => '%s',
			'match_posttypes'    => '%s',
			'rule_order'         => '%d',
			'labels'             => '%s',
			'is_active'          => '%s',
			'add_http_headers'   => '%s',
			'add_start_headers'  => '%s',
			'add_end_headers'    => '%s',
			'add_start_body'     => '%s',
			'add_end_body'       => '%s',
			'is_single'          => '%s',
			'is_singular'        => '%s',
			'is_attachment'      => '%s',
			'is_page'            => '%s',
			'is_home'            => '%s',
			'is_front_page'      => '%s',
			'is_category'        => '%s',
			'is_search'          => '%s',
			'is_tag'             => '%s',
			'is_author'          => '%s',
			'is_archive'         => '%s',
			'is_sticky'          => '%s',
			'is_tax'             => '%s',
			'is_feed'            => '%s',
			'is_paged'           => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'match_type':
			case 'is_logged':
				return Urlslab_Data::COLUMN_TYPE_ENUM;
		}
		if ( str_starts_with( $column, 'is_' ) ) {
			return Urlslab_Data::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'match_type':
				return array(
					self::MATCH_TYPE_ALL       => __( 'All pages', 'urlslab' ),
					self::MATCH_TYPE_EXACT     => __( 'Exact Match', 'urlslab' ),
					self::MATCH_TYPE_SUBSTRING => __( 'Contains', 'urlslab' ),
					self::MATCH_TYPE_REGEXP    => __( 'Regular Expression', 'urlslab' ),
				);
			case 'is_logged':
				return array(
					self::LOGIN_STATUS_LOGIN_REQUIRED => __( 'Logged in', 'urlslab' ),
					self::LOGIN_STATUS_NOT_LOGGED_IN  => __( 'Not logged in', 'urlslab' ),
					self::LOGIN_STATUS_ANY            => __( 'Any', 'urlslab' ),
				);
		}
		if ( str_starts_with( $column, 'is_' ) ) {
			return array(
				self::YES => __( 'Yes', 'urlslab' ),
				self::NO  => __( 'No', 'urlslab' ),
				self::ANY => __( "Don't check", 'urlslab' ),
			);
		}

		return parent::get_enum_column_items( $column );
	}
}
