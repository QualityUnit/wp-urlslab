<?php

// phpcs:disable WordPress

class Urlslab_Image_Alt_Text extends Urlslab_Widget {
	public const SLUG = 'urlslab-image-alt-attribute';
	public const SOURCE_H = 'H';
	public const SETTING_NAME_ALT_TAG_SOURCE = 'urlslab_img_alt_tag_src';
	public const SOURCE_FIGCAPTION = 'C';
	public const SOURCE_LINK = 'L';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 13 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Image_Alt_Text::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Image SEO' );
	}

	public function get_widget_description(): string {
		return __( 'Automatically improve image SEO by instantly applying descriptive alt texts to website images' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_admin() || is_404() || empty( $this->get_option( self::SETTING_NAME_ALT_TAG_SOURCE ) ) ) {
			return;
		}

		try {
			$xpath      = new DOMXPath( $document );
			$table_data = $xpath->query( "//img[(not(@alt) or @alt='') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-img-alt')]) and not(ancestor::*[@id='wpadminbar'])]|//*[substring-after(name(), 'h') > 0]" );
			$last_title = get_the_title();

			if ( ! empty( $table_data ) ) {
				foreach ( $table_data as $element ) {
					if ( preg_match( '/^[hH][0-6].*$/', $element->nodeName ) ) {
						$last_title = $element->nodeValue;
					} else {
						if ( 'img' == $element->nodeName && ! $this->is_skip_elemenet( $element, 'img-alt' ) ) {
							if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && 'a' == $element->parentNode->nodeName && $element->parentNode->hasAttribute( 'figure' ) && $this->get_option( self::SOURCE_FIGCAPTION ) ) {
								foreach ( $element->parentNode->childNodes as $child ) {
									if ( 'figcaption' == $child->nodeName ) {
										$element->setAttribute( 'alt', $child->nodeValue );

										break;
									}
								}
							}

							if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && 'a' == $element->parentNode->nodeName && $element->parentNode->hasAttribute( 'title' ) && $this->get_option( self::SOURCE_LINK ) ) {
								$element->setAttribute( 'alt', trim( $last_title . ' - ' . $element->parentNode->getAttribute( 'title' ), ' -' ) );
							}

							if ( empty( $element->getAttribute( 'alt' ) ) && strlen( $last_title ) && $this->get_option( self::SOURCE_H ) ) {
								$element->setAttribute( 'alt', $last_title );
							}
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

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'general', __( 'Alt Text Attribute Configuration' ), __( 'Alt text is essential for accessibility, offering a text substitute for individuals with visual impairments. It also assists search engines in comprehending the image\'s content, promoting appropriate indexing and keyword association.' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_ALT_TAG_SOURCE,
			array( self::SOURCE_FIGCAPTION, self::SOURCE_LINK, self::SOURCE_H ),
			true,
			__( 'Alt Text Source' ),
			__( 'Select the Alt attribute text source providing a fallback function. The system will automatically switch to a fallback choice if the selected source is unavailable.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			array(
				self::SOURCE_FIGCAPTION => __( 'Image Caption' ),
				self::SOURCE_LINK       => __( 'Link Title if the image is in a link' ),
				self::SOURCE_H          => __( 'The nearest heading tag prior to the image' ),
			),
			null,
			'general'
		);
	}
}
