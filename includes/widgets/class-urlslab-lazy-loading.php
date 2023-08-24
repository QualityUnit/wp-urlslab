<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-content-cache-row.php';

// phpcs:disable WordPress.NamingConventions
class Urlslab_Lazy_Loading extends Urlslab_Widget {
	public const SLUG = 'urlslab-lazy-loading';

	public const SHORTCODE_VIDEO = 'urlslab-video';

	// Lazy Loading settings
	public const SETTING_NAME_IMG_LAZY_LOADING = 'urlslab_img_lazy';
	public const SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER = 'urlslab_img_lazy_placeholder';
	public const SETTING_NAME_VIDEO_LAZY_LOADING = 'urlslab_video_lazy';
	public const SETTING_NAME_YOUTUBE_LAZY_LOADING = 'urlslab_youtube_lazy';
	const SETTING_NAME_YOUTUBE_TRACK_USAGE = 'urlslab_youtube_track_usage';
	public const SETTING_NAME_CONTENT_LAZY_LOADING = 'urlslab_content_lazy';
	public const SETTING_NAME_CONTENT_LAZY_MIN_PAGE_SIZE = 'urlslab_lz_min_content_size';
	public const SETTING_NAME_CONTENT_LAZY_MIN_CACHE_SIZE = 'urlslab_lz_min_cache_size';
	public const SETTING_NAME_CONTENT_LAZY_CLASSES = 'urlslab_lz_content_class';
	public const SETTING_NAME_REMOVE_WP_LAZY_LOADING = 'urlslab_remove_wp_lazy';

	public const DOWNLOAD_URL_PATH = 'urlslab-content/';
	const SETTING_NAME_ATTACH_GENERATOR_ID = 'urlslab_attach_generator_id';
	private $lazy_load_youtube_css = false;

