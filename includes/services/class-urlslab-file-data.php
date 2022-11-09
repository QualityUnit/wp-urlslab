<?php

class Urlslab_File_Data {
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

	/**
	 * @param array $file
	 */
	public function __construct(
		array $file
	) {
		$this->fileid = $file['fileid'] ?? null;
		$this->url = $file['url'];
		$this->parent_url = $file['parent_url'] ?? '';
		$this->filename = $file['filename'] ?? $this->get_filename();
		$this->filestatus = $file['filestatus'] ?? '';
		$this->filehash = $file['filehash'] ?? '';
		$this->filesize = $file['filesize'] ?? 0;
		$this->local_file = $file['local_file'] ?? '';
		$this->status_changed = $file['status_changed'] ?? null;
		$this->webp_fileid = $file['webp_fileid'] ?? '';
		$this->avif_fileid = $file['avif_fileid'] ?? '';
	}

	public function as_array() {
		return array(
			'fileid' => $this->get_fileid(),
			'url' => $this->get_url(),
			'parent_url' => $this->get_parent_url(),
			'filename' => $this->get_filename(),
			'filestatus' => $this->get_filestatus(),
			'filehash' => $this->get_filehash(),
			'filesize' => $this->get_filesize(),
			'local_file' => $this->get_local_file(),
			'status_changed' => $this->get_status_changed(),
			'webp_fileid' => $this->webp_fileid,
			'avif_fileid' => $this->avif_fileid,
		);
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
		$scheme = isset( $parsed_url['scheme'] ) ? $parsed_url['scheme'] . '://' : parse_url( get_site_url(), PHP_URL_SCHEME ) . '://';
		$host = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass = ( $user || $pass ) ? "$pass@" : '';
		$path = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';
		return "$scheme$user$pass$host$port$path$append_file_name$query";
	}

	public function get_parent_url() {
		return $this->parent_url;
	}

	private function get_url_no_protocol() {
		$parsed_url = parse_url( $this->url );
		$host = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass = ( $user || $pass ) ? "$pass@" : '';
		$path = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';
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
}
