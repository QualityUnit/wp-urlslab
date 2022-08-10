<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-file.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-s3.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver-db.php';

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-file-data.php';

// phpcs:disable WordPress.NamingConventions
class Urlslab_Media_Offloader_Widget extends Urlslab_Widget {

	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	public const SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = 'urlslab_import_post_attachements';
	private int $SETTING_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = 0;

	//automatically offload external images found in every page content (starting with damain name different as current page)
	public const SETTING_NAME_SAVE_EXTERNAL = 'urlslab_save_external_resources';
	private int $SETTING_SAVE_EXTERNAL = 0;

	//automatically offload internal images found in every page content (starting with damain name same as current page)
	public const SETTING_NAME_SAVE_INTERNAL = 'urlslab_save_internal_resources';
	private int $SETTING_SAVE_INTERNAL = 0;

	public const SETTING_NAME_NEW_FILE_DRIVER = 'urlslab_file_driver';
	private string $SETTING_NEW_FILE_DRIVER = Urlslab_Driver::DRIVER_DB;

	//TRANSFER SETTINGS
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES = 'urlslab_transfer_all_data_from_local_files';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_S3 = 'urlslab_transfer_all_data_from_s3';
	public const SETTING_NAME_TRANSFER_FROM_DRIVER_DB = 'urlslab_transfer_all_data_from_database';
	private int $SETTING_TRANSFER_FROM_DRIVER_LOCAL_FILES = 0;
	private int $SETTING_TRANSFER_FROM_DRIVER_S3 = 0;
	private int $SETTING_TRANSFER_FROM_DRIVER_DB = 0;


	/**
	 */
	public function __construct() {
		$this->widget_slug = 'urlslab-media-offloader';
		$this->widget_title = 'Media Offloader';
		$this->widget_description = 'Offload media files from local directory to database or S3';
		$this->landing_page_link = 'https://www.urlslab.com';
	}


	public function init_widget( Urlslab_Loader $loader ) {
		$this->init_settings();
		$loader->add_action( 'wp_handle_upload', $this, 'wp_handle_upload', 10, 1 );
//		$loader->add_filter( 'the_content', $this, 'the_content' );

		$loader->add_action( 'wp_head', $this, 'buffer_start' );
		$loader->add_action( 'wp_footer', $this, 'buffer_end', 99 );
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return 'Urlslab ' . $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function wp_handle_upload( &$file, $overrides = false, $time = null ) {
		global $wpdb;
		$file_obj = new Urlslab_File_Data(
			array(
				'url' => $file['url'],
				'local_file' => $file['file'],
				'filetype' => $file['type'],
				'filename' => basename( $file['file'] ),
				'filesize' => filesize( $file['file'] ),
				'filestatus' => Urlslab_Driver::STATUS_NEW,
				'driver' => $this->SETTING_NEW_FILE_DRIVER,
			)
		);

		$data = array(
			'fileid' => $file_obj->get_fileid(),
			'url' => $file_obj->get_url(),
			'local_file' => $file_obj->get_local_file(),
			'filename' => $file_obj->get_filename(),
			'filesize' => $file_obj->get_filesize(),
			'filetype' => $file_obj->get_filetype(),
			'filestatus' => $file_obj->get_filestatus(),
			'driver' => $file_obj->get_driver(),
		);

		$result = $wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . // phpcs:ignore
				' (' . implode( ',', array_keys( $data ) ) . // phpcs:ignore
					') VALUES (%s, %s, %s, %s, %d, %s, %s, %s)',
				array_values( $data )
			)
		);

		if ( is_numeric( $result ) && 1 == $result ) {
			$driver = Urlslab_Driver::get_driver( $file_obj );
			if ( $driver->is_connected() ) {
				$driver->upload_content( $file_obj );
			}
		}

		return $file;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	function buffer_start() {
		ob_start(
			array(
				$this,
				'the_content',
			)
		);
	}

	function buffer_end() {
		ob_end_flush();
	}

