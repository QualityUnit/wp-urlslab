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
		add_option( Urlslab_Cron_Offload_Background_Attachments::SETTING_NAME_SCHEDULER_POINTER, - 1, '', false );
		self::add_widget_options();
	}

	public static function deactivate() {
		$timestamp = wp_next_scheduled( 'urlslab_cron_hook' );
		wp_unschedule_event( $timestamp, 'urlslab_cron_hook' );

		delete_option( Urlslab_Cron_Offload_Background_Attachments::SETTING_NAME_SCHEDULER_POINTER );

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
			'2.28.0',
			function() {
				self::init_faqs_table();
				self::init_faq_urls_table();
			}
		);
		self::update_step(
			'2.28.2',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_FAQS_TABLE . ' ADD INDEX idx_questions (question(255))' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.29.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " ADD COLUMN shortcode_name VARCHAR(100) NOT NULL DEFAULT ''" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_GENERATOR_SHORTCODES_TABLE . " SET shortcode_name = SUBSTRING(prompt, 0, 100)" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.30.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN url_lang VARCHAR(15)' ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.31.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD COLUMN url_priority TINYINT UNSIGNED NOT NULL DEFAULT 30' ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . " SET url_priority = 1+10*(LENGTH(TRIM('/' FROM url_name)) - LENGTH(REPLACE(TRIM('/' FROM url_name), '/', '')))" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.32.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_RELATED_RESOURCE_TABLE . " ADD COLUMN is_locked char(1) NOT NULL DEFAULT 'N'" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.33.0',
			function() {
				global $wpdb;
				$wpdb->query( 'UPDATE ' . URLSLAB_RELATED_RESOURCE_TABLE . " SET pos = 100 WHERE pos > 100" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . " SET url_priority = 100 WHERE url_priority > 100" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_FAQ_URLS_TABLE . " SET sorting = 100 WHERE sorting > 100" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_KEYWORDS_TABLE . " SET kw_priority = 100 WHERE kw_priority > 100" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.37.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_DOMAINS_TABLE ); // phpcs:ignore
				self::init_serp_domains_table();
			}
		);
		self::update_step(
			'2.40.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ); // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUPS_TABLE ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.41.0',
			function() {
				self::init_gsc_sites_table();
			}
		);
		self::update_step(
			'2.43.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' DROP COLUMN faq_status, DROP COLUMN update_faq_date' ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.44.0',
			function() {
				self::init_prompt_template_table();
			}
		);
		self::update_step(
			'2.45.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_DOMAINS_TABLE . ' ADD INDEX idx_domain_type (domain_type)' ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.47.0',
			function() {
				self::init_generator_tasks_table();
			}
		);
		self::update_step(
			'2.49.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_REDIRECTS_TABLE . " ADD COLUMN created DATETIME" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_REDIRECTS_TABLE . " SET created=NOW()" ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.50.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_KEYWORDS_TABLE . " ADD COLUMN query_id BIGINT" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_KEYWORDS_TABLE . " SET query_id=CRC32(keyword)" ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_KEYWORDS_TABLE . " ADD INDEX idx_query (query_id)" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.59.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QUERIES_TABLE );             // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_URLS_TABLE );         // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_POSITIONS_TABLE );        // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_POSITIONS_HISTORY_TABLE );     // phpcs:ignore
				$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GSC_POSITIONS_TABLE ); // phpcs:ignore
			}
		);
		self::update_step(
			'2.60.0',
			function() {
				self::init_serp_queries_table();
				self::init_serp_urls_table();
				self::init_gsc_positions_table();
				self::init_serp_positions_table();
				self::init_serp_positions_history_table();
			}
		);

		self::update_step(
			'2.61.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_TASKS_TABLE . " RENAME COLUMN error_log TO result_log" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.62.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . " ADD COLUMN internal_links INT UNSIGNED NOT NULL DEFAULT 0" ); // phpcs:ignore
				$wpdb->query( 'UPDATE ' . URLSLAB_SERP_QUERIES_TABLE . " SET recomputed=NULL" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.63.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_GENERATOR_TASKS_TABLE . ' CHANGE COLUMN `error_log` `result_log` TEXT NULL DEFAULT NULL' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.65.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_PROMPT_TEMPLATE_TABLE . " ALTER COLUMN prompt_type SET DEFAULT 'B'" ); // phpcs:ignore
				$wpdb->query( 'DELETE FROM' . URLSLAB_PROMPT_TEMPLATE_TABLE . " WHERE prompt_type IN ('G', 'S')" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.67.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' ADD COLUMN parent_query_id bigint, ADD INDEX idx_parent (parent_query_id)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.68.0',
			function() {
				self::init_tasks_table();
			}
		);

		self::update_step(
			'2.69.0',
			function() {
				self::init_kw_intersections_table();
				self::init_kw_url_intersections_table();
			}
		);

		self::update_step(
			'2.70.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . " ADD COLUMN schedule DATETIME, ADD COLUMN schedule_interval CHAR(1) NOT NULL DEFAULT '', ADD INDEX idx_schedule (schedule)" ) ); // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_SERP_QUERIES_TABLE . ' SET schedule = DATE_ADD(updated, INTERVAL 60 DAY) WHERE schedule=NULL' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.71.0',
			function() {
				self::init_web_vitals_table();
			}
		);

		self::update_step(
			'2.72.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_GENERATOR_TASKS_TABLE . ' ADD INDEX idx_shortcode (shortcode_hash_id)' ) ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.73.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_GENERATOR_TASKS_TABLE . ' ADD INDEX idx_status_updated (task_status, updated_at)' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.74.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_FAQ_URLS_TABLE . ' ADD INDEX idx_url_id (url_id)' ) ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.75.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD INDEX idx_scr_cron (http_status, scr_status, update_scr_date)' ) ); // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_URLS_TABLE . ' ADD INDEX idx_sum_cron (http_status, sum_status, update_sum_date)' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.76.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_WEB_VITALS_TABLE . ' DROP COLUMN visitor' ) ); // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_WEB_VITALS_TABLE . ' ADD COLUMN element VARCHAR(250), ADD COLUMN ip VARCHAR(100), ADD COLUMN url_name VARCHAR(2000), ADD COLUMN browser VARCHAR(500), ADD COLUMN country VARCHAR(2)' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.77.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_FAQS_TABLE . ' ADD INDEX idx_status_updated (status, updated)' ) ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.78.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_CSS_CACHE_TABLE . ' DROP INDEX idx_changed , ADD INDEX idx_changed (status, status_changed)' ) ); // phpcs:ignore
			}
		);


		self::update_step(
			'2.79.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_JS_CACHE_TABLE . ' DROP INDEX idx_changed , ADD INDEX idx_changed (status, status_changed)' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.80.0',
			function() {
				global $wpdb;
				$wpdb->query(
					$wpdb->prepare(
						'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . // phpcs:ignore
						" ADD COLUMN country_volume INT UNSIGNED NOT NULL DEFAULT 0,
							ADD COLUMN country_kd TINYINT UNSIGNED NOT NULL DEFAULT 0,
							ADD COLUMN country_high_bid FLOAT UNSIGNED NOT NULL DEFAULT 0,
							ADD COLUMN country_low_bid FLOAT UNSIGNED NOT NULL DEFAULT 0,
							ADD COLUMN country_level char(1),
							ADD COLUMN country_monthly_volumes TEXT,
							ADD COLUMN country_vol_status char(1) DEFAULT 'N',
							ADD COLUMN country_scheduled DATETIME"
					)
				); // phpcs:ignore
			}
		);

		self::update_step(
			'2.82.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_SERP_URLS_TABLE . ' ADD COLUMN country_volume INT UNSIGNED NOT NULL DEFAULT 0, ADD COLUMN country_value INT UNSIGNED NOT NULL DEFAULT 0' ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.83.0',
			function() {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . " ADD COLUMN intent CHAR(1) NOT NULL DEFAULT 'U'" ) ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.85.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' DROP INDEX idx_recomputed' ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' ADD INDEX idx_recomputed (status, recomputed)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.86.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' ADD INDEX idx_country_scheduled (status, country_vol_status, country_scheduled)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.87.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' CHANGE COLUMN `country_scheduled` `country_last_updated` DATETIME' ); // phpcs:ignore
				$wpdb->query(
					$wpdb->prepare(
						'UPDATE ' . URLSLAB_SERP_QUERIES_TABLE . ' SET country_last_updated = %s', // phpcs:ignore
						gmdate( 'Y-m-d H:i:s' )
					)
				);
			}
		);

		self::update_step(
			'2.88.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DELETE FROM ' . $wpdb->prefix . "options WHERE option_name LIKE '_transient_urlslab_%' OR option_name LIKE '_transient_timeout_urlslab_%'" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.89.0',
			function() {
				global $wpdb;
				$wpdb->query( 'DELETE FROM ' . URLSLAB_FILES_TABLE . " WHERE fileid=''" ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.90.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' DROP INDEX idx_type' ); // phpcs:ignore
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_SERP_QUERIES_TABLE . ' ADD INDEX idx_type (type, status, schedule_interval, schedule)' ); // phpcs:ignore
			}
		);

		self::update_step(
			'2.91.0',
			function() {
				global $wpdb;
				$wpdb->query( 'ALTER TABLE ' . URLSLAB_FILES_TABLE . ' ADD COLUMN usage_count MEDIUMINT UNSIGNED NOT NULL DEFAULT 0' ); // phpcs:ignore
				Urlslab_Data_File::update_usage_count();
			}
		);

		self::add_widget_options();
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
		self::init_generator_tasks_table();
		self::init_generator_urls_table();
		self::init_prompt_template_table();
		self::init_cache_rules_table();
		self::init_custom_html_rules_table();
		self::init_faqs_table();
		self::init_faq_urls_table();

		self::init_serp_queries_table();
		self::init_serp_urls_table();
		self::init_serp_domains_table();
		self::init_gsc_positions_table();
		self::init_serp_positions_table();
		self::init_serp_positions_history_table();
		self::init_gsc_sites_table();
		self::init_tasks_table();
		self::init_kw_intersections_table();
		self::init_kw_url_intersections_table();
		self::init_web_vitals_table();
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
			url_lang varchar(15),
			url_h1	  text,
			url_meta_description text,
			url_summary			text,
			url_priority TINYINT UNSIGNED NOT NULL DEFAULT 30,
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
			INDEX idx_rel_schedule (rel_schedule, rel_updated),
			INDEX idx_scr_cron (http_status, scr_status, update_scr_date),
			INDEX idx_sum_cron (http_status, sum_status, update_sum_date)
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
							query_id bigint,
							urlLink varchar(500) NOT NULL,
							kw_priority TINYINT UNSIGNED NOT NULL DEFAULT 10,
							kw_length TINYINT UNSIGNED NOT NULL,
							lang varchar(10) NOT NULL DEFAULT 'all',
							urlFilter varchar(250) NOT NULL DEFAULT '.*',
							kwType char(1) NOT NULL DEFAULT 'M', -- M: manual, I: imported
							labels VARCHAR(255) NOT NULL DEFAULT '',
							PRIMARY KEY  (kw_id),
							INDEX  idx_keywords (keyword),
							INDEX  idx_query (query_id),
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
							is_locked char(1) NOT NULL DEFAULT 'N', -- Y: locked, N: not locked
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
							usage_count MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
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
						INDEX idx_changed (status, status_changed)
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
						INDEX idx_changed (status, status_changed)
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
						shortcode_name VARCHAR(100) NOT NULL DEFAULT '',
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

		$table_name = URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE;
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

	private static function init_generator_tasks_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_GENERATOR_TASKS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						task_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						generator_type CHAR(1) NOT NULL DEFAULT 'S', -- S: Shortcode, P: Post Generation
    					task_status CHAR(1) NOT NULL DEFAULT 'N', -- N: New, P: Processing, S: Success, E: Error
    					shortcode_hash_id int UNSIGNED,
    					task_data TEXT,
    					urlslab_process_id TEXT,
    					result_log TEXT,
    					updated_at DATETIME,
						PRIMARY KEY (task_id),
						INDEX idx_shortcode (shortcode_hash_id),
						INDEX idx_status_updated (task_status, updated_at)
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


	private static function init_prompt_template_table() {
		global $wpdb;
		$table_name      = URLSLAB_PROMPT_TEMPLATE_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							template_id int UNSIGNED NOT NULL AUTO_INCREMENT,
							template_name varchar(100) NOT NULL,    
    						model_name varchar(100) NOT NULL,
    						prompt_template TEXT NOT NULL,
    						prompt_type char(1) NOT NULL DEFAULT 'B', -- A = Question Answering, B = Blog Creation
							updated DATETIME,
							PRIMARY KEY  (template_id)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );

		Urlslab_Default_Prompt_Template::populate_prompt_template_table();
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
						created DATETIME,
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


	private static function init_faqs_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_FAQS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						faq_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						question VARCHAR(500),
						answer LONGTEXT,
						language varchar(10),
						updated DATETIME,
						status char(1) DEFAULT 'N',
						labels VARCHAR(255) NOT NULL DEFAULT '',
						PRIMARY KEY (faq_id),
						INDEX idx_questions (question(255)),
						INDEX idx_status_updated (status, updated)
        ) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_faq_urls_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = URLSLAB_FAQ_URLS_TABLE;
		$sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
						faq_id INT UNSIGNED NOT NULL,
						url_id bigint NOT NULL,
						sorting TINYINT UNSIGNED NOT NULL DEFAULT 1,
						PRIMARY KEY (faq_id, url_id),
						INDEX idx_url_id (url_id)
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
		$existing_version = explode( '-', get_option( URLSLAB_VERSION_SETTING, '1.0.0' ) );
		if ( version_compare( $existing_version[0], $version, '<' ) ) {
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
		add_role( Urlslab_Api_Base::URLSLAB_ROLE_ADMIN, __( 'URLsLab Administrator' ), $admin_capabilities );//phpcs:ignore

		$editor_capabilities = array(
			Urlslab_Api_Base::CAPABILITY_READ      => true,
			Urlslab_Api_Base::CAPABILITY_WRITE     => true,
			Urlslab_Api_Base::CAPABILITY_DELETE    => true,
			Urlslab_Api_Base::CAPABILITY_TRANSLATE => true,
			Urlslab_Api_Base::CAPABILITY_AUGMENT   => true,
		);
		add_role( Urlslab_Api_Base::URLSLAB_ROLE_EDITOR, __( 'URLsLab Editor' ), $editor_capabilities );//phpcs:ignore
	}


	private static function init_serp_queries_table() {
		global $wpdb;
		$table_name      = URLSLAB_SERP_QUERIES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							query_id bigint NOT NULL,
							parent_query_id bigint,
							country CHAR(2) NOT NULL DEFAULT 'us',
							intent CHAR(1) NOT NULL DEFAULT 'U',
							query VARCHAR(255) NOT NULL,
							updated DATETIME NOT NULL,
							schedule DATETIME NOT NULL,
							schedule_interval  CHAR(1) NOT NULL DEFAULT '',
							status char(1) DEFAULT 'X',
							type char(1) DEFAULT 'S',
    						labels VARCHAR(255) NOT NULL DEFAULT '',
							recomputed DATETIME,
							my_position FLOAT UNSIGNED NOT NULL DEFAULT 0,
							my_urls TEXT,
							my_urls_ranked_top10 INT UNSIGNED NOT NULL DEFAULT 0,
							my_urls_ranked_top100 INT UNSIGNED NOT NULL DEFAULT 0,
							comp_intersections INT UNSIGNED NOT NULL DEFAULT 0,
							internal_links INT UNSIGNED NOT NULL DEFAULT 0,
							comp_urls TEXT,
							country_volume INT UNSIGNED NOT NULL DEFAULT 0,
							country_kd TINYINT UNSIGNED NOT NULL DEFAULT 0,
							country_high_bid FLOAT UNSIGNED NOT NULL DEFAULT 0,
							country_low_bid FLOAT UNSIGNED NOT NULL DEFAULT 0,
							country_level char(1),
							country_monthly_volumes TEXT,
							country_vol_status char(1) DEFAULT 'N',
							country_last_updated DATETIME,
							PRIMARY KEY  (query_id, country),
							INDEX idx_query (query),
							INDEX idx_type (type, status, schedule_interval, schedule),
							INDEX idx_update (updated),
							INDEX idx_schedule (schedule),
							INDEX idx_parent (parent_query_id),
							INDEX idx_country_scheduled (status, country_vol_status, country_scheduled)
							INDEX idx_recomputed (status, recomputed)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_serp_urls_table() {
		global $wpdb;
		$table_name      = URLSLAB_SERP_URLS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							url_id bigint NOT NULL,
							domain_id bigint NOT NULL,
							url_name varchar(2048) NOT NULL,
							url_title VARCHAR(255) NOT NULL,
							url_description VARCHAR(255) NOT NULL,
							comp_intersections INT UNSIGNED NOT NULL DEFAULT 0,
							best_position FLOAT UNSIGNED NOT NULL DEFAULT 0,
							top10_queries_cnt INT UNSIGNED NOT NULL DEFAULT 0,
							top100_queries_cnt INT UNSIGNED NOT NULL DEFAULT 0,
							my_urls_ranked_top10 INT UNSIGNED NOT NULL DEFAULT 0,
							my_urls_ranked_top100 INT UNSIGNED NOT NULL DEFAULT 0,
							country_volume INT UNSIGNED NOT NULL DEFAULT 0,
							country_value INT UNSIGNED NOT NULL DEFAULT 0,
							top_queries TEXT,
							recomputed DATETIME,
							PRIMARY KEY  (url_id),
							INDEX idx_domain (domain_id),
							INDEX idx_recomputed (recomputed)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}


	private static function init_serp_domains_table() {
		global $wpdb;
		$table_name      = URLSLAB_SERP_DOMAINS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							domain_id bigint NOT NULL,
							domain_name varchar(500) NOT NULL,
							domain_type char(1) NOT NULL DEFAULT 'X',
							PRIMARY KEY  (domain_id),
    						INDEX idx_domain_type (domain_type)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_gsc_positions_table() {
		global $wpdb;
		$table_name      = URLSLAB_GSC_POSITIONS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							query_id bigint NOT NULL,
							country CHAR(2) NOT NULL DEFAULT 'us',
							url_id bigint NOT NULL,
							domain_id bigint NOT NULL,
							updated DATETIME NOT NULL,
							position FLOAT UNSIGNED NOT NULL,
							clicks INT UNSIGNED NOT NULL,
							impressions INT UNSIGNED NOT NULL,
							ctr FLOAT UNSIGNED NOT NULL,
							PRIMARY KEY  (query_id, country, url_id),
							INDEX idx_urls (url_id),
							INDEX idx_domains (domain_id)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_serp_positions_table() {
		global $wpdb;
		$table_name      = URLSLAB_SERP_POSITIONS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							query_id bigint NOT NULL,
							country CHAR(2) NOT NULL DEFAULT 'us',
							url_id bigint NOT NULL,
							domain_id bigint NOT NULL,
							updated DATETIME NOT NULL,
							position TINYINT UNSIGNED NOT NULL DEFAULT 0,
							PRIMARY KEY  (query_id, country, url_id),
							INDEX idx_urls (url_id),
							INDEX idx_domains (domain_id)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_serp_positions_history_table() {
		global $wpdb;
		$table_name      = URLSLAB_SERP_POSITIONS_HISTORY_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
    						pos_hist_id bigint NOT NULL AUTO_INCREMENT, 
							query_id bigint NOT NULL,
							country CHAR(2) NOT NULL DEFAULT 'us',
							url_id bigint NOT NULL,
							created DATE NOT NULL,
							domain_id bigint NOT NULL,
							position TINYINT UNSIGNED NOT NULL DEFAULT 0,
							PRIMARY KEY  (pos_hist_id),
							UNIQUE KEY idx_unique (query_id, country, url_id, created)
							) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_gsc_sites_table() {
		global $wpdb;
		$table_name      = URLSLAB_GSC_SITES_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							site_id unsigned int NOT NULL AUTO_INCREMENT,    
							site_name varchar(250) NOT NULL,
							updated DATETIME,
							date_to DATE,
							importing char(1) DEFAULT 'N',
							row_offset INT UNSIGNED NOT NULL,
							PRIMARY KEY  (site_id),
							UNIQUE KEY idx_site_name (site_name)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_tasks_table() {
		global $wpdb;
		$table_name      = URLSLAB_TASKS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							task_id INT UNSIGNED NOT NULL AUTO_INCREMENT,    
							top_parent_id INT UNSIGNED,
							parent_id INT UNSIGNED,
							priority TINYINT UNSIGNED NOT NULL DEFAULT 255,
							slug VARCHAR(100),
							executor_type VARCHAR(32),
							status CHAR(1) NOT NULL DEFAULT 'N',
							lock_id INT UNSIGNED default 0,
							data LONGTEXT,
							result LONGTEXT,
							updated DATETIME,
							time_from INT UNSIGNED DEFAULT 0,
							PRIMARY KEY  (task_id),
							INDEX idx_top_parent_id (top_parent_id),
							INDEX idx_parent_id (parent_id)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_kw_intersections_table() {
		global $wpdb;
		$table_name      = URLSLAB_KW_INTERSECTIONS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							hash_id bigint NOT NULL,    
							query_id bigint NOT NULL,    
							query VARCHAR(255) NOT NULL,    
							rating double NOT NULL DEFAULT 0,
							created DATETIME NOT NULL,
							PRIMARY KEY  (hash_id, query_id),
							INDEX idx_rating (created)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_kw_url_intersections_table() {
		global $wpdb;
		$table_name      = URLSLAB_KW_URL_INTERSECTIONS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							hash_id bigint NOT NULL,    
							query_id bigint NOT NULL,    
							url_id bigint NOT NULL,    
							words smallint UNSIGNED NOT NULL DEFAULT 0,    
							created DATETIME NOT NULL,
							PRIMARY KEY  (hash_id, query_id, url_id),
							INDEX idx_rating (created)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function init_web_vitals_table() {
		global $wpdb;
		$table_name      = URLSLAB_WEB_VITALS_TABLE;
		$charset_collate = $wpdb->get_charset_collate();
		$sql             = "CREATE TABLE IF NOT EXISTS {$table_name} (
							wv_id int UNSIGNED NOT NULL AUTO_INCREMENT,
							event_id varchar(50) NOT NULL,
							metric_type char(1) NOT NULL,
							nav_type char(1) NOT NULL,
							rating char(1) NOT NULL,
							url_id bigint NOT NULL,
							value double NOT NULL,
							created DATETIME NOT NULL,
							attribution LONGTEXT,
							entries LONGTEXT,
							element VARCHAR(250),
							ip VARCHAR(100),
							url_name VARCHAR(2000),
							browser VARCHAR(500),
							country VARCHAR(2),
							PRIMARY KEY  (wv_id),
							INDEX idx_created (created)
							) {$charset_collate};";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	private static function add_widget_options() {
		foreach ( Urlslab_User_Widget::get_instance()->get_activated_widgets() as $widget ) {
			$widget->add_options_on_activate();
		}
	}

}
