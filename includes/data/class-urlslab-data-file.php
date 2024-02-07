<?php

class Urlslab_Data_File extends Urlslab_Data {
	public const ALTERNATIVE_PROCESSING = 'P';
	public const ALTERNATIVE_DISABLED = 'D';
	public const ALTERNATIVE_ERROR = 'E';

	public static $mime_types
		= array(
			'txt'  => 'text/plain',
			'htm'  => 'text/html',
			'html' => 'text/html',
			'css'  => 'text/css',
			'json' => array(
				'application/json',
				'text/json',
			),
			'xml'  => 'application/xml',
			'swf'  => 'application/x-shockwave-flash',
			'flv'  => 'video/x-flv',

			'hqx'   => 'application/mac-binhex40',
			'cpt'   => 'application/mac-compactpro',
			'csv'   => array(
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
			'bin'   => 'application/macbinary',
			'dms'   => 'application/octet-stream',
			'lha'   => 'application/octet-stream',
			'lzh'   => 'application/octet-stream',
			'exe'   => array(
				'application/octet-stream',
				'application/x-msdownload',
			),
			'class' => 'application/octet-stream',
			'so'    => 'application/octet-stream',
			'sea'   => 'application/octet-stream',
			'dll'   => 'application/octet-stream',
			'oda'   => 'application/oda',
			'ps'    => 'application/postscript',
			'smi'   => 'application/smil',
			'smil'  => 'application/smil',
			'mif'   => 'application/vnd.mif',
			'wbxml' => 'application/wbxml',
			'wmlc'  => 'application/wmlc',
			'dcr'   => 'application/x-director',
			'dir'   => 'application/x-director',
			'dxr'   => 'application/x-director',
			'dvi'   => 'application/x-dvi',
			'gtar'  => 'application/x-gtar',
			'gz'    => 'application/x-gzip',
			'php'   => 'application/x-httpd-php',
			'php4'  => 'application/x-httpd-php',
			'php3'  => 'application/x-httpd-php',
			'phtml' => 'application/x-httpd-php',
			'phps'  => 'application/x-httpd-php-source',
			'js'    => array(
				'application/javascript',
				'application/x-javascript',
			),
			'sit'   => 'application/x-stuffit',
			'tar'   => 'application/x-tar',
			'tgz'   => array(
				'application/x-tar',
				'application/x-gzip-compressed',
			),
			'xhtml' => 'application/xhtml+xml',
			'xht'   => 'application/xhtml+xml',
			'bmp'   => array(
				'image/bmp',
				'image/x-windows-bmp',
			),
			'gif'   => 'image/gif',
			'jpeg'  => array(
				'image/jpeg',
				'image/pjpeg',
			),
			'jpg'   => array(
				'image/jpeg',
				'image/pjpeg',
			),
			'jpe'   => array(
				'image/jpeg',
				'image/pjpeg',
			),
			'png'   => array(
				'image/png',
				'image/x-png',
			),
			'tiff'  => 'image/tiff',
			'tif'   => 'image/tiff',
			'webp'  => 'image/webp',
			'avif'  => 'image/avif',
			'shtml' => 'text/html',
			'text'  => 'text/plain',
			'log'   => array(
				'text/plain',
				'text/x-log',
			),
			'rtx'   => 'text/richtext',
			'rtf'   => 'text/rtf',
			'xsl'   => 'text/xml',
			'docx'  => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'xlsx'  => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'word'  => array(
				'application/msword',
				'application/octet-stream',
			),
			'xl'    => 'application/excel',
			'eml'   => 'message/rfc822',

			// images
			'png'   => 'image/png',
			'jpe'   => 'image/jpeg',
			'jpeg'  => 'image/jpeg',
			'jpg'   => 'image/jpeg',
			'gif'   => 'image/gif',
			'bmp'   => 'image/bmp',
			'ico'   => 'image/vnd.microsoft.icon',
			'tiff'  => 'image/tiff',
			'tif'   => 'image/tiff',
			'svg'   => 'image/svg+xml',
			'svgz'  => 'image/svg+xml',

			// archives
			'zip'   => array(
				'application/x-zip',
				'application/zip',
				'application/x-zip-compressed',
			),
			'rar'   => 'application/x-rar-compressed',
			'msi'   => 'application/x-msdownload',
			'cab'   => 'application/vnd.ms-cab-compressed',

			// audio/video
			'mid'   => 'audio/midi',
			'midi'  => 'audio/midi',
			'mpga'  => 'audio/mpeg',
			'mp2'   => 'audio/mpeg',
			'mp3'   => array(
				'audio/mpeg',
				'audio/mpg',
				'audio/mpeg3',
				'audio/mp3',
			),
			'aif'   => 'audio/x-aiff',
			'aiff'  => 'audio/x-aiff',
			'aifc'  => 'audio/x-aiff',
			'ram'   => 'audio/x-pn-realaudio',
			'rm'    => 'audio/x-pn-realaudio',
			'rpm'   => 'audio/x-pn-realaudio-plugin',
			'ra'    => 'audio/x-realaudio',
			'rv'    => 'video/vnd.rn-realvideo',
			'wav'   => array(
				'audio/x-wav',
				'audio/wave',
				'audio/wav',
			),
			'mpeg'  => 'video/mpeg',
			'mpg'   => 'video/mpeg',
			'mpe'   => 'video/mpeg',
			'qt'    => 'video/quicktime',
			'mov'   => 'video/quicktime',
			'avi'   => 'video/x-msvideo',
			'movie' => 'video/x-sgi-movie',

			// adobe
			'pdf'   => 'application/pdf',
			'psd'   => array(
				'image/vnd.adobe.photoshop',
				'application/x-photoshop',
			),
			'ai'    => 'application/postscript',
			'eps'   => 'application/postscript',
			'ps'    => 'application/postscript',

			// ms office
			'doc'   => 'application/msword',
			'rtf'   => 'application/rtf',
			'xls'   => array(
				'application/excel',
				'application/vnd.ms-excel',
				'application/msexcel',
			),
			'ppt'   => array(
				'application/powerpoint',
				'application/vnd.ms-powerpoint',
			),
			// open office
			'odt'   => 'application/vnd.oasis.opendocument.text',
			'ods'   => 'application/vnd.oasis.opendocument.spreadsheet',
		);

	private Urlslab_Data_File_Pointer $file_pointer;

	private static array $system_url_paths = array();

	/**
	 * @var bool | string
	 */
	private $existing_local_file_path = false;

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct(
		array $file_arr = array(),
		$loaded_from_db = true
	) {
		$this->file_pointer = new Urlslab_Data_File_Pointer( $file_arr, $loaded_from_db );

		$this->set_fileid( $file_arr['fileid'] ?? '', $loaded_from_db );
		$this->set_url( $file_arr['url'] ?? '', $loaded_from_db );
		$this->set_parent_url( $file_arr['parent_url'] ?? '', $loaded_from_db );
		$this->set_filename( $file_arr['filename'] ?? $this->get_filename(), $loaded_from_db );
		$this->set_filestatus( $file_arr['filestatus'] ?? '', $loaded_from_db );
		$this->set_status_changed( $file_arr['status_changed'] ?? Urlslab_Data::get_now(), $loaded_from_db );
		$this->set_filehash( $file_arr['filehash'] ?? '', $loaded_from_db );
		$this->set_filesize( $file_arr['filesize'] ?? 0, $loaded_from_db );
		$this->set_local_file( $file_arr['local_file'] ?? '', $loaded_from_db );
		$this->set_webp_fileid( $file_arr['webp_fileid'] ?? '', $loaded_from_db );
		$this->set_avif_fileid( $file_arr['avif_fileid'] ?? '', $loaded_from_db );
		$this->set_filetype( $file_arr['filetype'] ?? '', $loaded_from_db );
		$this->set_labels( $file_arr['labels'] ?? '', $loaded_from_db );
		$this->set_usage_count( $file_arr['usage_count'] ?? 0, $loaded_from_db );
	}

	public function get_url(): string {
		return $this->get( 'url' );
	}

	public function get_parent_url(): string {
		return $this->get( 'parent_url' );
	}

	public function get_filestatus(): string {
		return $this->get( 'filestatus' );
	}

	public function get_filehash(): string {
		return $this->get( 'filehash' );
	}

	public function get_filesize(): int {
		return $this->get( 'filesize' );
	}

	public function get_usage_count(): int {
		return $this->get( 'usage_count' );
	}

	public function get_local_file(): string {
		return $this->get( 'local_file' );
	}

	public function get_status_changed(): string {
		return $this->get( 'status_changed' );
	}

	public function get_webp_fileid(): string {
		return $this->get( 'webp_fileid' );
	}

	public function get_avif_fileid(): string {
		return $this->get( 'avif_fileid' );
	}

	public function get_file_pointer(): Urlslab_Data_File_Pointer {
		return $this->file_pointer;
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_fileid( string $fileid, $loaded_from_db = false ): void {
		$this->set( 'fileid', $fileid, $loaded_from_db );
	}

	public function set_url( string $url, $loaded_from_db = false ): void {
		$this->set( 'url', $url, $loaded_from_db );
	}

	public function set_parent_url( string $parent_url, $loaded_from_db = false ): void {
		$this->set( 'parent_url', $parent_url, $loaded_from_db );
	}

	public function set_filename( string $filename, $loaded_from_db = false ): void {
		$this->set( 'filename', $filename, $loaded_from_db );
	}

	public function set_filestatus( string $filestatus, $loaded_from_db = false ): void {
		$this->set( 'filestatus', $filestatus, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_status_changed( self::get_now(), $loaded_from_db );
		}
	}

	public function set_usage_count( int $usage_count, $loaded_from_db = false ): void {
		$this->set( 'usage_count', $usage_count, $loaded_from_db );
	}

	public function set_local_file( string $local_file, $loaded_from_db = false ): void {
		$this->set( 'local_file', $local_file, $loaded_from_db );
	}

	public function set_status_changed( string $status_changed, $loaded_from_db = false ): void {
		$this->set( 'status_changed', $status_changed, $loaded_from_db );
	}

	public function set_webp_fileid( string $webp_fileid, $loaded_from_db = false ): void {
		$this->set( 'webp_fileid', $webp_fileid, $loaded_from_db );
	}

	public function set_avif_fileid( string $avif_fileid, $loaded_from_db = false ): void {
		$this->set( 'avif_fileid', $avif_fileid, $loaded_from_db );
	}

	public function set_filetype( string $filetype, $loaded_from_db = false ): void {
		$this->set( 'filetype', $filetype, $loaded_from_db );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function as_array(): array {
		return array_merge(
			$this->data,
			$this->file_pointer->as_array()
		);
	}

	public static function get_file( string $fileid ): ?Urlslab_Data_File {
		global $wpdb;
		$table         = URLSLAB_FILES_TABLE;
		$table_pointer = URLSLAB_FILE_POINTERS_TABLE;

		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT 
    					 f.*, 
    					 p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.width as width,
       					 p.height as height,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize 
						FROM {$table} f LEFT JOIN {$table_pointer} p ON f.filehash=p.filehash AND f.filesize=p.filesize	WHERE f.fileid=%s LIMIT 1", // phpcs:ignore
				$fileid
			),
			ARRAY_A
		);

		if ( empty( $row ) ) {
			return null;
		}

		return new Urlslab_Data_File( $row );
	}

	/**
	 * @return Urlslab_Data_File[]
	 */
	public static function get_files( array $file_ids ): array {
		global $wpdb;
		$files   = array();
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT 
    					f.*,
    					p.filehash as p_filehash,
       					 p.filesize as p_filesize,
       					 p.width as width,
       					 p.height as height,
       					 p.driver AS driver,
       					 p.webp_filehash AS webp_filehash,
       					 p.avif_filehash AS avif_filehash,
       					 p.webp_filesize AS webp_filesize,
       					 p.avif_filesize AS avif_filesize
						FROM ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ' . URLSLAB_FILE_POINTERS_TABLE . ' p ON f.filehash=p.filehash AND f.filesize=p.filesize WHERE f.fileid in (' . trim( str_repeat( '%s,', count( $file_ids ) ), ',' ) . ')', // phpcs:ignore
				$file_ids
			),
			'ARRAY_A'
		);
		foreach ( $results as $file_array ) {
			$file_obj = new Urlslab_Data_File( $file_array );
			if ( $file_obj->get_file_pointer()->get_driver_object()->file_exists( $file_obj ) ) {
				$files[ $file_obj->get_fileid() ] = $file_obj;
			}
		}

