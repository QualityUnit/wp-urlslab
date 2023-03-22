<?php

class Urlslab_Keyword_Row extends Urlslab_Data {

	public function __construct( array $data = array(), $loaded_from_db = false ) {
		$this->set_keyword( $data['keyword'] ?? '', $loaded_from_db );
		$this->set_url_link( $data['urlLink'] ?? '', $loaded_from_db );
		$this->set_kw_priority( $data['kw_priority'] ?? 10, $loaded_from_db );
		$this->set_kw_length( $data['kw_length'] ?? strlen( $this->get_keyword() ), $loaded_from_db );
		$this->set_lang( $data['lang'] ?? 'all', $loaded_from_db );
		$this->set_url_filter( $data['urlFilter'] ?? '.*', $loaded_from_db );
		$this->set_kw_type( $data['kwType'] ?? Urlslab_Keywords_Links::KW_TYPE_MANUAL, $loaded_from_db );
		$this->set_kw_id( $data['kw_id'] ?? $this->compute_kw_id(), $loaded_from_db );
	}

	private function compute_kw_id() {
		return crc32( md5( $this->get_keyword() . '|' . $this->get_url_link() . '|' . $this->get_lang() ) );
	}

	public function get_kw_id(): int {
		if ( empty( $this->get( 'kw_id' ) ) ) {
			$this->set_kw_id( $this->compute_kw_id() );
		}

		return $this->get( 'kw_id' );
	}

	public function get_keyword(): string {
		return $this->get( 'keyword' );
	}

	public function get_url_link(): string {
		return $this->get( 'urlLink' );
	}

	public function get_kw_priority(): int {
		return $this->get( 'kw_priority' );
	}

	public function get_kw_length(): int {
		return $this->get( 'kw_length' );
	}

	public function get_lang(): string {
		return $this->get( 'lang' );
	}

	public function get_url_filter(): string {
		return $this->get( 'urlFilter' );
	}

	public function get_kw_type(): string {
		return $this->get( 'kwType' );
	}

	public function set_kw_id( int $kw_id, $loaded_from_db = false ): void {
		$this->set( 'kw_id', $kw_id, $loaded_from_db );
	}

	public function set_keyword( string $keyword, $loaded_from_db = false ): void {
		$this->set( 'keyword', $keyword, $loaded_from_db );
	}

	public function set_url_link( string $url_link, $loaded_from_db = false ): void {
		$this->set( 'urlLink', $url_link, $loaded_from_db );
	}

	public function set_kw_priority( int $kw_priority, $loaded_from_db = false ): void {
		$this->set( 'kw_priority', $kw_priority, $loaded_from_db );
	}

	public function set_kw_length( int $kw_length, $loaded_from_db = false ): void {
		$this->set( 'kw_length', $kw_length, $loaded_from_db );
	}

	public function set_lang( string $lang, $loaded_from_db = false ): void {
		$this->set( 'lang', $lang, $loaded_from_db );
	}

	public function set_url_filter( string $url_filter, $loaded_from_db = false ): void {
		$this->set( 'urlFilter', $url_filter, $loaded_from_db );
	}

	public function set_kw_type( string $kw_type, $loaded_from_db = false ): void {
		$this->set( 'kwType', $kw_type, $loaded_from_db );
	}


	function get_table_name(): string {
		return URLSLAB_KEYWORDS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'kw_id' );
	}

	function get_columns(): array {
		return array(
			'kw_id'       => '%d',
			'keyword'     => '%s',
			'urlLink'     => '%s',
			'kw_priority' => '%d',
			'kw_length'   => '%d',
			'lang'        => '%s',
			'urlFilter'   => '%s',
			'kwType'      => '%s',
		);
	}
}
