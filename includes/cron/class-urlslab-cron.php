<?php

abstract class Urlslab_Cron {
	public $start_time;
	public const MAX_RUN_TIME = 10;

	public function __construct() {
		$this->start_time = time();
	}

	abstract public function get_description(): string;

	abstract protected function execute(): bool;

	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ) {
		while ( time() - $this->start_time < $max_execution_time && $this->execute() ) {
		}
	}

	public function api_exec( $start_time, $max_execution_time ) {
		$this->start_time = $start_time;
		$this->cron_exec( $max_execution_time );
	}
}
