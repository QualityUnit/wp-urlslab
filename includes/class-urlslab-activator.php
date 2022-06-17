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
		self::init_screenshot_widget_tables();
		self::init_keyword_widget_tables();
		self::init_related_resources_widget_tables();
	}

	private static function init_screenshot_widget_tables() {
		global $wpdb;
		$table_name = URLSLAB_URLS_TABLE;
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
			urlMetaDescription text,
			urlSummary			text,
			PRIMARY KEY  (urlMd5),
			INDEX (updateStatusDate, status)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_keyword_widget_tables() {
		global $wpdb;
		$table_name = URLSLAB_KEYWORDS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			keyword varchar(250) NOT NULL,
			kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
			kw_length TINYINT UNSIGNED NOT NULL,
			lang varchar(10) NOT NULL,
			urlLink text NOT NULL,
			PRIMARY KEY  (lang, keyword), 
			INDEX idx_sorting (kw_priority, kw_length)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_related_resources_widget_tables() {
		global $wpdb;
		$table_name = URLSLAB_RELATED_RESOURCE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			srcUrlMd5 varchar(32) NOT NULL,
			destUrlMd5 varchar(32) NOT NULL,
			PRIMARY KEY  (srcUrlMd5,destUrlMd5)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

}
