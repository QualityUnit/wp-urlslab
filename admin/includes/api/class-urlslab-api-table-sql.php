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

	public function add_filter( string $parameter_name, $format = '%s', $table_prefix = false ) {
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

		$this->add_column_filter( $column_name, $format, $param_value );
	}

	private function add_column_filter( $column_name, $format, $param_value ) {
		switch ( $format ) {
			case '%d':
				$this->add_numeric_filter( $column_name, $param_value );
				break;
			case '%s':
			default:
				$this->add_string_filter( $column_name, $param_value );
				break;
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

	private function add_numeric_filter( string $column_name, string $param_value ) {
		$filter_obj = json_decode( $param_value );

		if ( is_object( $filter_obj ) ) {
			switch ( $filter_obj->op ) {
				case 'IN':
					if ( is_array( $filter_obj->val ) ) {
						$this->where_data[] = esc_sql( $column_name ) . 'IN (' . implode( ',', array_fill( 0, count( $filter_obj->val ), '%d' ) ) . ')';
						foreach ( $filter_obj->val as $in_value ) {
							if ( is_numeric( $in_value ) ) {
								$this->query_data[] = $in_value;
							} else {
								throw new Exception( 'Invalid filter input value: IN should have numeric values' );
							}
						}
					} else {
						throw new Exception( 'invalid filter input value for IN' );
					}
					break;
				case 'BETWEEN':
					$this->where_data[] = esc_sql( $column_name ) . ' BETWEEN %d AND %d';
					$this->query_data[] = $filter_obj->min;
					$this->query_data[] = $filter_obj->max;
					break;
				case '>':
					$this->where_data[] = esc_sql( $column_name ) . '>%d';
					$this->query_data[] = $filter_obj->val;
					break;
				case '<':
					$this->where_data[] = esc_sql( $column_name ) . '<%d';
					$this->query_data[] = $filter_obj->val;
					break;
				case '=':
				default:
					$this->where_data[] = esc_sql( $column_name ) . '=%d';
					$this->query_data[] = $filter_obj->val;
					break;
			}
		} else if ( is_numeric( $param_value ) ) {
			$this->where_data[] = esc_sql( $column_name ) . '=%d';
			$this->query_data[] = $param_value;
		} else {
			throw new Exception( 'Invalid filter' );
		}
	}

	private function add_string_filter( string $column_name, string $param_value ) {
		$filter_obj = json_decode( $param_value );

		if ( is_object( $filter_obj ) ) {
			switch ( $filter_obj->op ) {
				case 'IN':
					if ( is_array( $filter_obj->val ) ) {
						$this->where_data[] = esc_sql( $column_name ) . 'IN (' . implode( ',', array_fill( 0, count( $filter_obj->val ), '%s' ) ) . ')';
						foreach ( $filter_obj->val as $in_value ) {
							$this->query_data[] = $in_value;
						}
					} else {
						throw new Exception( 'invalid filter input value' );
					}
					break;
				case '>':
					$this->where_data[] = esc_sql( $column_name ) . '>%s';
					$this->query_data[] = $filter_obj->val;
					break;
				case '<':
					$this->where_data[] = esc_sql( $column_name ) . '<%s';
					$this->query_data[] = $filter_obj->val;
					break;
				case 'LIKE':
					$this->where_data[] = esc_sql( $column_name ) . ' LIKE %s';
					$this->query_data[] = '%' . $filter_obj . '%';
					break;
				case '=':
				default:
					$this->where_data[] = esc_sql( $column_name ) . '=%s';
					$this->query_data[] = $filter_obj->val;
					break;
			}
		} else if ( is_string( $param_value ) ) {
			//default is wildcard match
			$this->where_data[] = esc_sql( $column_name ) . ' LIKE %s';
			$this->query_data[] = '%' . $param_value . '%';
		} else {
			throw new Exception( 'Invalid filter' );
		}
	}

}
