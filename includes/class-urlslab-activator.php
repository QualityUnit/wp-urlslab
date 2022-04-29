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
	}

	private static function init_tables() {
		global $wpdb;
		global $urlslab_db_version;

		$table_name = 'common_wp_' . 'urlslab_screenshot';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
		urlId bigint NOT NULL,
		urlName text NOT NULL,
		status ENUM('AVAILABLE', 'PENDING', 'NOT_SCHEDULED') NOT NULL,
		urlScreenshot text,
    	urlTitle	  text, 
    	urlSummary	  text,
		PRIMARY KEY  (urlId)
	) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );

		add_option( 'urlslab_db_version', $urlslab_db_version );
	}

}
