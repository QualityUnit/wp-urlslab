<?php

// phpcs:disable WordPress

class Urlslab_Link_Enhancer extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;

	public const SETTING_NAME_REMOVE_LINKS = 'urlslab_remove_links';
	public const SETTING_DEFAULT_REMOVE_LINKS = true;


	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
		$this->widget_slug = 'urlslab-link-enhancer';
		$this->widget_title = 'Link Enhancer';
		$this->widget_description = 'Enhance all external and internal links in your pages using link enhancer widget. add title to your link automatically';
		$this->landing_page_link = 'https://www.urlslab.com';
		$this->parent_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-content-seo' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_filter( 'the_content', $this, 'hook_callback', 12 );
	}

	public function hook_callback( $content ) {
		return $this->theContentHook( $content );
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
		return $this->widget_title . ' Widget';
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

	public function theContentHook( $content) {
		if (trim( $content ) === '') {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ) );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$elements = $document->getElementsByTagName( 'a' );

			$elements_to_enhance = array();
			if ($elements instanceof DOMNodeList) {
				foreach ($elements as $dom_element) {
					//skip processing if A tag contains attribute "urlslab-skip"
					if ($dom_element->hasAttribute( 'urlslab-skip' )) {
						continue;
					}

					if ( ! empty( trim( $dom_element->getAttribute( 'href' ) ) ) ) {
						$url = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
						$elements_to_enhance[] = array($dom_element, $url);
					}
				}
			}

			if (!empty( $elements_to_enhance )) {

				$result = $this->urlslab_url_data_fetcher->fetch_schedule_urls_batch(
					array_map( fn( $elem): Urlslab_Url => $elem[1], $elements_to_enhance )
				);

				if (!empty( $result )) {
					foreach ($elements_to_enhance as $arr_element) {
						list($dom_elem, $url_obj) = $arr_element;
						if (isset( $result[$url_obj->get_url_id()] ) &&
							!empty( $result[$url_obj->get_url_id()] )) {

							if ( get_option( self::SETTING_NAME_REMOVE_LINKS, self::SETTING_DEFAULT_REMOVE_LINKS ) && ! $result[ $url_obj->get_url_id() ]->is_visible() ) {
								//link should not be visible, remove it from content
								if ( $dom_elem->childNodes->length > 0 ) {
									$fragment = $document->createDocumentFragment();
									while ( $dom_elem->childNodes->length > 0 ) {
										$fragment->appendChild( $dom_elem->childNodes->item( 0 ) );
									}
									$dom_elem->parentNode->replaceChild( $fragment, $dom_elem );
								} else {
									$txt_element = $document->createTextNode( $dom_elem->domValue );
									$dom_elem->parentNode->replaceChild( $txt_element, $dom_elem );
								}
							} else {
								//enhance title if url is visible
								if ( empty( $dom_elem->getAttribute( 'title' ) ) ) {
									$dom_elem->setAttribute(
										'title',
										$result[ $url_obj->get_url_id() ]->get_url_summary_text(),
									);
									$dom_elem->setAttribute(
										'urlslab-enhanced',
										'Y',
									);
								}
							}

						}
					}
				}
			}

			return $document->saveHTML();
		} catch (Exception $e) {
			return $content . "\n" . "<!---\n Error:" . str_replace( '>', ' ', $e->getMessage() ) . "\n--->";
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = ''): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function visibility_active_in_table(): bool {
		return Urlslab_User_Widget::get_instance()->is_widget_activated( $this->widget_slug ) &&
		       get_option(self::SETTING_NAME_REMOVE_LINKS, self::SETTING_DEFAULT_REMOVE_LINKS);
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/link-enhancer-demo.png' ) . 'link-enhancer-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'link-enhancer';
	}

	public function get_widget_settings(): array {
		return array();
	}
}
