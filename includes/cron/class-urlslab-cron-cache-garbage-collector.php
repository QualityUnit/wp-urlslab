<?php

class Urlslab_Cron_Cache_Garbage_Collector extends Urlslab_Cron {

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Cache garbage collection', 'urlslab' );
	}

	protected function has_locking() {
		return false;
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Cache::SLUG ) ) {
			return false;
		}
		/** @var Urlslab_Widget_Cache $widget */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
		$widget->invalidate_old_cache();
		$widget->garbage_collection();

		return false;
	}
}
