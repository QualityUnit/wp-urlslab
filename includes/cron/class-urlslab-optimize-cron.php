<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Optimize_Cron extends Urlslab_Cron {

	private Urlslab_Widget $widget;

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Optimize::SLUG ) ) {
			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_activated_widget( Urlslab_Optimize::SLUG );

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REMOVE_REVISIONS ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REMOVE_REVISIONS_NEXT_PROCESSING ) ) <= time()
		) {
			if ( $this->optimize_revisions() > 0 ) {
				return true;
			} else {
				$this->widget->update_option( Urlslab_Optimize::SETTING_NAME_REMOVE_REVISIONS_NEXT_PROCESSING, Urlslab_Data::get_now( time() + 86400 ) );
			}
		}

		//TODO next optimizations
		return false;
	}

	private function optimize_revisions() {
		global $wpdb;
		$ttl   = Urlslab_Data::get_now( 86400 * Urlslab_User_Widget::get_instance()->get_activated_widget( Urlslab_Optimize::SLUG )->get_option( Urlslab_Optimize::SETTING_NAME_TTL ) );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_type='revision' AND post_modified < %s LIMIT 1000", $ttl ) ); // phpcs:ignore
	}
}
