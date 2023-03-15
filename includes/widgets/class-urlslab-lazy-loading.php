<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-content-cache-row.php';

// phpcs:disable WordPress.NamingConventions
class Urlslab_Lazy_Loading extends Urlslab_Widget {
	const SLUG = 'urlslab-lazy-loading';

	private $lazy_load_youtube_css = false;

	/**
	 * @var Urlslab_Content_Cache_Row[]
	 */
	private $content_docs = array();

	//Lazy Loading settings
	public const SETTING_NAME_IMG_LAZY_LOADING = 'urlslab_img_lazy';
	public const SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER = 'urlslab_img_lazy_placeholder';
	public const SETTING_NAME_VIDEO_LAZY_LOADING = 'urlslab_video_lazy';
	public const SETTING_NAME_YOUTUBE_LAZY_LOADING = 'urlslab_youtube_lazy';
	public const SETTING_NAME_CONTENT_LAZY_LOADING = 'urlslab_content_lazy';
	public const SETTING_NAME_CONTENT_LAZY_MIN_PAGE_SIZE = 'urlslab_lz_min_content_size';
	public const SETTING_NAME_CONTENT_LAZY_MIN_CACHE_SIZE = 'urlslab_lz_min_cache_size';
	public const SETTING_NAME_CONTENT_LAZY_CLASSES = 'urlslab_lz_content_class';
	public const SETTING_NAME_REMOVE_WP_LAZY_LOADING = 'urlslab_remove_wp_lazy';
	public const SETTING_NAME_YOUTUBE_API_KEY = 'urlslab_youtube_apikey';

