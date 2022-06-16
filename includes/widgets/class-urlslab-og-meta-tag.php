<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Og_Meta_Tag extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-og-meta-tag';

	private string $widget_title = 'OG Meta Tag';

	private string $widget_description = 'Urlslab OG Meta tag - Generate screenshot of current page and display as og meta tag';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher) {
		$this->url_data_fetcher = $url_data_fetcher;
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

	public function load_widget_page() {
		//Nothing to show
	}

	public function screen_option() {
		//Nothing to show
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
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | og Meta Tag';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Og Meta tag';
	}

	public function theContentHook( $content) {
		if (!strlen( trim( $content ) )) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$xpath = new DOMXPath( $document );
			$meta_description = $xpath->query( "//meta[@name='description']" );
			$meta_og_title = $xpath->query( "//meta[@property='og:title']" );
			$meta_og_image = $xpath->query( "//meta[@property='og:image']" );
			$meta_og_description = $xpath->query( "//meta[@property='og:description']" );

			$url_data = null;
			if ($meta_description->count() == 0 ||
				$meta_og_title->count() == 0 ||
				$meta_og_image->count() == 0 ||
				$meta_og_description->count() == 0) {
				$url_data = $this->url_data_fetcher->fetch_schedule_url(
					get_current_page_url()
				);

				if (!is_null( $url_data )) {
					// meta description generation
					if ($meta_description->count() == 0) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'name', 'description' );
						$node->setAttribute( 'content', $url_data->get_url_summary_text() );
						$document->appendChild( $node );
					} else {
						foreach ($meta_description as $node) {
							if (strlen( trim( $node->getAttribute( 'content' ) ) ) < 3) {
								$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							}
						}
					}


					// meta description generation

					// meta og title generation
					if ($meta_og_title->count() == 0) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:title' );
						$node->setAttribute( 'content', $url_data->get_url_summary_text() );
						$document->appendChild( $node );
					} else {
						foreach ($meta_og_title as $node) {
							if (strlen( trim( $node->getAttribute( 'content' ) ) ) < 3) {
								$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							}
						}
					}
					// meta og title generation

					// meta og description generation
					if ($meta_og_description->count() == 0) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:description' );
						$node->setAttribute( 'content', $url_data->get_url_summary_text() );
						$document->appendChild( $node );
					} else {
						foreach ($meta_og_description as $node) {
							if (strlen( trim( $node->getAttribute( 'content' ) ) ) < 3) {
								$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							}
						}
					}
					// meta og description generation

					// meta og image generation
					if ($meta_og_image->count() == 0 &&
						$url_data->screenshot_exists()) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:image' );
						$node->setAttribute( 'content', $url_data->render_screenshot_path() );
						$document->appendChild( $node );
					} else {
						foreach ($meta_og_image as $node) {
							if (strlen( trim( $node->getAttribute( 'content' ) ) ) < 3) {
								$node->setAttribute( 'content', $url_data->render_screenshot_path() );
							}
						}
					}
					// meta og image generation

					return $document->saveHTML();
				}
			}

			return $content;

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
}
