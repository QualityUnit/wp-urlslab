<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\S3\MultipartUploader;

class Urlslab_Driver_S3 extends Urlslab_Driver {
	const SETTING_NAME_S3_BUCKET = 'urlslab_AWS_S3_bucket';
	private string $aws_s3_bucket = '';
	const SETTING_NAME_S3_REGION = 'urlslab_AWS_S3_region';
	private string $aws_s3_region = '';
	const SETTING_NAME_S3_ACCESS_KEY = 'urlslab_AWS_S3_access_key';
	private string $aws_s3_access_key = '';
	const SETTING_NAME_S3_SECRET = 'urlslab_AWS_S3_secret';
	private string $aws_s3_secret = '';
	const SETTING_NAME_S3_URL_PREFIX = 'urlslab_AWS_S3_url_prefix';
	private string $aws_s3_url_prefix = '';

	private $client;

	/**
	 */
	public function __construct() {
		$option = get_option( 'urlslab_s3driver_configuration' );
		if ( is_array( $option ) &&
			 count( $option ) == 5 &&
			 ( isset( $option[ self::SETTING_NAME_S3_ACCESS_KEY ] ) && ! empty( $option[ self::SETTING_NAME_S3_ACCESS_KEY ] ) ) &&
			 ( isset( $option[ self::SETTING_NAME_S3_BUCKET ] ) && ! empty( $option[ self::SETTING_NAME_S3_BUCKET ] ) ) &&
			 ( isset( $option[ self::SETTING_NAME_S3_REGION ] ) && ! empty( $option[ self::SETTING_NAME_S3_REGION ] ) ) &&
			 ( isset( $option[ self::SETTING_NAME_S3_SECRET ] ) && ! empty( $option[ self::SETTING_NAME_S3_SECRET ] ) ) &&
			 ( isset( $option[ self::SETTING_NAME_S3_URL_PREFIX ] ) && ! empty( $option[ self::SETTING_NAME_S3_URL_PREFIX ] ) )
		) {
			$this->aws_s3_bucket = $option[ self::SETTING_NAME_S3_BUCKET ];
			$this->aws_s3_region = $option[ self::SETTING_NAME_S3_REGION ];
			$this->aws_s3_access_key = $option[ self::SETTING_NAME_S3_ACCESS_KEY ];
			$this->aws_s3_secret = $option[ self::SETTING_NAME_S3_SECRET ];
			$this->aws_s3_url_prefix = $option[ self::SETTING_NAME_S3_URL_PREFIX ];
		}
	}


	function get_file_content( Urlslab_File_Data $file_obj ) {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->aws_s3_bucket,
				'Key'    => $this->get_file_dir( $file_obj ) . $file_obj->get_filename(),
			)
		);

		$content = '';
		$result['Body']->rewind();
		while ( $data = $result['Body']->read( 8 * 1024 ) ) {
			$content .= $data;
		}
		return $content;
	}

	function output_file_content( Urlslab_File_Data $file_obj ) {
		if ( ! $this->is_configured() ) {
			return;
		}

		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->aws_s3_bucket,
				'Key'    => $this->get_file_dir( $file_obj ) . $file_obj->get_filename(),
			)
		);

		$result['Body']->rewind();
		while ( $data = $result['Body']->read( 8 * 1024 ) ) {
			echo $data; // phpcs:ignore
			ob_flush();
			flush();
		}
	}

	function save_file_to_storage( Urlslab_File_Data $file_obj, string $local_file_name ):bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		// Prepare the upload parameters.
		$uploader = new MultipartUploader(
			$this->getClient(),
			$local_file_name,
			array(
				'Bucket' => $this->aws_s3_bucket,
				'Key'    => $this->get_file_dir( $file_obj ) . $file_obj->get_filename(),
			)
		);

		try {
			$result = $uploader->upload();
			return isset( $result['ObjectURL'] );
		} catch ( MultipartUploadException $e ) {
			return false;
		}
	}

	private function get_file_dir( Urlslab_File_Data $file ) {
		return self::URLSLAB_DIR . substr( $file->get_fileid(), 0, 2 ) . '/';
	}

	public function get_url( Urlslab_File_Data $file ) {
		if ( $this->is_configured() ) {
			if ( $this->aws_s3_url_prefix ) {
				// in case CDN is configured with custom url prefix to load static files from S3 directly
				return $this->aws_s3_url_prefix . $this->get_file_dir( $file ) . $file->get_filename();
			}

			//we will proxy content of file
			return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
		}
		return false;
	}

	function is_connected() {
		return $this->is_configured() && $this->getClient()->doesBucketExist( $this->aws_s3_bucket );
	}

	private function getClient(): S3Client {
		if ( $this->client ) {
			return $this->client;
		}

		$credentials = new Aws\Credentials\Credentials( $this->aws_s3_access_key, $this->aws_s3_secret );
		$this->client = new S3Client(
			array(
				'version' => 'latest',
				'region' => $this->aws_s3_region,
				'credentials' => $credentials,
			)
		);
		return $this->client;
	}

	private function is_configured() {
		return $this->aws_s3_region && $this->aws_s3_access_key && $this->aws_s3_bucket && $this->aws_s3_secret;
	}

	public function save_to_file( Urlslab_File_Data $file, $file_name ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->aws_s3_bucket,
				'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
			)
		);

		$fhandle = fopen( $file_name, 'wb' );
		$result['Body']->rewind();
		while ( $data = $result['Body']->read( 8 * 1024 ) ) {
			fwrite( $fhandle, $data );
		}
		fclose( $fhandle );
		return true;
	}

	public static function get_driver_settings(): array {
		$option = get_option( 'urlslab_s3driver_configuration' );
		if (
			! is_array( $option ) ||
			count( $option ) != 5 ||
			! isset( $option[ self::SETTING_NAME_S3_ACCESS_KEY ] ) ||
			! isset( $option[ self::SETTING_NAME_S3_BUCKET ] ) ||
			! isset( $option[ self::SETTING_NAME_S3_REGION ] ) ||
			! isset( $option[ self::SETTING_NAME_S3_SECRET ] ) ||
			! isset( $option[ self::SETTING_NAME_S3_URL_PREFIX ] )
		) {
			return array(
				self::SETTING_NAME_S3_ACCESS_KEY => '',
				self::SETTING_NAME_S3_BUCKET => '',
				self::SETTING_NAME_S3_REGION => '',
				self::SETTING_NAME_S3_SECRET => '',
				self::SETTING_NAME_S3_URL_PREFIX => '',
			);
		}

		return $option;
	}

	public static function update_options( array $new_options ) {
		$option = get_option( 'urlslab_s3driver_configuration' );
		update_option(
			'urlslab_s3driver_configuration',
			array_merge( $option, $new_options )
		);
	}

	public static function remove_options() {
		update_option(
			'urlslab_s3driver_configuration',
			array()
		);
	}
}
