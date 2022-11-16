<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_File extends Urlslab_Driver {

	function get_file_content( Urlslab_File_Data $file ) {
		if ( file_exists( $file->get_local_file() ) ) {
			return file_get_contents( $file->get_local_file() );
		}
		if ( file_exists( $this->get_upload_file_name( $file ) ) ) {
			return file_get_contents( $this->get_upload_file_name( $file ) );
		}

		return false;
	}

	public function upload_content( Urlslab_File_Data $file ) {
		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) ) {
			if ( $file->get_local_file() == $this->get_upload_file_name( $file ) ) {
				return true;    //we have local file on disk already, no need to save it to storage
			} else {
				//make copy of file in our own upload dir
				if ( ! copy( $file->get_local_file(), $this->get_upload_file_name( $file ) ) ) {
					return false;
				}

				return true;
			}
		}

		return parent::upload_content( $file );
	}

	private function get_file_dir( Urlslab_File_Data $file ) {
		return '/' . self::URLSLAB_DIR . $file->get_filesize() . '/' . $file->get_filehash() . '/';
	}

	private function get_upload_dir( Urlslab_File_Data $file ) {
		return wp_upload_dir()['basedir'] . $this->get_file_dir( $file );
	}

	private function get_upload_file_name( Urlslab_File_Data $file ) {
		return $this->get_upload_dir( $file ) . $file->get_filename();
	}

	function save_file_to_storage( Urlslab_File_Data $file, string $local_file_name ): bool {
		$dir = $this->get_upload_dir( $file );
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}

		$new_file = $this->get_upload_file_name( $file );

		global $wpdb;
		if ( file_exists( $new_file ) ) {
			//# synchronising DB with file data
			$wpdb->update( URLSLAB_FILES_TABLE, array( 'local_file' => $new_file ), array( 'fileid' => $file->get_fileid() ) );

			return true;
		}

		if ( ! copy( $local_file_name, $new_file ) ) {
			return false;
		}

		//set new local file name
		$wpdb->update( URLSLAB_FILES_TABLE, array( 'local_file' => $new_file ), array( 'fileid' => $file->get_fileid() ) );

		return true;
	}

	function output_file_content( Urlslab_File_Data $file ) {
		if ( ! file_exists( $file->get_local_file() ) ) {
			return false;
		}

		$this->sanitize_output();

		$handle = fopen( $file->get_local_file(), 'rb' );
		if ( false === $handle ) {
			return false;
		}

		while ( ! feof( $handle ) ) {
			$buffer = @fread( $handle, 1024 * 8 );
			echo $buffer; // phpcs:ignore
			ob_flush();
			flush();
			if ( connection_status() != 0 ) {
				break;
			}
		}
		fclose( $handle );
	}

	public function get_url( Urlslab_File_Data $file ) {
		return wp_get_upload_dir()['baseurl'] . $this->get_file_dir( $file ) . $file->get_filename();
	}

	function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_File_Data $file, $file_name ): bool {
		return copy( $file->get_local_file(), $file_name );
	}

	public static function get_driver_settings(): array {
		return array();
	}

	public function delete_content( Urlslab_File_Data $file_pointer ): bool {
		return true;
		//we will not delete files from disk yet
		//return unlink( $file->get_local_file() );
	}

	public function get_driver_code(): string {
		return self::DRIVER_LOCAL_FILE;
	}
}
