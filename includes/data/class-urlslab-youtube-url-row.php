<?php

class Urlslab_Youtube_Url_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_videoid( $data['videoid'] ?? '', $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? 0, $loaded_from_db );
	}

	public function get_videoid(): string {
		return $this->get( 'videoid' );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_videoid( string $videoid, $loaded_from_db = false ): void {
		$this->set( 'videoid', $videoid, $loaded_from_db );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_YOUTUBE_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'videoid', 'url_id' );
	}

	public function get_columns(): array {
		return array(
			'videoid' => '%s',
			'url_id'        => '%d',
		);
	}
}