	/**
	 * @var Urlslab_Content_Cache_Row[]
	 */
	private $content_docs = array();

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'the_content', 10 );
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}


	public function hook_callback() {
		add_shortcode( self::SHORTCODE_VIDEO, array( $this, 'get_video_shortcode_content' ) );
	}


	public function get_video_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $atts['videoid'] ) ) {
			if ( $this->is_edit_mode() ) {
				$atts['STATUS'] = __( 'Invalid videoid attribute!' );

				return $this->get_placeholder_html( $atts, self::SHORTCODE_VIDEO );
			}

			return '';
		}

		if ( $this->is_edit_mode() ) {
			return $this->get_placeholder_html( $atts, self::SHORTCODE_VIDEO );
		}

		if ( isset( $atts['nl2br'] ) ) {
			$atts['nl2br'] = filter_var( $atts['nl2br'], FILTER_VALIDATE_BOOLEAN );
		} else {
			$atts['nl2br'] = false;
		}
		if ( $atts['nl2br'] ) {
			return nl2br( urlslab_video_attribute( $atts['videoid'], $atts['attribute'] ) );
		}

		return urlslab_video_attribute( $atts['videoid'], $atts['attribute'] );
	}


	public function get_widget_slug(): string {
		return Urlslab_Lazy_Loading::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Lazy Loading' );
	}

	public function get_widget_description(): string {
		return __( 'Optimise site performance using lazy loading. Decrease load time by postponing the loading of images, videos, iframes, and major content sections' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function the_content( DOMDocument $document ) {
		if ( is_admin() || is_404() ) {
			return;
		}
		if ( $this->get_option( self::SETTING_NAME_CONTENT_LAZY_LOADING ) ) {
			$this->content_lazy_loading( $document );
		}

		if ( $this->get_option( self::SETTING_NAME_YOUTUBE_LAZY_LOADING ) ) {
			$this->add_youtube_lazy_loading( $document );
		}
		if ( $this->get_option( self::SETTING_NAME_REMOVE_WP_LAZY_LOADING ) ) {
			$this->remove_default_wp_img_lazy_loading( $document );
		}
		if ( $this->get_option( self::SETTING_NAME_IMG_LAZY_LOADING ) ) {
			$this->add_images_lazy_loading( $document );
		}
		if ( $this->get_option( self::SETTING_NAME_VIDEO_LAZY_LOADING ) ) {
			$this->add_videos_lazy_loading( $document );
		}
	}

	public static function get_supported_media(): array {
		return array(
			'img'    => array(
				'src',
				'data-src',
				'data-full-url',
				'data-splide-lazy',
				'srcset',
				'data-srcset',
			),
			'video'  => array(
				'src',
				'data-src',
			),
			'audio'  => array(
				'src',
				'data-src',
			),
			'source' => array(
				'srcset',
				'data-srcset',
			),
		);
	}

	public static function output_content() {
		global $_SERVER;


		if ( isset( $_GET['action'] ) && self::DOWNLOAD_URL_PATH === $_GET['action'] && isset( $_GET['hash'] ) ) {
			$filename = $_GET['hash'];
		} else {
			if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
				return 'Path to file not detected.';
			}

			$path = pathinfo( $_SERVER['REQUEST_URI'] );
			if ( isset( $path['filename'] ) ) {
				$filename = $path['filename'];
			}
		}


		if ( empty( $filename ) || false === strpos( $filename, '_' ) ) {
			status_header( 404 );

			exit( 'Not found' );
		}

		list( $hash, $size ) = explode( '_', $filename );
		if ( ! is_numeric( $hash ) || ! is_numeric( $size ) || empty( $size ) || empty( $hash ) ) {
			status_header( 404 );

			exit( 'Not found' );
		}

		$obj = new Urlslab_Content_Cache_Row(
			array(
				'cache_crc32' => $hash,
				'cache_len'   => $size,
			)
		);

		if ( ! $obj->load() ) {
			status_header( 404 );

			exit( 'Not found' );
		}

		@set_time_limit( 0 );

		status_header( 200 );
		header( 'Content-Type: text/html;charset=UTF-8' );
		header( 'Pragma: public' );
		$expires_offset = 31536000;
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age={$expires_offset}" );
		header( 'Content-length: ' . $size );
		echo $obj->get_cache_content(); // phpcs:ignore
	}

	protected function add_options() {
		$this->add_options_form_section(
			'main',
			__( 'Lazy Loading Configuration' ),
			__( 'Lazy loading is a key performance optimization method that waits to load resources until they\'re required. This saves bandwidth and boosts page loading speeds, ensuring a user-friendly experience.' ),
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMG_LAZY_LOADING,
			true,
			true,
			__( 'Image Lazy Loading' ),
			__( 'Enable lazy loading for images on all your pages.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER,
			false,
			true,
			__( 'Generate Empty Image as Placeholder' ),
			__( 'Display blank placeholder images to reduce the CLS factor in Core Web Vitals related to lazy image loading. Some browsers may not correctly display the images; test before using in production.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main',
			array( self::LABEL_EXPERIMENTAL )
		);
		$this->add_option_definition(
			self::SETTING_NAME_VIDEO_LAZY_LOADING,
			true,
			true,
			__( 'Video Lazy Loading' ),
			__( 'Enable lazy loading for videos on all your pages.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_WP_LAZY_LOADING,
			true,
			true,
			__( 'Disable WordPress Lazy Loading' ),
			__( 'Remove the `loading="lazy"` attribute from the source code as it may cause issues with module lazy image loading. To exclude specific images, apply the `urlslab-skip-nolazy` class name to the image or sections containing images.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section(
			'youtube',
			__( 'YouTube Configuration' ),
			__( ' Enhance website efficiency with YouTube videos\' lazy loading, oversee usage for analytics, and automatically produce captions and summaries for improved SEO.' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_YOUTUBE_LAZY_LOADING,
			false,
			true,
			__( 'YouTube Lazy Loading' ),
			__( 'Enable enhanced lazy loading for YouTube videos on all your pages.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'youtube'
		);
		$this->add_option_definition(
			self::SETTING_NAME_YOUTUBE_TRACK_USAGE,
			true,
			true,
			__( 'Monitor Usage of YouTube Videos' ),
			__( 'Monitor URLs that contain YouTube videos used in the lazy loading method.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'youtube'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ATTACH_GENERATOR_ID,
			0,
			false,
			__( 'Attach AI-generated Content to YouTube Video' ),
			__( 'Attach AI-generated content to every video using a predefined Shortcode ID from the AI Content Generator. Options include video overviews, complete transcripts, or other  enhancements.' ),
			self::OPTION_TYPE_LISTBOX,
			function() {
				global $wpdb;
				$rows       = array();
				$rows[0]    = __( 'No generator is attached to YouTube videos' );
				$generators = $wpdb->get_results( $wpdb->prepare( 'SELECT shortcode_id, shortcode_name FROM ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . ' WHERE shortcode_type = %s', Urlslab_Generator_Shortcode_Row::TYPE_VIDEO ), ARRAY_A ); // phpcs:ignore
				foreach ( $generators as $generator ) {
					$rows[ $generator['shortcode_id'] ] = $generator['shortcode_name'];
				}

				return $rows;
			},
			null,
			'youtube',
			array(
				self::LABEL_PAID,
			)
		);

		$this->add_options_form_section(
			'content',
			__( 'Content Lazy Loading Configuration' ),
			__( 'Content lazy loading significantly improves DOM size optimization on the initial page load, enhancing user experience. As the user scrolls, content is dynamically fetched from the server and displayed, promoting faster loading and an overall improved experience.' ),
			array( self::LABEL_FREE, self::LABEL_EXPERT )
		);

		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_LOADING,
			false,
			true,
			__( 'Content Lazy Loading' ),
			__( 'Enable content lazy loading on all your pages.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'content'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_MIN_PAGE_SIZE,
			10000,
			true,
			__( 'Minimum Size of Page Content (characters)' ),
			__( 'Sections and elements of the page will be lazy-loaded when the character count exceeds the set limit.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'content'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_MIN_CACHE_SIZE,
			1000,
			true,
			__( 'Minimum Size of Lazy Loaded Content (characters)' ),
			__( 'When a section or element\'s content is insignificant, lazy loading it may be unnecessary. This parameter allows you to set a minimum size for content to be eligible for lazy loading.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'content'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_CLASSES,
			false,
			true,
			__( 'List of CSS Class Names to Lazy Load' ),
			__( 'Class Names of sections or elements suitable for lazy loading.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'content'
		);

	}

	private function add_videos_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//video[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $dom_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) ) {
				$this->add_video_lazy_loading( $element );
			}
		}
	}

	private function add_images_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')]) and not(starts-with(@src, 'data:')) and not(ancestor::*[@id='wpadminbar'])]" );
		foreach ( $dom_elements as $element ) {
			$has_lazy_loading_attr = false;
			foreach ( self::get_supported_media()['img'] as $valid_attr ) {
				if ( $element->hasAttribute( $valid_attr ) ) {
					$has_lazy_loading_attr = true;

					break;
				}
			}

			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) && $has_lazy_loading_attr ) {
				$this->add_img_lazy_loading( $element );
			}
		}
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//source[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')]) and not(ancestor::*[@id='wpadminbar'])]" );
		foreach ( $dom_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) ) {
				$this->add_source_lazy_loading( $element );
			}
		}
	}

	private function remove_default_wp_img_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[@loading='lazy' and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-nolazy')]) and not(ancestor::*[@id='wpadminbar'])]" );
		foreach ( $dom_elements as $element ) {
			$element->removeAttribute( 'loading' );
		}
	}

	private function add_youtube_lazy_loading( DOMDocument $document ) {
		$youtube_ids = array();
		$xpath       = new DOMXPath( $document );

		// find all YouTube iframes
		$iframe_elements = $xpath->query( "//iframe[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $iframe_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) && $element->hasAttribute( 'src' ) ) {
				$ytid = Urlslab_Youtube_Row::parse_video_id( $element->getAttribute( 'src' ) );
				if ( $ytid ) {
					$youtube_ids[ $ytid ] = $ytid;
				}
			}
		}

		// find elementor blocks
		$elementor_divs = $xpath->query( "//div[contains(@class, 'elementor-widget-video') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $elementor_divs as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) && $element->hasAttribute( 'data-settings' ) ) {
				$json = json_decode( $element->getAttribute( 'data-settings' ) );
				if ( is_object( $json ) && property_exists( $json, 'youtube_url' ) ) {
					$ytid = Urlslab_Youtube_Row::parse_video_id( $json->youtube_url );
					if ( $ytid ) {
						$youtube_ids[ $ytid ] = $ytid;
					}
				}
			}
		}

		// find all elements with data-ytid parameter
		$yt_elements = $xpath->query( "//*[@data-ytid and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $yt_elements as $yt_element ) {
			if ( ! $this->is_skip_elemenet( $yt_element, 'lazy' ) ) {
				$ytid                 = $yt_element->getAttribute( 'data-ytid' );
				$youtube_ids[ $ytid ] = $ytid;
			}
		}

		if ( empty( $youtube_ids ) ) {
			return; // no yt videos in page
		}

		$this->track_usage( $youtube_ids );

		$video_objects = $this->get_youtube_videos( array_keys( $youtube_ids ) );

		// replace iframe with placeholder
		foreach ( $iframe_elements as $element ) {
			if ( $element->hasAttribute( 'src' ) ) {
				$ytid = Urlslab_Youtube_Row::parse_video_id( $element->getAttribute( 'src' ) );
				if ( $ytid ) {
					$this->replace_youtube_element_with_placeholder( $document, $element, $video_objects, $ytid );
				}
			}
		}

		// replace elementor objects with placeholder
		foreach ( $elementor_divs as $element ) {
			if ( $element->hasAttribute( 'data-settings' ) ) {
				$json = json_decode( $element->getAttribute( 'data-settings' ) );
				if ( is_object( $json ) && property_exists( $json, 'youtube_url' ) ) {
					$ytid = Urlslab_Youtube_Row::parse_video_id( $json->youtube_url );
					if ( $ytid ) {
						$this->emhance_elementor_element_with_placeholder( $document, $element, $video_objects, $ytid );
					}
				}
			}
		}

		// add schema to all elements with attribute data-ytid
		$yt_elements = $xpath->query( "//*[@data-ytid and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $yt_elements as $yt_element ) {
			$ytid = $yt_element->getAttribute( 'data-ytid' );
			if ( isset( $video_objects[ $ytid ] ) && $video_objects[ $ytid ]->has_microdata() ) {
				$this->append_video_schema( $document, $yt_element, $video_objects[ $ytid ] );
			}
		}
	}

	/**
	 * this is workaround of parsing bug in php DOMDocument which doesn't understand the source as single tag.
	 */
	private function has_parent_node( DOMElement $dom_element, $tag_name ): bool {
		if ( property_exists( $dom_element, 'parentNode' ) ) {
			if ( property_exists( $dom_element->parentNode, 'tagName' ) && $dom_element->parentNode->tagName == $tag_name ) {
				return true;
			}

			return 'DOMElement' == get_class( $dom_element->parentNode ) && $this->has_parent_node( $dom_element->parentNode, $tag_name );
		}

		return false;
	}

	/**
	 * @return Urlslab_Youtube_Row[]
	 */
	private function get_youtube_videos( array $youtube_ids ): array {
		if ( empty( $youtube_ids ) ) {
			return array();
		}
		global $wpdb;
		$videos  = array();
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE videoid in (' . trim( str_repeat( '%s,', count( $youtube_ids ) ), ',' ) . ')', // phpcs:ignore
				$youtube_ids
			),
			'ARRAY_A'
		);

		foreach ( $results as $row ) {
			$video_obj                            = new Urlslab_Youtube_Row( $row, true );
			$videos[ $video_obj->get_video_id() ] = $video_obj;
		}

		// schedule missing videos
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();
		foreach ( $youtube_ids as $videoid ) {
			if ( ! isset( $videos[ $videoid ] ) ) {
				$placeholders[] = '(%s,%s,%s)';
				array_push( $values, $videoid, Urlslab_Youtube_Row::STATUS_NEW, $now );

				$videos[ $videoid ] = new Urlslab_Youtube_Row( array( 'videoid' => $videoid ), false );
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' (videoid, status, status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}

		return $videos;
	}

	private function append_video_schema( DOMDocument $document, DOMElement $youtube_loader, Urlslab_Youtube_Row $youtube_obj ) {
		if ( ! empty( $youtube_obj->get_microdata() ) ) {
			$schema = $document->createElement( 'div' );
			$schema->setAttribute( 'itemscope', false );
			$schema->setAttribute( 'itemtype', 'https://schema.org/VideoObject' );
			$schema->setAttribute( 'itemprop', 'video' );
			$this->append_meta_attribute( $document, $schema, 'name', empty( $youtube_obj->get_title() ) ? __( 'Youtube Video' ) : $youtube_obj->get_title() );
			$this->append_meta_attribute( $document, $schema, 'description', empty( trim( $youtube_obj->get_description() ) ) ? __( 'Video about: ' ) . $youtube_obj->get_title() : $youtube_obj->get_description() );
			$this->append_meta_attribute( $document, $schema, 'thumbnailUrl', $youtube_obj->get_thumbnail_url(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'contentUrl', 'https://www.youtube.com/watch?v=' . $youtube_obj->get_video_id(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'embedUrl', 'https://www.youtube.com/embed/' . $youtube_obj->get_video_id(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'duration', empty( $youtube_obj->get_duration() ) ? 'PT90s' : $youtube_obj->get_duration() );
			$this->append_meta_attribute( $document, $schema, 'uploadDate', empty( $youtube_obj->get_published_at() ) ? date( 'Y-m-d\TH:i:s\Z', strtotime( '-10 days' ) ) : $youtube_obj->get_published_at() );    // phpcs:ignore
			$youtube_loader->appendChild( $schema );
		}
	}

	private function append_meta_attribute( DOMDocument $document, DOMElement $schema, $name, $content, $element_type = 'meta' ) {
		$meta = $document->createElement( $element_type );
		$meta->setAttribute( 'itemprop', $name );
		$meta->setAttribute( 'content', $content );
		$schema->appendChild( $meta );
	}

	private function add_img_lazy_loading( DOMElement $dom_element ) {
		if ( $dom_element->hasAttribute( 'src' ) && ! str_starts_with( $dom_element->getAttribute( 'src' ), 'data:' ) ) {
			$dom_element->setAttribute( 'data-src', $dom_element->getAttribute( 'src' ) );
			if ( $this->get_option( self::SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER ) ) {
				$dom_element->setAttribute( 'src', $this->get_image_data( $dom_element->getAttribute( 'width' ), $dom_element->getAttribute( 'height' ) ) );
			} else {
				$dom_element->removeAttribute( 'src' );
			}
		}

		if ( $dom_element->hasAttribute( 'srcset' ) ) {
			$dom_element->setAttribute( 'data-srcset', $dom_element->getAttribute( 'srcset' ) );
			$dom_element->removeAttribute( 'srcset' );
		}

		if ( $dom_element->hasAttribute( 'data-splide-lazy' ) ) {
			$dom_element->setAttribute( 'data-src', $dom_element->getAttribute( 'data-splide-lazy' ) );
			if ( $this->get_option( self::SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER ) ) {
				$dom_element->setAttribute( 'src', $this->get_image_data( $dom_element->getAttribute( 'width' ), $dom_element->getAttribute( 'height' ) ) );
			} else {
				$dom_element->removeAttribute( 'src' );
			}
		}

		if ( $dom_element->hasAttribute( 'style' ) ) {
			$dom_element->setAttribute( 'data-urlslabstyle', $dom_element->getAttribute( 'style' ) );
		}
		$dom_element->setAttribute( 'style', 'opacity: 0; transition: opacity .5s;' );

		if ( ! $dom_element->hasAttribute( 'loading' ) && ! $this->get_option( self::SETTING_NAME_REMOVE_WP_LAZY_LOADING ) ) {
			$dom_element->setAttribute( 'loading', 'lazy' );
		}
		$dom_element->setAttribute( 'urlslab-lazy', 'yes' );
	}

	private function add_source_lazy_loading( DOMElement $dom_element ) {
		if ( $this->has_parent_node( $dom_element, 'picture' ) ) {
			if ( $dom_element->hasAttribute( 'srcset' ) ) {
				$dom_element->setAttribute( 'data-srcset', $dom_element->getAttribute( 'srcset' ) );
				$dom_element->removeAttribute( 'srcset' );
			}
			$dom_element->setAttribute( 'urlslab-lazy', 'yes' );
		}
	}


	private function lazyload_youtube_css( DOMDocument $document, DOMElement $element ) {
		if ( $this->lazy_load_youtube_css ) {
			return true;
		}
		$css_link_element = $document->createElement( 'link' );
		$css_link_element->setAttribute( 'rel', 'stylesheet' );
		$css_link_element->setAttribute( 'id', 'urlslab_youtube_loader-css' );
		$css_link_element->setAttribute( 'type', 'text/css' );
		$css_link_element->setAttribute( 'media', 'all' );
		$css_link_element->setAttribute( 'href', plugin_dir_url( URLSLAB_PLUGIN_DIR . 'public/build/css/urlslab_youtube_loader.css' ) . 'urlslab_youtube_loader.css' );
		$element->insertBefore( $css_link_element );
		$this->lazy_load_youtube_css = true;
	}

	/**
	 * @param DOMDocument $document
	 * @param DOMElement $element
	 * @param Urlslab_Youtube_Row[] $video_objects
	 * @param $ytid
	 *
	 * @return bool
	 * @throws DOMException
	 */
	private function emhance_elementor_element_with_placeholder( DOMDocument $document, DOMElement $element, $video_objects, $ytid ): bool {
		$youtube_loader = $document->createElement( 'div' );
		$youtube_loader->setAttribute( 'class', 'youtube_urlslab_loader youtube_urlslab_loader--elementor' );
		$youtube_loader->setAttribute( 'data-ytid', $ytid );

		$this->create_yt_video_dom( $document, $video_objects[ $ytid ], $youtube_loader );

		$xpath = new DOMXPath( $document );
		$child = $xpath->query( "//div[@data-id='" . $element->getAttribute( 'data-id' ) . "']//div[contains(@class, 'elementor-video')]" );
		if ( $child->length ) {
			$child->item( 0 )->appendChild( $youtube_loader );
		}

		$this->lazyload_youtube_css( $document, $youtube_loader );

		return true;
	}


	/**
	 * @param DOMDocument $document
	 * @param DOMElement $element
	 * @param Urlslab_Youtube_Row[] $video_objects
	 * @param $ytid
	 *
	 * @return bool
	 * @throws DOMException
	 */
	private function replace_youtube_element_with_placeholder( DOMDocument $document, DOMElement $element, $video_objects, $ytid ): bool {
		$youtube_loader = $document->createElement( 'div' );
		$youtube_loader->setAttribute( 'class', 'youtube_urlslab_loader' );
		$youtube_loader->setAttribute( 'data-ytid', $ytid );
		if ( $element->hasAttribute( 'width' ) ) {
			$youtube_loader->setAttribute( 'width', $element->getAttribute( 'width' ) );
		}
		if ( $element->hasAttribute( 'height' ) ) {
			$youtube_loader->setAttribute( 'height', $element->getAttribute( 'height' ) );
		}

		$this->create_yt_video_dom( $document, $video_objects[ $ytid ], $youtube_loader );

		$element->parentNode->replaceChild( $youtube_loader, $element );

		$this->lazyload_youtube_css( $document, $youtube_loader );

		return true;
	}

	private function add_video_lazy_loading( DOMElement $dom_element ) {
		if ( $dom_element->hasAttribute( 'style' ) ) {
			$dom_element->setAttribute( 'data-urlslabstyle', $dom_element->getAttribute( 'style' ) );
		}
		$dom_element->setAttribute( 'style', 'opacity: 0;' );

		if ( $dom_element->hasAttribute( 'src' ) ) {
			$dom_element->setAttribute( 'data-src', $dom_element->getAttribute( 'src' ) );
			$dom_element->removeAttribute( 'src' );
		}
		$dom_element->setAttribute( 'urlslab-lazy', 'yes' );
	}

	private function get_image_data( $width = 1200, $height = 1000 ) {
		if ( empty( $width ) ) {
			$width = 1;
		}
		if ( empty( $height ) ) {
			$height = 1;
		}
		$width  = (int) $width;
		$height = (int) $height;

		return 'data:image/svg+xml;base64,' . base64_encode( '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '"></svg>' );
	}

	private function content_lazy_loading( DOMDocument $document ) {
		if ( $this->get_option( self::SETTING_NAME_CONTENT_LAZY_MIN_PAGE_SIZE ) > strlen( $document->saveHTML() ) ) {
			return true;    // size of document is smaller as limit for content lazy loading
		}
		$this->content_docs = array();

		$classnames     = preg_split( '/(,|\n|\t)\s*/', $this->get_option( self::SETTING_NAME_CONTENT_LAZY_CLASSES ) );
		$str_classnames = array();
		foreach ( $classnames as $class ) {
			$class = trim( $class );
			if ( strlen( $class ) ) {
				$str_classnames[] = "contains(@class, '" . esc_attr( $class ) . "')";
			}
		}

		if ( empty( $str_classnames ) ) {
			return true;
		}

		$this->content_lazy_loading_recursive( $document, 0, implode( ' or ', $str_classnames ) );
		if ( ! empty( $this->content_docs ) ) {
			$placeholders = array();
			foreach ( $this->content_docs as $doc ) {
				$placeholders[] = '(cache_crc32=%d AND cache_len=%d)';
				$sql_data[]     = $doc->get_cache_crc32();
				$sql_data[]     = $doc->get_cache_len();
			}
			global $wpdb;
			$results = $wpdb->get_results( $wpdb->prepare( 'SELECT cache_crc32, cache_len FROM ' . URLSLAB_CONTENT_CACHE_TABLE . ' WHERE ' . implode( ' OR ', $placeholders ), $sql_data ), 'ARRAY_A' ); // phpcs:ignore

			foreach ( $results as $db_row ) {
				unset( $this->content_docs[ $db_row['cache_crc32'] . '_' . $db_row['cache_len'] ] );
			}

			if ( ! empty( $this->content_docs ) ) {
				if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Html_Optimizer::SLUG ) ) {
					/** @var Urlslab_Html_Optimizer $widget */
					$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Html_Optimizer::SLUG );
					foreach ( $this->content_docs as $doc ) {
						$doc->set_cache_content( $widget->minify_content( $doc->get_cache_content() ) );
					}
				}

				$obj = new Urlslab_Content_Cache_Row();
				$obj->insert_all( $this->content_docs, true );
			}
		}
	}

	private function content_lazy_loading_recursive( DOMDocument $document, $iteration, $classes ) {
		if ( $iteration > 100 ) {
			return true;
		}

		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( '//*[not(@urlslab_lazy_small) and (' . $classes . ") and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')]) and not(ancestor::*[@id='wpadminbar'])]" );
		foreach ( $elements as $dom_elem ) {
			$element_html     = $document->saveHTML( $dom_elem );
			$element_html_len = strlen( $element_html );
			if ( $element_html_len > $this->get_option( self::SETTING_NAME_CONTENT_LAZY_MIN_CACHE_SIZE ) ) {
				$lazy_element = $document->createElement( 'div' );

				$obj = new Urlslab_Content_Cache_Row(
					array(
						'cache_len'     => $element_html_len,
						'cache_content' => $element_html,
					),
					false
				);

				$id                        = $obj->get_primary_id( '_' );
				$this->content_docs[ $id ] = $obj;
				$lazy_element->setAttribute( 'lazy_hash', $id );
				$dom_elem->parentNode->replaceChild( $lazy_element, $dom_elem );

				return $this->content_lazy_loading_recursive( $document, $iteration + 1, $classes );
			}
			$dom_elem->setAttribute( 'urlslab_lazy_small', $element_html_len );
		}
	}

	private function track_usage( array $youtube_ids ) {
		if ( ! $this->get_option( self::SETTING_NAME_YOUTUBE_TRACK_USAGE ) ) {
			return;
		}
		$objects = array();
		$url_id  = Urlslab_Url::get_current_page_url()->get_url_id();
		foreach ( $youtube_ids as $youtube_id ) {
			$row = new Urlslab_Youtube_Url_Row();
			$row->set_videoid( $youtube_id );
			$row->set_url_id( $url_id );
			$objects[] = $row;
		}
		$row->insert_all( $objects, true );
	}


	function duration_to_time( $youtube_time ) {
		if ( $youtube_time ) {
			$start = new DateTime( '@0' ); // Unix epoch
			$start->add( new DateInterval( $youtube_time ) );
			$youtube_time = ltrim( ltrim( $start->format( 'H:i:s' ), '0' ), ':' );
		}

		return $youtube_time;
	}

	/**
	 * @param DOMDocument $document
	 * @param Urlslab_Youtube_Row $yt_object
	 * @param $ytid
	 * @param false|DOMElement $youtube_loader
	 *
	 * @return void
	 * @throws DOMException
	 */
	private function create_yt_video_dom( DOMDocument $document, Urlslab_Youtube_Row $yt_object, DOMElement $youtube_loader ): void {
		$youtube_title        = $document->createElement( 'strong', htmlspecialchars( $yt_object->get_title() . ' | ' . $yt_object->get_channel_title() ) );
		$youtube_title_bottom = $document->createElement( 'h3', htmlspecialchars( $yt_object->get_title() . ' | ' . $yt_object->get_channel_title() ) );
		$youtube_title->setAttribute( 'class', 'youtube_urlslab_loader--title' );
		$youtube_title_bottom->setAttribute( 'class', 'youtube_urlslab_loader--titleBottom' );

		$youtube_bottom = $document->createElement( 'div' );
		$youtube_bottom->setAttribute( 'class', 'youtube_urlslab_loader--bottom' );
		$youtube_wrapper_inn = $document->createElement( 'div' );
		$youtube_wrapper_inn->setAttribute( 'class', 'youtube_urlslab_loader--inn' );
		$youtube_img_wrapper = $document->createElement( 'div' );
		$youtube_img_wrapper->setAttribute( 'class', 'youtube_urlslab_loader--wrapper' );
		$youtube_channel  = $document->createElement( 'strong', htmlspecialchars( $yt_object->get_channel_title() ) );
		$youtube_duration = $document->createElement( 'strong', $this->duration_to_time( $yt_object->get_duration() ) );
		$youtube_duration->setAttribute( 'class', 'youtube_urlslab_loader--duration' );
		$youtube_published = $document->createElement( 'time', date_i18n( get_option( 'date_format' ), strtotime( $yt_object->get_published_at() ) ) );
		$youtube_published->setAttribute( 'datetime', $yt_object->get_published_at() );
		$youtube_bottom->appendChild( $youtube_channel );
		$youtube_bottom->appendChild( $youtube_published );
		$youtube_img_wrapper->appendChild( $youtube_title );
		$youtube_img_wrapper->appendChild( $youtube_duration );

		$youtube_img = $document->createElement( 'img' );
		$youtube_img->setAttribute( 'class', 'youtube_urlslab_loader--img' );
		$youtube_img->setAttribute( 'data-src', 'https://i.ytimg.com/vi/' . $yt_object->get_video_id() . '/hqdefault.jpg' );
		if ( strlen( $yt_object->get_title() ) ) {
			$youtube_img->setAttribute( 'alt', 'Youtube video: ' . $yt_object->get_title() );
		}
		$youtube_img->setAttribute( 'urlslab-lazy', 'yes' );
		$youtube_img_wrapper->appendChild( $youtube_img );
		$youtube_wrapper_inn->appendChild( $youtube_img_wrapper );
		$youtube_wrapper_inn->appendChild( $youtube_bottom );
		$youtube_loader->appendChild( $youtube_wrapper_inn );

		if ( is_numeric( $this->get_option( self::SETTING_NAME_ATTACH_GENERATOR_ID ) ) && $this->get_option( self::SETTING_NAME_ATTACH_GENERATOR_ID ) > 0 ) {
			$shortcode = do_shortcode( '[urlslab-generator id="' . ( (int) $this->get_option( self::SETTING_NAME_ATTACH_GENERATOR_ID ) ) . '" videoid="' . $yt_object->get_video_id() . '"]' );
			if ( strlen( $shortcode ) ) {
				$youtube_shortcode_node = $document->createElement( 'div' );
				$youtube_shortcode_node->setAttribute( 'class', 'youtube_urlslab_loader--shortcode' );
				$dom                      = new DOMDocument();
				$dom->strictErrorChecking = false; // phpcs:ignore
				$libxml_previous_state    = libxml_use_internal_errors( true );
				$dom->loadHTML( '<?xml encoding="utf-8" ?>' . $shortcode, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
				libxml_clear_errors();
				libxml_use_internal_errors( $libxml_previous_state );

				foreach ( $dom->childNodes as $childNode ) {
					$youtube_shortcode_node->appendChild( $document->importNode( $childNode, true ) );
				}

				$youtube_loader->appendChild( $youtube_shortcode_node );
			}
		}
	}
}

function urlslab_video_attribute( $videoid, $attribute_name ) {
	try {
		$obj_video = Urlslab_Youtube_Row::get_video_obj( $videoid );
		switch ( $attribute_name ) {
			case 'title':
				return $obj_video->get_title();
			case 'description':
				return $obj_video->get_description();
			case 'thumbnail_url':
				return $obj_video->get_thumbnail_url();
			case 'published_at':
				return $obj_video->get_published_at();
			case 'duration':
				return $obj_video->get_duration();
			case 'captions':
				return $obj_video->get_captions();
			case 'captions_text':
				return $obj_video->get_captions_as_text();
			case 'channel_title':
				return $obj_video->get_channel_title();
			default:
				return '';
		}
	} catch ( Exception $e ) {
	}

	return '';
}

function urlslab_video_attributes( $videoid ): array {
	try {
		$obj_video = Urlslab_Youtube_Row::get_video_obj( $videoid );

		return $obj_video->as_array();
	} catch ( Exception $e ) {
		return array();
	}
}
