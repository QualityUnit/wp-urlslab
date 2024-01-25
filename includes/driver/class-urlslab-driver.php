<?php

abstract class Urlslab_Driver {
	public const URLSLAB_DIR = 'urlslab/';

	public const DRIVER_DB = 'D';
	public const DRIVER_LOCAL_FILE = 'F';
	public const DRIVER_S3 = 'S';

	public const STATUS_ACTIVE = 'A';
	public const STATUS_ACTIVE_SYSTEM = 'S';
	public const STATUS_PENDING = 'P';
	public const STATUS_NEW = 'N';
	public const STATUS_ERROR = 'E';
	public const STATUS_NOT_PROCESSING = 'X';
	const STATUS_DISABLED = 'D';

	public const DOWNLOAD_URL_PATH = 'urlslab-download/';

	private static $driver_cache = array();

	public const DRIVERS = array(
		self::DRIVER_DB,
		self::DRIVER_LOCAL_FILE,
	);

	public function get_existing_local_file( $url ) {
		// Get the WordPress base directory.
		$wp_base_dir = ABSPATH;

		// Parse the URL to get the path.
		$parsed_url = parse_url( $url );
		$url_path   = $parsed_url['path'] ?? '';

		// Convert to a local path.
		$local_path = realpath( $wp_base_dir . $url_path );

		// Check if the path is within our WordPress installation
		if ( strpos( $local_path, $wp_base_dir ) !== 0 ) {
			// The file is outside the WordPress directory and is considered invalid or potentially harmful.
			return false;
		}

		// Check if the file exists and is not a directory.
		if ( is_file( $local_path ) ) {
			return $local_path;
		}

		return false;
	}

	public static function get_driver( $driver ): Urlslab_Driver {
		if ( isset( self::$driver_cache[ $driver ] ) ) {
			return self::$driver_cache[ $driver ];
		}

		switch ( $driver ) {
			case self::DRIVER_DB:
				self::$driver_cache[ self::DRIVER_DB ] = new Urlslab_Driver_Db();
				break;
			case self::DRIVER_LOCAL_FILE:
				self::$driver_cache[ self::DRIVER_LOCAL_FILE ] = new Urlslab_Driver_File();
				break;
			default:
				throw new Exception( 'Driver not found' );
		}

		return self::$driver_cache[ $driver ];
	}

	public static function transfer_file_to_storage( Urlslab_Data_File $file, string $dest_driver ): bool {
		$result = false;

		$file_name = $file->get_file_pointer()->get_driver_object()->get_existing_local_file( $file->get_url() );

		if ( $file_name && false === strpos( $file_name, wp_get_upload_dir()['basedir'] ) ) {
			$file->set_filestatus( self::STATUS_ACTIVE_SYSTEM );
			$file->update( array( 'filestatus' ) );

			return false;
		}


		if ( ! function_exists( 'wp_tempnam' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		$tmp_name = wp_tempnam();
		if (
			$file->get_file_pointer()->get_driver_object()->save_to_file( $file, $tmp_name )
			&& (
				filesize( $tmp_name ) == $file->get_file_pointer()->get_filesize()
				|| ( 0 == $file->get_file_pointer()->get_filesize() && 0 < filesize( $tmp_name ) )
			)
		) {
			$old_file = clone $file;

			//set new driver of storage
			$file->get_file_pointer()->set_driver( $dest_driver );
			//save file to new storage
			if ( $file->get_file_pointer()->get_driver_object()->save_file_to_storage( $file, $tmp_name ) ) {
				$file->get_file_pointer()->set_filesize( filesize( $tmp_name ) );
				$file->get_file_pointer()->update();

				//delete original file
				if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_DELETE_AFTER_TRANSFER ) ) {
					$old_file->get_file_pointer()->get_driver_object()->delete_content( $old_file );
				}

				$result = true;
			}
		} else {
			$file->set_filestatus( self::STATUS_ERROR );
			$file->update( array( 'filestatus' ) );
		}
		unlink( $tmp_name );

		return $result;
	}

	abstract public function save_to_file( Urlslab_Data_File $file, $file_name ): bool;

	abstract public function delete_content( Urlslab_Data_File $file ): bool;

	/**
	 * output content of file to standard output
	 *
	 * @param Urlslab_Data_File $file
	 *
	 * @return mixed
	 */
	abstract public function output_file_content( Urlslab_Data_File $file );

	abstract public function is_connected();

	public function get_url( Urlslab_Data_File $file ) {
		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			//URL to standard proxy script
			return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
		}

