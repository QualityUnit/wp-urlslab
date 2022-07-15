<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/partials/tables/class-urlslab-related-resources-widget-table.php';

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-related-resources';

	private string $widget_title = 'Related Resources';

	private string $widget_description = 'Urlslab Widget Related Resources - show contextually related pages';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Related_Resources_Widget_Table $related_resources_widget_table;

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->url_data_fetcher = $url_data_fetcher;
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}

	public function hook_callback() {
		add_shortcode( $this->widget_slug, array( $this, 'get_shortcode_content' ) );
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

	public function load_widget_page() {
		?>
		<div class="wrap">
			<h2>Related Resources</h2>
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
					$this->related_resources_widget_table->prepare_items();
					?>
					<input type="hidden" name="page" value="<?php echo esc_attr( $this->widget_slug ); ?>">
					<?php
					$this->related_resources_widget_table->search_box( 'Search', 'urlslab-keyword-input' );
					$this->related_resources_widget_table->display();
					?>
				</form>
			</div>

		</div>
		<?php
	}

	public function widget_admin_load() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' == $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 -1 != $_REQUEST['action'] and
			 'import' == $_REQUEST['action']) {
			// Import/Export option
			check_admin_referer( 'related-resource-widget-import' );
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
			header( 'Content-Disposition: attachment; filename=urlslab-related-resources.csv' );
			$output = fopen( 'php://output', 'w' );
			fputcsv( $output, array('Src URL', 'Dest URL') );
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
			$result = $wpdb->get_results( $query, ARRAY_N );
			foreach ($result as $row) {
				fputcsv(
					$output,
					array(
						urlslab_get_current_page_protocol() . $row[0],
						urlslab_get_current_page_protocol() . $row[1],
					)
				);
			}
			fclose( $output );
			die();
		} else {
			$option = 'per_page';
			$args = array(
				'label' => 'Relations',
				'default' => 50,
				'option' => 'users_per_page',
			);

			add_screen_option( $option, $args );

			$this->related_resources_widget_table = new Urlslab_Related_Resources_Widget_Table();
		}
	}

	private function user_overall_option() {
		?>
		<div class="card float-left">
			<h2>Import/Export Related Resources CSV</h2>
			<div class="info-box">
				The CSV file should contain headers. the CSV file should include following headers:
				<ul>
					<li class="color-danger">src URL (required)</li>
					<li class="color-danger">dest URL (required)</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->admin_widget_menu_page( 'action=import' ) ); ?>" method="post" enctype="multipart/form-data">
				<?php wp_nonce_field( 'related-resource-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button import_related_resource_csv" value="Import">
				<a href="<?php echo esc_url( $this->admin_widget_menu_page( 'action=export' ) ); ?>" target="_blank" class="button export_keyword_csv">Export</a>
			</form>
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

	private function save_csv_to_db( $file ): bool {
		//# Reading/Parsing CSV File
		$row = 1;
		$wrong_rows = 0;
		$cols = array();
		$saving_items = array();
		$scheduling_items = array();
		$handle = fopen( $file, 'r' );
		if ( false !== ( $handle ) ) {
			while (( $data = fgetcsv( $handle ) ) !== false) {

				//# processing CSV Header
				if ($row == 1) {
					if (count( $data ) != 2) {
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

				$src_url = new Urlslab_Url( $data[$cols['srcUrl']] );
				$dest_url = new Urlslab_Url( $data[$cols['destUrl']] );



				if (empty( $src_url ) or empty( $dest_url ) ) {
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
		if (!$this->url_data_fetcher->prepare_url_batch_for_scheduling( $scheduling_items )) {
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

	/**
	 * @param string $col_name
	 *
	 * @return false|string
	 */
	private function map_to_db_col( string $col_name ) {
		switch (strtolower( trim( $col_name ) )) {
			case 'src url':
				return 'srcUrl';
			case 'dest url':
				return 'destUrl';
			default:
				return false;
		}
	}


	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Related Resources';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Related Resources';
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );
		global $wpdb;

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => urlslab_get_current_page_protocol() . get_current_page_url()->get_url(),
				'related-count'           => 8,
				'show-image'          => false,
				'default-image'   => '',
			),
			$atts,
			$tag
		);

		$result = $this->url_data_fetcher->fetch_related_urls_to(
			new Urlslab_Url( $urlslab_atts['url'] ),
			$urlslab_atts['related-count']
		);

		if ( ! empty( $result ) ) {
			$content = $this->render_shortcode_header();
			foreach ( $result as $url ) {
				$content .= $this->render_shortcode_item( $url, $urlslab_atts );
			}
			return $content . $this->render_shortcode_footer();
		}
		return '';
	}

	public function has_shortcode(): bool {
		return true;
	}

	private function render_shortcode_header(): string {
		return '<ul>';
	}

	private function render_shortcode_footer(): string {
		return '</ul>';
	}

	private function render_shortcode_item( Urlslab_Url_Data $url, array $urlslab_atts ): string {
		$title = $url->get_url_title();
		if ( empty( $title ) ) {
			return '';
		}

		return '<li urlslab-skip="true">' .
			'<a href="' . esc_url( urlslab_get_current_page_protocol() . $url->get_url()->get_url() ) . '"' .
			' title="' . esc_attr( $url->get_url_summary_text() ) . '"' .
			( urlslab_is_same_domain_url( $url->get_url()->get_url() ) ? '' : ' target="_blank"' ) .
			'urlslab-skip="true">' .
			$this->render_screenshot( $url, $urlslab_atts ) .
			esc_html( $title ) .
			'</a>' .
			'</li>';
	}

	private function render_screenshot( Urlslab_Url_Data $url, array $urlslab_atts ): string {
		if ( ( $urlslab_atts['show-image'] === true || $urlslab_atts['show-image'] == 'true' )
			 && $url->screenshot_exists() ) {
			return '<img alt="' .
				esc_attr( $url->get_url_summary_text() ) .
				'" src="' . $url->render_screenshot_path( 'thumbnail' ) . '">';
		}
		return '';
	}

}
