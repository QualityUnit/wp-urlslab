<?php

class Urlslab_Generator_Task_Row extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_NEW = 'N';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_DISABLED = 'D';

	public const GENERATOR_TYPE_SHORTCODE = 'S';
	public const GENERATOR_TYPE_POST_CREATION = 'P';


	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_task_id( $data['task_id'] ?? 0, $loaded_from_db );
		$this->set_generator_type( $data['generator_type'] ?? '', $loaded_from_db );
		$this->set_task_status( $data['task_status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_task_data( $data['task_data'] ?? '', $loaded_from_db );
		$this->set_urlslab_process_id( $data['urlslab_process_id'] ?? '', $loaded_from_db );
		$this->set_error_log( $data['error_log'] ?? '', $loaded_from_db );
		$this->set_shortcode_hash_id( $data['shortcode_hash_id'] ?? 0, $loaded_from_db );
		$this->set_updated_at( $data['updated_at'] ?? '', $loaded_from_db );
	}

	public function get_task_id(): int {
		return $this->get( 'task_id' );
	}

	public function set_task_id( int $task_id, $loaded_from_db = false ): void {
		$this->set( 'task_id', $task_id, $loaded_from_db );
	}

	public function get_urlslab_process_id(): string {
		return $this->get( 'urlslab_process_id' );
	}

	public function set_urlslab_process_id( string $urlslab_process_id, $loaded_from_db = false ): void {
		$this->set( 'urlslab_process_id', $urlslab_process_id, $loaded_from_db );
	}

	public function get_error_log(): string {
		return $this->get( 'error_log' );
	}

	public function set_error_log( string $error_log, $loaded_from_db = false ): void {
		$this->set( 'error_log', $error_log, $loaded_from_db );
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
			'task_id' => '%d',
			'generator_type' => '%s',
			'task_status' => '%s',
			'task_data' => '%s',
			'urlslab_process_id' => '%s',
			'shortcode_hash_id' => '%d',
		);
	}
}
