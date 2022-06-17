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
	private function get_url_screenshots( int $limit, int $offset ): array {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;

		/* -- Preparing your query -- */
		$query = "SELECT * FROM $table";

		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'updateStatusDate';
		$order = ( isset( $_GET['order'] ) ) ? esc_sql( $_GET['order'] ) : 'ASC';
		if ( ! empty( $orderby ) && ! empty( $order ) ) {
			$query .= ' ORDER BY ' . $orderby . ' ' . $order; }

		/* -- Pagination parameters -- */
		$query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$res = $wpdb->get_results( $query, ARRAY_A ); // phpcs:ignore
		$query_res = array();
		foreach ( $res as $row ) {
			$query_res[] = $this->transform( $row );
		}
		return $query_res;
	}

	private function count_url_screenshots(): ?string {
		global $wpdb;
		$table = URLSLAB_URLS_TABLE;
		return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
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
		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_url_screenshots( $items_per_page, ( $table_page - 1 ) * $items_per_page );
		$total_count = $this->count_url_screenshots();


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
