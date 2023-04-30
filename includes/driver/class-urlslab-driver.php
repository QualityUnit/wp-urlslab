<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-row.php';

abstract class Urlslab_Driver {
	public const URLSLAB_DIR = 'urlslab/';

	public const DRIVER_DB = 'D';
	public const DRIVER_LOCAL_FILE = 'F';
	public const DRIVER_S3 = 'S';

	public const STATUS_ACTIVE = 'A';
	public const STATUS_PENDING = 'P';
	public const STATUS_NEW = 'N';
	public const STATUS_ERROR = 'E';

	public const DOWNLOAD_URL_PATH = 'urlslab-download/';

	private static $driver_cache = array();

	public static function get_driver( $driver ): Urlslab_Driver {
		if ( isset( self::$driver_cache[ $driver ] ) ) {
			return self::$driver_cache[ $driver ];
		}

		switch ( $driver ) {
			case self::DRIVER_DB:
				self::$driver_cache[ self::DRIVER_DB ] = new Urlslab_Driver_Db();
				break;
			case self::DRIVER_S3:
				self::$driver_cache[ self::DRIVER_S3 ] = new Urlslab_Driver_S3();
				break;
			case self::DRIVER_LOCAL_FILE:
				self::$driver_cache[ self::DRIVER_LOCAL_FILE ] = new Urlslab_Driver_File();
				break;
			default:
				throw new Exception( 'Driver not found' );
		}

		return self::$driver_cache[ $driver ];
	}

	public static function transfer_file_to_storage( Urlslab_File_Row $file, string $dest_driver ): bool {
		$result   = false;
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
				if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Media_Offloader_Widget::SLUG )->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_DELETE_AFTER_TRANSFER ) ) {
					$old_file->get_file_pointer()->get_driver_object()->delete_content( $old_file );
				}

				$result = true;
			}
		}
		unlink( $tmp_name );

		return $result;
	}

	abstract public function save_to_file( Urlslab_File_Row $file, $file_name ): bool;

	abstract public function delete_content( Urlslab_File_Row $file ): bool;

	/**
	 * return content of file
	 *
	 * @param Urlslab_File_Row $file_pointer
	 *
	 * @return mixed
	 */
	abstract public function get_file_content( Urlslab_File_Row $file );

	/**
	 * output content of file to standard output
	 *
	 * @param Urlslab_File_Row $file
	 *
	 * @return mixed
	 */
	abstract public function output_file_content( Urlslab_File_Row $file );

	abstract public function is_connected();

	public function get_url( Urlslab_File_Row $file ) {
		//URL to standard proxy script
		return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
	}

	public function upload_content( Urlslab_File_Row $file ) {
		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) ) {
			$file_name   = $file->get_local_file();
			$delete_file = false;
		} else {
			$file_name = $this->download_url( $file );
			if ( empty( $file_name ) || ! file_exists( $file_name ) ) {
				return false;
			}
			if ( $file->get_filetype() == 'application/octet-stream' ) {
				$file->set_filetype( $file->get_mime_type_from_filename( $file_name ) );
			}
			$delete_file = true;
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
			$result = $this->save_file_to_storage( $file, $file_name );

			//create pointer
			$file->set_filehash( $filehash );
			$file->set_filesize( $file_size );
			$file->get_file_pointer()->set_driver( $this->get_driver_code() );

			$size = getimagesize( $file_name );
			$file->get_file_pointer()->set_width( $size[0] ?? 0 );
			$file->get_file_pointer()->set_height( $size[1] ?? 0 );

			$file->get_file_pointer()->insert();
		} else {
			$result = true;
		}

		if ( $delete_file ) {
			unlink( $file_name );
		}

		if ( $result ) {
			//update filesize attribute
			$file->update();
		}

		return $result;
	}

	/**
	 * @param Urlslab_File_Row $file
	 *
	 * @return string|null filename of downloaded file
	 */
	private function download_url( Urlslab_File_Row $file ): ?string {
		$local_tmp_file = download_url( $file->get_file_url() );
		if ( is_wp_error( $local_tmp_file ) ) {
			if (
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMAGE_RESIZING, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMAGE_RESIZING )
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

	abstract public function save_file_to_storage( Urlslab_File_Row $file, string $local_file_name ): bool;

	abstract public function get_driver_code(): string;

	protected function sanitize_output() {
		remove_all_actions( 'template_redirect' );
		while ( ob_get_level() ) {
			ob_end_clean();
		}
	}

	protected function get_option( $option_id ) {
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Media_Offloader_Widget::SLUG ) ) {
			return Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Media_Offloader_Widget::SLUG )->get_option( $option_id );
		}

		return false;
	}
}
