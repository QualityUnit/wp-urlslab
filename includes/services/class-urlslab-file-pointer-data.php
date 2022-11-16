<?php

class Urlslab_File_Pointer_Data {

	private $filehash;
	private $filesize;
	private $filetype;
	private $width;
	private $height;
	private $driver;
	private $webp_hash;
	private $avif_hash;
	private $webp_filesize;
	private $avif_filesize;

	static $mime_types = array(
		'txt' => 'text/plain',
		'htm' => 'text/html',
		'html' => 'text/html',
		'css' => 'text/css',
		'json' => array(
			'application/json',
			'text/json',
		),
		'xml' => 'application/xml',
		'swf' => 'application/x-shockwave-flash',
		'flv' => 'video/x-flv',

		'hqx' => 'application/mac-binhex40',
		'cpt' => 'application/mac-compactpro',
		'csv' => array(
			'text/x-comma-separated-values',
			'text/comma-separated-values',
			'application/octet-stream',
			'application/vnd.ms-excel',
			'application/x-csv',
			'text/x-csv',
			'text/csv',
			'application/csv',
			'application/excel',
			'application/vnd.msexcel',
		),
		'bin' => 'application/macbinary',
		'dms' => 'application/octet-stream',
		'lha' => 'application/octet-stream',
		'lzh' => 'application/octet-stream',
		'exe' => array(
			'application/octet-stream',
			'application/x-msdownload',
		),
		'class' => 'application/octet-stream',
		'so' => 'application/octet-stream',
		'sea' => 'application/octet-stream',
		'dll' => 'application/octet-stream',
		'oda' => 'application/oda',
		'ps' => 'application/postscript',
		'smi' => 'application/smil',
		'smil' => 'application/smil',
		'mif' => 'application/vnd.mif',
		'wbxml' => 'application/wbxml',
		'wmlc' => 'application/wmlc',
		'dcr' => 'application/x-director',
		'dir' => 'application/x-director',
		'dxr' => 'application/x-director',
		'dvi' => 'application/x-dvi',
		'gtar' => 'application/x-gtar',
		'gz' => 'application/x-gzip',
		'php' => 'application/x-httpd-php',
		'php4' => 'application/x-httpd-php',
		'php3' => 'application/x-httpd-php',
		'phtml' => 'application/x-httpd-php',
		'phps' => 'application/x-httpd-php-source',
		'js' => array(
			'application/javascript',
			'application/x-javascript',
		),
		'sit' => 'application/x-stuffit',
		'tar' => 'application/x-tar',
		'tgz' => array(
			'application/x-tar',
			'application/x-gzip-compressed',
		),
		'xhtml' => 'application/xhtml+xml',
		'xht' => 'application/xhtml+xml',
		'bmp' => array(
			'image/bmp',
			'image/x-windows-bmp',
		),
		'gif' => 'image/gif',
		'jpeg' => array(
			'image/jpeg',
			'image/pjpeg',
		),
		'jpg' => array(
			'image/jpeg',
			'image/pjpeg',
		),
		'jpe' => array(
			'image/jpeg',
			'image/pjpeg',
		),
		'png' => array(
			'image/png',
			'image/x-png',
		),
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'shtml' => 'text/html',
		'text' => 'text/plain',
		'log' => array(
			'text/plain',
			'text/x-log',
		),
		'rtx' => 'text/richtext',
		'rtf' => 'text/rtf',
		'xsl' => 'text/xml',
		'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'word' => array(
			'application/msword',
			'application/octet-stream',
		),
		'xl' => 'application/excel',
		'eml' => 'message/rfc822',

		// images
		'png' => 'image/png',
		'jpe' => 'image/jpeg',
		'jpeg' => 'image/jpeg',
		'jpg' => 'image/jpeg',
		'gif' => 'image/gif',
		'bmp' => 'image/bmp',
		'ico' => 'image/vnd.microsoft.icon',
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'svg' => 'image/svg+xml',
		'svgz' => 'image/svg+xml',

		// archives
		'zip' => array(
			'application/x-zip',
			'application/zip',
			'application/x-zip-compressed',
		),
		'rar' => 'application/x-rar-compressed',
		'msi' => 'application/x-msdownload',
		'cab' => 'application/vnd.ms-cab-compressed',