	public function the_content( $content ) {
		if ( empty( $content ) ) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state = libxml_use_internal_errors( true );
		$urls = array();
		$found_urls = array();

		try {
			$document->loadHTML(
				mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ),
				LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
			);
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$iterate_elements = array(
				'img' => array(
					'src',
					'data-src',
					'data-lasrc', //# for LA custom solution - needs to be changed or added to settings
					'data-full-url',
					'srcset',
				),
				'video' => array(
					'src',
					'data-lasrc', //# for LA custom solution - needs to be changed or added to settings
					'data-src',
				),
				'source' => array(
					'data-lasrc', //# for LA custom solution - needs to be changed or added to settings
					'srcset',
				),
			);

			foreach ( $iterate_elements as $tag_name => $tag_attributes ) {
				$dom_images = $document->getElementsByTagName( $tag_name );

				if ( empty( $dom_images ) ) {
					return $content;
				}
				foreach ( $dom_images as $dom_img_element ) {
					//TODO we should allow to skip also any predefined pattern or regexp of urls (defined as setting)
					if ( $dom_img_element->hasAttribute( 'urlslab-skip' ) ) {
						continue;
					}
					foreach ( $tag_attributes as $attr ) {
						if ( strlen( $dom_img_element->getAttribute( $attr ) ) ) {
							$urlvalues = explode( ',', $dom_img_element->getAttribute( $attr ) );
							foreach ( $urlvalues as $url_value ) {
								$url_val = explode( ' ', trim( $url_value ) );
								$file_obj = new Urlslab_File_Data(
									array(
										'url' => $url_val[0],
									)
								);
								$urls[ $file_obj->get_fileid() ][ $attr ][] = array(
									'element' => $dom_img_element,
									'url' => $url_val[0],
								);
							}
						}
					}
				}
			}

			if ( empty( $urls ) ) {
				return $content;
			}
			$new_urls = $this->get_new_urls( array_keys( $urls ) );

			foreach ( $new_urls as $fileid => $file_obj ) {
				if ( $file_obj->get_filestatus() == Urlslab_Driver::STATUS_ACTIVE ) {
					//set new url to all elements with this url
					$new_url = Urlslab_Driver::get_driver( $file_obj )->get_url( $file_obj );
					if ( $new_url ) {
						foreach ( $urls[ $fileid ] as $attribute_name => $elements ) {
							foreach ( $elements as $element ) {
								$element['element']->setAttribute(
									$attribute_name,
									str_replace(
										$element['url'],
										$new_url,
										$element['element']->getAttribute( $attribute_name )
									)
								);
							}
							$found_urls[] = $fileid;
						}
					}
				}
				unset( $urls[ $fileid ] );//remove processed urls, so we will have at the end in this array just urls not in database
			}

			$this->update_last_seen_date( $found_urls );

			$this->schedule_missing_images( $urls );
			if ( count( $new_urls ) > 0 ) {
				return $document->saveHTML();
			}

			//nothing replaced, return the same content
			return $content;
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . esc_html( $e->getMessage() ) . "\n--->";
		}
	}

	private function get_new_urls( array $old_url_ids ) {
		global $wpdb;
		$new_urls = array();
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FILES_TABLE . ' WHERE fileid in (' . trim( str_repeat( '%s,', count( $old_url_ids ) ), ',' ) . ')', // phpcs:ignore
				$old_url_ids
			),
			'ARRAY_A'
		);
		foreach ( $results as $file_array ) {
			$file_obj = new Urlslab_File_Data( $file_array );
			$new_urls[ $file_obj->get_fileid() ] = $file_obj;
		}
		return $new_urls;
	}

	private function schedule_missing_images( array $urls ) {
		if ( ! ( $this->SETTING_SAVE_EXTERNAL || $this->SETTING_SAVE_INTERNAL ) ) {
			return;
		}

		$placeholders = array();
		$values = array();

		foreach ( $urls as $fileid => $attr_elements ) {
			foreach ( $attr_elements as $attr => $elements ) {
				if (
					( urlslab_is_same_domain_url( $elements[0]['url'] ) && $this->SETTING_SAVE_INTERNAL ) ||
					$this->SETTING_SAVE_EXTERNAL
				) {
					$placeholders[] = '(%s, %s, %s, %s)';
					array_push( $values, $fileid, $elements[0]['url'], Urlslab_Driver::STATUS_NEW, $this->SETTING_NEW_FILE_DRIVER );
				}
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_FILES_TABLE . ' (
                   fileid,
                   url,
                   filestatus,
                   driver) VALUES ' . implode( ', ', $placeholders );

			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}


	public function output_content() {
		global $_SERVER;
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return 'Path to file not detected.';
		}
		$path = pathinfo( $_SERVER['REQUEST_URI'] );
		$dirs = explode( '/', $path['dirname'] );
		$fileid = array_pop( $dirs );
		global $wpdb;

		$row = $wpdb->get_row( $wpdb->prepare( 'SELECT * from ' . URLSLAB_FILES_TABLE . ' WHERE fileid=%s', $fileid ), ARRAY_A ); // phpcs:ignore
		if ( empty( $row ) ) {
			status_header( 404 );
			exit( 'File not found' );
		}

		@set_time_limit( 0 );
		$file = new Urlslab_File_Data( $row );
		status_header( 200 );
		header( 'Content-Type: ' . $file->get_filetype() );
		header( 'Content-Disposition: inline; filename="' . $file->get_filename() . '"' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		//TODO define how long should be files cached (maybe each mime type should have own settings)
		$expires_offset = 9000;
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . $file->get_filesize() );

		$driver = Urlslab_Driver::get_driver( $file );
		$driver->output_file_content( $file );
	}

	private function update_last_seen_date( array $found_urls ) {
		if ( ! empty( $found_urls ) ) {
			global $wpdb;
			$query = 'UPDATE ' . URLSLAB_FILES_TABLE . ' SET last_seen = %s WHERE fileid IN (' . implode( ',', array_fill( 0, count( $found_urls ), '%s' ) ) . ')'; // phpcs:ignore
			array_unshift( $found_urls, gmdate( 'Y-m-d H:i:s' ) );
			$wpdb->query( $wpdb->prepare( $query, $found_urls ) ); // phpcs:ignore
		}
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-media-offloader' );
	}

	public function get_widget_tab(): string {
		return '';
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return '';
	}

	public function get_widget_settings(): array {
		return array(
			self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND => $this->SETTING_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			self::SETTING_NAME_SAVE_EXTERNAL => $this->SETTING_SAVE_EXTERNAL,
			self::SETTING_NAME_SAVE_INTERNAL => $this->SETTING_SAVE_INTERNAL,
			self::SETTING_NAME_NEW_FILE_DRIVER => $this->SETTING_NEW_FILE_DRIVER,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES => $this->SETTING_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 => $this->SETTING_TRANSFER_FROM_DRIVER_S3,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB => $this->SETTING_TRANSFER_FROM_DRIVER_DB,
		);
	}

	private function init_settings() {
		$option_name = $this->widget_slug;
		$option = get_option( $option_name );
		if ( false === $option ) {
			$option = array();
		}
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
			$this->SETTING_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_SAVE_EXTERNAL,
			$this->SETTING_SAVE_EXTERNAL
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_SAVE_INTERNAL,
			$this->SETTING_SAVE_INTERNAL
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_NEW_FILE_DRIVER,
			$this->SETTING_NEW_FILE_DRIVER
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES,
			$this->SETTING_TRANSFER_FROM_DRIVER_LOCAL_FILES
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3,
			$this->SETTING_TRANSFER_FROM_DRIVER_S3
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB,
			$this->SETTING_TRANSFER_FROM_DRIVER_DB
		);

		$this->SETTING_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND = $option[ self::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ];
		$this->SETTING_SAVE_EXTERNAL = $option[ self::SETTING_NAME_SAVE_EXTERNAL ];
		$this->SETTING_SAVE_INTERNAL = $option[ self::SETTING_NAME_SAVE_INTERNAL ];
		$this->SETTING_NEW_FILE_DRIVER = $option[ self::SETTING_NAME_NEW_FILE_DRIVER ];
		$this->SETTING_TRANSFER_FROM_DRIVER_LOCAL_FILES = $option[ self::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES ];
		$this->SETTING_TRANSFER_FROM_DRIVER_S3 = $option[ self::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 ];
		$this->SETTING_TRANSFER_FROM_DRIVER_DB = $option[ self::SETTING_NAME_TRANSFER_FROM_DRIVER_DB ];

		update_option( $option_name, $option );
	}

}
