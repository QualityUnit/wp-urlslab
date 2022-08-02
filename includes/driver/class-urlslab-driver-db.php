<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_Db extends Urlslab_Driver {
	const MAX_DB_CHUNK_SIZE = 500000;

	public function save_file_to_storage( Urlslab_File_Data $file, $local_file_name ):bool {
		if ( ! file_exists( $local_file_name ) || ! filesize( $local_file_name ) ) {
			return false;
		}

		//clean old content data
		global $wpdb;
		$wpdb->delete( URLSLAB_FILE_CONTENTS_TABLE, array( 'fileid' => $file->get_fileid() ) );

		$handle = fopen( $local_file_name, 'rb' );
		if ( false === $handle ) {
			return false;
		}

		$result = true;
		$content_id = 1;
		while ( ! feof( $handle ) ) {
			$contents = fread( $handle, self::MAX_DB_CHUNK_SIZE );

			$result = $wpdb->insert(
				URLSLAB_FILE_CONTENTS_TABLE,
				array(
					'fileid' => $file->get_fileid(),
					'contentid' => $content_id,
					'content' => $contents,
				)
			);

			if ( false === $result ) {
				break;
			}

			$content_id++;
		}
		fclose( $handle );
		return false !== $result;
	}

	function output_file_content( Urlslab_File_Data $file_obj ) {
		global $wpdb;
		if ( is_object( $wpdb->dbh ) && $wpdb->use_mysqli ) {
			$records = $wpdb->dbh->query( $wpdb->prepare( 'select content from ' . URLSLAB_FILE_CONTENTS_TABLE . ' WHERE fileid=%s ORDER BY contentid', $file_obj->get_fileid() ) ); // phpcs:ignore
			if ( false === $records ) {
				return; //no content???
			}
			while ( $data = $records->fetch_assoc() ) {
				echo $data['content']; // phpcs:ignore
				ob_flush();
				flush();
			}
		} else {
			echo $this->get_file_content( $file_obj ); // phpcs:ignore
			ob_flush();
			flush();
		}
	}

	function get_file_content( Urlslab_File_Data $file_obj ) {
		global $wpdb;
		$results = $wpdb->get_results( $wpdb->prepare( 'select content from ' . URLSLAB_FILE_CONTENTS_TABLE . ' WHERE fileid=%s ORDER BY contentid', $file_obj->get_fileid() ), ARRAY_A ); // phpcs:ignore
		if ( empty( $results ) ) {
			return false;
		}
		$content = '';
		foreach ( $results as $row ) {
			$content .= $row['content'];
		}
		return $content;
	}

	public function get_url( Urlslab_File_Data $file ) {
		return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
	}

	function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_File_Data $file, $file_name ): bool {
		$fhandle = fopen($file_name, 'wb');

		global $wpdb;
		$results = $wpdb->get_results( $wpdb->prepare( 'select content from ' . URLSLAB_FILE_CONTENTS_TABLE . ' WHERE fileid=%s ORDER BY contentid', $file->get_fileid() ), ARRAY_A ); // phpcs:ignore
		if ( ! empty( $results ) ) {
			foreach ( $results as $row ) {
				fwrite($fhandle, $row['content']);
			}
		} else {
			return false;
		}
		fclose($fhandle);
		return true;
	}
}
