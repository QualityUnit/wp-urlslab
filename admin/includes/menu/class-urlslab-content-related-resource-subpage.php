<?php

class Urlslab_Content_Related_Resource_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Related_Resources_Widget_Table $related_resource_table;
	private Urlslab_Url_Data_Fetcher $url_data_fetcher;
	private string $subpage_slug;

	public function __construct( $parent_page,
		Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'related-resource';
		$this->url_data_fetcher = $url_data_fetcher;
	}

	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] ) {

			//# Import Functionality
			if ( isset( $_POST['submit'] ) &&
				 'Import' === $_POST['submit'] ) {
				check_admin_referer( 'related-resource-widget-import' );
				$this->import_csv_url_relations();
			}
			//# Import Functionality

		}

		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'GET' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] ) {

			//# Export Functionality
			if ( 'export' == $_REQUEST['action'] ) {
				$this->export_csv_url_relations();
				die();
			}
			//# Export Functionality

			//# Clear Functionality
			if ( 'clear' == $_REQUEST['action'] ) {
				$this->clear_url_relations();
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
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

	public function render_manage_buttons() {
		?>
		<div class="urlslab-action-container">
			<div>
				<button id="add--url-relation-btn" class="button button-primary">
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
			$this->related_resource_table->prepare_items();
			?>
			<input type="hidden" name="page" value="<?php echo esc_attr( $this->parent_page->get_menu_slug() ); ?>">
			<input type="hidden" name="tab" value="<?php echo esc_attr( $this->subpage_slug ); ?>">
			<?php
			$this->related_resource_table->search_box( 'Search', 'urlslab-url-relation-input' );
			$this->related_resource_table->display();
			?>
		</form>
		<?php
	}

	public function render_modals() {
		?>
		<div id="ex1" class="modal">
			<h2>Import Related Resources CSV</h2>
			<div>
				The CSV file should contain headers. the CSV file should include following headers:
				<ul>
					<li class="color-danger">src URL (required)</li>
					<li class="color-danger">dest URL (required)</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=import' ) ); ?>" method="post"
				  enctype="multipart/form-data">
				<?php wp_nonce_field( 'related-resource-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button" value="Import">
			</form>
		</div>
		<?php
	}

	public function set_table_screen_options() {
		add_screen_option(
			'per_page',
			array(
				'label' => 'Relations',
				'default' => 50,
				'option' => 'users_per_page',
			)
		);

		$this->related_resource_table = new Urlslab_Related_Resources_Widget_Table();
	}

	private function import_csv_url_relations() {
		if ( isset( $_FILES['csv_file']['error'] ) and
			 UPLOAD_ERR_OK == $_FILES['csv_file']['error'] and
			 isset( $_FILES['csv_file'] ) and
			 isset( $_FILES['csv_file']['size'] ) and
			 isset( $_FILES['csv_file']['tmp_name'] ) and
			 ! empty( $_FILES['csv_file'] ) and
			 $_FILES['csv_file']['size'] > 0 ) {
			$res = $this->import_csv( $_FILES['csv_file']['tmp_name'] );
			if ( $res ) {
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

	private function import_csv( $file ): bool {
		//# Reading/Parsing CSV File
		$row = 1;
		$wrong_rows = 0;
		$cols = array();
		$saving_items = array();
		$scheduling_items = array();
		$handle = fopen( $file, 'r' );
		if ( false !== ( $handle ) ) {
			while ( ( $data = fgetcsv( $handle ) ) !== false ) {

				//# processing CSV Header
				if ( 1 == $row ) {
					if ( count( $data ) != 2 ) {
						//# Wrong number of cols in csv
						return false;
					} else {
						$idx = 0;
						foreach ( $data as $col ) {
							if ( is_string( $col ) ) {
								if ( is_string( $this->map_to_db_col( $col ) ) ) {
									if ( isset( $cols[ $this->map_to_db_col( $col ) ] ) ) {
										return false;
									} else {
										$cols[ $this->map_to_db_col( $col ) ] = $idx;
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

				$src_url = new Urlslab_Url( $data[ $cols['srcUrl'] ] );
				$dest_url = new Urlslab_Url( $data[ $cols['destUrl'] ] );


				if ( empty( $src_url ) or empty( $dest_url ) ) {
					$wrong_rows++;
					continue;
				} else {
					array_push( $scheduling_items, $src_url, $dest_url );
					$saving_items[] = array(
						$src_url,
						$dest_url,
					);
				}
				$row++;
			}
			fclose( $handle );
		}

		//# Scheduling Src and Dest URLs
		if ( ! $this->url_data_fetcher->prepare_url_batch_for_scheduling( $scheduling_items ) ) {
			return false;
		}
		//# Scheduling Src and Dest URLs

		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;
		$values = array();
		$placeholder = array();
		foreach ( $saving_items as $item ) {
			array_push(
				$values,
				$item[0]->get_url_id(),
				$item[1]->get_url_id(),
			);
			$placeholder[] = '(%s, %s)';
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query = "INSERT IGNORE INTO $table (
                   srcUrlMd5,
                   destUrlMd5) VALUES
                   $placeholder_string";

		$result = $wpdb->query(
			$wpdb->prepare(
				$update_query, // phpcs:ignore
				$values
			)
		);

		return is_numeric( $result );

	}

	private function export_csv_url_relations() {
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=urlslab-related-resources.csv' );
		$output = fopen( 'php://output', 'w' );
		fputcsv( $output, array( 'Src URL', 'Dest URL' ) );
		global $wpdb;
		$related_resource_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$urls_table = URLSLAB_URLS_TABLE;

		$query = "SELECT u.urlName AS srcUrlName,
				       v.urlName AS destUrlName
				FROM $related_resource_table r
				         INNER JOIN $urls_table as u
				                    ON r.srcUrlMd5 = u.urlMd5
				         INNER JOIN $urls_table as v
				                    ON r.destUrlMd5 = v.urlMd5
			    WHERE r.srcUrlMd5 <> r.destUrlMd5";
		$result = $wpdb->get_results( $query, ARRAY_N ); // phpcs:ignore
		foreach ( $result as $row ) {
			fputcsv(
				$output,
				array(
					urlslab_get_current_page_protocol() . $row[0],
					urlslab_get_current_page_protocol() . $row[1],
				)
			);
		}
		fclose( $output );
	}

	/**
	 * @param string $col_name
	 *
	 * @return false|string
	 */
	private function map_to_db_col( string $col_name ) {
		switch ( strtolower( trim( $col_name ) ) ) {
			case 'src url':
				return 'srcUrl';
			case 'dest url':
				return 'destUrl';
			default:
				return false;
		}
	}

	private function clear_url_relations() {
		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;

		$query = "TRUNCATE $table";
		$wpdb->query( $query ); // phpcs:ignore
	}

	private function init_sample_data() {
		$sample_urls = array();

		//try to load all titles with less than 4 words
		$posts = get_posts(
			array(
				'numberposts' => 1000,
				'orderby' => 'date',
				'order' => 'DESC',
			)
		);

		foreach ( $posts as $post ) {
			if ( $post->post_status == 'publish' ) {
				$sample_urls[] = get_permalink( $post->ID );
			}
		}
		$sample_urls = array_unique( $sample_urls );
		sort( $sample_urls, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL );

		foreach ( $sample_urls as $id => $url ) {
			$sample_urls[ $id ] = new Urlslab_Url( $url );
		}

		if ( ! $this->url_data_fetcher->prepare_url_batch_for_scheduling( $sample_urls ) ) {
			return false;
		}


		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;
		$values = array();
		$placeholder = array();

		$max = count( $sample_urls );
		for ( $i = 0; $i < $max; $i++ ) {
			for ( $j = $i + 1; $j < $max && $j < ( $i + 10 ); $j++ ) {
				array_push(
					$values,
					$sample_urls[ $i ]->get_url_id(),
					$sample_urls[ $j ]->get_url_id(),
				);
				$placeholder[] = '(%s, %s)';
			}
		}

		$placeholder_string = implode( ', ', $placeholder );
		$update_query = "INSERT IGNORE INTO $table (
                   srcUrlMd5,
                   destUrlMd5) VALUES
                   $placeholder_string";

		$result = $wpdb->query(
			$wpdb->prepare(
				$update_query, // phpcs:ignore
				$values
			)
		);

		return is_numeric( $result );
	}
}
