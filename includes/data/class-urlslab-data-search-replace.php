<?php

class Urlslab_Data_Search_Replace extends Urlslab_Data {
	public const TYPE_PLAIN_TEXT = 'T';
	public const TYPE_REGEXP = 'R';

	public const LOGIN_STATUS_LOGGED_IN = 'L';
	public const LOGIN_STATUS_LOGGED_OUT = 'O';
	public const LOGIN_STATUS_ALL = 'A';

	public function __construct( array $row_data = array(), $loaded_from_db = false ) {
		$this->set_id( $row_data['id'] ?? 0, $loaded_from_db );
		$this->set_str_search( $row_data['str_search'] ?? '', $loaded_from_db );
		$this->set_str_replace( $row_data['str_replace'] ?? '', $loaded_from_db );
		$this->set_search_type( $row_data['search_type'] ?? self::TYPE_PLAIN_TEXT, $loaded_from_db );
		$this->set_url_filter( $row_data['url_filter'] ?? '', $loaded_from_db );
		$this->set_labels( $row_data['labels'] ?? '', $loaded_from_db );
		$this->set_login_status( $row_data['login_status'] ?? self::LOGIN_STATUS_ALL, $loaded_from_db );
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
			'id'          => '%d',
			'str_search'  => '%s',
			'str_replace' => '%s',
			'search_type' => '%s',
			'login_status' => '%s',
			'url_filter'  => '%s',
			'labels'  => '%s',
		);
	}
}
