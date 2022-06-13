<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Image_Alt_Text extends Urlslab_Widget {
	private string $widget_slug = 'urlslab-image-alt-attribute';

	private string $widget_title = 'Image Alt Attributes';

	private string $widget_description = 'Urlslab Image Alt Attributes - automatic enhancing of image alt atribute with name of heading, where is image included';

	private string $landing_page_link = 'https://www.urlslab.com';

	const MAX_URLS_TO_ENHANCE = 100;


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

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_url(): string {
		//TODO - implement for the admin page of plugin
		return $this->menu_page_url( URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php' );
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Image Alt Attributes';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Image Alt Attributes';
	}

	public function theContentHook( $content ) {
		if ( ! strlen( trim( $content ) ) ) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$xpath                            = new DOMXPath( $document );
			$table_data                       = $xpath->query( "//img[not(@alt) or @alt='']|//*[starts-with(name(),'h')]" );
			$title = '';

			if ( ! empty( $table_data ) ) {
				foreach ( $table_data as $element ) {
					if ( substr( $element->nodeName, 0, 1 ) == 'h' ) {
						$title = $element->nodeValue;
					} elseif ( 'img' == $element->nodeName ) {
						if ( isset( $element->parentNode ) && $element->parentNode->nodeName == 'a' && $element->parentNode->hasAttribute( 'title' ) ) {
							$element->setAttribute( 'alt', $title . ' - ' . $element->parentNode->getAttribute( 'title' ) );
						} elseif ( strlen( $title ) ) {
							$element->setAttribute( 'alt', $title );
						}
					}
				}
			} else {
				return $content;
			}
			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . esc_html( $e->getMessage() ) . "\n--->";
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}
}
