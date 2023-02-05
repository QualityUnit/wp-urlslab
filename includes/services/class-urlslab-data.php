<?php

abstract class Urlslab_Data {
	protected $data = array();
	private $changed = array();

	public function as_array(): array {
		return $this->data;
	}

	public function set( $name, $value, $is_changed = true ) {
		if ( isset( $this->data[ $name ] ) && $this->data[ $name ] == $value ) {
			return false;
		}
		$this->data[ $name ] = $value;
		if ( $is_changed && isset( $this->get_columns()[ $name ] ) ) {
			$this->changed[ $name ] = true;
		}
	}

	public function get( $name ) {
		return $this->data[ $name ] ?? false;
	}

	protected function has_changed() {
		return count( $this->changed ) > 0;
	}

	abstract function get_table_name(): string;

	abstract function get_primary_columns(): array;

	abstract function get_columns(): array;

	public function update(): bool {
		if ( ! $this->has_changed() ) {
			return true;
		}

		$update_data = array();
		$format      = array();
		foreach ( $this->changed as $key => $true ) {
			$update_data[ $key ] = $this->data[ $key ];
			$format[ $key ]      = $this->get_column_format( $key );
		}

		$where        = array();
		$where_format = array();
		foreach ( $this->get_primary_columns() as $key ) {
			$where[ $key ]        = $this->data[ $key ];
			$where_format[ $key ] = $this->get_column_format( $key );
		}

		global $wpdb;
		if ( $wpdb->update( $this->get_table_name(), $update_data, $where, $format, $where_format ) ) {
			$this->changed = array();

			return true;
		}

		return false;
	}

	public function insert(): bool {
		if ( ! $this->has_changed() ) {
			return true;
		}

		$insert_data = array();
		$format      = array();
		foreach ( $this->changed as $key => $true ) {
			$insert_data[ $key ] = $this->data[ $key ];
			$format[ $key ]      = $this->get_column_format( $key );
		}

		global $wpdb;
		if ( $wpdb->insert( $this->get_table_name(), $insert_data, $format ) ) {
			$this->changed = array();

			return true;
		}

		return false;
	}

	private function get_column_format( $name ) {
		return $this->get_columns()[ $name ] ?? '%s';
	}

	public function load(): bool {
		global $wpdb;

		if ( empty( $this->get_primary_columns() ) ) {
			return false;
		}

		$where      = array();
		$where_data = array();
		foreach ( $this->get_primary_columns() as $key ) {
			$where[]            = $key . '=' . $this->get_column_format( $key );
			$where_data[ $key ] = $this->data[ $key ];
		}

		$row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT *	FROM ' . $this->get_table_name() . ' WHERE ' . implode( ' AND ', $where ) . ' LIMIT 1', // phpcs:ignore
				$where_data
			),
			ARRAY_A
		);

		if ( empty( $row ) ) {
			return false;
		}

		foreach ( $row as $key => $value ) {
			$this->set( $key, $value, false );
		}

		return true;
	}

	public function import( array $rows ): int {
		global $wpdb;
		$insert_placeholders = array();
		$insert_values       = array();
		$on_duplicate        = array();

		$columns          = $this->get_columns();
		$row_placeholders = array();
		foreach ( $columns as $column => $format ) {
			$row_placeholders[] = $format;
			if ( ! in_array( $column, $this->get_primary_columns() ) ) {
				$on_duplicate[] = $column . '=VALUES(' . $column . ')';
			}
		}
		$row_placeholder = '(' . implode( ',', $row_placeholders ) . ')';

		foreach ( $rows as $row ) {
			foreach ( $columns as $column => $format ) {
				array_push( $insert_values, $row->get( $column ) );
			}
			$insert_placeholders[] = $row_placeholder;
		}

		$insert_query = 'INSERT IGNORE INTO ' . $this->get_table_name() . ' (' . implode( ',', array_keys( $columns ) ) . ')
                   VALUES ' . implode( ', ', $insert_placeholders ) . '
                   ON DUPLICATE KEY UPDATE ' . implode( ',', $on_duplicate );

		return $wpdb->query( $wpdb->prepare( $insert_query, $insert_values ) ); // phpcs:ignore
	}

	public static function get_now( $timestamp = false ): string {
		if ( $timestamp ) {
			return gmdate( 'Y-m-d H:i:s', $timestamp );
		}

		return gmdate( 'Y-m-d H:i:s' );
	}
}
