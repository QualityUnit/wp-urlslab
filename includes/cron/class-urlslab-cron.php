<?php

abstract class Urlslab_Cron {
	public $start_time;
	public const MAX_RUN_TIME = 10;

	public function __construct() {
		$this->start_time = time();
	}

	abstract public function get_description(): string;

	abstract protected function execute(): bool;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		$this->start_time = time();
		$nr_executions = 0;
		while ( ( time() - $this->start_time < $max_execution_time ) ) {
			$nr_executions ++;
			if ( ! $this->execute() ) {
				break;
			}
		}

		return ( $max_execution_time <= time() - $this->start_time ) && $nr_executions > 0;
	}

}