	public const DOWNLOAD_URL_PATH = 'urlslab-content/';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'the_content', 10 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Lazy_Loading::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Lazy Loading' );
	}

	public function get_widget_description(): string {
		return __( '(Speed) Lazy Loading improves loading speed of your website. All not needed content is loaded later once visitor needs it.' );
	}

	public function the_content( DOMDocument $document ) {
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

	private function add_videos_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//video[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $dom_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) ) {
				$this->add_video_lazy_loading( $element );
			}
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

	private function add_images_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')]) and not(starts-with(@src, 'data:'))]" );
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
		$dom_elements = $xpath->query( "//source[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $dom_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) ) {
				$this->add_source_lazy_loading( $element );
			}
		}
	}

	private function remove_default_wp_img_lazy_loading( DOMDocument $document ) {
		$xpath        = new DOMXPath( $document );
		$dom_elements = $xpath->query( "//img[@loading='lazy' and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-nolazy')])]" );
		foreach ( $dom_elements as $element ) {
			$element->removeAttribute( 'loading' );
		}
	}

	private function add_youtube_lazy_loading( DOMDocument $document ) {
		$youtube_ids = array();
		$xpath       = new DOMXPath( $document );

		//find all YouTube iframes
		$iframe_elements = $xpath->query( "//iframe[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $iframe_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) && $element->hasAttribute( 'src' ) ) {
				$ytid = $this->get_youtube_videoid( $element->getAttribute( 'src' ) );
				if ( $ytid ) {
					$youtube_ids[ $ytid ] = $ytid;
				}
			}
		}

		//find elementor blocks
		$elementor_divs = $xpath->query( "//div[contains(@class, 'elementor-widget-video') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $elementor_divs as $element ) {
			if ( ! $this->is_skip_elemenet( $element, 'lazy' ) && $element->hasAttribute( 'data-settings' ) ) {
				$json = json_decode( $element->getAttribute( 'data-settings' ) );
				if ( is_object( $json ) && property_exists( $json, 'youtube_url' ) ) {
					$ytid = $this->get_youtube_videoid( $json->youtube_url );
					if ( $ytid ) {
						$youtube_ids[ $ytid ] = $ytid;
					}
				}
			}
		}

		//find all elements with data-ytid parameter
		$yt_elements = $xpath->query( "//*[@data-ytid and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $yt_elements as $yt_element ) {
			if ( ! $this->is_skip_elemenet( $yt_element, 'lazy' ) ) {
				$ytid                 = $yt_element->getAttribute( 'data-ytid' );
				$youtube_ids[ $ytid ] = $ytid;
			}
		}


		if ( empty( $youtube_ids ) ) {
			return; //no yt videos in page
		}

		$video_objects = $this->get_youtube_videos( array_keys( $youtube_ids ) );

		//replace iframe with placeholder
		foreach ( $iframe_elements as $element ) {
			if ( $element->hasAttribute( 'src' ) ) {
				$ytid = $this->get_youtube_videoid( $element->getAttribute( 'src' ) );
				if ( $ytid ) {
					$this->replace_youtube_element_with_placeholder( $document, $element, $video_objects, $ytid );
				}
			}
		}

		//replace elementor objects with placeholder
		foreach ( $elementor_divs as $element ) {
			if ( $element->hasAttribute( 'data-settings' ) ) {
				$json = json_decode( $element->getAttribute( 'data-settings' ) );
				if ( is_object( $json ) && property_exists( $json, 'youtube_url' ) ) {
					$ytid = $this->get_youtube_videoid( $json->youtube_url );
					if ( $ytid ) {
						$this->emhance_elementor_element_with_placeholder( $document, $element, $video_objects, $ytid );
					}
				}
			}
		}

		//add schema to all elements with attribute data-ytid
		$yt_elements = $xpath->query( "//*[@data-ytid and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $yt_elements as $yt_element ) {
			$ytid = $yt_element->getAttribute( 'data-ytid' );
			if ( isset( $video_objects[ $ytid ] ) && Urlslab_Youtube_Row::STATUS_AVAILABLE === $video_objects[ $ytid ]->get_status() ) {
				$this->append_video_schema( $document, $yt_element, $video_objects[ $ytid ] );
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
		if ( property_exists( $dom_element, 'parentNode' ) ) {
			if ( property_exists( $dom_element->parentNode, 'tagName' ) && $dom_element->parentNode->tagName == $tag_name ) {
				return true;
			}

			return 'DOMElement' == get_class( $dom_element->parentNode ) && $this->has_parent_node( $dom_element->parentNode, $tag_name );
		}

		return false;
	}

	private function get_youtube_videoid( $url ) {
		if ( preg_match( "/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user|shorts)\/))([^\?&\"'>]+)/", $url, $matches ) ) {
			return $matches[1];
		}

		return false;
	}

	/**
	 * @param array $youtube_ids
	 *
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


		//schedule missing videos
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();
		foreach ( $youtube_ids as $videoid ) {
			if ( ! isset( $videos[ $videoid ] ) ) {
				$placeholders[] = '(%s,%s,%s)';
				array_push( $values, $videoid, Urlslab_Youtube_Row::STATUS_NEW, $now );
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
			$this->append_meta_attribute( $document, $schema, 'name', $youtube_obj->get_title() );
			$this->append_meta_attribute( $document, $schema, 'description', $youtube_obj->get_description() );
			$this->append_meta_attribute( $document, $schema, 'thumbnailUrl', $youtube_obj->get_thumbnail_url(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'contentUrl', 'https://www.youtube.com/watch?v=' . $youtube_obj->get_video_id(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'embedUrl', 'https://www.youtube.com/embed/' . $youtube_obj->get_video_id(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'duration', $youtube_obj->get_duration() );
			$this->append_meta_attribute( $document, $schema, 'uploadDate', $youtube_obj->get_published_at() );
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

		if ( ! $dom_element->hasAttribute( 'loading' ) ) {
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

	private function emhance_elementor_element_with_placeholder( DOMDocument $document, DOMElement $element, $video_objects, $ytid ): bool {
		$youtube_loader = $document->createElement( 'div' );
		$youtube_loader->setAttribute( 'class', 'youtube_urlslab_loader youtube_urlslab_loader--elementor' );
		$youtube_loader->setAttribute( 'data-ytid', $ytid );

		$youtube_img = $document->createElement( 'img' );
		$youtube_img->setAttribute( 'class', 'youtube_urlslab_loader--img' );
		$youtube_img->setAttribute( 'data-src', 'https://i.ytimg.com/vi/' . $ytid . '/hqdefault.jpg' );
		if ( isset( $video_objects[ $ytid ] ) && strlen( $video_objects[ $ytid ]->get_title() ) ) {
			$youtube_img->setAttribute( 'alt', 'Youtube video: ' . $video_objects[ $ytid ]->get_title() );
		}
		$youtube_img->setAttribute( 'urlslab-lazy', 'yes' );
		$youtube_loader->appendChild( $youtube_img );

		$xpath = new DOMXPath( $document );
		$child = $xpath->query( "//div[@data-id='" . $element->getAttribute( 'data-id' ) . "']//div[contains(@class, 'elementor-video')]" );
		if ( $child->length ) {
			$child->item( 0 )->appendChild( $youtube_loader );
		}

		$this->lazyload_youtube_css( $document, $youtube_loader );


		return true;
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

		$youtube_img = $document->createElement( 'img' );
		$youtube_img->setAttribute( 'class', 'youtube_urlslab_loader--img' );
		$youtube_img->setAttribute( 'data-src', 'https://i.ytimg.com/vi/' . $ytid . '/hqdefault.jpg' );
		if ( isset( $video_objects[ $ytid ] ) && strlen( $video_objects[ $ytid ]->get_title() ) ) {
			$youtube_img->setAttribute( 'alt', 'Youtube video: ' . $video_objects[ $ytid ]->get_title() );
		}
		$youtube_img->setAttribute( 'urlslab-lazy', 'yes' );

		$youtube_loader->appendChild( $youtube_img );
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


	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_IMG_LAZY_LOADING,
			false,
			true,
			__( 'Image Lazy Loading' ),
			__( 'Enable/Disable lazy loading for Images in your pages' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMG_LAZY_LOADING_WITH_PLACEHOLDER,
			false,
			true,
			__( 'Generate empty image as placeholder' ),
			__( 'Before the image is loaded into browser, we generate into src tag empty svg image as placeholder for original image to restrict jumping of content. Use this as EXPERIMENTAL feature. Some browsers incorrectly render images like our placeholder sometimes.' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_VIDEO_LAZY_LOADING,
			false,
			true,
			__( 'Video Lazy Loading' ),
			__( 'Enable/Disable lazy loading for Videos in your pages' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_WP_LAZY_LOADING,
			true,
			true,
			__( 'Disable WordPress lazy loading' ),
			__( "Remove attribute loading='lazy' added by default to all images by Wordpress and control lazy loading by Urlslab plugin only. Sometimes you need to load images faster and this is the way how to do it. To disable this feature on specific elements, add class urlslab-skip-nolazy" )
		);

		$this->add_options_form_section( 'youtube', __( 'Youtube' ), __( 'Lazyload content (e.g. preview image, title, description, etc.) from youtube and load slow youtube iframes just in case user clicks the video image. Urlslab plugin will store information laoded from youtube to local cache.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_YOUTUBE_LAZY_LOADING,
			false,
			true,
			__( 'Youtube Lazy Loading' ),
			__( 'Enable/Disable lazy loading for Youtube Videos in your pages' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'youtube'
		);
		$this->add_option_definition(
			self::SETTING_NAME_YOUTUBE_API_KEY,
			'',
			false,
			__( 'Youtube API Key' ),
			__( 'Youtube API Key is used to cache video preview images localy and serve them on place of youtube code. Leave empty to load the key from environment variable YOUTUBE_API_KEY.' ),
			self::OPTION_TYPE_PASSWORD,
			false,
			null,
			'youtube'
		);

		$this->add_options_form_section( 'content', __( 'Content' ), __( 'Lazy loading of content is the way how to optimize the size of HTML DOM on the first load of page. Once the visitor starts to scroll, content is loaded from server to the client and displayed.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_LOADING,
			false,
			true,
			__( 'Content Lazy Loading' ),
			__( 'Activate lazy loading of content' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'content'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CONTENT_LAZY_MIN_PAGE_SIZE,
			10000,
			true,
			__( 'Min size of HTML content' ),
			__( 'Lazy loaded will be elements after the page is longer as defined amount of characters. Even there will be elements marked for lazyloading, but the page is small, whole content will be loaded at once.' ),
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
			__( 'Min size of cached content' ),
			__( 'If content of element marked for lazy loading is too small, it has no sence to lazy load it. This parameter helps you to control the minimum size of the cached content.' ),
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
			__( 'CSS class names' ),
			__( 'Comma separated classnames of elements, which can be be lazy loaded in content.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return is_string( $value );
			},
			'content'
		);

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
			return true;    //size of document is smaller as limit for content lazy loading
		}
		$this->content_docs = array();

		$classnames     = explode( ',', $this->get_option( self::SETTING_NAME_CONTENT_LAZY_CLASSES ) );
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

			foreach ( $this->content_docs as $insert_doc ) {
				$insert_doc->insert();
			}
		}
	}

	private function content_lazy_loading_recursive( DOMDocument $document, $iteration, $classes ) {
		if ( $iteration > 100 ) {
			return true;
		}

		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( '//*[not(@urlslab_lazy_small) and (' . $classes . ") and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-lazy')])]" );
		foreach ( $elements as $dom_elem ) {
			$element_html     = $document->saveHTML( $dom_elem );
			$element_html_len = strlen( $element_html );
			if ( $element_html_len > $this->get_option( self::SETTING_NAME_CONTENT_LAZY_MIN_CACHE_SIZE ) ) {
				$lazy_element = $document->createElement( 'div' );
				$obj          = new Urlslab_Content_Cache_Row(
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
			} else {
				$dom_elem->setAttribute( 'urlslab_lazy_small', $element_html_len );
			}
		}
	}

	public static function output_content() {
		global $_SERVER;
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return 'Path to file not detected.';
		}

		$path = pathinfo( $_SERVER['REQUEST_URI'] );

		if ( ! isset( $path['filename'] ) || false === strpos( $path['filename'], '_' ) ) {
			status_header( 404 );
			exit( 'Not found' );
		}

		list( $hash, $size ) = explode( '_', $path['filename'] );
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
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . $size );
		echo $obj->get_cache_content(); // phpcs:ignore
	}
}
