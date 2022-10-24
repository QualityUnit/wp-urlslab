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
	private array $keywords_cache_ids = array();
	//address all urls
	private array $urls_cache_ids = array();

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

	public const SETTING_NAME_KW_MAP = 'urlslab_kw_map';
	public const SETTING_DEFAULT_KW_MAP = 1;
	private array $options = array();

	public function __construct() {
		$this->widget_slug        = 'urlslab-keywords-links';
		$this->widget_title       = 'Keywords Links';
		$this->widget_description = 'Build automatic links from your keywords that appear in website content';
		$this->landing_page_link  = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_content', $this, 'theContentHook', 11 );
		$this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ]     = get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD );
		$this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] = get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD_URL );
		$this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ]         = get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_DEFAULT_REPLACEMENTS_PER_URL );
		$this->options[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ]             = get_option( self::SETTING_NAME_MIN_PARAGRAPH_LENGTH, self::SETTING_DEFAULT_MIN_PARAGRAPH_LENGTH );
		$this->options[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ]            = get_option( self::SETTING_NAME_MAX_PARAGRAPH_DENSITY, self::SETTING_DEFAULT_MAX_PARAGRAPH_DENSITY );
		$this->options[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ]                = get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::SETTING_DEFAULT_MAX_LINKS_ON_PAGE );
		$this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ]        = get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PAGE );
		$this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ]   = get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH, self::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PARAGRAPH );
		$this->options[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ]           = get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK, self::SETTING_DEFAULT_MIN_CHARS_TO_NEXT_LINK );
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
		if (
			$this->cnt_paragraph_link_replacements >= $max_paragraph_density_links ||
			$this->cnt_page_links > $this->options[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ] ||
			$this->cnt_page_link_replacements > $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ] ||
			$this->cnt_paragraph_link_replacements > $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ]
		) {
			return;
		}

		$possible_value_len = strlen( $node->nodeValue ) - $position_start - $position_end;
		if ( $possible_value_len < $min_text_len ) {
			return;
		}

		$node_value = substr( strtolower( $node->nodeValue ), $position_start, $possible_value_len );

		foreach ( $keywords as $kw_id => $kwRow ) {
			if ( preg_match( '/\b(' . preg_quote( $kwRow['kw'], '/' ) . ')\b/', $node_value, $matches, PREG_OFFSET_CAPTURE ) ) {
				$pos = $matches[1][1] + $position_start;
				$this->cnt_page_links ++;
				$this->cnt_page_link_replacements ++;
				$this->cnt_paragraph_link_replacements ++;
				if ( isset( $this->kw_page_replacement_counts[ $kwRow['kw'] ] ) ) {
					$this->kw_page_replacement_counts[ $kwRow['kw'] ] ++;
				} else {
					$this->kw_page_replacement_counts[ $kwRow['kw'] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kwRow['url'] ] ) ) {
					$this->url_page_replacement_counts[ $kwRow['url'] ] ++;
				} else {
					$this->url_page_replacement_counts[ $kwRow['url'] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kw_id ] ) ) {
					$this->urlandkw_page_replacement_counts[ $kw_id ] ++;
				} else {
					$this->urlandkw_page_replacement_counts[ $kw_id ] = 1;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ( $this->kw_page_replacement_counts[ $kwRow['kw'] ] > $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );

					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow['url'] ] > $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] ) {
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
				$linkDom->setAttribute( 'urlslab-kw', 'y' );

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
				unset( $keywords[ $kw_id ] );

				//process other keywords in text
				if ( is_object( $domTextStart ) ) {
					$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords, 0, $this->options[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ], 0, $max_paragraph_density_links );
				}
				if ( is_object( $domTextEnd ) ) {
					$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords, $this->options[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ], 0, 0, $max_paragraph_density_links );
				}

				//remove processed node
				$this->remove_nodes[] = $node;

				return;
			} else {
				$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );
			}
			unset( $keywords[ $kw_id ] );
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
			foreach ( $this->keywords_cache_ids[ $kw ] as $kw_id ) {
				unset( $keywords[ $kw_id ] );
			}
		}
		if ( false !== $url ) {
			foreach ( $this->urls_cache_ids[ $url ] as $url_id ) {
				unset( $keywords[ $url_id ] );
			}
		}

		return $keywords;
	}

	private function init_keywords_cache( $input_text ) {
		global $wpdb;

		$keyword_table = URLSLAB_KEYWORDS_TABLE;

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT kw_id, keyword, urlLink, urlFilter FROM ' . $keyword_table . " WHERE (lang = %s OR lang = 'all') ORDER BY kw_priority ASC, kw_length DESC", urlslab_get_language() ), 'ARRAY_A' ); // phpcs:ignore

		$this->keywords_cache = array();
		$currentUrl           = $this->get_current_page_url()->get_url();

		foreach ( $results as $row ) {
			$kwUrl = new Urlslab_Url( $row['urlLink'] );
			if (
				$this->get_current_page_url()->get_url_id() != $kwUrl->get_url_id() &&
				preg_match( '/' . str_replace( '/', '\\/', $row['urlFilter'] ) . '/', $currentUrl ) &&
				strpos( $input_text, strtolower( $row['keyword'] ) ) !== false
			) {
				$this->keywords_cache[ $row['kw_id'] ] = array(
					'kw'  => strtolower( $row['keyword'] ),
					'url' => $row['urlLink'],
				);
				//addressing cache
				$this->keywords_cache_ids[ strtolower( $row['keyword'] ) ][] = $row['kw_id'];
				$this->urls_cache_ids[ $row['urlLink'] ][]                   = $row['kw_id'];
			}
		}
	}

	private function get_keywords( $inputText ) {
		$keywords = array();
		$len      = strlen( trim( $inputText ) );
		if ( $len > 1 ) {
			foreach ( $this->keywords_cache as $kw_id => $row ) {
				if (
					( ! isset( $this->kw_page_replacement_counts[ $row['kw'] ] ) || $this->kw_page_replacement_counts[ $row['kw'] ] < $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] ) &&
					( ! isset( $this->url_page_replacement_counts[ $row['url'] ] ) || $this->url_page_replacement_counts[ $row['url'] ] < $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] ) &&
					( ! isset( $this->urlandkw_page_replacement_counts[ $kw_id ] ) || $this->urlandkw_page_replacement_counts[ $kw_id ] < $this->options[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] )
				) {
					if ( strlen( $row['kw'] ) <= $len && strpos( $inputText, strtolower( $row['kw'] ) ) !== false ) {
						$keywords[ $kw_id ] = $row;
					}
				} else {
					unset( $this->keywords_cache[ $kw_id ] );
				}
			}
		}

		return $keywords;
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document ) {
		//skip processing if HTML tag contains attribute "urlslab-skip" or "urlslab-skip-keywords"
		if ( $this->is_skip_elemenet( $dom, 'keywords' ) ) {
			return;
		}

		if ( ! empty( $dom->childNodes ) ) {
			foreach ( $dom->childNodes as $node ) {

				if ( strlen( trim( $node->nodeValue ) ) > 1 ) {
					if ( $node instanceof DOMText ) {
						$this->replaceKeywordWithLinks(
							$node,
							$document,
							$this->get_keywords( strtolower( $node->nodeValue ) ),
							0,
							0,
							$this->options[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ],
							round( 1 / $this->options[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ] * strlen( $node->nodeValue ) )
						);
					} else {
						if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
							$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
						}

						//skip processing some types of HTML elements
						if (
							! in_array(
								strtolower( $node->nodeName ),
								array(
									'a',
									'button',
									'input',
									'#cdata-section',
									'script',
									'header',
									'meta',
									'img',
								)
							) &&
							! preg_match( '/^[hH][0-9]$/', $node->nodeName )
						) {
							$this->findTextDOMElements( $node, $document );
						}
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
		$this->initLinkCounts( $document );
		$this->init_keywords_cache( strtolower( $document->textContent ) );
		if ( count( $this->keywords_cache ) == 0 ) {
			return;
		}
		try {
			if ( $this->cnt_page_links > get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::SETTING_DEFAULT_MAX_LINKS_ON_PAGE ) ) {
				return;
			}
			$this->findTextDOMElements( $document, $document );
			$this->logUsedKeywords();
		} catch ( Exception $e ) {
		}
	}

	private function logUsedKeywords() {
		if ( 0 === get_option( self::SETTING_NAME_KW_MAP, self::SETTING_DEFAULT_KW_MAP ) ) {
			return;
		}

		$srcUrlId = $this->get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT kw_id FROM ' . URLSLAB_KEYWORDS_MAP_TABLE . ' WHERE urlMd5 = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$keywords = array();
		array_walk(
			$results,
			function( $value, $key ) use ( &$keywords ) {
				$keywords[ $value['kw_id'] ] = true;
			}
		);

		$tracked_kws = array();

		$values      = array();
		$placeholder = array();
		foreach ( $this->urlandkw_page_replacement_counts as $kw_id => $dummy ) {
			if ( ! isset( $keywords[ $kw_id ] ) ) {
				array_push(
					$values,
					$kw_id,
					$srcUrlId,
				);
				$placeholder[] = '(%d,%d)';
			} else {
				$tracked_kws[ $kw_id ] = true;
			}
		}

		if ( ! empty( $values ) ) {
			$table               = URLSLAB_KEYWORDS_MAP_TABLE;
			$placeholder_string  = implode( ', ', $placeholder );
			$insert_update_query = "INSERT IGNORE INTO $table (kw_id, urlMd5) VALUES $placeholder_string";

			$wpdb->query(
				$wpdb->prepare(
					$insert_update_query, // phpcs:ignore
					$values
				)
			);
		}

		$delete = array_diff( array_keys( $keywords ), array_keys( $tracked_kws ) );
		if ( ! empty( $delete ) ) {
			$values      = array( $srcUrlId );
			$placeholder = array();
			foreach ( $delete as $url_id ) {
				$placeholder[] = '%d';
				$values[]      = $url_id;
			}
			$table              = URLSLAB_URLS_MAP_TABLE;
			$placeholder_string = implode( ',', $placeholder );
			$delete_query       = "DELETE FROM $table WHERE srcUrlMd5=%d AND destUrlMd5 IN ($placeholder_string)";
			$wpdb->query( $wpdb->prepare( $delete_query, $values ) ); // phpcs:ignore
		}

	}

	private function initLinkCounts( DOMDocument $document ) {
		$this->cnt_page_link_replacements       = 0;
		$this->cnt_page_links                   = 0;
		$this->kw_page_replacement_counts       = array();
		$this->url_page_replacement_counts      = array();
		$this->urlandkw_page_replacement_counts = array();
		$this->link_counts                      = array();
		$cnt                                    = 0;
		$xpath                                  = new DOMXPath( $document );
		$table_data                             = $xpath->query( "//a|//*[starts-with(name(),'h')]" );
		$hasLinksBeforeH1                       = false;
		$hadHAlready                            = false;
		foreach ( $table_data as $element ) {
			if ( 'a' == $element->nodeName ) {
				if ( ! $hadHAlready ) {
					$hasLinksBeforeH1 = true;
				}
				$this->cnt_page_links ++;
				$cnt ++;
			} else if ( preg_match( '/^[hH][0-9]$/', $element->nodeName ) ) {
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
		add_option( self::SETTING_NAME_KW_MAP, self::SETTING_DEFAULT_KW_MAP, '', true );
	}

	public static function update_settings( array $new_settings ) {
		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_LINKS_ON_PAGE,
				$new_settings[ self::SETTING_NAME_MAX_LINKS_ON_PAGE ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
				$new_settings[ self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ] )
		) {
			update_option(
				self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK,
				$new_settings[ self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ]
			);
		}

		if (
			isset( $new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ] )
		) {
			update_option(
				self::SETTING_NAME_MIN_PARAGRAPH_LENGTH,
				$new_settings[ self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ]
			);
		}
		if (
			isset( $new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ] ) &&
			! empty( $new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ] )
		) {
			update_option(
				self::SETTING_NAME_MAX_PARAGRAPH_DENSITY,
				$new_settings[ self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ]
			);
		}
		if (
			isset( $new_settings['kw_map'] ) &&
			! empty( $new_settings['kw_map'] )
		) {
			update_option(
				self::SETTING_NAME_KW_MAP,
				1
			);
		} else {
			update_option(
				self::SETTING_NAME_KW_MAP,
				0
			);
		}
	}
}
