<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-file-data.php';

abstract class Urlslab_Driver {
	const URLSLAB_DIR = 'urlslab/';

	public const DRIVER_DB = 'D';
	public const DRIVER_LOCAL_FILE = 'F';
	public const DRIVER_S3 = 'S';

	public const STATUS_ACTIVE = 'A';
	public const STATUS_PENDING = 'P';
	public const STATUS_NEW = 'N';
	public const STATUS_ERROR = 'E';

	public const DOWNLOAD_URL_PATH = 'urlslab-download/';

	private static $driver_cache = array();

	/**
	 * return content of file
	 *
	 * @param Urlslab_File_Data $file_obj
	 * @return mixed
	 */
	abstract function get_file_content( Urlslab_File_Data $file_obj );

	/**
	 * output content of file to standard output
	 *
	 * @param Urlslab_File_Data $file_obj
	 * @return mixed
	 */
	abstract function output_file_content( Urlslab_File_Data $file_obj );

	abstract function save_file_to_storage( Urlslab_File_Data $file_obj, string $local_file_name ):bool;

	abstract function is_connected();

	abstract public function save_to_file( Urlslab_File_Data $file, $file_name ): bool;

	abstract public function delete_content( Urlslab_File_Data $file ): bool;

	public function get_url( Urlslab_File_Data $file ) {
		return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
	}

	public function upload_content( Urlslab_File_Data $file ) {
		$result = false;
		$update_data = array();

		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) ) {
			$file_size = filesize( $file->get_local_file() );
			if ( $file_size && ( empty( $file->get_filesize() ) || $file->get_filesize() != $file_size ) ) {
				$update_data['filesize'] = $file_size;
			}
			if ( empty( $file->get_height() ) || 0 === $file->get_height() || empty( $file->get_width() ) || 0 === $file->get_width() ) {
				$size = getimagesize( $file->get_local_file() );
				if ( $size ) {
					$update_data['width'] = $size[0];
					$update_data['height'] = $size[1];
				}
			}
			$result = $this->save_file_to_storage( $file, $file->get_local_file() );
		} elseif ( strlen( $file->get_url() ) ) {
			$local_tmp_file = download_url( $file->get_url() );
			if ( is_wp_error( $local_tmp_file ) ) {
				return false;
			}
			$file_size = filesize( $local_tmp_file );
			if ( $file_size && ( empty( $file->get_filesize() ) || $file->get_filesize() != $file_size ) ) {
				$update_data['filesize'] = $file_size;
			}
			if ( empty( $file->get_height() ) || 0 === $file->get_height() || empty( $file->get_width() ) || 0 === $file->get_width() ) {
				$size = getimagesize( $local_tmp_file );
				if ( $size ) {
					$update_data['width'] = $size[0];
					$update_data['height'] = $size[1];
				}
			}
			$result = $this->save_file_to_storage( $file, $local_tmp_file );
			unlink( $local_tmp_file );
		}

		if ( $result ) {
			global $wpdb;
			//update filesize attribute
			if ( ! empty( $update_data ) ) {
				$wpdb->update( URLSLAB_FILES_TABLE, $update_data, array( 'fileid' => $file->get_fileid() ) );
			}
		}
		return $result;
	}

	public static function get_driver( Urlslab_File_Data $file ): Urlslab_Driver {
		if ( isset( self::$driver_cache[ $file->get_driver() ] ) ) {
			return self::$driver_cache[ $file->get_driver() ];
		}

		switch ( $file->get_driver() ) {
			case self::DRIVER_DB:
				self::$driver_cache[ $file->get_driver() ] = new Urlslab_Driver_Db();
				break;
			case self::DRIVER_S3:
				self::$driver_cache[ $file->get_driver() ] = new Urlslab_Driver_S3();
				break;
			case self::DRIVER_LOCAL_FILE:
				self::$driver_cache[ $file->get_driver() ] = new Urlslab_Driver_File();
				break;
			default:
				throw new Exception( 'Driver not found' );
		}
		return self::$driver_cache[ $file->get_driver() ];
	}

	public static function transfer_file_to_storage(
		Urlslab_File_Data $file,
		string $dest_driver ): bool {
		global $wpdb;

		$result = false;
		$tmp_name = wp_tempnam();
		if (
			Urlslab_Driver::get_driver( $file )->save_to_file( $file, $tmp_name ) &&
			(
				filesize( $tmp_name ) == $file->get_filesize() ||
				( 0 == $file->get_filesize() && 0 < filesize( $tmp_name ) )
			)
		) {
			$old_file = clone $file;

			//set new driver of storage
			$file->set_driver( $dest_driver );
			//save file to new storage
			if ( Urlslab_Driver::get_driver( $file )->save_file_to_storage( $file, $tmp_name ) ) {
				//change driver of file in db
				$wpdb->update(
					URLSLAB_FILES_TABLE,
					array(
						'driver' => $file->get_driver(),
						'filesize' => filesize( $tmp_name ),
					),
					array(
						'fileid' => $file->get_fileid(),
					)
				);
				//delete original file
				if ( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_DELETE_AFTER_TRANSFER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_DELETE_AFTER_TRANSFER ) ) {
					Urlslab_Driver::get_driver( $old_file )->delete_content( $old_file );
				}

				$result = true;
			}
		}
		unlink( $tmp_name );
		return $result;
	}

	public static function get_driver_name( string $driver_initials ) {
		switch ( $driver_initials ) {
			case Urlslab_Driver::DRIVER_S3:
				return 's3';
			case Urlslab_Driver::DRIVER_DB:
				return 'database';
			case Urlslab_Driver::DRIVER_LOCAL_FILE:
				return 'local file';
			default:
				return 'Unknown Driver';
		}
	}


	protected function sanitize_output() {
		remove_all_actions( 'template_redirect' );
		while ( ob_get_level() ) {
			ob_end_clean();
		}
	}
}
