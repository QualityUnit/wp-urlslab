<?php

class Urlslab_Convert_Images_Cron {
	private $start_time;
	const MAX_RUN_TIME = 10;

	public function urlslab_cron_exec() {
		if ( ( function_exists( 'imagewebp' ) && get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE, false ) ) || ( function_exists( 'imageavif' ) && get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE, false ) ) ) {
			$this->start_time = time();
			while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->convert_next_file() ) {
			}
		}
	}

	private function convert_next_file() {
		global $wpdb;

		$values = array_merge_recursive(
			get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT ),
			get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT )
		);
		$values = array_unique( $values );

		if ( empty( $values ) ) {
			return false;
		}

		$placeholders = implode( ',', array_fill( 0, count( $values ), '%s' ) );
		array_unshift( $values, Urlslab_Driver::STATUS_ACTIVE, Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED );

		$file_row = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus = %s AND use_alternative = %s AND filetype IN (' . $placeholders . ') LIMIT 1', $values ), // phpcs:ignore
			ARRAY_A
		);

		if ( empty( $file_row ) ) {
			return false;   //No rows to process
		}

		$file = new Urlslab_File_Data( $file_row );
		if ( Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED !== $file->get_use_alternative() ) {
			//This file is already processing, disabled or processed
			return true;
		}

		//update status to processing (lock file)
		$wpdb->update(
			URLSLAB_FILES_TABLE,
			array(
				'use_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_PROCESSING,
			),
			array(
				'fileid' => $file->get_fileid(),
				'use_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED,
			)
		);

		if ( ! Urlslab_Driver::get_driver( $file )->is_connected() ) {
			//NOT connected, continue with next file
			return true;
		}


		//create local image file
		$original_image_filename = wp_tempnam();
		if ( Urlslab_Driver::get_driver( $file )->save_to_file( $file, $original_image_filename ) ) {

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
					//unsupported file type
					unlink( $original_image_filename );
					return true;
			}

			unlink( $original_image_filename );

			$this->process_webp_file( $file, $im );
			$this->process_avif_file( $file, $im );

			//processing of file done
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'use_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_AVAILABLE,
				),
				array(
					'fileid' => $file->get_fileid(),
				)
			);
		}
		return true;
	}

	private function process_webp_file( Urlslab_File_Data $file, $im ) {
		global $wpdb;

		//WEBP file
		if (
			function_exists( 'imagewebp' ) &&
			true === get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE, false )
		) {

			$webp_name = wp_tempnam();
			if (
				! imagewebp(
					$im,
					$webp_name,
					get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEPB_QUALITY )
				)
			) {
				unlink( $webp_name );
				return false;
			}

			$webp_file = new Urlslab_File_Data(
				array(
					'url' => $file->get_url( '.webp' ),
					'filename' => $file->get_filename() . '.webp',
					'filesize' => filesize( $webp_name ),
					'filetype' => 'image/webp',
					'width' => $file->get_width(),
					'height' => $file->get_height(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
					'local_file' => $webp_name,
					'driver' => $file->get_driver(),
					'use_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_AVAILABLE,
				)
			);

			if ( ! (
				$this->insert_alternative_file( $webp_file ) &&
				$this->insert_file_alternative_relation( $file, $webp_file ) &&
				Urlslab_Driver::get_driver( $webp_file )->upload_content( $webp_file )
			)
			) {
				unlink( $webp_name );
				return false;
			}
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus' => Urlslab_Driver::STATUS_ACTIVE,
				),
				array(
					'fileid' => $webp_file->get_fileid(),
				)
			);
			unlink( $webp_name );
			return true;
		}

		return false;
	}

	private function process_avif_file( Urlslab_File_Data $file, $im ) {
		global $wpdb;

		//AVIF file
		if (
			function_exists( 'imageavif' ) &&
			true === get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE, false )
		) {

			$avif_filename = wp_tempnam();
			if (
				! imageavif(
					$im,
					$avif_filename,
					get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_QUALITY ),
					get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_SPEED )
				)
			) {
				unlink( $avif_filename );
				return false;
			}

			$avif_file = new Urlslab_File_Data(
				array(
					'url' => $file->get_url( '.avif' ),
					'filename' => $file->get_filename() . '.avif',
					'filesize' => filesize( $avif_filename ),
					'filetype' => 'image/avif',
					'width' => $file->get_width(),
					'height' => $file->get_height(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
					'local_file' => $avif_filename,
					'driver' => $file->get_driver(),
					'use_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_AVAILABLE,
				)
			);

			if ( ! (
				$this->insert_alternative_file( $avif_file ) &&
				$this->insert_file_alternative_relation( $file, $avif_file ) &&
				Urlslab_Driver::get_driver( $avif_file )->upload_content( $avif_file )
			)
			) {
				unlink( $avif_filename );
				return false;
			}
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus' => Urlslab_Driver::STATUS_ACTIVE,
				),
				array(
					'fileid' => $avif_file->get_fileid(),
				)
			);
			unlink( $avif_filename );
			return true;
		}

		return false;
	}


	private function insert_file_alternative_relation( Urlslab_File_Data $file, Urlslab_File_Data $file_alternative ): bool {
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

	private function insert_alternative_file( Urlslab_File_Data $file ): bool {
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
			'use_alternative' => $file->get_use_alternative(),
		);

		return $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
				') VALUES (%s, %s, %s, %s, %d, %s, %s, %s, %d, %d, %s)',
				array_values( $data )
			)
		);
	}
}
