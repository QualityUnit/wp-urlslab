<?php /** @noinspection SlowArrayOperationsInLoopInspection */

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-file.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-s3.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-db.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-file-data.php';

// phpcs:disable WordPress.NamingConventions
class Urlslab_Media_Offloader_Widget extends Urlslab_Widget {
	const SLUG = 'urlslab-media-offloader';

	private array $parent_urls = array();

	public const SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = 'urlslab_import_post_attachements';
	public const SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = false;

	//automatically offload external images found in every page content (starting with damain name different as current page)
	public const SETTING_NAME_SAVE_EXTERNAL = 'urlslab_save_external_resources';
	//automatically offload internal images found in every page content (starting with damain name same as current page)
	public const SETTING_NAME_SAVE_INTERNAL = 'urlslab_save_internal_resources';

	public const SETTING_NAME_NEW_FILE_DRIVER = 'urlslab_file_driver';
	public const SETTING_DEFAULT_NEW_FILE_DRIVER = Urlslab_Driver::DRIVER_LOCAL_FILE;

	//TRANSFER SETTINGS
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES = 'urlslab_transfer_all_data_from_local_files';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_S3 = 'urlslab_transfer_all_data_from_s3';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_DB = 'urlslab_transfer_all_data_from_database';
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES = false;
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3 = false;
	public const SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB = false;

	public const SETTING_NAME_DELETE_AFTER_TRANSFER = 'urlslab_transfer_del';
	public const SETTING_DEFAULT_DELETE_AFTER_TRANSFER = false;

	//WEBP CONVERSION SETTINGS
	public const SETTING_NAME_USE_WEBP_ALTERNATIVE = 'urlslab_use_webp';
	public const SETTING_NAME_WEBP_TYPES_TO_CONVERT = 'urlslab_webp_types';
	public const SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT = array( 'image/png', 'image/jpeg', 'image/bmp', 'image/gif' );
	public const SETTING_NAME_WEPB_QUALITY = 'urlslab_webp_quality';
	public const SETTING_DEFAULT_WEPB_QUALITY = 80;

	// AVIF CONVERSION SETTINGS
	public const SETTING_NAME_USE_AVIF_ALTERNATIVE = 'urlslab_use_avif';
	public const SETTING_NAME_AVIF_TYPES_TO_CONVERT = 'urlslab_avif_types';
	public const SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT = array( 'image/png', 'image/jpeg', 'image/bmp', 'image/gif' );
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

	private const URLSLAB_MIN_WIDTH = 'urlslab-min-width-';
	public const SETTING_NAME_IMG_MIN_WIDTH = 'urlslab_img_min_width';

	public const SETTING_NAME_S3_BUCKET = 'urlslab_AWS_S3_bucket';
	public const SETTING_NAME_S3_REGION = 'urlslab_AWS_S3_region';
	public const SETTING_NAME_S3_ACCESS_KEY = 'urlslab_AWS_S3_access_key';
	public const SETTING_NAME_S3_SECRET = 'urlslab_AWS_S3_secret';
	public const SETTING_NAME_S3_URL_PREFIX = 'urlslab_AWS_S3_url_prefix';


	private $files = array();
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;

