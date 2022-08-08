<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Urlslab_Offloader_Table extends WP_List_Table {

	private function transform( array $row ): Urlslab_File_Data {
		return new Urlslab_File_Data( $row );
	}

	/**
	 * @param string $search_key the searching key to search for
	 * @param int $limit the limit of the results
	 * @param int $offset the offset of results for pagination
	 *
	 * @return array
	 */
	private function get_offloading_files( string $search_key, int $limit, int $offset ): array {
		global $wpdb;
		$table = URLSLAB_FILES_TABLE;
		$values = array();

		/* -- Preparing your query -- */
		$query = "SELECT * FROM $table";

		/* -- Preparing the condition -- */
		if ( ! empty( $search_key ) ) {
			$query .= ' WHERE filename LIKE %s OR url LIKE %s';
			$values[] = '%' . $search_key . '%';
			$values[] = '%' . $search_key . '%';
		}


		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'fileid';
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
	 * @return mixed count for pagination
	 */
	private function count_offloading_files() {
		global $wpdb;
		$table = URLSLAB_FILES_TABLE;
		return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
			'col_url' => 'Url',
			'col_local_file' => 'Local File',
			'col_filename' => 'File Name',
			'col_file_size' => 'File Size',
			'col_file_type' => 'File Type',
			'col_width' => 'Width',
			'col_height' => 'Height',
			'col_file_status' => 'File Status',
			'col_driver' => 'Driver',
			'col_last_seen' => 'Last Seen',
		);
	}

	/**
	 * Render a column when no column specific method exists.
	 *
	 * @param Urlslab_File_Data $item
	 * @param string $column_name
	 *
	 * @return bool|int|string
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'col_url':
				return sprintf(
					'<a target="_blank" href="%s">%s</a>',
					esc_url( $item->get_url() ),
					substr( $item->get_url(), 0, 70 )
				);
			case 'col_local_file':
				return sprintf(
					'<span title="%s">%s</span>',
					esc_attr( $item->get_local_file() ),
					substr( $item->get_local_file(), 0, 70 )
				);
			case 'col_filename':
				return sprintf(
					'<span title="%s">%s</span>',
					esc_attr( $item->get_filename() ),
					substr( $item->get_filename(), 0, 70 )
				);
			case 'col_file_size':
				return (int) $item->get_filesize() / 1000 . ' KB';
			case 'col_file_type':
				return $item->get_filetype();
			case 'col_width':
				return $item->get_width();
			case 'col_height':
				return $item->get_height();
			case 'col_file_status':
				return $this->status_to_html( $item->get_filestatus() );
			case 'col_driver':
				return $this->driver_to_html( $item->get_driver() );
			case 'col_last_seen':
				return $item->get_last_seen();
			default:
				return print_r( $item, true );
		}
	}

	public function process_bulk_action() {}

	/**
	 * Decide which columns to activate the sorting functionality on
	 * @return array $sortable, the array of columns that can be sorted by the user
	 */
	public function get_sortable_columns(): array {
		return array(
			'col_file_size' => 'filesize',
		);
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {

		$offloading_search_key = isset( $_REQUEST['s'] ) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';
		$this->process_bulk_action();

		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_offloading_files(
			$offloading_search_key,
			$items_per_page,
			( $table_page - 1 ) * $items_per_page
		);
		$total_count = $this->count_offloading_files();


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
		echo 'No Media offloading available';
	}

	private function status_to_html( string $file_status ): string {
		switch ( $file_status ) {
			case Urlslab_Driver::STATUS_ACTIVE:
				return '<div class="status-circle background-success" title="available"></div>';

			case Urlslab_Driver::STATUS_NEW:
				return '<div class="status-circle background-secondary" title="not-scheduled"></div>';

			case Urlslab_Driver::STATUS_PENDING:
				return '<div class="status-circle background-warning" title="pending"></div>';

			case Urlslab_Driver::STATUS_ERROR:
				return '<div class="status-circle background-danger" title="blocked"></div>';

			default:
				return $file_status;
		}
	}

	private function driver_to_html( string $driver ): string {
		switch ( $driver ) {
			case Urlslab_Driver::DRIVER_LOCAL_FILE:
				return sprintf(
					'<img src="%s" title="%s" alt="%s" width="30px" height="30px">',
					plugin_dir_url( URLSLAB_PLUGIN_DIR . 'admin/assets/cloud.png' ) . 'folder-outline.png',
					'Local File Driver',
					'Local File Driver',
				);

			case Urlslab_Driver::DRIVER_DB:
				return sprintf(
					'<img src="%s" title="%s" alt="%s" width="30px" height="30px">',
					plugin_dir_url( URLSLAB_PLUGIN_DIR . 'admin/assets/cloud.png' ) . 'database.png',
					'Database Driver',
					'Database Driver',
				);

			case Urlslab_Driver::DRIVER_S3:
				return sprintf(
					'<img src="%s" title="%s" alt="%s" width="30px" height="30px">',
					plugin_dir_url( URLSLAB_PLUGIN_DIR . 'admin/assets/cloud.png' ) . 'cloud.png',
					'AWS S3 Driver',
					'AWS S3 Driver',
				);

			default:
				return $driver;
		}
	}

}
