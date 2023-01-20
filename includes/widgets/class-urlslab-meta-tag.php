<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	const SETTING_NAME_META_DESCRIPTION_GENERATION = 'urlslab_meta_description_generation';
	const DEFAULT_META_DESCRIPTION_GENERATION = false;

	const SETTING_NAME_META_OG_IMAGE_GENERATION = 'urlslab_og_image_generation';
	const DEFAULT_META_OG_IMAGE_GENERATION = false;
	const SETTING_NAME_META_OG_TITLE_GENERATION = 'urlslab_og_title_generation';
	const DEFAULT_META_OG_TITLE_GENERATION = false;
	const SETTING_NAME_META_OG_DESC_GENERATION = 'urlslab_og_desc_generation';
	const DEFAULT_META_OG_DESC_GENERATION = false;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->widget_slug        = 'urlslab-meta-tag';
		$this->widget_title       = 'Meta Tag';
		$this->widget_description = 'Generate meta tags automatically if there is no meta tag for your pages based on the content. generate og meta tags automatically from the data from URLSLAB';
		$this->landing_page_link  = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-header-seo' );
		$this->url_data_fetcher   = $url_data_fetcher;
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_head_content', $this, 'theContentHook' );
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

	public function theContentHook( DOMDocument $document ) {
		try {
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if ( empty( $head_tag ) || ! is_object( $head_tag ) ) {
				return;
			}

			$xpath               = new DOMXPath( $document );
			$meta_description    = $xpath->query( "//meta[@name='description']" );
			$meta_og_title       = $xpath->query( "//meta[@property='og:title']" );
			$meta_og_image       = $xpath->query( "//meta[@property='og:image']" );
			$meta_og_description = $xpath->query( "//meta[@property='og:description']" );

			$url_data = null;
			if (
				$meta_description->count() == 0 ||
				$meta_og_title->count() == 0 ||
				$meta_og_image->count() == 0 ||
				$meta_og_description->count() == 0
			) {
				$url_data = $this->url_data_fetcher->fetch_schedule_url(
					$this->get_current_page_url()
				);

				if ( is_object( $url_data ) ) {
					$strategy = get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
					if ( in_array( 'meta-description', $this->activated_sub_widgets ) ) {
						// meta description generation
						if ( $meta_description->count() == 0 ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'name', 'description' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
							$head_tag->appendChild( $node );
						} else {
							foreach ( $meta_description as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
								}
							}
						}
						// meta description generation
					}

					// meta og title generation
					if ( in_array( 'meta-og-title', $this->activated_sub_widgets ) ) {
						if ( $meta_og_title->count() == 0 ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'property', 'og:title' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
							$head_tag->appendChild( $node );
						} else {
							foreach ( $meta_og_title as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
								}
							}
						}
					}
					// meta og title generation

					// meta og description generation
					if ( in_array( 'meta-og-desc', $this->activated_sub_widgets ) ) {
						if ( $meta_og_description->count() == 0 ) {
							$node = $document->createElement( 'meta' );
							$node->setAttribute( 'property', 'og:description' );
							$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
							$head_tag->appendChild( $node );
						} else {
							foreach ( $meta_og_description as $node ) {
								if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
									$node->setAttribute( 'content', $url_data->get_url_summary_text( $strategy ) );
								}
							}
						}
					}
					// meta og description generation

					// meta og image generation
					if ( in_array( 'meta-og-image', $this->activated_sub_widgets ) ) {
						if (
							$meta_og_image->count() == 0 &&
							$url_data->screenshot_exists()
						) {
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
					return;
				}
			}

			return;

		} catch ( Exception $e ) {
			return;
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
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

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'meta-tags';
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_META_DESCRIPTION_GENERATION,
			self::DEFAULT_META_DESCRIPTION_GENERATION,
			true,
			__( 'Generate Page Meta Description if missing' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::DEFAULT_META_OG_TITLE_GENERATION,
			true,
			__( 'Generate header OG Title if missing' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_DESC_GENERATION,
			self::DEFAULT_META_OG_DESC_GENERATION,
			true,
			__( 'Generate header OG Description if missing' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_IMAGE_GENERATION,
			self::DEFAULT_META_OG_IMAGE_GENERATION,
			true,
			__( 'Generate header OG Image if missing' ),
			__( 'As OG Image will be generated screenshot of requested page - it can take few days to generate screenshot.' )
		);

	}
}
