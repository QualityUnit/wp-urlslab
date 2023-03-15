<?php

class Urlslab_File_Pointer_Row extends Urlslab_Data {


	/**
	 * @param array $file
	 */
	public function __construct(
		array $file = array(), $loaded_from_db = true
	) {
		$this->set_filehash( $file['p_filehash'] ?? $file['filehash'] ?? '', $loaded_from_db );
		$this->set_filesize( $file['p_filesize'] ?? $file['filesize'] ?? '', $loaded_from_db );
		$this->set_width( $file['width'] ?? 0, $loaded_from_db );
		$this->set_height( $file['height'] ?? 0, $loaded_from_db );
		$this->set_driver( $file['driver'] ?? '', $loaded_from_db );
		$this->set_webp_filehash( $file['webp_filehash'] ?? '', $loaded_from_db );
		$this->set_avif_filehash( $file['avif_filehash'] ?? '', $loaded_from_db );
		$this->set_webp_filesize( $file['webp_filesize'] ?? 0, $loaded_from_db );
		$this->set_avif_filesize( $file['avif_filesize'] ?? 0, $loaded_from_db );
	}

	public function get_filehash(): string {
		return $this->get( 'filehash' );
	}

	public function get_filesize(): int {
		return $this->get( 'filesize' );
	}

	public function get_width(): int {
		return $this->get( 'width' );
	}

	public function get_height(): int {
		return $this->get( 'height' );
	}

	public function get_webp_filehash(): string {
		return $this->get( 'webp_filehash' );
	}

	public function get_webp_filesize(): int {
		return $this->get( 'webp_filesize' );
	}

	public function get_avif_filehash(): string {
		return $this->get( 'avif_filehash' );
	}

	public function get_avif_filesize(): int {
		return $this->get( 'avif_filesize' );
	}

	public function set_filehash( string $filehash, $loaded_from_db = false ): void {
		$this->set( 'filehash', $filehash, $loaded_from_db );
	}

	public function set_filesize( int $filesize, $loaded_from_db = false ): void {
		$this->set( 'filesize', $filesize, $loaded_from_db );
	}

	public function set_width( int $width, $loaded_from_db = false ): void {
		$this->set( 'width', $width, $loaded_from_db );
	}

	public function set_driver( string $driver, $loaded_from_db = false ): void {
		$this->set( 'driver', $driver, $loaded_from_db );
	}

	public function set_height( int $height, $loaded_from_db = false ): void {
		$this->set( 'height', $height, $loaded_from_db );
	}

	public function set_webp_filehash( string $webp_filehash, $loaded_from_db = false ): void {
		$this->set( 'webp_filehash', $webp_filehash, $loaded_from_db );
	}

	public function set_webp_filesize( int $webp_filesize, $loaded_from_db = false ): void {
		$this->set( 'webp_filesize', $webp_filesize, $loaded_from_db );
	}

	public function set_avif_filehash( string $avif_filehash, $loaded_from_db = false ): void {
		$this->set( 'avif_filehash', $avif_filehash, $loaded_from_db );
	}

	public function set_avif_filesize( int $avif_filesize, $loaded_from_db = false ): void {
		$this->set( 'avif_filesize', $avif_filesize, $loaded_from_db );
	}

	public function get_driver(): string {
		return $this->get( 'driver' );
	}

	public function get_driver_object(): Urlslab_Driver {
		if ( empty( $this->get_driver() ) ) {
			$this->set_driver( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ) );
		}

		return Urlslab_Driver::get_driver( $this->get_driver() );
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
