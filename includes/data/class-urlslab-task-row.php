<?php

class Urlslab_Task_Row extends Urlslab_Data {
	const STATUS_NEW = 'N';
	const STATUS_IN_PROGRESS = 'P';
	const STATUS_FINISHED = 'F';
	const STATUS_ERROR = 'E';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_task_id( $data['task_id'] ?? 0, $loaded_from_db );
		$this->set_time_from( $data['time_from'] ?? 0, $loaded_from_db );
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


	public function get_time_from(): int {
		return $this->get( 'time_from' );
	}

	public function set_time_from( int $time_from, $loaded_from_db = false ) {
		$this->set( 'time_from', $time_from, $loaded_from_db );
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
		return $this->get( 'data' );
	}

	public function set_data( $data, $loaded_from_db = false ) {
		$this->set( 'data', $data, $loaded_from_db );
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

	public function update( $update_columns = array() ): bool {
		if ( $this->has_changed() ) {
			$this->set_updated( self::get_now() );
			if ( $update_columns && ! in_array( 'updated', $update_columns ) ) {
				$update_columns[] = 'updated';
			}
		}

		return parent::update( $update_columns );
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
			'time_from'     => '%d',
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

	public function increase_subtasks() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_TASKS_TABLE . ' SET subtasks=subtasks+1 WHERE task_id IN (%d, %d, %d)', $this->get_task_id(), $this->get_parent_id(), $this->get_top_parent_id() ) ); // phpcs:ignore
		$this->set_subtasks( $this->get_subtasks() + 1 );
	}

	public function increase_subtasks_done() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_TASKS_TABLE . ' SET subtasks_done=subtasks_done+1 WHERE task_id IN (%d, %d)', $this->get_parent_id(), $this->get_top_parent_id() ) ); // phpcs:ignore
		$this->set_subtasks_done( $this->get_subtasks_done() + 1 );
	}

	public function count_not_finished_subtasks() {
		global $wpdb;
		$count_not_finished = $wpdb->get_row( $wpdb->prepare( 'SELECT subtasks-subtasks_done as not_finished FROM ' . URLSLAB_TASKS_TABLE . ' WHERE task_id=%d', $this->get_task_id() ), ARRAY_A ); // phpcs:ignore

		return $count_not_finished['not_finished'];
	}
}
