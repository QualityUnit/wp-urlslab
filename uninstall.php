<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit( 'Not allowed' );
}

global $wpdb;

$options = wp_load_alloptions();
foreach ( $options as $name => $value ) {
	if ( strpos( $name, 'urlslab_' ) === 0 ) {
		delete_option( $name );
	}
}

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
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_CACHE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SEARCH_AND_REPLACE_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_SCREENSHOT_URLS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_CONTENT_GENERATORS_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_NOT_FOUND_LOG_TABLE ); // phpcs:ignore
$wpdb->query( 'DROP TABLE IF EXISTS ' . URLSLAB_REDIRECTS_TABLE ); // phpcs:ignore

return;
