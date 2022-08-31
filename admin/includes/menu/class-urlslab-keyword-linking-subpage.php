<?php

class Urlslab_Keyword_Linking_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Keyword_Link_Table $keyword_table;
	private Urlslab_Url_Data_Fetcher $data_fetcher;
	private string $subpage_slug;

	public function __construct( $parent_page, Urlslab_Url_Data_Fetcher $data_fetcher ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'keyword-linking';
		$this->data_fetcher = $data_fetcher;
	}


	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_GET['action'] ) and
			 - 1 != $_GET['action'] ) {

			//# Import Functionality
			if ( isset( $_POST['submit'] ) &&
				 'Import' === $_POST['submit'] ) {
				check_admin_referer( 'keyword-widget-import' );
				$this->import_csv_keywords();
			}
			//# Import Functionality

			//# Edit Functionality
			if ( isset( $_POST['submit'] ) &&
				 'Edit Keyword' === $_POST['submit'] ) {
				if ( isset( $_POST['keywordHash'] ) && ! empty( $_POST['keywordHash'] ) &&
					 isset( $_POST['keyword'] ) && ! empty( $_POST['keyword'] ) &&
					 isset( $_POST['keyword-link'] ) && ! empty( $_POST['keyword-link'] ) ) {
					try {
						//# Scheduling Url
						$url = new Urlslab_Url( $_POST['keyword-link'] );
						if ( $url->is_url_valid() ) {
							if ( $this->data_fetcher->prepare_url_batch_for_scheduling( array( $url ) ) ) {
								$this->edit_keyword(
									$_POST['keywordHash'],
									new Urlslab_Url_Keyword_Data(
										$_POST['keyword'],
										isset( $_POST['keyword-prio'] ) && ! empty( $_POST['keyword-prio'] ) ? $_POST['keyword-prio'] : 10,
										strlen( $_POST['keyword'] ),
										isset( $_POST['keyword-lang'] ) && ! empty( $_POST['keyword-lang'] ) ? $_POST['keyword-lang'] : 'all',
										$_POST['keyword-link'],
										isset( $_POST['keyword-url-filter'] ) && ! empty( $_POST['keyword-url-filter'] ) ? $_POST['keyword-url-filter'] : '.*',
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
							} else {
								wp_safe_redirect(
									$this->parent_page->menu_page(
										$this->subpage_slug,
										array(
											'status' => 'failure',
											'urlslab-message' => 'couldnt schedule url, please try again',
										)
									)
								);
								exit;
							}
						} else {
							wp_safe_redirect(
								$this->parent_page->menu_page(
									$this->subpage_slug,
									array(
										'status' => 'failure',
										'urlslab-message' => 'entered url is not valid',
									)
								)
							);
							exit;
						}
					} catch ( Exception $e ) {
						wp_safe_redirect(
							$this->parent_page->menu_page(
								$this->subpage_slug,
								array(
									'status' => 'failure',
									'urlslab-message' => $e->getMessage(),
								)
							)
						);
						exit;
					}
				} else {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							$this->subpage_slug,
							array(
								'status' => 'failure',
								'urlslab-message' => 'entered keyword detail was not valid',
							)
						)
					);
					exit;
				}
			}
			//# Edit Functionality

			//# Add Functionality
			if ( isset( $_POST['submit'] ) &&
				 'Add Keyword' === $_POST['submit'] ) {
				if ( isset( $_POST['keyword'] ) && ! empty( $_POST['keyword'] ) &&
					 isset( $_POST['keyword-link'] ) && ! empty( $_POST['keyword-link'] ) ) {
					try {

						$url = new Urlslab_Url( $_POST['keyword-link'] );
						if ( $url->is_url_valid() ) {
							if ( $this->data_fetcher->prepare_url_batch_for_scheduling( array( $url ) ) ) {
								$this->add_keyword(
									new Urlslab_Url_Keyword_Data(
										$_POST['keyword'],
										isset( $_POST['keyword-prio'] ) && ! empty( $_POST['keyword-prio'] ) ? $_POST['keyword-prio'] : 10,
										strlen( $_POST['keyword'] ),
										isset( $_POST['keyword-lang'] ) && ! empty( $_POST['keyword-lang'] ) ? $_POST['keyword-lang'] : 'all',
										$_POST['keyword-link'],
										isset( $_POST['keyword-url-filter'] ) && ! empty( $_POST['keyword-url-filter'] ) ? $_POST['keyword-url-filter'] : '.*',
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
							} else {
								wp_safe_redirect(
									$this->parent_page->menu_page(
										$this->subpage_slug,
										array(
											'status' => 'failure',
											'urlslab-message' => 'couldnt schedule url, please try again',
										)
									)
								);
								exit;
							}
						} else {
							wp_safe_redirect(
								$this->parent_page->menu_page(
									$this->subpage_slug,
									array(
										'status' => 'failure',
										'urlslab-message' => 'entered url is not valid',
									)
								)
							);
							exit;
						}
					} catch ( Exception $e ) {
						wp_safe_redirect(
							$this->parent_page->menu_page(
								$this->subpage_slug,
								array(
									'status' => 'failure',
									'urlslab-message' => $e->getMessage(),
								)
							)
						);
						exit;
					}
				} else {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							$this->subpage_slug,
							array(
								'status' => 'failure',
								'urlslab-message' => 'entered keyword detail was not valid',
							)
						)
					);
					exit;
				}
			}
			//# Add Functionality

			//# Edit settings
			if ( isset( $_POST['submit'] ) &&
				 'Save Changes' === $_POST['submit'] &&
				 'update-settings' == $_GET['action'] ) {

				Urlslab_Keywords_Links::update_settings( $_POST );

				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'Keyword settings was saved successfully',
						),
						$_GET['sub-tab'] ?? ''
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
			'affiliate marketing' => 'https://www.postaffiliatepro.com/affiliate-marketing-software/',
		);

		//try to load all titles with less than 4 words
		$posts = get_posts(
			array(
				'numberposts' => 1000,
				'orderby'     => 'date',
				'order'       => 'DESC',
			)
		);

		foreach ( $posts as $post ) {
			if ( 'publish' == $post->post_status && substr_count( $post->post_title, ' ' ) < 3 ) {
				$sample_data[ strtolower( $post->post_title ) ] = get_permalink( $post->ID );
			}
		}

		//# Scheduling Src and Dest URLs
		$crawling_urls = array();
		foreach ( $sample_data as $data ) {
			$crawling_urls[] = new Urlslab_Url( $data );
		}
		if ( ! $this->data_fetcher->prepare_url_batch_for_scheduling( $crawling_urls ) ) {
			wp_safe_redirect(
				$this->parent_page->menu_page(
					$this->subpage_slug,
					array(
						'status' => 'failure',
						'urlslab-message' => 'Couldnt create the sample data',
					)
				)
			);
			exit;
		}
		//# Scheduling Src and Dest URLs

		foreach ( $sample_data as $kw => $url ) {
			$data_row = new Urlslab_Url_Keyword_Data( $kw, 100, strlen( $kw ), 'all', $url, '.*' );
			$this->create_row( $data_row );
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
		$result = $wpdb->get_results( $query, ARRAY_N ); //# phpcs:ignore
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
					$keyword->get_keyword_url_filter(),
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
				'kwMd5' => $old_keyword_hash,
			),
			array(
				'%s',
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
					$keyword->get_keyword_url_filter(),
				)
			)
		);
		//# Add Keyword
	}

	/**
	 * @return void
	 */
	private function import_csv_keywords(): void {
		try {
			if ( ! empty( $_FILES['csv_file'] ) &&
				 isset( $_FILES['csv_file']['size'] ) &&
				 isset( $_FILES['csv_file']['tmp_name'] ) &&
				 $_FILES['csv_file']['size'] > 0 ) {
				$res = $this->process_csv( $_FILES['csv_file']['tmp_name'] );
				if ( $res > 0 ) {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'CSV File was added successfully',
						)
					);
				} else {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'failure',
							'urlslab-message' => 'There was a problem in parsing the CSV',
						)
					);
				}
			} else {
				if ( isset( $_FILES['csv_file']['error'] ) ) {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'failure',
							'urlslab-message' => urlslab_file_upload_code_to_message( $_FILES['csv_file']['error'] ),
						)
					);
				} else {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'failure',
							'urlslab-message' => 'Oops! somethgin wrong with the uploaded file',
						)
					);
				}
			}
		} catch ( Exception $e ) {
			$redirect_to = $this->parent_page->menu_page(
				$this->subpage_slug,
				array(
					'status' => 'failure',
					'urlslab-message' => 'Error in processing CSV: ' . $e->getMessage(),
				)
			);
		} finally {
			wp_safe_redirect( $redirect_to );
			exit();
		}
	}

	/**
	 * @param $file
	 *
	 * @return int
	 */
	private function process_csv( $file ): int {
		//# Reading/Parsing CSV File
		$row = 0;
		$processed_rows = 0;
		$handle = fopen( $file, 'r' );
		if ( false !== ( $handle ) ) {
			wp_raise_memory_limit( 'admin' );
			while ( ( $data = fgetcsv( $handle ) ) !== false ) {
				$row++;
				//# processing CSV Header
				if ( 1 == $row ) {
					continue;
				}
				if ( ! isset( $data[0] ) || strlen( $data[0] ) == 0 || ! isset( $data[1] ) || strlen( $data[1] ) == 0 ) {
					continue;
				}
				//Keyword, URL, Priority, Lang, Filter
				try {
					$data_row = new Urlslab_Url_Keyword_Data( $data[0], isset( $data[2] ) && is_numeric( $data[2] ) ? (int) $data[2] : 10, strlen( $data[0] ), isset( $data[3] ) && strlen( $data[3] ) > 0 ? $data[3] : 'all', $data[1], isset( $data[4] ) ? $data[4] : '.*' );

					$result = $this->create_row( $data_row );
					$scheduling_url = new Urlslab_Url( $data_row->get_keyword_url_link() );
					if ( $scheduling_url->is_url_valid() ) {
						$this->data_fetcher->prepare_url_batch_for_scheduling( array( $scheduling_url ) );
					}
					if ( $result ) {
						$processed_rows++;
					}
				} catch ( Exception $e ) {
					//# row not inserted
				}
			}
			fclose( $handle );
		}
		return $processed_rows;
	}

	/**
	 * @param Urlslab_Url_Keyword_Data $data_row
	 *
	 * @return bool
	 */
	private function create_row( Urlslab_Url_Keyword_Data $data_row ): bool {
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

		$result = $wpdb->query(
			$wpdb->prepare( $update_query, // phpcs:ignore
				array(
					$data_row->get_kw_md5(),
					$data_row->get_keyword(),
					$data_row->get_keyword_priority(),
					$data_row->get_keyword_length(),
					$data_row->get_keyword_url_lang(),
					$data_row->get_keyword_url_link(),
					$data_row->get_keyword_url_filter(),
				)
			)
		);

		return is_numeric( $result );
	}

	public function render_manage_buttons() {
		?>
		<div class="urlslab-action-container">
			<div>
				<button id="add-keyword-btn" class="button button-primary" data-close-icon="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>">
					Add Keyword
				</button>
				<button id="import-btn" class="button button-primary">
					Import
				</button>
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
		<div id="import-modal" class="modal urlslab-modal">
			<div>
				<h2>Import Keyword CSV</h2>
				<button data-close-modal-id="import-modal" class="modal-close">
					<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>"
						 alt="info"
						 width="17px">
				</button>
			</div>
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
			<?php
			$search_param = '';
			if ( isset( $_REQUEST['s'] ) && ! empty( $_REQUEST['s'] ) ) {
				$search_param = '&s=' . $_REQUEST['s'];
			}
			?>
			<form action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=import' . $search_param ) ); ?>" method="post"
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
		$settings = array(
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD, Urlslab_Keywords_Links::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD ),
				'Maximum number of times, that each keyword should be replaced in a page',
				'Max Replacement Per Keyword',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_KEYWORD_URL, Urlslab_Keywords_Links::MAX_DEFAULT_REPLACEMENTS_PER_KEYWORD_URL ),
				'Maximum number of times, that each keyword-url pair should be replaced in a page',
				'Max Replacement Per Keyword-Url pair',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_URL,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_URL, Urlslab_Keywords_Links::MAX_DEFAULT_REPLACEMENTS_PER_URL ),
				'Maximum number of times, that a keyword link should be generated for a single outbound url',
				'Max Replacement Per Url',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_LINKS_ON_PAGE,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_LINKS_ON_PAGE, Urlslab_Keywords_Links::MAX_DEFAULT_REPLACEMENTS_PER_URL ),
				'the maximum number of links that exists in a page for both auto and manual links',
				'Max Links in page (manual and auto links)',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_PAGE, Urlslab_Keywords_Links::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PAGE ),
				'the maximum number of auto links to be generated',
				'Max Auto links in page',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MAX_REPLACEMENTS_PER_PARAGRAPH, Urlslab_Keywords_Links::SETTING_DEFAULT_MAX_REPLACEMENTS_PER_PARAGRAPH ),
				'the maximum number of auto links to be created for each paragraph',
				'Max auto links per paragraph',
				''
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Keywords_Links::SETTING_NAME_MIN_PARAGRAPH_LENGTH,
				get_option( Urlslab_Keywords_Links::SETTING_NAME_MIN_PARAGRAPH_LENGTH, Urlslab_Keywords_Links::SETTING_DEFAULT_MIN_PARAGRAPH_LENGTH ),
				'Skip searching for keywords in paragraph shorter as defined limit',
				'Min paragraph length [# of characters]',
				''
			),
		)

		?>
		<form method="post" action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=update-settings', 1 ) ); ?>">
			<?php wp_nonce_field( 'keyword-update-settings' ); ?>
			<?php
			foreach ( $settings as $setting ) {
				$setting->render_setting();
			}
			?>
			<p>
				<input
						type="submit"
						name="submit"
						id="save-sub-widget"
						class="urlslab-btn-primary"
						value="Save Changes">
			</p>
		</form>
		<?php

	}
}
