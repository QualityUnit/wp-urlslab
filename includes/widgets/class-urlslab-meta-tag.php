<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-meta-tag';

	private string $widget_title = 'Meta Tag';

	private string $widget_description = 'Generate meta tags automatically if there is no meta tag for your pages based on the content. generate og meta tags automatically from the data from URLSLAB';

	private string $landing_page_link = 'https://www.urlslab.com';

	private array $activated_sub_widgets;

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher) {
		$this->url_data_fetcher = $url_data_fetcher;
		$this->activated_sub_widgets = Urlslab::get_option( 'header-seo', array() );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'wp_head', $this, 'hook_callback_widget_start', -10000 );
		$loader->add_action( 'wp_head', $this, 'hook_callback_widget_end', 100000 );
	}

	public function hook_callback_widget_start() {
		ob_start();
	}

	public function hook_callback_widget_end() {
		$content = ob_get_contents();
		ob_end_clean();
		$og_meta_tag = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-meta-tag' );
		echo $og_meta_tag->theContentHook( $content ); // phpcs:ignore
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

	public function load_widget_page() {
		//Nothing to show
	}

	public function widget_admin_load() {
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
		return 'Urlslab Widget | Meta Tag';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Meta tag';
	}

	public function theContentHook( $content) {
		if (!strlen( trim( $content ) )) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ) );
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if (empty( $head_tag ) || !is_object( $head_tag )) {
				return $content;
			}

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

				if (is_object( $url_data )) {
					if (in_array( 'meta-description', $this->activated_sub_widgets )) {
						// meta description generation
						if ($meta_description->count() == 0) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'name', 'description' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							$head_tag->appendChild( $node );
						} else {
							foreach ($meta_description as $node) {
								if (strlen( trim( $node->getAttribute( 'content' ) ) ) < 3) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text() );
								}
							}
						}
						// meta description generation
					}

					// meta og title generation
					if (in_array( 'meta-og-title', $this->activated_sub_widgets )) {
						if ( $meta_og_title->count() == 0 ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'property', 'og:title' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							$head_tag->appendChild( $node );
						} else {
							foreach ( $meta_og_title as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text() );
								}
							}
						}
					}
					// meta og title generation

					// meta og description generation
					if (in_array( 'meta-og-desc', $this->activated_sub_widgets )) {
						if ( $meta_og_description->count() == 0 ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'property', 'og:description' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text() );
							$head_tag->appendChild( $node );
						} else {
							foreach ( $meta_og_description as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text() );
								}
							}
						}
					}
					// meta og description generation

					// meta og image generation
					if (in_array( 'meta-og-image', $this->activated_sub_widgets )) {
						if ( $meta_og_image->count() == 0 &&
							 $url_data->screenshot_exists() ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'property', 'og:image' );
							$node->setAttribute( 'content', $url_data->render_screenshot_path() );
							//$document->appendChild( $node );
						} else {
							foreach ( $meta_og_image as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->render_screenshot_path() );
								}
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

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/meta-tag-demo.png' ) . 'meta-tag-demo.png';
	}
}
