<?php

abstract class Urlslab_Data {
	public const COLUMN_TYPE_BOOLEAN = 'boolean';
	public const COLUMN_TYPE_NUMBER = 'number';
	public const COLUMN_TYPE_FLOAT = 'float';
	public const COLUMN_TYPE_DATE = 'date';
	public const COLUMN_TYPE_LABELS = 'labels';
	public const COLUMN_TYPE_COUNTRY = 'country';
	public const COLUMN_TYPE_LANG = 'lang';
	public const COLUMN_TYPE_CAPABILITIES = 'capabilities';
	public const COLUMN_TYPE_ROLES = 'roles';
	public const COLUMN_TYPE_POSTS = 'postTypes';
	public const COLUMN_TYPE_STRING = 'string';
	public const COLUMN_TYPE_ENUM = 'enum';
	public const COLUMN_TYPE_BROWSER = 'browser';

	protected $data = array();
	private $changed = array();
	private $loaded_from_db = false;

	public function as_array(): array {
		return $this->data;
	}

	public function get_object_values_as_array(): array {
		$data = array();
		foreach ( $this->get_columns() as $column => $format ) {
			$data[ $column ] = $this->get( $column );
		}

		return $data;
	}

	public function set_public( $name, $value ) {
		$this->set( $name, $value, false );
	}

	public function get_public( $name ) {
		return $this->get( $name );
	}

	abstract public function get_table_name(): string;

	abstract public function get_primary_columns(): array;

	abstract public function get_columns(): array;

	public function update( $update_columns = array() ): bool {
		if ( ! $this->has_changed() ) {
			return true;
		}

		$update_data = array();
		$format      = array();
		foreach ( $this->changed as $key => $true ) {
			if ( empty( $update_columns ) || in_array( $key, $update_columns ) ) {
				$update_data[ $key ] = $this->data[ $key ];
				$format[ $key ]      = $this->get_column_format( $key );
			}
		}

		if ( empty( $update_data ) ) {
			return true;
		}

		$where        = array();
		$where_format = array();
		foreach ( $this->get_primary_columns() as $key ) {
			$where[ $key ]        = $this->data[ $key ];
			$where_format[ $key ] = $this->get_column_format( $key );
		}

		global $wpdb;
		$update_result = $wpdb->update( $this->get_table_name(), $update_data, $where, $format, $where_format );
		if ( $update_result ) {
			$this->changed = array();
			$this->set_loaded_from_db();

			return true;
		}

		return false;
	}

	public function delete(): bool {
		global $wpdb;

		$where        = array();
		$where_format = array();
		foreach ( $this->get_primary_columns() as $key ) {
			$where[ $key ]        = $this->data[ $key ];
			$where_format[ $key ] = $this->get_column_format( $key );
		}

		return $wpdb->delete( $this->get_table_name(), $where, $where_format );
	}

	public function delete_rows( $rows = array(), $delete_columns = array() ): bool {
		global $wpdb;
		$delete_params       = array();
		$delete_placeholders = array();
		$columns             = $this->get_columns();
		if ( empty( $delete_columns ) ) {
			$delete_columns = $this->get_primary_columns();
		}
		foreach ( $delete_columns as $delete_column ) {
			$delete_placeholders[] = $columns[ $delete_column ];
		}
		$delete_placeholders = '(' . implode( ',', $delete_placeholders ) . ')';

		foreach ( $rows as $id => $row ) {
			$row = (array) $row;
			foreach ( $delete_columns as $delete_column ) {
				if ( isset( $row[ $delete_column ] ) ) {
					$delete_params[] = $row[ $delete_column ];
				} else {
					unset( $rows[ $id ] );
				}
			}
		}

		if ( empty( $rows ) ) {
			return false;
		}

		return $wpdb->query( $wpdb->prepare( 'DELETE FROM ' . $this->get_table_name() . ' WHERE (' . implode( ',', $delete_columns ) . ') IN (' . implode( ',', array_fill( 0, count( $rows ), $delete_placeholders ) ) . ')', $delete_params ) ); // phpcs:ignore
	}

