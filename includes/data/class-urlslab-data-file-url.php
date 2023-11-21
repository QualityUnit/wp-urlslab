<?php

class Urlslab_Data_File_Url extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_fileid( $data['fileid'] ?? '', $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? '', $loaded_from_db );
	}

	public function set_fileid( string $fileid, $loaded_from_db = false ): void {
		$this->set( 'fileid', $fileid, $loaded_from_db );
	}

	public function get_fileid() {
		return $this->get( 'fileid' );
	}

	public function set_url_id( string $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_url_id() {
		return $this->get( 'url_id' );
	}

	public function get_table_name(): string {
		return URLSLAB_FILE_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id', 'fileid' );
	}

	public function get_columns(): array {
		return array(
			'url_id' => '%d',
			'fileid' => '%s',
		);
	}
}
