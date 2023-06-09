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
		$data = array();
		$start_time = time();
		$max_time = 20;
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
						$data[] = (object) array(
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
		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-update-url-http-status-cron.php';
		$this->add_cron_task( new Urlslab_Update_Url_Http_Status_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-download-css-cron.php';
		$this->add_cron_task( new Urlslab_Download_CSS_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshots-cron.php';
		$this->add_cron_task( new Urlslab_Screenshots_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-summaries-cron.php';
		$this->add_cron_task( new Urlslab_Summaries_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-redirects-cron.php';
		$this->add_cron_task( new Urlslab_Redirects_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-optimize-cron.php';
		$this->add_cron_task( new Urlslab_Optimize_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-youtube-cron.php';
		$this->add_cron_task( new Urlslab_Youtube_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Background_Attachments_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-generators-cron.php';
		$this->add_cron_task( new Urlslab_Generators_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-transfer-files-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Transfer_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-enqueue-files-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Enqueue_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-related-resources-cron.php';
		$this->add_cron_task( new Urlslab_Related_Resources_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-webp-images-cron.php';
		$cron_job_webp_convert = new Urlslab_Convert_Webp_Images_Cron();
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Media_Offloader_Widget::SLUG ) && $cron_job_webp_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_webp_convert );
		}

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-avif-images-cron.php';
		$cron_job_avif_convert = new Urlslab_Convert_Avif_Images_Cron();
		if ( $cron_job_avif_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_avif_convert );
		}
	}

	private function add_cron_task( Urlslab_Cron $task ) {
		$this->cron_tasks[] = $task;
	}
}
