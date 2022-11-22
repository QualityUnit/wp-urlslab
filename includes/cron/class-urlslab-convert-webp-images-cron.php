<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-images-cron.php';

class Urlslab_Convert_Webp_Images_Cron extends Urlslab_Convert_Images_Cron {

	public function is_format_supported() {
		return function_exists( 'imagewebp' ) ||
			   (
				   extension_loaded( 'imagick' ) &&
				   count( Imagick::queryFormats( 'WEBP*' ) ) > 0 &&
				   get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE, false )
			   );
	}

	protected function get_file_types(): array {
		return get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT );
	}

	protected function convert_next_file() {
		global $wpdb;

		$values = $this->get_file_types();

		if ( empty( $values ) ) {
			return false;
		}

		$placeholders = implode( ',', array_fill( 0, count( $values ), '%s' ) );
		array_unshift( $values, Urlslab_Driver::STATUS_ACTIVE );

		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT f.*, 
    					 p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.width as width,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize  FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . " p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE f.filestatus = %s AND (f.webp_fileid IS NULL OR f.webp_fileid = '') AND f.filetype IN (" . $placeholders . ') LIMIT 1', // phpcs:ignore
				$values
			), // phpcs:ignore
			ARRAY_A
		);

		if ( empty( $file_row ) ) {
			return false;   //No rows to process
		}

		$file = new Urlslab_File_Data( $file_row );
		if ( ! empty( $file->get( 'webp_fileid' ) ) || ! $file->get_file_pointer()->get_driver()->is_connected() ) {
			//This file is already processing, disabled or processed -> continue to next file
			return true;
		}

		//check if webp was not computed already for other file
		if ( strlen( $file->get_file_pointer()->get( 'webp_filehash' ) ) > 2 && $file->get_file_pointer()->get( 'webp_filesize' ) > 0 ) {
			$webp_file = $this->create_file_for_pointer( $file );
			if ( $webp_file ) {
				$file->set( 'webp_fileid', $webp_file->get_fileid() );
				$file->update();

				return true;
			}
		}

		$file->set( 'webp_fileid', Urlslab_File_Data::ALTERNATIVE_PROCESSING );
		$file->update();

		//create local image file
		$original_image_filename = wp_tempnam();
		if ( $file->get_file_pointer()->get_driver()->save_to_file( $file, $original_image_filename ) ) {

			$new_file = $this->convert_image_format( $file, $original_image_filename, 'webp' );
			unlink( $original_image_filename );

			if ( empty( $new_file ) || ! file_exists( $new_file ) ) {
				$file->set( 'webp_fileid', Urlslab_File_Data::ALTERNATIVE_DISABLED );
				$file->update();

				return true;
			}

			$webp_file = $this->process_file( $file, $new_file );

			if ( $webp_file ) {
				$file->set( 'webp_fileid', $webp_file->get_fileid() );
			} else {
				$file->set( 'webp_fileid', Urlslab_File_Data::ALTERNATIVE_ERROR );
			}
			$file->update();
		}

		return true;
	}

	protected function create_file_for_pointer( Urlslab_File_Data $file ): ?Urlslab_File_Data {
		$webp_file = new Urlslab_File_Data(
			array(
				'url'            => $file->get_url( '.webp' ),
				'parent_url'     => $file->get( 'parent_url' ),
				'filename'       => $file->get_filename() . '.webp',
				'filesize'       => $file->get_file_pointer()->get( 'webp_filesize' ),
				'filehash'       => $file->get_file_pointer()->get( 'webp_filehash' ),
				'filetype'       => 'image/webp',
				'width'          => $file->get( 'width' ),
				'height'         => $file->get( 'height' ),
				'filestatus'     => Urlslab_Driver::STATUS_ACTIVE,
				'status_changed' => gmdate( 'Y-m-d H:i:s' ),
				'local_file'     => '',
				'webp_fileid'    => Urlslab_File_Data::ALTERNATIVE_DISABLED,
				'avif_fileid'    => Urlslab_File_Data::ALTERNATIVE_DISABLED,
			),
			false
		);
		$webp_file->set( 'fileid', $webp_file->get_fileid() ); //init file id

		if ( $webp_file->insert() ) {
			return $webp_file;
		}

		return false;
	}

	protected function process_file( Urlslab_File_Data $file, string $new_file_name ): ?Urlslab_File_Data {
		$webp_file = new Urlslab_File_Data(
			array(
				'url'            => $file->get_url( '.webp' ),
				'parent_url'     => $file->get( 'parent_url' ),
				'filename'       => $file->get_filename() . '.webp',
				'filesize'       => filesize( $new_file_name ),
				'filehash'       => $file->generate_file_hash( $new_file_name ),
				'filetype'       => 'image/webp',
				'width'          => $file->get( 'width' ),
				'height'         => $file->get( 'height' ),
				'filestatus'     => Urlslab_Driver::STATUS_PENDING,
				'status_changed' => gmdate( 'Y-m-d H:i:s' ),
				'local_file'     => $new_file_name,
				'webp_fileid'    => Urlslab_File_Data::ALTERNATIVE_DISABLED,
				'avif_fileid'    => Urlslab_File_Data::ALTERNATIVE_DISABLED,
			),
			false
		);
		$webp_file->set( 'fileid', $webp_file->get_fileid() ); //init file id

		if ( ! $webp_file->insert() || ! $webp_file->get_file_pointer()->get_driver()->upload_content( $webp_file ) ) {
			unlink( $new_file_name );

			return false;
		}
		$webp_file->set( 'filestatus', Urlslab_Driver::STATUS_ACTIVE );
		$webp_file->update();

		$file->get_file_pointer()->set( 'webp_filehash', $webp_file->get_file_pointer()->get( 'filehash' ) );
		$file->get_file_pointer()->set( 'webp_filesize', $webp_file->get_file_pointer()->get( 'filesize' ) );
		$file->get_file_pointer()->update();

		unlink( $new_file_name );

		return $webp_file;
	}
}
