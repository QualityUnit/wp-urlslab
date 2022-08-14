<?php

class Urlslab_Convert_Images_Cron {
	private $start_time;
	const MAX_RUN_TIME = 10;

	public function urlslab_cron_exec() {

		if (
			! function_exists( 'imagewebp' ) ||
			! function_exists( 'imagecreatefrompng' ) ||
			! function_exists( 'imagecreatefromjpeg' )
		) {
			return;
		}

		$this->start_time = time();
		while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->convert_next_file() ) {
		}
	}

	private function convert_next_file() {
		global $wpdb;

		$values = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT );
		if ( empty( $values ) ) {
			return false;
		}

		$placeholders = implode( ',', array_fill( 0, count( $values ), '%s' ) );
		array_unshift( $values, Urlslab_Driver::STATUS_ACTIVE, Urlslab_File_Data::USE_WEBP_YES );

		$file_row = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus = %s AND use_webp = %s AND webp_fileid IS NULL AND filetype IN (' . $placeholders . ') LIMIT 1', $values ), // phpcs:ignore
			ARRAY_A
		);

		if ( empty( $file_row ) ) {
			return false;   //No rows to process
		}

		$file = new Urlslab_File_Data( $file_row );
		if ( strlen( $file->get_webp_fileid() ) ) {
			//This file is already processing or processed
			return true;
		}

		//update status to processing (lock file)
		$wpdb->update(
			URLSLAB_FILES_TABLE,
			array(
				'webp_fileid' => Urlslab_File_Data::USE_WEBP_PROCESSING,
			),
			array(
				'fileid' => $file->get_fileid(),
				'webp_fileid' => Urlslab_File_Data::USE_WEBP_YES,
			)
		);

		if ( ! Urlslab_Driver::get_driver( $file )->is_connected() ) {
			//NOT connected, continue with next file
			return true;
		}


		$tmp_name = wp_tempnam();
		if ( Urlslab_Driver::get_driver( $file )->save_to_file( $file, $tmp_name ) ) {

			switch ( $file->get_filetype() ) {
				case 'image/png':
					$im = imagecreatefrompng( $tmp_name );
					break;
				case 'image/jpeg':
					$im = imagecreatefromjpeg( $tmp_name );
					break;
				default:
					//unsupported file type
					return true;
			}

			unlink( $tmp_name );

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
					'use_webp' => Urlslab_File_Data::USE_WEBP_NO,
				)
			);

			if ( $this->insert_webp_file( $webp_file ) && Urlslab_Driver::get_driver( $webp_file )->upload_content( $webp_file ) ) {
				$wpdb->update(
					URLSLAB_FILES_TABLE,
					array(
						'filestatus' => Urlslab_Driver::STATUS_ACTIVE,
					),
					array(
						'fileid' => $webp_file->get_fileid(),
					)
				);
				$wpdb->update(
					URLSLAB_FILES_TABLE,
					array(
						'webp_fileid' => $webp_file->get_fileid(),
					),
					array(
						'fileid' => $file->get_fileid(),
					)
				);
			}
			unlink( $webp_name );
		}
		return true;
	}


	private function insert_webp_file( Urlslab_File_Data $file ): bool {
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
			'use_webp' => Urlslab_File_Data::USE_WEBP_NO,
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
