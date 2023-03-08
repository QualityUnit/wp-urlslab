<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {
	const SLUG = 'urlslab-meta-tag';
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
		$this->url_data_fetcher = $url_data_fetcher;
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'theContentHook' );
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Meta_Tag::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Meta Tag' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( '(Sharing) Add missing html header tags automatically to improve sharing on social networks.' );
	}


	public function theContentHook( DOMDocument $document ) {
		try {
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if ( empty( $head_tag ) || ! is_object( $head_tag ) ) {
				return;
			}


			$url_data = $this->url_data_fetcher->fetch_schedule_url( $this->get_current_page_url() );

			if ( is_object( $url_data ) && $url_data->is_active() ) {
				$xpath = new DOMXPath( $document );
				if ( $this->get_option( self::SETTING_NAME_META_DESCRIPTION_GENERATION ) ) {
					$meta_description = $xpath->query( "//meta[@name='description']" );
					// meta description generation
					if ( $meta_description->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'name', 'description' );
						$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) );
						$head_tag->appendChild( $node );
					} else {
						foreach ( $meta_description as $node ) {
							if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
								$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION ) );
							}
						}
					}
					// meta description generation
				}

				// meta og title generation
				if ( $this->get_option( self::SETTING_NAME_META_OG_TITLE_GENERATION ) ) {
					$meta_og_title = $xpath->query( "//meta[@property='og:title']" );
					if ( $meta_og_title->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:title' );
						$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_TITLE ) );
						$head_tag->appendChild( $node );
					} else {
						foreach ( $meta_og_title as $node ) {
							if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
								$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_TITLE ) );
							}
						}
					}
				}
				// meta og title generation

				// meta og description generation
				if ( $this->get_option( self::SETTING_NAME_META_OG_DESC_GENERATION ) && strlen( $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) ) ) {
					$meta_og_description = $xpath->query( "//meta[@property='og:description']" );
					if ( $meta_og_description->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:description' );
						$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) );
						$head_tag->appendChild( $node );
					} else {
						foreach ( $meta_og_description as $node ) {
							if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
								$node->setAttribute( 'content', $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) );
							}
						}
					}
				}
				// meta og description generation

				// meta og image generation
				if ( $this->get_option( self::SETTING_NAME_META_OG_IMAGE_GENERATION ) && ! empty( $url_data->get_screenshot_url() ) ) {
					$meta_og_image = $xpath->query( "//meta[@property='og:image']" );
					if ( $meta_og_image->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:image' );
						$node->setAttribute( 'content', $url_data->get_screenshot_url() );
						//$document->appendChild( $node );
					} else {
						foreach ( $meta_og_image as $node ) {
							if ( strlen( trim( $node->getAttribute( 'content' ) ) ) < 3 ) {
								$node->setAttribute( 'content', $url_data->get_screenshot_url() );
							}
						}
					}
				}
			}
		} catch ( Exception $e ) {
		}
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
