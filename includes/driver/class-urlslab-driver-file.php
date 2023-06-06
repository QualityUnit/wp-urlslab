<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_File extends Urlslab_Driver {
	public function get_file_content( Urlslab_File_Row $file ) {
		if ( file_exists( $file->get_local_file() ) ) {
			return file_get_contents( $file->get_local_file() );
		}
		if ( file_exists( $this->get_upload_file_name( $file ) ) ) {
			return file_get_contents( $this->get_upload_file_name( $file ) );
		}

		return false;
	}

	public function upload_content( Urlslab_File_Row $file ) {
		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) ) {
			return true;
		}

		return parent::upload_content( $file );
	}

	public function save_file_to_storage( Urlslab_File_Row $file, string $local_file_name ): bool {
		$dir = $this->get_upload_dir( $file );
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}

		$new_file = $this->get_upload_file_name( $file );
		$file->set_local_file( $new_file );

		if ( ! file_exists( $new_file ) ) {
			if ( ! copy( $local_file_name, $new_file ) ) {
				return false;
			}
		}
		$file->update();

		return true;
	}

	protected function set_local_file_name( Urlslab_File_Row $file ) {
		$file->set_local_file( $this->get_upload_file_name( $file ) );
	}


	public function output_file_content( Urlslab_File_Row $file ) {
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
			if ( 0 != connection_status() ) {
				break;
			}
		}
		fclose( $handle );
	}

	public function get_url( Urlslab_File_Row $file ) {
		if ( $file->get_filestatus() == Urlslab_Driver::STATUS_ACTIVE && file_exists( $file->get_local_file() ) ) {

			$upload_dir = wp_upload_dir();

			if ( false !== strpos( $file->get_local_file(), $upload_dir['basedir'] ) ) {
				return $upload_dir['baseurl'] . substr( $file->get_local_file(), strlen( $upload_dir['basedir'] ) );
			}


			return $file->get_local_file();
		}

		return $file->get_url();
	}

	public function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_File_Row $file, $file_name ): bool {
		return copy( $file->get_local_file(), $file_name );
	}

	public static function get_driver_settings(): array {
		return array();
	}

	public function delete_content( Urlslab_File_Row $file_pointer ): bool {
		return true;
	}

	public function get_driver_code(): string {
		return self::DRIVER_LOCAL_FILE;
	}

	private function get_file_dir( Urlslab_File_Row $file ) {
		return '/' . self::URLSLAB_DIR . $file->get_filesize() . '/' . $file->get_filehash() . '/';
	}

	private function get_upload_dir( Urlslab_File_Row $file ) {
		$upload_dir = wp_upload_dir();

		if ( false !== strpos( $file->get_url(), $upload_dir['baseurl'] ) ) {
			return $upload_dir['basedir'] . substr( substr( $file->get_url(), strlen( $upload_dir['baseurl'] ) ), 0, - strlen( $file->get_filename() ) );
		}

		return $upload_dir['path'];
	}

	public function get_upload_file_name( Urlslab_File_Row $file ) {

		$upload_dir = wp_upload_dir();
		if ( false !== strpos( $file->get_file_url(), $upload_dir['baseurl'] ) ) {
			$relative_path = str_replace( $upload_dir['baseurl'], '', $file->get_file_url() );
			$file_path     = $upload_dir['basedir'] . $relative_path;
		} else {
			$url = new Urlslab_Url( $file->get_file_url() );

			$file_name = $url->get_filename();
			if ( ! empty( $url->get_query_params() ) ) {
				$file_name = $url->get_url_id() . '_' . $file_name;
			}
			$file_path = $upload_dir['path'] . '/' . $file_name;
		}

		return $file_path;
	}

}
