<?php

class Urlslab_Faq_Url_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $faq = array(), $loaded_from_db = true ) {
		$this->set_faq_id( $faq['faq_id'] ?? 0, $loaded_from_db );
		$this->set_url_id( $faq['url_id'] ?? 0, $loaded_from_db );
		$this->set_sorting( $faq['sorting'] ?? 0, $loaded_from_db );
	}

	public function get_faq_id(): int {
		return $this->get( 'faq_id' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_sorting(): int {
		return $this->get( 'sorting' );
	}

	public function set_faq_id( int $faq_id, $loaded_from_db = false ) {
		$this->set( 'faq_id', $faq_id, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ) {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_sorting( int $sorting, $loaded_from_db = false ) {
		$this->set( 'sorting', $sorting, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_FAQ_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'faq_id', 'url_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'faq_id'  => '%d',
			'url_id'  => '%d',
			'sorting' => '%d',
		);
	}
}
