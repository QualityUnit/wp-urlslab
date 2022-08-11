<?php

// phpcs:disable WordPress

class Urlslab_Link_Enhancer extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;


	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
		$this->widget_slug = 'urlslab-link-enhancer';
		$this->widget_title = 'Link Enhancer';
		$this->widget_description = 'Enhance all external and internal links in your pages using link enhancer widget. add title to your link automatically';
		$this->landing_page_link = 'https://www.urlslab.com';
		$this->parent_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
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

					if (empty( $dom_element->getAttribute( 'title' ) ) && ! empty( trim( $dom_element->getAttribute( 'href' ) ) )) {
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
						if (isset( $result[$arr_element[1]->get_url_id()] ) &&
							!empty( $result[$arr_element[1]->get_url_id()] )) {
							$arr_element[0]->setAttribute(
								'title',
								$result[$arr_element[1]->get_url_id()]->get_url_summary_text(),
							);
							$arr_element[0]->setAttribute(
								'urlslab-enhanced',
								'Y',
							);
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
