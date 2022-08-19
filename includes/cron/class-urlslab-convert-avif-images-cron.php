<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-images-cron.php';

class Urlslab_Convert_Avif_Images_Cron extends Urlslab_Convert_Images_Cron {

	public function is_format_supported() {
		return function_exists( 'imageavif' ) && get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE, false );
	}

	protected function get_file_types(): array {
		return get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT );
	}

	protected function convert_next_file() {
		global $wpdb;

		$values = $this->get_file_types();

		if ( empty( $values ) ) {
			return false;
		}

		$placeholders = implode( ',', array_fill( 0, count( $values ), '%s' ) );
		array_unshift( $values, Urlslab_Driver::STATUS_ACTIVE, Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED );

		$file_row = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus = %s AND avif_alternative = %s AND filetype IN (' . $placeholders . ') LIMIT 1', $values ), // phpcs:ignore
			ARRAY_A
		);

		if ( empty( $file_row ) ) {
			return false;   //No rows to process
		}

		$file = new Urlslab_File_Data( $file_row );
		if ( Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED !== $file->get_avif_alternative() ) {
			//This file is already processing, disabled or processed -> continue to next file
			return true;
		}

		//update status to processing (lock file)
		$wpdb->update(
			URLSLAB_FILES_TABLE,
			array(
				'avif_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_PROCESSING,
			),
			array(
				'fileid' => $file->get_fileid(),
				'avif_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_NOT_PROCESSED,
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

			$this->process_file( $file, $im );

			//processing of file done
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'avif_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_AVAILABLE,
				),
				array(
					'fileid' => $file->get_fileid(),
				)
			);
		}
		return true;
	}

	protected function process_file( Urlslab_File_Data $file, $im ) {
		global $wpdb;

		//AVIF file
		if ( $this->is_format_supported() ) {

			$avif_name = wp_tempnam();
			if (
				! imageavif(
					$im,
					$avif_name,
					get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_QUALITY ),
					get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_SPEED )
				)
			) {
				unlink( $avif_name );
				return false;
			}

			$avif_file = new Urlslab_File_Data(
				array(
					'url' => $file->get_url( '.avif' ),
					'filename' => $file->get_filename() . '.avif',
					'filesize' => filesize( $avif_name ),
					'filetype' => 'image/avif',
					'width' => $file->get_width(),
					'height' => $file->get_height(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
					'local_file' => $avif_name,
					'driver' => $file->get_driver(),
					'webp_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_DISABLED,
					'avif_alternative' => Urlslab_File_Data::FILE_ALTERNATIVE_AVAILABLE,
				)
			);

			if ( ! (
				$this->insert_alternative_file( $avif_file ) &&
				$this->insert_file_alternative_relation( $file, $avif_file ) &&
				Urlslab_Driver::get_driver( $avif_file )->upload_content( $avif_file )
			)
			) {
				unlink( $avif_name );
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
			unlink( $avif_name );
			return true;
		}

		return false;
	}
}
