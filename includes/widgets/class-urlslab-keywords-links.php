<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-keyword-data.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/partials/tables/class-urlslab-keyword-link-table.php';

class Urlslab_Keywords_Links extends Urlslab_Widget {


	private string $widget_slug = 'urlslab-keywords-links';

	private string $widget_title = 'Keywords Links';

	private string $widget_description = 'Urlslab Keywords to Links - automatic linkbuilding from specific keywords';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Keyword_Link_Table $keyword_table;

	private int $cnt_page_link_replacements = 0;
	private int $cnt_page_links = 0;
	private int $cnt_paragraph_link_replacements = 0;
	private array $link_counts = array();
	private array $kw_page_replacement_counts = array();
	private array $url_page_replacement_counts = array();
	private array $urlandkw_page_replacement_counts = array();

	private array $keywords_cache = array();

	const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD = 'urlslab_max_repl_kw';
	const MAX_REPLACEMENTS_PER_KEYWORD_DEFAULT = 2;

	const SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL = 'urlslab_max_repl_kwurl';
	const MAX_REPLACEMENTS_PER_KEYWORDURL_DEFAULT = 1;


	const SETTING_NAME_MAX_REPLACEMENTS_PER_URL = 'urlslab_max_repl_url';
	const MAX_REPLACEMENTS_PER_URL_DEFAULT = 2;

	//if page contains more links than this limit, don't try to add next links to page
	const SETTING_NAME_MAX_LINKS_ON_PAGE = 'urlslab_max_links_page';
	const MAX_LINKS_ON_PAGE_DEFAULT = 100;

	const SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE = 'urlslab_max_repl_page';
	const MAX_REPLACEMENTS_PER_PAGE_DEFAULT = 30;

	const SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH = 'urlslab_max_repl_paragraph';
	const MAX_REPLACEMENTS_PER_PARAGRAPH_DEFAULT = 2;

