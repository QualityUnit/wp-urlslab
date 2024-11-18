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

		if ( $file->is_system_file() ) {
			$file->set_filestatus( self::STATUS_ACTIVE_SYSTEM );
			$file->update( array( 'filestatus' ) );

			return false;
		}

		if ( $dest_driver === $file->get_file_pointer()->get_driver() ) {
			return true;
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
		if ( self::STATUS_ACTIVE_SYSTEM === $file->get_filestatus() && $file->is_system_file() ) {
			return $file->get_url();
		}

		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
		} else {
			return add_query_arg(
				array(
					'action'      => self::DOWNLOAD_URL_PATH,
					'ul_fileid'   => urlencode( $file->get_fileid() ),
					'ul_filename' => urlencode( $file->get_filename() ),
				),
				site_url()
			);
		}
	}

	public function upload_content( Urlslab_Data_File $file ) {
		$file_name = $file->get_existing_local_file();

		if ( empty( $file_name ) && strlen( $file->get_local_file() ) ) {
			$file_name = $file->get_local_file();
		}

		if ( ! empty( $file_name ) && is_file( $file_name ) ) {
			//local file, no need to upload anything
			$delete_file = false;
		} else {
			list( $content_type, $file_name ) = $this->download_url( $file );
			if ( empty( $file_name ) || ! file_exists( $file_name ) ) {
				return false;
			}
			$delete_file = true;
			if ( $file->get_filetype() == 'application/octet-stream' ) {
				if ( strlen( $content_type ) ) {
					$file->set_filetype( $content_type );
					if ( strlen( $file->get_filename() ) ) {
						$extension = pathinfo( $file->get_filename(), PATHINFO_EXTENSION );
						if ( empty( $extension ) ) {
							$extension = Urlslab_Data_File::get_extension_from_mime_type( $content_type );
							if ( ! empty( $extension ) ) {
								$file->set_filename( $file->get_filename() . '.' . $extension );
							}
						}
					}
				} else {
					$file->set_filetype( Urlslab_Data_File::get_mime_type_from_filename( $file_name ) );
				}
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

		if ( ! $file->get_file_pointer()->load() || ! $file->get_file_pointer()->get_driver_object()->file_exists( $file ) ) {
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

		if ( $file->is_system_file() ) {
			$file->set_filestatus( self::STATUS_ACTIVE_SYSTEM );
		}

		$file->update();

		return true;
	}

	/**
	 * @param Urlslab_Data_File $file
	 *
	 * @return string|null filename of downloaded file
	 */
	private function download_url( Urlslab_Data_File $file ): array {
		$content_type = '';
		$fn           = function ( $response, $parsed_args, $url ) use ( &$content_type ) {
			$content_type = wp_remote_retrieve_header( $response, 'Content-Type' );

			return $response;
		};

		add_filter( 'http_response', $fn, 10, 3 );
		$local_tmp_file = download_url( $file->get_file_url() );
		remove_filter( 'http_response', $fn, 10, 3 );

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
						return array( $content_type, '' );
					}
				} else {
					return array( $content_type, '' );
				}
			} else {
				return array( $content_type, '' );
			}
		}

		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Redirects::SLUG ) && Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG )->get_option( Urlslab_Widget_Redirects::SETTING_NAME_IMG_EMPTY_ON_404 ) ) {
			$file_size = filesize( $local_tmp_file );
			if ( 1024 > $file_size ) {
				$content = file_get_contents( $local_tmp_file );
				if ( Urlslab_Widget_Redirects::EMPTY_GIF_CONTENT == $content || Urlslab_Widget_Redirects::EMPTY_PNG_CONTENT == $content ) {
					unlink( $local_tmp_file );

					return array( $content_type, '' );
				}
			}
		}

		return array( $content_type, $local_tmp_file );
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

	protected function set_local_file_name( Urlslab_Data_File $file ) {
	}

	abstract protected function save_files_from_uploads_dir(): bool;
}
