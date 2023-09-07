<?php

require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-table-sql.php';

abstract class Urlslab_Api_Table extends Urlslab_Api_Base {
	public const ROWS_PER_PAGE = 30;
	public const MAX_ROWS_PER_PAGE = 10000;

	abstract public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data;

	abstract public function get_editable_columns(): array;

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

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
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

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
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		$rows = $request->get_json_params()['rows'];

		if ( empty( $request->get_param( 'rows' ) ) || ! is_array( $request->get_param( 'rows' ) ) ) {
			return new WP_Error( 'error', __( 'No rows to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$deleted_rows = array();
		foreach ( $rows as $row ) {
			$deleted_rows[] = $this->delete_row( (array) $row );
		}
		$this->on_items_updated();

		return new WP_REST_Response( $deleted_rows, 200 );
	}

	public function delete_all_items( WP_REST_Request $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( $this->get_row_object()->get_table_name() ) ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response( __( 'Truncated' ), 200 );
	}

	public function import_items( WP_REST_Request $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

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
			return new WP_REST_Response( 'Import failed', 500 );
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
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		global $wpdb;
		$rows = $this->get_items_sql( $request )->get_results();

		if ( null === $rows || false === $rows || '' !== $wpdb->last_error ) {
			if ( '' !== $wpdb->last_error ) {
				return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ) . $wpdb->last_error, array( 'status' => 400 ) );
			}
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_items_count( WP_REST_Request $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

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
		$arguments['filters'] = array(
			'required'          => false,
			'default'           => array(),
			'validate_callback' => function( $param ) {
				return is_array( $param );
			},
		);
		$arguments['sorting'] = array(
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
		$count_route                   = $route;
		$count_route[0]['callback'][1] = $count_route[0]['callback'][1] . '_count';

		return $count_route;
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		throw new Exception( 'Missing implementation' );
	}

	protected function before_import( Urlslab_Data $row_obj, array $row ): Urlslab_Data {
		return $row_obj;
	}


	protected function prepare_columns( $input_columns, $table_prefix = false ): array {
		$columns = array();
		foreach ( $input_columns as $column => $format ) {
			$columns[ $column ] = array(
				'format' => $format,
				'prefix' => $table_prefix,
			);
		}

		return $columns;
	}


	protected function add_request_filter( WP_REST_Request $request, array $filter_params ) {
		$body = $request->get_json_params();
		if ( ! is_array( $body['filters'] ) ) {
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

	protected function after_row_deleted( array $row ) {}

	protected function delete_row( array $row ): bool {
		global $wpdb;
		$delete_params = array();
		foreach ( $this->get_row_object()->get_primary_columns() as $primary_column ) {
			if ( isset( $row[ $primary_column ] ) ) {
				$delete_params[ $primary_column ] = $row[ $primary_column ];
			} else {
				return false;
			}
		}


		if ( false === $wpdb->delete( $this->get_row_object()->get_table_name(), $delete_params ) ) {
			return false;
		}

		$this->after_row_deleted( $row );

		return true;
	}
}
