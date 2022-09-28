<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Offload_Enqueue_Files_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;
		$file_row = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE (filestatus = %s OR (last_seen < %s AND filestatus = %s)) LIMIT 1', // phpcs:ignore
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
		if ( $file->get_filestatus() != Urlslab_Driver::STATUS_NEW ) {
			return false;
		}

		if ( ! Urlslab_Driver::get_driver( $file )->is_connected() ) {
			return false;
		}

		//update status to pending
		$wpdb->update(
			URLSLAB_FILES_TABLE,
			array(
				'filestatus' => Urlslab_Driver::STATUS_PENDING,
				'last_seen' => strtotime( gmdate( 'Y-m-d H:i:s' ) ),
			),
			array(
				'fileid' => $file->get_fileid(),
				'filestatus' => Urlslab_Driver::STATUS_NEW,
			)
		);

		if ( Urlslab_Driver::get_driver( $file )->upload_content( $file ) ) {
			//update status to active
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus' => Urlslab_Driver::STATUS_ACTIVE,
					'filetype' => $file->get_filetype(),
				),
				array(
					'fileid' => $file->get_fileid(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
				)
			);
		} else {
			//something went wrong, set status error
			$wpdb->update(
				URLSLAB_FILES_TABLE,
				array(
					'filestatus' => Urlslab_Driver::STATUS_ERROR,
				),
				array(
					'fileid' => $file->get_fileid(),
					'filestatus' => Urlslab_Driver::STATUS_PENDING,
				)
			);
		}
		return true;
	}
}
