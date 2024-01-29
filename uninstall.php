<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit( 'Not allowed' );
}

global $wpdb;
include_once 'table-names.php';
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_TABLE );             // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_MAP_TABLE );         // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_TABLE );     // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_MAP_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_RELATED_RESOURCE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_POINTERS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_YOUTUBE_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_YOUTUBE_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CSS_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_JS_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SEARCH_AND_REPLACE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SCREENSHOT_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_NOT_FOUND_LOG_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_REDIRECTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FAQS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FAQ_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_LABELS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CUSTOM_HTML_RULES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CACHE_RULES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_TASKS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KW_INTERSECTIONS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_WEB_VITALS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_BACKLINK_MONITORS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CSP_TABLE ); // phpcs:ignore

//content generators
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_SHORTCODES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_TASKS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_PROMPT_TEMPLATE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_URLS_TABLE ); // phpcs:ignore

//SERP & GSC
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_DOMAINS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QUERIES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_POSITIONS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_POSITIONS_HISTORY_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GSC_SITES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GSC_POSITIONS_TABLE ); // phpcs:ignore

//old tables
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATORS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATOR_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUPS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_ERROR_LOG_TABLE );        // phpcs:ignore


$options = wp_load_alloptions();
foreach ( $options as $name => $value ) {
	if ( strpos( $name, 'urlslab' ) === 0 || strpos( $name, 'widget_urlslab' ) === 0 ) {
		delete_option( $name );
	}
}

if ( file_exists( dirname( ABSPATH ) . '/wp-config.php' ) ) {
	$file_name = dirname( ABSPATH ) . '/.htaccess';
} else {
	$file_name = ABSPATH . '.htaccess';
}

insert_with_markers( $file_name, 'URLSLAB', array() );
