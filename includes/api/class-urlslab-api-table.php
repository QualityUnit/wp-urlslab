<?php

abstract class Urlslab_Api_Table extends Urlslab_Api_Base {
	public const ROWS_PER_PAGE = 50;
	public const MAX_ROWS_PER_PAGE = 10000;

	abstract public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data;

	abstract public function get_editable_columns(): array;

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			$row = $this->get_row_object( array(), false );
			foreach ( $row->get_columns() as $column => $format ) {
				if ( $request->has_param( $column ) ) {
					$row->set_public( $column, $request->get_param( $column ) );
				}
			}

			try {
				$this->validate_item( $row );
			} catch ( Exception $e ) {
				return new WP_Error( 'error', __( 'Validation failed: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
			}

			if ( $row->insert() ) {
				$this->on_items_updated( array( $row ) );

				return new WP_REST_Response( $row->as_array(), 200 );
			}

			return new WP_Error( 'error', __( 'Insert failed', 'urlslab' ), array( 'status' => 409 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Insert failed', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		try {
			$primary_key_values = array();
			foreach ( $this->get_row_object()->get_primary_columns() as $primary_key ) {
				$primary_key_values[ $primary_key ] = $request->get_param( $primary_key );
			}

			$row = $this->get_row_object( $primary_key_values );
			if ( $row->load() ) {
				$json_params = $request->get_json_params();
				foreach ( $this->get_editable_columns() as $column ) {
					if ( isset( $json_params[ $column ] ) && $json_params[ $column ] !== $row->get_public( $column ) ) {
						$row->set_public( $column, $json_params[ $column ] );
					}
				}

				try {
					$this->validate_item( $row );
				} catch ( Exception $e ) {
					return new WP_Error( 'error', __( 'Validation failed: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
				}

				$row->update();
				$this->on_items_updated( array( $row ) );

				return new WP_REST_Response( $row->as_array(), 200 );
			}

			return new WP_Error( 'not-found', __( 'Row not found', 'urlslab' ), array( 'status' => 400 ) );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_items( $request ) {
		$rows = $request->get_json_params()['rows'];

		if ( empty( $request->get_param( 'rows' ) ) || ! is_array( $request->get_param( 'rows' ) ) ) {
			return new WP_Error( 'error', __( 'No rows to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		$chunks = array_chunk( $rows, 500 );
		foreach ( $chunks as $chunk ) {
			$this->delete_rows( $chunk );
		}
		$this->on_items_updated();

		return new WP_REST_Response( array(), 200 );
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( $this->get_row_object()->get_table_name() ) ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Truncated', 'urlslab' ),
			),
			200
		);
	}

	public function import_items( WP_REST_Request $request ) {
		$rows = array();

		foreach ( $request->get_json_params()['rows'] as $row ) {
			$row_obj = $this->get_row_object( (array) $row, false );

			try {
				$this->validate_item( $row_obj );
				$rows[] = $this->before_import( $row_obj, $row );
			} catch ( Exception $e ) {
			}
		}

		$result = $this->get_row_object()->import( $rows );

		if ( false === $result ) {
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'Import failed', 'urlslab' ),
				),
				500
			);
		}
		$this->on_items_updated();

		return new WP_REST_Response( $result, 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_items_count( WP_REST_Request $request ) {
		return new WP_REST_Response( $this->get_items_sql( $request )->get_count(), 200 );
	}

	public static function validate_string_filter_value( $param ) {
		$filter_value = json_decode( $param );
		if ( is_object( $filter_value ) ) {
			switch ( $filter_value->op ) {
				case 'IN':
				case 'NOTIN':
					return property_exists( $filter_value, 'val' ) && is_array( $filter_value->val );

				case 'BETWEEN':
					return property_exists( $filter_value, 'min' ) && property_exists( $filter_value, 'max' ) && is_string( $filter_value->min ) && is_string( $filter_value->max );

				case 'LIKE': // continue to next case
				case '%LIKE': // continue to next case
				case 'LIKE%': // continue to next case
				case 'NOTLIKE': // continue to next case
				case 'NOT%LIKE': // continue to next case
				case 'NOTLIKE%': // continue to next case
				case '>': // continue to next case
				case '<': // continue to next case
				case '<>': // continue to next case
				case '!=': // continue to next case
				case '=': // continue to next case
					return property_exists( $filter_value, 'val' ) && is_string( $filter_value->val );

				default:
					return false;
			}
		} else {
			if ( is_string( $param ) ) {
				return true;
			}
		}

		return false;
	}

	public static function validate_numeric_filter_value( $param ) {
		$filter_value = json_decode( $param );
		if ( is_object( $filter_value ) ) {
			if ( ! property_exists( $filter_value, 'op' ) ) {
				return false;
			}

			switch ( $filter_value->op ) {
				case 'IN':
				case 'NOTIN':
					return property_exists( $filter_value, 'val' ) && is_array( $filter_value->val );

				case 'BETWEEN':
					return property_exists( $filter_value, 'min' ) && property_exists( $filter_value, 'max' ) && is_numeric( $filter_value->min ) && is_numeric( $filter_value->max );

				case '>':
				case '<>':
				case '!=':
				case '<':
				case '=':
					return property_exists( $filter_value, 'val' ) && is_numeric( $filter_value->val );

				default:
					return false;
			}
		} else {
			if ( is_numeric( $param ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param Urlslab_Datap[] $row
	 */
	protected function on_items_updated( array $row = array() ) {}

	protected function get_table_arguments(): array {
		$arguments['filters']       = array(
			'required'          => false,
			'default'           => array(),
			'validate_callback' => function( $param ) {
				return is_array( $param );
			},
		);
		$arguments['sorting']       = array(
			'required'          => false,
			'default'           => array(),
			'validate_callback' => function( $param ) {
				return is_array( $param );
			},
		);
		$arguments['rows_per_page'] = array(
			'required'          => false,
			'default'           => self::ROWS_PER_PAGE,
			'validate_callback' => function( $param ) {
				return is_numeric( $param ) && 0 <= $param && self::MAX_ROWS_PER_PAGE >= $param;
			},
		);

		return $arguments;
	}

	protected function get_table_chart_arguments( string $time_series_column ): array {
		$arguments['filters']       = array(
			'required'          => false,
			'default'           => array(),
			'validate_callback' => function( $param ) use ( $time_series_column ) {
				return is_array( $param ) && $this->is_valid_chart_filter( $param, $time_series_column );
			},
		);
		$arguments['sorting']       = array(
			'required'          => false,
			'default'           => array(),
			'validate_callback' => function( $param ) {
				return is_array( $param );
			},
		);

		return $arguments;
	}

	protected function validate_item( Urlslab_Data $row ) {}

	protected function get_count_route( array $route ): array {
		$count_route = $route;
		if ( isset( $count_route[0]['callback'][1] ) ) {
			$count_route[0]['callback'][1] .= '_count';
		}

		return $count_route;
	}

	protected function is_valid_chart_filter( $param, string $time_column ) {
		$has_time_col = false;
		if ( isset( $param ) && is_array( $param ) ) {
			foreach ( $param as $filter ) {
				if ( $filter['col'] === $time_column ) {
					$has_time_col = true;
					break;
				}
			}
		}

		return $has_time_col;
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter(
			$request,
			array(
				'my_urls',
				'comp_urls',
				'from_url_name',
				'to_url_name',
				'url_name',
			)
		);

		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( $this->get_row_object()->get_table_name() );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function before_import( Urlslab_Data $row_obj, array $row ): Urlslab_Data {
		return $row_obj;
	}


	protected function prepare_columns( $input_columns, $table_prefix = false ): array {
		$columns = array();
		foreach ( $input_columns as $column => $format ) {
			$type               = $this->get_column_type( $column, $format );
			$columns[ $column ] = array(
				'format' => $format,
				'prefix' => $table_prefix,
				'type'   => $type,
			);
			if ( Urlslab_Data::COLUMN_TYPE_ENUM === $type ) {
				$columns[ $column ]['values'] = $this->get_enum_column_items( $column );
			}
		}

		return $columns;
	}

	public function get_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns() );
	}

	protected function add_request_filter( WP_REST_Request $request, array $filter_params ) {
		$body = $request->get_json_params();
		if ( ! isset( $body['filters'] ) || ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}

		foreach ( $filter_params as $filter_param ) {
			if ( $request->has_param( $filter_param ) ) {
				$body['filters'][] = array(
					'col' => $filter_param,
					'op'  => '=',
					'val' => $request->get_param( $filter_param ),
				);
			}
		}

		$request->set_body( json_encode( $body ) );
	}

	protected function delete_rows( array $rows ): bool {
		$result = $this->get_row_object()->delete_rows( $rows );
		$this->on_items_updated();

		return $result;
	}

	protected function prepare_url_filter( WP_REST_Request $request, array $column_names ) {
		//remove protocol from url filter
		$body = $request->get_json_params();
		if ( isset( $body['filters'] ) && is_array( $body['filters'] ) ) {
			$changed = false;
			foreach ( $body['filters'] as $id => $filter ) {
				if ( isset( $filter['val'] ) && isset( $filter['col'] ) && in_array( $filter['col'], $column_names ) && false !== strpos( $filter['val'], '://' ) ) {
					$changed                       = true;
					$body['filters'][ $id ]['val'] = substr( $filter['val'], strpos( $filter['val'], '://' ) + 3 );
				}
			}
			if ( $changed ) {
				$request->set_body( json_encode( $body ) );
			}
		}
	}

	public function get_columns_route( $callback ): array {
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => function() use ( $callback ) {
				return $this->get_columns_request( $callback );
			},
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}

	protected function get_column_type( string $column, $format ) {
		return $this->get_row_object()->get_column_type( $column, $format );
	}

	protected function get_filter_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns() );
	}

	protected function get_having_columns(): array {
		return array();
	}

	public function get_sorting_columns(): array {
		return array_merge( $this->get_filter_columns(), $this->get_having_columns() );
	}

	protected function get_columns_request( $callback ) {
		return new WP_REST_Response( call_user_func( $callback ), 200 );
	}

	protected function get_enum_column_items( string $column ): array {
		return $this->get_row_object()->get_enum_column_items( $column );
	}
}
