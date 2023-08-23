<?php

/** @noinspection SlowArrayOperationsInLoopInspection */
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-file.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-s3.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-db.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-row.php';

// phpcs:disable WordPress.NamingConventions
class Urlslab_Media_Offloader_Widget extends Urlslab_Widget {
	public const SLUG = 'urlslab-media-offloader';

	public const SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = 'urlslab_import_post_attachements';
	public const SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = true;

	// automatically offload external images found in every page content (starting with damain name different as current page)
	public const SETTING_NAME_SAVE_EXTERNAL = 'urlslab_save_external_resources';
	// automatically offload internal images found in every page content (starting with damain name same as current page)
	public const SETTING_NAME_SAVE_INTERNAL = 'urlslab_save_internal_resources';

	public const SETTING_NAME_NEW_FILE_DRIVER = 'urlslab_file_driver';
	public const SETTING_DEFAULT_NEW_FILE_DRIVER = Urlslab_Driver::DRIVER_LOCAL_FILE;

	// TRANSFER SETTINGS
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES = 'urlslab_transfer_all_data_from_local_files';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_S3 = 'urlslab_transfer_all_data_from_s3';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_DB = 'urlslab_transfer_all_data_from_database';
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES = true;
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3 = false;
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB = false;

	public const SETTING_NAME_DELETE_AFTER_TRANSFER = 'urlslab_transfer_del';
	public const SETTING_DEFAULT_DELETE_AFTER_TRANSFER = false;

	// WEBP CONVERSION SETTINGS
	public const SETTING_NAME_USE_WEBP_ALTERNATIVE = 'urlslab_use_webp';
	public const SETTING_NAME_WEBP_TYPES_TO_CONVERT = 'urlslab_webp_types';
	public const SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT
		= array(
			'image/png',
			'image/jpeg',
			'image/bmp',
		);
	public const SETTING_NAME_WEPB_QUALITY = 'urlslab_webp_quality';
	public const SETTING_DEFAULT_WEPB_QUALITY = 80;

	// AVIF CONVERSION SETTINGS
	public const SETTING_NAME_USE_AVIF_ALTERNATIVE = 'urlslab_use_avif';
	public const SETTING_NAME_AVIF_TYPES_TO_CONVERT = 'urlslab_avif_types';
	public const SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT
		= array(
			'image/png',
			'image/jpeg',
			'image/bmp',
		);
	public const SETTING_NAME_AVIF_QUALITY = 'urlslab_avif_quality';

	// quality: The accepted values are 0 (worst quality) through 100 (highest quality). Any integers out of this range are clamped to the 0-100 range.
	public const SETTING_DEFAULT_AVIF_QUALITY = 80;
	public const SETTING_NAME_AVIF_SPEED = 'urlslab_avif_speed';

	// speed: Default value 6. Accepted values are int the range of 0 (slowest) through 10 (fastest). Integers outside the 0-10 range are clamped.
	public const SETTING_DEFAULT_AVIF_SPEED = 5;
	public const SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME = 'urlslab_media_cache_expire';

	public const SETTING_NAME_IMAGE_RESIZING = 'urlslab_img_resize';
	public const SETTING_DEFAULT_IMAGE_RESIZING = 1;

	public const SETTING_NAME_LOG_IMAGES = 'urlslab_img_log';
	public const SETTING_NAME_HIDE_ERROR_IMAGES = 'urlslab_img_hide_err';
	public const SETTING_NAME_IMG_MIN_WIDTH = 'urlslab_img_min_width';

	public const SETTING_NAME_S3_BUCKET = 'urlslab_AWS_S3_bucket';
	public const SETTING_NAME_S3_REGION = 'urlslab_AWS_S3_region';
	public const SETTING_NAME_S3_ACCESS_KEY = 'urlslab_AWS_S3_access_key';
	public const SETTING_NAME_S3_SECRET = 'urlslab_AWS_S3_secret';
	public const SETTING_NAME_S3_URL_PREFIX = 'urlslab_AWS_S3_url_prefix';

	private const URLSLAB_MIN_WIDTH = 'urlslab-min-width-';

	private array $parent_urls = array();

