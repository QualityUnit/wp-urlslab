<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Urlslab_Related_Resources_Widget_Table extends WP_List_Table {

	/**
	 * @param array $row
	 *
	 * @return Urlslab_Url_Data[]
	 */
	private function transform( array $row ): array {
		return array(
			new Urlslab_Url_Data(
				new Urlslab_Url( 'http://' . $row['srcUrlName'] ),
				$row['srcDomainId'],
				$row['srcUrlId'],
				$row['srcScreenshotDate'],
				0,
				null,
				null,
				null,
				null,
				$row['srcStatus'],
			),
			new Urlslab_Url_Data(
				new Urlslab_Url( 'http://' . $row['destUrlName'] ),
				$row['destDomainId'],
				$row['destUrlId'],
				$row['destScreenshotDate'],
				0,
				null,
				null,
				null,
				null,
				$row['destStatus'],
			),
			$row['pos'],
		);
	}


	/**
	 * Getting URL Keywords
	 * @return array|stdClass[]
	 */
	private function get_related_resources( string $search_term, int $limit, int $offset ): array {
		global $wpdb;
		$related_resource_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$urls_table             = URLSLAB_URLS_TABLE;
		$values                 = array();

		/* -- Preparing your query -- */
		$query = "SELECT u.urlName AS srcUrlName,
				       u.domainId AS srcDomainId,
				       u.urlId AS  srcUrlId,
				       u.screenshotDate AS srcScreenshotDate,
				       u.status AS srcStatus,
				       v.urlName AS destUrlName,
				       v.domainId AS destDomainId,
				       v.urlId AS destUrlId,
				       v.screenshotDate AS destScreenshotDate,
				       v.status AS destStatus,
				       r.pos AS pos
				FROM $related_resource_table r
				         INNER JOIN $urls_table as u
				                    ON r.srcUrlMd5 = u.urlMd5
				         INNER JOIN $urls_table as v
				                    ON r.destUrlMd5 = v.urlMd5";

		/* -- Preparing the condition -- */
		if ( ! empty( $search_term ) ) {
			$query    .= ' WHERE u.urlName LIKE %s OR v.urlName LIKE %s';
			$values[] = '%' . $search_term . '%';
			$values[] = '%' . $search_term . '%';
		}


		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$query .= ' ORDER BY srcUrlMd5 ASC, r.pos';

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
			try {
				$query_res[] = $this->transform( $row );
			} catch ( Exception $e ) {
			}
		}

		return $query_res;
	}

	private function delete_url_relation( int $src_url, int $dest_url ) {
		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $table WHERE srcUrlMd5 = %d AND destUrlMd5 = %d", // phpcs:ignore
				$src_url,
				$dest_url
			)
		);
	}


	/**
	 * @param string[] $src_urls
	 * @param string[] $dest_urls
	 *
	 * @return void
	 */
	private function delete_url_relations( array $src_urls, array $dest_urls ) {
		if ( count( $src_urls ) != count( $dest_urls ) ) {
			return;
		}

		global $wpdb;
		$table       = URLSLAB_RELATED_RESOURCE_TABLE;
		$placeholder = array();
		$values      = array();
		foreach ( $src_urls as $i => $id ) {
			$placeholder[] = '(%d, %d)';
			array_push( $values, $id, $dest_urls[ $i ] );
		}
		$placeholder_string = implode( ', ', $placeholder );
		$delete_query       = "DELETE FROM $table WHERE (srcUrlMd5, destUrlMd5) IN ($placeholder_string)";
		$wpdb->query(
			$wpdb->prepare(
				$delete_query, // phpcs:ignore
				$values
			)
		);

	}

	private function count_relations(): ?string {
		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;

		return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
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
			isset( $_GET['url_src'] ) &&
			isset( $_GET['url_dest'] ) &&
			isset( $_REQUEST['_wpnonce'] )
		) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_delete_relation' ) ) { // verify the nonce.
				wp_redirect(
					add_query_arg(
						'status=failure',
						'urlslab-message=this link is expired'
					)
				);
				exit();
			}

			$this->delete_url_relation( $_GET['url_src'], $_GET['url_dest'] );
		}


		// Bulk Delete triggered
		if (
			( isset( $_GET['action'] ) && 'bulk-delete' == $_GET['action'] )
			|| ( isset( $_GET['action2'] ) && 'bulk-delete' == $_GET['action2'] )
		) {

			if ( isset( $_GET['bulk-delete'] ) ) {
				$delete_ids  = esc_sql( $_GET['bulk-delete'] );
				$delete_src  = array();
				$delete_dest = array();
				foreach ( $delete_ids as $str ) {
					$s             = explode( ';', $str );
					$delete_src[]  = $s[0];
					$delete_dest[] = $s[1];
				}
				// loop over the array of record IDs and delete them
				$this->delete_url_relations( $delete_src, $delete_dest );
			}
		}
		$this->graceful_exit();
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
			'cb'                => '<input type="checkbox" />',
			'col_src_url_name'  => 'Source URL',
			'col_src_status'    => 'Source Status',
			'col_dest_url_name' => 'Destination URL',
			'col_dest_status'   => 'Destination Status',
			'col_pos'           => 'Position',
		);
	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param Urlslab_Url_Data[] $item
	 *
	 * @return string
	 */
	function column_cb( $item ): string {
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />',
			$item[0]->get_url()->get_url_id() . ';' . $item[1]->get_url()->get_url_id(),
		);
	}

	/**
	 * Method for name column
	 *
	 * @param Urlslab_Url_Data[] $item an array of DB data
	 *
	 * @return string
	 */
	function column_col_src_url_name( $item ): string {

		// create a nonce
		$delete_nonce = wp_create_nonce( 'urlslab_delete_relation' );

		$title = '<strong>' . $item[0]->get_url()->get_url() . '</strong>';

		$actions = array();
		if ( isset( $_REQUEST['page'] ) ) {
			$actions = array(
				'delete' => sprintf(
					'<a href="?page=%s%s&s=%s&action=%s&url_src=%s&url_dest=%s&_wpnonce=%s">Delete</a>',
					esc_attr( $_REQUEST['page'] ),
					isset( $_REQUEST['tab'] ) ? '&tab=' . esc_attr( $_REQUEST['tab'] ) : '',
					esc_html( $_REQUEST['s'] ?? '' ),
					'delete',
					esc_attr( $item[0]->get_url()->get_url_id() ),
					esc_attr( $item[1]->get_url()->get_url_id() ),
					$delete_nonce
				),
				'edit'   => sprintf(
					'<span class="%s" data-close-icon="%s" data-src-url-hash="%s" data-src-url="%s" data-dest-url-hash="%s" data-dest-url="%s" data-pos="%s">Edit</span>',
					'url-relation-edit color-primary',
					esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ),
					esc_attr( $item[0]->get_url()->get_url_id() ),
					esc_attr( urlslab_add_current_page_protocol( $item[0]->get_url()->get_url() ) ),
					esc_attr( $item[1]->get_url()->get_url_id() ),
					esc_attr( urlslab_add_current_page_protocol( $item[1]->get_url()->get_url() ) ),
					$item[2]
				),
			);
		}

		return $title . $this->row_actions( $actions );
	}

	/**
	 * Render a column when no column specific method exists.
	 *
	 * @param Urlslab_Url_Data[] $item
	 * @param string $column_name
	 *
	 * @return bool|string
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'col_src_url_name':
				return $item[0]->get_url()->get_url();
			case 'col_src_status':
				return urlslab_status_ui_convert( $item[0]->get_screenshot_status() );
			case 'col_dest_url_name':
				return $item[1]->get_url()->get_url();
			case 'col_dest_status':
				return urlslab_status_ui_convert( $item[1]->get_screenshot_status() );
			case 'col_pos':
				return $item[2];
			default:
				return print_r( $item, true );
		}
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {
		$search_key = isset( $_REQUEST['s'] ) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';
		$this->process_bulk_action();
		$table_page     = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_related_resources(
			$search_key,
			$items_per_page,
			( $table_page - 1 ) * $items_per_page
		);
		$total_count   = $this->count_relations();


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
		echo 'No Relations to show';
	}

}
