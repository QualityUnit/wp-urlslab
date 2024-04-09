<?php

class Urlslab_Data_Keyword extends Urlslab_Data {
	public function __construct( array $data = array(), $loaded_from_db = false ) {
		$this->set_kw_id( $data['kw_id'] ?? 0, $loaded_from_db );
		$this->set_keyword( $data['keyword'] ?? '', $loaded_from_db );
		$this->set_url_link( $data['urlLink'] ?? '', $loaded_from_db );
		$this->set_kw_priority( $data['kw_priority'] ?? 10, $loaded_from_db );
		$this->set_kw_length( $data['kw_length'] ?? strlen( $this->get_keyword() ), $loaded_from_db );
		$this->set_lang( $data['lang'] ?? 'all', $loaded_from_db );
		$this->set_url_filter( $data['urlFilter'] ?? '.*', $loaded_from_db );
		$this->set_kw_type( $data['kwType'] ?? Urlslab_Widget_Link_Builder::KW_TYPE_MANUAL, $loaded_from_db );
		$this->set_labels( $data['labels'] ?? '', $loaded_from_db );
		$this->set_kw_hash( $data['kw_hash'] ?? $this->compute_kw_hash(), $loaded_from_db );
		$this->set_query_id( $data['query_id'] ?? crc32( $this->get_keyword() ), $loaded_from_db );
		$this->set_valid_until( $data['valid_until'] ?? null, $loaded_from_db );
	}

	public function as_array(): array {
		$array = parent::as_array();
		unset( $array['kw_hash'] );

		return $array;
	}

	protected function set( $name, $value, $loaded_from_db ) {
		$result = parent::set( $name, $value, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			switch ( $name ) {
				case 'keyword':
					$this->set_kw_length( strlen( $value ), $loaded_from_db );    //continue next case
				case 'urlLink':
				case 'lang':
					$this->set_kw_hash( $this->compute_kw_hash(), $loaded_from_db );
					break;
				default:
			}
		}

		return $result;
	}

	private function compute_kw_hash() {
		return crc32( md5( $this->get_keyword() . '|' . $this->get_url_link() . '|' . $this->get_lang() ) );
	}

	public function get_kw_id(): int {
		return $this->get( 'kw_id' );
	}

	public function get_kw_hash(): int {
		if ( empty( $this->get( 'kw_hash' ) ) ) {
			$this->set_kw_hash( $this->compute_kw_hash() );
		}

		return $this->get( 'kw_hash' );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
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

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function get_valid_until(): string {
		return $this->get( 'valid_until' );
	}

	public function set_valid_until( $valid_until, $loaded_from_db = false ): void {
		$this->set( 'valid_until', $valid_until, $loaded_from_db );
	}

	public function set_kw_id( int $kw_id, $loaded_from_db = false ): void {
		$this->set( 'kw_id', $kw_id, $loaded_from_db );
	}

	public function set_kw_hash( int $kw_hash, $loaded_from_db = false ): void {
		$this->set( 'kw_hash', $kw_hash, $loaded_from_db );
	}

	public function set_keyword( string $keyword, $loaded_from_db = false ): void {
		$this->set( 'keyword', trim( $keyword ), $loaded_from_db );
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
		if ( 0 === strlen( trim( $url_filter ) ) ) {
			$url_filter = '.*';
		}
		$this->set( 'urlFilter', $url_filter, $loaded_from_db );
	}

	public function set_kw_type( string $kw_type, $loaded_from_db = false ): void {
		$this->set( 'kwType', $kw_type, $loaded_from_db );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_KEYWORDS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'kw_id' );
	}

	public function get_columns(): array {
		return array(
			'kw_id'       => '%d',
			'kw_hash'     => '%d',
			'query_id'    => '%d',
			'keyword'     => '%s',
			'urlLink'     => '%s',
			'kw_priority' => '%d',
			'kw_length'   => '%d',
			'lang'        => '%s',
			'urlFilter'   => '%s',
			'kwType'      => '%s',
			'labels'      => '%s',
			'valid_until' => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'valid_until':
				return self::COLUMN_TYPE_DATE;
		}

		if ( 'kwType' === $column ) {
			return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		if ( 'kwType' === $column ) {
			return array(
				Urlslab_Widget_Link_Builder::KW_TYPE_MANUAL                => __( 'Manual', 'urlslab' ),
				Urlslab_Widget_Link_Builder::KW_TYPE_IMPORTED_FROM_CONTENT => __( 'Imported', 'urlslab' ),
				Urlslab_Widget_Link_Builder::KW_TYPE_NONE                  => __( 'None', 'urlslab' ),
			);
		}

		return parent::get_enum_column_items( $column );
	}
}
