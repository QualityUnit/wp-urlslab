<?php

abstract class Urlslab_Api_Table extends Urlslab_Api_Base {

	const ROWS_PER_PAGE = 30;
	const MAX_ROWS_PER_PAGE = 200;

	abstract function get_row_object( $params = array() ): Urlslab_Data;
	abstract function get_editable_columns(): array;

	protected function get_table_arguments( array $arguments = array() ): array {
		$arguments['rows_per_page']    = array(
			'required'          => true,
			'default'           => self::ROWS_PER_PAGE,
			'validate_callback' => function( $param ) {
				return is_numeric( $param ) && 0 < $param && self::MAX_ROWS_PER_PAGE > $param;
			},
		);
		$arguments['sort_column']      = array(
			'required'          => false,
			'default'           => $this->get_row_object()->get_primary_columns()[0],
			'validate_callback' => function( $param ) {
				return is_string( $param ) && 0 < strlen( $param );
			},
		);
		$arguments['sort_direction']   = array(
			'required'          => false,
			'default'           => 'ASC',
			'validate_callback' => function( $param ) {
				return 'ASC' == $param || 'DESC' == $param;
			},
		);
		$arguments['from_id']          = array(
			'required' => false,
		);
		$arguments['from_sort_column'] = array(
			'required' => false,
		);

		return $arguments;
	}

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
					if ( isset( $json_params[ $column ] ) && $json_params[ $column ] != $row->get( $column ) ) {
						$row->set( $column, $json_params[ $column ] );
					}
				}
				$row->update();

				return new WP_REST_Response( $row->as_array(), 200 );
			} else {
				return new WP_Error( 'not-found', __( 'Row not found', 'urlslab' ), array( 'status' => 404 ) );
			}
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Failed to update', 'urlslab' ), array( 'status' => 500 ) );
		}
	}

	public function delete_item( $request ) {
		global $wpdb;

		$delete_params = array();
		foreach ( $this->get_row_object()->get_primary_columns() as $primary_column ) {
			$delete_params[ $primary_column ] = $request->get_param( $primary_column );
		}

		if ( false === $wpdb->delete( $this->get_row_object()->get_table_name(), $delete_params ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

}
