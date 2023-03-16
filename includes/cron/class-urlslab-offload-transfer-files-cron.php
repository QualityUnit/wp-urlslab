<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Offload_Transfer_Files_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		$widget = Urlslab_Available_Widgets::get_instance()->get_widget( Urlslab_Media_Offloader_Widget::SLUG );
		if ( empty( $widget ) ) {
			return false;
		}

		$latest_file_driver = $widget->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER );
		$data               = array( $latest_file_driver );
		$placeholders       = array();

		if ( $widget->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB ) ) {
			$data[]         = Urlslab_Driver::DRIVER_DB;
			$placeholders[] = '%s';
		}
		if ( $widget->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 ) ) {
			$data[]         = Urlslab_Driver::DRIVER_S3;
			$placeholders[] = '%s';
		}
		if ( $widget->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES ) ) {
			$data[]         = Urlslab_Driver::DRIVER_LOCAL_FILE;
			$placeholders[] = '%s';
		}

		if ( empty( $placeholders ) ) {
			return false;
		}

		global $wpdb;
		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT f.*, 
       					 p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.width as width,
       					 p.height as height,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE p.driver <> %s AND p.driver IN (' . implode( ',', $placeholders ) . ') LIMIT 1', // phpcs:ignore
				$data
			),
			ARRAY_A
		);
		if ( empty( $file_row ) ) {
			return false;
		}

		return Urlslab_Driver::transfer_file_to_storage(
			new Urlslab_File_Row( $file_row ),
			$latest_file_driver
		);
	}

	public function get_description(): string {
		return __( 'Transfering files scheduled for transfer to the new file driver', 'urlslab' );
	}
}
