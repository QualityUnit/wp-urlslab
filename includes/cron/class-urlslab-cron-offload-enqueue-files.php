<?php

class Urlslab_Cron_Offload_Enqueue_Files extends Urlslab_Cron {
	public function get_description(): string {
		return __( 'Offloading scheduled files to remote storage', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ) {
			return false;
		}

		global $wpdb;
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
					FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE (f.filestatus = %s OR (f.status_changed < %s AND f.filestatus = %s)) LIMIT 1', // phpcs:ignore
				Urlslab_Driver::STATUS_NEW,
				gmdate( 'Y-m-d H:i:s', strtotime( '-1 hour' ) ),
				Urlslab_Driver::STATUS_PENDING
			),
			ARRAY_A
		);
		if ( empty( $file_row ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$file           = new Urlslab_Data_File( $file_row );
		$default_driver = Urlslab_Driver::get_driver( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_NEW_FILE_DRIVER ) );

		if ( $file->is_system_file() && Urlslab_Driver::DRIVER_LOCAL_FILE !== $default_driver->get_driver_code() ) {
			$default_driver = Urlslab_Driver::get_driver( Urlslab_Driver::DRIVER_LOCAL_FILE ); //force local file driver
		}

		if ( ! $default_driver->is_connected() ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$file->set_filestatus( Urlslab_Driver::STATUS_PENDING );
		$file->set_filetype( $file->get_filetype() ); // update filetype from file name
		$file->update();

		if ( $default_driver->upload_content( $file ) ) {
			$file->set_filestatus( Urlslab_Driver::STATUS_ACTIVE );
		} else {
			$file->set_filestatus( Urlslab_Driver::STATUS_ERROR );
		}
		if ( $file->is_system_file() ) {
			$file->set_filestatus( Urlslab_Driver::STATUS_ACTIVE_SYSTEM );
		}
		$file->update();

		return true;
	}
}
