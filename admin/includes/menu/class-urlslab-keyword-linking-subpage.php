<?php

class Urlslab_Keyword_Linking_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Keyword_Link_Table $keyword_table;
	private Urlslab_Url_Data_Fetcher $data_fetcher;
	private string $subpage_slug;

	public function __construct( $parent_page, Urlslab_Url_Data_Fetcher $data_fetcher ) {
		$this->parent_page  = $parent_page;
		$this->subpage_slug = 'keyword-linking';
		$this->data_fetcher = $data_fetcher;
	}


	public function handle_action() {
		if (
			isset( $_SERVER['REQUEST_METHOD'] ) and
			'POST' === $_SERVER['REQUEST_METHOD'] and
			isset( $_GET['action'] ) and
			- 1 != $_GET['action']
		) {

			//# Import Functionality
			if (
				isset( $_POST['submit'] ) &&
				'Import' === $_POST['submit']
			) {
				check_admin_referer( 'keyword-widget-import' );
				$this->import_csv_keywords();
			}
			//# Import Functionality

			//# Edit Functionality
			if (
				isset( $_POST['submit'] ) &&
				'Edit Keyword' === $_POST['submit']
			) {
				if (
					isset( $_POST['keywordHash'] ) && ! empty( $_POST['keywordHash'] ) &&
					isset( $_POST['keyword'] ) && ! empty( $_POST['keyword'] ) &&
					isset( $_POST['keyword-link'] ) && ! empty( $_POST['keyword-link'] )
				) {
					try {
						//# Scheduling Url
						$url = new Urlslab_Url( $_POST['keyword-link'] );
						if ( $url->is_url_valid() ) {
							if ( $this->data_fetcher->prepare_url_batch_for_scheduling( array( $url ) ) ) {
								$this->edit_keyword(
									$_POST['keywordHash'],
									new Urlslab_Url_Keyword_Data(
										array(
											'keyword'     => $_POST['keyword'],
											'urlLink'     => $_POST['keyword-link'],
											'kw_priority' => $_POST['keyword-prio'] ?? null,
											'lang'        => $_POST['keyword-lang'] ?? null,
											'urlFilter'   => $_POST['keyword-url-filter'] ?? null,
										)
									)
								);
								wp_safe_redirect(
									$this->parent_page->menu_page(
										$this->subpage_slug,
										array(
											'status'          => 'success',
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
											'status'          => 'failure',
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
										'status'          => 'failure',
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
									'status'          => 'failure',
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
								'status'          => 'failure',
								'urlslab-message' => 'entered keyword detail was not valid',
							)
						)
					);
					exit;
				}
			}
			//# Edit Functionality

			//# Add Functionality
			if (
				isset( $_POST['submit'] ) &&
				'Add Keyword' === $_POST['submit']
			) {
				if (
					isset( $_POST['keyword'] ) && ! empty( $_POST['keyword'] ) &&
					isset( $_POST['keyword-link'] ) && ! empty( $_POST['keyword-link'] )
				) {
					try {

						$url = new Urlslab_Url( $_POST['keyword-link'] );
						if ( $url->is_url_valid() ) {
							if ( $this->data_fetcher->prepare_url_batch_for_scheduling( array( $url ) ) ) {
								$this->add_keyword(
									new Urlslab_Url_Keyword_Data(
										array(
											'keyword'     => $_POST['keyword'],
											'urlLink'     => $_POST['keyword-link'],
											'kw_priority' => $_POST['keyword-prio'] ?? null,
											'lang'        => $_POST['keyword-lang'] ?? null,
											'urlFilter'   => $_POST['keyword-url-filter'] ?? null,
										)
									)
								);
								wp_safe_redirect(
									$this->parent_page->menu_page(
										$this->subpage_slug,
										array(
											'status'          => 'success',
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
											'status'          => 'failure',
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
										'status'          => 'failure',
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
									'status'          => 'failure',
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
								'status'          => 'failure',
								'urlslab-message' => 'entered keyword detail was not valid',
							)
						)
					);
					exit;
				}
			}
			//# Add Functionality

		}

		if (
			isset( $_SERVER['REQUEST_METHOD'] ) and
			'GET' === $_SERVER['REQUEST_METHOD'] and
			isset( $_REQUEST['action'] ) and
			- 1 != $_REQUEST['action']
		) {

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
							'status'          => 'success',
							'urlslab-message' => 'All Data deleted successfully',
						)
					)
				);
				exit;
			}
			//# Clear Functionality
		}
	}

	public function urlslab_keyword_usage() {
		if (
			isset( $_SERVER['REQUEST_METHOD'] ) and
			'GET' === $_SERVER['REQUEST_METHOD'] and
			isset( $_GET['data'] )
		) {
			check_ajax_referer( 'keyword_map_nonce', 'security' );
			$kw_usage          = $this->fetch_keyword_usage( $_GET['data'] );
			$kw_recommendation = $this->fetch_recommended_urls_to( $_GET['data'] );
			wp_send_json_success(
				array(
					array(
						'title' => 'Keyword occurences:',
						'data'  => $kw_usage,
					),
					array(
						'title' => 'Recommendation: Add keyword to pages:',
						'data'  => $kw_recommendation,
					),
				)
			);
		}

		wp_send_json_error( array( 'error' => 'Bad Request' ) );
	}

	/**
	 * @param int $kw_id
	 *
	 * @return string[]
	 */
	private function fetch_keyword_usage( int $kw_id ): array {
		global $wpdb;
		$map_table    = URLSLAB_KEYWORDS_MAP_TABLE;
		$source_table = URLSLAB_URLS_TABLE;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT	v.urlMd5 AS urlMd5,
								v.urlName AS urlName,
								v.status AS status,
								v.domainId AS domainId,
								v.urlId AS urlId,
								v.screenshotDate AS screenshotDate,
								v.updateStatusDate AS updateStatusDate,
								v.urlCheckDate AS urlCheckDate,
								v.urlTitle AS urlTitle,
								v.urlMetaDescription AS urlMetaDescription,
								v.urlSummary AS urlSummary,
								v.visibility AS visibility,
								d.destUrlMd5 AS destUrlMd5,
								d.linkType AS linkType,
								u.urlName as destUrlName,
								u.urlTitle AS destUrlTitle
					FROM $map_table AS d INNER JOIN $source_table AS v ON d.urlMd5 = v.urlMd5 LEFT JOIN $source_table AS u ON d.destUrlMd5 = u.urlMd5 WHERE d.kw_id = %d", //#phpcs:ignore
				$kw_id
			),
			ARRAY_A
		);
		foreach ( $results as $id => $row ) {
			$row['pageid'] = url_to_postid( urlslab_add_current_page_protocol( $row['urlName'] ) );
			if ( $row['pageid'] ) {
				$row['editLink'] = get_edit_post_link( $row['pageid'] );
			}
			$results[ $id ] = $row;
		}

		return $results;
	}

	private function fetch_recommended_urls_to( int $kw_id ) {
		if ( empty( $kw_id ) ) {
			return array();
		}
		global $wpdb;
		$keyword_table          = URLSLAB_KEYWORDS_TABLE;
		$related_resource_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$source_table           = URLSLAB_URLS_TABLE;

		$kw_url = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT urlLink FROM $keyword_table WHERE kw_id = %s",//# phpcs:ignore
				$kw_id
			)
		);
		try {
			$kw_url = new Urlslab_Url( $kw_url );
		} catch ( Exception $e ) {
			return array();
		}
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT	v.urlMd5             AS urlMd5,
								v.urlName            AS urlName,
								v.status             AS status,
								v.domainId           AS domainId,
								v.urlId              AS urlId,
								v.screenshotDate     AS screenshotDate,
								v.updateStatusDate   AS updateStatusDate,
								v.urlCheckDate   AS urlCheckDate,
								v.urlTitle           AS urlTitle,
								v.urlMetaDescription AS urlMetaDescription,
								v.urlSummary         AS urlSummary,
								v.visibility         AS visibility
						FROM $related_resource_table AS d INNER JOIN $source_table AS v ON d.destUrlMd5 = v.urlMd5 WHERE d.srcUrlMd5 = %s", //#phpcs:ignore
				$kw_url->get_url_id()
			),
			ARRAY_A
		);

		foreach ( $results as $id => $row ) {
			$row['pageid'] = url_to_postid( urlslab_add_current_page_protocol( $row['urlName'] ) );
			if ( $row['pageid'] ) {
				$row['edit_link'] = get_edit_post_link( $row['pageid'] );
			}
			$results[ $id ] = $row;
		}

		return $results;
	}

	private function clear_keywords() {
		global $wpdb;
		$wpdb->query( "TRUNCATE " . URLSLAB_KEYWORDS_TABLE ); // phpcs:ignore
		$wpdb->query( "TRUNCATE " . URLSLAB_KEYWORDS_MAP_TABLE ); // phpcs:ignore
	}

	private function export_csv_keywords() {
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=keywords.csv' );
		$output = fopen( 'php://output', 'w' );
		fputcsv( $output, array( 'Keyword', 'URL', 'Priority', 'Lang', 'Filter', 'Type' ) );
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;

		$query  = "SELECT keyword, urlLink, kw_priority, lang, urlFilter, kwType FROM $table ORDER BY keyword, lang, urlFilter, kw_priority  ASC, kw_length DESC";
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
                   kw_id,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter) VALUES (%d, %s, %d, %d, %s, %s, %s, %s)';

		$wpdb->query(
			$wpdb->prepare(
				$query, // phpcs:ignore
				array(
					$keyword->get_kw_id(),
					$keyword->get_keyword(),
					$keyword->get_keyword_priority(),
					$keyword->get_keyword_length(),
					$keyword->get_keyword_url_lang(),
					$keyword->get_keyword_url_link(),
					$keyword->get_keyword_url_filter(),
					$keyword->get_keyword_type(),
				)
			)
		);
		//# Add Keyword
	}


	private function edit_keyword(
		string $old_keyword_hash,
		Urlslab_Url_Keyword_Data $keyword
	) {
		global $wpdb;

		//# Deletion of keyword
		$wpdb->delete(
			URLSLAB_KEYWORDS_TABLE,
			array(
				'kw_id' => $old_keyword_hash,
			),
			array(
				'%s',
			)
		);
		//# Deletion of keyword

		//# Add Keyword
		$query = 'INSERT INTO ' . URLSLAB_KEYWORDS_TABLE . ' (
                   kw_id,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter) VALUES (%s, %s, %d, %d, %s, %s, %s, %s)';

		$wpdb->query(
			$wpdb->prepare(
				$query, // phpcs:ignore
				array(
					$keyword->get_kw_id(),
					$keyword->get_keyword(),
					$keyword->get_keyword_priority(),
					$keyword->get_keyword_length(),
					$keyword->get_keyword_url_lang(),
					$keyword->get_keyword_url_link(),
					$keyword->get_keyword_url_filter(),
					$keyword->get_keyword_type(),
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
				 $_FILES['csv_file']['size'] > 0
			) {
				$res = $this->import_csv( $_FILES['csv_file']['tmp_name'] );
				if ( $res > 0 ) {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status'          => 'success',
							'urlslab-message' => 'CSV File was added successfully',
						)
					);
				} else {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status'          => 'failure',
							'urlslab-message' => 'There was a problem in parsing the CSV',
						)
					);
				}
			} else {
				if ( isset( $_FILES['csv_file']['error'] ) ) {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status'          => 'failure',
							'urlslab-message' => urlslab_file_upload_code_to_message( $_FILES['csv_file']['error'] ),
						)
					);
				} else {
					$redirect_to = $this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status'          => 'failure',
							'urlslab-message' => 'Oops! somethgin wrong with the uploaded file',
						)
					);
				}
			}
		} catch ( Exception $e ) {
			$redirect_to = $this->parent_page->menu_page(
				$this->subpage_slug,
				array(
					'status'          => 'failure',
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
	private function import_csv( $file ): int {
		//# Reading/Parsing CSV File
		$row            = 0;
		$processed_rows = 0;
		$handle         = fopen( $file, 'r' );

		$urls     = array();
		$keywords = array();

		if ( false !== ( $handle ) ) {
			wp_raise_memory_limit( 'admin' );
			while ( ( $data = fgetcsv( $handle ) ) !== false ) {
				$row ++;
				//# processing CSV Header
				if ( 1 == $row ) {
					continue;
				}
				if ( ! isset( $data[0] ) || strlen( $data[0] ) == 0 || ! isset( $data[1] ) || strlen( $data[1] ) == 0 ) {
					continue;
				}
				//Keyword, URL, Priority, Lang, Filter
				try {
					$data_row   = new Urlslab_Url_Keyword_Data(
						array(
							'keyword'     => $data[0],
							'urlLink'     => $data[1],
							'kw_priority' => $data[2] ?? null,
							'lang'        => $data[3] ?? null,
							'urlFilter'   => $data[4] ?? null,
							'kwType'      => $data[5] ?? Urlslab_Keywords_Links::KW_MANUAL,
						)
					);
					$keywords[] = $data_row;

					$scheduling_url = new Urlslab_Url( $data_row->get_keyword_url_link() );
					if ( $scheduling_url->is_url_valid() ) {
						$urls[ $scheduling_url->get_url_id() ] = $scheduling_url;
					}
				} catch ( Exception $e ) {
					//# row not inserted
				}
			}
			fclose( $handle );

			//insert urls
			$this->data_fetcher->prepare_url_batch_for_scheduling( $urls );

			//insert keywords
			$processed_rows = Urlslab_Url_Keyword_Data::create_keywords( $keywords );

		}

		return $processed_rows;
	}

	public function render_manage_buttons() {
		?>
		<div class="urlslab-action-container">
			<div>
				<button id="add-keyword-btn" class="button button-primary"
						data-close-icon="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>">
					Add Keyword
				</button>
				<button id="import-btn" class="button button-primary">
					Import
				</button>
			</div>
			<div>
				<a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=export' ) ); ?>"
				   target="_blank"
				   class="button">Export</a>
				<a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=clear' ) ); ?>"
				   class="button">Delete all</a>
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
			<p class="search-box float-left col-12">
				<?php
				$filter = $_GET['lang'] ?? '';
				?>
				<label class="screen-reader-text" for="lang-filter">Lang:</label>
				<input type="search" id="lang-filter" placeholder="lang filter..." name="lang"
					   value="<?php echo esc_attr( $filter ); ?>"/>
				<?php submit_button( 'Filter', '', '', false, array( 'id' => 'search-submit' ) ); ?>
			</p>
			<p class="search-box float-left col-12">
				<?php
				$filter = $_GET['url'] ?? '';
				?>
				<label class="screen-reader-text" for="url-filter">URL:</label>
				<input type="search" id="url-filter" placeholder="URL filter..." name="url"
					   value="<?php echo esc_attr( $filter ); ?>"/>
			</p>
			<p class="search-box float-left col-12">
				<?php
				$filter = $_GET['s'] ?? '';
				?>
				<label class="screen-reader-text" for="urlslab-keyword-input">Keyword:</label>
				<input type="search" id="urlslab-keyword-input" placeholder="Keyword filter..." name="s"
					   value="<?php echo esc_attr( $filter ); ?>"/>
			</p>
			<p class="search-box float-left col-12">
				<?php
				$filter = $_GET['priority'] ?? '';
				?>
				<label class="screen-reader-text" for="urlslab-priority-input">Priority:</label>
				<input type="search" id="urlslab-priority-input" placeholder="Priority filter..." name="priority"
					   value="<?php echo esc_attr( $filter ); ?>"/>
			</p>
			<p class="search-box float-left col-12">
				<?php
				$filter = $_GET['usages'] ?? '';
				?>
				<label class="screen-reader-text" for="urlslab-usages-input">Usage:</label>
				<input type="search" id="urlslab-usages-input" placeholder="Usage filter..." name="usages"
					   value="<?php echo esc_attr( $filter ); ?>"/>
			</p>
			<?php
			$this->keyword_table->display();
			?>
		</form>
		<?php
	}

	public function render_modals() {
		?>
		<div id="import-modal" class="modal urlslab-modal d-none">
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
					<li class="color-warning">type (optional - defaults to M, Possible values: M - manual link, I -
						imported link)
					</li>
				</ul>
			</div>
			<?php
			$search_param = '';
			if ( isset( $_REQUEST['s'] ) && ! empty( $_REQUEST['s'] ) ) {
				$search_param = '&s=' . $_REQUEST['s'];
			}
			?>
			<form action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=import' . $search_param ) ); ?>"
				  method="post"
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
		$args   = array(
			'label'   => 'Keywords',
			'default' => 50,
			'option'  => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->keyword_table = new Urlslab_Keyword_Link_Table();
	}
}