	/**
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
	}


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_handle_upload', $this, 'wp_handle_upload', 10, 1 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'the_content', 20 );
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Media_Offloader_Widget::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Media Files' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Offload media files from local directory to database or S3' );
	}


	public function wp_handle_upload( $file, $overrides = false, $time = null ) {
		$file_obj = new Urlslab_File_Data(
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
		$file_obj->get_fileid(); //init fileid before insert

		$driver = $file_obj->get_file_pointer()->get_driver();
		if ( $driver->is_connected() && $file_obj->insert() ) {
			$driver->upload_content( $file_obj );
		}

		return $file;
	}

	public function the_content( DOMDocument $document ) {
		$this->process_offloading( $document );
		if ( $this->get_option( self::SETTING_NAME_IMG_MIN_WIDTH ) ) {
			$this->process_min_width( $document );
		}
	}

	public function process_min_width( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[ancestor-or-self::*[contains(@class, '" . self::URLSLAB_MIN_WIDTH . "') and not(contains(@class, 'urlslab-skip-all')) and not(starts-with(@src, 'data:'))]]" );
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

			//iterate all other source tags in picture tag and add min-width to media attribute
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
			if ( preg_match( '/' . self::URLSLAB_MIN_WIDTH . '([0-9]*)/', $element->getAttribute( 'class' ), $match ) ) {
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


	public function process_offloading( DOMDocument $document ) {
		try {
			$found_urls          = array();
			$url_fileids         = array();
			$elements_to_process = array();
			$element_ids_cnt     = 0;

			//*********************************
			//find all elements to process
			//*********************************
			foreach ( urlslab_get_supported_media() as $tag_name => $tag_attributes ) {
				$xpath        = new DOMXPath( $document );
				$dom_elements = $xpath->query( '//' . $tag_name . "[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-offload')])]" );

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
								$file_obj = new Urlslab_File_Data( array( 'url' => $url_val[0] ), false );

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

			//search urls in style attributes
			$xpath           = new DOMXPath( $document );
			$styled_elements = $xpath->query( "//*[contains(@style, 'url') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-offload')])]" );
			foreach ( $styled_elements as $styled_element ) {
				if ( ! $this->is_skip_elemenet( $styled_element, 'offload' ) && preg_match_all( '/url\((.*?)\)/', $styled_element->getAttribute( 'style' ), $matches ) ) {
					foreach ( $matches[1] as $matched_url ) {
						$file_obj = new Urlslab_File_Data( array( 'url' => $matched_url ), false );
						if ( ! $styled_element->hasAttribute( 'urlslab-id' ) ) {
							$styled_element->setAttribute( 'urlslab-id', $element_ids_cnt ++ );
						}
						$url_fileids[ $file_obj->get_fileid() ]                                        = $matched_url;
						$elements_to_process['style'][ $styled_element->getAttribute( 'urlslab-id' ) ] = $styled_element;
					}
				}
			}


			//*********************************
			//find files for elements
			//*********************************
			$this->files = $this->get_files_for_urls( array_keys( $url_fileids ) );
			$this->log_file_usage( $url_fileids );

			//*********************************
			//process elements from page
			//*********************************

			foreach ( $elements_to_process as $tag_name => $tag_elements ) {
				foreach ( $tag_elements as $element_id => $dom_element ) {
					switch ( $tag_name ) {
						case 'img':
							$found_urls = array_merge( $this->process_img_tag( $dom_element, $document ), $found_urls );
							break;
						case 'source':
							$found_urls = array_merge( $this->process_source_tag( $dom_element, $document ), $found_urls );
							break;
						case 'audio': //for now we don't have alternatives for audio files
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
							break;
						case 'video': //for now we don't have alternatives for video files
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
							break;
						case 'style': //for now we don't have alternatives for video files
							$found_urls = array_merge( $this->replace_style_attribute( $dom_element ), $found_urls );
							break;
						default:
							$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );
					}
				}
			}

			//remove files we know already from the list of missing files
			foreach ( $this->files as $fileid => $file_obj ) {
				unset( $url_fileids[ $fileid ] );
			}
			$this->schedule_missing_images( $url_fileids );

		} catch ( Exception $e ) {
			//TODO log error
		}
	}

	private function log_file_usage( array $missing_file_ids ) {
		if ( $this->get_option( self::SETTING_NAME_LOG_IMAGES ) ) {
			global $wpdb;

			$urlid   = $this->get_current_page_url()->get_url_id();
			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT fileid FROM ' . URLSLAB_FILE_URLS_TABLE . ' WHERE urlMd5 = %d', // phpcs:ignore
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
				$insert_sql = "INSERT IGNORE INTO $table (fileid, urlMd5) VALUES " . implode( ',', $placeholders );

				$wpdb->query(
					$wpdb->prepare(
						$insert_sql, // phpcs:ignore
						$values
					)
				);

				try {
					$this->urlslab_url_data_fetcher->fetch_schedule_url( $this->get_current_page_url() );
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
						"DELETE FROM $table WHERE urlMd5=%d AND fileid IN (" . implode( ',', $placeholders ) . ')', // phpcs:ignore
						$values
					)
				);
			}
		}
	}

	/**
	 * this is workaround of parsing bug in php DOMDocument which doesn't understand the source as single tag
	 *
	 * @param DOMElement $dom_element
	 * @param $tag_name
	 *
	 * @return bool
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
				$old_file_obj = new Urlslab_File_Data( array( 'url' => $url_val[0] ), false );
				if ( strlen( $parent_url ) ) {
					$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
				}
				if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
					$found_urls[ $old_file_obj->get_fileid() ] = 1;
					if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) ) {
						foreach ( $this->get_file_alternatives( $this->files[ $old_file_obj->get_fileid() ] ) as $alternative_file_obj ) {
							$files_in_srcset[ $alternative_file_obj->get_filetype() ][] = array(
								'old_url' => $url_val[0],
								'new_url' => $alternative_file_obj->get_file_pointer()->get_driver()->get_url( $alternative_file_obj ),
							);
						}
					}
				}
			}
			foreach ( $files_in_srcset as $type => $url_alternatives ) {
				if ( count( $url_alternatives ) == count( $urlvalues ) && ! $this->picture_has_source_for_type( $dom_element->parentNode, $type, $dom_element->hasAttribute( 'media' ) ? $dom_element->getAttribute( 'media' ) : false ) ) {
					//generate source element for this type - we have all alternatives
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
			$found_urls = array_merge( $this->replace_attributes( $dom_element ), $found_urls );

			return $found_urls;
		}

		return array_merge( $this->replace_attributes( $dom_element ), $found_urls );
	}

	private function get_file_alternatives( Urlslab_File_Data $file ): array {
		$alternatives = array();
		if ( ! empty( $file->get( 'webp_fileid' ) ) && isset( $this->files[ $file->get( 'webp_fileid' ) ] ) ) {
			$alternatives[] = $this->files[ $file->get( 'webp_fileid' ) ];
		}
		if ( ! empty( $file->get( 'avif_fileid' ) ) && isset( $this->files[ $file->get( 'avif_fileid' ) ] ) ) {
			$alternatives[] = $this->files[ $file->get( 'avif_fileid' ) ];
		}

		return $alternatives;
	}

	/**
	 * @param $dom_element
	 * @param DOMDocument $document
	 *
	 * @return array
	 * @throws DOMException
	 */
	private function process_img_tag( $dom_element, DOMDocument $document ): array {
		$found_urls = array();
		if ( $this->has_parent_node( $dom_element, 'picture' ) ) {

			$lazy_loading = false;
			if ( ! empty( $dom_element->getAttribute( 'src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
				$img_url_object = new Urlslab_File_Data( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) ) {
				$lazy_loading   = true;
				$img_url_object = new Urlslab_File_Data( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
			}

			if ( isset( $this->files[ $img_url_object->get_fileid() ] ) ) {
				foreach ( $this->get_file_alternatives( $this->files[ $img_url_object->get_fileid() ] ) as $alternative_file_obj ) {
					if ( ! $this->picture_has_source_for_type( $dom_element->parentNode, $alternative_file_obj->get_filetype() ) ) {
						$source_element = $document->createElement( 'source' );
						$source_url     = $alternative_file_obj->get_file_pointer()->get_driver()->get_url( $alternative_file_obj );
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
			//this is simple img tag
			$lazy_loading = false;
			if ( ! empty( $dom_element->getAttribute( 'src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
				$img_url_object = new Urlslab_File_Data( array( 'url' => $dom_element->getAttribute( 'src' ) ), false );
			} else if ( ! empty( $dom_element->getAttribute( 'data-src' ) ) && ! str_starts_with( $dom_element->getAttribute( 'data-src' ), 'data:' ) ) {
				$lazy_loading   = true;
				$img_url_object = new Urlslab_File_Data( array( 'url' => $dom_element->getAttribute( 'data-src' ) ), false );
			}

			if (
				is_object( $img_url_object ) &&
				isset( $this->files[ $img_url_object->get_fileid() ] ) &&
				( ! empty( $this->files[ $img_url_object->get_fileid() ]->get( 'webp_fileid' ) ) || ! empty( $this->files[ $img_url_object->get_fileid() ]->get( 'avif_fileid' ) ) )
			) {
				//encapsulate img into picture element and add source tag for alternatives
				$picture_element = $document->createElement( 'picture' );

				$new_img_element = clone $dom_element;

				$picture_element->appendChild( $new_img_element );


				if ( $new_img_element->hasAttribute( 'srcset' ) ) {
					//create basic source with type from original img
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
					//process this source tag as other source elements
					$found_urls = array_merge( $this->process_source_tag( $source_element, $document ), $found_urls );
				} else if ( $new_img_element->hasAttribute( 'data-srcset' ) ) {
					//create basic source with type from original img
					$source_element = $document->createElement( 'source' );
					$source_element->setAttribute( 'data-srcset', $new_img_element->getAttribute( 'data-srcset' ) );
					$source_element->setAttribute( 'urlslab-lazy', 'yes' );
					$new_img_element->removeAttribute( 'data-srcset' );

					if ( $new_img_element->hasAttribute( 'sizes' ) ) {
						$source_element->setAttribute( 'sizes', $new_img_element->getAttribute( 'sizes' ) );
						$new_img_element->removeAttribute( 'sizes' );
					}

					$picture_element->insertBefore( $source_element, $new_img_element );
					//process this source tag as other source elements
					$found_urls = array_merge( $this->process_source_tag( $source_element, $document ), $found_urls );
				}

				//add simple alternatives to src url
				foreach ( $this->get_file_alternatives( $this->files[ $img_url_object->get_fileid() ] ) as $alternative_file ) {
					$source_element = $document->createElement( 'source' );
					$source_url     = $alternative_file->get_file_pointer()->get_driver()->get_url( $alternative_file );
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

	private function get_files_for_urls( array $old_url_ids ): array {
		if ( empty( $old_url_ids ) ) {
			return array();
		}

		$files = Urlslab_File_Data::get_files( $old_url_ids );

		$arr_file_with_alternatives = array();

		$new_urls = array();

		foreach ( $files as $file_obj ) {
			$new_urls[ $file_obj->get_fileid() ] = $file_obj;
			if ( ! empty( $file_obj->get( 'webp_fileid' ) ) ) {
				$arr_file_with_alternatives[] = $file_obj->get( 'webp_fileid' );
			}
			if ( ! empty( $file_obj->get( 'avif_fileid' ) ) ) {
				$arr_file_with_alternatives[] = $file_obj->get( 'avif_fileid' );
			}
		}

		if ( ! empty( $arr_file_with_alternatives ) ) {
			$files = Urlslab_File_Data::get_files( $arr_file_with_alternatives );
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
			if ( ( urlslab_is_same_domain_url( $url ) && $save_internal ) || $save_external ) {
				$placeholders[] = '(%s,%s,%s,%s,%s)';
				array_push( $values, $fileid, $url, $this->parent_urls[ $fileid ] ?? '', Urlslab_Driver::STATUS_NEW, $now );
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . ' (fileid,url,parent_url,filestatus,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}


	public function output_content() {
		global $_SERVER;
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return 'Path to file not detected.';
		}
		$path   = pathinfo( $_SERVER['REQUEST_URI'] );
		$dirs   = explode( '/', $path['dirname'] );
		$fileid = array_pop( $dirs );

		$file = Urlslab_File_Data::get_file( $fileid );

		if ( empty( $file ) ) {
			status_header( 404 );
			exit( 'File not found' );
		}

		@set_time_limit( 0 );

		status_header( 200 );
		header( 'Content-Type: ' . $file->get( 'filetype' ) );
		header( 'Content-Disposition: inline; filename="' . $file->get_filename() . '"' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		$expires_offset = $this->get_option( self::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME );
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . $file->get_file_pointer()->get( 'filesize' ) );

		$file->get_file_pointer()->get_driver()->output_file_content( $file );
	}

	/**
	 * @param $dom_element
	 *
	 * @return array
	 * @throws Exception
	 */
	private function replace_attributes( $dom_element ): array {
		$found_urls = array();
		foreach ( urlslab_get_supported_media()[ $dom_element->tagName ] as $attribute ) {
			/** @noinspection SlowArrayOperationsInLoopInspection */
			$found_urls = array_merge_recursive( $this->replace_attribute( $dom_element, $attribute ), $found_urls );
		}

		return $found_urls;
	}

	private function replace_style_attribute( $dom_element ): array {
		$found_urls = array();
		/** @noinspection SlowArrayOperationsInLoopInspection */
		$found_urls = array_merge_recursive( $this->replace_attribute( $dom_element, 'style' ), $found_urls );

		return $found_urls;
	}

	/**
	 * @param $dom_element
	 * @param $attribute
	 *
	 * @return array
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
						$old_file_obj = new Urlslab_File_Data( array( 'url' => $url_val[0] ), false );
						if ( strlen( $parent_url ) ) {
							$this->parent_urls[ $old_file_obj->get_fileid() ] = $parent_url;
						}
						if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
							if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) ) {
								$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
								$dom_element->setAttribute( $attribute, str_replace( $url_val[0], $source_url, $dom_element->getAttribute( $attribute ) ) );
								$found_urls[ $old_file_obj->get_fileid() ] = 1;
							} else if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
								$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $url_value ) );
								$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
								$dom_element->setAttribute( $attribute, trim( str_replace( $url_value, '', $dom_element->getAttribute( $attribute ) ), ',' ) );
							}
						}
					}
					break;
				case 'style':
					if ( preg_match_all( '/url\((.*?)\)/', $dom_element->getAttribute( $attribute ), $matches ) ) {
						foreach ( $matches[1] as $matched_url ) {
							$old_file_obj = new Urlslab_File_Data( array( 'url' => $matched_url ), false );
							if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
								if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) ) {
									$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
									$dom_element->setAttribute( $attribute, str_replace( $matched_url, $source_url, $dom_element->getAttribute( $attribute ) ) );
									$found_urls[ $old_file_obj->get_fileid() ] = 1;
								} else if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
									$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $matched_url ) );
									$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
									$dom_element->setAttribute( $attribute, str_replace( $matched_url, '', $dom_element->getAttribute( $attribute ) ) );
								}
							}
						}
					}
					break;
				default:
					$url          = $dom_element->getAttribute( $attribute );
					$old_file_obj = new Urlslab_File_Data( array( 'url' => $url ), false );
					if ( isset( $this->files[ $old_file_obj->get_fileid() ] ) ) {
						if ( Urlslab_Driver::STATUS_ACTIVE === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) ) {
							$source_url = $this->files[ $old_file_obj->get_fileid() ]->get_file_pointer()->get_driver()->get_url( $this->files[ $old_file_obj->get_fileid() ] );
							$dom_element->setAttribute( $attribute, $source_url );
							$found_urls[ $old_file_obj->get_fileid() ] = 1;
						} else if ( Urlslab_Driver::STATUS_ERROR === $this->files[ $old_file_obj->get_fileid() ]->get( 'filestatus' ) && $this->get_option( self::SETTING_NAME_HIDE_ERROR_IMAGES ) ) {
							$dom_element->setAttribute( 'urlslab-message', 'URL does not exist:' . esc_html( $url ) );
							$dom_element->setAttribute( 'style', 'display:none;visibility:hidden;' );
							$dom_element->removeAttribute( $attribute );
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

	protected function add_options() {

		$this->add_option_definition(
			self::SETTING_NAME_LOG_IMAGES,
			false,
			true,
			__( 'Track usage of images' ),
			__( 'Keep updated log where was used specific image on website.' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_HIDE_ERROR_IMAGES,
			false,
			true,
			__( 'Hide failed images' ),
			__( 'Hide from HTML content images in error state' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME,
			31536000,
			true,
			__( 'Cache expiration (seconds)' ),
			__( 'Media files cache expiration time - defines how long will be file cached in the browser or CDN' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);


		$this->add_options_form_section( 'import', __( 'Automatic media offloading' ), __( 'Urlslab plugin can automatically offload different types of media from your website and cache them with prefered storage drive to optimaze speed of content deliver to visitors' ) );

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			self::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			false,
			__( 'Offload WordPress media on background' ),
			__( 'Enable/Disable offloading of WordPress media attachments in the background cron job' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_EXTERNAL,
			false,
			true,
			__( 'Offload External media found in page' ),
			__( 'Offload media from external urls, found on pages of your domain with the current driver' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);

		$this->add_option_definition(
			self::SETTING_NAME_SAVE_INTERNAL,
			false,
			true,
			__( 'Offload Internal media found in page' ),
			__( 'Offload media from internal urls, found on pages of your domain with the current driver' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);


		$this->add_options_form_section( 'storage', __( 'Media Content Storage' ), __( 'Define driver used to cach all media files and how will be data transferred between drivers' ) );
		$this->add_option_definition(
			self::SETTING_NAME_NEW_FILE_DRIVER,
			self::SETTING_DEFAULT_NEW_FILE_DRIVER,
			true,
			__( 'Default Driver' ),
			__( 'Current default driver to use for offloading the media' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Driver::DRIVER_DB         => __( 'Database' ),
				Urlslab_Driver::DRIVER_LOCAL_FILE => __( 'Local Filesystem' ),
				Urlslab_Driver::DRIVER_S3         => __( 'Cloud - AWS S3' ),
			),
			null,
			'storage'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3,
			false,
			__( 'Transfer media from S3 to default driver on background' ),
			__( 'Transfer all Media stored in S3 object storage to current default driver' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'storage'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			false,
			__( 'Transfer media from local file system to default driver on background' ),
			__( 'Transfer all Media stored in Local File Storage to current default driver' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'storage'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB,
			self::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB,
			false,
			__( 'Transfer media from database to default driver on background' ),
			__( 'Transfer all Media stored in database to current default driver' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'storage'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_AFTER_TRANSFER,
			self::SETTING_DEFAULT_DELETE_AFTER_TRANSFER,
			false,
			__( 'Delete original file after transfer' ),
			__( /** @lang text */ 'Delete file from original storage after transfer was completed' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'storage'
		);


		$this->add_options_form_section( 's3', __( 'AWS S3 Storage driver settings' ), '' );
		//S3 settings
		$this->add_option_definition(
			self::SETTING_NAME_S3_ACCESS_KEY,
			'',
			true,
			__( 'AWS S3 Access Key' ),
			__( 'Leave empty if AWS access key should be loaded from environment variable AWS_KEY' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			's3'
		);

		$this->add_option_definition(
			self::SETTING_NAME_S3_SECRET,
			'',
			true,
			__( 'AWS S3 Key Secret' ),
			__( 'Leave empty if AWS secret key should be loaded from environment variable AWS_SECRET' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			null,
			's3'
		);

		$this->add_option_definition(
			self::SETTING_NAME_S3_REGION,
			'',
			true,
			__( 'AWS S3 Region' ),
			'',
			self::OPTION_TYPE_TEXT,
			false,
			null,
			's3'
		);

		$this->add_option_definition(
			self::SETTING_NAME_S3_BUCKET,
			'',
			true,
			__( 'AWS S3 Bucket' ),
			__( 'AWS S3 bucket name if you want to transfer files to AWS S3' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			's3'
		);

		$this->add_option_definition(
			self::SETTING_NAME_S3_URL_PREFIX,
			'',
			true,
			__( 'AWS S3 Url Prefix' ),
			__( 'URL prefix for offloaded media, so that it can be used with CDN. Leave empty if CDN is not configured. (Example: https://cdn.yourdomain.com/)' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			's3'
		);


		$this->add_options_form_section( 'img_opt', __( 'Image optimisation' ), __( 'Plugin can automatically optimaze all cached images and convert them to multiple sizes and image formats for you. Based on your settings, visitors will load into the browser just the most optimized image format to maximize speed of loading' ) );

		$this->add_option_definition(
			self::SETTING_NAME_USE_WEBP_ALTERNATIVE,
			false,
			true,
			__( 'Generate Webp Images' ),
			( ( new Urlslab_Convert_Webp_Images_Cron() )->is_format_supported() ? '' : __( 'IMPORTANT: WEBP file format is not supported on your server. ' ) ) .
			__( 'Generate the Webp version of your images and add it as alternative and let browsers choose which one to use' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEPB_QUALITY,
			self::SETTING_DEFAULT_WEPB_QUALITY,
			false,
			__( 'Webp Conversion Quality' ),
			__( 'The Quality of Webp image. the less the quality, the faster is the image loading time; number between 0 and 100' ),
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
			__( 'Convert filetypes to WebP' ),
			__( 'Select which file types to convert to WebP' ),
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
			( ( new Urlslab_Convert_Avif_Images_Cron() )->is_format_supported() ? '' : __( 'IMPORTANT: AVIF file format is not supported on your server. ' ) ) .
			__( 'Generate the Avif version of your images and let browsers to choose the most effective file format.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_AVIF_QUALITY,
			self::SETTING_DEFAULT_AVIF_QUALITY,
			false,
			__( 'Avif Conversion Quality' ),
			__( 'The Quality of Avif image. the less the quality, the faster is the image loading time; number between 0 and 100' ),
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
			__( 'Avif conversion speed' ),
			__( 'The speed of Avif conversion. An integer between 0 (slowest) and 6 (fastest)' ),
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
			__( 'Convert filetypes to Avif' ),
			__( 'Select which file types to convert to Avif' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			$possible_values_avif,
			null,
			'img_opt'
		);


		$this->add_option_definition(
			self::SETTING_NAME_IMAGE_RESIZING,
			self::SETTING_DEFAULT_IMAGE_RESIZING,
			false,
			__( 'Resize missing image sizes' ),
			__( 'If image of smaller size doesn\'t exist, but image url is used in the content, create copy of original image with smaller size. e.g. if /img/myimage-340x200.jpg doesn\'t exist, but there is /img/myimage.jpg, plugin will create smaller image from original source' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMG_MIN_WIDTH,
			0,
			true,
			__( 'Skip loading image on small devices' ),
			__( 'Skip loading of images into browser if size of window is smaller as defined width. This feature optimize amount of transferred data for small devices and is useful in case you set by css breaking points when image is not displayed on smaller devices. Add class name urlslab-min-width-[number] on image or any parent elemenet to apply this functionality. Example: <img src="image.jpg" class="urlslab-min-width-768"> will load image just if window is wider or equal 768 pixels' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'img_opt'
		);
	}
}
