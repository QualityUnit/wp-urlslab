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
		$widget_settings = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' )->get_widget_settings();
		$this->offload_files_from_queue();
		$this->schedule_post_attachments( $widget_settings );
		$this->transfer_files_between_storages( $widget_settings );
	}

	public function schedule_post_attachments( array $widget_settings ) {
		if ( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ] ) {
			while ( time() - $this->start_time < self::MAX_RUN_TIME ) {
				try {
					$processed = $this->schedule_post_attachments_batch(
						$widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ]
					);
					if ( 0 == $processed ) {
						break;
					}
				} catch ( Exception $e ) {
					break;
				}
			}
		}
	}

	private function offload_files_from_queue() {
		while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->offload_next_file() ) {
		}
	}

	/**
	 * @param string $latest_file_driver
	 *
	 * @return float|int|string
	 */
	private function schedule_post_attachments_batch( string $latest_file_driver ) {
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
					'driver' => $latest_file_driver,
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


	private function transfer_files_between_storages( array $widget_settings ) {
		while ( time() - $this->start_time < self::MAX_RUN_TIME && $this->transfer_next_file( $widget_settings ) ) {
		}
	}

	private function transfer_next_file( array $widget_settings ) {
		$data = array(
			Urlslab_Driver::STATUS_ACTIVE,
			$widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ],
		);
		$placeholders = array();

		if ( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB ] ) {
			$data[] = Urlslab_Driver::DRIVER_DB;
			$placeholders[] = '%s';
		}
		if ( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 ] ) {
			$data[] = Urlslab_Driver::DRIVER_S3;
			$placeholders[] = '%s';
		}
		if ( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES ] ) {
			$data[] = Urlslab_Driver::DRIVER_LOCAL_FILE;
			$placeholders[] = '%s';
		}

		if ( empty( $placeholders ) ) {
			return false;
		}

		global $wpdb;
		$file_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus = %s AND driver <> %s AND driver IN (' . implode(',', $placeholders) . ') LIMIT 1', // phpcs:ignore
				$data
			),
			ARRAY_A
		);
		if ( empty( $file_row ) ) {
			return false;
		}

		return Urlslab_Driver::transfer_file_to_storage(
			new Urlslab_File_Data( $file_row ),
			$widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ]
		);
	}
}
