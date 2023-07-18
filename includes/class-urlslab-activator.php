<?php

/**
 * Fired during plugin activation.
 *
 * @see        http://example.com
 * @since      1.0.0
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 */
class Urlslab_Activator {


	/**
	 * Short Description. (use period).
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		Urlslab_Activator::install_tables();
		Urlslab_Activator::upgrade_steps();
		self::add_roles();

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		add_option( Urlslab_Offload_Background_Attachments_Cron::SETTING_NAME_SCHEDULER_POINTER, - 1, '', false );
		( new Urlslab_Keywords_Links() )->add_options_on_activate();
		( new Urlslab_Link_Enhancer() )->add_options_on_activate();
		( new Urlslab_Media_Offloader_Widget() )->add_options_on_activate();
		( new Urlslab_Meta_Tag() )->add_options_on_activate();
	}

	public static function deactivate() {
		$timestamp = wp_next_scheduled( 'urlslab_cron_hook' );
		wp_unschedule_event( $timestamp, 'urlslab_cron_hook' );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		delete_option( Urlslab_Offload_Background_Attachments_Cron::SETTING_NAME_SCHEDULER_POINTER );

		remove_role( Urlslab_Api_Base::URLSLAB_ROLE_ADMIN );
		remove_role( Urlslab_Api_Base::URLSLAB_ROLE_EDITOR );
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
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_TABLE );             // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_MAP_TABLE );         // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_URLS_TABLE );        // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_MAP_TABLE );     // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_RELATED_RESOURCE_TABLE ); // phpcs:ignore
				self::init_urls_tables();
				self::init_urls_map_tables();
				self::init_urlslab_file_urls_table();
				self::init_keywords_map_table();
				self::init_related_resources_tables();
			}
		);

		self::update_step(
			'2.2.0',
			function() {
				self::init_screenshot_urls_table();
			}
		);

		self::update_step(
			'2.4.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " ADD COLUMN rel_schedule char(1) NOT NULL DEFAULT ''" );    // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN rel_updated DATETIME' );                        // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD INDEX idx_rel_schedule (rel_schedule, rel_updated)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.6.0',
			function() {
				self::init_not_found_log_table();
				self::init_redirects_table();
			}
		);

		self::update_step(
			'2.8.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_NOT_FOUND_LOG_TABLE . ' ADD COLUMN request_data TEXT' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.11.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " DROP COLUMN scr_schedule" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.13.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_REDIRECTS_TABLE ); // phpcs:ignore
				self::init_redirects_table();
			}
		);

		self::update_step(
			'2.14.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN url_h1	text' ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN final_url_id bigint' ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD INDEX idx_final_url_id (final_url_id)' ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET final_url_id = url_id' ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.15.0',
			function() {
				self::init_youtube_urls_tables();
			}
		);
		self::update_step(
			'2.16.0',
			function() {
				self::init_labels_table();

				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . " ADD COLUMN labels VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_KEYWORDS_TABLE . " ADD COLUMN labels VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_FILES_TABLE . " ADD COLUMN labels VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SEARCH_AND_REPLACE_TABLE . " ADD COLUMN labels VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_REDIRECTS_TABLE . " ADD COLUMN labels VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.17.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATORS_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATOR_URLS_TABLE ); // phpcs:ignore
				self::init_generator_shortcodes_table();
				self::init_generator_results_table();
				self::init_generator_urls_table();
			}
		);

		self::update_step(
			'2.18.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_YOUTUBE_CACHE_TABLE . " ADD COLUMN captions longtext" ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.19.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_NOT_FOUND_LOG_TABLE . " ADD COLUMN status CHAR(1) DEFAULT 'N'" ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.20.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " ADD COLUMN shortcode_type CHAR(1) NOT NULL DEFAULT 'S'" ); // phpcs:ignore
				$wpdb->query( 'TRUNCATE ' . URLSLAB_YOUTUBE_CACHE_TABLE ); // phpcs:ignore
				$wpdb->query( 'TRUNCATE ' . URLSLAB_YOUTUBE_URLS_TABLE ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.21.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_YOUTUBE_CACHE_TABLE . " MODIFY captions LONGTEXT" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_YOUTUBE_CACHE_TABLE . " MODIFY microdata LONGTEXT" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_CSS_CACHE_TABLE . " MODIFY css_content LONGTEXT" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " MODIFY template LONGTEXT" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_ERROR_LOG_TABLE . " MODIFY errorLog LONGTEXT" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.22.0',
			function() {
				global $wpdb;
				$wpdb->query( 'TRUNCATE ' . URLSLAB_KEYWORDS_MAP_TABLE ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_KEYWORDS_TABLE . ' RENAME old_kw_table_name' ); // phpcs:ignore
				self::init_keywords_tables();
				$wpdb->query( 'INSERT INTO ' . URLSLAB_KEYWORDS_TABLE . ' (kw_hash, keyword, urlLink, kw_priority, kw_length, lang, urlFilter, kwType, labels) SELECT kw_id, keyword, urlLink, kw_priority, kw_length, lang, urlFilter, kwType, labels FROM old_kw_table_name' ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS old_kw_table_name' ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.23.0',
			function() {
				self::init_cache_rules_table();
			}
		);
		self::update_step(
			'2.24.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_RELATED_RESOURCE_TABLE . " ADD COLUMN created_date DATETIME" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_RELATED_RESOURCE_TABLE . " SET created_date = now()" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.25.0',
			function() {
				self::init_custom_html_rules_table();
			}
		);
		self::update_step(
			'2.26.0',
			function() {
				self::init_js_cache_tables();
			}
		);

		self::update_step(
			'2.27.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SEARCH_AND_REPLACE_TABLE . " ADD COLUMN login_status CHAR(1) NOT NULL DEFAULT 'A'" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.29.0',
			function() {
				global $wpdb;
                $wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " ADD COLUMN shortcode_name VARCHAR(255) NOT NULL DEFAULT ''" ); // phpcs:ignore
                $wpdb->query( 'UPDATE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " SET shortcode_name = SUBSTRING(prompt, 0, 100)" ); // phpcs:ignore
			}
		);

		// all update steps done, set the current version
		update_option( URLSLAB_VERSION_SETTING, URLSLAB_VERSION );
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
		self::init_youtube_urls_tables();
		self::init_keywords_map_table();
		self::init_css_cache_tables();
		self::init_js_cache_tables();
		self::init_content_cache_tables();
		self::init_search_replace_tables();
		self::init_screenshot_urls_table();
		self::init_not_found_log_table();
		self::init_redirects_table();
		self::init_labels_table();
		self::init_generator_shortcodes_table();
		self::init_generator_results_table();
		self::init_generator_urls_table();
		self::init_cache_rules_table();
		self::init_custom_html_rules_table();
	}

	private static function init_urls_tables() {
		global $wpdb;
		$table_name      = URLSLAB_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
			url_id bigint NOT NULL,
			final_url_id bigint,
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
			url_h1	  text,
			url_meta_description text,
			url_summary			text,
			visibility char(1) NOT NULL DEFAULT 'V', -- V: visible, H: hidden
			url_type char(1) NOT NULL DEFAULT 'I', -- I: Internal, E: external
			rel_schedule char(1) NOT NULL DEFAULT '', -- N: New, S: Scheduled, E: Error, empty - not sheduling
			rel_updated DATETIME,
      labels VARCHAR(255) NOT NULL DEFAULT '',
			PRIMARY KEY  (url_id),
			INDEX idx_final_url_id (final_url_id),
			INDEX idx_scr_changed (update_scr_date, scr_status),
			INDEX idx_sum_changed (update_sum_date, sum_status),
			INDEX idx_http_changed (update_http_date, http_status),
			INDEX idx_rel_schedule (rel_schedule, rel_updated)
		) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urls_map_tables() {
		global $wpdb;
		$table_name      = URLSLAB_URLS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							src_url_id bigint NOT NULL,
							dest_url_id bigint NOT NULL,
							PRIMARY KEY  (src_url_id, dest_url_id),
							INDEX idx_desturl (dest_url_id)) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_keywords_tables() {
		global $wpdb;
		$table_name      = URLSLAB_KEYWORDS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							kw_id int NOT NULL AUTO_INCREMENT,
							kw_hash bigint NOT NULL,
							keyword varchar(250) NOT NULL,
							urlLink varchar(500) NOT NULL,
							kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
							kw_length TINYINT UNSIGNED NOT NULL,
							lang varchar(10) NOT NULL DEFAULT 'all',
							urlFilter varchar(250) NOT NULL DEFAULT '.*',
							kwType char(1) NOT NULL DEFAULT 'M', -- M: manual, I: imported
							labels VARCHAR(255) NOT NULL DEFAULT '',
							PRIMARY KEY  (kw_id),
							INDEX  idx_keywords (keyword),
							UNIQUE INDEX idx_hash (kw_hash),
							INDEX idx_sorting (lang, kw_priority, kw_length)) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_related_resources_tables() {
		global $wpdb;
		$table_name      = URLSLAB_RELATED_RESOURCE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							src_url_id bigint NOT NULL,
							dest_url_id bigint NOT NULL,
							pos tinyint unsigned default 10,
							created_date DATETIME,
							PRIMARY KEY  (src_url_id,dest_url_id)) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_error_log() {
		global $wpdb;
		$table_name      = URLSLAB_ERROR_LOG_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							id int UNSIGNED NOT NULL AUTO_INCREMENT,
							errorLog longtext NOT NULL,
							PRIMARY KEY  (id)) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_files() {
		global $wpdb;
		$table_name      = URLSLAB_FILES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
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
							labels VARCHAR(255) NOT NULL DEFAULT '',
							PRIMARY KEY (fileid),
							INDEX idx_file_filter (filestatus, status_changed),
							INDEX idx_file_pointer (filehash, filesize)) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_urls_table() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							url_id bigint NOT NULL,
							fileid char(32) NOT NULL,
							PRIMARY KEY (url_id, fileid),
							INDEX idx_files (fileid)) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_pointers() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_POINTERS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
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
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_urlslab_file_db_driver_contents() {
		global $wpdb;
		$table_name      = URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							filehash varchar(32) NOT NULL,
							filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
							partid SMALLINT UNSIGNED NOT NULL,
							content longblob DEFAULT NULL,
							PRIMARY KEY (filehash,filesize,partid)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_youtube_cache_tables() {
		global $wpdb;
		$table_name      = URLSLAB_YOUTUBE_CACHE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
								videoid varchar(32) NOT NULL,
								microdata longtext,
								captions longtext,
								status_changed datetime NULL,
								status char(1) NOT NULL, -- P: processing, A: Available, N: New, D - disabled
								PRIMARY KEY  (videoid)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_youtube_urls_tables() {
		global $wpdb;
		$table_name      = URLSLAB_YOUTUBE_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
			videoid varchar(32) NOT NULL,
			url_id bigint NOT NULL,
			PRIMARY KEY  (videoid, url_id)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_keywords_map_table() {
		global $wpdb;
		$table_name      = URLSLAB_KEYWORDS_MAP_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
								kw_id bigint NOT NULL,
								url_id bigint NOT NULL,
								dest_url_id bigint DEFAULT 0,
								link_type char(1) NOT NULL DEFAULT 'U',
								PRIMARY KEY  (kw_id, url_id, dest_url_id),
								INDEX  idx_urls (url_id),
								INDEX dest_urls (dest_url_id)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_css_cache_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CSS_CACHE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						url_id bigint,
						url text,
						css_content longtext,
						status char(1) DEFAULT 'N',
						status_changed datetime NULL,
						filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
						PRIMARY KEY (url_id),
						INDEX idx_changed (status_changed)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}
	private static function init_js_cache_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_JS_CACHE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						url_id bigint,
						url text,
						js_content longtext,
						status char(1) DEFAULT 'N',
						status_changed datetime NULL,
						filesize int(10) UNSIGNED ZEROFILL DEFAULT 0,
						PRIMARY KEY (url_id),
						INDEX idx_changed (status_changed)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_content_cache_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CONTENT_CACHE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						cache_crc32 bigint,
						cache_len int,
						cache_content longtext,
						date_changed datetime NULL,
						PRIMARY KEY (cache_crc32, cache_len),
						INDEX idx_changed (date_changed)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_search_replace_tables() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_SEARCH_AND_REPLACE_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						id int UNSIGNED NOT NULL AUTO_INCREMENT,
						str_search TEXT,
						str_replace TEXT,
						search_type CHAR(1) NOT NULL DEFAULT 'T',
						login_status CHAR(1) NOT NULL DEFAULT 'A',
						url_filter VARCHAR(255) NOT NULL DEFAULT '.*',
						labels VARCHAR(255) NOT NULL DEFAULT '',
						PRIMARY KEY (id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_screenshot_urls_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_SCREENSHOT_URLS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						screenshot_url_id bigint NOT NULL,
						src_url_id bigint NOT NULL,
						PRIMARY KEY (screenshot_url_id, src_url_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_generator_shortcodes_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_GENERATOR_SHORTCODES_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						shortcode_id int UNSIGNED NOT NULL AUTO_INCREMENT,
						shortcode_name VARCHAR(255) NOT NULL DEFAULT '',
						semantic_context TEXT,
						prompt TEXT,
						default_value TEXT,
						url_filter TEXT,
						template longtext,
						status CHAR(1) NOT NULL DEFAULT 'N',
						shortcode_type CHAR(1) NOT NULL DEFAULT 'S',
						model VARCHAR(100),
						date_changed DATETIME NULL,
						PRIMARY KEY (shortcode_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_generator_results_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_GENERATOR_RESULTS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						hash_id bigint NOT NULL,
						shortcode_id int UNSIGNED NOT NULL,
						semantic_context TEXT,
						prompt_variables TEXT,
						result TEXT,
						url_filter TEXT,
						status CHAR(1) NOT NULL DEFAULT 'N',
						date_changed DATETIME NULL,
						labels VARCHAR(255) NOT NULL DEFAULT '',
						PRIMARY KEY (hash_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}


	private static function init_generator_urls_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_GENERATOR_URLS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
    		  shortcode_id int UNSIGNED NOT NULL,
    		  hash_id bigint NOT NULL,
    		  url_id bigint NOT NULL,
    		  created DATETIME NULL,
			  PRIMARY KEY (shortcode_id, hash_id, url_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_not_found_log_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_NOT_FOUND_LOG_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						url_id bigint NOT NULL,
						url VARCHAR(2000),
						cnt INT UNSIGNED ZEROFILL DEFAULT 0,
						request_data TEXT,
						created DATETIME,
						updated DATETIME,
						status char(1) DEFAULT 'N',
						PRIMARY KEY (url_id),
						INDEX idx_updated (updated),
						INDEX idx_created (created)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_redirects_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_REDIRECTS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						redirect_id int UNSIGNED NOT NULL AUTO_INCREMENT,
						match_type CHAR(1) DEFAULT 'S',
						match_url VARCHAR(2000),
						replace_url VARCHAR(2000),
						redirect_code SMALLINT unsigned DEFAULT 301,
						is_logged CHAR(1) DEFAULT 'A',
						capabilities VARCHAR(2000),
						roles VARCHAR(1000),
						browser VARCHAR(500),
						cookie VARCHAR(1000),
						headers VARCHAR(1000),
						params VARCHAR(1000),
						ip VARCHAR(500),
						cnt INT UNSIGNED ZEROFILL DEFAULT 0,
						if_not_found CHAR(1) DEFAULT 'A',
						row_hash bigint,
						labels VARCHAR(255) NOT NULL DEFAULT '',
						PRIMARY KEY (redirect_id),
						UNIQUE INDEX idx_uniq_hash (row_hash)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}
	private static function init_cache_rules_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CACHE_RULES_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						rule_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						match_type CHAR(1) DEFAULT 'S',
						match_url VARCHAR(2000),
						is_active CHAR(1) DEFAULT 'A',
						browser VARCHAR(500),
						cookie VARCHAR(500),
						headers VARCHAR(500),
						params VARCHAR(500),
						ip VARCHAR(500),
						rule_order smallint,
						valid_from INT UNSIGNED,
						cache_ttl INT UNSIGNED,
						labels VARCHAR(255) NOT NULL DEFAULT '',
						PRIMARY KEY (rule_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}


	private static function init_custom_html_rules_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_CUSTOM_HTML_RULES_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						rule_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						name VARCHAR(100),
						match_type CHAR(1) DEFAULT 'S',
						match_url VARCHAR(500),
						match_browser VARCHAR(500),
						match_cookie VARCHAR(500),
						match_headers VARCHAR(500),
						match_params VARCHAR(500),
						match_ip VARCHAR(500),
						is_logged CHAR(1) DEFAULT 'A',
						match_capabilities VARCHAR(2000),
						match_roles VARCHAR(1000),
						match_posttypes VARCHAR(1000),
						rule_order smallint,
						labels VARCHAR(255) NOT NULL DEFAULT '',
						is_active CHAR(1) DEFAULT 'Y',
						add_http_headers MEDIUMTEXT,
						add_start_headers MEDIUMTEXT,
						add_end_headers MEDIUMTEXT,
						add_start_body MEDIUMTEXT,
						add_end_body MEDIUMTEXT,
						PRIMARY KEY (rule_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_labels_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_LABELS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						label_id int UNSIGNED NOT NULL AUTO_INCREMENT,
						name VARCHAR(64),
						bgcolor VARCHAR(120),
						modules VARCHAR(1000),
						PRIMARY KEY (label_id)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function update_step( string $version, callable $executable ) {
		if ( version_compare( get_option( URLSLAB_VERSION_SETTING, '1.0.0' ), $version, '<' ) ) {
			call_user_func( $executable );
			update_option( URLSLAB_VERSION_SETTING, $version );
		}
	}

	private static function add_roles() {
		$admin_capabilities = array(
			Urlslab_Api_Base::CAPABILITY_READ           => true,
			Urlslab_Api_Base::CAPABILITY_WRITE          => true,
			Urlslab_Api_Base::CAPABILITY_DELETE         => true,
			Urlslab_Api_Base::CAPABILITY_ADMINISTRATION => true,
			Urlslab_Api_Base::CAPABILITY_TRANSLATE      => true,
			Urlslab_Api_Base::CAPABILITY_AUGMENT        => true,
		);
		add_role( Urlslab_Api_Base::URLSLAB_ROLE_ADMIN, __( 'Urlslab Administrator' ), $admin_capabilities );//phpcs:ignore

		$editor_capabilities = array(
			Urlslab_Api_Base::CAPABILITY_READ      => true,
			Urlslab_Api_Base::CAPABILITY_WRITE     => true,
			Urlslab_Api_Base::CAPABILITY_DELETE    => true,
			Urlslab_Api_Base::CAPABILITY_TRANSLATE => true,
			Urlslab_Api_Base::CAPABILITY_AUGMENT   => true,
		);
		add_role( Urlslab_Api_Base::URLSLAB_ROLE_EDITOR, __( 'Urlslab Editor' ), $editor_capabilities );//phpcs:ignore
	}
}
