<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Offload_Background_Attachments_Cron extends Urlslab_Cron {
	public const SETTING_NAME_SCHEDULER_POINTER = 'urlslab_sched_pointer';

	protected function execute(): bool {
		if ( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ) ) {
			try {
				return 0 !== $this->schedule_post_attachments_batch( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ) );
			} catch ( Exception $e ) {
			}
		}
		return false;
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
			$meta = wp_get_attachment_metadata( $last_post_id );

			if (file_exists($file_path)) {
				$filesize = filesize( $file_path );
			} else {
				$filesize = 0;
			}

			$file = new Urlslab_File_Data(
				array(
					'url' => $url,
					'filename' => isset( $meta['file'] ) ? basename( $meta['file'] ) : basename( $file_path ),
					'width' => $meta['width'] ?? 0,
					'height' => $meta['height'] ?? 0,
					'filesize' => $filesize,
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
}
