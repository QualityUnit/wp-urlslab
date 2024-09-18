<?php

class Urlslab_Cron_Manager {
	// @var Urlslab_Cron[]
	private $cron_tasks = array();

	private static Urlslab_Cron_Manager $instance;

	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Cron_Manager the instance
	 */
	public static function get_instance(): Urlslab_Cron_Manager {
		if ( empty( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * @return Urlslab_Cron[]
	 */
	public function get_cron_tasks(): array {
		if ( empty( $this->cron_tasks ) ) {
			$this->init_cron_tasks();
		}

		return $this->cron_tasks;
	}

	/**
	 * @param $task_name execute only task with this name or all if false
	 */
	public function exec_cron_task( $task_name = false ): array {
		if ( is_404() ) {
			return array();
		}

		$data         = array();
		$start_time   = time();
		$max_time     = 20;
		$failed_tasks = array();
		while ( $max_time > ( time() - $start_time ) ) {
			$executed_tasks_nr = 0;

			foreach ( $this->get_cron_tasks() as $task ) {
				if (
					! in_array( get_class( $task ), $failed_tasks )
					&& ( false === $task_name || get_class( $task ) == $task_name )
				) {
					try {
						$task_time = time();
						if ( $task->cron_exec( 5 ) ) {
							++$executed_tasks_nr;
						} else {
							$failed_tasks[] = get_class( $task );
						}
						$exec_time = time() - $task_time;
						if ( $exec_time > 0 ) {
							$data[] = (object) array(
								'exec_time'   => $exec_time,
								'task'        => get_class( $task ),
								'description' => $task->get_description(),
							);
						}
					} catch ( Exception $e ) {
						$failed_tasks[] = get_class( $task );
						$data[]         = (object) array(
							'exec_time'   => $exec_time,
							'task'        => get_class( $task ),
							'description' => $e->getMessage(),
						);
					}
				}
			}

			if ( 0 == $executed_tasks_nr ) {
				break; // all tasks failed or no tasks wait for execution
			}
		}

		return $data;
	}

	private function init_cron_tasks() {
		$this->add_cron_task( new Urlslab_Cron_Cache_Garbage_Collector() );
		$this->add_cron_task( new Urlslab_Cron_Update_Backlinks() );
		$this->add_cron_task( new Urlslab_Cron_Update_Url_Http_Status() );
		$this->add_cron_task( new Urlslab_Cron_Download_Css() );
		$this->add_cron_task( new Urlslab_Cron_Download_Js() );
		$this->add_cron_task( new Urlslab_Cron_Screenshots() );
		$this->add_cron_task( new Urlslab_Cron_Summaries() );
		$this->add_cron_task( new Urlslab_Cron_Redirects() );
		$this->add_cron_task( new Urlslab_Cron_Optimize() );
		$this->add_cron_task( new Urlslab_Cron_Youtube() );
		$this->add_cron_task( new Urlslab_Cron_Offload_Background_Attachments() );
		$this->add_cron_task( new Urlslab_Cron_Generator() );
		$this->add_cron_task( new Urlslab_Cron_Faq() );
		$this->add_cron_task( new Urlslab_Cron_Offload_Transfer_Files() );
		$this->add_cron_task( new Urlslab_Cron_Offload_Enqueue_Files() );
		$this->add_cron_task( new Urlslab_Cron_Related_Resources() );
		$this->add_cron_task( new Urlslab_Cron_Serp() );
		$this->add_cron_task( new Urlslab_Cron_Serp_Volumes() );
		$this->add_cron_task( new Urlslab_Cron_Update_Usage_Stats() );

		$cron_job_webp_convert = new Urlslab_Cron_Convert_Webp_Images();
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) && $cron_job_webp_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_webp_convert );
		}
		$cron_job_avif_convert = new Urlslab_Cron_Convert_Avif_Images();
		if ( $cron_job_avif_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_avif_convert );
		}
	}

	private function add_cron_task( Urlslab_Cron $task ) {
		$this->cron_tasks[] = $task;
	}
}
