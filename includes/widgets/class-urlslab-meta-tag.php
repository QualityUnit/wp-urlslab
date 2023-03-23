<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {
	const SLUG = 'urlslab-meta-tag';

	const SETTING_NAME_META_DESCRIPTION_GENERATION = 'urlslab_meta_description_generation';

	const SETTING_NAME_META_OG_IMAGE_GENERATION = 'urlslab_og_image_generation';
	const DEFAULT_META_OG_IMAGE_GENERATION = false;
	const SETTING_NAME_META_OG_TITLE_GENERATION = 'urlslab_og_title_generation';

	const SETTING_NAME_META_OG_DESC_GENERATION = 'urlslab_og_desc_generation';


	const ADD_VALUE = 'A';
	const REPLACE_VALUE = 'R';
	const NO_CHANGE_VALUE = '';


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
		return __( 'Meta Tags Manager' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Make your content go further by adding Meta Tags and maximize its shareability on all social media platforms.' );
	}


	public function theContentHook( DOMDocument $document ) {
		try {
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if ( empty( $head_tag ) || ! is_object( $head_tag ) ) {
				return;
			}


			try {
				$url_data = Urlslab_Url_Data_Fetcher::get_instance()->fetch_schedule_url( $this->get_current_page_url() );
			} catch ( Exception $e ) {
				return;
			}

			if ( is_object( $url_data ) && $url_data->is_http_valid() ) {

				$summary = $url_data->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
				$title   = $url_data->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_TITLE );


				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'description', self::SETTING_NAME_META_DESCRIPTION_GENERATION, $summary );

				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:title', self::SETTING_NAME_META_OG_TITLE_GENERATION, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:description', self::SETTING_NAME_META_OG_DESC_GENERATION, $summary );
				if ( $this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, $url_data->get_screenshot_url() ) ) {
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
			$xpath     = new DOMXPath( $document );
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


	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Meta Tags Settings' ), __( 'The module can generate an enhanced page summary as a description that is more detailed and descriptive than a typical page description. This can help search engines better understand what your page is about, making it easier for users to find you in search results.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_DESCRIPTION_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Meta Description' ),
			__( 'Add or replace the current or missing meta description by summarizing the page\'s content or edited version from the manager.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
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
			'main'
		);

		$this->add_options_form_section( 'og', __( 'Open Graph Meta Tags Settings' ), __( 'Open Graph meta tags are essential for improving your content\'s reach and shareability on social media. They will help you stand out on social media with rich previews of your content that are engaging and click-worthy.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Open Graph Title' ),
			__( 'Add or replace the current or missing Open Graph title by edited version from the manager.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
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
			__( 'Open Graph Description' ),
			__( 'Add or replace the current or missing Open Graph description by summarizing the page\'s content or edited version from the manager' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
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
			__( 'Open Graph Image' ),
			__( 'Add or replace the current or missing Open Graph image by screenshot done with URLsLab service (it can take hours or days to generate all of the screenshots).' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
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
