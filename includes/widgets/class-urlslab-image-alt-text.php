<?php

// phpcs:disable WordPress

class Urlslab_Image_Alt_Text extends Urlslab_Widget {
	const SLUG = 'urlslab-image-alt-attribute';

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
		return __( 'Image Description' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Urlslab Image Alt Attributes - automatic enhancing of image alt atribute with name of heading, where is image included' );
	}

	public function theContentHook( DOMDocument $document ) {
		try {
			$xpath      = new DOMXPath( $document );
			$table_data = $xpath->query( "//img[(not(@alt) or @alt='') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-img-alt')])]|//*[substring-after(name(), 'h') > 0 and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-img-alt')])]" );
			$title      = get_the_title();

			if ( ! empty( $table_data ) ) {
				foreach ( $table_data as $element ) {
					if ( preg_match( '/^[hH][0-9].*$/', $element->nodeName ) ) {
						$title = $element->nodeValue;
					} else if ( 'img' == $element->nodeName && ! $this->is_skip_elemenet( $element, 'img-alt' ) ) {
						if ( isset( $element->parentNode ) && $element->parentNode->nodeName == 'a' && $element->parentNode->hasAttribute( 'title' ) ) {
							$element->setAttribute( 'alt', $title . ' - ' . $element->parentNode->getAttribute( 'title' ) );
						} else if ( strlen( $title ) ) {
							$element->setAttribute( 'alt', $title );
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

}
