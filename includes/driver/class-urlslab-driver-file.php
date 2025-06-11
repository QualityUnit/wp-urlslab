<?php

class Urlslab_Driver_File extends Urlslab_Driver {

	public function save_file_to_storage( Urlslab_Data_File $file, string $local_file_name ): bool {
		if (
			empty( $file->get_existing_local_file() ) &&
			(
				false === strpos( $file->get_local_file(), wp_get_upload_dir()['basedir'] ) ||
				! is_file( $file->get_local_file() )
			)
		) {
			$new_file = $this->get_upload_file_name( $file );
			if ( ! @copy( $local_file_name, $new_file ) ) {
				return false;
			}
			$file->set_local_file( $new_file );

			return $file->update();
		}

		return true;
	}

	protected function set_local_file_name( Urlslab_Data_File $file ) {
		$file->set_local_file( $this->get_upload_file_name( $file ) );
	}

	public function output_file_content( Urlslab_Data_File $file ) {
		throw new Exception( 'Not supported' );
	}

	public function get_url( Urlslab_Data_File $file ): string {
		if ( Urlslab_Driver::STATUS_ACTIVE_SYSTEM === $file->get_filestatus() && $file->is_system_file() ) {
			return $file->get_url();
		}

		if ( Urlslab_Driver::STATUS_ACTIVE === $file->get_filestatus() ) {

			if ( $file->is_uploaded_file() ) {
				return $file->get_url();
			}

			if ( file_exists( $file->get_local_file() ) ) {
				$upload_dir = wp_upload_dir();

				if ( false !== strpos( $file->get_local_file(), $upload_dir['basedir'] ) ) {
					return $upload_dir['baseurl'] . substr( $file->get_local_file(), strlen( $upload_dir['basedir'] ) );
				}

				return $file->get_local_file();
			}
		}

		return $file->get_url();
	}

	public function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_Data_File $file, $file_name ): bool {
		$old_filename = $file->get_existing_local_file();
		if ( ! empty( $old_filename ) || ! empty( $file->get_local_file() ) ) {
			return @copy( ! empty( $old_filename ) ? $old_filename : $file->get_local_file(), $file_name );
		}

		return false;
	}

	public static function get_driver_settings(): array {
		return array();
	}

	public function delete_content( Urlslab_Data_File $file_pointer ): bool {
		return true;
	}

	public function get_driver_code(): string {
		return self::DRIVER_LOCAL_FILE;
	}

	public function get_upload_file_name( Urlslab_Data_File $file ) {
		$file_path = $file->get_existing_local_file();
		if ( ! empty( $file_path ) ) {
			return $file_path;
		}

		$upload_dir = wp_upload_dir();
		if ( false !== strpos( $file->get_file_url(), $upload_dir['baseurl'] ) ) {
			$relative_path = str_replace( $upload_dir['baseurl'], '', $file->get_file_url() );
			$file_path     = $upload_dir['basedir'] . $relative_path;
		} else {
			if ( ! empty( $file->get_filehash() ) ) {
				$file_path = $upload_dir['path'] . '/' . $file->get_filehash() . '_' . $file->get_filename();
			} else {
				return '';
			}
		}

		return $file_path;
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
		$filename = $this->get_upload_file_name( $file_obj );

		return ! empty( $filename ) && file_exists( $filename );
	}
}
