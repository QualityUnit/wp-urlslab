<?php

/**
 * Fired during plugin activation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Urlslab_Screenshot
 * @subpackage Urlslab_Screenshot/includes
 */
class Urlslab_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		Urlslab_Activator::init_tables();
		Urlslab_Activator::init_cron();
	}

	private static function init_tables() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'urlslab_screenshot';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    	urlMd5 varchar(32) NOT NULL, 
		urlName varchar(2048) NOT NULL,
		status char(1) NOT NULL, -- U: update, P: pending, A: Available, N: Not scheduled, B: Broken Link
		domainId char(16),
    	urlId char(16),
        screenshotDate bigint,
    	updateStatusDate DATETIME,
    	urlTitle	  text, 
		PRIMARY KEY  (urlMd5),
    	INDEX (updateStatusDate, status)
	) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_cron() {
		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshot-cron.php';
		add_action( 'urlslab_cron_hook', 'urlslab_cron_exec', 10, 0 );
		if ( ! wp_next_scheduled( 'urlslab_cron_hook' ) ) {
			do_action( 'qm/debug', 'activate' );
			wp_schedule_event( time(), 'every_minute', 'urlslab_cron_hook' );
		}
	}

}