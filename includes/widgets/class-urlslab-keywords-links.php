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
	private array $keyword_table_col_names;

	private int $cnt_page_link_replacements = 0;
	private int $cnt_page_links = 0;
	private int $cnt_paragraph_link_replacements = 0;
	private array $link_counts = array();
	private array $kw_page_replacement_counts = array();
	private array $url_page_replacement_counts = array();

	private array $keywords_cache = array();

	//TODO: use these constants as defaults,
	// real values should be loaded from settings defined by user
	const MAX_REPLACEMENTS_PER_KEYWORD = 1;
	const MAX_REPLACEMENTS_PER_URL = 2;

	//if page contains more links than this limit, don't try to add next links to page
	const MAX_LINKS_ON_PAGE = 100;
	const MAX_REPLACEMENTS_PER_PAGE = 30;
	const MAX_REPLACEMENTS_PER_PARAGRAPH = 2;

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
			if (isset( $_REQUEST['status'] )) {
				$message = $_REQUEST['message'] ?? '';
				$status = $_REQUEST['status'] ?? '';
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
		if ( 'success' == $status ) {
			echo sprintf(
				'<div class="notice notice-success"><p>%s</p></div>',
				esc_html( $message ),
			);
		}

		if ( 'failure' == $status ) {
			echo sprintf(
				'<div class="notice notice-error"><p><strong>%1$s</strong>: %2$s</p></div>',
				esc_html( 'Error' ),
				esc_html( $message )
			);
		}
	}


	public function widget_admin_load() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' == $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 -1 != $_REQUEST['action'] and
			 'import' == $_REQUEST['action']) {
			// Import/Export option
			check_admin_referer( 'keyword-widget-import' );
			if (isset( $_POST['submit'] )) {
				if ('Import' == $_POST['submit']) {
					//# Import the given csv
					if (!empty( $_FILES['csv_file'] ) and $_FILES['csv_file']['size'] > 0) {
						$res = $this->save_csv_to_db( $_FILES['csv_file']['tmp_name'] );
						if ($res) {
							$redirect_to = $this->admin_widget_menu_page(
								array(
									'status' => 'success',
									'message' => 'Insert Succeeded'
								)
							);
						} else {
							$redirect_to = $this->admin_widget_menu_page(
								array(
									'status' => 'failure',
									'message' => 'Failure in parsing CSV'
								)
							);
						}
					} else {
						$redirect_to = $this->admin_widget_menu_page(
							array(
								'status' => 'failure',
								'message' => 'Empty CSV File provided'
							)
						);
					}
				} else {
					$redirect_to = $this->admin_widget_menu_page(
						array(
							'status' => 'failure',
							'message' => 'Wrong Action'
						)
					);
				}
			} else {
				$redirect_to = $this->admin_widget_menu_page(
					array(
							'status' => 'failure',
							'message' => 'Not a valid request'
						)
				);
			}

			wp_safe_redirect( $redirect_to );
			exit();
		} else if (isset( $_SERVER['REQUEST_METHOD'] ) and
				  'GET' == $_SERVER['REQUEST_METHOD'] and
				  isset( $_REQUEST['action'] ) and
				  -1 != $_REQUEST['action'] and
				  'export' == $_REQUEST['action']) {
			header( 'Content-Type: text/csv; charset=utf-8' );
			header( 'Content-Disposition: attachment; filename=keywords.csv' );
			$output = fopen( 'php://output', 'w' );
			fputcsv( $output, array('Keyword', 'Priority', 'URL', 'Lang') );
			global $wpdb;
			$table = URLSLAB_KEYWORDS_TABLE;

			$query = "SELECT keyword, kw_priority, urlLink, lang FROM $table ORDER BY kw_priority ASC, kw_length DESC";
			$result = $wpdb->get_results( $query, ARRAY_N );
			foreach ($result as $row) {
				fputcsv( $output, $row );
			}
			fclose( $output );
			die();
		} else if (isset( $_SERVER['REQUEST_METHOD'] ) and
				   'GET' == $_SERVER['REQUEST_METHOD'] and
				   isset( $_REQUEST['action'] ) and
				   -1 != $_REQUEST['action'] and
				   'clear' == $_REQUEST['action']) {
			global $wpdb;
			$table = URLSLAB_KEYWORDS_TABLE;

			$query = "TRUNCATE $table";
			$wpdb->query($query); // phpcs:ignore
			wp_safe_redirect(
				$this->admin_widget_menu_page(
					array(
					'status' => 'success',
					'message' => 'All Data deleted'
					)
				) 
			);
			exit();

		} else {
			$option = 'per_page';
			$args = array(
				'label' => 'Keywords',
				'default' => 5,
				'option' => 'users_per_page',
			);

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
					<li class="color-danger">lang (required)</li>
					<li class="color-warning">priority (optional-defaults to 10)</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->admin_widget_menu_page( 'action=import' ) ); ?>" method="post" enctype="multipart/form-data">
				<?php wp_nonce_field( 'keyword-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button import_keyword_csv" value="Import">
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=export' ) ); ?>" target="_blank" class="button export_keyword_csv">Export</a>
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=clear' ) ); ?>" class="button export_keyword_csv">Delete all</a>
			</form>
		</div>
		<?php
	}

	private function save_csv_to_db( $file ): bool {
		//# Reading/Parsing CSV File
		$row = 1;
		$wrong_rows = 0;
		$cols = array();
		$saving_items = array();
		$handle = fopen( $file, 'r' );
		if ( false !== ( $handle ) ) {
			while (( $data = fgetcsv( $handle ) ) !== false) {

				//# processing CSV Header
				if ($row == 1) {
					if (count( $data ) != 4 and count( $data ) != 3) {
						//# Wrong number of cols in csv
						return false;
					} else {
						$idx = 0;
						foreach ($data as $col) {
							if (is_string( $col )) {
								if (is_string( $this->map_to_db_col( $col ) )) {
									if (isset( $cols[$this->map_to_db_col( $col )] )) {
										return false;
									} else {
										$cols[$this->map_to_db_col( $col )] = $idx;
										$idx++;
									}
								} else {
									return false;
								}
							} else {
								//# wrong type in header
								return false;
							}
						}
					}
					$row++;
					continue;
				}

				$keyword = $data[$cols['keyword']];
				$kw_priority = $data[$cols['kw_priority']] ?? 10;
				$lang = $data[$cols['lang']];
				$urlLink = $data[$cols['urlLink']];



				if (empty( $keyword ) or empty( $lang ) or empty( $urlLink )) {
					$wrong_rows++;
					continue;
				} else {
					$saving_items[] = new Urlslab_Url_Keyword_Data(
						$keyword,
						$kw_priority,
						strlen( $keyword ),
						$lang,
						$urlLink
					);
				}
				$row++;
			}
			fclose( $handle );
		}

		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		$values = array();
		$placeholder = array();
		foreach ( $saving_items as $item ) {
			array_push(
				$values,
				$item->get_keyword(),
				$item->get_keyword_priority(),
				$item->get_keyword_length(),
				$item->get_keyword_url_lang(),
				$item->get_keyword_url_link(),
			);
			$placeholder[] = '(%s, %d, %d, %s, %s)';
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query = "INSERT INTO $table (
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink) VALUES
                   $placeholder_string
                   ON DUPLICATE KEY UPDATE
                   kw_priority = VALUES(kw_priority),
                   kw_length = VALUES(kw_length),
                   lang = VALUES(lang),
                   urlLink = VALUES(urlLink)";

		$result = $wpdb->query(
			$wpdb->prepare(
				$update_query, // phpcs:ignore
				$values
			)
		);

		return is_numeric( $result );

	}

	/**
	 * @param string $col_name
	 *
	 * @return false|string
	 */
	private function map_to_db_col( string $col_name ) {
		switch (strtolower( trim( $col_name ) )) {
			case 'url':
				return 'urlLink';
			case 'lang':
				return 'lang';
			case 'priority':
				return 'kw_priority';
			case 'keyword':
				return 'keyword';
			default:
				return false;
		}
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

	private function replaceKeywordWithLinks( DOMText $node, DOMDocument $document, array $keywords) {
		//TODO: load all limits from widget settings and not from constants, use constants later just like default value of settings
		if ($this->cnt_page_links > self::MAX_LINKS_ON_PAGE ||
			$this->cnt_page_link_replacements > self::MAX_REPLACEMENTS_PER_PAGE ||
			$this->cnt_paragraph_link_replacements > self::MAX_REPLACEMENTS_PER_PARAGRAPH) {
			return;
		}

		if (0 == strlen( trim( $node->nodeValue ) )) {
			return; //empty node
		}

		foreach ($keywords as $kw => $url) {
			if (preg_match( '/\b(' . preg_quote( strtolower( $kw ), '/' ) . ')\b/', strtolower( $node->nodeValue ), $matches, PREG_OFFSET_CAPTURE )) {
				$pos = $matches[1][1];
				$this->cnt_page_links++;
				$this->cnt_page_link_replacements++;
				$this->cnt_paragraph_link_replacements++;
				if (isset( $this->kw_page_replacement_counts[$kw] )) {
					$this->kw_page_replacement_counts[$kw]++;
				} else {
					$this->kw_page_replacement_counts[$kw] = 1;
				}
				if (isset( $this->url_page_replacement_counts[$url] )) {
					$this->url_page_replacement_counts[$url]++;
				} else {
					$this->url_page_replacement_counts[$url] = 1;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ($this->kw_page_replacement_counts[$kw] > self::MAX_REPLACEMENTS_PER_KEYWORD) {
					unset( $keywords[$kw] );
					return;
				}

				//if we reached maximum number of replacements with this url, skip next processing and remove all keywords pointing to this url
				if ($this->url_page_replacement_counts[$url] > self::MAX_REPLACEMENTS_PER_URL) {
					foreach ($keywords as $k => $u) {
						if ($u == $url) {
							unset( $keywords[$k] );
						}
					}
					return;
				}

				//add text before keyword
				if ($pos > 0) {
					$domTextStart = $document->createTextNode(substr($node->nodeValue, 0, $pos)); // phpcs:ignore
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
				if (!urlslab_is_same_domain_url( $url )) {
					$linkDom->setAttribute( 'target', '_blank' );
				}

				$node->parentNode->insertBefore( $linkDom, $node );

				//add text after keyword
				if ($pos + strlen( $kw ) < strlen( $node->nodeValue )) {
					$domTextEnd = $document->createTextNode( substr( $node->nodeValue, $pos + strlen( $kw ) ) );
					$node->parentNode->insertBefore( $domTextEnd, $node );
				} else {
					$domTextEnd = null;
				}

				//process other keywords in text
				if (is_object( $domTextStart )) {
					$this->replaceKeywordWithLinks( $domTextStart, $document, $keywords );
				}
				if (is_object( $domTextEnd )) {
					$this->replaceKeywordWithLinks( $domTextEnd, $document, $keywords );
				}

				//remove processed node
				$node->parentNode->removeChild( $node );

				return;
			}
			unset( $keywords[$kw] );
		}
	}

	private function get_keywords() {
		if (empty( $this->keywords_cache )) {
			global $wpdb;

			$keyword_table = URLSLAB_KEYWORDS_TABLE;

			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT keyword, urlLink
				FROM ' . $keyword_table . // phpcs:ignore
					" WHERE (lang = %s OR lang = 'all')
					ORDER BY kw_priority ASC, kw_length DESC
					LIMIT 100",
					urlslab_get_language()
				),
				'ARRAY_A'
			);

			$this->keywords_cache = array();
			$current_page = get_current_page_url();
			foreach ($results as $row) {
				$kwUrl = new Urlslab_Url( $row['urlLink'] );
				if ($current_page->get_url_id() != $kwUrl->get_url_id()) {
					$this->keywords_cache[$row['keyword']] = $row['urlLink'];
				}
			}
		}

		$keywords = array();
		foreach ($this->keywords_cache as $kw => $lnk) {
			if (( !isset( $this->kw_page_replacement_counts[$kw] ) || $this->kw_page_replacement_counts[$kw] < self::MAX_REPLACEMENTS_PER_KEYWORD ) &&
				( !isset( $this->url_page_replacement_counts[$lnk] ) || $this->url_page_replacement_counts[$lnk] < self::MAX_REPLACEMENTS_PER_URL )) {
				$keywords[$kw] = $lnk;
			}
		}

		return $keywords;
	}

	private function findTextDOMElements( DOMNode $dom, DOMDocument $document) {
		//skip processing if HTML tag contains attribute "urlslab-skip"
		if ($dom->hasAttributes() && $dom->hasAttribute( 'urlslab-skip' )) {
			return;
		}

		if (!empty( $dom->childNodes )) {
			foreach ($dom->childNodes as $node) {

				if ($node instanceof DOMText && strlen( trim( $node->nodeValue ) ) > 1) {
					$this->replaceKeywordWithLinks( $node, $document, $this->get_keywords() );
				} else {
					if (count( $this->link_counts ) > 0 && preg_match( '/^[hH][0-9]$/', $node->nodeName )) {
						$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
					}

					//skip processing some types of HTML elements
					if (!in_array( strtolower( $node->nodeName ), array('a', 'button', 'input') ) &&
						!preg_match( '/^[hH][0-9]$/', $node->nodeName )) {
						$this->findTextDOMElements( $node, $document );
					}
				}
			}
		}
	}

	public function theContentHook( $content) {
		if (!strlen( trim( $content ) )) {
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
			if ($this->cnt_page_links > self::MAX_LINKS_ON_PAGE) {
				return $content;
			}

			$this->findTextDOMElements( $document, $document );

			return $document->saveHTML();
		} catch (Exception $e) {
			return $content . "\n" . "<!---\n Error:" . esc_html( $e->getMessage() ) . "\n--->";
		}
	}

	private function initLinkCounts( DOMDocument $document) {
		$this->cnt_page_link_replacements = 0;
		$this->cnt_page_links = 0;
		$this->kw_page_replacement_counts = array();
		$this->url_page_replacement_counts = array();
		$this->link_counts = array();
		$cnt = 0;
		$xpath = new DOMXPath( $document );
		$table_data = $xpath->query( "//a|//*[starts-with(name(),'h')]" );
		$hasLinksBeforeH1 = false;
		$hadHAlready = false;
		foreach ($table_data as $element) {
			if ($element->nodeName == 'a') {
				if (!$hadHAlready) {
					$hasLinksBeforeH1 = true;
				}
				$this->cnt_page_links++;
				$cnt++;
			}
			if (substr( $element->nodeName, 0, 1 ) == 'h') {
				$hadHAlready = true;
				$this->link_counts[] = $cnt;
				$cnt = 0;
			}
		}
		$this->link_counts[] = $cnt;

		if ($hasLinksBeforeH1) {
			$this->cnt_paragraph_link_replacements = array_shift( $this->link_counts );
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = ''): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}
}
