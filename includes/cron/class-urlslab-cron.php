<?php

abstract class Urlslab_Cron {
	public const MAX_RUN_TIME = 10;
	const URLSLAB_CRON_LOCK = 'urlslab_cron_';
	const LOCK = 'LOCK';
	public $start_time;
	protected static $runner_id = 0;

	public function __construct() {
		$this->start_time = time();
	}

	private static function get_runner_id() {
		if ( ! self::$runner_id ) {
			self::$runner_id = rand( 1, 1000000 );
		}

		return self::$runner_id;
	}

	abstract public function get_description(): string;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( $this->has_locking() ) {
			if ( $this->is_locked() ) {
				return false;
			}
			$this->lock();
		}

		$this->start_time = time();
		$nr_executions    = 0;
		while ( ( time() - $this->start_time ) < $max_execution_time ) {
			++$nr_executions;
			if ( ! $this->execute() ) {
				break;
			}
		}

		if ( $this->has_locking() ) {
			$this->unlock();
		}

		return ( $max_execution_time <= time() - $this->start_time ) && $nr_executions > 0;
	}

	protected function lock( $expiration = 30, $runner_id = false ) {
		if ( false === $runner_id ) {
			$runner_id = self::get_runner_id();
		}
		set_transient( $this->get_lock_id(), $runner_id, $expiration );
	}

	protected function unlock( $force = false ) {
		if ( $force ) {
			delete_transient( $this->get_lock_id() );
		} else {
			$runner = get_transient( $this->get_lock_id() );
			if ( self::get_runner_id() === $runner ) {
				delete_transient( $this->get_lock_id() );
			}
		}
	}

	protected function is_locked(): bool {
		$lock = get_transient( $this->get_lock_id() );

		return false !== $lock && self::get_runner_id() !== $lock;
	}

	abstract protected function execute(): bool;

	/**
	 * @return string
	 */
	private function get_lock_id(): string {
		return self::URLSLAB_CRON_LOCK . strtolower( get_class( $this ) );
	}

	protected function has_locking() {
		return true;
	}
}
