<?php

class Urlslab_Data_Task extends Urlslab_Data {
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
		if ( ! $loaded_from_db ) {
			$data = json_encode( $data );
		}
		$this->set( 'data', $data, $loaded_from_db );
	}

	public function get_result() {
		return json_decode( $this->get( 'result' ), true );
	}

	public function set_result( $result, $loaded_from_db = false ) {
		if ( ! $loaded_from_db ) {
			$result = json_encode( $result );
		}
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

	public function count_not_finished_subtasks(): int {
		global $wpdb;
		$statuses = $wpdb->get_results( $wpdb->prepare( 'SELECT COUNT(*) as tasks, status  FROM ' . URLSLAB_TASKS_TABLE . ' WHERE parent_id=%d GROUP BY status', $this->get_task_id() ), ARRAY_A ); // phpcs:ignore
		if ( empty( $statuses ) ) {
			return 0;
		}

		$types = array();
		foreach ( $statuses as $status ) {
			$types[ $status['status'] ] = (int) $status['tasks'];
		}
		if ( ! isset( $types[ Urlslab_Data_Task::STATUS_FINISHED ] ) ) {
			$types[ Urlslab_Data_Task::STATUS_FINISHED ] = 0;
		}
		if ( ! isset( $types[ Urlslab_Data_Task::STATUS_ERROR ] ) ) {
			$types[ Urlslab_Data_Task::STATUS_ERROR ] = 0;
		}

		//pending and new should not be counted
		return array_sum( $types ) - (int) $types[ Urlslab_Data_Task::STATUS_FINISHED ] - (int) $types[ Urlslab_Data_Task::STATUS_ERROR ];
	}

	public function delete_task() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . URLSLAB_TASKS_TABLE . ' WHERE task_id=%d OR parent_id=%d OR top_parent_id=%d', $this->get_task_id(), $this->get_task_id(), $this->get_task_id() ) ); // phpcs:ignore
	}
}
