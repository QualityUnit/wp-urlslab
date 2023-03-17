<?php

class Urlslab_Api_Table_Sql {
	private array $select_sql = array();
	private array $having_sql = array();
	private array $query_data = array();
	private array $where_sql = array();
	private array $order_sql = array();
	private array $group_by_sql = array();

	private $limit_sql = '';
	private $from_sql = array();

	private WP_REST_Request $request;

	public function __construct( WP_REST_Request $request ) {
		$this->request = $request;
	}

	private function init_table_limit() {
		if ( $this->request->get_param( 'rows_per_page' ) ) {
			$this->limit_sql    = '%d';
			$this->query_data[] = (int) $this->request->get_param( 'rows_per_page' );
		}
	}

	public function add_filter( string $parameter_name, $format = '%s', $table_prefix = false ) {
		$filter = $this->get_filter_sql( $parameter_name, $format, $table_prefix );
		if ( ! empty( $filter ) ) {
			$this->where_sql[] = $filter['sql'];
			$this->query_data  = array_merge( $this->query_data, $filter['data'] );
		}
	}


	public function add_having_filter( string $parameter_name, $format = '%s', $table_prefix = false ) {
		$filter = $this->get_filter_sql( $parameter_name, $format, $table_prefix );
		if ( ! empty( $filter ) ) {
			$this->having_sql[] = $filter['sql'];
			$this->query_data   = array_merge( $this->query_data, $filter['data'] );
		}
	}

	private function get_filter_sql( string $parameter_name, $format = '%s', $table_prefix = false ) {
		if ( ! $this->request->get_param( $parameter_name ) ) {
			return;
		}

		$param_value = $this->request->get_param( $parameter_name );

		$column_name = $parameter_name;
		if ( str_starts_with( $column_name, 'from_' ) ) {
			$column_name = substr( $column_name, strlen( 'from_' ) );
			$param_value = json_encode(
				(object) array(
					'op'  => '>',
					'val' => $param_value,
				)
			);
		} else if ( str_starts_with( $column_name, 'filter_' ) ) {
			$column_name = substr( $column_name, strlen( 'filter_' ) );
		}

		if ( $table_prefix ) {
			$column_name = $table_prefix . '.' . $column_name;
		}

		return $this->get_column_filter_sql( $column_name, $format, $param_value );
	}

	private function get_column_filter_sql( $column_name, $format, $param_value ): array {
		switch ( $format ) {
			case '%d':
				return $this->get_numeric_filter_sql( $column_name, $param_value );
			case '%s':
			default:
				return $this->get_string_filter_sql( $column_name, $param_value );
		}

	}

	public function add_filter_raw( $where_condition, $data = false ) {
		$this->where_sql[] = $where_condition;
		if ( false !== $data ) {
			if ( is_array( $data ) ) {
				$this->query_data = array_merge( $this->query_data, $data );
			} else {
				$this->query_data = array_merge( $this->query_data, array( $data ) );
			}
		}
	}


	public function add_order( $order_column, $sort_direction = 'ASC', $table_prefix = false ) {
		if ( $table_prefix ) {
			$order_column = $table_prefix . '.' . $order_column;
		}
		$this->order_sql[] = esc_sql( $order_column ) . ' ' . ( 'DESC' !== strtoupper( $sort_direction ) ? 'ASC' : 'DESC' );
	}

	public function add_select_column( $column, $table_prefix = false, $alias = false ) {
		if ( '*' !== $column ) {
			$column = esc_sql( $column );
		}
		$alias              = esc_sql( $alias );
		$this->select_sql[] = ( $table_prefix ? esc_sql( $table_prefix ) . '.' : '' ) . $column . ( $alias ? ' AS ' . $alias : '' );
	}

	public function add_from( $from_string ) {
		$this->from_sql[] = $from_string;
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
		$this->group_by_sql[] = ( $table_prefix ? esc_sql( $table_prefix ) . '.' : '' ) . esc_sql( $column );
	}

	public function get_request(): WP_REST_Request {
		return $this->request;
	}

