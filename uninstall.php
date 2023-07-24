<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit( 'Not allowed' );
}

global $wpdb;
include_once 'table-names.php';
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_TABLE );             // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_URLS_MAP_TABLE );         // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_ERROR_LOG_TABLE );        // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_TABLE );     // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_KEYWORDS_MAP_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_RELATED_RESOURCE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FILE_POINTERS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_YOUTUBE_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CSS_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_JS_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SEARCH_AND_REPLACE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SCREENSHOT_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_NOT_FOUND_LOG_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_REDIRECTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_FAQS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_LABELS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CUSTOM_HTML_RULES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CACHE_RULES_TABLE ); // phpcs:ignore

//content generators
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_SHORTCODES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_RESULTS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_GENERATOR_URLS_TABLE ); // phpcs:ignore

//SERP
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_POSITIONS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QUERIES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUP_QUERIES_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SERP_QGROUPS_TABLE ); // phpcs:ignore

//old tables
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATORS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATOR_URLS_TABLE ); // phpcs:ignore


$options = wp_load_alloptions();
foreach ( $options as $name => $value ) {
	if ( strpos( $name, 'urlslab' ) === 0 || strpos( $name, 'widget_urlslab' ) === 0 ) {
		delete_option( $name );
	}
}

return;
