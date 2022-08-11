<?php

// phpcs:disable WordPress.NamingConventions
class Urlslab_Keywords_Links extends Urlslab_Widget {


	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;

	private int $cnt_page_link_replacements = 0;
	private int $cnt_page_links = 0;
	private int $cnt_paragraph_link_replacements = 0;
	private array $link_counts = array();
	private array $kw_page_replacement_counts = array();
	private array $url_page_replacement_counts = array();
	private array $urlandkw_page_replacement_counts = array();

	private array $keywords_cache = array();

	//address all specific keywords
	private array $keywords_cache_md5 = array();
	//address all urls
	private array $urls_cache_md5 = array();

	private const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD = 'urlslab_max_replacements_for_each_keyword';
	private int $MAX_REPLACEMENTS_PER_KEYWORD = 2;

	private const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL = 'urlslab_max_replacements_per_keyword_url';
	private int $MAX_REPLACEMENTS_PER_KEYWORD_URL = 1;


	private const SETTING_NAME_MAX_REPLACEMENTS_PER_URL = 'urlslab_max_replacements_per_url';
	private int $MAX_REPLACEMENTS_PER_URL = 2;

	//if page contains more links than this limit, don't try to add next links to page
	private const SETTING_NAME_MAX_LINKS_ON_PAGE = 'urlslab_max_link_on_page';
	private int $MAX_LINKS_ON_PAGE = 100;

	private const SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE = 'urlslab_max_replacements_per_page';
	private int $MAX_REPLACEMENTS_PER_PAGE = 30;

	private const SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH = 'urlslab_max_replacements_per_paragraph';
	private int $MAX_REPLACEMENTS_PER_PARAGRAPH = 2;

	public function __construct() {
		$this->widget_slug = 'urlslab-keywords-links';
		$this->widget_title = 'Keywords Links';
		$this->widget_description = 'Build automatic links from your keywords that appear in website content';
		$this->landing_page_link = 'https://www.urlslab.com';
		$this->parent_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$this->init_settings();
		$loader->add_filter( 'the_content', $this, 'hook_callback', 11 );
	}

