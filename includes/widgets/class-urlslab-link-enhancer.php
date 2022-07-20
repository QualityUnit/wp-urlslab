<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Link_Enhancer extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-link-enhancer';

	private string $widget_title = 'Link Enhancer';

	private string $widget_description = 'Enhance all external and internal links in your pages using link enhancer widget. add title to your link automatically';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;


	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
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

	public function load_widget_page() {
		//Nothing to show
	}

	public function widget_admin_load() {
		//Nothing to show
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Link Enhancer';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Link Enhancer';
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
}
