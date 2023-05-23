<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

use Aws\S3\Exception\S3Exception;
use Aws\S3\MultipartUploader;
use Aws\S3\S3Client;

class Urlslab_Driver_S3 extends Urlslab_Driver {
	private $client;

	public const AWS_REGIONS = array(
		'us-east-2'      => 'us-east-2 US East (Ohio)',
		'us-east-1'      => 'us-east-1 US East (N. Virginia)',
		'us-west-1'      => 'us-west-1 US West (N. California)',
		'us-west-2'      => 'us-west-2 US West (Oregon)',
		'af-south-1'     => 'af-south-1 Africa (Cape Town)',
		'ap-east-1'      => 'ap-east- Asia Pacific (Hong Kong)',
		'ap-south-2'     => 'ap-south-2 Asia Pacific (Hyderabad)',
		'ap-southeast-3' => 'ap-southeast-3 Asia Pacific (Jakarta)',
		'ap-southeast-4' => 'ap-southeast-4 Asia Pacific (Melbourne)',
		'ap-south-1'     => 'ap-south-1 Asia Pacific (Mumbai)',
		'ap-northeast-3' => 'ap-northeast-3 Asia Pacific (Osaka)',
		'ap-northeast-2' => 'ap-northeast-2 Asia Pacific (Seoul)',
		'ap-southeast-1' => 'ap-southeast-1 Asia Pacific (Singapore)',
		'ap-southeast-2' => 'ap-southeast-2 Asia Pacific (Sydney)',
		'ap-northeast-1' => 'ap-northeast-1 Asia Pacific (Tokyo)',
		'ca-central-1'   => 'ca-central-1 Canada (Central)',
		'eu-central-1'   => 'eu-central-1 Europe (Frankfurt)',
		'eu-west-1'      => 'eu-west-1 Europe (Ireland)',
		'eu-west-2'      => 'eu-west-2 Europe (London)',
		'eu-south-1'     => 'eu-south- Europe (Milan)',
		'eu-west-3'      => 'eu-west-3 Europe (Paris)',
		'eu-south-2'     => 'eu-south-2 Europe (Spain)',
		'eu-north-1'     => 'eu-north-1 Europe (Stockholm)',
		'eu-central-2'   => 'eu-central-2 Europe (Zurich)',
		'me-south-1'     => 'me-south-1 Middle East (Bahrain)',
		'me-central-1'   => 'me-central-1 Middle East (UAE)',
		'sa-east-1'      => 'sa-east-1 South America (São Paulo)',
		'us-gov-east-1'  => 'us-gov-east-1 AWS GovCloud (US-East)',
		'us-gov-west-1'  => 'us-gov-west-1 AWS GovCloud (US-West)',
	);

	public function get_file_content( Urlslab_File_Row $file ) {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ),
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

	public function output_file_content( Urlslab_File_Row $file ) {
		if ( ! $this->is_configured() ) {
			return;
		}

		$this->sanitize_output();

		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ),
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

	public function save_file_to_storage( Urlslab_File_Row $file, string $local_file_name ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		// Prepare the upload parameters.
		$uploader = new MultipartUploader(
			$this->getClient(),
			$local_file_name,
			array(
				'Bucket' => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ),
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

	public function get_url( Urlslab_File_Row $file ) {
		if ( $this->is_configured() ) {
			$prefix = $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_URL_PREFIX );
			if ( ! empty( $prefix ) ) {
				// in case CDN is configured with custom url prefix to load static files from S3 directly
				return $prefix . urlencode( $this->get_file_dir( $file ) ) . urlencode( $file->get_filename() );
			}

			// we will proxy content of file
			return site_url( self::DOWNLOAD_URL_PATH . urlencode( $file->get_fileid() ) . '/' . urlencode( $file->get_filename() ) );
		}

		return false;
	}

	public function is_connected() {
		return $this->is_configured() && $this->getClient()->doesBucketExist( $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ) );
	}

	public function save_to_file( Urlslab_File_Row $file, $file_name ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}
		$result = $this->getClient()->getObject(
			array(
				'Bucket' => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ),
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

	public function delete_content( Urlslab_File_Row $file ): bool {
		if ( ! $this->is_configured() ) {
			return false;
		}

		try {
			$result = $this->getClient()->deleteObject(
				array(
					'Bucket' => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ),
					'Key'    => $this->get_file_dir( $file ) . $file->get_filename(),
				)
			);
		} catch ( S3Exception $e ) {
			return false;
		}

		return true;
	}

	public function get_driver_code(): string {
		return self::DRIVER_S3;
	}

	private function get_file_dir( Urlslab_File_Row $file ) {
		return self::URLSLAB_DIR . $file->get_filesize() . '/' . $file->get_filehash() . '/';
	}

	private function get_access_key() {
		return $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_ACCESS_KEY );
	}

	private function get_secret_key() {
		return $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_SECRET );
	}

	private function getClient(): S3Client {
		if ( $this->client ) {
			return $this->client;
		}

		$credentials  = new Aws\Credentials\Credentials( $this->get_access_key(), $this->get_secret_key() );
		$this->client = new S3Client(
			array(
				'version'     => 'latest',
				'region'      => $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_REGION ),
				'credentials' => $credentials,
			)
		);

		return $this->client;
	}

	private function is_configured() {
		return ! empty( $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_REGION ) )
			   && strlen( $this->get_access_key() )
			   && strlen( $this->get_secret_key() )
			   && ! empty( $this->get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_S3_BUCKET ) );
	}
}
