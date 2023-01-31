<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\S3\MultipartUploader;

class Urlslab_Driver_S3 extends Urlslab_Driver {

	private $client;

	function get_file_content( Urlslab_File_Data $file ) {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ),
				'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
			)
		);

		$content = '';
		$result['Body']->rewind();
		while ( $data = $result['Body']->read( 8 * 1024 ) ) {
			$content .= $data;
		}

		return $content;
	}

	function output_file_content( Urlslab_File_Data $file ) {
		if ( ! $this->is_configured() ) {
			return;
		}

		$this->sanitize_output();

		$result = $this->getClient()->getObject(
			array(
				'Bucket' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ),
				'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
			)
		);

		$result['Body']->rewind();
		while ( $data = $result['Body']->read( 8 * 1024 ) ) {
			echo $data; // phpcs:ignore
			ob_flush();
			flush();
		}
	}

	function save_file_to_storage( Urlslab_File_Data $file, string $local_file_name ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		// Prepare the upload parameters.
		$uploader = new MultipartUploader(
			$this->getClient(),
			$local_file_name,
			array(
				'Bucket' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ),
				'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
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
		return self::URLSLAB_DIR . $file->get( 'filesize' ) . '/' . $file->get( 'filehash' ) . '/';
	}

	public function get_url( Urlslab_File_Data $file ) {
		if ( $this->is_configured() ) {
			$prefix = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_URL_PREFIX, '' );
			if ( ! empty( $prefix ) ) {
				// in case CDN is configured with custom url prefix to load static files from S3 directly
				return $prefix . urlencode( $this->get_file_dir( $file ) ) . urlencode( $file->get_filename() );
			}

			//we will proxy content of file
			return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
		}

		return false;
	}

	function is_connected() {
		return $this->is_configured() && $this->getClient()->doesBucketExist( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ) );
	}

	private function get_access_key() {
		if ( strlen( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_ACCESS_KEY, '' ) ) ) {
			return get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_ACCESS_KEY, '' );
		}

		if ( strlen( env( 'AWS_KEY' ) ) ) {
			return env( 'AWS_KEY' );
		}

		return false;
	}

	private function get_secret_key() {
		if ( strlen( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_SECRET, '' ) ) ) {
			return get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_SECRET, '' );
		}

		if ( strlen( env( 'AWS_SECRET' ) ) ) {
			return env( 'AWS_SECRET' );
		}

		return false;
	}

	private function getClient(): S3Client {
		if ( $this->client ) {
			return $this->client;
		}

		$credentials  = new Aws\Credentials\Credentials( $this->get_access_key(), $this->get_secret_key() );
		$this->client = new S3Client(
			array(
				'version'     => 'latest',
				'region'      => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_REGION, '' ),
				'credentials' => $credentials,
			)
		);

		return $this->client;
	}

	private function is_configured() {
		return ! empty( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_REGION, '' ) ) &&
			   strlen( $this->get_access_key() ) &&
			   strlen( $this->get_secret_key() ) &&
			   ! empty( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ) );
	}

	public function save_to_file( Urlslab_File_Data $file, $file_name ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ),
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

	public function delete_content( Urlslab_File_Data $file ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		try {
			$result = $this->getClient()->deleteObject(
				array(
					'Bucket' => get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET, '' ),
					'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
				)
			);
		} catch ( \Aws\S3\Exception\S3Exception $e ) {
			return false;
		}

		return true;
	}

	public function get_driver_code(): string {
		return self::DRIVER_S3;
	}
}
