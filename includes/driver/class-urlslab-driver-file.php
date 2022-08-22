<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_File extends Urlslab_Driver {

	function get_file_content( Urlslab_File_Data $file_obj ) {
		if ( ! file_exists( $file_obj->get_local_file() ) ) {
			return false;
		}
		return file_get_contents( $file_obj->get_local_file() );
	}

	public function upload_content( Urlslab_File_Data $file ) {
		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) && false !== strpos( $file->get_local_file(), wp_get_upload_dir()['basedir'] ) ) {
			return true;    //we have local file on disk already, no need to save it to storage
		}
		return parent::upload_content( $file );
	}

	private function get_file_dir( Urlslab_File_Data $file ) {
		return '/' . self::URLSLAB_DIR . substr( $file->get_fileid(), 0, 4 ) . '/';
	}

	function save_file_to_storage( Urlslab_File_Data $file_obj, string $local_file_name ):bool {
		$dir = wp_upload_dir()['basedir'] . $this->get_file_dir( $file_obj );
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}

		global $wpdb;
		$new_file = $dir . $file_obj->get_filename();

		if ( file_exists( $new_file ) ) {
			//# synchronising DB with file data
			$wpdb->update( URLSLAB_FILES_TABLE, array( 'local_file' => $new_file ), array( 'fileid' => $file_obj->get_fileid() ) );
			return true;
		}

		if ( ! copy( $local_file_name, $new_file ) ) {
			return false;
		}

		//set new local file name
		$wpdb->update( URLSLAB_FILES_TABLE, array( 'local_file' => $new_file ), array( 'fileid' => $file_obj->get_fileid() ) );
		return true;
	}

	function output_file_content( Urlslab_File_Data $file_obj ) {
		if ( ! file_exists( $file_obj->get_local_file() ) ) {
			return false;
		}

		$handle = fopen( $file_obj->get_local_file(), 'rb' );
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
}