		return $files;
	}

	public function generate_file_hash( $file_name ) {
		return hash_file( 'crc32', $file_name );
	}

	public function get_fileid() {
		if ( empty( $this->get( 'fileid' ) ) && ! empty( $this->get_file_url() ) ) {
			$this->set_fileid( md5( $this->get_file_url_no_protocol() ) );
		}

		return $this->get( 'fileid' );
	}

	public function get_filename() {
		if ( empty( $this->get( 'filename' ) ) ) {
			if ( ! empty( $this->get_local_file() ) ) {
				return basename( $this->get_local_file() );
			}
			$parsed_url = parse_url( $this->get_url() );
			$this->set_filename( basename( isset( $parsed_url['path'] ) ? $parsed_url['path'] : md5( $this->get_url() ) ) );
		}

		return $this->get( 'filename' );
	}

	public function get_file_url( $append_file_name = '' ) {
		$parsed_url = parse_url( $this->get_url() );
		$scheme     = isset( $parsed_url['scheme'] ) ? $parsed_url['scheme'] . '://' : parse_url( get_site_url(), PHP_URL_SCHEME ) . '://';
		$host       = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port       = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user       = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass       = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass       = ( $user || $pass ) ? "{$pass}@" : '';
		$path       = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query      = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';

		return "{$scheme}{$user}{$pass}{$host}{$port}{$path}{$append_file_name}{$query}";
	}

	public function set_filehash( string $filehash, $loaded_from_db = false ) {
		$this->set( 'filehash', $filehash, $loaded_from_db );
		$this->get_file_pointer()->set_filehash( $filehash, $loaded_from_db );
	}

	public function set_filesize( int $file_size, $loaded_from_db = false ) {
		$this->set( 'filesize', $file_size, $loaded_from_db );
		$this->get_file_pointer()->set_filesize( $file_size, $loaded_from_db );
	}

	public function get_filetype() {
		if ( empty( $this->get( 'filetype' ) ) ) {
			$this->set_filetype( self::get_mime_type_from_filename( $this->get_filename() ) );
		}

		return $this->get( 'filetype' );
	}

	public static function get_mime_type_from_filename( $filename ) {
		$ext = explode( '.', $filename );
		$ext = strtolower( end( $ext ) );

		if ( array_key_exists( $ext, self::$mime_types ) ) {
			return ( is_array( self::$mime_types[ $ext ] ) ) ? self::$mime_types[ $ext ][0] : self::$mime_types[ $ext ];
		}
		if ( function_exists( 'finfo_open' ) ) {
			if ( file_exists( $filename ) ) {
				$finfo    = finfo_open( FILEINFO_MIME );
				$mimetype = finfo_file( $finfo, $filename );
				finfo_close( $finfo );
				$mimetype = explode( ';', $mimetype );

				return $mimetype[0];
			}
		}

		return 'application/octet-stream';
	}

	public function get_table_name(): string {
		return URLSLAB_FILES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'fileid' );
	}

	public function get_columns(): array {
		return array(
			'fileid'         => '%s',
			'url'            => '%s',
			'parent_url'     => '%s',
			'local_file'     => '%s',
			'filename'       => '%s',
			'filestatus'     => '%s',
			'filetype'       => '%s',
			'filehash'       => '%s',
			'filesize'       => '%d',
			'status_changed' => '%s',
			'webp_fileid'    => '%s',
			'avif_fileid'    => '%s',
			'labels'         => '%s',
			'usage_count'    => '%d',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'status_changed':
				return self::COLUMN_TYPE_DATE;
		}

		if ( 'filestatus' === $column ) {
			return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		if ( 'filestatus' === $column ) {
			return array(
				Urlslab_Driver::STATUS_NEW            => __( 'New', 'urlslab' ),
				Urlslab_Driver::STATUS_ACTIVE         => __( 'Available', 'urlslab' ),
				Urlslab_Driver::STATUS_ACTIVE_SYSTEM  => __( 'System File', 'urlslab' ),
				Urlslab_Driver::STATUS_PENDING        => __( 'Processing', 'urlslab' ),
				Urlslab_Driver::STATUS_NOT_PROCESSING => __( 'Not Processing', 'urlslab' ),
				Urlslab_Driver::STATUS_DISABLED       => __( 'Disabled', 'urlslab' ),
				Urlslab_Driver::STATUS_ERROR          => __( 'Error', 'urlslab' ),
			);
		}

		return parent::get_enum_column_items( $column );
	}

	private function get_file_url_no_protocol() {
		$parsed_url = parse_url( $this->get_url() );
		$host       = isset( $parsed_url['host'] ) ? $parsed_url['host'] : parse_url( get_site_url(), PHP_URL_HOST );
		$port       = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';
		$user       = isset( $parsed_url['user'] ) ? $parsed_url['user'] : '';
		$pass       = isset( $parsed_url['pass'] ) ? ':' . $parsed_url['pass'] : '';
		$pass       = ( $user || $pass ) ? "{$pass}@" : '';
		$path       = isset( $parsed_url['path'] ) ? $parsed_url['path'] : '';
		$query      = isset( $parsed_url['query'] ) ? '?' . $parsed_url['query'] : '';

		return "{$user}{$pass}{$host}{$port}{$path}{$query}";
	}

	public static function update_usage_count( $file_ids = array() ) {
		global $wpdb;

		if ( empty( $file_ids ) ) {
			$wpdb->query( 'UPDATE ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ( SELECT fileid, count(*) as cnt FROM ' . URLSLAB_FILE_URLS_TABLE . ' GROUP by fileid ) as c ON f.fileid=c.fileid SET f.usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_FILES_TABLE . ' f LEFT JOIN ( SELECT fileid, count(*) as cnt FROM ' . URLSLAB_FILE_URLS_TABLE . ' WHERE fileid IN (' . implode( ',', array_fill( 0, count( $file_ids ), '%s' ) ) . ') GROUP by fileid ) as c ON f.fileid=c.fileid SET f.usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE f.fileid IN (' . implode( ',', array_fill( 0, count( $file_ids ), '%s' ) ) . ')', ...$file_ids, ...$file_ids ) ); // phpcs:ignore
		}
	}


	/**
	 * @return string Empty if file represented by URL doesn't exist on file system
	 */
	public function get_existing_local_file(): string {
		if ( strlen( $this->get_url() ) && false !== $this->existing_local_file_path ) {
			return $this->existing_local_file_path;
		}

		try {
			$url_obj = new Urlslab_Url( $this->get_url(), true );
		} catch ( Exception $e ) {
			return '';
		}

		if ( empty( self::$system_url_paths ) ) {
			self::$system_url_paths                                   = array();
			self::$system_url_paths[ wp_get_upload_dir()['basedir'] ] = new Urlslab_Url( wp_get_upload_dir()['baseurl'], true );
			self::$system_url_paths[ WP_PLUGIN_DIR ]                  = new Urlslab_Url( WP_PLUGIN_URL, true );
			self::$system_url_paths[ WPMU_PLUGIN_DIR ]                = new Urlslab_Url( WPMU_PLUGIN_URL, true );
			self::$system_url_paths[ WP_CONTENT_DIR ]                 = new Urlslab_Url( WP_CONTENT_URL, true );
			if ( defined( 'WP_SITEURL' ) ) {
				self::$system_url_paths[ ABSPATH ] = new Urlslab_Url( WP_SITEURL, true );
			}
		}

		foreach ( self::$system_url_paths as $system_dir => $system_url_obj ) {
			if ( $url_obj->get_domain_id() === $system_url_obj->get_domain_id() && strpos( $url_obj->get_url_path(), $system_url_obj->get_url_path() ) === 0 ) {
				$url_path = substr( $url_obj->get_url_path(), strlen( $system_url_obj->get_url_path() ) );

				$this->existing_local_file_path = realpath( $system_dir . $url_path );

				return $this->existing_local_file_path;
			}
		}

		$this->existing_local_file_path = '';

		return $this->existing_local_file_path;
	}

	public function is_uploaded_file(): bool {
		$file_name = $this->get_existing_local_file();

		return ! empty( $file_name ) && str_starts_with( $file_name, wp_get_upload_dir()['basedir'] );
	}

	public function is_system_file(): bool {
		$file_name = $this->get_existing_local_file();

		return ! empty( $file_name ) && ! $this->is_uploaded_file();
	}
}
