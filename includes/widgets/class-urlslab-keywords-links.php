<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Keywords_Links extends Urlslab_Widget {
	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	private int $cnt_page_link_replacements = 0;
	private int $cnt_page_links = 0;
	private int $cnt_paragraph_link_replacements = 0;
	private array $link_counts = array();
	private array $kw_page_replacement_counts = array();

	private array $keywords_cache = array();

	//TODO: use these constants as defaults,
	// real values should be loaded from settings defined by user
	const MAX_REPLACEMENTS_PER_KEYWORD = 1;

	//if page contains more links than this limit, don't try to add next links to page
	const MAX_LINKS_ON_PAGE = 100;
	const MAX_REPLACEMENTS_PER_PAGE = 30;
	const MAX_REPLACEMENTS_PER_PARAGRAPH = 2;

	private Urlslab_Screenshot_Api $urlslab_screenshot_api;


	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 * @param string $landing_page_link
	 * @param Urlslab_Screenshot_Api $urlslab_screenshot_api
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description,
		string $landing_page_link,
		Urlslab_Screenshot_Api $urlslab_screenshot_api
	) {
		$this->widget_slug            = $widget_slug;
		$this->widget_title           = $widget_title;
		$this->widget_description     = $widget_description;
		$this->landing_page_link      = $landing_page_link;
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
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
		return 'Urlslab Widget | Keywords Links';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Keywords Links';
	}

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args           = wp_parse_args( $args, array() );
		$url            = $this->menu_page_url( $main_menu_slug );
		$url            = add_query_arg( array( 'component' => $this->widget_slug ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords ) {
		//TODO: load all limits from widget settings and not from constants, use constants later just like default value of settings
		if ( $this->cnt_page_links > self::MAX_LINKS_ON_PAGE ||
			 $this->cnt_page_link_replacements > self::MAX_REPLACEMENTS_PER_PAGE ||
			 $this->cnt_paragraph_link_replacements > self::MAX_REPLACEMENTS_PER_PARAGRAPH ) {
			return;
		}

		if ( 0 == strlen( trim( $node->nodeValue ) ) ) {
			return; //empty node
		}

		foreach ( $keywords as $kw => $url ) {
			if (preg_match('/\b(' . preg_quote(strtolower( $kw ), '/') . ')\b/', strtolower( $node->nodeValue ), $matches, PREG_OFFSET_CAPTURE)) {
				$pos = $matches[1][1];
				$this->cnt_page_links ++;
				$this->cnt_page_link_replacements ++;
				$this->cnt_paragraph_link_replacements ++;
				if ( isset( $this->kw_page_replacement_counts[ $kw ] ) ) {
					$this->kw_page_replacement_counts[ $kw ] ++;
				} else {
					$this->kw_page_replacement_counts[ $kw ] = 1;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ( $this->kw_page_replacement_counts[ $kw ] > self::MAX_REPLACEMENTS_PER_KEYWORD ) {
					unset( $keywords[ $kw ] );

					return;
				}

				//add text before keyword
				if ( $pos > 0 ) {
					$domTextStart = $document->createTextNode( substr( $node->nodeValue, 0, $pos ) ); // phpcs:ignore
					$node->parentNode->insertBefore( $domTextStart, $node );
				} else {
					$domTextStart = null;
				}

				//add keyword as link
				$linkDom = $document->createElement(
					'a',
					substr( $node->nodeValue, $pos, strlen( $kw ) )
				);
				$linkDom->setAttribute( 'href', $url );

				//if relative url or url from same domain, don't add target attribute
				if ( ! $this->isSameDomainUrl( $url ) ) {
					$linkDom->setAttribute( 'target', '_blank' );
				}

				$node->parentNode->insertBefore( $linkDom, $node );

				//add text after keyword
				if ( $pos + strlen( $kw ) < strlen( $node->nodeValue ) ) {
					$domTextEnd = $document->createTextNode( substr( $node->nodeValue, $pos + strlen( $kw ) ) );
					$node->parentNode->insertBefore( $domTextEnd, $node );
				} else {
					$domTextEnd = null;
				}

				//process other keywords in text
				if ( is_object( $domTextStart ) ) {
					$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords );
				}
				if ( is_object( $domTextEnd ) ) {
					$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords );
				}

				//remove processed node
				$node->parentNode->removeChild( $node );

				return;
			}
			unset( $keywords[ $kw ] );
		}
	}

	private function get_keywords() {
		if (empty($this->keywords_cache)) {
			global $wpdb;

			$keyword_table = $wpdb->prefix . 'urlslab_keyword_widget';

			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT keyword, urlLink
				FROM ' . $keyword_table . // phpcs:ignore
					" WHERE (lang = %s OR lang = 'all') LIMIT 100",
					urlslab_get_language()
				),
				'ARRAY_A'
			);

			$this->keywords_cache = array();
			foreach ($results as $row) {
				$this->keywords_cache[$row['keyword']] = $row['urlLink'];
			}
		}

		$keywords = array();
		foreach ($this->keywords_cache as $kw => $lnk) {
			if (!isset($this->kw_page_replacement_counts[$kw]) || $this->kw_page_replacement_counts[$kw] < self::MAX_REPLACEMENTS_PER_KEYWORD) {
				$keywords[$kw] = $lnk;
			}
		}

		return $keywords;
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document ) {
		//skip processing if HTML tag contains attribute "urlslab-skip"
		if ( $dom->hasAttributes() && $dom->hasAttribute( 'urlslab-skip' ) ) {
			return;
		}

		if ( ! empty( $dom->childNodes ) ) {
			foreach ( $dom->childNodes as $node ) {

				if ( $node instanceof DOMText && strlen( trim( $node->nodeValue ) ) > 1 ) {
					$this->replaceKeywordWithLinks( $node, $document, $this->get_keywords() );
				} else {
					if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
					}

					//skip processing some types of HTML elements
					if ( ! in_array( strtolower( $node->nodeName ), array( 'a', 'button', 'input' ) ) &&
						 ! preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->findTextDOMElements( $node, $document );
					}
				}
			}
		}
	}

	public function theContentHook( $content ) {
		if ( ! strlen( trim( $content ) ) ) {
			return $content;    //nothing to process
		}

		$document                      = new DOMDocument();
		$document->strictErrorChecking = false;
		$libxml_previous_state         = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$this->initLinkCounts( $document );
			if ( $this->cnt_page_links > self::MAX_LINKS_ON_PAGE ) {
				return $content;
			}

			$this->findTextDOMElements( $document, $document );

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . str_replace( '>', ' ', $e->getMessage() ) . "\n--->";
		}
	}

	private function initLinkCounts( DOMDocument $document ) {
		$this->cnt_page_link_replacements = 0;
		$this->cnt_page_links             = 0;
		$this->kw_page_replacement_counts = array();
		$this->link_counts                = array();
		$cnt                              = 0;
		$xpath                            = new DOMXPath( $document );
		$table_data                       = $xpath->query( "//a|//*[starts-with(name(),'h')]" );
		$hasLinksBeforeH1                 = false;
		$hadHAlready                      = false;
		foreach ( $table_data as $element ) {
			if ( $element->nodeName == 'a' ) {
				if ( ! $hadHAlready ) {
					$hasLinksBeforeH1 = true;
				}
				$this->cnt_page_links ++;
				$cnt ++;
			}
			if ( substr( $element->nodeName, 0, 1 ) == 'h' ) {
				$hadHAlready         = true;
				$this->link_counts[] = $cnt;
				$cnt                 = 0;
			}
		}
		$this->link_counts[] = $cnt;

		if ( $hasLinksBeforeH1 ) {
			$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
		}
	}

	/**
	 * @param $url input URL
	 *
	 * @return bool true if input url has same host name as current site
	 */
	private function isSameDomainUrl( $url ) {
		$urlHostname = strtolower( parse_url( $url, PHP_URL_HOST ) );
		if ( ! strlen( $urlHostname ) ) {
			return true;
		}

		return $urlHostname == strtolower( parse_url( get_site_url(), PHP_URL_HOST ) );
	}
}
