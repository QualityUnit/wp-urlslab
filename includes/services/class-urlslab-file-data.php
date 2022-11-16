<?php

class Urlslab_File_Data {
	public const ALTERNATIVE_PROCESSING = 'P';
	public const ALTERNATIVE_DISABLED = 'D';
	public const ALTERNATIVE_ERROR = 'E';

	private $fileid;
	private $url;
	private $parent_url;
	private $filename;
	private $filestatus;
	private $filehash;
	private $filesize;
	private $local_file;
	private $status_changed;
	private $webp_fileid;
	private $avif_fileid;
	private Urlslab_File_Pointer_Data $file_pointer;
	private $usage_count = 0;


	/**
	 * @param array $file_arr
	 */
	public function __construct(
		array $file_arr
	) {
		$this->fileid         = $file_arr['fileid'] ?? null;
		$this->url            = $file_arr['url'];
		$this->parent_url     = $file_arr['parent_url'] ?? '';
		$this->filename       = $file_arr['filename'] ?? $this->get_filename();
		$this->filestatus     = $file_arr['filestatus'] ?? '';
		$this->filehash       = $file_arr['filehash'] ?? '';
		$this->filesize       = $file_arr['filesize'] ?? 0;
		$this->usage_count    = $file_arr['imageCountUsage'] ?? 0;
		$this->local_file     = $file_arr['local_file'] ?? '';
		$this->status_changed = $file_arr['status_changed'] ?? null;
		$this->webp_fileid    = $file_arr['webp_fileid'] ?? '';
		$this->avif_fileid    = $file_arr['avif_fileid'] ?? '';
		$this->file_pointer   = new Urlslab_File_Pointer_Data( $file_arr );
	}

	public function as_array() {
		return array_merge(
			array(
				'fileid'         => $this->get_fileid(),
				'url'            => $this->get_url(),
				'parent_url'     => $this->get_parent_url(),
				'filename'       => $this->get_filename(),
				'filestatus'     => $this->get_filestatus(),
				'filehash'       => $this->get_filehash(),
				'filesize'       => $this->get_filesize(),
				'local_file'     => $this->get_local_file(),
				'status_changed' => $this->get_status_changed(),
				'webp_fileid'    => $this->webp_fileid,
				'avif_fileid'    => $this->avif_fileid,
			),
			$this->file_pointer->as_array()
		);
	}

	public static function get_file( string $fileid ): ?Urlslab_File_Data {
		global $wpdb;
		$table         = URLSLAB_FILES_TABLE;
		$table_pointer = URLSLAB_FILE_POINTERS_TABLE;

		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT 
    					 f.*, 
    					 p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.filetype as filetype,
       					 p.width as width,
       					 p.driver AS driver,
       					 p.webp_hash AS webp_hash,
       					 p.avif_hash AS avif_hash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize 
						FROM $table f LEFT JOIN $table_pointer p ON f.filehash=p.filehash AND f.filesize=p.filesize	WHERE f.fileid=%s LIMIT 1", // phpcs:ignore
				$fileid
			),
			ARRAY_A
		);

		if ( empty( $row ) ) {
			return null;
		}

		return new Urlslab_File_Data( $row );
	}

	public static function get_files( array $file_ids ): array {
		global $wpdb;
		$files   = array();
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT 
    					f.*,
    					p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.filetype as filetype,
       					 p.width as width,
       					 p.driver AS driver,
       					 p.webp_hash AS webp_hash,
       					 p.avif_hash AS avif_hash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize
						FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE f.fileid in (' . trim( str_repeat( '%s,', count( $file_ids ) ), ',' ) . ')', // phpcs:ignore
				$file_ids
			),
			'ARRAY_A'
		);
		foreach ( $results as $file_array ) {
			$file_obj                         = new Urlslab_File_Data( $file_array );
			$files[ $file_obj->get_fileid() ] = $file_obj;
		}

		return $files;
	}

	public function get_file_pointer(): Urlslab_File_Pointer_Data {
		return $this->file_pointer;
	}

	public function get_fileid() {
		if ( ! empty( $this->fileid ) ) {
			return $this->fileid;
		}
		if ( ! empty( $this->get_url() ) ) {
			return md5( $this->get_url_no_protocol() );
		}

		return '';
	}

	public function get_filestatus() {
		return $this->filestatus;
	}

	public function get_local_file() {
		return $this->local_file;
	}

	public function get_filename() {
		if ( empty( $this->filename ) ) {
			if ( ! empty( $this->local_file ) ) {
				return basename( $this->local_file );
			}
			$parsed_url = parse_url( $this->url );

			return ( isset( $parsed_url['query'] ) ? md5( $parsed_url['query'] ) . '-' : '' ) . basename( isset( $parsed_url['path'] ) ? $parsed_url['path'] : md5( $this->url ) );
		}

		return $this->filename;
	}

	public function get_url( $append_file_name = '' ) {
		$parsed_url = parse_url( $this->url );
		$scheme     = isset( $parsed_url['scheme'] ) ? $parsed_url['scheme'] . '://' : parse_url( get_site_url(), PHP_URL_SCHEME ) . '://';
		$host       = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port       = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user       = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass       = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass       = ( $user || $pass ) ? "$pass@" : '';
		$path       = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query      = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';

		return "$scheme$user$pass$host$port$path$append_file_name$query";
	}

	public function get_parent_url() {
		return $this->parent_url;
	}

	private function get_url_no_protocol() {
		$parsed_url = parse_url( $this->url );
		$host       = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port       = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user       = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass       = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass       = ( $user || $pass ) ? "$pass@" : '';
		$path       = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query      = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';

		return "$user$pass$host$port$path$query";
	}

	public function get_avif_fileid() {
		return $this->avif_fileid;
	}

	public function get_webp_fileid() {
		return $this->webp_fileid;
	}

	public function get_filehash() {
		return $this->filehash;
	}

	public function get_filesize() {
		return $this->filesize;
	}

	//TODO used just in UI - not very nice pattern, something to refactor in the react admin UI
	public function get_image_usage_count() {
		return $this->usage_count;
	}

	public function set_filehash( string $filehash ) {
		$this->filehash = $filehash;
	}

	public function set_filesize( int $file_size ) {
		$this->filesize = $file_size;
	}
}
