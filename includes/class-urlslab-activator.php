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

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		add_option( Urlslab_Offload_Background_Attachments_Cron::SETTING_NAME_SCHEDULER_POINTER, -1, '', false );
		Urlslab_Keywords_Links::add_option();
		Urlslab_Link_Enhancer::add_option();
		Urlslab_Media_Offloader_Widget::add_option();
		Urlslab_Meta_Tag::add_option();
	}

	private static function install_tables() {
		add_option( URLSLAB_VERSION_SETTING, '1.0.0' );
		self::init_urls_tables();
		self::init_urls_map_tables();
		self::init_keywords_tables();
		self::init_related_resources_widget_tables();
		self::init_urlslab_error_log();
		self::init_urlslab_files();
		self::init_urlslab_file_urls();
		self::init_urlslab_file_alternatives();
		self::init_urlslab_file_contents();
		self::init_youtube_cache_tables();
		self::init_keywords_map();
	}

	private static function upgrade_steps() {
		global $wpdb;
		$version = get_option( URLSLAB_VERSION_SETTING, '1.0' );

		if ( version_compare( $version, '1.13', '<' ) ) {
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_FILES_TABLE . ';'); // phpcs:ignore
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_FILE_CONTENTS_TABLE . ';'); // phpcs:ignore
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_FILE_ALTERNATIVES_TABLE . ';'); // phpcs:ignore
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_URLS_TABLE . ';'); // phpcs:ignore
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_RELATED_RESOURCE_TABLE . ';'); // phpcs:ignore
			self::init_urlslab_files();
			self::init_urlslab_file_contents();
			self::init_urlslab_file_alternatives();
			self::init_urls_tables();
			self::init_related_resources_widget_tables();
		}

		if ( version_compare( $version, '1.22', '<' ) ) {
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_URLS_MAP_TABLE . ';'); // phpcs:ignore
			self::init_urls_map_tables();
		}
		if ( version_compare( $version, '1.24', '<' ) ) {
			$wpdb->query('DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_TABLE . ';'); // phpcs:ignore
			self::init_keywords_tables();
		}
		if ( version_compare( $version, '1.31', '<' ) ) {
			self::init_urlslab_file_urls();
		}

		if ( version_compare( $version, '1.32', '<' ) ) {
			$wpdb->query('ALTER TABLE ' . URLSLAB_FILES_TABLE . ' ADD COLUMN parent_url varchar(1024);'); // phpcs:ignore
			$wpdb->query('DELETE FROM ' . URLSLAB_FILES_TABLE . ' WHERE filestatus=\'E\';'); // phpcs:ignore
		}

		//all update steps done, set the current version
		update_option( URLSLAB_VERSION_SETTING, URLSLAB_VERSION );
	}

	private static function init_urls_tables() {
		global $wpdb;
		$table_name = URLSLAB_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			urlMd5 bigint NOT NULL,
			urlName varchar(2048) NOT NULL,
			status char(1) NOT NULL, -- U: update, P: pending, A: Available, N: Not scheduled, B: Broken Link
			domainId char(16),
			urlId char(16),
			screenshotDate bigint,
			updateStatusDate DATETIME,
			urlTitle	  text,
			urlMetaDescription text,
			urlSummary			text,
			visibility char(1) NOT NULL DEFAULT 'V', -- V: visible, H: hidden
			PRIMARY KEY  (urlMd5),
			INDEX (updateStatusDate, status)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_youtube_cache_tables() {
		global $wpdb;
		$table_name = URLSLAB_YOUTUBE_CACHE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			videoid varchar(32) NOT NULL,
			microdata text,
			status char(1) NOT NULL, -- P: processing, A: Available, N: New, D - disabled
			PRIMARY KEY  (videoid)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urls_map_tables() {
		global $wpdb;
		$table_name = URLSLAB_URLS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			srcUrlMd5 bigint NOT NULL,
			destUrlMd5 bigint NOT NULL,
			PRIMARY KEY  (srcUrlMd5, destUrlMd5),
    		INDEX idx_desturl (destUrlMd5)
		) $charset_collate;";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}



	private static function init_keywords_tables() {
		global $wpdb;
		$table_name = URLSLAB_KEYWORDS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    		kw_id bigint NOT NULL,
			keyword varchar(250) NOT NULL,
			urlLink varchar(500) NOT NULL,
			kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
			kw_length TINYINT UNSIGNED NOT NULL,
			lang varchar(10) NOT NULL DEFAULT 'all',
			urlFilter varchar(250) NOT NULL DEFAULT '.*',
    		PRIMARY KEY  (kw_id),
			INDEX  idx_keywords (keyword),
			INDEX idx_sorting (lang, kw_priority, kw_length)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_keywords_map() {
		global $wpdb;
		$table_name = URLSLAB_KEYWORDS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
    		kw_id bigint NOT NULL,
    		urlMd5 bigint NOT NULL,
    		PRIMARY KEY  (kw_id, urlMd5),
			INDEX  idx_urls (urlMd5)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_related_resources_widget_tables() {
		global $wpdb;
		$table_name = URLSLAB_RELATED_RESOURCE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			srcUrlMd5 bigint NOT NULL,
			destUrlMd5 bigint NOT NULL,
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
			parent_url varchar(1024),
			local_file varchar(1024),
			filename varchar(750),
			filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
			filetype varchar(100),
			width mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
			height mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
			filestatus char(1) NOT NULL,
			driver char(1) NOT NULL,
			last_seen datetime NULL,
    		webp_alternative char(1) NOT NULL DEFAULT 'N',
    		avif_alternative char(1) NOT NULL DEFAULT 'N',
			PRIMARY KEY (fileid),
			INDEX idx_file_filter (driver, filestatus),
			INDEX idx_file_sort (filesize)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_urls() {
		global $wpdb;
		$table_name = URLSLAB_FILE_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			urlMd5 bigint NOT NULL,
			fileid char(32) NOT NULL,
			PRIMARY KEY (urlMd5, fileid),
			INDEX idx_files (fileid)) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_alternatives() {
		global $wpdb;
		$table_name = URLSLAB_FILE_ALTERNATIVES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			fileid char(32) NOT NULL,
			alternative_fileid char(32),
			PRIMARY KEY (fileid, alternative_fileid),
    		INDEX idx_alternative_fileid (alternative_fileid)
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