	/**
	 * @var Urlslab_File_Row[]
	 */
	private $files = array();

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_handle_upload', $this, 'wp_handle_upload', 10, 1 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'the_content', 20 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Media_Offloader_Widget::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Media Manager' );
	}

	public function get_widget_description(): string {
		return __( 'Accelerate your website\'s speed with automated image optimization and offloading images to a database' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function wp_handle_upload( $file, $overrides = false, $time = null ) {
		$file_obj = new Urlslab_File_Row(
			array(
				'url'            => $file['url'],
				'local_file'     => $file['file'],
				'filetype'       => $file['type'],
				'filename'       => basename( $file['file'] ),
				'filesize'       => filesize( $file['file'] ),
				'filestatus'     => Urlslab_Driver::STATUS_NEW,
				'status_changed' => Urlslab_Data::get_now(),
				'driver'         => $this->get_option( self::SETTING_NAME_NEW_FILE_DRIVER ),
			),
			false
		);
		$file_obj->get_fileid(); // init fileid before insert

		$driver = $file_obj->get_file_pointer()->get_driver_object();
		if ( $driver->is_connected() && $file_obj->insert() ) {
			$driver->upload_content( $file_obj );
		}

		return $file;
	}

	public function the_content( DOMDocument $document ) {
		if ( is_admin() ) {
			return;
		}
		$this->process_offloading( $document );
		if ( $this->get_option( self::SETTING_NAME_IMG_MIN_WIDTH ) ) {
			$this->process_min_width( $document );
		}
	}

	public function process_min_width( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[ancestor-or-self::*[contains(@class, '" . self::URLSLAB_MIN_WIDTH . "') and not(contains(@class, 'urlslab-skip-all')) and not(starts-with(@src, 'data:')) and not(ancestor::*[@id='wpadminbar'])]]" );
		foreach ( $dom_elements as $img_element ) {
			$this->add_min_width_to_img( $document, $img_element );
		}
	}

	public function process_offloading( DOMDocument $document ) {
		try {
			$found_urls          = array();
			$url_fileids         = array();
			$elements_to_process = array();
			$element_ids_cnt     = 0;

			// *********************************
			// find all elements to process
			// *********************************
			foreach ( Urlslab_Lazy_Loading::get_supported_media() as $tag_name => $tag_attributes ) {
				$xpath        = new DOMXPath( $document );
				$dom_elements = $xpath->query( '//' . $tag_name . "[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-offload')]) and not(ancestor::*[@id='wpadminbar'])]" );

				if ( empty( $dom_elements ) ) {
					continue;
				}
				foreach ( $dom_elements as $dom_element ) {
					if ( $this->is_skip_elemenet( $dom_element, 'offload' ) ) {
						continue;
					}
					foreach ( $tag_attributes as $attribute ) {
						if ( strlen( $dom_element->getAttribute( $attribute ) ) && 0 !== strpos( $dom_element->getAttribute( $attribute ), 'data:' ) ) {
							$urlvalues = explode( ',', $dom_element->getAttribute( $attribute ) );
							foreach ( $urlvalues as $url_value ) {
								$url_val  = explode( ' ', trim( $url_value ) );
								$file_obj = new Urlslab_File_Row( array( 'url' => $url_val[0] ), false );

								if ( ! $dom_element->hasAttribute( 'urlslab-id' ) ) {
									$dom_element->setAttribute( 'urlslab-id', $element_ids_cnt ++ );
								}
								$url_fileids[ $file_obj->get_fileid() ]                                         = $url_val[0];
								$elements_to_process[ $tag_name ][ $dom_element->getAttribute( 'urlslab-id' ) ] = $dom_element;
							}
						}
					}
				}
			}

			// search urls in style attributes
			$xpath           = new DOMXPath( $document );
			$styled_elements = $xpath->query( "//*[contains(@style, 'url') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-offload')]) and not(ancestor::*[@id='wpadminbar'])]" );
			foreach ( $styled_elements as $styled_element ) {
				if ( ! $this->is_skip_elemenet( $styled_element, 'offload' ) && preg_match_all( '/url\((.*?)\)/', $styled_element->getAttribute( 'style' ), $matches ) ) {
					foreach ( $matches[1] as $matched_url ) {
						$file_obj = new Urlslab_File_Row( array( 'url' => $matched_url ), false );
						if ( ! $styled_element->hasAttribute( 'urlslab-id' ) ) {
							$styled_element->setAttribute( 'urlslab-id', $element_ids_cnt ++ );
						}
						$url_fileids[ $file_obj->get_fileid() ]                                        = $matched_url;
						$elements_to_process['style'][ $styled_element->getAttribute( 'urlslab-id' ) ] = $styled_element;
					}
				}
			}

			// *********************************
			// find files for elements
			// *********************************
			$this->files = $this->get_files_for_urls( array_keys( $url_fileids ) );
			$this->log_file_usage( $url_fileids );

			// *********************************
			// process elements from page
			// *********************************

			foreach ( $elements_to_process as $tag_name => $tag_elements ) {
				foreach ( $tag_elements as $element_id => $dom_element ) {
					switch ( $tag_name ) {
						case 'img':
							$found_urls = array_merge( $this->process_img_tag( $dom_element, $document ), $found_urls );

							break;

						case 'source':
							$found_urls = array_merge( $this->process_source_tag( $dom_element, $document ), $found_urls );

							break;

						case 'audio': // for now we don't have alternatives for audio files
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );

							break;

						case 'video': // for now we don't have alternatives for video files
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );

							break;

						case 'style': // for now we don't have alternatives for video files
							$found_urls = array_merge( $this->replace_style_attribute( $dom_element ), $found_urls );

							break;

						default:
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
					}
				}
			}

			// remove files we know already from the list of missing files
			foreach ( $this->files as $fileid => $file_obj ) {
				unset( $url_fileids[ $fileid ] );
			}
			$this->schedule_missing_images( $url_fileids );
		} catch ( Exception $e ) {
			// TODO log error
		}
	}

	public function output_content() {
		global $_SERVER;

		if ( isset( $_GET['action'] ) && isset( $_GET['fileid'] ) && Urlslab_Driver::DOWNLOAD_URL_PATH === $_GET['action'] ) {
			$fileid = $_GET['fileid'];
		} else {
			if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
				return 'Path to file not detected.';
			}
			$path   = pathinfo( $_SERVER['REQUEST_URI'] );
			$dirs   = explode( '/', $path['dirname'] );
			$fileid = array_pop( $dirs );
		}

		$file = Urlslab_File_Row::get_file( $fileid );

		if ( empty( $file ) ) {
			status_header( 404 );

			exit( 'File not found' );
		}

		@set_time_limit( 0 );

		status_header( 200 );
		header( 'Content-Type: ' . $file->get_filetype() );
		header( 'Content-Disposition: inline; filename="' . $file->get_filename() . '"' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		$expires_offset = $this->get_option( self::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME );
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age={$expires_offset}" );
		header( 'Content-length: ' . $file->get_file_pointer()->get_filesize() );

		$file->get_file_pointer()->get_driver_object()->output_file_content( $file );
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Cache and Monitoring' ), __( 'This plugin effortlessly monitors and stores images on your site, enhancing performance and user experience.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_LOG_IMAGES,
			true,
			true,
			__( 'Monitor Images Usage' ),
			__( 'It will analyze all website images, simplifying the process of locating their exact usage.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_HIDE_ERROR_IMAGES,
			true,
			true,
			__( 'Hide Invalid Images' ),
			__( 'Hide all invalid images from the website content that generate, for instance, a 404 error.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME,
			31536000,
			true,
			__( 'Cache Expiration' ),
			__( 'Specify caching duration for images in the browser or CDN.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				3600     => __( 'One hour' ),
				28800    => __( 'Eight hours' ),
				86400    => __( 'One day' ),
				604800   => __( 'One week' ),
				2592000  => __( 'One moth' ),
				7776000  => __( 'Three months' ),
				15552000 => __( 'Six months' ),
				31536000 => __( 'One year' ),
				0        => __( 'No cache' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'main'
		);

		$this->add_options_form_section( 'offloading', __( 'Media Offloading Configuration' ), __( 'Storing images across different locations brings many benefits. It aids in quick content delivery to your visitors, allows for simultaneous use of multiple storages, and lets you assign a specific storage for a given image. This enhances both image management and user experience.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_NEW_FILE_DRIVER,
			self::SETTING_DEFAULT_NEW_FILE_DRIVER,
			true,
			__( 'Default Driver' ),
			__( 'The driver utilized for media offloading.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Driver::DRIVER_DB         => __( 'Database' ),
				Urlslab_Driver::DRIVER_LOCAL_FILE => __( 'Local File System' ),
				//TODO S3				Urlslab_Driver::DRIVER_S3         => __( 'Cloud - AWS S3' ),
			),
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			self::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			false,
			__( 'Background Offloading of WordPress Media' ),
			__( 'Offloading all media uploaded in WordPress in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_INTERNAL,
			true,
			true,
			__( 'Offload Found Internal Media' ),
			__( 'Transfer internal media to the current driver.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_EXTERNAL,
			false,
			true,
			__( 'Offload Found External Media ' ),
			__( 'Transfer external media to the current driver.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			false,
			__( 'Transfer Media From Local File System to the Default Driver' ),
			__( 'Transfer all media from Local File Storage to the currently selected default driver in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB,
			false,
			__( 'Transfer Media From Database to the Default Driver' ),
			__( 'Transfer all media from Database to the currently selected default driver in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		//		$this->add_option_definition(
		//			self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3,
		//			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3,
		//			false,
		//			__( 'Transfer Media From S3 to the Default Driver' ),
		//			__( 'Transfer all media from AWS S3 to the currently selected default driver in the background.' ),
		//			self::OPTION_TYPE_CHECKBOX,
		//			false,
		//			null,
		//			'offloading'
		//		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_AFTER_TRANSFER,
			self::SETTING_DEFAULT_DELETE_AFTER_TRANSFER,
			false,
			__( 'Delete Original File After Transfer' ),
			__( 'Remove the file from the original storage once the transfer is finished. Currently, we only remove files if they originated from the database or object storage. We don\'t remove files from the Local File System.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		//		$this->add_options_form_section( 's3', __( 'AWS S3 Storage Driver Configuration' ), 'AWS S3 provides an efficient method for data storage. In the AWS Console, you can create an S3 bucket to store your data securely. This section allows you to configure everything required to use AWS S3 storage for your website. For those not wishing to store credentials in the database, environmental variables are a viable option.' );
		//		// S3 settings
		//		$this->add_option_definition(
		//			self::SETTING_NAME_S3_ACCESS_KEY,
		//			'',
		//			true,
		//			__( 'AWS S3 Access Key' ),
		//			__( 'Leave empty if the AWS Access Key should be loaded from the environment variable `AWS_KEY`.' ),
		//			self::OPTION_TYPE_TEXT,
		//			false,
		//			null,
		//			's3'
		//		);
		//
		//		$this->add_option_definition(
		//			self::SETTING_NAME_S3_SECRET,
		//			'',
		//			true,
		//			__( 'AWS S3 Key Secret' ),
		//			__( 'Leave empty if AWS Secret Key should be loaded from environment variable `AWS_SECRET`.' ),
		//			self::OPTION_TYPE_PASSWORD,
		//			false,
		//			null,
		//			's3'
		//		);
		//
		//		$this->add_option_definition(
		//			self::SETTING_NAME_S3_REGION,
		//			'',
		//			true,
		//			__( 'AWS S3 Region' ),
		//			'Choose the appropriate region where your object storage is located.',
		//			self::OPTION_TYPE_LISTBOX,
		//			Urlslab_Driver_S3::AWS_REGIONS,
		//			null,
		//			's3'
		//		);
		//
		//		$this->add_option_definition(
		//			self::SETTING_NAME_S3_BUCKET,
		//			'',
		//			true,
		//			__( 'AWS S3 Bucket' ),
		//			__( 'The bucket\'s name that will host the media.' ),
		//			self::OPTION_TYPE_TEXT,
		//			false,
		//			null,
		//			's3'
		//		);
		//
		//		$this->add_option_definition(
		//			self::SETTING_NAME_S3_URL_PREFIX,
		//			'',
		//			true,
		//			__( 'AWS S3 URL Prefix' ),
		//			__( 'Enter the CDN domain for media offloading. Leave empty if the CDN is not configured.' ),
		//			self::OPTION_TYPE_TEXT,
		//			false,
		//			null,
		//			's3'
		//		);
		//		$this->add_option_definition(
		//			'btn_validate_s3',
		//			'file/validate_s3',
		//			false,
		//			__( 'Validate S3 Connection' ),
		//			__( 'Validate if the S3 connection is working.' ),
		//			self::OPTION_TYPE_BUTTON_API_CALL,
		//			false,
		//			null,
		//			's3'
		//		);

		$this->add_options_form_section( 'img_opt', __( 'Image Optimisation Configuration' ), __( 'Image formats like WebP and Avif are key to accelerating your website\'s load time. Additionally, we provide a variety of other features to further enhance your website\'s speed.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_USE_WEBP_ALTERNATIVE,
			true,
			true,
			__( 'Generate WebP Images' ),
			__( 'Accelerate image loading and save bandwidth with generated WebP versions. Browsers will autonomously select the most optimal format.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEPB_QUALITY,
			self::SETTING_DEFAULT_WEPB_QUALITY,
			false,
			__( 'WebP Images Conversion Quality' ),
			__( 'WebP image quality. Lower quality results in faster load times. Choose a number from 0 to 100.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value && 100 >= $value;
			},
			'img_opt'
		);

		$possible_values_webp = array();
		foreach ( self::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT as $file_type ) {
			$possible_values_webp[ $file_type ] = $file_type;
		}
		$this->add_option_definition(
			self::SETTING_NAME_WEBP_TYPES_TO_CONVERT,
			self::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT,
			true,
			__( 'Automated WebP Conversion' ),
			__( 'Choose the file types to be auto-converted into WebP. At this time, GIF format isn\'t supported.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			$possible_values_webp,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_USE_AVIF_ALTERNATIVE,
			false,
			true,
			__( 'Generate Avif Images' ),
			__( 'Accelerate image loading and save bandwidth with generated Avif versions. Browsers will autonomously select the most optimal format. Requires PHP 8.1 or later.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_AVIF_QUALITY,
			self::SETTING_DEFAULT_AVIF_QUALITY,
			false,
			__( 'Avif Images Conversion Quality' ),
			__( 'Avif image quality. Lower quality results in faster load times. Choose a number from 0 to 100.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value && 100 >= $value;
			},
			'img_opt'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AVIF_SPEED,
			self::SETTING_DEFAULT_AVIF_SPEED,
			false,
			__( 'Avif Images Conversion Speed' ),
			__( 'Avif conversion speed. Choose a number from 0 (slowest) to 6 (fastest).' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value && 6 >= $value;
			},
			'img_opt'
		);

		$possible_values_avif = array();
		foreach ( self::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT as $file_type ) {
			$possible_values_avif[ $file_type ] = $file_type;
		}
		$this->add_option_definition(
			self::SETTING_NAME_AVIF_TYPES_TO_CONVERT,
			self::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT,
			true,
			__( 'Automated Avif Conversion' ),
			__( 'Choose the file types to be auto-converted into Avif. At this time, GIF format isn\'t supported.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			$possible_values_avif,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMAGE_RESIZING,
			self::SETTING_DEFAULT_IMAGE_RESIZING,
			false,
			__( 'Generate Missing Image Sizes' ),
			__( 'If a smaller image size isn\'t available, we\'ll create one from the original file for use in the content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMG_MIN_WIDTH,
			0,
			true,
			__( 'Prevent Image Loading on Small Devices' ),
			__( 'Enable this feature to prevent image loading in the browser when the window size is less than a specified width. It enhances data transfer efficiency for smaller devices. Incorporate this feature by appending the class name `urlslab-min-width-[number]` to the image or any parental element. For instance, `urlslab-min-width-768` signifies that the image will load only if the window\'s width is 768 pixels or more.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);
	}

	private function add_min_width_to_img( DOMDocument $document, DOMElement $img_element ) {
		if ( ! $img_element->hasAttribute( 'src' ) && ! $img_element->hasAttribute( 'data-src' ) ) {
			return true;
		}
		$min_width = $this->get_min_width_class_value( $img_element );
		if ( false === $min_width ) {
			return true;
		}
		$media_value = '(min-width: ' . $min_width . 'px)';
		if ( $this->has_parent_node( $img_element, 'picture' ) ) {
			$source_element = $document->createElement( 'source' );
			if ( $img_element->hasAttribute( 'src' ) && ! str_starts_with( $img_element->getAttribute( 'src' ), 'data:' ) ) {
				$source_element->setAttribute( 'srcset', $img_element->getAttribute( 'src' ) );
				$img_element->setAttribute( 'src', '' );
			}
			if ( $img_element->hasAttribute( 'data-src' ) ) {
				$source_element->setAttribute( 'data-srcset', $img_element->getAttribute( 'data-src' ) );
				$img_element->setAttribute( 'data-src', '' );
			}
			$source_element->setAttribute( 'media', $media_value );
			$img_element->parentNode->insertBefore( $source_element, $img_element );

			// iterate all other source tags in picture tag and add min-width to media attribute
			foreach ( $img_element->parentNode->childNodes as $node ) {
				if ( property_exists( $node, 'tagName' ) && 'source' == $node->tagName ) {
					if ( $node->hasAttribute( 'media' ) ) {
						if ( $media_value != $node->getAttribute( 'media' ) ) {
							$node->setAttribute( 'media', $media_value . ' and (' . $node->getAttribute( 'media' ) . ')' );
						}
					} else {
						$node->setAttribute( 'media', $media_value );
					}
				}
			}
		} else {
			$picture_element = $document->createElement( 'picture' );
			$new_img_element = clone $img_element;
			$source_element  = $document->createElement( 'source' );
			if ( $new_img_element->hasAttribute( 'src' ) && ! str_starts_with( $new_img_element->getAttribute( 'src' ), 'data:' ) ) {
				$source_element->setAttribute( 'srcset', $new_img_element->getAttribute( 'src' ) );
				$new_img_element->setAttribute( 'src', '' );
			}
			if ( $new_img_element->hasAttribute( 'data-src' ) ) {
				$source_element->setAttribute( 'data-srcset', $new_img_element->getAttribute( 'data-src' ) );
				$new_img_element->setAttribute( 'data-src', '' );
			}
			$source_element->setAttribute( 'media', $media_value );
			$picture_element->appendChild( $source_element );
			$picture_element->appendChild( $new_img_element );
			$img_element->parentNode->replaceChild( $picture_element, $img_element );
		}
	}

	private function get_min_width_class_value( DOMElement $element ) {
		if ( $element->hasAttribute( 'class' ) && false !== strpos( $element->getAttribute( 'class' ), self::URLSLAB_MIN_WIDTH ) ) {
			if ( preg_match( '/' . self::URLSLAB_MIN_WIDTH . '(\d*)/', $element->getAttribute( 'class' ), $match ) ) {
				if ( strlen( $match[1] ) ) {
					return (int) $match[1];
				}
			}
		}
		if ( property_exists( $element, 'parentNode' ) ) {
			return $this->get_min_width_class_value( $element->parentNode );
		}

		return false;
	}

	private function log_file_usage( array $missing_file_ids ) {
		if ( $this->get_option( self::SETTING_NAME_LOG_IMAGES ) ) {
			global $wpdb;

			$urlid   = Urlslab_Url::get_current_page_url()->get_url_id();
			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT fileid FROM ' . URLSLAB_FILE_URLS_TABLE . ' WHERE url_id = %d', // phpcs:ignore
					$urlid
				),
				'ARRAY_A'
			);

			$files = array();
			array_walk(
				$results,
				function( $value, $key ) use ( &$files ) {
					$files[ $value['fileid'] ] = true;
				}
			);

			$page_fileids = array_merge( array_keys( $this->files ), array_keys( $missing_file_ids ) );

			$insert = array_diff( $page_fileids, array_keys( $files ) );
			$delete = array_diff( array_keys( $files ), $page_fileids );
			if ( ! empty( $insert ) ) {
				$table        = URLSLAB_FILE_URLS_TABLE;
				$placeholders = array();
				$values       = array();
				foreach ( $insert as $fileid ) {
					$placeholders[] = '(%s, %d)';
					$values[]       = $fileid;
					$values[]       = $urlid;
				}
				$insert_sql = "INSERT IGNORE INTO {$table} (fileid, url_id) VALUES " . implode( ',', $placeholders );

				$wpdb->query(
					$wpdb->prepare(
						$insert_sql, // phpcs:ignore
						$values
					)
				);

				try {
					Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
				} catch ( Exception $e ) {
				}
			}

			if ( ! empty( $delete ) ) {
				$table        = URLSLAB_FILE_URLS_TABLE;
				$placeholders = array();
				$values       = array( $urlid );
				foreach ( $delete as $fileid ) {
					$placeholders[] = '%s';
					$values[]       = $fileid;
				}

				$wpdb->query(
					$wpdb->prepare(
						"DELETE FROM {$table} WHERE url_id=%d AND fileid IN (" . implode( ',', $placeholders ) . ')', // phpcs:ignore
						$values
					)
				);
			}
		}
	}

	/**
	 * this is workaround of parsing bug in php DOMDocument which doesn't understand the source as single tag.
	 *
	 * @param mixed $tag_name
	 */
	private function has_parent_node( DOMElement $dom_element, $tag_name ): bool {
		return null !== $this->get_parent_node( $dom_element, $tag_name );
	}

	private function get_parent_node( DOMElement $dom_element, $tag_name ): ?DOMElement {
		if ( property_exists( $dom_element, 'parentNode' ) ) {
			if ( property_exists( $dom_element->parentNode, 'tagName' ) && $dom_element->parentNode->tagName == $tag_name ) {
				return $dom_element->parentNode;
			}
			if ( 'DOMElement' == get_class( $dom_element->parentNode ) ) {
				return $this->get_parent_node( $dom_element->parentNode, $tag_name );
			}
		}

		return null;
	}

	private function get_source_tag_parent_url( DOMElement $source_element ): string {
		$dom_picture = $this->get_parent_node( $source_element, 'picture' );
		if ( null === $dom_picture ) {
			return '';
		}

		foreach ( $dom_picture->childNodes as $node ) {
			if ( property_exists( $node, 'tagName' ) && 'img' == $node->tagName && $node->hasAttribute( 'src' ) && strlen( $node->getAttribute( 'src' ) ) ) {
				return $node->getAttribute( 'src' );
			}
		}

		return '';
	}

	private function process_source_tag( DOMElement $dom_element, DOMDocument $document ) {
		$found_urls = array();
		if ( ! $dom_element->hasAttribute( 'type' ) && $this->has_parent_node( $dom_element, 'picture' ) ) {
			$parent_url      = $this->get_source_tag_parent_url( $dom_element );
			$files_in_srcset = array();
			$strValue        = $dom_element->getAttribute( 'srcset' );
			if ( empty( $strValue ) ) {
				$strValue = $dom_element->getAttribute( 'data-srcset' );
			}
			$urlvalues = explode( ',', $strValue );
			foreach ( $urlvalues as $url_value ) {
				$url_val      = explode( ' ', trim( $url_value ) );
				$old_file_obj = new Urlslab_File_Row( array( 'url' => $url_val[0] ), false );
				if ( strlen( $parent_url ) ) {
					$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
				}
				if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
					$found_urls[ $old_file_obj->get_fileid() ] = 1;
					if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
						foreach ( $this->get_file_alternatives( $this->files[ $old_file_obj->get_fileid() ] ) as $alternative_file_obj ) {
							$files_in_srcset[ $alternative_file_obj->get_filetype() ][] = array(
								'old_url' => $url_val[0],
								'new_url' => $alternative_file_obj->get_file_pointer()->get_driver_object()->get_url( $alternative_file_obj ),
							);
						}
					}
				}
			}
			foreach ( $files_in_srcset as $type => $url_alternatives ) {
				if ( count( $url_alternatives ) == count( $urlvalues ) && ! $this->picture_has_source_for_type( $dom_element->parentNode, $type, $dom_element->hasAttribute( 'media' ) ? $dom_element->getAttribute( 'media' ) : false ) ) {
					// generate source element for this type - we have all alternatives
					$source_element = $document->createElement( 'source' );
					if ( $dom_element->hasAttribute( 'srcset' ) ) {
						$source_element->setAttribute( 'srcset', $dom_element->getAttribute( 'srcset' ) );
						foreach ( $url_alternatives as $arr_alternative ) {
							$source_element->setAttribute( 'srcset', str_replace( $arr_alternative['old_url'], $arr_alternative['new_url'], $source_element->getAttribute( 'srcset' ) ) );
						}
					}
					if ( $dom_element->hasAttribute( 'data-srcset' ) ) {
						$source_element->setAttribute( 'data-srcset', $dom_element->getAttribute( 'data-srcset' ) );
						$source_element->setAttribute( 'urlslab-lazy', 'yes' );
						foreach ( $url_alternatives as $arr_alternative ) {
							$source_element->setAttribute( 'data-srcset', str_replace( $arr_alternative['old_url'], $arr_alternative['new_url'], $source_element->getAttribute( 'data-srcset' ) ) );
						}
					}
					if ( $dom_element->hasAttribute( 'media' ) ) {
						$source_element->setAttribute( 'media', $dom_element->getAttribute( 'media' ) );
					}
					if ( $dom_element->hasAttribute( 'sizes' ) ) {
						$source_element->setAttribute( 'sizes', $dom_element->getAttribute( 'sizes' ) );
					}
					$source_element->setAttribute( 'type', $type );
					$dom_element->parentNode->insertBefore( $source_element, $dom_element );
				}
			}

			return array_merge( $this->replace_attributes( $dom_element ), $found_urls );
		}

		return array_merge( $this->replace_attributes( $dom_element ), $found_urls );
	}

	/**
	 * @return Urlslab_File_Row[]
	 */
	private function get_file_alternatives( Urlslab_File_Row $file ): array {
		$alternatives = array();
		if ( ! empty( $file->get_webp_fileid() ) && isset( $this->files[ $file->get_webp_fileid() ] ) ) {
			$alternatives[] = $this->files[ $file->get_webp_fileid() ];
		}
		if ( ! empty( $file->get_avif_fileid() ) && isset( $this->files[ $file->get_avif_fileid() ] ) ) {
			$alternatives[] = $this->files[ $file->get_avif_fileid() ];
		}

		return $alternatives;
	}

	/**
	 * @param mixed $dom_element
	 *
	 * @throws DOMException
	 */
	private function process_img_tag( $dom_element, DOMDocument $document ): array {
		$found_urls = array();
		if ( $this->has_parent_node( $dom_element, 'picture' ) ) {
			$lazy_loading = false;
			if ( ! empty( $dom_element->getAttribute( 'src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
				$img_url_object = new Urlslab_File_Row( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else {
				if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) ) {
					$lazy_loading   = true;
					$img_url_object = new Urlslab_File_Row( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
				}
			}

			if ( isset( $this->files[ $img_url_object->get_fileid() ] ) ) {
				foreach ( $this->get_file_alternatives( $this->files[ $img_url_object->get_fileid() ] ) as $alternative_file_obj ) {
					if ( ! $this->picture_has_source_for_type( $dom_element->parentNode, $alternative_file_obj->get_filetype() ) ) {
						$source_element = $document->createElement( 'source' );
						$source_url     = $alternative_file_obj->get_file_pointer()->get_driver_object()->get_url( $alternative_file_obj );
						if ( $lazy_loading ) {
							$source_element->setAttribute( 'data-srcset', $source_url );
							$source_element->setAttribute( 'urlslab-lazy', 'yes' );
						} else {
							$source_element->setAttribute( 'srcset', $source_url );
						}
						$source_element->setAttribute( 'type', $alternative_file_obj->get_filetype() );
						$dom_element->parentNode->insertBefore( $source_element, $dom_element );
					}
				}
			}

			$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
		} else {
			// this is simple img tag
			$lazy_loading   = false;
			$img_url_object = null;
			if ( ! empty( $dom_element->getAttribute( 'src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
				$img_url_object = new Urlslab_File_Row( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else {
				if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'data-src' ), 'data:' ) ) {
					$lazy_loading   = true;
					$img_url_object = new Urlslab_File_Row( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
				}
			}

			if (
				is_object( $img_url_object ) && isset( $this->files[ $img_url_object->get_fileid() ] ) && ( ! empty( $this->files[ $img_url_object->get_fileid() ]->get_webp_fileid() ) || ! empty( $this->files[ $img_url_object->get_fileid() ]->get_avif_fileid() ) )
			) {
				// encapsulate img into picture element and add source tag for alternatives
				$picture_element = $document->createElement( 'picture' );

				$new_img_element = clone $dom_element;

				$picture_element->appendChild( $new_img_element );

				if ( $new_img_element->hasAttribute( 'srcset' ) ) {
					// create basic source with type from original img
					$source_element = $document->createElement( 'source' );
					if ( $lazy_loading ) {
						$source_element->setAttribute( 'data-srcset', $new_img_element->getAttribute( 'srcset' ) );
						$source_element->setAttribute( 'urlslab-lazy', 'yes' );
					} else {
						$source_element->setAttribute( 'srcset', $new_img_element->getAttribute( 'srcset' ) );
					}
					$new_img_element->removeAttribute( 'srcset' );

					if ( $new_img_element->hasAttribute( 'sizes' ) ) {
						$source_element->setAttribute( 'sizes', $new_img_element->getAttribute( 'sizes' ) );
						$new_img_element->removeAttribute( 'sizes' );
					}

					$picture_element->insertBefore( $source_element, $new_img_element );
					// process this source tag as other source elements
					$found_urls = array_merge( $this->process_source_tag( $source_element, $document ), $found_urls );
				} else {
					if ( $new_img_element->hasAttribute( 'data-srcset' ) ) {
						// create basic source with type from original img
						$source_element = $document->createElement( 'source' );
						$source_element->setAttribute( 'data-srcset', $new_img_element->getAttribute( 'data-srcset' ) );
						$source_element->setAttribute( 'urlslab-lazy', 'yes' );
						$new_img_element->removeAttribute( 'data-srcset' );

						if ( $new_img_element->hasAttribute( 'sizes' ) ) {
							$source_element->setAttribute( 'sizes', $new_img_element->getAttribute( 'sizes' ) );
							$new_img_element->removeAttribute( 'sizes' );
						}

						$picture_element->insertBefore( $source_element, $new_img_element );
						// process this source tag as other source elements
						$found_urls = array_merge( $this->process_source_tag( $source_element, $document ), $found_urls );
					}
				}

				// add simple alternatives to src url
				foreach ( $this->get_file_alternatives( $this->files[ $img_url_object->get_fileid() ] ) as $alternative_file ) {
					$source_element = $document->createElement( 'source' );
					$source_url     = $alternative_file->get_file_pointer()->get_driver_object()->get_url( $alternative_file );
					if ( $lazy_loading ) {
						$source_element->setAttribute( 'data-srcset', $source_url );
						$source_element->setAttribute( 'urlslab-lazy', 'yes' );
					} else {
						$source_element->setAttribute( 'srcset', $source_url );
					}
					$source_element->setAttribute( 'type', $alternative_file->get_filetype() );
					$picture_element->insertBefore( $source_element, $new_img_element );
				}

				$dom_element->parentNode->replaceChild( $picture_element, $dom_element );

				$found_urls = array_merge( $this->replace_attributes( $new_img_element ), $found_urls );
			} else {
				$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
			}
		}

		return $found_urls;
	}

	/**
	 * @param Urlslab_File_Row $file
	 *
	 * @return Urlslab_File_Row[]
	 */
	private function get_files_for_urls( array $old_url_ids ): array {
		if ( empty( $old_url_ids ) ) {
			return array();
		}

		$files = Urlslab_File_Row::get_files( $old_url_ids );

		$arr_file_with_alternatives = array();

		$new_urls = array();

		foreach ( $files as $file_obj ) {
			$new_urls[ $file_obj->get_fileid() ] = $file_obj;
			if ( ! empty( $file_obj->get_webp_fileid() ) ) {
				$arr_file_with_alternatives[] = $file_obj->get_webp_fileid();
			}
			if ( ! empty( $file_obj->get_avif_fileid() ) ) {
				$arr_file_with_alternatives[] = $file_obj->get_avif_fileid();
			}
		}

		if ( ! empty( $arr_file_with_alternatives ) ) {
			$files = Urlslab_File_Row::get_files( $arr_file_with_alternatives );
			foreach ( $files as $file_obj ) {
				$new_urls[ $file_obj->get_fileid() ] = $file_obj;
			}
		}

		return $new_urls;
	}

	private function schedule_missing_images( array $urls ) {
		$save_internal = $this->get_option( self::SETTING_NAME_SAVE_INTERNAL );
		$save_external = $this->get_option( self::SETTING_NAME_SAVE_EXTERNAL );
		if ( ! ( $save_internal || $save_external ) ) {
			return;
		}

		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();

		foreach ( $urls as $fileid => $url ) {
			try {
				$url_obj        = new Urlslab_Url( $url );
				$placeholders[] = '(%s,%s,%s,%s,%s)';
				array_push( $values, $fileid, $url, $this->parent_urls[ $fileid ] ?? '', ( ( $url_obj->is_same_domain_url() && $save_internal ) || $save_external ) ? Urlslab_Driver::STATUS_NEW : Urlslab_Driver::STATUS_NOT_PROCESSING, $now );
			} catch ( Exception $e ) {
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . ' (fileid,url,parent_url,filestatus,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	/**
	 * @param mixed $dom_element
	 *
	 * @throws Exception
	 */
	private function replace_attributes( $dom_element ): array {
		$found_urls = array();
		foreach ( Urlslab_Lazy_Loading::get_supported_media()[ $dom_element->tagName ] as $attribute ) {
			/** @noinspection SlowArrayOperationsInLoopInspection */
			$found_urls = array_merge_recursive( $this->replace_attribute( $dom_element, $attribute ), $found_urls );
		}

		return $found_urls;
	}

	private function replace_style_attribute( $dom_element ): array {
		$found_urls = array();

		// @noinspection SlowArrayOperationsInLoopInspection
		return array_merge_recursive( $this->replace_attribute( $dom_element, 'style' ), $found_urls );
	}

	/**
	 * @param mixed $dom_element
	 * @param mixed $attribute
	 *
	 * @throws Exception
	 */
	private function replace_attribute( $dom_element, $attribute ): array {
		$found_urls = array();
		if ( $dom_element->hasAttribute( $attribute ) && strlen( $dom_element->getAttribute( $attribute ) ) > 0 ) {
			switch ( $attribute ) {
				case 'data-srcset':
				case 'srcset':
					$urlvalues = explode( ',', $dom_element->getAttribute( $attribute ) );
					if ( $dom_element->hasAttribute( 'src' ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
						$parent_url = $dom_element->getAttribute( 'src' );
					} else {
						$parent_url = '';
					}
					foreach ( $urlvalues as $url_value ) {
						$url_val      = explode( ' ', trim( $url_value ) );
						$old_file_obj = new Urlslab_File_Row( array( 'url' => $url_val[0] ), false );
						if ( strlen( $parent_url ) ) {
							$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
						}
						if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
							if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
								$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver_object()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
								$dom_element->setAttribute( $attribute, str_replace( $url_val[0], $source_url, $dom_element->getAttribute( $attribute ) ) );
								$found_urls[ $old_file_obj->get_fileid() ] = 1;
							} else {
								if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
									$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $url_value ) );
									$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
									$dom_element->setAttribute( $attribute, trim( str_replace( $url_value, '', $dom_element->getAttribute( $attribute ) ), ',' ) );
								}
							}
						}
					}

					break;

				case 'style':
					if ( preg_match_all( '/url\((.*?)\)/', $dom_element->getAttribute( $attribute ), $matches ) ) {
						foreach ( $matches[1] as $matched_url ) {
							$old_file_obj = new Urlslab_File_Row( array( 'url' => $matched_url ), false );
							if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
								if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
									$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver_object()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
									$dom_element->setAttribute( $attribute, str_replace( $matched_url, $source_url, $dom_element->getAttribute( $attribute ) ) );
									$found_urls[ $old_file_obj->get_fileid() ] = 1;
								} else {
									if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
										$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $matched_url ) );
										$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
										$dom_element->setAttribute( $attribute, str_replace( $matched_url, '', $dom_element->getAttribute( $attribute ) ) );
									}
								}
							}
						}
					}

					break;

				default:
					$url          = $dom_element->getAttribute( $attribute );
					$old_file_obj = new Urlslab_File_Row( array( 'url' => $url ), false );
					if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
						if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
							$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver_object()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
							$dom_element->setAttribute( $attribute, $source_url );
							$found_urls[ $old_file_obj->get_fileid() ] = 1;
						} else {
							if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
								$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $url ) );
								$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
								$dom_element->removeAttribute( $attribute );
							}
						}
					}
			}
		}

		return $found_urls;
	}

	private function picture_has_source_for_type( DOMElement $picture_element, $filetype, $media = false ): bool {
		foreach ( $picture_element->childNodes as $node ) {
			if ( property_exists( $node, 'tagName' ) && 'source' == $node->tagName && $node->getAttribute( 'type' ) == $filetype && ( false === $media || $node->getAttribute( 'media' ) === $media ) ) {
				return true;
			}
		}

		return false;
	}
}