	private function get_count_select(): Urlslab_Api_Table_Sql {
		$this->order_sql = array();
		$this->limit_sql = '';
		if ( empty( $this->group_by_sql ) ) {
			$this->select_sql = array();
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
			'SELECT ' . implode( ',', $this->select_sql ) . // phpcs:ignore
			' FROM ' . implode( ' ', $this->from_sql ) . // phpcs:ignore
			( ! empty( $this->where_sql ) ? ' WHERE ' . implode( ' AND ', $this->where_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->group_by_sql ) ? ' GROUP BY ' . implode( ',', $this->group_by_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->having_sql ) ? ' HAVING ' . implode( ' AND ', $this->having_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->order_sql ) ? ' ORDER BY ' . implode( ',', $this->order_sql ) : '' ) . // phpcs:ignore
			( strlen( $this->limit_sql ) ? ' LIMIT ' . $this->limit_sql : '' ), // phpcs:ignore
			$this->query_data
		);
	}

	private function get_numeric_filter_sql( string $column_name, string $param_value ): array {
		$filter_obj = json_decode( $param_value );
		$data       = array();
		$sql_string = '';

		if ( is_object( $filter_obj ) ) {
			switch ( $filter_obj->op ) {
				case 'IN':
					if ( is_array( $filter_obj->val ) ) {
						$sql_string = esc_sql( $column_name ) . 'IN (' . implode( ',', array_fill( 0, count( $filter_obj->val ), '%d' ) ) . ')';
						foreach ( $filter_obj->val as $in_value ) {
							if ( is_numeric( $in_value ) ) {
								$data[] = $in_value;
							} else {
								throw new Exception( 'Invalid filter input value: IN should have numeric values' );
							}
						}
					} else {
						throw new Exception( 'invalid filter input value for IN' );
					}
					break;
				case 'BETWEEN':
					$sql_string = esc_sql( $column_name ) . ' BETWEEN %d AND %d';
					$data[]     = $filter_obj->min;
					$data[]     = $filter_obj->max;
					break;
				case '>':
					$sql_string = esc_sql( $column_name ) . '>%d';
					$data[]     = $filter_obj->val;
					break;
				case '<':
					$sql_string = esc_sql( $column_name ) . '<%d';
					$data[]     = $filter_obj->val;
					break;
				case '<>':
				case '!=':
					$sql_string = esc_sql( $column_name ) . '<>%d';
					$data[]     = $filter_obj->val;
					break;
				case '=':
				default:
					$sql_string = esc_sql( $column_name ) . '=%d';
					$data[]     = $filter_obj->val;
					break;
			}
		} else if ( is_numeric( $param_value ) ) {
			$sql_string = esc_sql( $column_name ) . '=%d';
			$data[]     = $param_value;
		} else {
			throw new Exception( 'Invalid filter' );
		}

		return array(
			'sql'  => $sql_string,
			'data' => $data,
		);
	}

	private function get_string_filter_sql( string $column_name, string $param_value ): array {
		global $wpdb;
		$filter_obj = json_decode( $param_value );

		$data       = array();
		$sql_string = '';

		if ( is_object( $filter_obj ) ) {
			switch ( $filter_obj->op ) {
				case 'IN':
					if ( is_array( $filter_obj->val ) ) {
						$sql_string = esc_sql( $column_name ) . 'IN (' . implode( ',', array_fill( 0, count( $filter_obj->val ), '%s' ) ) . ')';
						foreach ( $filter_obj->val as $in_value ) {
							$data[] = $in_value;
						}
					} else {
						throw new Exception( 'invalid filter input value' );
					}
					break;
				case '>':
					$sql_string = esc_sql( $column_name ) . '>%s';
					$data[]     = $filter_obj->val;
					break;
				case '<':
					$sql_string = esc_sql( $column_name ) . '<%s';
					$data[]     = $filter_obj->val;
					break;
				case '<>':
				case '!=':
					$sql_string = esc_sql( $column_name ) . '<>%s';
					$data[]     = $filter_obj->val;
					break;

				case 'LIKE':
					$sql_string = esc_sql( $column_name ) . ' LIKE %s';
					$data[]     = '%' . $wpdb->esc_like( $filter_obj->val ) . '%';
					break;
				case '=':
				default:
					$sql_string = esc_sql( $column_name ) . '=%s';
					$data[]     = $filter_obj->val;
					break;
			}
		} else if ( is_string( $param_value ) ) {
			//default is wildcard match
			$sql_string = esc_sql( $column_name ) . ' LIKE %s';
			$data[]     = '%' . $param_value . '%';
		} else {
			throw new Exception( 'Invalid filter' );
		}

		return array(
			'sql'  => $sql_string,
			'data' => $data,
		);
	}

}
