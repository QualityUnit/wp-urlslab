<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Offload_Transfer_Files_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		$latest_file_driver = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER );
		$data = array(
			$latest_file_driver,
		);
		$placeholders = array();

		if ( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB ) ) {
			$data[] = Urlslab_Driver::DRIVER_DB;
			$placeholders[] = '%s';
		}
		if ( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3 ) ) {
			$data[] = Urlslab_Driver::DRIVER_S3;
			$placeholders[] = '%s';
		}
		if ( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES ) ) {
			$data[] = Urlslab_Driver::DRIVER_LOCAL_FILE;
			$placeholders[] = '%s';
		}

		if ( empty( $placeholders ) ) {
			return false;
		}

		global $wpdb;
		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FILE_POINTERS_TABLE . ' WHERE driver <> %s AND driver IN (' . implode(',', $placeholders) . ') LIMIT 1', // phpcs:ignore
				$data
			),
			ARRAY_A
		);
		if ( empty( $file_row ) ) {
			return false;
		}

		return Urlslab_Driver::transfer_file_to_storage(
			new Urlslab_File_Pointer_Data( $file_row ),
			$latest_file_driver
		);
	}
}
