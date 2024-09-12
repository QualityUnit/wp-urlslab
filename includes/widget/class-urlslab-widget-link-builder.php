<?php

// phpcs:disable WordPress.NamingConventions
class Urlslab_Widget_Link_Builder extends Urlslab_Widget {
	public const SLUG = 'urlslab-keywords-links';

	// Type - map
	public const KW_LINK_TYPE_EDITOR = 'E';                  // link added by editor in original content
	public const KW_LINK_TYPE_URLSLAB = 'U';                 // link added by urlslab

	// type - KW
	public const KW_TYPE_MANUAL = 'M';                       // manually created keyword (default)
	public const KW_TYPE_IMPORTED_FROM_CONTENT = 'I';        // keywords imported from content
	public const KW_TYPE_NONE = 'X';                         // in this case none link will be created in content
	public const CACHE_GROUP = 'urlslab_keywords';

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD = 'urlslab_max_replacements_for_each_keyword';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL = 'urlslab_max_replacements_per_keyword_url';

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_URL = 'urlslab_max_replacements_per_url';
	// if page contains more links than this limit, don't try to add next links to page
	public const SETTING_NAME_MAX_LINKS_ON_PAGE = 'urlslab_max_link_on_page';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE = 'urlslab_max_replacements_per_page';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH = 'urlslab_max_replacements_per_paragraph';
	public const SETTING_NAME_MIN_CHARS_TO_NEXT_LINK = 'urlslab_min_ch_around_lnk';
	// minimum paragraph length defines minimum size of text length, where can be placed the link
	// in too short texts we will not try to include links
	public const SETTING_NAME_MIN_PARAGRAPH_LENGTH = 'urlslab_min_prgr_len';
	public const SETTING_NAME_MAX_PARAGRAPH_DENSITY = 'urlslab_max_prgr_density';
	public const SETTING_NAME_KW_MAP = 'urlslab_kw_map';
	// IMPORT KEYWORDS
	public const SETTING_NAME_KW_IMPORT_INTERNAL_LINKS = 'urlslab_kw_imp_int';
	public const SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS = 'urlslab_kw_imp_ext';
	public const SETTING_NAME_KW_IMPORT_MAX_LENGTH = 'urlslab_kw_max_len';
	public const SETTING_NAME_KW_TYPES_TO_USE = 'urlslab_kw_types_use';
	public const SETTING_NAME_KWS_VALID_FROM = 'urlslab_kws_valid_from';
	const SETTING_NAME_BACKLINK_MONITORING = 'urlslab_backlink_monitoring';
	const SETTING_NAME_BACKLINK_MONITORING_INTERVAL = 'urlslab_backlink_monitoring_interval';

	private int $cnt_page_link_replacements = 0;
	private int $cnt_page_links = 0;
	private int $cnt_paragraph_link_replacements = 0;
	private array $link_counts = array();
	private array $kw_page_replacement_counts = array();
	private array $url_page_replacement_counts = array();
	private array $urlandkw_page_replacement_counts = array();
	private array $page_keywords = array();

	private array $keywords_cache = array();

	// address all specific keywords
	private array $keywords_cache_ids = array();
	// address all urls
	private array $urls_cache_ids = array();

