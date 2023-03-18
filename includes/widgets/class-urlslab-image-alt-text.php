<?php

// phpcs:disable WordPress

class Urlslab_Image_Alt_Text extends Urlslab_Widget {
	const SLUG = 'urlslab-image-alt-attribute';
	const SOURCE_H = 'H';
	const SETTING_NAME_ALT_TAG_SOURCE = 'urlslab_img_alt_tag_src';
	const SOURCE_FIGCAPTION = 'C';
	const SOURCE_LINK = 'L';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'theContentHook', 13 );
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Image_Alt_Text::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Image SEO' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Enhance image SEO on the website by automatically adding alt texts to image tags' );
	}

	public function theContentHook( DOMDocument $document ) {
		if ( empty( $this->get_option( self::SETTING_NAME_ALT_TAG_SOURCE ) ) ) {
			return;
		}
		try {
			$xpath      = new DOMXPath( $document );
			$table_data = $xpath->query( "//img[(not(@alt) or @alt='') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-img-alt')])]|//*[substring-after(name(), 'h') > 0]" );
			$last_title = get_the_title();

			if ( ! empty( $table_data ) ) {
				foreach ( $table_data as $element ) {
					if ( preg_match( '/^[hH][0-6].*$/', $element->nodeName ) ) {
						$last_title = $element->nodeValue;
					} else if ( 'img' == $element->nodeName && ! $this->is_skip_elemenet( $element, 'img-alt' ) ) {

						if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && $element->parentNode->nodeName == 'a' && $element->parentNode->hasAttribute( 'figure' ) && $this->get_option( self::SOURCE_FIGCAPTION ) ) {
							foreach ( $element->parentNode->childNodes as $child ) {
								if ( $child->nodeName == 'figcaption' ) {
									$element->setAttribute( 'alt', $child->nodeValue );
									break;
								}
							}
						}

						if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && $element->parentNode->nodeName == 'a' && $element->parentNode->hasAttribute( 'title' ) && $this->get_option( self::SOURCE_LINK ) ) {
							$element->setAttribute( 'alt', trim( $last_title . ' - ' . $element->parentNode->getAttribute( 'title' ), ' -' ) );
						}

						if ( empty( $element->getAttribute( 'alt' ) ) && strlen( $last_title ) && $this->get_option( self::SOURCE_H ) ) {
							$element->setAttribute( 'alt', $last_title );
						}
					}
				}
			} else {
				return;
			}

			return;
		} catch ( Exception $e ) {
			return;
		}
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'general', __( 'Image ALT text' ), __( 'The Alt attribute or Alt text is used to provide a text alternative for those with reduced functionality as well as for those users who may have vision impairment. All images must have the Alt attribute filled in to reach AA compliance for accessibility.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_ALT_TAG_SOURCE,
			array( self::SOURCE_FIGCAPTION, self::SOURCE_LINK, self::SOURCE_H ),
			true,
			__( 'Alt text source' ),
			__( 'Select the algorithms we should use to compute the best Alt text for your images' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			array(
				self::SOURCE_FIGCAPTION => __( 'Image Caption' ),
				self::SOURCE_LINK       => __( 'Link title if image in link' ),
				self::SOURCE_H          => __( 'First title tag (H1-H6) before the image' ),
			),
			null,
			'general'
		);
	}

}
