<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/executor/class-urlslab-generator-cron-executor.php';

class Urlslab_Generators_Cron extends Urlslab_Cron {
	private ContentApi $content_client;

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating content', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG )->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_SCHEDULE )
			 || ! $this->init_client()
		) {
			return false;
		}

		/**
		 * @var Urlslab_Content_Generator_Widget $widget
		 */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );
		$generator_cron_executor = new Urlslab_Generator_Cron_Executor();
		$task                    = $generator_cron_executor->fetch_tasks_to_process( $widget );
		if ( empty( $task ) ) {
			return false;
		}

		return $generator_cron_executor->start_generator_process( $task, $widget );
	}

	private function init_client(): bool {
		if ( empty( $this->content_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new ContentApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}
}
