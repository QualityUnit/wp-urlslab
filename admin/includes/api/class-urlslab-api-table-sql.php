<?php

class Urlslab_Api_Table_Sql {
	private array $select_data = array();
	private array $having_data = array();
	private array $query_data = array();
	private array $where_data = array();
	private array $order_data = array();
	private array $group_by_data = array();

	private $limit_string = '';
	private $from_string = '';

	private WP_REST_Request $request;

	public function __construct( WP_REST_Request $request ) {
		$this->request = $request;
	}

	private function init_table_limit() {
		if ( $this->request->get_param( 'rows_per_page' ) ) {
			$this->limit_string = '%d';
			$this->query_data[] = (int) $this->request->get_param( 'rows_per_page' );
		}
	}

	public function add_filter( string $parameter_name, $format = '%s', $operator = '=', $table_prefix = false ) {
		if ( ! $this->request->get_param( $parameter_name ) ) {
			return;
		}
		$column_name = $parameter_name;
		if ( str_starts_with( $column_name, 'from_' ) ) {
			$column_name = substr( $column_name, strlen( 'from_' ) );
			$operator    = '>';
		} else if ( str_starts_with( $column_name, 'filter_' ) ) {
			$column_name = substr( $column_name, strlen( 'filter_' ) );
		}

		if ( $table_prefix ) {
			$column_name = $table_prefix . '.' . $column_name;
		}

		$this->where_data[] = esc_sql( $column_name ) . ' ' . $operator . ' ' . $format;
		if ( '%d' == $format ) {
			$this->query_data[] = (int) $this->request->get_param( $parameter_name );
		} else {
			$this->query_data[] = $this->request->get_param( $parameter_name );
		}
	}

	public function add_filter_raw( $where_condition, $data = false ) {
		$this->where_data[] = $where_condition;
		if ( false !== $data ) {
			if ( is_array( $data ) ) {
				$this->query_data = array_merge( $this->query_data, $data );
			} else {
				$this->query_data = array_merge( $this->query_data, array( $data ) );
			}
		}
	}

	public function add_having_filter( string $parameter_name, $format = '%s', $operator = '=' ) {
		if ( ! $this->request->get_param( $parameter_name ) ) {
			return;
		}
		$column_name = $parameter_name;
		if ( str_starts_with( $column_name, 'filter_' ) ) {
			$column_name = substr( $column_name, strlen( 'filter_' ) );
		}
		$this->having_data[] = esc_sql( $column_name ) . ' ' . $operator . ' ' . $format;
		if ( '%d' == $format ) {
			$this->query_data[] = (int) $this->request->get_param( $parameter_name );
		} else {
			$this->query_data[] = $this->request->get_param( $parameter_name );
		}
	}

	public function add_order( $order_column, $sort_direction = 'ASC', $table_prefix = false ) {
		if ( $table_prefix ) {
			$order_column = $table_prefix . '.' . $order_column;
		}
		$this->order_data[] = esc_sql( $order_column ) . ' ' . ( 'DESC' !== strtoupper( $sort_direction ) ? 'ASC' : 'DESC' );
	}

	public function add_select_column( $column, $table_prefix = false, $alias = false ) {
		if ( '*' !== $column ) {
			$column = esc_sql( $column );
		}
		$alias               = esc_sql( $alias );
		$this->select_data[] = ( $table_prefix ? esc_sql( $table_prefix ) . '.' : '' ) . $column . ( $alias ? ' AS ' . $alias : '' );
	}

	public function add_from( $from_string ) {
		$this->from_string = $from_string;
	}

	public function get_results() {
		global $wpdb;
		$this->init_table_limit();

		return $wpdb->get_results( $this->get_query(), OBJECT ); // phpcs:ignore
	}

	public function get_count(): int {
		global $wpdb;

		$results = $wpdb->get_results( $this->get_count_select()->get_query(), OBJECT ); // phpcs:ignore

		if ( empty( $results ) ) {
			return 0;
		}

		return $results[0]->cnt;
	}

	public function add_group_by( string $column, string $table_prefix = '' ) {
		$this->group_by_data[] = ( $table_prefix ? esc_sql( $table_prefix ) . '.' : '' ) . esc_sql( $column );
	}

	public function get_request(): WP_REST_Request {
		return $this->request;
	}

	private function get_count_select(): Urlslab_Api_Table_Sql {
		$this->order_data   = array();
		$this->limit_string = '';
		if ( empty( $this->group_by_data ) ) {
			$this->select_data = array();
			$this->add_select_column( 'count(*)', false, 'cnt' );

			return $this;
		} else {
			$cnt_select = new Urlslab_Api_Table_Sql( $this->get_request() );
			$cnt_select->add_select_column( 'count(*)', false, 'cnt' );
			$cnt_select->add_from( '(' . $this->get_query() . ') as tbl' );

			return $cnt_select;
		}
	}

	/**
	 * @param $wpdb
	 *
	 * @return mixed
	 */
	private function get_query() {
		global $wpdb;

		return $wpdb->prepare(
			'SELECT ' . implode( ',', $this->select_data ) . // phpcs:ignore
			' FROM ' . $this->from_string . // phpcs:ignore
			( ! empty( $this->where_data ) ? ' WHERE ' . implode( ' AND ', $this->where_data ) : '' ) . // phpcs:ignore
			( ! empty( $this->group_by_data ) ? ' GROUP BY ' . implode( ',', $this->group_by_data ) : '' ) . // phpcs:ignore
			( ! empty( $this->having_data ) ? ' HAVING ' . implode( ' AND ', $this->having_data ) : '' ) . // phpcs:ignore
			( ! empty( $this->order_data ) ? ' ORDER BY ' . implode( ',', $this->order_data ) : '' ) . // phpcs:ignore
			( strlen( $this->limit_string ) ? ' LIMIT ' . $this->limit_string : '' ), // phpcs:ignore
			$this->query_data
		);
	}

}
