<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	private string $widget_slug = 'urlslab-link-enhancer';

	private string $widget_title = 'Link Enhancer';

	private string $widget_description = 'Urlslab Link Enhancer to add title attribute to all links';

	private string $landing_page_link = 'https://www.urlslab.com';

	const MAX_URLS_TO_ENHANCE = 100;
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;


	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
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

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
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

	public function theContentHook( $content ) {
		if ( ! strlen( trim( $content ) ) ) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$elements = $document->getElementsByTagName( 'a' );

			$elements_to_enhance = array();
			if ( $elements instanceof DOMNodeList ) {
				foreach ( $elements as $dom_element ) {
					//skip processing if A tag contains attribute "urlslab-skip"
					if ( $dom_element->hasAttribute( 'urlslab-skip' ) ) {
						continue;
					}

					if ( ! strlen( $dom_element->getAttribute( 'title' ) ) && strlen( $dom_element->getAttribute( 'href' ) ) ) {
						$url = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
						$elements_to_enhance[] = array( $dom_element, $url );
					}
				}
			}


			if ( ! empty( $elements_to_enhance ) ) {



				$result = $this->urlslab_url_data_fetcher->fetch_schedule_urls_batch(
					array_map( fn( $elem): Urlslab_Url => $elem[1], $elements_to_enhance )
				);

				if ( ! empty( $result ) ) {
					foreach ( $elements_to_enhance as $arr_element ) {
						if ( isset( $result[ $arr_element[1]->get_url_id() ] ) &&
							 !empty( $result[ $arr_element[1]->get_url_id() ] ) ) {
							( $arr_element[0] )->setAttribute(
								'title',
								$result[ $arr_element[1]->get_url_id() ]->get_url_summary_text(),
							);
						}
					}
				}
			}

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . str_replace( '>', ' ', $e->getMessage() ) . "\n--->";
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}
}
