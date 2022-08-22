<?php

abstract class Urlslab_Convert_Images_Cron {
	private $start_time;
	const MAX_RUN_TIME = 10;

	public function cron_exec() {
		if ( $this->is_format_supported() ) {
			$this->start_time = time();
			while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->convert_next_file() ) {
			}
		}
	}

	abstract public function is_format_supported();

	/**
	 * @param Urlslab_File_Data $file
	 * @param string $original_image_filename
	 * @param string $new_format
	 * @return false|string new filename
	 */
	private function convert_with_imagick( Urlslab_File_Data $file, string $original_image_filename, string $new_format ): string {
		$image = new Imagick( $original_image_filename );
		if ( ! $image->setImageFormat( $new_format ) ) {
			return '';
		}
		switch ( $new_format ) {
			case 'webp':
				$image->setCompressionQuality( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEPB_QUALITY ) );
				break;
			case 'avif':
				$image->setCompressionQuality( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_QUALITY ) );
				break;
			default:
		}
		$tmp_name = wp_tempnam();
		if ( ! $image->writeImage( $tmp_name ) ) {
			unlink( $tmp_name );
			return '';
		}
		return $tmp_name;
	}
		/**
	 * @param Urlslab_File_Data $file
	 * @param string $original_image_filename
	 * @param string $new_format
	 * @return false|string new filename
	 */
	private function convert_with_native( Urlslab_File_Data $file, string $original_image_filename, string $new_format ): string {
		switch ( $file->get_filetype() ) {
			case 'image/png':
				$im = imagecreatefrompng( $original_image_filename );
				break;
			case 'image/jpeg':
				$im = imagecreatefromjpeg( $original_image_filename );
				break;
			case 'image/gif':
				$im = imagecreatefromgif( $original_image_filename );
				break;
			case 'image/bmp':
				$im = imagecreatefrombmp( $original_image_filename );
				break;
			default:
				return '';
		}

		if( ! imageistruecolor( $im ) ) {
			if ( ! imagepalettetotruecolor( $im ) ) {
				return '';
			}
		}

		$tmp_name = wp_tempnam();

		switch ( $new_format ) {
			case 'webp':
				if ( ! function_exists( 'imagewebp' ) || ! imagewebp( $im, $tmp_name, get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEPB_QUALITY ) ) ) {
					unlink( $tmp_name );
					return '';
				}
				break;
			case 'avif':
				if ( ! function_exists( 'imageavif' ) || ! imageavif( $im, $tmp_name, get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_QUALITY ), get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_SPEED ) ) ) {
					unlink( $tmp_name );
					return false;
				}
				break;
		}

		return $tmp_name;
	}

	abstract protected function get_file_types(): array;
	abstract protected function process_file( Urlslab_File_Data $file, string $new_file_name );
	abstract protected function convert_next_file();

	protected function insert_file_alternative_relation( Urlslab_File_Data $file, Urlslab_File_Data $file_alternative ): bool {
		global $wpdb;

		$data = array(
			'fileid' => $file->get_fileid(),
			'alternative_fileid' => $file_alternative->get_fileid(),
		);

		return $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILE_ALTERNATIVES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
				') VALUES (%s, %s)',
				array_values( $data )
			)
		);
	}

	protected function insert_alternative_file( Urlslab_File_Data $file ): bool {
		global $wpdb;

		$data = array(
			'fileid' => $file->get_fileid(),
			'url' => $file->get_url(),
			'local_file' => $file->get_local_file(),
			'filename' => $file->get_filename(),
			'filesize' => $file->get_filesize(),
			'filetype' => $file->get_filetype(),
			'filestatus' => $file->get_filestatus(),
			'driver' => $file->get_driver(),
			'width' => $file->get_width(),
			'height' => $file->get_height(),
			'webp_alternative' => $file->get_webp_alternative(),
			'avif_alternative' => $file->get_avif_alternative(),
		);

		return $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
				') VALUES (%s, %s, %s, %s, %d, %s, %s, %s, %d, %d, %s, %s)',
				array_values( $data )
			)
		);
	}


	protected function convert_image_format( Urlslab_File_Data $file, string $original_image_filename, string $new_format ): string {
		if ( extension_loaded( 'imagick' ) && count( Imagick::queryFormats( strtoupper( $new_format ) . '*' ) ) > 0 ) {
			return $this->convert_with_imagick( $file, $original_image_filename, $new_format );
		} else {
			return $this->convert_with_native( $file, $original_image_filename, $new_format );
		}
	}
}
