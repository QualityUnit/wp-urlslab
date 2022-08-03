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

	abstract public function get_url( Urlslab_File_Data $file );

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

	public function upload_content( Urlslab_File_Data $file ) {
		$result = false;
		$update_data = array();

		if ( strlen( $file->get_local_file() ) && file_exists( $file->get_local_file() ) ) {
			$file_size = filesize( $file->get_local_file() );
			if ( $file_size && ( empty( $file->get_filesize() ) || $file->get_filesize() != $file_size ) ) {
				$update_data['filesize'] = $file_size;
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


}
