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
		add_option( Urlslab_Offload_Background_Attachments_Cron::SETTING_NAME_SCHEDULER_POINTER, - 1, '', false );
		( new Urlslab_Keywords_Links() )->add_options_on_activate();
		( new Urlslab_Link_Enhancer() )->add_options_on_activate();
		( new Urlslab_Media_Offloader_Widget() )->add_options_on_activate();
		( new Urlslab_Meta_Tag() )->add_options_on_activate();
	}

	private static function install_tables() {
		add_option( URLSLAB_VERSION_SETTING, '1.0.0' );
		self::init_urls_tables();
		self::init_urls_map_tables();
		self::init_keywords_tables();
		self::init_related_resources_tables();
		self::init_urlslab_error_log();
		self::init_urlslab_files();
		self::init_urlslab_file_urls_table();
		self::init_urlslab_file_pointers();
		self::init_urlslab_file_db_driver_contents();
		self::init_youtube_cache_tables();
		self::init_keywords_map_table();
		self::init_css_cache_tables();
		self::init_content_cache_tables();
		self::init_search_replace_tables();
		self::init_screenshot_urls_table();
		self::init_content_generators_table();
		self::init_not_found_log_table();
		self::init_redirects_table();
	}

	public static function upgrade_steps() {

		if ( URLSLAB_VERSION == get_option( URLSLAB_VERSION_SETTING, '1.0.0' ) ) {
			return;
		}

		self::update_step(
			'1.49.0',
			function() {
				self::init_search_replace_tables();
			}
		);

		self::update_step(
			'2.0.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_MAP_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_URLS_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_MAP_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_RELATED_RESOURCE_TABLE ); // phpcs:ignore
				self::init_urls_tables();
				self::init_urls_map_tables();
				self::init_urlslab_file_urls_table();
				self::init_keywords_map_table();
				self::init_related_resources_tables();
			}
		);

		self::update_step(
			'2.1.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " ADD COLUMN scr_schedule char(1) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " ADD INDEX idx_scr_schedule (scr_schedule)" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.2.0',
			function() {
				self::init_screenshot_urls_table();
			}
		);

		self::update_step(
			'2.3.0',
			function() {
				self::init_content_generators_table();
			}
		);

		self::update_step(
			'2.4.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " ADD COLUMN rel_schedule char(1) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN rel_updated DATETIME' ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD INDEX idx_rel_schedule (rel_schedule, rel_updated)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.5.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATORS_TABLE ); // phpcs:ignore
				self::init_content_generators_table();
			}
		);
		self::update_step(
			'2.6.0',
			function() {
				self::init_not_found_log_table();
			}
		);
		self::update_step(
			'2.7.0',
			function() {
				self::init_redirects_table();
			}
		);

		//all update steps done, set the current version
		update_option( URLSLAB_VERSION_SETTING, URLSLAB_VERSION );
	}

	private static function update_step( string $version, callable $executable ) {
		if ( version_compare( get_option( URLSLAB_VERSION_SETTING, '1.0.0' ), $version, '<' ) ) {
			call_user_func( $executable );
			update_option( URLSLAB_VERSION_SETTING, $version );
		}
	}

	private static function init_urls_tables() {
		global $wpdb;
		$table_name      = URLSLAB_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			url_id bigint NOT NULL,
			url_name varchar(2048) NOT NULL,
			scr_status char(1) NOT NULL,
			sum_status char(1) NOT NULL,
			http_status SMALLINT DEFAULT -1, -- -1: not checked, 200: ok, 3xx: redirect, 4xx: client error, 5xx: server error
			update_scr_date DATETIME,
			update_sum_date DATETIME,
			update_http_date DATETIME,
			urlslab_domain_id char(16),
			urlslab_url_id char(16),
			urlslab_scr_timestamp bigint,
			urlslab_sum_timestamp bigint,
			url_title	  text,
			url_meta_description text,
			url_summary			text,
			visibility char(1) NOT NULL DEFAULT 'V', -- V: visible, H: hidden
			url_type char(1) NOT NULL DEFAULT 'I', -- I: Internal, E: external
			scr_schedule char(1) NOT NULL DEFAULT '', -- N: New, S: Scheduled, E: Error 
			rel_schedule char(1) NOT NULL DEFAULT '', -- N: New, S: Scheduled, E: Error, empty - not sheduling
			rel_updated DATETIME, 
			PRIMARY KEY  (url_id),
			INDEX idx_scr_changed (update_scr_date, scr_status),
			INDEX idx_sum_changed (update_sum_date, sum_status),
			INDEX idx_http_changed (update_http_date, http_status),
			INDEX idx_scr_schedule (scr_schedule),
			INDEX idx_rel_schedule (rel_schedule, rel_updated)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_youtube_cache_tables() {
		global $wpdb;
		$table_name      = URLSLAB_YOUTUBE_CACHE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			videoid varchar(32) NOT NULL,
			microdata text,
			status_changed datetime NULL,
			status char(1) NOT NULL, -- P: processing, A: Available, N: New, D - disabled
			PRIMARY KEY  (videoid)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urls_map_tables() {
		global $wpdb;
		$table_name      = URLSLAB_URLS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			src_url_id bigint NOT NULL,
			dest_url_id bigint NOT NULL,
			PRIMARY KEY  (src_url_id, dest_url_id),
    		INDEX idx_desturl (dest_url_id)
		) $charset_collate;";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}


	private static function init_keywords_tables() {
		global $wpdb;
		$table_name      = URLSLAB_KEYWORDS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
    		kw_id bigint NOT NULL,
			keyword varchar(250) NOT NULL,
			urlLink varchar(500) NOT NULL,
			kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
			kw_length TINYINT UNSIGNED NOT NULL,
			lang varchar(10) NOT NULL DEFAULT 'all',
			urlFilter varchar(250) NOT NULL DEFAULT '.*',
			kwType char(1) NOT NULL DEFAULT 'M', -- M: manual, I: imported
    		PRIMARY KEY  (kw_id),
			INDEX  idx_keywords (keyword),
			INDEX idx_sorting (lang, kw_priority, kw_length)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_keywords_map_table() {
		global $wpdb;
		$table_name      = URLSLAB_KEYWORDS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
    		kw_id bigint NOT NULL,
    		url_id bigint NOT NULL,
    		dest_url_id bigint DEFAULT 0,
    		link_type char(1) NOT NULL DEFAULT 'U',
    		PRIMARY KEY  (kw_id, url_id, dest_url_id),
			INDEX  idx_urls (url_id),
			INDEX dest_urls (dest_url_id)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_related_resources_tables() {
		global $wpdb;
		$table_name      = URLSLAB_RELATED_RESOURCE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			src_url_id bigint NOT NULL,
			dest_url_id bigint NOT NULL,
			pos tinyint unsigned default 10,
			PRIMARY KEY  (src_url_id,dest_url_id)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_error_log() {
		global $wpdb;
		$table_name      = URLSLAB_ERROR_LOG_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
    		id int NOT NULL AUTO_INCREMENT,
			errorLog text NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_files() {
		global $wpdb;
		$table_name      = URLSLAB_FILES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			fileid char(32) NOT NULL,
			url varchar(1024) NOT NULL,
			parent_url varchar(1024),
			local_file varchar(1024),
			filename varchar(750),
			filetype varchar(32),
			filestatus char(1) NOT NULL,
			filehash varchar(32) NOT NULL DEFAULT '',
			filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
			status_changed datetime NULL,
			webp_fileid varchar(32),
			avif_fileid varchar(32),
			PRIMARY KEY (fileid),
			INDEX idx_file_filter (filestatus, status_changed),
			INDEX idx_file_pointer (filehash, filesize)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_urls_table() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
			url_id bigint NOT NULL,
			fileid char(32) NOT NULL,
			PRIMARY KEY (url_id, fileid),
			INDEX idx_files (fileid)) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_pointers() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_POINTERS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
				filehash varchar(32) NOT NULL,
				filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
				width mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
				height mediumint(8) UNSIGNED ZEROFILL DEFAULT NULL,
				driver char(1) NOT NULL,
				webp_filehash varchar(32) NOT NULL DEFAULT '',
				webp_filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
				avif_filehash varchar(32) NOT NULL DEFAULT '',
				avif_filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
				PRIMARY KEY (filehash,filesize)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_db_driver_contents() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS $table_name (
    		  filehash varchar(32) NOT NULL,
    		  filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
			  partid SMALLINT UNSIGNED NOT NULL,
			  content longblob DEFAULT NULL,
			  PRIMARY KEY (filehash,filesize,partid)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_css_cache_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CSS_CACHE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  url_id bigint,
    		  url text,
    		  css_content mediumtext,
    		  status char(1) DEFAULT 'N',
    		  status_changed datetime NULL,
    		  filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
			  PRIMARY KEY (url_id),
			  INDEX idx_changed (status_changed)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_content_cache_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CONTENT_CACHE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  cache_crc32 bigint,
    		  cache_len int,
    		  cache_content longtext,
    		  date_changed datetime NULL,
			  PRIMARY KEY (cache_crc32, cache_len),
			  INDEX idx_changed (date_changed)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_search_replace_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_SEARCH_AND_REPLACE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  id int NOT NULL AUTO_INCREMENT,
    		  str_search TEXT,
    		  str_replace TEXT,
    		  search_type CHAR(1) NOT NULL DEFAULT 'T',
    		  url_filter VARCHAR(255) NOT NULL DEFAULT '.*',
			  PRIMARY KEY (id)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_screenshot_urls_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_SCREENSHOT_URLS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  screenshot_url_id bigint NOT NULL,
    		  src_url_id bigint NOT NULL,
			  PRIMARY KEY (screenshot_url_id, src_url_id)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}


	private static function init_content_generators_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CONTENT_GENERATORS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  generator_id bigint NOT NULL,
    		  semantic_context TEXT,
    		  command TEXT,
    		  url_filter TEXT,
    		  result LONGTEXT,
    		  status CHAR(1) NOT NULL DEFAULT 'N',
    		  lang VARCHAR(8),
    		  status_changed DATETIME NULL,
			  PRIMARY KEY (generator_id)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_not_found_log_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_NOT_FOUND_LOG_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  url_id bigint NOT NULL,
    		  url VARCHAR(2000),
    		  cnt INT UNSIGNED ZEROFILL DEFAULT 0,
    		  created DATETIME,
    		  updated DATETIME,
			  PRIMARY KEY (url_id),
			  INDEX idx_updated (updated),
			  INDEX idx_created (created)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_redirects_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_REDIRECTS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
    		  redirect_id int AUTO_INCREMENT,
    		  match_type CHAR(1) DEFAULT 'S',
    		  match_url VARCHAR(2000),
    		  replace_url VARCHAR(2000),
    		  redirect_code tinyint unsigned DEFAULT 301,
    		  is_logged CHAR(1),
    		  capabilities VARCHAR(2000),
    		  browser VARCHAR(2000),
    		  cookie VARCHAR(2000),
    		  headers VARCHAR(2000),
    		  params VARCHAR(2000),
    		  cnt INT UNSIGNED ZEROFILL DEFAULT 0,
    		  if_not_found CHAR(1) DEFAULT '',
			  PRIMARY KEY (redirect_id)
        ) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

}
