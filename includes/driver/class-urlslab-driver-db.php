<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_Db extends Urlslab_Driver {
	const MAX_DB_CHUNK_SIZE = 500000;

	public function save_file_to_storage( Urlslab_File_Data $file, $local_file_name ):bool {
		if ( ! file_exists( $local_file_name ) || ! filesize( $local_file_name ) ) {
			return false;
		}

		$handle = fopen( $local_file_name, 'rb' );
		if ( false === $handle ) {
			return false;
		}

		//clean old content data
		$this->delete_content( $file );

		global $wpdb;
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
		$this->sanitize_output();

		global $wpdb;
		if ( is_object( $wpdb->dbh ) && $wpdb->use_mysqli ) {
			$records = $wpdb->dbh->query( $wpdb->prepare( 'select content from ' . URLSLAB_FILE_CONTENTS_TABLE . ' WHERE fileid=%s ORDER BY contentid', $file_obj->get_fileid() ) ); // phpcs:ignore
			if ( false === $records ) {
				return; //no content???
			}
			while ( $data = $records->fetch_assoc() ) {
				echo $data['content']; // phpcs:ignore
				if ( ob_get_length() ) {
					ob_flush();
				}
				flush();
			}
		} else {
			//iteration through results set not supported, store to local file and pass through local file to browser
			if ( ! function_exists( 'wp_tempnam' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/file.php' );
			}
			$local_tmp_file = wp_tempnam();
			if ( $this->save_to_file( $file_obj, $local_tmp_file ) ) {
				$serving_fp = fopen( $local_tmp_file, 'rb' );
				fpassthru( $serving_fp );
				fclose( $serving_fp );
				if ( ob_get_length() ) {
					ob_flush();
				}
				flush();
			}
			unlink( $local_tmp_file );
			exit;
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

	function is_connected() {
		return true;
	}

	public function save_to_file( Urlslab_File_Data $file, $file_name ): bool {
		global $wpdb;
		$fhandle = fopen( $file_name, 'wb' );
		$sql = $wpdb->prepare( 'select content from ' . URLSLAB_FILE_CONTENTS_TABLE . ' WHERE fileid=%s ORDER BY contentid', $file->get_fileid() ); // phpcs:ignore
		if ( is_object( $wpdb->dbh ) && $wpdb->use_mysqli ) {
			$records = $wpdb->dbh->query( $sql );
			if ( false !== $records ) {
				while ( $data = $records->fetch_assoc() ) {
					fwrite( $fhandle, $data['content'] ); // phpcs:ignore
				}
			} else {
				fclose( $fhandle );
				return false;
			}
		} else {
			$results = $wpdb->get_results( $sql, ARRAY_A ); // phpcs:ignore
			if ( ! empty( $results ) ) {
				foreach ( $results as $row ) {
					fwrite( $fhandle, $row['content'] );
				}
			} else {
				fclose( $fhandle );
				return false;
			}
		}
		fclose( $fhandle );
		return true;
	}

	public static function get_driver_settings(): array {
		return array();
	}

	public function delete_content( Urlslab_File_Data $file ): bool {
		global $wpdb;
		return $wpdb->delete( URLSLAB_FILE_CONTENTS_TABLE, array( 'fileid' => $file->get_fileid() ) );
	}
}
