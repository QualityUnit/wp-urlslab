<?php

class Urlslab_Offload_Cron {
	private $start_time;
	const MAX_RUN_TIME = 20;

	public const SETTING_NAME_SCHEDULER_POINTER = 'urlslab_sched_pointer';

	public function __construct() {
		$this->start_time = time();
	}

	public function urlslab_cron_exec() {
		$this->start_time = time();
		$this->offload_files_from_queue();
		$this->schedule_post_attachments();
	}

	public function schedule_post_attachments() {
		while ( time() - $this->start_time < self::MAX_RUN_TIME ) {
			try {
				$processed = $this->schedule_post_attachments_batch();
				if ( 0 == $processed ) {
					break;
				}
			} catch ( Exception $e ) {
				break;
			}
		}
	}

	private function offload_files_from_queue() {
		while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->offload_next_file() ) {
		}
	}

	/**
	 * @param Urlslab_Url[] $schedules
	 *
	 * @return void
	 * @throws Exception
	 */
	private function schedule_post_attachments_batch() {
		global $wpdb;
		$last_post_id = get_option( self::SETTING_NAME_SCHEDULER_POINTER, -1 );

		$post_ids = $wpdb->get_results( $wpdb->prepare( 'SELECT ID FROM ' . $wpdb->prefix . "posts WHERE ID > %d AND post_type='attachment' ORDER BY ID ASC LIMIT 100", $last_post_id ) );

		$values = array();
		$placeholders = array();

		foreach ( $post_ids as $post_id ) {
			$last_post_id = $post_id->ID;
			$file_path = get_attached_file( $last_post_id );
			$url = wp_get_attachment_url( $last_post_id );
			$type = get_post_mime_type( $last_post_id );
			$meta = wp_get_attachment_metadata( $last_post_id );

			$file = new Urlslab_File_Data(
				array(
					'url' => $url,
					'filename' => isset( $meta['file'] ) ? basename( $meta['file'] ) : basename( $file_path ),
					'width' => $meta['width'] ?? 0,
					'height' => $meta['height'] ?? 0,
					'size' => file_exists( $file_path ) ? filesize( $file_path ) : 0,
					'filetype' => $type,
					'filestatus' => Urlslab_Driver::STATUS_NEW,
					'local_file' => $file_path,
					'driver' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ),
				)
			);

			$placeholders[] = '(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)';
			array_push( $values, $file->get_fileid(), $file->get_url(), $file->get_filename(), $file->get_filesize(), $file->get_filetype(), $file->get_width(), $file->get_height(), $file->get_filestatus(), $file->get_local_file(), $file->get_driver() );
		}

		if ( count( $placeholders ) ) {
			update_option( self::SETTING_NAME_SCHEDULER_POINTER, $last_post_id );
			$result = $wpdb->query(
				$wpdb->prepare(
					'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . ' (fileid, url, filename, filesize, filetype, width, height, filestatus, local_file, driver) VALUES ' . // phpcs:ignore
					implode( ', ', $placeholders ), // phpcs:ignore
					$values
				)
			);
			if ( ! is_numeric( $result ) ) {
				return 0;
			}
			return $result;
		}
		return 0;
	}

	private function offload_next_file() {
		global $wpdb;
		$file_row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus = %s LIMIT 1', Urlslab_Driver::STATUS_NEW ), ARRAY_A ); // phpcs:ignore
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
