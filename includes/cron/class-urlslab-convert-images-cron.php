<?php

abstract class Urlslab_Convert_Images_Cron {
	private $start_time;
	const MAX_RUN_TIME = 10;

	public function cron_exec() {
		if ( $this->is_format_supported() ) {
			$this->start_time = time();
			while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->convert_next_file() ) {
			}
		}
	}

	abstract public function is_format_supported();
	abstract protected function get_file_types(): array;
	abstract protected function process_file( Urlslab_File_Data $file, $im );
	abstract protected function convert_next_file();

	protected function insert_file_alternative_relation( Urlslab_File_Data $file, Urlslab_File_Data $file_alternative ): bool {
		global $wpdb;

		$data = array(
			'fileid' => $file->get_fileid(),
			'alternative_fileid' => $file_alternative->get_fileid(),
		);

		return $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILE_ALTERNATIVES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
				') VALUES (%s, %s)',
				array_values( $data )
			)
		);
	}

	protected function insert_alternative_file( Urlslab_File_Data $file ): bool {
		global $wpdb;

		$data = array(
			'fileid' => $file->get_fileid(),
			'url' => $file->get_url(),
			'local_file' => $file->get_local_file(),
			'filename' => $file->get_filename(),
			'filesize' => $file->get_filesize(),
			'filetype' => $file->get_filetype(),
			'filestatus' => $file->get_filestatus(),
			'driver' => $file->get_driver(),
			'width' => $file->get_width(),
			'height' => $file->get_height(),
			'webp_alternative' => $file->get_webp_alternative(),
			'avif_alternative' => $file->get_avif_alternative(),
		);

		return $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
				') VALUES (%s, %s, %s, %s, %d, %s, %s, %s, %d, %d, %s, %s)',
				array_values( $data )
			)
		);
	}
}
