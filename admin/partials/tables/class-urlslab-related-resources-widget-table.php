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
				$row['destStatus'],
			),
		);
	}


	/**
	 * Getting URL Keywords
	 * @return array|stdClass[]
	 */
	private function get_related_resources( int $limit, int $offset ): array {
		global $wpdb;
		$related_resource_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$urls_table = URLSLAB_URLS_TABLE;

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
				       v.status AS destStatus
				FROM $related_resource_table r
				         INNER JOIN $urls_table as u
				                    ON r.srcUrlMd5 = u.urlMd5
				         INNER JOIN $urls_table as v
				                    ON r.destUrlMd5 = v.urlMd5";

		/* -- Ordering parameters -- */
		//Parameters that are going to be used to order the result
		$query .= ' ORDER BY srcUrlMd5 ASC';

		/* -- Pagination parameters -- */
		$query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
		$res = $wpdb->get_results( $query, ARRAY_A ); // phpcs:ignore
		$query_res = array();
		foreach ( $res as $row ) {
			$query_res[] = $this->transform( $row );
		}
		return $query_res;
	}

	private function count_relations(): ?string {
		global $wpdb;
		$table = URLSLAB_RELATED_RESOURCE_TABLE;
		return $wpdb->get_row( "SELECT COUNT(*) AS cnt FROM $table", ARRAY_A )['cnt']; // phpcs:ignore
	}

	/**
	 * Define the columns that are going to be used in the table
	 * @return array $columns, the array of columns to use with the table
	 */
	function get_columns(): array {
		return array(
			'col_src_image' => 'Src Image',
			'col_src_url_name' => 'Src URL',
			'col_src_status' => 'Src Status',
			'col_dest_image' => 'Dest Image',
			'col_dest_url_name' => 'Dest URL',
			'col_dest_status' => 'Dest Status',
		);
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
			case 'col_src_image':
				if ( $item[0]->screenshot_exists() ) {
					return '<img src="' . $item[0]->render_screenshot_path() . '" width="150px">';
				}
				return '<em>Not available!</em>';
			case 'col_src_url_name':
				return $item[0]->get_url()->get_url();
			case 'col_src_status':
				return urlslab_status_ui_convert( $item[0]->get_screenshot_status() );
			case 'col_dest_image':
				if ( $item[1]->screenshot_exists() ) {
					return '<img src="' . $item[1]->render_screenshot_path() . '" width="150px">';
				}
				return '<em>Not available!</em>';
			case 'col_dest_url_name':
				return $item[1]->get_url()->get_url();
			case 'col_dest_status':
				return urlslab_status_ui_convert( $item[1]->get_screenshot_status() );
			default:
				return print_r( $item, true );
		}
	}

	/**
	 * Prepare the table with different parameters,
	 * pagination, columns and table elements
	 */
	function prepare_items() {
		$table_page = $this->get_pagenum();
		$items_per_page = $this->get_items_per_page( 'users_per_page' );

		$query_results = $this->get_related_resources( $items_per_page, ( $table_page - 1 ) * $items_per_page );
		$total_count = $this->count_relations();


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