	public function insert( $replace = false ): bool {
		if ( ! $this->has_changed() ) {
			return true;
		}

		$insert_data = array();
		$format      = array();
		$this->before_insert();

		if ( false === $this->validate_row() ) {
			return false;
		}

		foreach ( $this->get_columns() as $key => $column_format ) {
			if ( isset( $this->data[ $key ] ) ) {
				$insert_data[ $key ] = $this->data[ $key ];
				$format[ $key ]      = $column_format;
			}
		}

		global $wpdb;
		if ( $replace ) {
			if ( $wpdb->replace( $this->get_table_name(), $insert_data, $format ) ) {
				$this->changed = array();
				$this->set_loaded_from_db();

				return true;
			}
		} else {
			if ( $wpdb->insert( $this->get_table_name(), $insert_data, $format ) ) {
				if ( is_numeric( $wpdb->insert_id ) && $wpdb->insert_id > 0 && $this->has_autoincrement_primary_column() && 1 == count( $this->get_primary_columns() ) ) {
					$this->set( $this->get_primary_columns()[0], $wpdb->insert_id, true );
				}
				$this->changed = array();
				$this->set_loaded_from_db();

				return true;
			}
		}

		return false;
	}

	public function upsert( $on_duplicate_key_update ) {
		global $wpdb;

		$insert_data = array();
		foreach ( $this->get_columns() as $key => $column_format ) {
			$insert_data[] = $this->get( $key );
		}

		return $wpdb->query( $wpdb->prepare( "INSERT INTO {$this->get_table_name()} (" . implode( ',', array_keys( $this->get_columns() ) ) . ') VALUES (' . implode( ',', $this->get_columns() ) . ') ON DUPLICATE KEY UPDATE ' . $on_duplicate_key_update, $insert_data ) ); // phpcs:ignore
	}


	/**
	 * @param Urlslab_Data[] $rows
	 * @param bool $insert_ignore
	 * @param array $columns_update_on_duplicate
	 *
	 * @return int
	 */
	public function insert_all( array $rows, $insert_ignore = false, $columns_update_on_duplicate = array(), $max_rows = 2000 ): int {
		$offset   = 0;
		$rows_cnt = 0;

		while ( $offset < count( $rows ) ) {
			$result = $this->insert_all_query( array_slice( $rows, $offset, $max_rows ), $insert_ignore, $columns_update_on_duplicate );
			if ( false === $result ) {
				return $rows_cnt;
			} else {
				$rows_cnt += $result;
			}
			$offset += $max_rows;
		}

		return $rows_cnt;
	}

	/**
	 * @param Urlslab_Data[] $rows
	 * @param bool $insert_ignore
	 * @param array $columns_update_on_duplicate
	 *
	 * @return null|bool|int|mysqli_result|resource
	 */
	public function insert_all_query( array $rows, $insert_ignore = false, $columns_update_on_duplicate = array() ) {
		if ( empty( $rows ) ) {
			return true;
		}
		global $wpdb;
		$row_placeholder  = '(' . implode( ',', $this->get_columns() ) . ')';
		$row_placeholders = array();
		$insert_values    = array();

		foreach ( $rows as $row ) {
			$row->before_insert();
			if ( false === $row->validate_row() ) {
				continue;
			}
			$row_data = array();
			foreach ( $this->get_columns() as $column => $format ) {
				$row_data[] = $row->get( $column );
			}
			$insert_values      = array_merge( $insert_values, $row_data );
			$row_placeholders[] = $row_placeholder;
		}

		$on_duplicate = '';
		if ( ! $insert_ignore && ! empty( $columns_update_on_duplicate ) ) {
			$update_columns = array();
			foreach ( $columns_update_on_duplicate as $column_name ) {
				$update_columns[] = "`{$column_name}` = VALUES(`{$column_name}`)";
			}
			$on_duplicate .= ' ON DUPLICATE KEY UPDATE ' . implode( ',', $update_columns );
		}

		$query = 'INSERT' .
				 ( $insert_ignore ? ' IGNORE' : '' ) .
				 ' INTO ' . $this->get_table_name() .
				 '(' . implode( ',', array_keys( $this->get_columns() ) ) . ')' .
				 ' VALUES ' . implode( ',', $row_placeholders ) .
				 $on_duplicate;

		$result = $wpdb->query( $wpdb->prepare( $query, $insert_values ) ); // phpcs:ignore

		return $result;
	}

	public function load( $load_by_columns = array() ): bool {
		global $wpdb;

		if ( empty( $this->get_primary_columns() ) && empty( $load_by_columns ) ) {
			return false;
		}

		$where      = array();
		$where_data = array();

		if ( empty( $load_by_columns ) ) {
			$load_by_columns = $this->get_primary_columns();
		}

		foreach ( $load_by_columns as $key ) {
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
			$this->set_loaded_from_db( false );

			return false;
		}

		foreach ( $row as $key => $value ) {
			unset( $this->changed[ $key ] );
			$this->set( $key, $value, true );
		}
		$this->set_loaded_from_db();

		return true;
	}