	public function init_widget( Urlslab_Loader $loader ) {
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

	public function load_widget_page() {
		?>
		<div class="wrap">
			<h2>Keywords</h2>
			<?php
			if ( isset( $_REQUEST[ 'status' ] ) ) {
				$message = $_REQUEST[ 'message' ] ?? '';
				$status = $_REQUEST[ 'status' ] ?? '';
				$this->admin_notice( $status, $message );
			}
			$this->user_overall_option();
			?>
			<div>
				<form method="get" class="float-left">
					<?php
					$this->keyword_table->prepare_items();
					?>
					<input type="hidden" name="page" value="<?php echo esc_attr( $this->widget_slug ); ?>">
					<?php
					$this->keyword_table->search_box( 'Search', 'urlslab-keyword-input' );
					$this->keyword_table->display();
					?>
				</form>
			</div>

		</div>
		<?php
	}

	private function admin_notice( string $status, string $message = '' ) {
		if ( 'success' === $status ) {
			echo sprintf( '<div class="notice notice-success"><p>%s</p></div>', esc_html( $message ), );
		}

		if ( 'failure' === $status ) {
			echo sprintf( '<div class="notice notice-error"><p><strong>%1$s</strong>: %2$s</p></div>', esc_html( 'Error' ), esc_html( $message ) );
		}
	}


	public function widget_admin_load() {
		if ( isset( $_SERVER[ 'REQUEST_METHOD' ] ) and 'POST' === $_SERVER[ 'REQUEST_METHOD' ] and isset( $_REQUEST[ 'action' ] ) and -1 != $_REQUEST[ 'action' ] and 'import' === $_REQUEST[ 'action' ] ) {
			// Import/Export option
			check_admin_referer( 'keyword-widget-import' );
			if ( isset( $_POST[ 'submit' ] ) ) {
				if ( 'Import' === $_POST[ 'submit' ] ) {
					//# Import the given csv
					if ( !empty( $_FILES[ 'csv_file' ] ) and $_FILES[ 'csv_file' ][ 'size' ] > 0 ) {
						$res = $this->import_csv( $_FILES[ 'csv_file' ][ 'tmp_name' ] );
						if ( $res ) {
							$redirect_to = $this->admin_widget_menu_page( array( 'status' => 'success', 'message' => 'Insert Succeeded' ) );
						} else {
							$redirect_to = $this->admin_widget_menu_page( array( 'status' => 'failure', 'message' => 'Failure in parsing CSV' ) );
						}
					} else {
						$redirect_to = $this->admin_widget_menu_page( array( 'status' => 'failure', 'message' => 'Empty CSV File provided' ) );
					}
				} else {
					$redirect_to = $this->admin_widget_menu_page( array( 'status' => 'failure', 'message' => 'Wrong Action' ) );
				}
			} else {
				$redirect_to = $this->admin_widget_menu_page( array( 'status' => 'failure', 'message' => 'Not a valid request' ) );
			}

			wp_safe_redirect( $redirect_to );
			exit();
		} else if ( isset( $_SERVER[ 'REQUEST_METHOD' ] ) and 'GET' === $_SERVER[ 'REQUEST_METHOD' ] and isset( $_REQUEST[ 'action' ] ) and -1 != $_REQUEST[ 'action' ] and 'export' == $_REQUEST[ 'action' ] ) {
			header( 'Content-Type: text/csv; charset=utf-8' );
			header( 'Content-Disposition: attachment; filename=keywords.csv' );
			$output = fopen( 'php://output', 'w' );
			fputcsv( $output, array( 'Keyword', 'URL', 'Priority', 'Lang', 'Filter' ) );
			global $wpdb;
			$table = URLSLAB_KEYWORDS_TABLE;

			$query = "SELECT keyword, urlLink, kw_priority, lang, urlFilter FROM $table ORDER BY keyword, lang, urlFilter, kw_priority  ASC, kw_length DESC";
			$result = $wpdb->get_results( $query, ARRAY_N );
			foreach ( $result as $row ) {
				fputcsv( $output, $row );
			}
			fclose( $output );
			die();
		} else if ( isset( $_SERVER[ 'REQUEST_METHOD' ] ) and 'GET' == $_SERVER[ 'REQUEST_METHOD' ] and isset( $_REQUEST[ 'action' ] ) and -1 != $_REQUEST[ 'action' ] and 'clear' == $_REQUEST[ 'action' ] ) {
			global $wpdb;
			$table = URLSLAB_KEYWORDS_TABLE;

			$query = "TRUNCATE $table";
			$wpdb->query( $query ); // phpcs:ignore
			wp_safe_redirect( $this->admin_widget_menu_page( array( 'status' => 'success', 'message' => 'All Data deleted' ) ) );
			exit();

		} else if ( isset( $_SERVER[ 'REQUEST_METHOD' ] ) and 'GET' == $_SERVER[ 'REQUEST_METHOD' ] and isset( $_REQUEST[ 'action' ] ) and -1 != $_REQUEST[ 'action' ] and 'generate_sample_data' == $_REQUEST[ 'action' ] ) {

			$this->init_sample_data();

			wp_safe_redirect( $this->admin_widget_menu_page( array( 'status' => 'success', 'message' => 'Sample keywords created' ) ) );
			exit();

		} else {
			$option = 'per_page';
			$args = array( 'label' => 'Keywords', 'default' => 50, 'option' => 'users_per_page', );

			add_screen_option( $option, $args );

			$this->keyword_table = new Urlslab_Keyword_Link_Table();
		}
	}

	private function user_overall_option() {
		?>
		<div class="card float-left mar-bottom-2">
			<h2>Import Keyword CSV</h2>
			<div class="info-box">
				The CSV file should contain headers. the CSV file should include following headers:
				<ul>
					<li class="color-danger">Keyword (required)</li>
					<li class="color-danger">URL (required)</li>
					<li class="color-warning">priority (optional - defaults to 10)</li>
					<li class="color-warning">lang (optional - defaults to 'all')</li>
					<li class="color-warning">filter (optional - defaults to regular expression '.*')</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->admin_widget_menu_page( 'action=import' ) ); ?>" method="post"
				  enctype="multipart/form-data">
				<?php wp_nonce_field( 'keyword-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button import_keyword_csv" value="Import">
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=export' ) ); ?>" target="_blank"
				   class="button export_keyword_csv">Export</a>
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=clear' ) ); ?>"
				   class="button export_keyword_csv">Delete all</a>
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=generate_sample_data' ) ); ?>"
				   class="button export_keyword_csv">Generate Sample Data</a>
			</form>
		</div>
		<?php
	}

	private function import_csv( $file ): bool {
		//# Reading/Parsing CSV File
		$row = 0;
		$handle = fopen( $file, 'r' );
		if ( false !== ( $handle ) ) {
			while ( ( $data = fgetcsv( $handle ) ) !== false ) {
				$row++;
				//# processing CSV Header
				if ( $row == 1 ) {
					continue;
				}
				if ( !isset( $data[ 0 ] ) || strlen( $data[ 0 ] ) == 0 || !isset( $data[ 1 ] ) || strlen( $data[ 1 ] ) == 0 ) {
					continue;
				}
				//Keyword, URL, Priority, Lang, Filter
				$dataRow = new Urlslab_Url_Keyword_Data( $data[ 0 ], isset( $data[ 2 ] ) && is_numeric( $data[ 2 ] ) ? (int) $data[ 2 ] : 10, strlen( $data[ 0 ] ), isset( $data[ 3 ] ) && strlen( $data[ 3 ] ) > 0 ? $data[ 3 ] : 'all', $data[ 1 ], isset( $data[ 4 ] ) ? $data[ 4 ] : '.*' );

				$this->createRow( $dataRow );
			}
			fclose( $handle );
		}
		return true;
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

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords ) {
		if ( $this->cnt_page_links > get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::MAX_LINKS_ON_PAGE_DEFAULT ) || $this->cnt_page_link_replacements > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE, self::MAX_REPLACEMENTS_PER_PAGE_DEFAULT ) || $this->cnt_paragraph_link_replacements > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH, self::MAX_REPLACEMENTS_PER_PARAGRAPH_DEFAULT ) ) {
			return;
		}

		if ( 0 == strlen( trim( $node->nodeValue ) ) ) {
			return; //empty node
		}

		foreach ( $keywords as $kw_md5 => $kwRow ) {
			if ( preg_match( '/\b(' . preg_quote( strtolower( $kwRow[ 'kw' ] ), '/' ) . ')\b/', strtolower( $node->nodeValue ), $matches, PREG_OFFSET_CAPTURE ) ) {
				$pos = $matches[ 1 ][ 1 ];
				$this->cnt_page_links++;
				$this->cnt_page_link_replacements++;
				$this->cnt_paragraph_link_replacements++;
				if ( isset( $this->kw_page_replacement_counts[ $kwRow[ 'kw' ] ] ) ) {
					$this->kw_page_replacement_counts[ $kwRow[ 'kw' ] ]++;
				} else {
					$this->kw_page_replacement_counts[ $kwRow[ 'kw' ] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kwRow[ 'url' ] ] ) ) {
					$this->url_page_replacement_counts[ $kwRow[ 'url' ] ]++;
				} else {
					$this->url_page_replacement_counts[ $kwRow[ 'url' ] ] = 1;
				}
				if ( isset( $this->url_page_replacement_counts[ $kw_md5 ] ) ) {
					$this->urlandkw_page_replacement_counts[ $kw_md5 ]++;
				} else {
					$this->urlandkw_page_replacement_counts[ $kw_md5 ] = 1;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ( $this->kw_page_replacement_counts[ $kwRow[ 'kw' ] ] > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_REPLACEMENTS_PER_KEYWORD_DEFAULT ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, $kwRow[ 'kw' ], false );
					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ( $this->url_page_replacement_counts[ $kwRow[ 'url' ] ] > get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_REPLACEMENTS_PER_URL_DEFAULT ) ) {
					$keywords = $this->removeKeywordUrl( $keywords, false, $kwRow[ 'url' ] );
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
				$linkDom = $document->createElement( 'a', substr( $node->nodeValue, $pos, strlen( $kwRow[ 'kw' ] ) ) );
				$linkDom->setAttribute( 'href', $kwRow[ 'url' ] );

				//if relative url or url from same domain, don't add target attribute
				if ( !urlslab_is_same_domain_url( $kwRow[ 'url' ] ) ) {
					$linkDom->setAttribute( 'target', '_blank' );
				}

				$node->parentNode->insertBefore( $linkDom, $node );

				//add text after keyword
				if ( $pos + strlen( $kwRow[ 'kw' ] ) < strlen( $node->nodeValue ) ) {
					$domTextEnd = $document->createTextNode( substr( $node->nodeValue, $pos + strlen( $kwRow[ 'kw' ] ) ) );
					$node->parentNode->insertBefore( $domTextEnd, $node );
				} else {
					$domTextEnd = null;
				}
				$keywords = $this->removeKeywordUrl( $keywords, $kwRow[ 'kw' ], $kwRow[ 'url' ] );

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

			$keywords = $this->removeKeywordUrl( $keywords, $kwRow[ 'kw' ], $kwRow[ 'url' ] );
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
		if ( $kw === false && $url === false ) {
			return $keywords;    //this should never happen
		}
		foreach ( $keywords as $kw_md5 => $row ) {
			if ( ( $kw === false || $row[ 'kw' ] == $kw ) && ( $url === false || $row[ 'url' ] == $url ) ) {
				unset( $keywords[ $kw_md5 ] );
			}
		}
		return $keywords;
	}

	private function get_keywords() {
		if ( empty( $this->keywords_cache ) ) {
			global $wpdb;

			$keyword_table = URLSLAB_KEYWORDS_TABLE;

			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT kwMd5, keyword, urlLink, urlFilter
				FROM ' . $keyword_table . // phpcs:ignore
					" WHERE (lang = %s OR lang = 'all') ORDER BY kw_priority ASC, kw_length DESC",
					urlslab_get_language()
				),
				'ARRAY_A'
			);

			$this->keywords_cache = array();
			$current_page = get_current_page_url();
			foreach ( $results as $row ) {
				$kwUrl = new Urlslab_Url( $row[ 'urlLink' ] );
				if ( $current_page->get_url_id() != $kwUrl->get_url_id() && preg_match( '/' . str_replace( '/', '\\/', $row[ 'urlFilter' ] ) . '/', $current_page->get_url() ) ) {
					$this->keywords_cache[ $row[ 'kwMd5' ] ] = array( 'kw' => $row[ 'keyword' ], 'url' => $row[ 'urlLink' ] );
				}
			}
		}

		$keywords = array();
		foreach ( $this->keywords_cache as $kw_md5 => $row ) {
			if ( ( !isset( $this->kw_page_replacement_counts[ $row[ 'kw' ] ] ) || $this->kw_page_replacement_counts[ $row[ 'kw' ] ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, self::MAX_REPLACEMENTS_PER_KEYWORD_DEFAULT ) ) && ( !isset( $this->url_page_replacement_counts[ $row[ 'url' ] ] ) || $this->url_page_replacement_counts[ $row[ 'url' ] ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, self::MAX_REPLACEMENTS_PER_URL_DEFAULT ) ) && ( !isset( $this->urlandkw_page_replacement_counts[ $kw_md5 ] ) || $this->urlandkw_page_replacement_counts[ $kw_md5 ] < get_option( self::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORDURL, self::MAX_REPLACEMENTS_PER_KEYWORDURL_DEFAULT ) ) ) {
				$keywords[ $kw_md5 ] = $row;
			}
		}

		return $keywords;
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document ) {
		//skip processing if HTML tag contains attribute "urlslab-skip"
		if ( $dom->hasAttributes() && $dom->hasAttribute( 'urlslab-skip' ) ) {
			return;
		}

		if ( !empty( $dom->childNodes ) ) {
			foreach ( $dom->childNodes as $node ) {

				if ( $node instanceof DOMText && strlen( trim( $node->nodeValue ) ) > 1 ) {
					$this->replaceKeywordWithLinks( $node, $document, $this->get_keywords() );
				} else {
					if ( count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
					}

					//skip processing some types of HTML elements
					if ( !in_array( strtolower( $node->nodeName ), array( 'a', 'button', 'input' ) ) && !preg_match( '/^[hH][0-9]$/', $node->nodeName ) ) {
						$this->findTextDOMElements( $node, $document );
					}
				}
			}
		}
	}

	public function theContentHook( $content ) {
		if ( !strlen( trim( $content ) ) ) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->encoding = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ) );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$this->initLinkCounts( $document );
			if ( $this->cnt_page_links > get_option( self::SETTING_NAME_MAX_LINKS_ON_PAGE, self::MAX_LINKS_ON_PAGE_DEFAULT ) ) {
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
			if ( $element->nodeName == 'a' ) {
				if ( !$hadHAlready ) {
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

	private function init_sample_data() {
		//in case installation is empty, use some static mappings
		$sample_data = array(
				'screenshot' => 'https://www.urlslab.com',
				'google' => 'https://www.google.com',
				'support' => 'https://www.liveagent.com/',
				'help desk' => 'https://www.liveagent.com/help-desk-software/',
				'helpdesk' => 'https://www.liveagent.com/help-desk-software/',
				'chat' => 'https://www.liveagent.com/live-chat-software/',
				'call' => 'https://www.liveagent.com/call-center-software/',
				'call center' => 'https://www.liveagent.com/call-center-software/',
				'affiliate' => 'https://www.postaffiliatepro.com/affiliate-marketing-glossary/affiliate/',
				'affiliate marketing' => 'https://www.postaffiliatepro.com/affiliate-marketing-software/' );

		//try to load all titles with less than 4 words
		$posts = get_posts(
			array(
				'numberposts' => 1000,
				'orderby'     => 'date',
				'order'       => 'DESC'
			)
		);

		foreach ( $posts as $post ) {
			if ( $post->post_status == 'publish' && substr_count( $post->post_title, ' ' ) < 3 ) {
				$sample_data[ strtolower( $post->post_title ) ] = get_permalink( $post->ID );
			}
		}

		foreach ( $sample_data as $kw => $url ) {
			$dataRow = new Urlslab_Url_Keyword_Data( $kw, 100, strlen( $kw ), 'all', $url, '.*' );
			$this->createRow( $dataRow );
		}
	}

	/**
	 * @param Urlslab_Url_Keyword_Data $dataRow
	 * @return int|bool
	 */
	private function createRow( Urlslab_Url_Keyword_Data $dataRow ) {
		global $wpdb;
		$update_query = 'INSERT INTO ' . URLSLAB_KEYWORDS_TABLE . ' (
                   kwMd5,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter) VALUES (%s, %s, %d, %d, %s, %s, %s)
                   ON DUPLICATE KEY UPDATE
                   kw_priority = VALUES(kw_priority),
                   kw_length = VALUES(kw_length),
                   lang = VALUES(lang),
                   urlLink = VALUES(urlLink),
                   urlFilter = VALUES(urlFilter)';

		return $wpdb->query(
			$wpdb->prepare( $update_query, // phpcs:ignore
				array(
					$dataRow->get_kw_md5(),
					$dataRow->get_keyword(),
					$dataRow->get_keyword_priority(),
					$dataRow->get_keyword_length(),
					$dataRow->get_keyword_url_lang(),
					$dataRow->get_keyword_url_link(),
					$dataRow->get_keyword_url_filter()
				)
			)
		);
	}

}
