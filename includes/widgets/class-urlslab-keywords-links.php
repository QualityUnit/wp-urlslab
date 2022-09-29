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

	private array $remove_nodes = array();


	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD = 'urlslab_max_replacements_for_each_keyword';
	public const MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD = 2;

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL = 'urlslab_max_replacements_per_keyword_url';
	public const MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD_URL = 1;


	public const SETTING_NAME_MAX_REPLACEMENTS_PER_URL = 'urlslab_max_replacements_per_url';
	public const MAX_DEFAULT_REPLACEMENTS_PER_URL = 2;

	//if page contains more links than this limit, don't try to add next links to page
	public const SETTING_NAME_MAX_LINKS_ON_PAGE = 'urlslab_max_link_on_page';
	public const SETTING_DEFAULT_MAX_LINKS_ON_PAGE = 100;

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE = 'urlslab_max_replacements_per_page';
	public const SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PAGE = 30;

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH = 'urlslab_max_replacements_per_paragraph';
	public const SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PARAGRAPH = 2;

	public const SETTING_NAME_MIN_CHARS_TO_NEXT_LINK = 'urlslab_min_ch_around_lnk';
	public const SETTING_DEFAULT_MIN_CHARS_TO_NEXT_LINK = 20;

	//minimum paragraph length defines minimum size of text length, where can be placed the link
	//in too short texts we will not try to include links
	public const SETTING_NAME_MIN_PARAGRAPH_LENGTH = 'urlslab_min_prgr_len';
	public const SETTING_DEFAULT_MIN_PARAGRAPH_LENGTH = 30;

	public const SETTING_NAME_MAX_PARAGRAPH_DENSITY = 'urlslab_max_prgr_density';
	public const SETTING_DEFAULT_MAX_PARAGRAPH_DENSITY = 100; //one link per 100 characters

	public function __construct() {
		$this->widget_slug = 'urlslab-keywords-links';
		$this->widget_title = 'Keywords Links';
		$this->widget_description = 'Build automatic links from your keywords that appear in website content';
		$this->landing_page_link = 'https://www.urlslab.com';
		$this->parent_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_content', $this, 'theContentHook', 11 );
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

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords, int $position_start, $position_end, $min_text_len, $max_paragraph_density_links ) {
		if ( $this->cnt_page_links > get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::SETTING_DEFAULT_MAX_LINKS_ON_PAGE ) ||
			 $this->cnt_page_link_replacements > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PAGE ) ||
			 $this->cnt_paragraph_link_replacements > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PARAGRAPH ) ||
			 $this->cnt_paragraph_link_replacements > $max_paragraph_density_links
		) {
			return;
		}

		$possible_value_len = strlen( $node->nodeValue ) - $position_start - $position_end;
		if ( $possible_value_len < $min_text_len ) {
			return;
		}

		$node_value = substr( strtolower( $node->nodeValue ), $position_start, $possible_value_len );

		foreach ( $keywords as $kw_md5 => $kwRow ) {
			if ( preg_match( '/\b(' . preg_quote( $kwRow['kw'], '/' ) . ')\b/', $node_value, $matches, PREG_OFFSET_CAPTURE ) ) {
				$pos = $matches[1][1] + $position_start;
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
				if ( $this->kw_page_replacement_counts[ $kwRow['kw'] ] > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );
					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow['url'] ] > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_URL ) ) {
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
					$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords, 0, get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK, self::SETTING_DEFAULT_MIN_CHARS_TO_NEXT_LINK ), 0, $max_paragraph_density_links );
				}
				if ( is_object( $domTextEnd ) ) {
					$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords, get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK, self::SETTING_DEFAULT_MIN_CHARS_TO_NEXT_LINK ), 0, 0, $max_paragraph_density_links );
				}

				//remove processed node
				$this->remove_nodes[] = $node;
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
					'kw' => strtolower( $row['keyword'] ),
					'url' => $row['urlLink'],
				);
				//addressing cache
				$this->keywords_cache_md5[ strtolower( $row['keyword'] ) ][] = $row['kwMd5'];
				$this->urls_cache_md5[ $row['urlLink'] ][] = $row['kwMd5'];
			}
		}
	}

	private function get_keywords( $inputText ) {
		$keywords = array();
		foreach ( $this->keywords_cache as $kw_md5 => $row ) {
			if (
				( ! isset( $this->kw_page_replacement_counts[ $row['kw'] ] ) || $this->kw_page_replacement_counts[ $row['kw'] ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD ) ) &&
				( ! isset( $this->url_page_replacement_counts[ $row['url'] ] ) || $this->url_page_replacement_counts[ $row['url'] ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_URL ) ) &&
				( ! isset( $this->urlandkw_page_replacement_counts[ $kw_md5 ] ) || $this->urlandkw_page_replacement_counts[ $kw_md5 ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD_URL ) )
			) {
				if ( strpos( $inputText, strtolower( $row['kw'] ) ) !== false ) {
					$keywords[ $kw_md5 ] = $row;
				}
			} else {
				unset( $this->keywords_cache[ $kw_md5 ] );
			}
		}

		return $keywords;
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document ) {
		//skip processing if HTML tag contains attribute "urlslab-skip"
		if ( $this->is_skip_elemenet( $dom ) ) {
			return;
		}

		if ( ! empty( $dom->childNodes ) ) {
			foreach ( $dom->childNodes as $node ) {

				if ( $node instanceof DOMText && strlen( trim( $node->nodeValue ) ) > 1 ) {
					$this->replaceKeywordWithLinks(
						$node,
						$document,
						$this->get_keywords( strtolower( $node->nodeValue ) ),
						0,
						0,
						get_option( self::SETTING_NAME_MIN_PARAGRAPH_LENGTH, self::SETTING_DEFAULT_MIN_PARAGRAPH_LENGTH ),
						ceil( 1 / get_option( self::SETTING_NAME_MAX_PARAGRAPH_DENSITY, self::SETTING_DEFAULT_MAX_PARAGRAPH_DENSITY ) * strlen( $node->nodeValue ) )
					);
				} else {
					if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
					}

					//skip processing some types of HTML elements
					if ( ! in_array( strtolower( $node->nodeName ), array( 'a', 'button', 'input', '#cdata-section', 'script' ) ) && ! preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->findTextDOMElements( $node, $document );
					}
				}
			}
			//cleanup nodes replaced with links
			foreach ( $this->remove_nodes as $node ) {
				$node->parentNode->removeChild( $node );
			}
			$this->remove_nodes = array();
		}
	}

	public function theContentHook( DOMDocument $document ) {
		$this->init_keywords_cache( strtolower( $document->textContent ) );
		if ( count( $this->keywords_cache ) == 0 ) {
			return;
		}
		try {
			if ( $this->cnt_page_links > get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::SETTING_DEFAULT_MAX_LINKS_ON_PAGE ) ) {
				return;
			}
			$this->findTextDOMElements( $document, $document );
		} catch ( Exception $e ) {
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

	public static function add_option() {
		add_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD, '', true );
		add_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD_URL, '', true );
		add_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_URL, '', true );
		add_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::SETTING_DEFAULT_MAX_LINKS_ON_PAGE, '', true );
		add_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PAGE, '', true );
		add_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PARAGRAPH, '', true );
		add_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK, self::SETTING_DEFAULT_MIN_CHARS_TO_NEXT_LINK, '', true );
		add_option( self::SETTING_NAME_MIN_PARAGRAPH_LENGTH, self::SETTING_DEFAULT_MIN_PARAGRAPH_LENGTH, '', true );
		add_option( self::SETTING_NAME_MAX_PARAGRAPH_DENSITY, self::SETTING_DEFAULT_MAX_PARAGRAPH_DENSITY, '', true );
	}

	public static function update_settings( array $new_settings ) {
		if ( isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_LINKS_ON_PAGE,
				$new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ] ) &&
			 ! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ] ) ) {
			update_option(
				self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK,
				$new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ]
			);
		}

		if ( isset( $new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ] ) ) {
			update_option(
				self::SETTING_NAME_MIN_PARAGRAPH_LENGTH,
				$new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ]
			);
		}
		if ( isset( $new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ] ) ) {
			update_option(
				self::SETTING_NAME_MAX_PARAGRAPH_DENSITY,
				$new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ]
			);
		}
	}
}
