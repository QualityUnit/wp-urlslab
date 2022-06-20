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
			'col_keyword' => 'Keyword',
			'col_kw_priority' => 'Priority',
			'col_url_link' => 'URL',
			'col_lang' => 'Lang',
		);
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
			case 'col_keyword':
				return $item->get_keyword();
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
