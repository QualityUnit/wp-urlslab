<?php

class Urlslab_Driver_File extends Urlslab_Driver {
	public function get_file_content( Urlslab_Data_File $file ) {
		if ( is_file( $file->get_local_file() ) ) {
			return file_get_contents( $file->get_local_file() );
		}
		if ( is_file( $this->get_upload_file_name( $file ) ) ) {
			return file_get_contents( $this->get_upload_file_name( $file ) );
		}

		return false;
	}

	public function save_file_to_storage( Urlslab_Data_File $file, string $local_file_name ): bool {
		if (
			! $this->get_existing_local_file( $file->get_url() ) &&
			(
				false === strpos( $file->get_local_file(), wp_get_upload_dir()['basedir'] ) ||
				! is_file( $file->get_local_file() )
			)
		) {
			$dir = $this->get_upload_dir( $file );
			if ( ! file_exists( $dir ) ) {
				wp_mkdir_p( $dir );
			}
			$new_file = $this->get_upload_file_name( $file );
			if ( ! copy( $local_file_name, $new_file ) ) {
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

		//TODO check if this is not security risk ... if file is accessible from URL, maybe we should do redirect to it instead of outputing it directly


		$file_name = $file->get_file_pointer()->get_driver_object()->get_existing_local_file( $file->get_url() );
		if ( ! $file_name ) {
			$file_name = $file->get_local_file();
		}
		if ( ! is_file( $file_name ) ) {
			return false;
		}

		$this->sanitize_output();

		$handle = fopen( $file_name, 'rb' );
		if ( false === $handle ) {
			return false;
		}

		while ( ! feof( $handle ) ) {
			// $buffer is an image binary data. escaping this data is not necessary due to the fact that the data
			// is a binary data and escaping a binary data makes no sense, unless it has to be served as a base64encoded
			// image. However, the whole endpoint and different methods of offloading images are designed to serve the
			// images as a binary data (taking advantage of serving the data in chunks). So, it is safe to use unescaped data here.
			$buffer = @fread( $handle, 1024 * 8 );
			echo $buffer; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			ob_flush();
			flush();
			if ( 0 != connection_status() ) {
				break;
			}
		}
		fclose( $handle );
	}

	public function get_url( Urlslab_Data_File $file ) {
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

	public function save_to_file( Urlslab_Data_File $file, $file_name ): bool {
		$old_filename = $file->get_file_pointer()->get_driver_object()->get_existing_local_file( $file->get_url() );

		return @copy( $old_filename ? $old_filename : $file->get_local_file(), $file_name );
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

	private function get_upload_dir( Urlslab_Data_File $file ) {
		$upload_dir = wp_upload_dir();

		if ( false !== strpos( $file->get_url(), $upload_dir['baseurl'] ) ) {
			return $upload_dir['basedir'] . substr( substr( $file->get_url(), strlen( $upload_dir['baseurl'] ) ), 0, - strlen( $file->get_filename() ) );
		}

		return $upload_dir['path'];
	}

	public function get_upload_file_name( Urlslab_Data_File $file ) {
		$file_path = $this->get_existing_local_file( $file->get_url() );
		if ( $file_path ) {
			return $file_path;
		}

		$upload_dir = wp_upload_dir();
		if ( false !== strpos( $file->get_file_url(), $upload_dir['baseurl'] ) ) {
			$relative_path = str_replace( $upload_dir['baseurl'], '', $file->get_file_url() );
			$file_path     = $upload_dir['basedir'] . $relative_path;
		} else {
			$file_path = $upload_dir['path'] . '/' . $file->get_filehash() . '_' . $file->get_filename();
		}

		return $file_path;
	}


	protected function save_files_from_uploads_dir(): bool {
		return false;
	}

	public function create_url( Urlslab_Data_File $file ): string {
		return wp_upload_dir()['url'] . '/' . $file->get_filehash() . '_' . $file->get_filename();
	}
}
