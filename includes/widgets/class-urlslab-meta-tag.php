<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {
	const SLUG = 'urlslab-meta-tag';
	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	const SETTING_NAME_META_DESCRIPTION_GENERATION = 'urlslab_meta_description_generation';

	const SETTING_NAME_META_OG_IMAGE_GENERATION = 'urlslab_og_image_generation';
	const DEFAULT_META_OG_IMAGE_GENERATION = false;
	const SETTING_NAME_META_OG_TITLE_GENERATION = 'urlslab_og_title_generation';

	const SETTING_NAME_META_OG_DESC_GENERATION = 'urlslab_og_desc_generation';


	const ADD_VALUE = 'A';
	const REPLACE_VALUE = 'R';
	const NO_CHANGE_VALUE = '';

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
		return __( 'HTML Meta Tags' );
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

			if ( is_object( $url_data ) && $url_data->is_http_valid() ) {

				$summary = $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
				$title   = $url_data->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_TITLE );

				$xpath = new DOMXPath( $document );
				if ( ! empty( $this->get_option( self::SETTING_NAME_META_DESCRIPTION_GENERATION ) ) && strlen( $summary ) ) {
					$meta_description = $xpath->query( "//meta[@name='description']" );
					if ( $meta_description->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'name', 'description' );
						$node->setAttribute( 'content', $summary );
						$head_tag->appendChild( $node );
					} else {
						if ( self::REPLACE_VALUE == $this->get_option( self::SETTING_NAME_META_DESCRIPTION_GENERATION ) ) {
							foreach ( $meta_description as $node ) {
								$node->setAttribute( 'content', $summary );
							}
						}
					}
				}

				if ( ! empty( $this->get_option( self::SETTING_NAME_META_OG_TITLE_GENERATION ) ) && strlen( $title ) ) {
					$meta_og_title = $xpath->query( "//meta[@property='og:title']" );
					if ( $meta_og_title->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:title' );
						$node->setAttribute( 'content', $title );
						$head_tag->appendChild( $node );
					} else {
						if ( self::REPLACE_VALUE == $this->get_option( self::SETTING_NAME_META_OG_TITLE_GENERATION ) ) {
							foreach ( $meta_og_title as $node ) {
								$node->setAttribute( 'content', $title );
							}
						}
					}
				}

				if ( ! empty( $this->get_option( self::SETTING_NAME_META_OG_DESC_GENERATION ) ) && strlen( $summary ) ) {
					$meta_og_description = $xpath->query( "//meta[@property='og:description']" );
					if ( $meta_og_description->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:description' );
						$node->setAttribute( 'content', $summary );
						$head_tag->appendChild( $node );
					} else {
						if ( self::REPLACE_VALUE == $this->get_option( self::SETTING_NAME_META_OG_DESC_GENERATION ) ) {
							foreach ( $meta_og_description as $node ) {
								$node->setAttribute( 'content', $summary );
							}
						}
					}
				}

				if ( ! empty( $this->get_option( self::SETTING_NAME_META_OG_IMAGE_GENERATION ) ) && ! empty( $url_data->get_screenshot_url() ) ) {
					$meta_og_image = $xpath->query( "//meta[@property='og:image']" );
					if ( $meta_og_image->count() == 0 ) {
						$node = $document->createElement( 'meta' );
						$node->setAttribute( 'property', 'og:image' );
						$node->setAttribute( 'content', $url_data->get_screenshot_url() );
						$head_tag->appendChild( $node );
					} else {
						if ( self::REPLACE_VALUE == $this->get_option( self::SETTING_NAME_META_OG_IMAGE_GENERATION ) ) {
							foreach ( $meta_og_image as $node ) {
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
			self::ADD_VALUE,
			true,
			__( 'Meta Description tag' ),
			__( 'Add or replace meta description tag with values stored in the Urlslab plugin' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;
					default:
						return false;
				}
			}
		);

		$this->add_options_form_section( 'og', __( 'Open Graph Meta Tags' ), __( 'Make your content more sharable on social networks. Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They are part of Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). You can find them in the <head> section of a webpage. Any tags with og: before a property name are Open Graph tags. Urlslab plugin can generate them for you.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'OG Title' ),
			__( 'Add or replace OG Title tag with values stored in the Urlslab plugin' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;
					default:
						return false;
				}
			},
			'og'
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_DESC_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'OG Description' ),
			__( 'Add or replace OG Description tag with values stored in the Urlslab plugin' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;
					default:
						return false;
				}
			},
			'og'
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_IMAGE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'OG Image' ),
			__( 'As OG Image will be generated screenshot of requested page - it can take few days to generate screenshot.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;
					default:
						return false;
				}
			},
			'og'
		);
	}
}
