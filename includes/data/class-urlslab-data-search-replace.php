<?php

class Urlslab_Data_Search_Replace extends Urlslab_Data {
	public const TYPE_PLAIN_TEXT = 'T';
	public const TYPE_REGEXP = 'R';

	public const LOGIN_STATUS_LOGGED_IN = 'L';
	public const LOGIN_STATUS_LOGGED_OUT = 'O';
	public const LOGIN_STATUS_ALL = 'A';

	const ANY = 'A';
	const YES = 'Y';
	const NO = 'N';


	public function __construct( array $row_data = array(), $loaded_from_db = false ) {
		$this->set_id( $row_data['id'] ?? 0, $loaded_from_db );
		$this->set_str_search( $row_data['str_search'] ?? '', $loaded_from_db );
		$this->set_str_replace( $row_data['str_replace'] ?? '', $loaded_from_db );
		$this->set_search_type( $row_data['search_type'] ?? self::TYPE_PLAIN_TEXT, $loaded_from_db );
		$this->set_url_filter( $row_data['url_filter'] ?? '', $loaded_from_db );
		$this->set_labels( $row_data['labels'] ?? '', $loaded_from_db );
		$this->set_login_status( $row_data['login_status'] ?? self::LOGIN_STATUS_ALL, $loaded_from_db );
		$this->set_post_types( $row_data['post_types'] ?? '', $loaded_from_db );
		$this->set_is_single( $row_data['is_single'] ?? self::ANY, $loaded_from_db );
		$this->set_is_singular( $row_data['is_singular'] ?? self::ANY, $loaded_from_db );
		$this->set_is_attachment( $row_data['is_attachment'] ?? self::ANY, $loaded_from_db );
		$this->set_is_page( $row_data['is_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_home( $row_data['is_home'] ?? self::ANY, $loaded_from_db );
		$this->set_is_front_page( $row_data['is_front_page'] ?? self::ANY, $loaded_from_db );
		$this->set_is_category( $row_data['is_category'] ?? self::ANY, $loaded_from_db );
		$this->set_is_search( $row_data['is_search'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tag( $row_data['is_tag'] ?? self::ANY, $loaded_from_db );
		$this->set_is_author( $row_data['is_author'] ?? self::ANY, $loaded_from_db );
		$this->set_is_archive( $row_data['is_archive'] ?? self::ANY, $loaded_from_db );
		$this->set_is_sticky( $row_data['is_sticky'] ?? self::ANY, $loaded_from_db );
		$this->set_is_tax( $row_data['is_tax'] ?? self::ANY, $loaded_from_db );
		$this->set_is_feed( $row_data['is_feed'] ?? self::ANY, $loaded_from_db );
		$this->set_is_paged( $row_data['is_paged'] ?? self::ANY, $loaded_from_db );
	}

	public function get_id(): int {
		return $this->get( 'id' );
	}

	public function get_str_search(): string {
		return $this->get( 'str_search' );
	}

	public function get_str_replace(): string {
		return $this->get( 'str_replace' );
	}

	public function get_search_type(): string {
		return $this->get( 'search_type' );
	}

	public function get_url_filter(): string {
		return $this->get( 'url_filter' );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function get_login_status(): string {
		return $this->get( 'login_status' );
	}

	public function set_id( int $id, $loaded_from_db = false ): void {
		$this->set( 'id', $id, $loaded_from_db );
	}

	public function set_str_search( string $str_search, $loaded_from_db = false ): void {
		$this->set( 'str_search', $str_search, $loaded_from_db );
	}

	public function set_str_replace( string $str_replace, $loaded_from_db = false ): void {
		$this->set( 'str_replace', $str_replace, $loaded_from_db );
	}

	public function set_search_type( string $search_type, $loaded_from_db = false ): void {
		$this->set( 'search_type', $search_type, $loaded_from_db );
	}

	public function set_url_filter( string $url_filter, $loaded_from_db = false ): void {
		$this->set( 'url_filter', $url_filter, $loaded_from_db );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function set_login_status( string $login_status, $loaded_from_db = false ): void {
		$this->set( 'login_status', $login_status, $loaded_from_db );
	}

	public function get_post_types(): string {
		return $this->get( 'post_types' );
	}

	public function set_post_types( string $post_types, $loaded_from_db = false ): void {
		$this->set( 'post_types', $post_types, $loaded_from_db );
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

	public function get_table_name(): string {
		return URLSLAB_SEARCH_AND_REPLACE_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'id'            => '%d',
			'str_search'    => '%s',
			'str_replace'   => '%s',
			'search_type'   => '%s',
			'login_status'  => '%s',
			'url_filter'    => '%s',
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
			case 'search_type':
			case 'login_status':
				return 'menu';
		}
		if ( str_starts_with( $column, 'is_' ) ) {
			return 'menu';
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_menu_column_items( string $column ): array {
		switch ( $column ) {
			case 'search_type':
				return array(
					self::TYPE_PLAIN_TEXT => __( 'Plain Text', 'urlslab' ),
					self::TYPE_REGEXP     => __( 'Regular Expression', 'urlslab' ),
				);
			case 'login_status':
				return array(
					self::LOGIN_STATUS_ALL        => __( 'Any', 'urlslab' ),
					self::LOGIN_STATUS_LOGGED_IN  => __( 'Logged In', 'urlslab' ),
					self::LOGIN_STATUS_LOGGED_OUT => __( 'Not Logged In', 'urlslab' ),
				);
		}

		if ( str_starts_with( $column, 'is_' ) ) {
			return array(
				self::ANY => __( "Don't check", 'urlslab' ),
				self::YES => __( 'Yes', 'urlslab' ),
				self::NO  => __( 'No', 'urlslab' ),
			);
		}

		return parent::get_menu_column_items( $column );
	}
}
