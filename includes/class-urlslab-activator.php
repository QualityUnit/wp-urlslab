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

		$table_name = 'common_wp_' . 'urlslab_screenshot';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
        domainId  bigint NOT NULL,
		urlId bigint NOT NULL,
		urlName text NOT NULL,
		status ENUM('AVAILABLE', 'PENDING', 'NOT_SCHEDULED') NOT NULL,
		urlPath text,
        screenshotDate DATETIME,
    	urlTitle	  text, 
    	urlSummary	  text,
		PRIMARY KEY  (domainId, urlId), 
    	INDEX (urlName, status)
	) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

}
