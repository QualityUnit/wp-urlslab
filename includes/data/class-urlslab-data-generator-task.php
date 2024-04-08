<?php

class Urlslab_Data_Generator_Task extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_NEW = 'N';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_DISABLED = 'D';

	public const GENERATOR_TYPE_SHORTCODE = 'S';
	public const GENERATOR_TYPE_POST_CREATION = 'P';
	public const GENERATOR_TYPE_FAQ = 'F';


	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_task_id( $data['task_id'] ?? 0, $loaded_from_db );
		$this->set_generator_type( $data['generator_type'] ?? '', $loaded_from_db );
		$this->set_task_status( $data['task_status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_task_data( $data['task_data'] ?? '', $loaded_from_db );
		$this->set_internal_task_id( $data['internal_task_id'] ?? '', $loaded_from_db );
		$this->set_res_log( $data['result_log'] ?? '', $loaded_from_db );
		$this->set_shortcode_hash_id( $data['shortcode_hash_id'] ?? 0, $loaded_from_db );
		$this->set_updated_at( $data['updated_at'] ?? '', $loaded_from_db );
	}

	public function get_task_id(): int {
		return $this->get( 'task_id' );
	}

	public function set_task_id( int $task_id, $loaded_from_db = false ): void {
		$this->set( 'task_id', $task_id, $loaded_from_db );
	}

	public function get_internal_task_id(): string {
		return $this->get( 'internal_task_id' );
	}

	public function set_internal_task_id( string $internal_task_id, $loaded_from_db = false ): void {
		$this->set( 'internal_task_id', $internal_task_id, $loaded_from_db );
	}

	public function get_res_log(): string {
		return $this->get( 'result_log' );
	}

	public function set_res_log( string $result_log, $loaded_from_db = false ): void {
		$this->set( 'result_log', $result_log, $loaded_from_db );
	}

	public function get_shortcode_hash_id(): int {
		return $this->get( 'shortcode_hash_id' );
	}

	public function set_shortcode_hash_id( int $shortcode_hash_id, $loaded_from_db = false ): void {
		$this->set( 'shortcode_hash_id', $shortcode_hash_id, $loaded_from_db );
	}

	public function get_generator_type(): string {
		return $this->get( 'generator_type' );
	}

	public function set_generator_type( string $generator_type, $loaded_from_db = false ): void {
		$this->set( 'generator_type', $generator_type, $loaded_from_db );
	}

	public function get_task_status(): string {
		return $this->get( 'task_status' );
	}

	public function set_task_status( string $task_status, $loaded_from_db = false ): void {
		$this->set( 'task_status', $task_status, $loaded_from_db );
	}

	public function get_task_data(): string {
		return $this->get( 'task_data' );
	}

	public function set_task_data( string $task_data, $loaded_from_db = false ): void {
		$this->set( 'task_data', $task_data, $loaded_from_db );
	}

	public function get_updated_at() {
		return $this->get( 'updated_at' );
	}

	public function set_updated_at( string $updated_at, $loaded_from_db = false ): void {
		$this->set( 'updated_at', $updated_at, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GENERATOR_TASKS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'task_id' );
	}

	public function get_columns(): array {
		return array(
			'task_id'           => '%d',
			'generator_type'    => '%s',
			'task_status'       => '%s',
			'result_log'        => '%s',
			'task_data'         => '%s',
			'internal_task_id'  => '%s',
			'shortcode_hash_id' => '%d',
			'updated_at'        => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'updated_at':
				return self::COLUMN_TYPE_DATE;
			case 'generator_type':
			case 'task_status':
				return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'generator_type':
				return array(
					self::GENERATOR_TYPE_SHORTCODE     => __( 'Shortcode', 'wp-urlslab' ),
					self::GENERATOR_TYPE_POST_CREATION => __( 'Post', 'wp-urlslab' ),
					self::GENERATOR_TYPE_FAQ           => __( 'FAQ', 'wp-urlslab' ),
				);
			case 'task_status':
				return array(
					self::STATUS_ACTIVE     => __( 'Done', 'wp-urlslab' ),
					self::STATUS_NEW        => __( 'New', 'wp-urlslab' ),
					self::STATUS_PROCESSING => __( 'Processing', 'wp-urlslab' ),
					self::STATUS_DISABLED   => __( 'Failed', 'wp-urlslab' ),
				);
		}

		return parent::get_enum_column_items( $column );
	}
}
