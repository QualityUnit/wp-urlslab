<?php

/** @noinspection SlowArrayOperationsInLoopInspection */

// phpcs:disable WordPress.NamingConventions
class Urlslab_Widget_Media_Offloader extends Urlslab_Widget {
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
	public const SETTING_DEFAULT_AVIF_SPEED = 1;

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
	public const SETTING_NAME_BG_IMG_NEXTGEN = 'urlslab_next_get_bg_img';

	private array $parent_urls = array();

	/**
	 * @var Urlslab_Data_File[]
	 */
	private $files = array();

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_handle_upload', $this, 'wp_handle_upload', 10, 1 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'the_content', 20 );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'output_content' );
		Urlslab_Loader::get_instance()->add_filter( 'user_trailingslashit', $this, 'user_trailingslashit', 10, 2 );
		Urlslab_Loader::get_instance()->add_filter( 'redirect_canonical', $this, 'redirect_canonical', 10, 2 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Media_Offloader::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Media', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Accelerate your website\'s speed with automated image optimization and offloading images to a database', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	protected function add_options() {
		$this->add_options_form_section(
			'main',
			function () {
				return __( 'Cache and Monitoring', 'urlslab' );
			},
			function () {
				return __( 'This plugin effortlessly monitors and stores images on your site, enhancing performance and user experience.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_LOG_IMAGES,
			true,
			true,
			function () {
				return __( 'Monitor Images Usage', 'urlslab' );
			},
			function () {
				return __( 'It will analyze all website images, simplifying the process of locating their exact usage.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_HIDE_ERROR_IMAGES,
			true,
			true,
			function () {
				return __( 'Hide Invalid Images', 'urlslab' );
			},
			function () {
				return __( 'Hide all invalid images from the website content that generate, for instance, a 404 error.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section(
			'offloading',
			function () {
				return __( 'Media Offloading Configuration', 'urlslab' );
			},
			function () {
				return __( 'Storing images across different locations brings many benefits. It aids in quick content delivery to your visitors, allows for simultaneous use of multiple storages, and lets you assign a specific storage for a given image. This enhances both image management and user experience.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_NEW_FILE_DRIVER,
			self::SETTING_DEFAULT_NEW_FILE_DRIVER,
			true,
			function () {
				return __( 'Default Driver', 'urlslab' );
			},
			function () {
				return __( 'The driver utilized for media offloading.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					Urlslab_Driver::DRIVER_DB         => __( 'Database', 'urlslab' ),
					Urlslab_Driver::DRIVER_LOCAL_FILE => __( 'Local File System', 'urlslab' ),
				);
			},
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			self::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			false,
			function () {
				return __( 'Background Offloading of WordPress Media', 'urlslab' );
			},
			function () {
				return __( 'Offloading all media uploaded in WordPress in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_INTERNAL,
			true,
			true,
			function () {
				return __( 'Offload Found Internal Media', 'urlslab' );
			},
			function () {
				return __( 'Transfer internal media to the current driver.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_EXTERNAL,
			false,
			true,
			function () {
				return __( 'Offload Found External Media', 'urlslab' );
			},
			function () {
				return __( 'Transfer external media to the current driver.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			false,
			function () {
				return __( 'Transfer Media From Local File System to the Default Driver', 'urlslab' );
			},
			function () {
				return __( 'Transfer all media from Local File Storage to the currently selected default driver in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB,
			false,
			function () {
				return __( 'Transfer Media From Database to the Default Driver', 'urlslab' );
			},
			function () {
				return __( 'Transfer all media from Database to the currently selected default driver in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		//      $this->add_option_definition(
		//          self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3,
		//          self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3,
		//          false,
		//          __( 'Transfer Media From S3 to the Default Driver', 'urlslab' ),
		//          __( 'Transfer all media from AWS S3 to the currently selected default driver in the background.', 'urlslab' ),
		//          self::OPTION_TYPE_CHECKBOX,
		//          false,
		//          null,
		//          'offloading'
		//      );

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_AFTER_TRANSFER,
			self::SETTING_DEFAULT_DELETE_AFTER_TRANSFER,
			false,
			function () {
				return __( 'Delete Original File After Transfer', 'urlslab' );
			},
			function () {
				return __( 'Remove the file from the original storage once the transfer is finished. Currently, we only remove files if they originated from the database or object storage. We don\'t remove files from the Local File System.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'offloading'
		);

		$this->add_options_form_section(
			'img_opt',
			function () {
				return __( 'Convert images to next-gen formats', 'urlslab' );
			},
			function () {
				return __( 'Image formats like WebP and Avif are key to accelerating your website\'s load time. Additionally, we provide a variety of other features to further enhance your website\'s speed.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_USE_WEBP_ALTERNATIVE,
			true,
			true,
			function () {
				return __( 'Generate WebP Images', 'urlslab' );
			},
			function () {
				return __( 'Accelerate image loading and save bandwidth with generated WebP versions. Browsers will autonomously select the most optimal format.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEPB_QUALITY,
			self::SETTING_DEFAULT_WEPB_QUALITY,
			false,
			function () {
				return __( 'WebP Images Conversion Quality', 'urlslab' );
			},
			function () {
				return __( 'WebP image quality. Lower quality results in faster load times. Choose a number from 0 to 100.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
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
			function () {
				return __( 'Automated WebP Conversion', 'urlslab' );
			},
			function () {
				return __( 'Choose the file types to be auto-converted into WebP. At this time, GIF format isn\'t supported.', 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			$possible_values_webp,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_USE_AVIF_ALTERNATIVE,
			false,
			true,
			function () {
				return __( 'Generate Avif Images', 'urlslab' );
			},
			function () {
				return __( 'Accelerate image loading and save bandwidth with generated Avif versions. Browsers will autonomously select the most optimal format. Requires PHP 8.1 or later.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_AVIF_QUALITY,
			self::SETTING_DEFAULT_AVIF_QUALITY,
			false,
			function () {
				return __( 'Avif Images Conversion Quality', 'urlslab' );
			},
			function () {
				return __( 'Avif image quality. Lower quality results in faster load times. Choose a number from 0 to 100.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value && 100 >= $value;
			},
			'img_opt'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AVIF_SPEED,
			self::SETTING_DEFAULT_AVIF_SPEED,
			false,
			function () {
				return __( 'Avif Images Conversion Speed', 'urlslab' );
			},
			function () {
				return __( 'Avif conversion speed. Choose a number from 0 (slowest) to 6 (fastest).', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
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
			function () {
				return __( 'Automated Avif Conversion', 'urlslab' );
			},
			function () {
				return __( 'Choose the file types to be auto-converted into Avif. At this time, GIF format isn\'t supported.', 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			$possible_values_avif,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMAGE_RESIZING,
			self::SETTING_DEFAULT_IMAGE_RESIZING,
			false,
			function () {
				return __( 'Generate Missing Image Sizes', 'urlslab' );
			},
			function () {
				return __( 'If a smaller image size isn\'t available, we\'ll create one from the original file for use in the content.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMG_MIN_WIDTH,
			0,
			true,
			function () {
				return __( 'Prevent Image Loading on Small Devices', 'urlslab' );
			},
			function () {
				return __( 'Enable this feature to prevent image loading in the browser when the window size is less than a specified width. It enhances data transfer efficiency for smaller devices. Incorporate this feature by appending the class name `urlslab-min-width-[number]` to the image or any parental element. For instance, `urlslab-min-width-768` signifies that the image will load only if the window\'s width is 768 pixels or more.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_BG_IMG_NEXTGEN,
			false,
			true,
			function () {
				return __( 'Serve background images in next-gen formats', 'urlslab' );
			},
			function () {
				return __( 'Image formats like WebP and AVIF often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. Plugin will replace original image with same image stored in new format.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt',
			array( self::LABEL_EXPERT )
		);
	}

	public function register_routes() {
		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-files.php';
		( new Urlslab_Api_Files() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'Performance' => __( 'Performance', 'urlslab' ) );
	}

	public function rewrite_rules() {
		add_rewrite_rule( '.*?' . Urlslab_Driver::DOWNLOAD_URL_PATH . '([a-f0-9]{32})/(.+)$', 'index.php?ul_fileid=$matches[1]&ul_filename=$matches[2]', 'top' );
	}

	public function query_vars( $vars ) {
		if ( ! in_array( 'ul_fileid', $vars ) ) {
			$vars[] = 'ul_fileid';
		}
		if ( ! in_array( 'ul_filename', $vars ) ) {
			$vars[] = 'ul_filename';
		}

		return parent::query_vars( $vars );
	}

	public function wp_handle_upload( $file, $overrides = false, $time = null ) {
		$file_obj = new Urlslab_Data_File(
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

	public function process_offloading( DOMDocument $document ) {
		try {
			$found_urls          = array();
			$url_fileids         = array();
			$elements_to_process = array();
			$element_ids_cnt     = 0;

			// *********************************
			// find all elements to process
			// *********************************
			foreach ( Urlslab_Widget_Lazy_Loading::get_supported_media() as $tag_name => $tag_attributes ) {
				$xpath        = new DOMXPath( $document );
				$dom_elements = $xpath->query( '//' . $tag_name . '[' . $this->get_xpath_query( array( 'urlslab-skip-offload' ) ) . ']' );

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
								$file_obj = new Urlslab_Data_File( array( 'url' => $url_val[0] ), false );

								if ( ! $dom_element->hasAttribute( 'urlslab-id' ) ) {
									$dom_element->setAttribute( 'urlslab-id', $element_ids_cnt++ );
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
			$styled_elements = $xpath->query( "//*[contains(@style, 'url') and " . $this->get_xpath_query( array( 'urlslab-skip-offload' ) ) . ']' );
			foreach ( $styled_elements as $styled_element ) {
				if ( ! $this->is_skip_elemenet( $styled_element, 'offload' ) && preg_match_all( '/url\((.*?)\)/', $styled_element->getAttribute( 'style' ), $matches ) ) {
					foreach ( $matches[1] as $matched_url ) {
						$file_obj = new Urlslab_Data_File( array( 'url' => $matched_url ), false );
						if ( ! $styled_element->hasAttribute( 'urlslab-id' ) ) {
							$styled_element->setAttribute( 'urlslab-id', $element_ids_cnt++ );
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

	/**
	 * @param Urlslab_Data_File $file
	 *
	 * @return Urlslab_Data_File[]
	 */
	private function get_files_for_urls( array $old_url_ids ): array {
		if ( empty( $old_url_ids ) ) {
			return array();
		}

		$files = Urlslab_Data_File::get_files( $old_url_ids );

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
			$files = Urlslab_Data_File::get_files( $arr_file_with_alternatives );
			foreach ( $files as $file_obj ) {
				$new_urls[ $file_obj->get_fileid() ] = $file_obj;
			}
		}

		return $new_urls;
	}

	private function log_file_usage( array $missing_file_ids ) {
		if ( is_search() || is_user_logged_in() ) {
			return;
		}

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
				function ( $value, $key ) use ( &$files ) {
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
					Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
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
	 * @param mixed $dom_element
	 *
	 * @throws DOMException
	 */
	private function process_img_tag( $dom_element, DOMDocument $document ): array {
		$found_urls = array();
		if ( $this->has_parent_node( $dom_element, 'picture' ) ) {
			$lazy_loading = false;
			if ( ! empty( $dom_element->getAttribute( 'src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
				$img_url_object = new Urlslab_Data_File( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else {
				if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) ) {
					$lazy_loading   = true;
					$img_url_object = new Urlslab_Data_File( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
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
				$img_url_object = new Urlslab_Data_File( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else {
				if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'data-src' ), 'data:' ) ) {
					$lazy_loading   = true;
					$img_url_object = new Urlslab_Data_File( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
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

	/**
	 * @return Urlslab_Data_File[]
	 */
	private function get_file_alternatives( Urlslab_Data_File $file ): array {
		$alternatives = array();
		if ( ! empty( $file->get_webp_fileid() ) && isset( $this->files[ $file->get_webp_fileid() ] ) ) {
			$alternatives[] = $this->files[ $file->get_webp_fileid() ];
		}
		if ( ! empty( $file->get_avif_fileid() ) && isset( $this->files[ $file->get_avif_fileid() ] ) ) {
			$alternatives[] = $this->files[ $file->get_avif_fileid() ];
		}

		return $alternatives;
	}

	private function picture_has_source_for_type( DOMElement $picture_element, $filetype, $media = false ): bool {
		foreach ( $picture_element->childNodes as $node ) {
			if ( property_exists( $node, 'tagName' ) && 'source' == $node->tagName && $node->getAttribute( 'type' ) == $filetype && ( false === $media || $node->getAttribute( 'media' ) === $media ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param mixed $dom_element
	 *
	 * @throws Exception
	 */
	private function replace_attributes( $dom_element ): array {
		$found_urls = array();
		foreach ( Urlslab_Widget_Lazy_Loading::get_supported_media()[ $dom_element->tagName ] as $attribute ) {
			/** @noinspection SlowArrayOperationsInLoopInspection */
			$found_urls = array_merge_recursive( $this->replace_attribute( $dom_element, $attribute ), $found_urls );
		}

		return $found_urls;
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
						$old_file_obj = new Urlslab_Data_File( array( 'url' => $url_val[0] ), false );
						if ( strlen( $parent_url ) ) {
							$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
						}
						if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
							if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() || Urlslab_Driver::STATUS_ACTIVE_SYSTEM === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
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
							$old_file_obj = new Urlslab_Data_File( array( 'url' => $matched_url ), false );

							$file_id = $old_file_obj->get_fileid();
							if ( isset( $this->files[ $file_id ] ) ) {

								if ( $this->get_option( self::SETTING_NAME_BG_IMG_NEXTGEN ) ) {
									$alternatives = $this->get_file_alternatives( $this->files[ $file_id ] );
									if ( ! empty( $alternatives ) && $alternatives[0]->get_filesize() < $this->files[ $file_id ]->get_filesize() ) {
										$file_id = $alternatives[0]->get_fileid(); //use alternative only if it's smaller
									}
								}

								if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $file_id ]->get_filestatus() || Urlslab_Driver::STATUS_ACTIVE_SYSTEM === $this->files[ $file_id ]->get_filestatus() ) {
									$source_url = $this->files[ $file_id ]->get_file_pointer()->get_driver_object()->get_url( $this->files[ $file_id ] );
									$dom_element->setAttribute( $attribute, str_replace( $matched_url, $source_url, $dom_element->getAttribute( $attribute ) ) );
									$found_urls[ $old_file_obj->get_fileid() ] = 1;
									$found_urls[ $file_id ]                    = 1;
								} else {
									if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $file_id ]->get_filestatus() && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
										$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $matched_url ) );
										$dom_element->setAttribute( 'style', str_replace( $matched_url, '#', $dom_element->getAttribute( $attribute ) ) ); //Replace incorrect url from style
										$dom_element->setAttribute( $attribute, str_replace( $matched_url, '', $dom_element->getAttribute( $attribute ) ) );
									}
								}
							}
						}
					}

					break;

				default:
					$url          = $dom_element->getAttribute( $attribute );
					$old_file_obj = new Urlslab_Data_File( array( 'url' => $url ), false );
					if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
						if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() || Urlslab_Driver::STATUS_ACTIVE_SYSTEM === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
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
				$old_file_obj = new Urlslab_Data_File( array( 'url' => $url_val[0] ), false );
				if ( strlen( $parent_url ) ) {
					$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
				}
				if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
					$found_urls[ $old_file_obj->get_fileid() ] = 1;
					if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() || Urlslab_Driver::STATUS_ACTIVE_SYSTEM === $this->files[ $old_file_obj->get_fileid() ]->get_filestatus() ) {
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

	private function replace_style_attribute( $dom_element ): array {
		$found_urls = array();

		// @noinspection SlowArrayOperationsInLoopInspection
		return array_merge_recursive( $this->replace_attribute( $dom_element, 'style' ), $found_urls );
	}

	private function schedule_missing_images( array $urls ): void {
		if ( empty( $urls ) ) {
			return;
		}

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
				$url_obj = new Urlslab_Url( $url );
				if ( $url_obj->is_wp_domain() && false !== strpos( $url_obj->get_url_path(), Urlslab_Driver::DOWNLOAD_URL_PATH ) ) {
					continue;
				}
				$placeholders[] = '(%s,%s,%s,%s,%s)';
				array_push( $values, $fileid, $url, $this->parent_urls[ $fileid ] ?? '', ( ( $url_obj->is_wp_domain() && $save_internal ) || $save_external ) ? Urlslab_Driver::STATUS_NEW : Urlslab_Driver::STATUS_NOT_PROCESSING, $now );
			} catch ( Exception $e ) {
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . ' (fileid,url,parent_url,filestatus,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	public function process_min_width( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[ancestor-or-self::*[contains(@class, '" . self::URLSLAB_MIN_WIDTH . "') and " . $this->get_xpath_query() . " and not(starts-with(@src, 'data:'))]]" );
		foreach ( $dom_elements as $img_element ) {
			$this->add_min_width_to_img( $document, $img_element );
		}
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

	public function output_content() {
		global $_SERVER;

		$file_id  = sanitize_key( get_query_var( 'ul_fileid' ) );
		$filename = sanitize_key( get_query_var( 'ul_filename' ) );

		if ( $file_id && $filename ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			$file = Urlslab_Data_File::get_file( $file_id );
			if ( empty( $file ) ) {
				header_remove();
				status_header( 404 );

				exit( 'File not found' );
			}

			$tmp_file = wp_tempnam();
			if ( ! $file->get_file_pointer()->get_driver_object()->save_to_file( $file, $tmp_file ) ) {
				unlink( $tmp_file );
				header_remove();
				status_header( 404 );

				exit( 'File not found' );
			}
			$content = file_get_contents( $tmp_file );
			unlink( $tmp_file );


			status_header( 200 );
			@header( 'Content-Type: ' . $file->get_filetype() );
			@header( 'Content-Disposition: inline; filename="' . $file->get_filename() . '"' );
			@header( 'Content-Transfer-Encoding: binary' );
			@header( 'Content-length: ' . $file->get_filesize() );
			echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			flush();

			try {
				/** @var Urlslab_Widget_Cache $widget_cache */
				$widget_cache = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
				if ( $widget_cache ) {
					$widget_cache->page_cache_save( $content );
				}
			} catch ( Exception $e ) {
			}
			exit();
		}
	}

	public function user_trailingslashit( $string, $type_of_url ) {
		// Your custom URL pattern
		if ( str_contains( Urlslab_Driver::DOWNLOAD_URL_PATH, $string ) ) {
			return untrailingslashit( $string );
		}

		return $string;
	}

	public function redirect_canonical( $redirect_url, $requested_url ) {
		// Check if the requested URL is for our custom route
		if ( str_contains( $requested_url, Urlslab_Driver::DOWNLOAD_URL_PATH ) ) {
			// Cancel the redirect
			return false;
		}

		return $redirect_url; // Return the default behavior
	}
}
