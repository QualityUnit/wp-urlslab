<?php

// phpcs:disable WordPress.NamingConventions
class Urlslab_Keywords_Links extends Urlslab_Widget {


	//Type - map
	const KW_LINK_EDITOR = 'E';    //link added by editor in original content
	const KW_LINK_URLSLAB = 'U';    //link added by urlslab

	//type - KW
	const KW_MANUAL = 'M';        //manually created keyword (default)
	const KW_IMPORTED_FROM_CONTENT = 'I';        //keywords imported from content
	const KW_NONE = 'X';        //in this case none link will be created in content

	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;

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
	private array $page_keywords = array();

	private array $keywords_cache = array();

	//address all specific keywords
	private array $keywords_cache_ids = array();
	//address all urls
	private array $urls_cache_ids = array();

	private array $remove_nodes = array();


	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD = 'urlslab_max_replacements_for_each_keyword';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL = 'urlslab_max_replacements_per_keyword_url';

	public const SETTING_NAME_MAX_REPLACEMENTS_PER_URL = 'urlslab_max_replacements_per_url';
	//if page contains more links than this limit, don't try to add next links to page
	public const SETTING_NAME_MAX_LINKS_ON_PAGE = 'urlslab_max_link_on_page';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE = 'urlslab_max_replacements_per_page';
	public const SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH = 'urlslab_max_replacements_per_paragraph';
	public const SETTING_NAME_MIN_CHARS_TO_NEXT_LINK = 'urlslab_min_ch_around_lnk';
	//minimum paragraph length defines minimum size of text length, where can be placed the link
	//in too short texts we will not try to include links
	public const SETTING_NAME_MIN_PARAGRAPH_LENGTH = 'urlslab_min_prgr_len';
	public const SETTING_NAME_MAX_PARAGRAPH_DENSITY = 'urlslab_max_prgr_density';
	public const SETTING_NAME_KW_MAP = 'urlslab_kw_map';
	//IMPORT KEYWORDS
	public const SETTING_NAME_KW_IMPORT_INTERNAL_LINKS = 'urlslab_kw_imp_int';
	public const SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS = 'urlslab_kw_imp_ext';
	public const SETTING_NAME_ADD_ID_TO_ALL_H_TAGS = 'urlslab_H_add_id';
	public const SETTING_NAME_KW_IMPORT_MAX_LENGTH = 'urlslab_kw_max_len';
	public const SETTING_NAME_KW_TYPES_TO_USE = 'urlslab_kw_types_use';

	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
		$this->widget_slug              = 'urlslab-keywords-links';
		$this->widget_title             = 'Keywords Links';
		$this->widget_description       = 'Build automatic links from your keywords that appear in website content';
		$this->landing_page_link        = 'https://www.urlslab.com';
		$this->parent_page              = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
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
		if (
			$this->cnt_paragraph_link_replacements >= $max_paragraph_density_links ||
			$this->cnt_page_links > $this->get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE ) ||
			$this->cnt_page_link_replacements > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE ) ||
			$this->cnt_paragraph_link_replacements > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH )
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
				if ( $this->kw_page_replacement_counts[ $kwRow['kw'] ] > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow['kw'], false );

					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow['url'] ] > $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ) ) {
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
				try {
					$urlObj                                                               = new Urlslab_Url( $kwRow['url'] );
					$this->page_keywords[ $kwRow['kw'] ]['urls'][ $urlObj->get_url_id() ] = array(
						'obj' => $urlObj,
						't'   => self::KW_LINK_URLSLAB,
					);
					$this->page_keywords[ $kwRow['kw'] ]['kw_id']                         = $kw_id;

					$linkDom = $document->createElement( 'a', htmlspecialchars( substr( $node->nodeValue, $pos, strlen( $kwRow['kw'] ) ) ) );
					$linkDom->setAttribute( 'href', urlslab_add_current_page_protocol( $urlObj->get_url() ) );

					if ( is_user_logged_in() ) {
						$linkDom->setAttribute( 'urlslab-link', $urlObj->get_url_id() );
					}
					//if relative url or url from same domain, don't add target attribute
					if ( ! $urlObj->is_same_domain_url() ) {
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
						$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords, 0, $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ), 0, $max_paragraph_density_links );
					}
					if ( is_object( $domTextEnd ) ) {
						$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords, $this->get_option( self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK ), 0, 0, $max_paragraph_density_links );
					}

					//remove processed node
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
		$lang          = urlslab_get_language();

		$results = array();
		if ( self::KW_NONE != $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE ) ) {
			$results = wp_cache_get( 'kws_' . $lang, 'urlslab', false, $found );
			if ( false === $results || ! $found ) {

				$sql_data = array();

				$where_type = '';
				if ( '' != $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE ) ) {
					$where_type = ' kwType=%s AND ';
					$sql_data[] = $this->get_option( self::SETTING_NAME_KW_TYPES_TO_USE );
				}

				$sql_data[] = urlslab_get_language();

				$results = $wpdb->get_results( $wpdb->prepare( 'SELECT kw_id, keyword, urlLink, urlFilter FROM ' . $keyword_table . ' WHERE ' . $where_type . "(lang = %s OR lang = 'all') ORDER BY kw_priority ASC, kw_length DESC", $sql_data ), 'ARRAY_A' ); // phpcs:ignore
				wp_cache_set( 'kws_' . $lang, $results, 'urlslab', 120 );
			}
		}
		$this->keywords_cache = array();
		$currentUrl           = urlslab_add_current_page_protocol( $this->get_current_page_url()->get_url() );

		foreach ( $results as $row ) {
			if ( isset( $this->page_keywords[ $row['keyword'] ] ) ) {
				$this->page_keywords[ $row['keyword'] ]['kw_id'] = $row['kw_id'];
			}
			if (
				( '.*' === $row['urlFilter'] || '' === $row['urlFilter'] || preg_match( '/' . str_replace( '/', '\\/', $row['urlFilter'] ) . '/', $currentUrl ) ) &&
				strpos( $input_text, strtolower( $row['keyword'] ) ) !== false
			) {
				try {
					$kwUrl = new Urlslab_Url( $row['urlLink'] );
					if ( $this->get_current_page_url()->get_url_id() != $kwUrl->get_url_id() ) {
						$this->keywords_cache[ $row['kw_id'] ] = array(
							'kw'  => strtolower( $row['keyword'] ),
							'url' => $row['urlLink'],
						);
						//addressing cache
						$this->keywords_cache_ids[ strtolower( $row['keyword'] ) ][] = $row['kw_id'];
						$this->urls_cache_ids[ $row['urlLink'] ][]                   = $row['kw_id'];
					}
				} catch ( Exception $e ) {

				}
			}
		}
	}

	private function get_keywords( $inputText ) {
		$keywords = array();
		$len      = strlen( trim( $inputText ) );
		if ( $len > 1 ) {
			foreach ( $this->keywords_cache as $kw_id => $row ) {
				if (
					( ! isset( $this->kw_page_replacement_counts[ $row['kw'] ] ) || $this->kw_page_replacement_counts[ $row['kw'] ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD ) ) &&
					( ! isset( $this->url_page_replacement_counts[ $row['url'] ] ) || $this->url_page_replacement_counts[ $row['url'] ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL ) ) &&
					( ! isset( $this->urlandkw_page_replacement_counts[ $kw_id ] ) || $this->urlandkw_page_replacement_counts[ $kw_id ] < $this->get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL ) )
				) {
					if ( strpos( $inputText, $row['kw'] ) !== false ) {
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
		//skip processing if HTML tag contains attribute "urlslab-skip-all" or "urlslab-skip-keywords"
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
		$this->addIdToHTags( $document );
		$this->initLinkCounts( $document );
		$this->init_keywords_cache( strtolower( $document->textContent ) );
		try {
			if ( count( $this->keywords_cache ) > 0 ) {
				if ( $this->cnt_page_links < $this->get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE ) ) {
					$this->findTextDOMElements( $document, $document );
				}
			}
			$this->logUsedKeywords();
		} catch ( Exception $e ) {
		}
	}

	private function logUsedKeywords() {
		if ( ! $this->get_option( self::SETTING_NAME_KW_MAP ) ) {
			return;
		}

		$srcUrlId = $this->get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT kw_id, destUrlMd5, linkType FROM ' . URLSLAB_KEYWORDS_MAP_TABLE . ' WHERE urlMd5 = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$db_map = array();
		array_walk(
			$results,
			function( $value, $key ) use ( &$db_map ) {
				$db_map[ $value['kw_id'] . '|' . $value['destUrlMd5'] ] = $value['linkType'];
			}
		);

		$insert_values      = array();
		$insert_placeholder = array();
		$missing_keywords   = array();
		foreach ( $this->page_keywords as $keyword => $kw_arr ) {
			if ( isset( $kw_arr['kw_id'] ) ) {
				foreach ( $kw_arr['urls'] as $urlId => $arrU ) {
					try {
						$key = $kw_arr['kw_id'] . '|' . $urlId;
						if ( ! isset( $db_map[ $key ] ) || $db_map[ $key ] != $arrU['t'] ) {
							array_push(
								$insert_values,
								$kw_arr['kw_id'],
								$srcUrlId,
								$urlId,
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
			$insert_update_query = "INSERT INTO $table (kw_id, urlMd5, destUrlMd5, linkType) VALUES $placeholder_string ON DUPLICATE KEY UPDATE linkType = VALUES(linkType)";
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
				$delete_where[] = '(kw_id=%d AND destUrlMd5=%d)';
				array_push(
					$delete_values,
					$k[0],
					$k[1]
				);
			}
			if ( ! empty( $delete_where ) ) {
				$where_string = implode( 'OR', $delete_where );
				$delete_query = "DELETE FROM $table WHERE urlMd5=%d AND ($where_string)";
				$wpdb->query( $wpdb->prepare( $delete_query, $delete_values ) ); // phpcs:ignore
			}
		}

		if ( ! empty( $missing_keywords ) ) {
			if ( $this->get_option( self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS ) || $this->get_option( self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS ) ) {
				$schedule_urls = array();
				$new_keywords  = array();
				foreach ( $missing_keywords as $missing_kw => $urls ) {
					if ( strlen( $missing_kw ) < $this->get_option( self::SETTING_NAME_KW_IMPORT_MAX_LENGTH ) ) {
						foreach ( $urls as $urlId => $arrU ) {
							try {
								if (
									( $arrU['obj']->is_same_domain_url() && $this->get_option( self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS ) ) ||
									( ( ! $arrU['obj']->is_same_domain_url() ) && $this->get_option( self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS ) )
								) {
									$schedule_urls[ $urlId ] = $arrU['obj'];
									$new_keywords[]          = new Urlslab_Url_Keyword_Data(
										array(
											'keyword'     => $missing_kw,
											'urlLink'     => urlslab_add_current_page_protocol( $arrU['obj']->get_url() ),
											'lang'        => urlslab_get_language(),
											'kw_priority' => 100,
											'urlFilter'   => '.*',
											'kwType'      => self::KW_IMPORTED_FROM_CONTENT,
										)
									);
								}
							} catch ( Exception $e ) {
							}
						}
					}
				}

				if ( ! empty( $schedule_urls ) ) {
					$this->urlslab_url_data_fetcher->prepare_url_batch_for_scheduling( $schedule_urls );
				}
				if ( ! empty( $new_keywords ) ) {
					Urlslab_Url_Keyword_Data::create_keywords( $new_keywords );
				}
			}
		}
	}

	private function addIdToHTags( DOMDocument $document ) {
		if ( $this->get_option( self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS ) ) {
			$used_ids = array();
			$xpath    = new DOMXPath( $document );
			$headers  = $xpath->query( "//*[substring-after(name(), 'h') > 0 and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-keywords')])]" );
			foreach ( $headers as $header_element ) {
				if ( ! $header_element->hasAttribute( 'id' ) ) {
					$id = strtolower( trim( $header_element->nodeValue ) );
					$id = 'h-' . trim( preg_replace( '/[^\w]+/', '-', $id ), '-' );
					if ( ! isset( $used_ids[ $id ] ) ) {
						$header_element->setAttribute( 'id', $id );
					}
				}
				$used_ids[ $header_element->getAttribute( 'id' ) ] = 1;
			}
		}
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
		$table_data                             = $xpath->query( "//a[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-keywords')])]|//*[substring-after(name(), 'h') > 0 and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-keywords')])]" );
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
										$urlObj->is_url_valid() &&
										$this->get_current_page_url()->get_url_id() != $urlObj->get_url_id()
									) {
										$this->page_keywords[ $link_text ]['urls'][ $urlObj->get_url_id() ] = array(
											'obj' => $urlObj,
											't'   => self::KW_LINK_EDITOR,
										);
									}
								} catch ( Exception $e ) {
								}
							}
							if ( ! $hadHAlready ) {
								$hasLinksBeforeH1 = true;
							}
							$this->cnt_page_links ++;
							$cnt ++;
						}
					} catch ( Exception $e ) {
					}
				}
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

	public
	function get_shortcode_content(
		$atts = array(), $content = null, $tag = ''
	): string {
		return '';
	}

	public
	function has_shortcode(): bool {
		return false;
	}

	public
	function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public
	function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/link-enhancer-demo.png' ) . 'link-enhancer-demo.png';
	}

	public
	function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public
	function get_widget_tab(): string {
		return 'keyword-linking';
	}

	private function get_link_element_text( $dom ): string {
		if ( ! empty( $dom->childNodes ) ) {
			foreach ( $dom->childNodes as $node ) {
				if ( ! $this->is_skip_elemenet( $node, 'keywords' ) ) {
					if ( $node instanceof DOMText ) {
						if ( strlen( trim( $node->nodeValue ) ) > 1 ) {
							return strtolower( trim( $node->nodeValue ) );
						}
					}
				}
			}
		}

		return '';
	}

	protected function init_options() {
		$this->add_option_definition(
			self::SETTING_NAME_KW_TYPES_TO_USE,
			'',
			true,
			__( 'Create links from keywords' ),
			__( 'Specify types of keywords used to create a link.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				''                                               => __( 'Use all keyword types' ),
				Urlslab_Keywords_Links::KW_MANUAL                => __( 'Use just manually created keywords' ),
				Urlslab_Keywords_Links::KW_IMPORTED_FROM_CONTENT => __( 'Use just keywords importent from existing links in content' ),
				Urlslab_Keywords_Links::KW_NONE                  => __( 'Switched OFF - no replacements' ),
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
			2,
			true,
			__( 'Max Replacement Per Keyword' ),
			__( 'Maximum number of times, that each keyword should be replaced in a page' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);


		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL,
			1,
			true,
			__( 'Max Replacement Per Keyword-Url pair' ),
			__( 'Maximum number of times, that each keyword-url pair should be replaced in a page' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
			2,
			true,
			__( 'Max Replacement Per Url' ),
			__( 'Maximum number of times, that a keyword link should be generated for a single outbound url' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_LINKS_ON_PAGE,
			100,
			true,
			__( 'Max Links in page (manual and auto links)' ),
			__( 'the maximum number of links that exists in a page for both auto and manual links' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
			30,
			true,
			__( 'Max Auto links in page' ),
			__( 'the maximum number of links to be generated in whole page' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
			2,
			true,
			__( 'Max auto links per paragraph' ),
			__( 'The maximum number of links to be created in paragraph' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MIN_CHARS_TO_NEXT_LINK,
			20,
			true,
			__( 'Min # chars to next link' ),
			__( 'Minimum number of characters between next inserted link' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_MIN_PARAGRAPH_LENGTH,
			30,
			true,
			__( 'Min paragraph length [# of characters]' ),
			__( 'Skip searching for keywords in paragraph shorter as defined limit' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_MAX_PARAGRAPH_DENSITY,
			100,
			true,
			__( 'Paragraph density [min # of characters per link]' ),
			__( 'Maximum paragraph density defines maximum number of links per character can be included in paragraph. Example: By defining value 100 will be included maximum 5 links in 500 characters long paragraph.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_KW_MAP,
			true,
			true,
			__( 'Track used Keywords' ),
			__( 'Track usage of inserted keywords/links on pages' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_INTERNAL_LINKS,
			false,
			true,
			__( 'Import internal links as keywords' ),
			__( 'Import all internal links found in page as keywords' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_EXTERNAL_LINKS,
			false,
			true,
			__( 'Import external links as keywords' ),
			__( 'Import all external links found in page as keywords' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_KW_IMPORT_MAX_LENGTH,
			100,
			true,
			__( 'Max length of auto-imported keyword [# of characters]' ),
			__( 'Import from HTML pages just keywords with maximum length defined by this setting. It is way how to avoid import of too long links, which have low chance to appear on any other place.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS,
			false,
			true,
			__( 'Add anchor id to all H tags' ),
			__( 'Enhance all H tags with ID attribute to allow addressing not just URL, but also specific part of the content starting with H tag.' )
		);
	}
}
