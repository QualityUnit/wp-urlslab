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


				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'description', self::SETTING_NAME_META_DESCRIPTION_GENERATION, $summary );

				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:title', self::SETTING_NAME_META_OG_TITLE_GENERATION, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:description', self::SETTING_NAME_META_OG_DESC_GENERATION, $summary );
				if ($this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, $url_data->get_screenshot_url() )) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:width', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 1366 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:height', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 768 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:type', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 'image/jpeg' );
				}

			}
		} catch ( Exception $e ) {
		}
	}

	private function set_meta_tag( $document, $head_tag, $tag, $attribute_name, $attribute_value, $setting_name, $content_value ): bool {
		if ( ! empty( $this->get_option( $setting_name ) ) && ! empty( $content_value ) ) {
			$xpath    = new DOMXPath( $document );
			$meta_tags = $xpath->query( '//' . $tag . '[@' . $attribute_name . "='$attribute_value']" );
			if ( $meta_tags->count() == 0 ) {
				$node = $document->createElement( $tag );
				$node->setAttribute( $attribute_name, $attribute_value );
				$node->setAttribute( 'content', $content_value );
				$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );
				$head_tag->appendChild( $node );

				return true;
			} else {
				if ( self::REPLACE_VALUE == $this->get_option( $setting_name ) ) {
					foreach ( $meta_tags as $node ) {
						$node->setAttribute( 'content', $content_value );
						$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );

						return true;
					}
				}
			}
		}

		return false;
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
