<?php

class Urlslab_Driver_Db extends Urlslab_Driver {
	public const MAX_DB_CHUNK_SIZE = 500000;

	public function save_file_to_storage( Urlslab_Data_File $file, $local_file_name ): bool {
		if ( ! is_file( $local_file_name ) || ! filesize( $local_file_name ) ) {
			return false;
		}

		if ( $file->is_system_file() ) {
			return true;
		}

		$handle = fopen( $local_file_name, 'rb' );
		if ( false === $handle ) {
			return false;
		}

		// clean old content data
		$this->delete_content( $file );

		global $wpdb;
		$result  = true;
		$part_id = 1;
		while ( ! feof( $handle ) ) {
			$contents = fread( $handle, self::MAX_DB_CHUNK_SIZE );

			$result = $wpdb->insert(
				URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE,
				array(
					'filehash' => $file->get_filehash(),
					'filesize' => $file->get_filesize(),
					'partid'   => $part_id,
					'content'  => $contents,
				)
			);

			if ( false === $result ) {
				break;
			}

			++$part_id;
		}
		fclose( $handle );

		return false !== $result;
	}

	public function output_file_content( Urlslab_Data_File $file ) {
		$this->sanitize_output();

		global $wpdb;
		if ( is_object( $wpdb->dbh ) && $wpdb->use_mysqli ) {
			$records = $wpdb->dbh->query( $wpdb->prepare( 'select content from ' . URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE . ' WHERE filehash=%s AND filesize=%d ORDER BY partid', $file->get_filehash(), $file->get_filesize() ) ); // phpcs:ignore
			if ( false === $records ) {
				return; // no content???
			}
			while ( $data = $records->fetch_assoc() ) {
				// $data['content'] is an image binary data. escaping this data is not necessary. A workaround to
				// avoid this way would be to use base64 encoded data, but that ignores the benefit of streaming the
				// image data in chunks to the end user. So, it is safe to use unescaped data here.
				echo $data['content']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( ob_get_length() ) {
					ob_flush();
				}
				flush();
			}
		} else {
			// iteration through results set not supported, store to local file and pass through local file to browser
			if ( ! function_exists( 'wp_tempnam' ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
			}
			$local_tmp_file = wp_tempnam();
			if ( $this->save_to_file( $file, $local_tmp_file ) ) {
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

	public function is_connected() {
		global $wpdb;

		return $wpdb->ready;
	}

	public function save_to_file( Urlslab_Data_File $file, $file_name ): bool {
		global $wpdb;
		$fhandle = fopen( $file_name, 'wb' );
		$sql     = $wpdb->prepare( 'select content from ' . URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE . ' WHERE filehash=%s AND filesize=%d ORDER BY partid', $file->get_filehash(), $file->get_filesize() ); // phpcs:ignore
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

	public function delete_content( Urlslab_Data_File $file ): bool {
		global $wpdb;

		return $wpdb->delete(
			URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE,
			array(
				'filehash' => $file->get_filehash(),
				'filesize' => $file->get_filesize(),
			)
		);
	}

	public function get_driver_code(): string {
		return self::DRIVER_DB;
	}

	protected function save_files_from_uploads_dir(): bool {
		return true;
	}

	public function create_url( Urlslab_Data_File $file ): string {
		return $this->get_url( $file );
	}

	public function file_exists( Urlslab_Data_File $file_obj ): bool {
		return true;
	}
}
