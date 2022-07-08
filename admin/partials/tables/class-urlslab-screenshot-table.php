<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Urlslab_Screenshot_Table extends WP_List_Table {

	/**
	 * @param array $row
	 *
	 * @return Urlslab_Url_Data
	 */
	private function transform( array $row ): Urlslab_Url_Data {
		return new Urlslab_Url_Data(
			new Urlslab_Url( parse_url( get_site_url(), PHP_URL_SCHEME ) . '://' . $row['urlName'] ),
			$row['domainId'],
			$row['urlId'],
			$row['screenshotDate'],
			$row['updateStatusDate'],
			$row['urlTitle'],
			$row['urlMetaDescription'],
			$row['urlSummary'],
			$row['status'],
		);
	}


	/**
	 * Getting url screenshot
	 * @return array|stdClass[]
	 */
	private function get_url_screenshots( string $url_status_filter, string $url_search_key, int $limit, int $offset ): array {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$values = array();

		/* -- Preparing your query -- */
		$query = "SELECT * FROM $table";

		/* -- Preparing the condition -- */
		if ( ! empty( $url_status_filter ) ) {
			$query .= ' WHERE status = %s';
			$values[] = $url_status_filter;
		}

		if ( ! empty( $url_search_key ) && ! empty( $url_status_filter ) ) {
			$query .= ' AND urlName LIKE %s';
			$values[] = '%' . $url_search_key . '%';
		} else if ( ! empty( $url_search_key ) && empty( $url_status_filter ) ) {
			$query .= ' WHERE urlName LIKE %s';
			$values[] = '%' . $url_search_key . '%';
		}


		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'updateStatusDate';
		$order = ( isset( $_GET['order'] ) ) ? esc_sql( $_GET['order'] ) : 'ASC';
		if ( ! empty( $orderby ) && ! empty( $order ) ) {
			$query .= ' ORDER BY ' . $orderby . ' ' . $order; }

		/* -- Pagination parameters -- */
		$query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$res = array();
		if ( empty( $values ) ) {
			$res = $wpdb->get_results(
				$query, // phpcs:ignore
				ARRAY_A
			);
		} else {
			$res = $wpdb->get_results(
				$wpdb->prepare(
					$query, // phpcs:ignore
					$values
				),
				ARRAY_A
			);
		}

		$query_res = array();
		foreach ( $res as $row ) {
			$query_res[] = $this->transform( $row );
		}
		return $query_res;
	}

	/**
	 * @param string[] $url_ids
	 *
	 * @return void
	 */
	private function delete_url_screenshots( array $url_ids ) {
		if ( count( $url_ids ) <= 0 ) {
			return;
		}
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$placeholder = array();
		foreach ( $url_ids as $id ) {
			$placeholder[] = '(%s)';
		}
		$placeholder_string = implode( ', ', $placeholder );
		$delete_query = "DELETE FROM $table WHERE urlMd5 IN ($placeholder_string)";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$url_ids
			)
		);
	}

	private function delete_url_screenshot( string $url_md5 ) {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$delete_query = "DELETE FROM $table WHERE urlMd5 = %s";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$url_md5
			)
		);
	}

	private function count_url_screenshots( string $url_status_filter = '', $url_search_key = '' ): ?string {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		$values = array();

		/* -- Preparing your query -- */
		$query = "SELECT COUNT(*) AS cnt FROM $table";

		/* -- Preparing the condition -- */
		if ( ! empty( $url_status_filter ) ) {
			$query .= ' WHERE status = %s';
			$values[] = $url_status_filter;
		}

		if ( ! empty( $url_search_key ) && ! empty( $url_status_filter ) ) {
			$query .= ' AND urlName LIKE %s';
			$values[] = '%' . $url_search_key . '%';
		} else if ( ! empty( $url_search_key ) && empty( $url_status_filter ) ) {
			$query .= ' WHERE urlName LIKE %s';
			$values[] = '%' . $url_search_key . '%';
		}

		if ( empty( $values ) ) {
			return $wpdb->get_row(
					$query, // phpcs:ignore
				ARRAY_A
			)['cnt'];
		} else {
			return $wpdb->get_row(
				$wpdb->prepare(
					$query, // phpcs:ignore
					$values
				),
				ARRAY_A
			)['cnt'];
		}
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
			'cb' => '<input type="checkbox" />',
			'col_url_image' => 'Image',
			'col_url_name' => 'URL',
			'col_status' => 'Status',
			'col_screenshot_date' => 'Screenshot Date',
			'col_update_status_date' => 'Last Status Date',
			'col_url_title' => 'Url Title',
			'col_url_meta_description' => 'Url Meta Description',
			'col_url_summary' => 'Url Summary',
		);
	}

	protected function get_views(): array {
		$views = array();
		$current = ( ! empty( $_REQUEST['filter'] ) ? $_REQUEST['filter'] : 'all' );

		//# All case
		$class = ( 'all' == $current ? ' class="current"' : '' );
		$all_url = remove_query_arg( 'filter' );
		$all_count = $this->count_url_screenshots();
		$views['all'] = "<a href='$all_url' $class>All <span class='count'>($all_count)</span></a>";
		//# All case

		//# Unscheduled case
		$class = ( Urlslab::$link_status_not_scheduled == $current ? ' class="current"' : '' );
		$unscheduled_url = add_query_arg( 'filter', Urlslab::$link_status_not_scheduled );
		$unscheduled_count = $this->count_url_screenshots( Urlslab::$link_status_not_scheduled );
		$views['unscheduled'] = "<a href='$unscheduled_url' $class>Unscheduled <span class='count'>($unscheduled_count)</span></a>";
		//# Unscheduled case

		//# Active case
		$class = ( Urlslab::$link_status_available == $current ? ' class="current"' : '' );
		$active_url = add_query_arg( 'filter', Urlslab::$link_status_available );
		$active_count = $this->count_url_screenshots( Urlslab::$link_status_available );
		$views['active'] = "<a href='$active_url' $class>Available <span class='count'>($active_count)</span></a>";
		//# Active case

		//# Pending case
		$class = ( Urlslab::$link_status_waiting_for_screenshot == $current ? ' class="current"' : '' );
		$pending_url = add_query_arg( 'filter', Urlslab::$link_status_waiting_for_screenshot );
		$pending_count = $this->count_url_screenshots( Urlslab::$link_status_waiting_for_screenshot );
		$views['pending'] = "<a href='$pending_url' $class>Pending <span class='count'>($pending_count)</span></a>";
		//# Pending case

		//# Broken url case
		$class = ( Urlslab::$link_status_broken == $current ? ' class="current"' : '' );
		$broken_url = add_query_arg( 'filter', Urlslab::$link_status_broken );
		$broken_count = $this->count_url_screenshots( Urlslab::$link_status_broken );
		$views['broken'] = "<a href='$broken_url' $class>Broken <span class='count'>($broken_count)</span></a>";
		//# Broken url case

		return $views;
	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param Urlslab_Url_Data $item
	 *
	 * @return string
	 */
	function column_cb( $item ): string {
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />',
			$item->get_url()->get_url_id()
		);
	}

	/**
	 * Returns an associative array containing the bulk action
	 *
	 * @return array
	 */
	public function get_bulk_actions(): array {
		return array(
			'bulk-delete' => 'Delete',
		);
	}

	public function process_bulk_action() {
		//Detect when a bulk action is being triggered...
		if ( 'delete' === $this->current_action() &&
			 isset( $_GET['screenshot'] ) &&
			 isset( $_REQUEST['_wpnonce'] ) ) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_delete_screenshot' ) ) { // verify the nonce.
				wp_redirect(
					add_query_arg(
						'status=failure',
						'message=this link is expired'
					)
				);
				exit();
			}

			$this->delete_url_screenshot( $_GET['screenshot'] );
		}


		// Bulk Delete triggered
		if ( ( isset( $_GET['action'] ) && 'bulk-delete' == $_GET['action'] )
			 || ( isset( $_GET['action2'] ) && 'bulk-delete' == $_GET['action2'] ) ) {

			if ( isset( $_GET['bulk-delete'] ) ) {
				$delete_ids = esc_sql( $_GET['bulk-delete'] );
				// loop over the array of record IDs and delete them
				$this->delete_url_screenshots( $delete_ids );
			}
		}
		$this->graceful_exit();
	}

	/**
	 * Render a column when no column specific method exists.
	 *
	 * @param Urlslab_Url_Data $item
	 * @param string $column_name
	 *
	 * @return mixed
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'col_url_image':
				if ( $item->screenshot_exists() ) {
					return '<img src="' . $item->render_screenshot_path() . '" width="150px">';
				}
				return '<em>Not available!</em>';
			case 'col_url_name':
				return $item->get_url()->get_url();
			case 'col_status':
				return urlslab_status_ui_convert( $item->get_screenshot_status() );
			case 'col_screenshot_date':
				if ( $item->get_screenshot_date() == 0 ) {
					return '<em>Not available!</em>';
				} else {
					return gmdate( 'Y-m-d', $item->get_screenshot_date() );
				}
			case 'col_update_status_date':
				return $item->get_last_status_change_date();
			case 'col_url_title':
				return $item->get_url_title();
			case 'col_url_meta_description':
				return $item->get_url_meta_description() ?? '';
			case 'col_url_summary':
				return $item->get_url_summary() ?? '';
			default:
				return print_r( $item, true ); //Show the whole array for troubleshooting purposes
		}
	}

	/**
	 * Method for name column
	 *
	 * @param Urlslab_Url_Data $item an array of DB data
	 *
	 * @return string
	 */
	function column_col_url_name( $item ): string {

		// create a nonce
		$delete_nonce = wp_create_nonce( 'urlslab_delete_screenshot' );

		$title = '<strong>' . $item->get_url()->get_url() . '</strong>';

		$actions = array();
		if ( isset( $_REQUEST['page'] ) ) {
			$actions = array(
				'delete' => sprintf(
					'<a href="?page=%s&action=%s&screenshot=%s&_wpnonce=%s">Delete</a>',
					esc_attr( $_REQUEST['page'] ),
					'delete',
					esc_attr( $item->get_url()->get_url_id() ),
					$delete_nonce
				),
			);
		}

		return $title . $this->row_actions( $actions );
	}

	/**
	 * Decide which columns to activate the sorting functionality on
	 * @return array $sortable, the array of columns that can be sorted by the user
	 */
	public function get_sortable_columns(): array {
		return array(
			'col_url_name' => 'urlName',
			'col_update_status_date' => 'updateStatusDate',
		);
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {
		$url_search_key = isset( $_REQUEST['s'] ) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';
		$url_status_filter = isset( $_REQUEST['filter'] ) ? wp_unslash( trim( $_REQUEST['filter'] ) ) : '';
		$this->process_bulk_action();
		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_url_screenshots(
			$url_status_filter,
			$url_search_key,
			$items_per_page,
			( $table_page - 1 ) * $items_per_page
		);
		$total_count = $this->count_url_screenshots(
			$url_status_filter,
			$url_search_key,
		);


		// set the pagination arguments
		$this->set_pagination_args(
			array(
				'total_items' => $total_count,
				'per_page'    => $items_per_page,
				'total_pages' => ceil( $total_count / $items_per_page ),
			) 
		);

		$this->items = $query_results;
	}

	public function no_items() {
		echo 'No Schedules available';
	}

}
