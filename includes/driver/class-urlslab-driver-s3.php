<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\S3\MultipartUploader;

class Urlslab_Driver_S3 extends Urlslab_Driver {
	const SETTING_NAME_S3_BUCKET = 'urlslab_awss3_bucket';
	const SETTING_NAME_S3_REGION = 'urlslab_awss3_region';
	const SETTING_NAME_S3_ACCESS_KEY = 'urlslab_awss3_acckey';
	const SETTING_NAME_S3_SECRET = 'urlslab_awss3_secret';
	const SETTING_NAME_S3_URL_PREFIX = 'urlslab_awss3_url_prefix';

	private $client;

	function get_file_content( Urlslab_File_Data $file_obj ) {
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->get_bucket_name(),
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
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->get_bucket_name(),
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
		// Prepare the upload parameters.
		$uploader = new MultipartUploader(
			$this->getClient(),
			$local_file_name,
			array(
				'Bucket' => $this->get_bucket_name(),
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
		//TODO we can use also php proxy to access files in S3 or custom CDN url
		return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );

		return get_option( self::SETTING_NAME_S3_URL_PREFIX, 'https://cdn.s3.liveagent.com' ) . $this->get_file_dir( $file ) . $file->get_filename();
	}

	function is_connected() {
		if (
			! $this->get_bucket_name() ||
			! $this->get_access_key() ||
			! $this->get_secret()
		) {
			return false;
		}
		return $this->getClient()->doesBucketExist( $this->get_bucket_name() );
	}

	private function getClient(): S3Client {
		if ( $this->client ) {
			return $this->client;
		}

		$credentials = new Aws\Credentials\Credentials( $this->get_access_key(), $this->get_secret() );
		$this->client = new S3Client(
			array(
				'version' => 'latest',
				'region' => $this->get_region(),
				'credentials' => $credentials,
			)
		);
		return $this->client;
	}

	/**
	 * @return false|mixed|void
	 */
	private function get_region() {
		return get_option( self::SETTING_NAME_S3_REGION );
	}

	private function get_bucket_name() {
		return get_option( self::SETTING_NAME_S3_BUCKET );
	}

	/**
	 * @return false|mixed|void
	 */
	private function get_access_key() {
		//TODO remove default value
		return get_option( self::SETTING_NAME_S3_ACCESS_KEY );
	}

	/**
	 * @return false|mixed|void
	 */
	private function get_secret() {
		//TODO remove default value
		return get_option( self::SETTING_NAME_S3_SECRET );
	}

}
