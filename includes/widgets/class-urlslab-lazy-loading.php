<?php

// phpcs:disable WordPress.NamingConventions
class Urlslab_Lazy_Loading extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;

	//Lazy Loading settings
	public const SETTING_NAME_IMG_LAZY_LOADING = 'urlslab_img_lazy';
	public const SETTING_NAME_VIDEO_LAZY_LOADING = 'urlslab_video_lazy';
	public const SETTING_NAME_YOUTUBE_LAZY_LOADING = 'urlslab_youtube_lazy';
	public const SETTING_NAME_YOUTUBE_API_KEY = 'urlslab_youtube_apikey';

	public function __construct() {
		$this->widget_slug = 'urlslab-lazy-loading';
		$this->widget_title = 'Lazy Loading';
		$this->widget_description = 'Urlslab Lazy Loading';
		$this->landing_page_link = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-media' );
	}

	public static function add_option() {
		add_option( self::SETTING_NAME_IMG_LAZY_LOADING, false, '', true );
		add_option( self::SETTING_NAME_VIDEO_LAZY_LOADING, false, '', true );
		add_option( self::SETTING_NAME_YOUTUBE_LAZY_LOADING, false, '', true );
		add_option( self::SETTING_NAME_YOUTUBE_API_KEY, '', '', true );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_content', $this, 'the_content', 13 );
	}

	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	public function get_widget_title(): string {
		return $this->widget_title . ' Widget';
	}

	public function get_widget_description(): string {
		return $this->widget_description;
	}

	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'lazy-loading';
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function render_widget_overview() {}

	public function get_thumbnail_demo_url(): string {
		return '';
	}

	public static function update_settings( array $new_settings ) {
		if ( isset( $new_settings[ self::SETTING_NAME_IMG_LAZY_LOADING ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_IMG_LAZY_LOADING ] ) ) {
			update_option(
				self::SETTING_NAME_IMG_LAZY_LOADING,
				$new_settings[ self::SETTING_NAME_IMG_LAZY_LOADING ]
			);
		} else {
			update_option(
				self::SETTING_NAME_IMG_LAZY_LOADING,
				false
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_VIDEO_LAZY_LOADING ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_VIDEO_LAZY_LOADING ] ) ) {
			update_option(
				self::SETTING_NAME_VIDEO_LAZY_LOADING,
				$new_settings[ self::SETTING_NAME_VIDEO_LAZY_LOADING ]
			);
		} else {
			update_option(
				self::SETTING_NAME_VIDEO_LAZY_LOADING,
				false
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_YOUTUBE_LAZY_LOADING ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_YOUTUBE_LAZY_LOADING ] ) ) {
			update_option(
				self::SETTING_NAME_YOUTUBE_LAZY_LOADING,
				$new_settings[ self::SETTING_NAME_YOUTUBE_LAZY_LOADING ]
			);
		} else {
			update_option(
				self::SETTING_NAME_YOUTUBE_LAZY_LOADING,
				false
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_YOUTUBE_API_KEY ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_YOUTUBE_API_KEY ] ) ) {
			update_option(
				self::SETTING_NAME_YOUTUBE_API_KEY,
				$new_settings[ self::SETTING_NAME_YOUTUBE_API_KEY ]
			);
		}
	}

	public function the_content( DOMDocument $document ) {
		$this->process_lazy_loading( $document );

	}


	private function process_lazy_loading( DOMDocument $document ) {
		if ( get_option( self::SETTING_NAME_YOUTUBE_LAZY_LOADING, false ) ) {
			$this->add_youtube_lazy_loading( $document );
		}

		if ( get_option( self::SETTING_NAME_IMG_LAZY_LOADING, false ) ) {
			$dom_elements = $document->getElementsByTagName( 'img' );
			foreach ( $dom_elements as $element ) {
				$has_lazy_loading_attr = false;
				foreach ( urlslab_get_supported_media()['img'] as $valid_attr ) {
					if ( $element->hasAttribute( $valid_attr ) ) {
						$has_lazy_loading_attr = true;
						break;
					}
				}

				if ( ! $this->is_skip_elemenet( $element ) && $has_lazy_loading_attr ) {
					$this->add_img_lazy_loading( $element );
				}
			}
			$dom_elements = $document->getElementsByTagName( 'source' );
			foreach ( $dom_elements as $element ) {
				if ( ! $this->is_skip_elemenet( $element ) ) {
					$this->add_source_lazy_loading( $element );
				}
			}
		}
		if ( get_option( self::SETTING_NAME_VIDEO_LAZY_LOADING, false ) ) {
			$dom_elements = $document->getElementsByTagName( 'video' );
			foreach ( $dom_elements as $element ) {
				if ( ! $this->is_skip_elemenet( $element ) ) {
					$this->add_video_lazy_loading( $element );
				}
			}
		}
	}

	private function add_youtube_lazy_loading( DOMDocument $document ) {
		$youtube_ids = array();

		//find all youtube iframes
		$iframe_elements = $document->getElementsByTagName( 'iframe' );
		foreach ( $iframe_elements as $element ) {
			if ( ! $this->is_skip_elemenet( $element ) && $element->hasAttribute( 'src' ) ) {
				$ytid = $this->get_youtube_videoid( $element->getAttribute( 'src' ) );
				if ( $ytid ) {
					$youtube_ids[ $ytid ] = $ytid;
				}
			}
		}

		//find elementor blocks
		$xpath         = new DOMXPath( $document );
		$elementor_divs = $xpath->query( "//div[contains(@class, 'elementor-widget-video')]" );
		foreach ( $elementor_divs as $element ) {
			if ( ! $this->is_skip_elemenet( $element ) && $element->hasAttribute( 'data-settings' ) ) {
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
		$xpath         = new DOMXPath( $document );
		$yt_elements = $xpath->query( '//*[@data-ytid]' );
		foreach ( $yt_elements as $yt_element ) {
			if ( ! $this->is_skip_elemenet( $yt_element ) ) {
				$ytid = $yt_element->getAttribute( 'data-ytid' );
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
		$xpath         = new DOMXPath( $document );
		$yt_elements = $xpath->query( '//*[@data-ytid]' );
		foreach ( $yt_elements as $yt_element ) {
			$ytid = $yt_element->getAttribute( 'data-ytid' );
			if ( isset( $video_objects[ $ytid ] ) && Urlslab_Youtube_Data::YOUTUBE_AVAILABLE === $video_objects[ $ytid ]->get_status() ) {
				$this->append_video_schema( $document, $yt_element, $video_objects[ $ytid ] );
			}
		}

	}

	/**
	 * this is workaround of parsing bug in php DOMDocument which doesn't understand the source as single tag
	 * @param DOMElement $dom_element
	 * @param $tag_name
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

	private function get_youtube_videos( array $youtube_ids ):array {
		if ( empty( $youtube_ids ) ) {
			return array();
		}
		global $wpdb;
		$videos = array();
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' WHERE videoid in (' . trim( str_repeat( '%s,', count( $youtube_ids ) ), ',' ) . ')', // phpcs:ignore
				$youtube_ids
			),
			'ARRAY_A'
		);

		foreach ( $results as $row ) {
			$video_obj = new Urlslab_Youtube_Data( $row );
			$videos[ $video_obj->get_videoid() ] = $video_obj;
		}


		//schedule missing videos
		$placeholders = array();
		$values = array();
		foreach ( $youtube_ids as $videoid ) {
			if ( ! isset( $videos[ $videoid ] ) ) {
				$placeholders[] = '(%s, %s)';
				array_push( $values, $videoid, Urlslab_Youtube_Data::YOUTUBE_NEW );
			}
		}
		if ( ! empty( $placeholders ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_YOUTUBE_CACHE_TABLE . ' (
                   videoid,
                   status) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}

		return $videos;
	}

	private function append_video_schema( DOMDocument $document, DOMElement $youtube_loader, Urlslab_Youtube_Data $youtube_obj ) {
		if ( ! empty( $youtube_obj->get_microdata() ) ) {
			$schema = $document->createElement( 'div' );
			$schema->setAttribute( 'itemscope', null );
			$schema->setAttribute( 'itemtype', 'https://schema.org/VideoObject' );
			$schema->setAttribute( 'itemprop', 'video' );
			$this->append_meta_attribute( $document, $schema, 'name', $youtube_obj->get_title() );
			$this->append_meta_attribute( $document, $schema, 'description', $youtube_obj->get_description() );
			$this->append_meta_attribute( $document, $schema, 'thumbnailUrl', $youtube_obj->get_thumbnail_url(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'contentUrl', 'https://www.youtube.com/watch?v=' . $youtube_obj->get_videoid(), 'link' );
			$this->append_meta_attribute( $document, $schema, 'embedUrl', 'https://www.youtube.com/embed/' . $youtube_obj->get_videoid(), 'link' );
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
		if ( $dom_element->hasAttribute( 'src' ) ) {
			$dom_element->setAttribute( 'data-src', $dom_element->getAttribute( 'src' ) );
			$dom_element->removeAttribute( 'src' );
		}

		if ( $dom_element->hasAttribute( 'srcset' ) ) {
			$dom_element->setAttribute( 'data-srcset', $dom_element->getAttribute( 'srcset' ) );
			$dom_element->removeAttribute( 'srcset' );
		}

		if ( $dom_element->hasAttribute( 'data-splide-lazy' ) ) {
			$dom_element->setAttribute( 'data-src', $dom_element->getAttribute( 'data-splide-lazy' ) );
			$dom_element->removeAttribute( 'src' );
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

	private function emhance_elementor_element_with_placeholder( DOMDocument $document, DOMElement $element, $video_objects, $ytid ):bool {
		$youtube_loader = $document->createElement( 'div' );
		$youtube_loader->setAttribute( 'class', 'youtube_urlslab_loader youtube_urlslab_loader--elementor' );
		$youtube_loader->setAttribute( 'data-ytid', $ytid );

		$youtube_img = $document->createElement( 'img' );
		$youtube_img->setAttribute( 'class', 'youtube_urlslab_loader--img' );
		$youtube_img->setAttribute( 'data-src', 'https://i.ytimg.com/vi/' . $ytid . '/hqdefault.jpg' );
		$youtube_img->setAttribute( 'style', 'opacity: 0; transition: opacity .5s;' );
		if ( isset( $video_objects[ $ytid ] ) ) {
			$youtube_img->setAttribute( 'alt', 'Youtube video: ' . $video_objects[ $ytid ]->get_title() );
		}
		$youtube_img->setAttribute( 'urlslab-lazy', 'yes' );
		$youtube_loader->appendChild( $youtube_img );

		$xpath         = new DOMXPath( $document );
		$child    = $xpath->query( "//div[@data-id='" . $element->getAttribute( 'data-id' ) . "']//div[contains(@class, 'elementor-video')]" );
		if ( $child->length ) {
			$child->item( 0 )->appendChild( $youtube_loader );
		}

		return true;
	}

	private function replace_youtube_element_with_placeholder( DOMDocument $document, DOMElement $element, $video_objects, $ytid ):bool {
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
		$youtube_img->setAttribute( 'style', 'opacity: 0; transition: opacity .5s;' );
		if ( isset( $video_objects[ $ytid ] ) ) {
			$youtube_img->setAttribute( 'alt', 'Youtube video: ' . $video_objects[ $ytid ]->get_title() );
		}
		$youtube_img->setAttribute( 'urlslab-lazy', 'yes' );
		$youtube_loader->appendChild( $youtube_img );
		$element->parentNode->replaceChild( $youtube_loader, $element );

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


}
