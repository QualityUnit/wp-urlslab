<?php

class Urlslab_Task_Row extends Urlslab_Data {
	const STATUS_NEW = 'N';
	const STATUS_IN_PROGRESS = 'P';
	const STATUS_FINISHED = 'S';
	const STATUS_ERROR = 'E';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_task_id( $data['task_id'] ?? 0, $loaded_from_db );
		$this->set_top_parent_id( $data['top_parent_id'] ?? 0, $loaded_from_db );
		$this->set_parent_id( $data['parent_id'] ?? 0, $loaded_from_db );
		$this->set_priority( $data['priority'] ?? 255, $loaded_from_db );
		$this->set_subtasks_done( $data['subtasks_done'] ?? 0, $loaded_from_db );
		$this->set_subtasks( $data['subtasks'] ?? 0, $loaded_from_db );
		$this->set_lock_id( $data['lock_id'] ?? 0, $loaded_from_db );
		$this->set_slug( $data['slug'] ?? '', $loaded_from_db );
		$this->set_executor_type( $data['executor_type'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_data( $data['data'] ?? '', $loaded_from_db );
		$this->set_result( $data['result'] ?? '', $loaded_from_db );
		$this->set_updated( $data['updated'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_task_id(): int {
		return $this->get( 'task_id' );
	}

	public function set_task_id( int $task_id, $loaded_from_db = false ) {
		$this->set( 'task_id', $task_id, $loaded_from_db );
	}

	public function get_top_parent_id(): int {
		return $this->get( 'top_parent_id' );
	}

	public function set_top_parent_id( int $top_parent_id, $loaded_from_db = false ) {
		$this->set( 'top_parent_id', $top_parent_id, $loaded_from_db );
	}

	public function get_parent_id(): int {
		return $this->get( 'parent_id' );
	}

	public function set_parent_id( int $parent_id, $loaded_from_db = false ) {
		$this->set( 'parent_id', $parent_id, $loaded_from_db );
	}

	public function get_priority(): int {
		return $this->get( 'priority' );
	}

	public function set_priority( int $priority, $loaded_from_db = false ) {
		$this->set( 'priority', $priority, $loaded_from_db );
	}

	public function get_lock_id(): int {
		return $this->get( 'lock_id' );
	}

	public function set_lock_id( int $lock_id, $loaded_from_db = false ) {
		$this->set( 'lock_id', $lock_id, $loaded_from_db );
	}


	public function get_subtasks(): int {
		return $this->get( 'subtasks' );
	}

	public function set_subtasks( int $subtasks, $loaded_from_db = false ) {
		$this->set( 'subtasks', $subtasks, $loaded_from_db );
	}

	public function get_subtasks_done(): int {
		return $this->get( 'subtasks_done' );
	}

	public function set_subtasks_done( int $subtasks_done, $loaded_from_db = false ) {
		$this->set( 'subtasks_done', $subtasks_done, $loaded_from_db );
	}

	public function get_slug(): string {
		return $this->get( 'slug' );
	}

	public function set_slug( string $slug, $loaded_from_db = false ) {
		$this->set( 'slug', $slug, $loaded_from_db );
	}

	public function get_executor_type(): string {
		return $this->get( 'executor_type' );
	}

	public function set_executor_type( string $executor_type, $loaded_from_db = false ) {
		$this->set( 'executor_type', $executor_type, $loaded_from_db );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_status( string $status, $loaded_from_db = false ) {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function get_data() {
		return json_decode( $this->get( 'data' ), true );
	}

	public function set_data( $data, $loaded_from_db = false ) {
		$this->set( 'data', json_encode( $data ), $loaded_from_db );
	}

	public function get_result(): string {
		return $this->get( 'result' );
	}

	public function set_result( string $result, $loaded_from_db = false ) {
		$this->set( 'result', $result, $loaded_from_db );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function set_updated( string $updated, $loaded_from_db = false ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function update(): bool {
		if ( $this->has_changed() ) {
			$this->set_updated( self::get_now() );
		}

		return parent::update();
	}

	public function get_columns(): array {
		return array(
			'task_id'       => '%d',
			'top_parent_id' => '%d',
			'parent_id'     => '%d',
			'priority'      => '%d',
			'lock_id'       => '%d',
			'subtasks'      => '%d',
			'subtasks_done' => '%d',
			'slug'          => '%s',
			'executor_type' => '%s',
			'status'        => '%s',
			'data'          => '%s',
			'result'        => '%s',
			'updated'       => '%s',
		);
	}

	public function get_table_name(): string {
		return URLSLAB_TASKS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'task_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

}
