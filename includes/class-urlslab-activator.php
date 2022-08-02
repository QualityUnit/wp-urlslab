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
		Urlslab_Activator::install_tables();
		Urlslab_Activator::upgrade_steps();

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-cron.php';
		add_option( Urlslab_Offload_Cron::SETTING_NAME_SCHEDULER_POINTER, -1, '', false );
	}

	private static function install_tables() {
		self::init_screenshot_widget_tables();
		self::init_keyword_widget_tables();
		self::init_related_resources_widget_tables();
		self::init_urlslab_error_log();
		self::init_urlslab_files();
		self::init_urlslab_file_contents();
	}

	private static function upgrade_steps() {
		global $wpdb;
		$version = get_option( URLSLAB_VERSION_SETTING, URLSLAB_VERSION );

		if ( version_compare( $version, '1.2.0', '<' ) ) {
			$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_TABLE ); // phpcs:ignore
			//create table again
			self::init_keyword_widget_tables();
			update_option( URLSLAB_VERSION_SETTING, '1.2.0' );
		}

		if ( version_compare( $version, '1.3.0', '<' ) ) {
			$wpdb->query('ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN last_seen DATETIME NULL;'); // phpcs:ignore
		}
		//all update steps done, set the current version
		update_option( URLSLAB_VERSION_SETTING, URLSLAB_VERSION );
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
    		kwMd5 varchar(32) NOT NULL,
			keyword varchar(250) NOT NULL,
			urlLink varchar(500) NOT NULL,
			kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
			kw_length TINYINT UNSIGNED NOT NULL,
			lang varchar(10) NOT NULL DEFAULT 'all',
			urlFilter varchar(250) NOT NULL DEFAULT '.*',
    		PRIMARY KEY  (kwMd5),
			INDEX  idx_keywords (keyword),
			INDEX idx_sorting (lang, kw_priority, kw_length)
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

	private static function init_urlslab_error_log() {
		global $wpdb;
		$table_name = URLSLAB_ERROR_LOG_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    		id int NOT NULL AUTO_INCREMENT,
			errorLog text NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_files() {
		global $wpdb;
		$table_name = URLSLAB_FILES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    		  fileid char(32) NOT NULL,
			  url varchar(1024) NOT NULL,
			  local_file varchar(1024),
			  filename varchar(750),
			  filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
			  filetype varchar(100),
			  width mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
			  height mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
			  filestatus char(1) NOT NULL,
			  driver char(1) NOT NULL,
    		  last_seen datetime NULL,
			  PRIMARY KEY (fileid)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_contents() {
		global $wpdb;
		$table_name = URLSLAB_FILE_CONTENTS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    		  fileid char(32) NOT NULL,
			  contentid SMALLINT UNSIGNED NOT NULL,
			  content longblob DEFAULT NULL,
			  PRIMARY KEY (fileid,contentid)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

}
