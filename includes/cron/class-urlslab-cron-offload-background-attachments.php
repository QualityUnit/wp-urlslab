<?php

class Urlslab_Cron_Offload_Background_Attachments extends Urlslab_Cron {
	public const SETTING_NAME_SCHEDULER_POINTER = 'urlslab_sched_pointer';

	public function get_description(): string {
		return __( 'Offloading background images and videos from WordPress Media', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ) {
			return false;
		}

		if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ) ) {
			try {
				return 0 !== $this->schedule_post_attachments_batch( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_NEW_FILE_DRIVER ) );
			} catch ( Exception $e ) {
			}
		}

		return false;
	}

	/**
	 * @return float|int|string
	 */
	private function schedule_post_attachments_batch( string $latest_file_driver ) {
		global $wpdb;
		$last_post_id = get_option( self::SETTING_NAME_SCHEDULER_POINTER, - 1 );

		$post_ids = $wpdb->get_results( $wpdb->prepare( 'SELECT ID FROM ' . $wpdb->prefix . "posts WHERE ID > %d AND post_type='attachment' ORDER BY ID ASC LIMIT 100", $last_post_id ) ); // phpcs:ignore

		if ( empty( $post_ids ) ) {
			$this->lock( 300, self::LOCK );
			return 0;
		}

		$rows = array();

		foreach ( $post_ids as $post_id ) {
			$last_post_id = $post_id->ID;
			$file_path    = get_attached_file( $last_post_id );
			$meta         = wp_get_attachment_metadata( $last_post_id );

			$file = new Urlslab_Data_File(
				array(
					'url'            => wp_get_attachment_url( $last_post_id ),
					'filename'       => isset( $meta['file'] ) ? basename( $meta['file'] ) : basename( $file_path ),
					'status_changed' => Urlslab_Data::get_now(),
					'filestatus'     => Urlslab_Driver::STATUS_NEW,
					'local_file'     => '',
				),
				false
			);
			$file->get_fileid(); //init fileid
			$rows[] = $file;
		}

		if ( ! empty( $rows ) ) {
			update_option( self::SETTING_NAME_SCHEDULER_POINTER, $last_post_id );
			$result = $rows[0]->insert_all( $rows, true );
			if ( ! is_numeric( $result ) ) {
				return 0;
			}

			return $result;
		}

		return 0;
	}
}
