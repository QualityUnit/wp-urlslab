<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Rel_Articles_Cron extends Urlslab_Cron {

	protected function execute(): bool {
		global $wpdb;

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Related_Resources_Widget::SLUG ) ) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE rel_schedule = %s OR (rel_schedule = %s AND rel_updated < %s ) ORDER BY rel_updated LIMIT 1', // phpcs:ignore
				Urlslab_Url_Row::REL_SCHEDULE_NEW,
				Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		$url->set_rel_updated( Urlslab_Data::get_now() );
		//TRY TO LOAD DATA FROM URLSLAB ... if empty response, schedule


		return true;
	}

	public function get_description(): string {
		return __( 'Updating related articles', 'urlslab' );
	}
}
