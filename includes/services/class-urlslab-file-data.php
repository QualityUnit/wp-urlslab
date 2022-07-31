<?php

class Urlslab_File_Data {

	private $fileid;
	private $url;
	private $filename;
	private $filesize;
	private $filetype;
	private $width;
	private $height;
	private $filestatus;
	private $local_file;
	private $driver;

	/**
	 * @param Urlslab_Url $url
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $last_status_change_date
	 * @param $url_title
	 * @param $url_meta_description
	 * @param $url_summary
	 * @param $screenshot_status
	 */
	public function __construct(
		array $file
	) {
		$this->url = $file['url'];
		$this->fileid = $file['fileid'] ?? null;
		$this->filename = $file['filename'];
		$this->filesize = $file['filesize'];
		$this->filetype = $file['filetype'];
		$this->width = $file['width'];
		$this->height = $file['height'];
		$this->filestatus = $file['filestatus'];
		$this->local_file = $file['local_file'];
		$this->driver = $file['driver'];
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
			return basename( $this->url );
		}
		return $this->filename;
	}

	public function get_filesize() {
		return $this->filesize;
	}

	public function get_filetype() {
		if ( empty( $this->filetype ) && function_exists( 'mime_content_type' ) ) {
			return mime_content_type( $this->get_filename() );
		}
		return $this->filetype;
	}

	public function get_width() {
		return $this->width;
	}

	public function get_height() {
		return $this->height;
	}

	public function get_url() {
		$parsed_url = parse_url( $this->url );
		$scheme = isset( $parsed_url['scheme'] ) ? $parsed_url['scheme'] . '://' : parse_url( get_site_url(), PHP_URL_SCHEME ) . '://';
		$host = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass = ( $user || $pass ) ? "$pass@" : '';
		$path = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';
		return "$scheme$user$pass$host$port$path$query";
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

	public function get_driver() {
		return $this->driver;
	}
}