	private array $remove_nodes = array();

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 5 );
	}

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Link Building', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Boost your website\'s SEO and internal linking using a complex module for keyword link management', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE );
	}

	protected function add_options() {

		$this->add_options_form_section(
			'replacements',
			function() {
				return __( 'Keyword Replacement Configuration', 'urlslab' );
			},
			function() {
				return __( 'We\'ve set up the best possible settings for you. However, they may vary, depending on factors such as sentence and paragraph length, and other factors that are crucial for achieving optimum results.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
			2,
			true,
			function() {
				return __( 'Maximum Replacements per Keyword', 'urlslab' );
			},
			function() {
				return __( 'Maximum count of keyword replacements allowed on a single page.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
			5,
			true,
			function() {
				return __( 'Maximum Replacements per URL', 'urlslab' );
			},
			function() {
				return __( 'Maximum count of URL replacements allowed on a single page.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL,
			1,
			true,
			function() {
				return __( 'Maximum Replacements per Keyword and URL Pair', 'urlslab' );
			},
			function() {
				return __( 'Maximum replacements for each keyword and URL combination on a single page.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_LINKS_ON_PAGE,
			500,
			true,
			function() {
				return __( 'Maximum Links in a Page', 'urlslab' );
			},
			function() {
				return __( 'Maximum count of both auto and manual links allowed on a single page.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
			50,
			true,
			function() {
				return __( 'Maximum Automatic Links in a Page', 'urlslab' );
			},
			function() {
				return __( 'Maximum count of automatic links allowed on a single page.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
			10,
			true,
			function() {
				return __( 'Maximum Automatic Links per Paragraph', 'urlslab' );
			},
			function() {
				return __( 'Maximum count of automatic links allowed in a paragraph.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK,
			2,
			true,
			function() {
				return __( 'Minimum Number of Characters Between Links', 'urlslab' );
			},
			function() {
				return __( 'Minimum character count between two inserted links.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_option_definition(
			self::SETTING_NAME_MIN_PARAGRAPH_LENGTH,
			30,
			true,
			function() {
				return __( 'Minimum Paragraph Length (Number of Characters)', 'urlslab' );
			},
			function() {
				return __( 'Skip keyword search for paragraphs shorter than the specified limit.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);
		$this->add_option_definition(
			self::SETTING_NAME_MAX_PARAGRAPH_DENSITY,
			30,
			true,
			function() {
				return __( 'Paragraph Density (Minimum Number of Characters per Link)', 'urlslab' );
			},
			function() {
				return __( 'Maximum paragraph density specifies the number of characters per link that can be incorporated in a paragraph.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'replacements'
		);

		$this->add_options_form_section(
			'import',
			function() {
				return __( 'Automatic Keywords Import Configuration', 'urlslab' );
			},
			function() {
				return __( 'Easily set up the initial bulk of keywords. Import pertinent keywords from your content with a single click.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS,
			false,
			true,
			function() {
				return __( 'Import Keywords from Anchors of Internal Links', 'urlslab' );
			},
			function() {
				return __( 'Load all internal links from the website as keywords.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS,
			false,
			true,
			function() {
				return __( 'Import Keywords from Anchors of External Links', 'urlslab' );
			},
			function() {
				return __( 'Load all external links from the website as keywords.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_MAX_LENGTH,
			30,
			true,
			function() {
				return __( 'Maximum Length of Automatic Imported Keyword (Number of Characters)', 'urlslab' );
			},
			function() {
				return __( 'Import only keywords up to a specified length. This helps prevent the importation of overly lengthy links with a low probability of use.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'import'
		);

		$this->add_options_form_section(
			'main',
			function() {
				return __( 'Keywords and Monitoring', 'urlslab' );
			},
			function() {
				return __( 'This plugin proactively monitors keyword usage on your website as pages load, providing the relevant keyword data sets that will assist you in optimizing your internal link structure for utmost results.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_KW_MAP,
			true,
			true,
			function() {
				return __( 'Monitor Keywords Usage', 'urlslab' );
			},
			function() {
				return __( 'The plugin monitors usage of links on the website for not logged in visitors. Once monitoring active, link relations between pages are logged into database and evaluated.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_KW_TYPES_TO_USE,
			'',
			true,
			function() {
				return __( 'Keywords Dataset', 'urlslab' );
			},
			function() {
				return __( 'Dataset Link Type used to create useful links from keywords.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function() {
				return array(
					''                                  => __( 'All keyword types', 'urlslab' ),
					self::KW_TYPE_MANUAL                => __( 'Manually created keywords', 'urlslab' ),
					self::KW_TYPE_IMPORTED_FROM_CONTENT => __( 'Keywords imported from existing links in the content', 'urlslab' ),
					self::KW_TYPE_NONE                  => __( 'None of them', 'urlslab' ),
				);
			},
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_KWS_VALID_FROM,
			0,
			true,
			function() {
				return __( 'KWs Validity', 'urlslab' );
			},
			function() {
				return __( 'Validity of kws cache.', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'main'
		);

		$this->add_options_form_section(
			'backlink_monitoring',
			function() {
				return __( 'Back Link Monitoring', 'urlslab' );
			},
			function() {
				return __( 'Keep track of new inbound links to your website with periodical updates. Receive alerts when an existing backlink is removed from a partnering external page that previously agreed to host your link.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_BACKLINK_MONITORING,
			true,
			false,
			function() {
				return __( 'Activate Backlink monitoring', 'urlslab' );
			},
			function() {
				return __( 'Backlink monitoring is performed via a background cron job that initiates at least daily, ensuring all monitored links are systematically verified.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'backlink_monitoring'
		);
		$this->add_option_definition(
			self::SETTING_NAME_BACKLINK_MONITORING_INTERVAL,
			7,
			true,
			function() {
				return __( 'Update Interval', 'urlslab' );
			},
			function() {
				return __( 'Define interval of periodic checks', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function() {
				return array(
					1  => __( 'Daily', 'urlslab' ),
					7  => __( 'Weekly', 'urlslab' ),
					30 => __( 'Monthly', 'urlslab' ),
					60 => __( 'Each 2 months', 'urlslab' ),
					90 => __( 'Quarterly', 'urlslab' ),
				);
			},
			null,
			'backlink_monitoring'
		);
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_admin() || is_404() ) {
			return;
		}
		$this->initLinkCounts( $document );
		$this->init_keywords_cache( strtolower( $document->textContent ) );

		try {
			if ( ( count( $this->keywords_cache ) > 0 ) && $this->cnt_page_links < $this->get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE ) ) {
				$this->findTextDOMElements( $document, $document );
			}
			$this->logUsedKeywords();
		} catch ( Exception $e ) {
		}
	}

	protected function is_skip_elemenet( DOMNode $dom, $custom_widget_skip = '' ): bool {
		return 'style' === $dom->nodeName || parent::is_skip_elemenet( $dom, $custom_widget_skip );
	}

	private function initLinkCounts( DOMDocument $document ) {
		$this->cnt_page_link_replacements       = 0;
		$this->cnt_page_links                   = 0;
		$this->kw_page_replacement_counts       = array();
		$this->url_page_replacement_counts      = array();
		$this->urlandkw_page_replacement_counts = array();
		$this->link_counts                      = array();
		$this->page_keywords                    = array();
		$cnt                                    = 0;
		$xpath                                  = new DOMXPath( $document );
		$table_data                             = $xpath->query( '//a[' . $this->get_xpath_query( array( 'urlslab-skip-keywords' ) ) . "]|//*[substring-after(name(), 'h') > 0 and " . $this->get_xpath_query( array( 'urlslab-skip-keywords' ) ) . ']' );
		$hasLinksBeforeH1                       = false;
		$hadHAlready                            = false;
		foreach ( $table_data as $element ) {
			if ( 'a' == $element->nodeName ) {
				if ( $element->hasAttribute( 'href' ) && ! $this->is_skip_elemenet( $element, 'keywords' ) ) {
					try {
						$href = $element->getAttribute( 'href' );
						if ( strlen( $href ) && '#' != substr( $href, 0, 1 ) && 'tel:' != substr( $href, 0, 4 ) && 'mailto:' != substr( $href, 0, 7 ) ) {
							$link_text = $this->get_link_element_text( $element );
							if ( strlen( $link_text ) ) {
								try {
									$urlObj = new Urlslab_Url( $href );
									if (
										$urlObj->is_url_valid()
										&& Urlslab_Url::get_current_page_url()->get_url_id() != $urlObj->get_url_id()
									) {
										$this->page_keywords[ $link_text ]['urls'][ $urlObj->get_url_id() ] = array(
											'obj' => $urlObj,
											't'   => self::KW_LINK_TYPE_EDITOR,
										);
									}
								} catch ( Exception $e ) {
								}
							}
							if ( ! $hadHAlready ) {
								$hasLinksBeforeH1 = true;
							}
							++ $this->cnt_page_links;
							++ $cnt;
						}
					} catch ( Exception $e ) {
					}
				}
			} else {
				if ( preg_match( '/^[hH]\d$/', $element->nodeName ) ) {
					$hadHAlready         = true;
					$this->link_counts[] = $cnt;
					$cnt                 = 0;
				}
			}
		}
		$this->link_counts[] = $cnt;

		if ( $hasLinksBeforeH1 ) {
			$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
		}
	}

	private function get_link_element_text( $dom ): string {
		if ( ! empty( $dom->childNodes ) ) {
			$value = '';
			foreach ( $dom->childNodes as $node ) {
				if ( ! $this->is_skip_elemenet( $node, 'keywords' ) && ( $node instanceof DOMText || 'em' === $node->nodeName ) && strlen( trim( $node->nodeValue ) ) > 1 ) {
					$value .= trim( $node->nodeValue );
				}
			}

			return $value;
		}

		return '';
	}

	private function init_keywords_cache( $input_text ) {
		global $wpdb;
		$lang = $this->get_current_language_code();

		$results = array();
		if ( self::KW_TYPE_NONE != $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE ) ) {
			$results = Urlslab_Cache::get_instance()->get( 'kws_' . $lang, self::CACHE_GROUP, $found, false, $this->get_option( self::SETTING_NAME_KWS_VALID_FROM ) );
			if ( false === $results || ! $found ) {
				$sql_data = array();

				$where_type = '';
				if ( '' != $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE ) ) {
					$where_type = ' kwType=%s AND ';
					$sql_data[] = $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE );
				}

				$sql_data[] = $lang;
				$sql_data[] = Urlslab_Data::get_now();

				$results = $wpdb->get_results( $wpdb->prepare( 'SELECT kw_id, kw_hash, keyword, urlLink, urlFilter, valid_until FROM ' . URLSLAB_KEYWORDS_TABLE . ' WHERE ' . $where_type . "(lang = %s OR lang = 'all') AND (valid_until>=%s OR valid_until IS NULL) ORDER BY kw_priority ASC, kw_length DESC", $sql_data ), 'ARRAY_A' ); // phpcs:ignore
				Urlslab_Cache::get_instance()->set( 'kws_' . $lang, $results, self::CACHE_GROUP );
			}
		}
		$this->keywords_cache = array();
		$currentUrl           = Urlslab_Url::get_current_page_url()->get_url_with_protocol();

		foreach ( $results as $row ) {
			if ( empty( $row['keyword'] ) ) {
				continue;
			}

			if ( isset( $row['valid_until'] ) && time() > strtotime( $row['valid_until'] ) ) {
				continue;
			}

			if ( isset( $this->page_keywords[ $row['keyword'] ] ) ) {
				$this->page_keywords[ $row['keyword'] ]['kw_id'] = $row['kw_id'];
			}
			if (
				( '.*' === $row['urlFilter'] || empty( $row['urlFilter'] ) || preg_match( '/' . str_replace( '/', '\\/', $row['urlFilter'] ) . '/', $currentUrl ) )
				&& false !== strpos( $input_text, strtolower( $row['keyword'] ) )
			) {
				try {
					$kwUrl = new Urlslab_Url( $row['urlLink'] );
					if ( Urlslab_Url::get_current_page_url()->get_url_id() != $kwUrl->get_url_id() && ! $kwUrl->is_blacklisted() ) {
						$this->keywords_cache[ $row['kw_id'] ] = array(
							'kw'  => strtolower( $row['keyword'] ),
							'url' => $row['urlLink'],
						);
						// addressing cache
						$this->keywords_cache_ids[ strtolower( $row['keyword'] ) ][] = $row['kw_id'];
						$this->urls_cache_ids[ $row['urlLink'] ][]                   = $row['kw_id'];
					}
				} catch ( Exception $e ) {
				}
			}
		}
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document ) {
		// skip processing if HTML tag contains attribute "urlslab-skip-all" or "urlslab-skip-keywords"
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
							$this->get_option( self::SETTING_NAME_MIN_PARAGRAPH_LENGTH ),
							round( 1 / $this->get_option( self::SETTING_NAME_MAX_PARAGRAPH_DENSITY ) * strlen( $node->nodeValue ) )
						);
					} else {
						if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH]\d$/', $node->nodeName ) ) {
							$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
						}

						// skip processing some types of HTML elements
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
							)
							&& ! preg_match( '/^[hH]\d$/', $node->nodeName )
						) {
							$this->findTextDOMElements( $node, $document );
						}
					}
				}
			}
			// cleanup nodes replaced with links
			foreach ( $this->remove_nodes as $node ) {
				$node->parentNode->removeChild( $node );
			}
			$this->remove_nodes = array();
		}
	}

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords, int $position_start, int $position_end, $min_text_len, $max_paragraph_density_links ) {
		if (
			$this->cnt_paragraph_link_replacements >= $max_paragraph_density_links
			|| $this->cnt_page_links > $this->get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE )
			|| $this->cnt_page_link_replacements > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE )
			|| $this->cnt_paragraph_link_replacements > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH )
		) {
			return;
		}

		$possible_value_len = strlen( $node->nodeValue ) - $position_start - $position_end;
		if ( $possible_value_len < $min_text_len ) {
			return;
		}

		$node_value = substr( strtolower( $node->nodeValue ), $position_start, $possible_value_len );

		foreach ( $keywords as $kw_id => $kwRow ) {
			if ( ! isset( $keywords[ $kw_id ] ) ) {
				continue;
			}
			if ( preg_match( '/(?<!\w|-|_)\b(' . preg_quote( $kwRow['kw'], '/' ) . ')\b(?!\w|-|_)/u', $node_value, $matches, PREG_OFFSET_CAPTURE ) ) {
				$pos = $matches[1][1] + $position_start;

				//check if space around link is sufficient
				if (
					(
						null !== $node->previousSibling &&
						'a' === $node->previousSibling->nodeName &&
						$pos < $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK )
					) ||
					(
						null !== $node->nextSibling &&
						'a' === $node->nextSibling->nodeName &&
						strlen( $node->nodeValue ) - $pos - strlen( $matches[1][0] ) < $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK )
					)
				) {
					//there is link already too close to place, where we want to add link, skip this keyword
					continue;
				}

				++ $this->cnt_page_links;
				++ $this->cnt_page_link_replacements;
				++ $this->cnt_paragraph_link_replacements;
				if ( isset( $this->kw_page_replacement_counts[ $kwRow['kw'] ] ) ) {
					++ $this->kw_page_replacement_counts[ $kwRow['kw'] ];
				} else {
					$this->kw_page_replacement_counts[ $kwRow['kw'] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kwRow['url'] ] ) ) {
					++ $this->url_page_replacement_counts[ $kwRow['url'] ];
				} else {
					$this->url_page_replacement_counts[ $kwRow['url'] ] = 1;
				}
				if ( isset( $this->urlandkw_page_replacement_counts[ $kw_id ] ) ) {
					++ $this->urlandkw_page_replacement_counts[ $kw_id ];
				} else {
					$this->urlandkw_page_replacement_counts[ $kw_id ] = 1;
				}

				// if we reached maximum number of replacements with this kw, skip next processing
				if ( $this->kw_page_replacement_counts[ $kwRow['kw'] ] > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );

					return;
				}

				// if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow['url'] ] > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, false, $kwRow['url'] );

					return;
				}

				if ( $this->urlandkw_page_replacement_counts[ $kw_id ] > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ) ) {
					unset( $keywords[ $kw_id ] );

					return;
				}

				// add text before keyword
				if ( $pos > 0 ) {
					$domTextStart = $document->createTextNode( substr( $node->nodeValue, 0, $pos ) ); // phpcs:ignore
					$node->parentNode->insertBefore( $domTextStart, $node );
				} else {
					$domTextStart = null;
				}

				// add keyword as link
				try {
					$urlObj                                                               = new Urlslab_Url( $kwRow['url'] );
					$this->page_keywords[ $kwRow['kw'] ]['urls'][ $urlObj->get_url_id() ] = array(
						'obj' => $urlObj,
						't'   => self::KW_LINK_TYPE_URLSLAB,
					);
					$this->page_keywords[ $kwRow['kw'] ]['kw_id']                         = $kw_id;

					$linkDom = $document->createElement( 'a', htmlspecialchars( substr( $node->nodeValue, $pos, strlen( $kwRow['kw'] ) ) ) );
					$linkDom->setAttribute( 'href', Urlslab_Url::add_current_page_protocol( $urlObj->get_url() ) );

					// if relative url or url from same domain, don't add target attribute
					if ( ! $urlObj->is_wp_domain() ) {
						$linkDom->setAttribute( 'target', '_blank' );
					}

					$node->parentNode->insertBefore( $linkDom, $node );

					// add text after keyword
					if ( $pos + strlen( $kwRow['kw'] ) < strlen( $node->nodeValue ) ) {
						$domTextEnd = $document->createTextNode( substr( $node->nodeValue, $pos + strlen( $kwRow['kw'] ) ) );
						$node->parentNode->insertBefore( $domTextEnd, $node );
					} else {
						$domTextEnd = null;
					}
					unset( $keywords[ $kw_id ] );

					// process other keywords in text
					if ( is_object( $domTextStart ) ) {
						$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords, 0, $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ), 0, $max_paragraph_density_links );
					}
					if ( is_object( $domTextEnd ) ) {
						$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords, $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ), 0, 0, $max_paragraph_density_links );
					}

					// remove processed node
					$this->remove_nodes[] = $node;
				} catch ( Exception $e ) {
				}

				return;
			} else {
				$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );
			}
			unset( $keywords[ $kw_id ] );
		}
	}

	/**
	 * @param bool|string $kw if false, remove all entries with given url
	 * @param bool|string $url if false, remove all entries with given keyword
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

	private function get_keywords( $inputText ) {
		$keywords = array();
		$len      = strlen( trim( $inputText ) );
		if ( $len > 1 ) {
			foreach ( $this->keywords_cache as $kw_id => $row ) {
				if (
					( ! isset( $this->kw_page_replacement_counts[ $row['kw'] ] ) || $this->kw_page_replacement_counts[ $row['kw'] ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ) )
					&& ( ! isset( $this->url_page_replacement_counts[ $row['url'] ] ) || $this->url_page_replacement_counts[ $row['url'] ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ) )
					&& ( ! isset( $this->urlandkw_page_replacement_counts[ $kw_id ] ) || $this->urlandkw_page_replacement_counts[ $kw_id ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ) )
				) {
					if ( false !== strpos( $inputText, $row['kw'] ) ) {
						$keywords[ $kw_id ] = $row;
					}
				} else {
					unset( $this->keywords_cache[ $kw_id ] );
				}
			}
		}

		return $keywords;
	}

	private function logUsedKeywords() {
		if ( is_user_logged_in() || is_search() || ! $this->get_option( self::SETTING_NAME_KW_MAP ) || Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
			return;
		}

		$srcUrlId = Urlslab_Url::get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT kw_id, dest_url_id, link_type FROM ' . URLSLAB_KEYWORDS_MAP_TABLE . ' WHERE url_id = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$db_map = array();
		array_walk(
			$results,
			static function( $value, $key ) use ( &$db_map ) {
				$db_map[ $value['kw_id'] . '|' . $value['dest_url_id'] ] = $value['link_type'];
			}
		);

		$insert_values      = array();
		$insert_placeholder = array();
		$missing_keywords   = array();
		foreach ( $this->page_keywords as $keyword => $kw_arr ) {
			if ( isset( $kw_arr['kw_id'] ) ) {
				foreach ( $kw_arr['urls'] as $url_id => $arrU ) {
					try {
						$key = $kw_arr['kw_id'] . '|' . $url_id;
						if ( ! isset( $db_map[ $key ] ) || $db_map[ $key ] != $arrU['t'] ) {
							array_push(
								$insert_values,
								$kw_arr['kw_id'],
								$srcUrlId,
								$url_id,
								$arrU['t']
							);
							$insert_placeholder[] = '(%d,%d,%d,%s)';
						} else {
							unset( $db_map[ $key ] );
						}
					} catch ( Exception $e ) {
					}
				}
			} else {
				$missing_keywords[ $keyword ] = $kw_arr['urls'];
			}
		}

		$table = URLSLAB_KEYWORDS_MAP_TABLE;

		if ( ! empty( $insert_values ) ) {
			$placeholder_string  = implode( ',', $insert_placeholder );
			$insert_update_query = "INSERT INTO {$table} (kw_id, url_id, dest_url_id, link_type) VALUES {$placeholder_string} ON DUPLICATE KEY UPDATE link_type = VALUES(link_type)";
			$wpdb->query(
				$wpdb->prepare(
					$insert_update_query, // phpcs:ignore
					$insert_values
				)
			);
		}

		if ( ! empty( $db_map ) ) {
			$delete_where  = array();
			$delete_values = array( $srcUrlId );
			foreach ( $db_map as $key => $type ) {
				$k              = explode( '|', $key );
				$delete_where[] = '(kw_id=%d AND dest_url_id=%d)';
				array_push(
					$delete_values,
					$k[0],
					$k[1]
				);
			}
			if ( ! empty( $delete_where ) ) {
				$where_string = implode( 'OR', $delete_where );
				$delete_query = "DELETE FROM {$table} WHERE url_id=%d AND ({$where_string})";
				$wpdb->query( $wpdb->prepare( $delete_query, $delete_values ) ); // phpcs:ignore
			}
		}

		if ( ! empty( $missing_keywords ) ) {
			if ( $this->get_option( self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS ) || $this->get_option( self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS ) ) {
				$schedule_urls = array();
				$new_keywords  = array();
				$lang          = $this->get_current_language_code();
				foreach ( $missing_keywords as $missing_kw => $urls ) {
					if ( strlen( $missing_kw ) < $this->get_option( self::SETTING_NAME_KW_IMPORT_MAX_LENGTH ) ) {
						foreach ( $urls as $url_id => $arrU ) {
							try {
								if (
									$arrU['obj']->is_url_valid() && ! $arrU['obj']->is_blacklisted()
									&& (
										( $arrU['obj']->is_wp_domain() && $this->get_option( self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS ) )
										|| ( ( ! $arrU['obj']->is_wp_domain() ) && $this->get_option( self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS ) )
									)
								) {
									$schedule_urls[ $url_id ] = $arrU['obj'];
									if ( is_string( $missing_kw ) && strlen( $missing_kw ) ) {
										$new_keywords[] = new Urlslab_Data_Keyword(
											array(
												'keyword'     => trim( $missing_kw ),
												'urlLink'     => $arrU['obj']->get_url_with_protocol(),
												'lang'        => $lang,
												'kw_priority' => 100,
												'urlFilter'   => '.*',
												'kwType'      => self::KW_TYPE_IMPORTED_FROM_CONTENT,
											),
											false
										);
									}
								}
							} catch ( Exception $e ) {
							}
						}
					}
				}

				if ( ! empty( $schedule_urls ) ) {
					$url_row_obj = new Urlslab_Data_Url();
					$url_row_obj->insert_urls( $schedule_urls );
				}
				if ( ! empty( $new_keywords ) ) {
					$kw_obj = new Urlslab_Data_Keyword();
					$kw_obj->insert_all( $new_keywords, true );
				}
			}
		}
	}

	public function register_routes() {
		( new Urlslab_Api_Keywords() )->register_routes();
		( new Urlslab_Api_Backlinks() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'SEO&Content' => __( 'SEO & Content', 'urlslab' ) );
	}
}
