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
			$row['urlLink'],
			$row['urlFilter']
		);
	}


	/**
	 * Getting URL Keywords
	 * @return array|stdClass[]
	 */
	private function get_keywords( string $keyword_search, int $limit, int $offset ): array {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		$values = array();

		/* -- Preparing your query -- */
		$query = "SELECT * FROM $table";

		/* -- Preparing the condition -- */
		if ( ! empty( $keyword_search ) ) {
			$query .= ' WHERE keyword LIKE %s';
			$values[] = '%' . $keyword_search . '%';
		}


		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'kw_priority';
		$order = ( isset( $_GET['order'] ) ) ? esc_sql( $_GET['order'] ) : 'ASC';
		if ( ! empty( $orderby ) && ! empty( $order ) ) {
			$query .= ' ORDER BY ' . $orderby . ' ' . $order . ', kw_length DESC'; }

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
		$delete_query = "DELETE FROM $table WHERE kwMd5 IN ($placeholder_string)";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$delete_ids
			)
		);
	}

	/**
	 * @param string $kw_md5
	 *
	 * @return void
	 */
	private function delete_keyword( string $kw_md5 ) {
		global $wpdb;
		$table = URLSLAB_KEYWORDS_TABLE;
		$delete_query = "DELETE FROM $table WHERE kwMd5 = %s";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$kw_md5
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
			'col_url_link' => 'Destination URL',
			'col_kw_priority' => 'Priority',
			'col_lang' => 'Lang',
			'col_url_filter' => 'Url Filter [Regexp]',
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
			$item->get_kw_md5()
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
			?>
			<div id='<?php echo esc_attr( 'modal-k-' . $item->get_kw_md5() ); ?>' class='modal'>
				<div>
					<h2>Edit Keyword</h2>
					<button id='close-import-modal' data-close-modal-id='<?php echo esc_attr( 'modal-k-' . $item->get_kw_md5() ); ?>' class='modal-close'>
						<img src='<?php esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>' alt='info' width='17px' />
					</button>
				</div>
				<form method='post' action='?page=<?php echo esc_attr( $_REQUEST['page'] ); ?>&action=keyword-edit'>
					<input type='hidden' name='keywordHash' value='<?php echo esc_attr( $item->get_kw_md5() ); ?>'>
					<label for='keyword'>Keyword: </label>
					<input id='keyword' name='keyword' type='text' value='<?php echo esc_attr( $item->get_keyword() ); ?>' placeholder='Keyword...'>
					<br class='clear'/>
					<br class='clear'/>
					<label for='keyword-link'>Keyword Link: </label>
					<input id='keyword-link' name='keyword-link' type='text' value='<?php echo esc_attr( $item->get_keyword_url_link() ); ?>' placeholder='KeywordLink...'>
					<br class='clear'/>
					<br class='clear'/>
					<label for='keyword-prio'>Keyword Priority: </label>
					<input id='keyword-prio' name='keyword-prio' type='text' value='<?php echo esc_attr( $item->get_keyword_priority() ); ?>' placeholder='Keyword Prio...'>
					<br class='clear'/>
					<br class='clear'/>
					<label for='keyword-lang'>Keyword Lang: </label>
					<input id='keyword-lang' name='keyword-lang' type='text' value='<?php echo esc_attr( $item->get_keyword_url_lang() ); ?>'
						   placeholder='Keyword Lang...'>
					<br class='clear'/>
					<br class='clear'/>
					<label for='keyword-url-filter'>Keyword Url Filter: </label>
					<input id='keyword-url-filter' name='keyword-url-filter' type='text' value='<?php echo esc_attr( $item->get_keyword_url_filter() ); ?>'
						   placeholder='Keyword Url Filter...'>
					<br class='clear'/>
					<br class='clear'/>
					<input type='submit' name='submit' class='button' value='Edit Keyword'>
				</form>
			</div>
			<?php

			$actions = array(
				'delete' => sprintf(
					'<a href="?page=%s&s=%s&action=%s&kw_md5=%s&_wpnonce=%s">Delete</a>',
					esc_attr( $_REQUEST['page'] ),
					esc_html( $_REQUEST['s'] ?? '' ),
					'delete',
					esc_attr( $item->get_kw_md5() ),
					$delete_nonce
				),
				'edit' => sprintf(
					'<span class="%s" data-modal-id="%s">Edit</span>',
					'keyword-edit color-primary',
					'modal-k-' . $item->get_kw_md5(),
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
			case 'col_url_filter':
				return $item->get_keyword_url_filter();
			case 'col_lang':
				return $item->get_keyword_url_lang();
			case 'col_kw_md5':
				return $item->get_kw_md5();
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
		isset( $_GET['kw_md5'] ) &&
		isset( $_REQUEST['_wpnonce'] ) ) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_delete_keyword' ) ) { // verify the nonce.
				wp_redirect(
					add_query_arg(
						'status=failure',
						'message=this link is expired'
					)
				);
				exit();
			}

			$this->delete_keyword( $_GET['kw_md5'] );
		}


		// Bulk Delete triggered
		if ( ( isset( $_GET['action'] ) && 'bulk-delete' == $_GET['action'] )
			 || ( isset( $_GET['action2'] ) && 'bulk-delete' == $_GET['action2'] ) ) {

			if ( isset( $_GET['bulk-delete'] ) ) {
				$delete_ids = esc_sql( $_GET['bulk-delete'] );
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

		$keyword_search_key = isset( $_REQUEST['s'] ) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';

		$this->process_bulk_action();


		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_keywords(
			$keyword_search_key,
			$items_per_page,
			( $table_page - 1 ) * $items_per_page
		);
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