		// audio/video
		'mid' => 'audio/midi',
		'midi' => 'audio/midi',
		'mpga' => 'audio/mpeg',
		'mp2' => 'audio/mpeg',
		'mp3' => array(
			'audio/mpeg',
			'audio/mpg',
			'audio/mpeg3',
			'audio/mp3',
		),
		'aif' => 'audio/x-aiff',
		'aiff' => 'audio/x-aiff',
		'aifc' => 'audio/x-aiff',
		'ram' => 'audio/x-pn-realaudio',
		'rm' => 'audio/x-pn-realaudio',
		'rpm' => 'audio/x-pn-realaudio-plugin',
		'ra' => 'audio/x-realaudio',
		'rv' => 'video/vnd.rn-realvideo',
		'wav' => array(
			'audio/x-wav',
			'audio/wave',
			'audio/wav',
		),
		'mpeg' => 'video/mpeg',
		'mpg' => 'video/mpeg',
		'mpe' => 'video/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',
		'avi' => 'video/x-msvideo',
		'movie' => 'video/x-sgi-movie',

		// adobe
		'pdf' => 'application/pdf',
		'psd' => array(
			'image/vnd.adobe.photoshop',
			'application/x-photoshop',
		),
		'ai' => 'application/postscript',
		'eps' => 'application/postscript',
		'ps' => 'application/postscript',

		// ms office
		'doc' => 'application/msword',
		'rtf' => 'application/rtf',
		'xls' => array(
			'application/excel',
			'application/vnd.ms-excel',
			'application/msexcel',
		),
		'ppt' => array(
			'application/powerpoint',
			'application/vnd.ms-powerpoint',
		),
		// open office
		'odt' => 'application/vnd.oasis.opendocument.text',
		'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
	);


	/**
	 * @param array $file
	 */
	public function __construct(
		array $file
	) {
		$this->filehash = $file['p_filehash'] ?? '';
		$this->filesize = $file['p_filesize'] ?? 0;
		$this->filetype = $file['filetype'] ?? '';
		$this->width = $file['width'] ?? 0;
		$this->height = $file['height'] ?? 0;
		$this->driver = $file['driver'] ?? '';
		$this->webp_hash = $file['webp_hash'] ?? '';
		$this->avif_hash = $file['avif_hash'] ?? '';
		$this->webp_filesize = $file['webp_filesize'] ?? 0;
		$this->avif_filesize = $file['avif_filesize'] ?? 0;
	}

	public function as_array() {
		return array(
			'filehash' => $this->get_filehash(),
			'filesize' => $this->get_filesize(),
			'filetype' => $this->get_filetype(),
			'width' => $this->get_width(),
			'height' => $this->get_height(),
			'driver' => $this->get_driver(),
			'webp_hash' => $this->webp_hash,
			'avif_hash' => $this->avif_hash,
			'webp_filesize' => $this->webp_filesize,
			'avif_filesize' => $this->avif_filesize,
		);
	}

	public static function get_file_pointer( string $filehash, int $filesize ): ?Urlslab_File_Pointer_Data {
		global $wpdb;
		$row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT *	FROM ' . URLSLAB_FILE_POINTERS_TABLE . ' WHERE filehash=%s AND filesize=%d LIMIT 1', // phpcs:ignore
				$filehash,
				$filesize
			),
			ARRAY_A
		);

		if ( empty( $row ) ) {
			return null;
		}

		return new Urlslab_File_Pointer_Data( $row );
	}

	public function get_filehash() {
		return $this->filesize;
	}

	public function get_filesize() {
		return $this->filesize;
	}

	public function get_filetype() {
		return $this->filetype;
	}

	public function get_width() {
		return $this->width ?? 0;
	}

	public function get_height() {
		return $this->height ?? 0;
	}

	public function get_driver() {
		return $this->driver;
	}


	public static function get_mime_type_from_filename( $filename ) {
		$ext = explode( '.', $filename );
		$ext = strtolower( end( $ext ) );

		if ( array_key_exists( $ext, self::$mime_types ) ) {
			return ( is_array( self::$mime_types[ $ext ] ) ) ? self::$mime_types[ $ext ][0] : self::$mime_types[ $ext ];
		} else if ( function_exists( 'finfo_open' ) ) {
			if ( file_exists( $filename ) ) {
				$finfo = finfo_open( FILEINFO_MIME );
				$mimetype = finfo_file( $finfo, $filename );
				finfo_close( $finfo );
				return $mimetype;
			}
		}
		return 'application/octet-stream';
	}

	public function set_driver( $driver ) {
		$this->driver = $driver;
	}

}
