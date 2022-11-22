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
       					 p.width as width,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
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

		$file->set( 'filestatus', Urlslab_Driver::STATUS_PENDING );
		$file->set( 'status_changed', gmdate( 'Y-m-d H:i:s' ) );
		$file->set( 'filetype', $file->get_filetype() ); //update filetype from file name
		$file->update();

		if ( $default_driver->upload_content( $file ) ) {
			$file->set( 'filestatus', Urlslab_Driver::STATUS_ACTIVE );
		} else {
			$file->set( 'filestatus', Urlslab_Driver::STATUS_ERROR );
		}
		$file->set( 'status_changed', gmdate( 'Y-m-d H:i:s' ) );
		$file->update();

		return true;
	}
}
