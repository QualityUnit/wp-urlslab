<?php

class Urlslab_Screenshot_Url_Row extends Urlslab_Data {
	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_screenshot_url_id( $data['screenshot_url_id'] ?? 0, $loaded_from_db );
		$this->set_src_url_id( $data['src_url_id'] ?? 0, $loaded_from_db );
	}

	public function get_screenshot_url_id(): int {
		return $this->get( 'screenshot_url_id' );
	}

	public function get_src_url_id(): int {
		return $this->get( 'src_url_id' );
	}

	public function set_screenshot_url_id( int $screenshot_url_id, $loaded_from_db = false ): void {
		$this->set( 'screenshot_url_id', $screenshot_url_id, $loaded_from_db );
	}

	public function set_src_url_id( int $src_url_id, $loaded_from_db = false ): void {
		$this->set( 'src_url_id', $src_url_id, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SCREENSHOT_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'screenshot_url_id', 'src_url_id' );
	}

	public function get_columns(): array {
		return array(
			'screenshot_url_id' => '%d',
			'src_url_id'        => '%d',
		);
	}
}