		return site_url( '?action=' . urlencode( self::DOWNLOAD_URL_PATH ) . '&ul_fileid=' . urlencode( $file->get_fileid() ) . '&ul_filename=' . urlencode( $file->get_filename() ) );
	}

	public function upload_content( Urlslab_Data_File $file ) {
		$file_name = $this->get_existing_local_file( $file->get_url() );

		if ( ! $file_name && strlen( $file->get_local_file() ) ) {
			$file_name = $file->get_local_file();
		}

		if ( $file_name && is_file( $file_name ) ) {
			//local file, no need to upload anything
			$delete_file = false;
		} else {
			$file_name = $this->download_url( $file );
			if ( empty( $file_name ) || ! file_exists( $file_name ) ) {
				return false;
			}
			$delete_file = true;
			if ( $file->get_filetype() == 'application/octet-stream' ) {
				$file->set_filetype( Urlslab_Data_File::get_mime_type_from_filename( $file_name ) );
			}
		}

		$filehash = $file->generate_file_hash( $file_name );
		if ( $filehash ) {
			$file->set_filehash( $filehash );
		}

		$file_size = filesize( $file_name );
		if ( $file_size ) {
			$file->set_filesize( $file_size );
		}

		if ( ! $file->get_file_pointer()->load() ) {
			if ( $this->save_file_to_storage( $file, $file_name ) ) {
				//create pointer
				$file->set_filehash( $filehash );
				$file->set_filesize( $file_size );
				$file->get_file_pointer()->set_driver( $this->get_driver_code() );

				$size = getimagesize( $file_name );
				$file->get_file_pointer()->set_width( $size[0] ?? 0 );
				$file->get_file_pointer()->set_height( $size[1] ?? 0 );

				$inserted_count = $file->get_file_pointer()->insert_all( array( $file->get_file_pointer() ), true );
			} else {
				$file->set_filestatus( self::STATUS_ERROR );
			}
		} else {
			if ( ! strlen( $file->get_local_file() ) ) {
				$this->set_local_file_name( $file );
			}
		}

		if ( $delete_file ) {
			unlink( $file_name );
		}

		$file->update();

		return true;
	}

	/**
	 * @param Urlslab_Data_File $file
	 *
	 * @return string|null filename of downloaded file
	 */
	private function download_url( Urlslab_Data_File $file ): ?string {
		$local_tmp_file = download_url( $file->get_file_url() );
		if ( is_wp_error( $local_tmp_file ) ) {
			if (
				get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_IMAGE_RESIZING, Urlslab_Widget_Media_Offloader::SETTING_DEFAULT_IMAGE_RESIZING )
				&& is_array( $local_tmp_file->get_error_data( 'http_404' ) )
				&& isset( $local_tmp_file->get_error_data( 'http_404' )['code'] )
				&& 404 == $local_tmp_file->get_error_data( 'http_404' )['code']
				&& preg_match( '/^(.*?)-(\d*?)x(\d*?)\.(.*?)$/', $file->get_file_url(), $matches )
			) {
				if ( strlen( $file->get_parent_url() ) ) {
					$original_tmp_file = download_url( $file->get_parent_url() );
				} else {
					$original_tmp_file = download_url( $matches[1] . '.' . $matches[4] );
				}
				if ( ! is_wp_error( $original_tmp_file ) ) {
					$local_tmp_file = $this->resize_image( $original_tmp_file, $matches[2], $matches[3] );
					unlink( $original_tmp_file );
					if ( false === $local_tmp_file ) {
						//on this place we could use original file as new file if we want, but it would generate useless traffic
						return '';
					}
				} else {
					return '';
				}
			} else {
				return '';
			}
		}

		return $local_tmp_file;
	}

	private function resize_image( $file, $w, $h ) {
		$img_info = getimagesize( $file );
		$width    = $img_info[0];
		$height   = $img_info[1];

		$r = $width / $height;
		if ( $w / $h > $r ) {
			$newwidth  = $h * $r;
			$newheight = $h;
		} else {
			$newheight = $w / $r;
			$newwidth  = $w;
		}

		switch ( $img_info['mime'] ) {
			case 'image/png':
				$src = imagecreatefrompng( $file );
				break;
			case 'image/bmp':
				$src = imagecreatefrombmp( $file );
				break;
			case 'image/gif':
				$src = imagecreatefromgif( $file );
				break;
			case 'image/jpg':
			case 'image/jpe':
			case 'image/jpeg':
				$src = imagecreatefromjpeg( $file );
				break;
			default:
				return false;
		}
		$dst = imagecreatetruecolor( $newwidth, $newheight );
		imagecopyresampled( $dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height );
		if ( ! function_exists( 'wp_tempnam' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		$tmp_name = wp_tempnam();
		switch ( $img_info['mime'] ) {
			case 'image/png':
				imagepng( $dst, $tmp_name );
				break;
			case 'image/bmp':
				imagebmp( $dst, $tmp_name );
				break;
			case 'image/gif':
				imagegif( $dst, $tmp_name );
				break;
			case 'image/jpg':
			case 'image/jpe':
			case 'image/jpeg':
				imagejpeg( $dst, $tmp_name );
				break;
			default:
				return false;
		}

		return $tmp_name;
	}

	abstract public function save_file_to_storage( Urlslab_Data_File $file, string $local_file_name ): bool;

	abstract public function get_driver_code(): string;

	abstract public function create_url( Urlslab_Data_File $file ): string;

	abstract public function file_exists( Urlslab_Data_File $file_obj ): bool;

	protected function sanitize_output() {
		remove_all_actions( 'template_redirect' );
		while ( ob_get_level() ) {
			ob_end_clean();
		}
	}

	protected function get_option( $option_id ) {
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ) {
			return Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( $option_id );
		}

		return false;
	}

	protected function set_local_file_name( Urlslab_Data_File $file ) {}

	abstract protected function save_files_from_uploads_dir(): bool;
}
