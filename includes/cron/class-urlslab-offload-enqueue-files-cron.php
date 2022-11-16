<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Offload_Enqueue_Files_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;
		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT 
    					f.*,
    					p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.filetype as filetype,
       					 p.width as width,
       					 p.driver AS driver,
       					 p.webp_hash AS webp_hash,
       					 p.avif_hash AS avif_hash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize
					FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE (f.filestatus = %s OR (f.status_changed < %s AND f.filestatus = %s)) LIMIT 1', // phpcs:ignore
				Urlslab_Driver::STATUS_NEW,
				gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
				Urlslab_Driver::STATUS_PENDING
			),
			ARRAY_A
		);
		if ( empty( $file_row ) ) {
			return false;
		}

		$file = new Urlslab_File_Data( $file_row );

		$default_driver = Urlslab_Driver::get_driver( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ) );

		if ( ! $default_driver->is_connected() ) {
			return false;
		}

		//update status to pending
		$update_affected_rows = $wpdb->update(
			URLSLAB_FILES_TABLE,
			array(
				'filestatus'     => Urlslab_Driver::STATUS_PENDING,
				'status_changed' => gmdate( 'Y-m-d H:i:s' ),
			),
			array(
				'fileid'     => $file->get_fileid(),
				'filestatus' => $file->get_filestatus(),
			)
		);

		if ( 1 !== $update_affected_rows ) {
			return true;
		}

		if ( $default_driver->upload_content( $file ) ) {
			//update status to active
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus'     => Urlslab_Driver::STATUS_ACTIVE,
					'filetype'       => $file->get_filetype(),
					'status_changed' => gmdate( 'Y-m-d H:i:s' ),
				),
				array(
					'fileid'     => $file->get_fileid(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
				)
			);
		} else {
			//something went wrong, set status error
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus'     => Urlslab_Driver::STATUS_ERROR,
					'status_changed' => gmdate( 'Y-m-d H:i:s' ),
				),
				array(
					'fileid'     => $file->get_fileid(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
				)
			);
		}

		return true;
	}
}
