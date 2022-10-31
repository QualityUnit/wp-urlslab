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
		return new Urlslab_Url_Keyword_Data( $row );
	}


	/**
	 * Getting URL Keywords
	 * @return array|stdClass[]
	 */
	private function get_keywords( string $keyword_search, string $lang, int $limit, int $offset ): array {
		global $wpdb;
		$table     = URLSLAB_KEYWORDS_TABLE;
		$map_table = URLSLAB_KEYWORDS_MAP_TABLE;
		$values    = array();

		/* -- Preparing your query -- */
		$query = "SELECT
						v.kw_id				   AS kw_id,
						v.keyword              AS keyword,
						v.kw_priority          AS kw_priority,
						v.kw_length            AS kw_length,
						v.lang                 AS lang,
						v.urlLink              AS urlLink,
						v.urlFilter            AS urlFilter,
						v.kwType               AS kwType,
						SUM(!ISNULL(d.urlMd5)) AS keywordCountUsage,
						SUM(!ISNULL(d.destUrlMd5)) AS linkCountUsage
					FROM $table AS v
					LEFT JOIN $map_table AS d ON d.kw_id = v.kw_id";

		/* -- Preparing the condition -- */
		if ( ! empty( $keyword_search ) ) {
			$query    .= ' WHERE keyword LIKE %s';
			$values[] = '%' . $keyword_search . '%';
		}

		if ( ! empty( $keyword_search ) && ! empty( $lang ) ) {
			$query    .= ' AND lang = %s';
			$values[] = $lang;
		} else if ( ! empty( $lang ) && empty( $keyword_search ) ) {
			$query    .= ' WHERE lang = %s';
			$values[] = $lang;
		}


		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$query   .= ' GROUP BY kw_id';
		$orderby = ( isset( $_GET['orderby'] ) ) ? esc_sql( $_GET['orderby'] ) : 'kw_priority';
		$order   = ( isset( $_GET['order'] ) ) ? esc_sql( $_GET['order'] ) : 'ASC';
		if ( ! empty( $orderby ) && ! empty( $order ) ) {
			$query .= ' ORDER BY ' . $orderby . ' ' . $order . ', kw_length DESC';
		}

		/* -- Pagination parameters -- */
		$query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$res   = array();
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
		$table       = URLSLAB_KEYWORDS_TABLE;
		$placeholder = array();
		foreach ( $delete_ids as $id ) {
			$placeholder[] = '(%s)';
		}
		$placeholder_string = implode( ', ', $placeholder );
		$delete_query       = "DELETE FROM $table WHERE kw_id IN ($placeholder_string)";
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
		$table        = URLSLAB_KEYWORDS_TABLE;
		$delete_query = "DELETE FROM $table WHERE kw_id = %s";
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
			'cb'                 => '<input type="checkbox" />',
			'col_keyword'        => 'Keyword',
			'col_url_link'       => 'Destination URL',
			'col_kw_priority'    => 'Priority',
			'col_lang'           => 'Lang',
			'col_url_filter'     => 'Url Filter [Regexp]',
			'col_kwType'         => 'Type',
			'col_kw_usage_cnt'   => 'Keyword Usage Count',
			'col_link_usage_cnt' => 'Link Usage Count',
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
			$item->get_kw_id()
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

		$title   = '<strong>' . $item->get_keyword() . '</strong>';
		$actions = array();
		if ( isset( $_REQUEST['page'] ) ) {
			$actions = array(
				'delete' => sprintf(
					'<a href="?page=%s&s=%s&action=%s&kw_md5=%s&_wpnonce=%s">Delete</a>',
					esc_attr( $_REQUEST['page'] ),
					esc_html( $_REQUEST['s'] ?? '' ),
					'delete',
					esc_attr( $item->get_kw_id() ),
					$delete_nonce
				),
				'edit'   => sprintf(
					'<span class="%s" rel="modal:open" data-close-icon="%s" data-keyword-hash="%s" data-keyword="%s" data-dest-url="%s" data-prio="%s" data-lang="%s" data-url-filter="%s">Edit</span>',
					'keyword-edit color-primary',
					esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ),
					esc_attr( $item->get_kw_id() ),
					esc_attr( $item->get_keyword() ),
					esc_attr( $item->get_keyword_url_link() ),
					esc_attr( $item->get_keyword_priority() ),
					esc_attr( $item->get_keyword_url_lang() ),
					esc_attr( $item->get_keyword_url_filter() ),
				),
			);
		}

		return $title . $this->row_actions( $actions );
	}

	function column_col_kw_usage_cnt( $item ): string {
		$title   = '<span>' . $item->get_keyword_usage_count() . '</span>';
		$actions = array();
		if ( isset( $_REQUEST['page'] ) ) {
			$actions = array(
				'usage' => sprintf(
					'<span class="keyword-map-show urlslab-ajax-show" data-kw-id="%s">Where is used?</span>',
					$item->get_kw_id()
				),
			);
		}

		return $title . $this->row_actions( $actions );
	}

	function column_col_link_usage_cnt( $item ): string {
		return '<span>' . $item->get_link_usage_count() . '</span>';
	}

	function column_col_kwType( $item ): string {
		switch ( $item->get_keyword_type() ) {
			case Urlslab_Keywords_Links::KW_IMPORTED:
				return '<span>Auto-Imported</span>';
			case Urlslab_Keywords_Links::KW_MANUAL:
			default:
				return '<span>Manual</span>';
		}
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
				$value = '<a href="' . $item->get_keyword_url_link() . '" target="_blank">' . $item->get_keyword_url_link() . '</a>';
				$id    = url_to_postid( urlslab_add_current_page_protocol( $item->get_keyword_url_link() ) );
				if ( $id ) {
					$value .= ' <a class="keyword-map-show urlslab-ajax-show" href="' . get_edit_post_link( $id ) . '" target="_blank">edit post</a>';
				}

				return $value;
			case 'col_url_filter':
				return $item->get_keyword_url_filter();
			case 'col_lang':
				return $item->get_keyword_url_lang();
			case 'col_kw_md5':
				return $item->get_kw_id();
			case 'col_kw_usage_cnt':
				return $item->get_keyword_usage_count();
			case 'col_kwType':
				return $item->get_keyword_type();
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
		if (
			'delete' === $this->current_action() &&
			isset( $_GET['kw_md5'] ) &&
			isset( $_REQUEST['_wpnonce'] )
		) {

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
		if (
			( isset( $_GET['action'] ) && 'bulk-delete' == $_GET['action'] )
			|| ( isset( $_GET['action2'] ) && 'bulk-delete' == $_GET['action2'] )
		) {

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
			'col_keyword'        => 'keyword',
			'col_kw_priority'    => 'kw_priority',
			'col_lang'           => 'lang',
			'col_kw_usage_cnt'   => 'keywordCountUsage',
			'col_link_usage_cnt' => 'linkCountUsage',
			'col_kw_type'        => 'kwType',
		);
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {

		$keyword_search_key  = isset( $_REQUEST['s'] ) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';
		$keyword_lang_filter = $_GET['lang'] ?? '';

		$this->process_bulk_action();


		$table_page     = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_keywords(
			$keyword_search_key,
			$keyword_lang_filter,
			$items_per_page,
			( $table_page - 1 ) * $items_per_page
		);
		$total_count   = $this->count_keywords();


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
