<?php

class Urlslab_Content_Link_Building_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Keyword_Link_Table $keyword_table;
	private string $subpage_slug;

	public function __construct( $parent_page ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'link-building';
	}


	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
		     'POST' === $_SERVER['REQUEST_METHOD'] and
		     isset( $_REQUEST['action'] ) and
		     - 1 != $_REQUEST['action'] ) {

			//# Import Functionality
			if ( isset( $_POST['submit'] ) &&
			     'Import' === $_POST['submit'] ) {
				$this->import_csv_keywords();
			}
			//# Import Functionality

            //# Edit Functionality
			if ( isset( $_POST['submit'] ) &&
			     'Edit Keyword' === $_POST['submit'] ) {
				$this->edit_keyword(
					$_POST['keywordHash'],
                    new Urlslab_Url_Keyword_Data(
	                    $_POST['keyword'],
	                    $_POST['keyword-prio'],
	                    strlen( $_POST['keyword'] ),
	                    $_POST['keyword-lang'],
	                    $_POST['keyword-link'],
	                    $_POST['keyword-url-filter'],
                    )
                );
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'keyword was edited successfully',
						)
					)
				);
				exit;
			}
			//# Edit Functionality

            //# Add Functionality
			if ( isset( $_POST['submit'] ) &&
			     'Add Keyword' === $_POST['submit'] ) {
				$this->add_keyword(
					new Urlslab_Url_Keyword_Data(
						$_POST['keyword'],
						$_POST['keyword-prio'],
						strlen( $_POST['keyword'] ),
						$_POST['keyword-lang'],
						$_POST['keyword-link'],
						$_POST['keyword-url-filter'],
					)
				);
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'Keyword was added successfully',
						)
					)
				);
				exit;
			}
			//# Add Functionality

            //# Edit settings
			if ( isset( $_POST['submit'] ) &&
			     'Save Changes' === $_POST['submit'] &&
                 'update-settings' == $_POST['action']) {

                $saving_opt = array();
                foreach ($_POST as $key => $val) {
                    if (str_starts_with($key, 'urlslab_')) {
                        $saving_opt[$key] = $val;
                    }
                }

				update_option(
                        'urlslab-keywords-links',
                    $saving_opt
                );
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'Keyword settings was saved successfully',
						)
					)
				);
				exit;
			}
			//# Edit settings

		}

		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
		     'GET' === $_SERVER['REQUEST_METHOD'] and
		     isset( $_REQUEST['action'] ) and
		     - 1 != $_REQUEST['action'] ) {

			//# Export Functionality
			if ( 'export' == $_REQUEST['action'] ) {
				$this->export_csv_keywords();
				die();
			}
			//# Export Functionality

			//# Clear Functionality
			if ( 'clear' == $_REQUEST['action'] ) {
				$this->clear_keywords();
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status'  => 'success',
							'urlslab-message' => 'All Data deleted successfully',
						)
					)
				);
				exit;
			}
			//# Clear Functionality

			//# Sample Data Generation
			if ( 'generate_sample_data' == $_REQUEST['action'] ) {
				$this->init_sample_data();
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'Sample Data generated successfully',
						)
					)
				);
				exit;
			}
			//# Sample Data Generation
		}
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

	private function clear_keywords() {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;

		$query = "TRUNCATE $table";
		$wpdb->query( $query ); // phpcs:ignore
	}

    private function export_csv_keywords() {
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
    }

    private function add_keyword( Urlslab_Url_Keyword_Data $keyword ) {
	    global $wpdb;
	    //# Add Keyword
	    $query = 'INSERT INTO ' . URLSLAB_KEYWORDS_TABLE . ' (
                   kwMd5,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter) VALUES (%s, %s, %d, %d, %s, %s, %s)';

	    $wpdb->query(
		    $wpdb->prepare( $query, // phpcs:ignore
			    array(
				    $keyword->get_kw_md5(),
				    $keyword->get_keyword(),
				    $keyword->get_keyword_priority(),
				    $keyword->get_keyword_length(),
				    $keyword->get_keyword_url_lang(),
				    $keyword->get_keyword_url_link(),
				    $keyword->get_keyword_url_filter()
			    )
		    )
	    );
	    //# Add Keyword
    }


	private function edit_keyword(
		string $old_keyword_hash,
		Urlslab_Url_Keyword_Data $keyword ) {
		global $wpdb;

		//# Deletion of keyword
		$wpdb->delete(
			URLSLAB_KEYWORDS_TABLE,
			array(
				'kwMd5' => $old_keyword_hash
			),
			array(
				'%s'
			)
		);
		//# Deletion of keyword

		//# Add Keyword
		$query = 'INSERT INTO ' . URLSLAB_KEYWORDS_TABLE . ' (
                   kwMd5,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter) VALUES (%s, %s, %d, %d, %s, %s, %s)';

		$wpdb->query(
			$wpdb->prepare( $query, // phpcs:ignore
				array(
					$keyword->get_kw_md5(),
					$keyword->get_keyword(),
					$keyword->get_keyword_priority(),
					$keyword->get_keyword_length(),
					$keyword->get_keyword_url_lang(),
					$keyword->get_keyword_url_link(),
					$keyword->get_keyword_url_filter()
				)
			)
		);
		//# Add Keyword
	}

	/**
	 * @return string
	 */
	private function import_csv_keywords(): string {
		if ( ! empty( $_FILES['csv_file'] ) and $_FILES['csv_file']['size'] > 0 ) {
			$res = $this->process_csv( $_FILES['csv_file']['tmp_name'] );
			if ( $res ) {
				$redirect_to = $this->parent_page->menu_page(
                        $this->subpage_slug,
					array(
						'status' => 'success',
                        'urlslab-message' => 'CSV File was added successfully'
					)
				);
			} else {
				$redirect_to = $this->parent_page->menu_page(
					$this->subpage_slug,
					array(
						'status' => 'failure',
						'urlslab-message' => 'There was a problem in parsing the CSV'
					)
				);
			}
		} else {
			$redirect_to = $this->parent_page->menu_page(
				$this->subpage_slug,
				array(
					'status' => 'failure',
					'urlslab-message' => file_upload_code_to_message( $_FILES['csv_file']['error'] ),
				)
			);
		}
		wp_safe_redirect( $redirect_to );
		exit();
    }

	/**
	 * @param $file
	 *
	 * @return bool
	 */
	private function process_csv( $file ): bool {
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
	 * @param Urlslab_Url_Keyword_Data $dataRow
	 *
	 * @return void
	 */
	private function createRow( Urlslab_Url_Keyword_Data $dataRow ): void {
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

		$wpdb->query(
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

	public function render_manage_buttons() {
		?>
		<div class="urlslab-action-container">
            <div>
                <button id="add-keyword-btn" class="button button-primary">
                    Add Keyword
                </button>
                <a href="#ex1" rel="modal:open" class="button button-primary">
                    Import
                </a>
            </div>
            <div>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=export' ) ); ?>" target="_blank"
                   class="button">Export</a>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=clear' ) ); ?>"
                   class="button">Delete all</a>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=generate_sample_data' ) ); ?>"
                   class="button">Generate Sample Data</a>
            </div>
        </div>
		<?php
	}

	public function render_tables() {
		?>
		<form method="get" class="float-left">
			<?php
			$this->keyword_table->prepare_items();
			?>
			<input type="hidden" name="page" value="<?php echo esc_attr( $this->parent_page->get_menu_slug() ); ?>">
			<input type="hidden" name="tab" value="<?php echo esc_attr( $this->subpage_slug ); ?>">
			<?php
			$this->keyword_table->search_box( 'Search', 'urlslab-keyword-input' );
			$this->keyword_table->display();
			?>
		</form>
		<?php
	}

	public function render_modals() {
		?>
		<div id="ex1" class="modal">
			<h2>Import Keyword CSV</h2>
			<div>
				The CSV file should contain headers. the CSV file should include following headers:
				<ul>
					<li class="color-danger">Keyword (required)</li>
					<li class="color-danger">URL (required)</li>
					<li class="color-warning">priority (optional - defaults to 10)</li>
					<li class="color-warning">lang (optional - defaults to 'all')</li>
					<li class="color-warning">filter (optional - defaults to regular expression '.*')</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=import' ) ); ?>" method="post"
			      enctype="multipart/form-data">
				<?php wp_nonce_field( 'keyword-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button import_keyword_csv" value="Import">
			</form>
		</div>
		<?php
	}

	public function set_table_screen_options() {
		$option = 'per_page';
		$args = array(
			'label' => 'Keywords',
			'default' => 50,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->keyword_table = new Urlslab_Keyword_Link_Table();
	}

	public function render_settings() {
		$keyword_settings = Urlslab_Available_Widgets::get_instance()->get_widget('urlslab-keywords-links')->get_widget_settings();
        ?>
        <div class="col-8 mar-top-1">
            <form method="post">
		        <?php foreach ($keyword_settings as $keyword_setting => $keyword_val) { ?>
			        <?php wp_nonce_field( 'keyword-update-settings' ); ?>
                    <input type="hidden" name="action" value="update-settings">
                    <div class="col-3 float-left">
                        <label for="<?php echo esc_attr($keyword_setting)?>">
                            <?php echo esc_html(implode(' ', explode('_', str_replace('urlslab_', '', $keyword_setting))))?>:
                        </label>
                    </div>
                    <div class="col-3 float-left">
                        <input id="<?php echo esc_attr($keyword_setting)?>" name="<?php echo esc_attr($keyword_setting)?>" value="<?php echo esc_attr($keyword_val)?>" type="number">
                    </div>
                    <br class="clear"/>
                    <br class="clear"/>
		        <?php } ?>
                <input class="button button-primary" type="submit" name="submit" value="Save Changes">
            </form>
        </div>
        <?php

	}
}
