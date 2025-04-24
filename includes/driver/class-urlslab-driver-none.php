<?php

class Urlslab_Driver_None extends Urlslab_Driver {

	public function save_file_to_storage( Urlslab_Data_File $file, string $local_file_name ): bool {
		return true;
	}

	protected function set_local_file_name( Urlslab_Data_File $file ) {
		$file->set_local_file( $this->get_upload_file_name( $file ) );
	}

	public function output_file_content( Urlslab_Data_File $file ) {
		throw new Exception( 'Not supported' );
	}

	public function get_url( Urlslab_Data_File $file ): string {
		return $file->get_url();
	}

	public function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_Data_File $file, $file_name ): bool {
		return true;
	}

	public static function get_driver_settings(): array {
		return array();
	}

	public function delete_content( Urlslab_Data_File $file_pointer ): bool {
		return true;
	}

	public function get_driver_code(): string {
		return self::DRIVER_NONE;
	}

	public function get_upload_file_name( Urlslab_Data_File $file ) {
		return $file->get_filename();
	}


	protected function save_files_from_uploads_dir(): bool {
		return false;
	}

	public function create_url( Urlslab_Data_File $file ): string {
		if ( ! empty( $file->get_filehash() ) ) {

			return wp_upload_dir()['url'] . '/' . $file->get_filehash() . '_' . $file->get_filename();
		}

		return wp_upload_dir()['url'] . '/' . $file->get_filename();
	}

	public function file_exists( Urlslab_Data_File $file_obj ): bool {
		return true;
	}
}