	public function load_rows( $load_by_columns = array(), int $limit = 100 ): array {
		global $wpdb;

		if ( empty( $this->get_primary_columns() ) && empty( $load_by_columns ) ) {
			return false;
		}

		$where      = array();
		$query_data = array();

		if ( empty( $load_by_columns ) ) {
			$load_by_columns = $this->get_primary_columns();
		}

		foreach ( $load_by_columns as $key ) {
			$where[]            = $key . '=' . $this->get_column_format( $key );
			$query_data[ $key ] = $this->data[ $key ];
		}

		$query_data[] = $limit;

		$rows = $wpdb->get_results( $wpdb->prepare( 'SELECT *	FROM ' . $this->get_table_name() . ' WHERE ' . implode( ' AND ', $where ) . ' LIMIT %d', $query_data ), ARRAY_A ); // phpcs:ignore

		$obj_rows = array();

		foreach ( $rows as $row ) {
			try {
				$reflection_class = new ReflectionClass( get_class( $this ) );
				$obj_row          = $reflection_class->newInstanceArgs( array( $row, true ) );
				if ( ! empty( $obj_row ) ) {
					$obj_row->set_loaded_from_db( true );
					$obj_rows[] = $obj_row;
				}
			} catch ( Exception $e ) {
				continue;
			}
		}

		return $obj_rows;
	}


	public function import( array $rows, $on_duplicate_update_columns = true, $ignore = true ): int {
		$on_duplicate = array();
		if ( $on_duplicate_update_columns ) {
			foreach ( $this->get_columns() as $column => $format ) {
				if ( ! in_array( $column, $this->get_primary_columns() ) ) {
					$on_duplicate[] = $column;
				}
			}
		}

		return $this->insert_all( $rows, $ignore, $on_duplicate );
	}

	public function get_primary_id( string $glue = '_' ) {
		$id = array();
		foreach ( $this->get_primary_columns() as $primary_column ) {
			$id[ $primary_column ] = $this->get( $primary_column );
		}

		return implode( $glue, $id );
	}

	public static function get_now( $timestamp = false ): string {
		if ( $timestamp ) {
			return gmdate( 'Y-m-d H:i:s', $timestamp );
		}

		return gmdate( 'Y-m-d H:i:s' );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		if ( isset( $this->data[ $name ] ) && $this->data[ $name ] == $value ) {
			return false;
		}
		$this->data[ $name ] = $value;
		if ( ! $loaded_from_db && isset( $this->get_columns()[ $name ] ) ) {
			$this->changed[ $name ] = true;
		}
	}

	protected function get( $name ) {
		return $this->data[ $name ] ?? false;
	}

	protected function has_changed( $name = false ): bool {
		if ( $name ) {
			return isset( $this->changed[ $name ] ) && $this->changed[ $name ];
		}

		return count( $this->changed ) > 0;
	}

	protected function has_autoincrement_primary_column(): bool {
		return false;
	}

	private function get_column_format( $name ) {
		return $this->get_columns()[ $name ] ?? '%s';
	}

	protected function before_insert() {}

	public function is_loaded_from_db(): bool {
		return $this->loaded_from_db;
	}

	public function set_loaded_from_db( bool $loaded_from_db = true ) {
		$this->loaded_from_db = $loaded_from_db;
	}

	public function validate_row(): bool {
		return true;
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'country':
				return self::COLUMN_TYPE_COUNTRY;
			case 'labels':
				return self::COLUMN_TYPE_LABELS;
			case 'lang':
			case 'language':
				return self::COLUMN_TYPE_LANG;
			case 'created':
			case 'updated':
				return self::COLUMN_TYPE_DATE;
		}

		if ( '%f' === $format ) {
			return self::COLUMN_TYPE_FLOAT;
		} else if ( '%d' === $format ) {
			return self::COLUMN_TYPE_NUMBER;
		} else if ( str_starts_with( $column, 'is_' ) ) {
			return self::COLUMN_TYPE_BOOLEAN;
		}

		return self::COLUMN_TYPE_STRING;
	}

	public function get_enum_column_items( string $column ): array {
		return array();
	}
}
