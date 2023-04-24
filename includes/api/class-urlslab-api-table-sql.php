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

	private function add_filter( array $filter, $format = '%s', $table_prefix = false ) {
		if ( $table_prefix && false === strpos( $filter['col'], '.' ) ) {
			$filter['col'] = $table_prefix . '.' . $filter['col'];
		}
		$filter_sql = $this->get_column_filter_sql( $filter, $format );
		if ( ! empty( $filter_sql ) ) {
			$this->where_sql[] = $filter_sql['sql'];
			$this->query_data  = array_merge( $this->query_data, $filter_sql['data'] );
		}
	}

	public function add_having_filters( array $columns, WP_REST_Request $request, $table_prefix = false ) {
		$column_names = array_keys( $columns );
		foreach ( $request->get_json_params()['filters'] as $filter ) {
			if ( isset( $filter['col'] ) && in_array( $filter['col'], $column_names ) ) {
				$this->add_having_filter( $filter, $columns[ $filter['col'] ], $table_prefix );
			}
		}
	}

	private function add_having_filter( array $filter, $format = '%s', $table_prefix = false ) {
		if ( $table_prefix && false === strpos( $filter['col'], '.' ) ) {
			$filter['col'] = $table_prefix . '.' . $filter['col'];
		}
		$filter_sql = $this->get_column_filter_sql( $filter, $format );
		if ( ! empty( $filter_sql ) ) {
			$this->having_sql[] = $filter_sql['sql'];
			$this->query_data   = array_merge( $this->query_data, $filter_sql['data'] );
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

	private function init_table_limit() {
		if ( $this->request->get_param( 'rows_per_page' ) ) {
			$this->limit_sql    = '%d';
			$this->query_data[] = (int) $this->request->get_param( 'rows_per_page' );
		}
	}

	private function get_column_filter_sql( array $filter, $format ): array {
		switch ( $format ) {
			case '%d':
				return $this->get_numeric_filter_sql( $filter );

			case '%s':
			default:
				return $this->get_string_filter_sql( $filter );
		}
	}

	private function get_count_select(): Urlslab_Api_Table_Sql {
		$this->order_sql = array();
		$this->limit_sql = '';
		if ( empty( $this->group_by_sql ) && empty( $this->having_sql ) ) {
			$this->select_sql = array();
			$this->add_select_column( 'count(*)', false, 'cnt' );

			return $this;
		}
		$cnt_select = new Urlslab_Api_Table_Sql( $this->get_request() );
		$cnt_select->add_select_column( 'count(*)', false, 'cnt' );
		$cnt_select->add_from( '(' . $this->get_query() . ') as tbl' );

		return $cnt_select;
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
			( ! empty( $this->where_sql ) ? ' WHERE ' . implode( ' ', $this->where_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->group_by_sql ) ? ' GROUP BY ' . implode( ',', $this->group_by_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->having_sql ) ? ' HAVING ' . implode( ' AND ', $this->having_sql ) : '' ) . // phpcs:ignore
			( ! empty( $this->order_sql ) ? ' ORDER BY ' . implode( ',', $this->order_sql ) : '' ) . // phpcs:ignore
			( strlen( $this->limit_sql ) ? ' LIMIT ' . $this->limit_sql : '' ), // phpcs:ignore
			$this->query_data
		);
	}

	private function get_numeric_filter_sql( array $filter ): array {
		$data       = array();
		$sql_string = '';

		switch ( $filter['op'] ) {
			case 'IN':
				if ( is_array( $filter['val'] ) ) {
					$sql_string = esc_sql( $filter['col'] ) . ' IN (' . implode( ',', array_fill( 0, count( $filter['val'] ), '%d' ) ) . ')';
					foreach ( $filter['val'] as $in_value ) {
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

			case 'NOTIN':
				if ( is_array( $filter['val'] ) ) {
					$sql_string = esc_sql( $filter['col'] ) . ' NOT IN (' . implode( ',', array_fill( 0, count( $filter['val'] ), '%d' ) ) . ')';
					foreach ( $filter['val'] as $in_value ) {
						if ( is_numeric( $in_value ) ) {
							$data[] = $in_value;
						} else {
							throw new Exception( 'Invalid filter input value: NOTIN should have numeric values' );
						}
					}
				} else {
					throw new Exception( 'invalid filter input value for NOTIN' );
				}

				break;

			case 'BETWEEN':
				$sql_string = esc_sql( $filter['col'] ) . ' BETWEEN %d AND %d';
				$data[]     = $filter['min'];
				$data[]     = $filter['max'];

				break;

			case '>':
				$sql_string = esc_sql( $filter['col'] ) . '>%d';
				$data[]     = $filter['val'];

				break;

			case '<':
				$sql_string = esc_sql( $filter['col'] ) . '<%d';
				$data[]     = $filter['val'];

				break;

			case '<>':
			case '!=':
				$sql_string = esc_sql( $filter['col'] ) . '<>%d';
				$data[]     = $filter['val'];

				break;

			case '=':
			default:
				$sql_string = esc_sql( $filter['col'] ) . '=%d';
				$data[]     = $filter['val'];

				break;
		}

		return array(
			'sql'  => $sql_string,
			'data' => $data,
		);
	}

	private function get_string_filter_sql( array $filter ): array {
		global $wpdb;
		$data = array();

		switch ( $filter['op'] ) {
			case 'IN':
				if ( is_array( $filter['val'] ) ) {
					$sql_string = esc_sql( $filter['col'] ) . ' IN (' . implode( ',', array_fill( 0, count( $filter['val'] ), '%s' ) ) . ')';
					foreach ( $filter['val'] as $in_value ) {
						$data[] = $in_value;
					}
				} else {
					throw new Exception( 'operator IN should have as input value array of strings' );
				}

				break;

			case 'NOTIN':
				if ( is_array( $filter['val'] ) ) {
					$sql_string = esc_sql( $filter['col'] ) . ' NOT IN (' . implode( ',', array_fill( 0, count( $filter['val'] ), '%s' ) ) . ')';
					foreach ( $filter['val'] as $in_value ) {
						$data[] = $in_value;
					}
				} else {
					throw new Exception( 'operator NOTIN should have as input value array of strings' );
				}

				break;

			case 'BETWEEN':
				$sql_string = esc_sql( $filter['col'] ) . ' BETWEEN %s AND %s';
				$data[]     = $filter['min'];
				$data[]     = $filter['max'];

				break;

			case '>':
				$sql_string = esc_sql( $filter['col'] ) . '>%s';
				$data[]     = $filter['val'];

				break;

			case '<':
				$sql_string = esc_sql( $filter['col'] ) . '<%s';
				$data[]     = $filter['val'];

				break;

			case '<>':
			case '!=':
				$sql_string = esc_sql( $filter['col'] ) . '<>%s';
				$data[]     = $filter['val'];

				break;

			case 'LIKE':
				$sql_string = esc_sql( $filter['col'] ) . ' LIKE %s';
				$data[]     = '%' . $wpdb->esc_like( $filter['val'] ) . '%';

				break;

			case 'NOTLIKE':
				$sql_string = esc_sql( $filter['col'] ) . ' NOT LIKE %s';
				$data[]     = '%' . $wpdb->esc_like( $filter['val'] ) . '%';

				break;

			case 'LIKE%':
				$sql_string = esc_sql( $filter['col'] ) . ' LIKE %s';
				$data[]     = $wpdb->esc_like( $filter['val'] ) . '%';

				break;

			case 'NOTLIKE%':
				$sql_string = esc_sql( $filter['col'] ) . ' NOT LIKE %s';
				$data[]     = $wpdb->esc_like( $filter['val'] ) . '%';

				break;

			case '%LIKE':
				$sql_string = esc_sql( $filter['col'] ) . ' LIKE %s';
				$data[]     = '%' . $wpdb->esc_like( $filter['val'] );

				break;

			case 'NOT%LIKE':
				$sql_string = esc_sql( $filter['col'] ) . ' NOT LIKE %s';
				$data[]     = '%' . $wpdb->esc_like( $filter['val'] );

				break;

			case '=':
			default:
				$sql_string = esc_sql( $filter['col'] ) . '=%s';
				$data[]     = $filter['val'];

				break;
		}

		return array(
			'sql'  => $sql_string,
			'data' => $data,
		);
	}

	public function add_filters( array $columns, WP_REST_Request $request, $table_prefix = false ) {
		if ( isset( $request->get_json_params()['filters'] ) && is_array( $request->get_json_params()['filters'] ) ) {
			$this->add_filter_array( 'AND', $columns, $request->get_json_params()['filters'], $table_prefix );
		}
	}

	public function add_sorting( array $columns, WP_REST_Request $request, $table_prefix = false ) {
		$column_names = array_keys( $columns );

		foreach ( $request->get_json_params()['sorting'] as $sorting ) {
			if ( isset( $sorting['col'] ) && in_array( $sorting['col'], $column_names ) ) {
				if ( isset( $sorting['dir'] ) && 'DESC' === strtoupper( $sorting['dir'] ) ) {
					$direction = 'DESC';
				} else {
					$direction = 'ASC';
				}
				$this->add_order( $sorting['col'], $direction, $table_prefix );
			}
		}
	}

	private function add_filter_array( string $operand, array $columns, array $filters, $table_prefix ) {
		if ( ! empty( $filters ) ) {
			$this->add_filter_str( '(' );
			$is_first = true;
			foreach ( $filters as $filter ) {
				if ( ! $is_first ) {
					$this->add_filter_str( $operand );
				}
				if ( isset( $filter['cond'] ) ) {
					if ( isset( $filter['filters'] ) && is_array( $filter['filters'] ) ) {
						$this->add_filter_array( $filter['cond'], $columns, $filter['filters'], $table_prefix );
					}
				} else if ( isset( $filter['col'] ) && isset( $columns[ $filter['col'] ] ) ) {
					$this->add_filter( $filter, $columns[ $filter['col'] ], $table_prefix );
				}
				$is_first = false;
			}
			$this->add_filter_str( ')' );
		}
	}

	private function add_filter_str( string $control_string ) {
		$this->where_sql[] = $control_string;
	}

}
