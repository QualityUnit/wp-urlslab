<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Urlslab_Keyword_Link_Table extends WP_List_Table {

	/**
	 * @param array $row
	 *
	 * @return Urlslab_Url_Keyword_Data
	 */
	private function transform( array $row ): Urlslab_Url_Keyword_Data {
		return new Urlslab_Url_Keyword_Data(
			$row['keyword'],
			$row['kw_priority'],
			$row['kw_length'],
			$row['lang'],
			$row['urlLink']
		);
	}


	/**
	 * Getting URL Keywords
	 * @return array|stdClass[]
	 */
	private function get_keywords( int $limit, int $offset ): array {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;

		/* -- Preparing your query -- */
		$query = "SELECT * FROM $table";

		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'kw_priority';
		$order = ( isset( $_GET['order'] ) ) ? esc_sql( $_GET['order'] ) : 'ASC';
		if ( ! empty( $orderby ) && ! empty( $order ) ) {
			$query .= ' ORDER BY ' . $orderby . ' ' . $order . ', kw_length DESC'; }

		/* -- Pagination parameters -- */
		$query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$res = $wpdb->get_results( $query, ARRAY_A ); // phpcs:ignore
		$query_res = array();
		foreach ( $res as $row ) {
			$query_res[] = $this->transform( $row );
		}
		return $query_res;
	}

	/**
	 * @param string[] $delete_ids
	 *
	 * @return void
	 */
	private function delete_keywords( array $delete_ids ) {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		$placeholder = array();
		foreach ( $delete_ids as $id ) {
			$placeholder[] = '(%s)';
		}
		$placeholder_string = implode( ', ', $placeholder );
		$delete_query = "DELETE FROM $table WHERE keyword IN ($placeholder_string)";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$delete_ids
			)
		);
	}

	/**
	 * @param string $keyword
	 *
	 * @return void
	 */
	private function delete_keyword( string $keyword ) {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		$delete_query = "DELETE FROM $table WHERE keyword = %s";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$keyword
			)
		);
	}

	private function count_keywords(): ?string {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
			'cb' => '<input type="checkbox" />',
			'col_keyword' => 'Keyword',
			'col_kw_priority' => 'Priority',
			'col_url_link' => 'URL',
			'col_lang' => 'Lang',
		);
	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param Urlslab_Url_Keyword_Data $item
	 *
	 * @return string
	 */
	function column_cb( $item ): string {
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />',
			$item->get_keyword()
		);
	}

	/**
	 * Method for name column
	 *
	 * @param Urlslab_Url_Keyword_Data $item an array of DB data
	 *
	 * @return string
	 */
	function column_col_keyword( $item ): string {

		// create a nonce
		$delete_nonce = wp_create_nonce( 'urlslab_delete_keyword' );

		$title = '<strong>' . $item->get_keyword() . '</strong>';

		$actions = array();
		if ( isset( $_REQUEST['page'] ) ) {
			$actions = array(
				'delete' => sprintf(
					'<a href="?page=%s&action=%s&keyword=%s&_wpnonce=%s">Delete</a>',
					esc_attr( $_REQUEST['page'] ),
					'delete',
					esc_attr( $item->get_keyword() ),
					$delete_nonce
				),
			);
		}

		return $title . $this->row_actions( $actions );
	}

	/**
	 * Render a column when no column specific method exists.
	 *
	 * @param Urlslab_Url_Keyword_Data $item
	 * @param string $column_name
	 *
	 * @return bool|int|string
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'col_kw_priority':
				return $this->priority_ui_convert( $item->get_keyword_priority() );
			case 'col_url_link':
				return $item->get_keyword_url_link();
			case 'col_lang':
				return $item->get_keyword_url_lang();
			default:
				return print_r( $item, true );
		}
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
		isset( $_GET['keyword'] ) ) {

			// In our file that handles the request, verify the nonce.
			check_admin_referer( 'urlslab_delete_keyword' );

			$this->delete_keyword( $_GET['keyword'] );
		}


		// Bulk Delete triggered
		if ( ( isset( $_POST['action'] ) && 'bulk-delete' == $_POST['action'] )
			 || ( isset( $_POST['action2'] ) && 'bulk-delete' == $_POST['action2'] ) ) {

			if ( isset( $_POST['bulk-delete'] ) ) {
				$delete_ids = esc_sql( $_POST['bulk-delete'] );
				// loop over the array of record IDs and delete them
				$this->delete_keywords( $delete_ids );
			}       
		}
		$this->graceful_exit();
	}

	/**
	 * Decide which columns to activate the sorting functionality on
	 * @return array $sortable, the array of columns that can be sorted by the user
	 */
	public function get_sortable_columns(): array {
		return array(
			'col_keyword' => 'keyword',
			'col_kw_priority' => 'kw_priority',
			'col_lang' => 'lang',
		);
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {
		$this->process_bulk_action();


		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_keywords( $items_per_page, ( $table_page - 1 ) * $items_per_page );
		$total_count = $this->count_keywords();


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
		echo 'No Keywords to show';
	}

	private function priority_ui_convert( int $priority ): string {
		if ( $priority < 10 ) {
			return '<span class="color-success"> ' . $priority . '</span>';
		} else if ( $priority <= 20 ) {
			return '<span class="color-warning"> ' . $priority . '</span>';
		} else {
			return '<span class="color-danger"> ' . $priority . '</span>';
		}
	}

}
