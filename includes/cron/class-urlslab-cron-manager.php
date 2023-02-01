<?php

class Urlslab_Cron_Manager {
	private $cron_tasks = array();

	private static Urlslab_Cron_Manager $instance;

	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Cron_Manager The instance.
	 */
	public static function get_instance(): Urlslab_Cron_Manager {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function add_cron_task( Urlslab_Cron $task ) {
		$this->cron_tasks[] = $task;
		Urlslab_Loader::get_instance()->add_action( 'urlslab_cron_hook', $task, 'cron_exec', 10, 0 );
	}

	public function get_cron_tasks(): array {
		return $this->cron_tasks;
	}

}
