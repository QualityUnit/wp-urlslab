<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-images-cron.php';

class Urlslab_Convert_Avif_Images_Cron extends Urlslab_Convert_Images_Cron {
	public function is_format_supported() {
		if (
			! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Media_Offloader_Widget::SLUG ) ||
			! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Media_Offloader_Widget::SLUG )->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE )
		) {
			return false;
		}

		return function_exists( 'imageavif' ) || ( extension_loaded( 'imagick' ) && count( Imagick::queryFormats( 'AVIF*' ) ) > 0 );
	}

	public function get_description(): string {
		return __( 'Converting images to AVIF format' );
	}

	protected function convert_next_file() {
		global $wpdb;

		$values = $this->get_file_types( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT );

		if ( empty( $values ) ) {
			return false;
		}

		$placeholders = implode( ',', array_fill( 0, count( $values ), '%s' ) );
		array_unshift( $values, Urlslab_Driver::STATUS_ACTIVE );

		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT 
    					 f.*, 
    					 p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.width as width,
       					 p.height as height,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize 
						FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . " p ON f.filehash=p.hasid AND f.filesize=p.filesize WHERE f.filestatus = %s AND (f.avif_fileid IS NULL OR f.avif_fileid = '') AND f.filetype IN (" . $placeholders . ') LIMIT 1', // phpcs:ignore
				$values
			),
			ARRAY_A
		);

		if ( empty( $file_row ) ) {
			return false;   // No rows to process
		}

		$file = new Urlslab_File_Row( $file_row );
		if ( ! empty( $file->get_avif_fileid() ) ) {
			// This file is already processing, disabled or processed -> continue to next file
			return true;
		}

		// check if avif was not computed already for other file
		if ( strlen( $file->get_file_pointer()->get_avif_filehash() ) > 2 && $file->get_file_pointer()->get_avif_filesize() > 0 ) {
			$avif_file = $this->create_file_for_pointer( $file );
			if ( $avif_file ) {
				$file->set_avif_fileid( $avif_file->get_fileid() );
				$file->update();

				return true;
			}
		}

		// process AVIF
		$file->set_avif_fileid( Urlslab_File_Row::ALTERNATIVE_PROCESSING );
		$file->update();

		if ( ! $file->get_file_pointer()->get_driver_object()->is_connected() ) {
			// NOT connected, continue with next file
			return true;
		}

		// create local image file
		if ( ! function_exists( 'wp_tempnam' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		$original_image_filename = wp_tempnam();
		if ( $file->get_file_pointer()->get_driver_object()->save_to_file( $file, $original_image_filename ) ) {
			$new_file_name = $this->convert_image_format( $file, $original_image_filename, 'avif' );
			unlink( $original_image_filename );

			if ( empty( $new_file_name ) || ! file_exists( $new_file_name ) ) {
				$file->set_avif_fileid( Urlslab_File_Row::ALTERNATIVE_DISABLED );
				$file->update();

				return true;
			}

			$avif_file = $this->process_file( $file, $new_file_name );

			if ( $avif_file ) {
				$file->set_avif_fileid( $avif_file->get_fileid() );
			} else {
				$file->set_avif_fileid( Urlslab_File_Row::ALTERNATIVE_ERROR );
			}
			$file->update();
		}

		return true;
	}

	protected function process_file( Urlslab_File_Row $file, string $new_file_name ): ?Urlslab_File_Row {
		$avif_file = new Urlslab_File_Row(
			array(
				'url'            => $file->get_file_url( '.avif' ),
				'parent_url'     => $file->get_parent_url(),
				'filename'       => $file->get_filename() . '.avif',
				'filesize'       => filesize( $new_file_name ),
				'filehash'       => $file->generate_file_hash( $new_file_name ),
				'filetype'       => 'image/avif',
				'width'          => $file->get_file_pointer()->get_width(),
				'height'         => $file->get_file_pointer()->get_height(),
				'filestatus'     => Urlslab_Driver::STATUS_PENDING,
				'status_changed' => Urlslab_Data::get_now(),
				'local_file'     => $new_file_name,
				'webp_fileid'    => Urlslab_File_Row::ALTERNATIVE_DISABLED,
				'avif_fileid'    => Urlslab_File_Row::ALTERNATIVE_DISABLED,
			),
			false
		);

		$avif_file->set_fileid( $avif_file->get_fileid() ); // init file id

		if ( ! $avif_file->insert() || ! $avif_file->get_file_pointer()->get_driver_object()->upload_content( $avif_file ) ) {
			unlink( $new_file_name );

			return null;
		}

		$avif_file->set_filestatus( Urlslab_Driver::STATUS_ACTIVE );
		$avif_file->set_local_file( '' );
		$avif_file->update();

		$file->get_file_pointer()->set_avif_filehash( $avif_file->get_file_pointer()->get_filehash() );
		$file->get_file_pointer()->set_avif_filesize( $avif_file->get_file_pointer()->get_filesize() );
		$file->get_file_pointer()->update();

		unlink( $new_file_name );

		return $avif_file;
	}

	protected function create_file_for_pointer( Urlslab_File_Row $file ): ?Urlslab_File_Row {
		$avif_file = new Urlslab_File_Row(
			array(
				'url'            => $file->get_file_url( '.avif' ),
				'parent_url'     => $file->get_parent_url(),
				'filename'       => $file->get_filename() . '.avif',
				'filesize'       => $file->get_file_pointer()->get_avif_filesize(),
				'filehash'       => $file->get_file_pointer()->get_avif_filehash(),
				'filetype'       => 'image/avif',
				'width'          => $file->get_file_pointer()->get_width(),
				'height'         => $file->get_file_pointer()->get_height(),
				'filestatus'     => Urlslab_Driver::STATUS_ACTIVE,
				'status_changed' => Urlslab_Data::get_now(),
				'local_file'     => '',
				'webp_fileid'    => Urlslab_File_Row::ALTERNATIVE_DISABLED,
				'avif_fileid'    => Urlslab_File_Row::ALTERNATIVE_DISABLED,
			),
			false
		);
		$avif_file->set_fileid( $avif_file->get_fileid() ); // init file id

		if ( $avif_file->insert() ) {
			return $avif_file;
		}

		return null;
	}
}
