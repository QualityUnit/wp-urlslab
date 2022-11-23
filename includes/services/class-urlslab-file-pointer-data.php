<?php

class Urlslab_File_Pointer_Data extends Urlslab_Data {


	/**
	 * @param array $file
	 */
	public function __construct(
		array $file = array(), $loaded_from_db = true
	) {
		$this->set( 'filehash', $file['p_filehash'] ?? $file['filehash'] ?? '', ! $loaded_from_db );
		$this->set( 'filesize', $file['p_filesize'] ?? $file['filesize'] ?? '', ! $loaded_from_db );
		$this->set( 'width', $file['width'] ?? 0, ! $loaded_from_db );
		$this->set( 'height', $file['height'] ?? 0, ! $loaded_from_db );
		$this->set( 'driver', $file['driver'] ?? '', ! $loaded_from_db );
		$this->set( 'webp_filehash', $file['webp_filehash'] ?? '', ! $loaded_from_db );
		$this->set( 'avif_filehash', $file['avif_filehash'] ?? '', ! $loaded_from_db );
		$this->set( 'webp_filesize', $file['webp_filesize'] ?? 0, ! $loaded_from_db );
		$this->set( 'avif_filesize', $file['avif_filesize'] ?? 0, ! $loaded_from_db );
	}

	public function get_driver(): Urlslab_Driver {
		if ( empty( $this->get( 'driver' ) ) ) {
			$this->set( 'driver', get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ) );
		}

		return Urlslab_Driver::get_driver( $this->get( 'driver' ) );
	}

	function get_table_name(): string {
		return URLSLAB_FILE_POINTERS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'filehash', 'filesize' );
	}

	function get_columns(): array {
		return array(
			'filehash'      => '%s',
			'filesize'      => '%d',
			'width'         => '%d',
			'height'        => '%d',
			'driver'        => '%s',
			'webp_filehash' => '%s',
			'webp_filesize' => '%d',
			'avif_filehash' => '%s',
			'avif_filesize' => '%d',
		);
	}
}