	public function hook_callback( $content ) {
		return $this->theContentHook( $content );
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

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords ) {
		if ( $this->cnt_page_links > $this->MAX_LINKS_ON_PAGE || $this->cnt_page_link_replacements > $this->MAX_REPLACEMENTS_PER_PAGE || $this->cnt_paragraph_link_replacements > $this->MAX_REPLACEMENTS_PER_PARAGRAPH ) {
			return;
		}

		if ( 0 == strlen( trim( $node->nodeValue ) ) ) {
			return; //empty node
		}

		foreach ( $keywords as $kw_md5 => $kwRow ) {
			if ( preg_match( '/\b(' . preg_quote( strtolower( $kwRow['kw'] ), '/' ) . ')\b/', strtolower( $node->nodeValue ), $matches, PREG_OFFSET_CAPTURE ) ) {
				$pos = $matches[1][1];
				$this->cnt_page_links++;
				$this->cnt_page_link_replacements++;
				$this->cnt_paragraph_link_replacements++;
				if ( isset( $this->kw_page_replacement_counts[ $kwRow['kw'] ] ) ) {
					$this->kw_page_replacement_counts[ $kwRow['kw'] ]++;
				} else {
					$this->kw_page_replacement_counts[ $kwRow['kw'] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kwRow['url'] ] ) ) {
					$this->url_page_replacement_counts[ $kwRow['url'] ]++;
				} else {
					$this->url_page_replacement_counts[ $kwRow['url'] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kw_md5 ] ) ) {
					$this->urlandkw_page_replacement_counts[ $kw_md5 ]++;
				} else {
					$this->urlandkw_page_replacement_counts[ $kw_md5 ] = 1;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ( $this->kw_page_replacement_counts[ $kwRow['kw'] ] > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, $this->MAX_REPLACEMENTS_PER_KEYWORD ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );
					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow['url'] ] > $this->MAX_REPLACEMENTS_PER_URL ) {
					$keywords = $this->removeKeywordUrl( $keywords, false, $kwRow['url'] );
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
				$linkDom = $document->createElement( 'a', substr( $node->nodeValue, $pos, strlen( $kwRow['kw'] ) ) );
				$linkDom->setAttribute( 'href', $kwRow['url'] );

				//if relative url or url from same domain, don't add target attribute
				if ( ! urlslab_is_same_domain_url( $kwRow['url'] ) ) {
					$linkDom->setAttribute( 'target', '_blank' );
				}

				$node->parentNode->insertBefore( $linkDom, $node );

				//add text after keyword
				if ( $pos + strlen( $kwRow['kw'] ) < strlen( $node->nodeValue ) ) {
					$domTextEnd = $document->createTextNode( substr( $node->nodeValue, $pos + strlen( $kwRow['kw'] ) ) );
					$node->parentNode->insertBefore( $domTextEnd, $node );
				} else {
					$domTextEnd = null;
				}
				unset( $keywords[ $kw_md5 ] );

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
			} else {
				$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );
			}
			unset( $keywords[ $kw_md5 ] );
		}
	}

	/**
	 * @param array $keywords
	 * @param boolean|string $kw if false, remove all entries with given url
	 * @param boolean|string $url if false, remove all entries with given keyword
	 *
	 * @return array
	 */
	private function removeKeywordUrl( array $keywords, $kw, $url ): array {
		if ( false !== $kw ) {
			foreach ( $this->keywords_cache_md5[ $kw ] as $md5 ) {
				unset( $keywords[ $md5 ] );
			}
		}
		if ( false !== $url ) {
			foreach ( $this->urls_cache_md5[ $url ] as $md5 ) {
				unset( $keywords[ $md5 ] );
			}
		}
		return $keywords;
	}

	private function init_keywords_cache( $input_text ) {
		global $wpdb;


		$keyword_table = URLSLAB_KEYWORDS_TABLE;

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT kwMd5, keyword, urlLink, urlFilter FROM ' . $keyword_table . " WHERE (lang = %s OR lang = 'all') ORDER BY kw_priority ASC, kw_length DESC", urlslab_get_language() ), 'ARRAY_A' ); // phpcs:ignore

		$this->keywords_cache = array();
		$current_page = get_current_page_url();
		foreach ( $results as $row ) {
			$kwUrl = new Urlslab_Url( $row['urlLink'] );
			if (
					$current_page->get_url_id() != $kwUrl->get_url_id() &&
					preg_match( '/' . str_replace( '/', '\\/', $row['urlFilter'] ) . '/', $current_page->get_url() ) &&
					strpos( $input_text, strtolower( $row['keyword'] ) ) !== false
			) {
				$this->keywords_cache[ $row['kwMd5'] ] = array(
					'kw' => $row['keyword'],
					'url' => $row['urlLink'],
				);
				//addressing cache
				$this->keywords_cache_md5[ $row['keyword'] ][] = $row['kwMd5'];
				$this->urls_cache_md5[ $row['urlLink'] ][] = $row['kwMd5'];
			}
		}

	}

	private function get_keywords( $inputText ) {
		$keywords = array();
		foreach ( $this->keywords_cache as $kw_md5 => $row ) {
			if (
				( ! isset( $this->kw_page_replacement_counts[ $row['kw'] ] ) || $this->kw_page_replacement_counts[ $row['kw'] ] < $this->MAX_REPLACEMENTS_PER_KEYWORD ) &&
				( ! isset( $this->url_page_replacement_counts[ $row['url'] ] ) || $this->url_page_replacement_counts[ $row['url'] ] < $this->MAX_REPLACEMENTS_PER_URL ) &&
				( ! isset( $this->urlandkw_page_replacement_counts[ $kw_md5 ] ) || $this->urlandkw_page_replacement_counts[ $kw_md5 ] < $this->MAX_REPLACEMENTS_PER_KEYWORD_URL ) &&
					strpos( $inputText, strtolower( $row['kw'] ) ) !== false
			) {
				$keywords[ $kw_md5 ] = $row;
			} else {
				unset( $this->keywords_cache[ $kw_md5 ] );
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
					$this->replaceKeywordWithLinks( $node, $document, $this->get_keywords( strtolower( $node->nodeValue ) ) );
				} else {
					if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
					}

					//skip processing some types of HTML elements
					if ( ! in_array( strtolower( $node->nodeName ), array( 'a', 'button', 'input' ) ) && ! preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
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

		$this->init_keywords_cache( strtolower( $content ) );
		if ( count( $this->keywords_cache ) == 0 ) {
			return $content;
		}

		$document = new DOMDocument();
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ) );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			if ( $this->cnt_page_links > $this->MAX_LINKS_ON_PAGE ) {
				return $content;
			}

			$this->findTextDOMElements( $document, $document );

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . esc_html( $e->getMessage() ) . "\n--->";
		}
	}

	private function initLinkCounts( DOMDocument $document ) {
		$this->cnt_page_link_replacements = 0;
		$this->cnt_page_links = 0;
		$this->kw_page_replacement_counts = array();
		$this->url_page_replacement_counts = array();
		$this->urlandkw_page_replacement_counts = array();
		$this->link_counts = array();
		$cnt = 0;
		$xpath = new DOMXPath( $document );
		$table_data = $xpath->query( "//a|//*[starts-with(name(),'h')]" );
		$hasLinksBeforeH1 = false;
		$hadHAlready = false;
		foreach ( $table_data as $element ) {
			if ( 'a' == $element->nodeName ) {
				if ( ! $hadHAlready ) {
					$hasLinksBeforeH1 = true;
				}
				$this->cnt_page_links++;
				$cnt++;
			}
			if ( substr( $element->nodeName, 0, 1 ) == 'h' ) {
				$hadHAlready = true;
				$this->link_counts[] = $cnt;
				$cnt = 0;
			}
		}
		$this->link_counts[] = $cnt;

		if ( $hasLinksBeforeH1 ) {
			$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
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
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/link-enhancer-demo.png' ) . 'link-enhancer-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'keyword-linking';
	}

	private function init_settings() {
		$option_name = $this->widget_slug;
		$option = get_option( $option_name );
		if ( false === $option ) {
			$option = array();
		}
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
			$this->MAX_REPLACEMENTS_PER_KEYWORD
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL,
			$this->MAX_REPLACEMENTS_PER_KEYWORD_URL
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
			$this->MAX_REPLACEMENTS_PER_URL
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_LINKS_ON_PAGE,
			$this->MAX_LINKS_ON_PAGE
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
			$this->MAX_REPLACEMENTS_PER_PAGE
		);
		$option = urlslab_update_widget_settings(
			$option,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
			$this->MAX_REPLACEMENTS_PER_PARAGRAPH
		);

		$this->MAX_REPLACEMENTS_PER_KEYWORD     = $option[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ];
		$this->MAX_REPLACEMENTS_PER_KEYWORD_URL = $option[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL ];
		$this->MAX_REPLACEMENTS_PER_URL = $option[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ];
		$this->MAX_LINKS_ON_PAGE = $option[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ];
		$this->MAX_REPLACEMENTS_PER_PAGE = $option[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ];
		$this->MAX_REPLACEMENTS_PER_PARAGRAPH = $option[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ];

		update_option( $option_name, $option );
	}

	public function get_widget_settings(): array {
		return array(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD => $this->MAX_REPLACEMENTS_PER_KEYWORD,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL => $this->MAX_REPLACEMENTS_PER_KEYWORD_URL,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL => $this->MAX_REPLACEMENTS_PER_URL,
			self::SETTING_NAME_MAX_LINKS_ON_PAGE => $this->MAX_LINKS_ON_PAGE,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE => $this->MAX_REPLACEMENTS_PER_PAGE,
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH => $this->MAX_REPLACEMENTS_PER_PARAGRAPH,
		);
	}
}
