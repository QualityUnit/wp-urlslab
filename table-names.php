<?php

global $wpdb;
define( 'URLSLAB_URLS_TABLE', $wpdb->prefix . 'urlslab_urls' );
define( 'URLSLAB_URLS_MAP_TABLE', $wpdb->prefix . 'urlslab_urls_map' );
define( 'URLSLAB_ERROR_LOG_TABLE', $wpdb->prefix . 'urlslab_error_log' );
define( 'URLSLAB_KEYWORDS_TABLE', $wpdb->prefix . 'urlslab_keywords' );
define( 'URLSLAB_KEYWORDS_MAP_TABLE', $wpdb->prefix . 'urlslab_keywords_map' );
define( 'URLSLAB_RELATED_RESOURCE_TABLE', $wpdb->prefix . 'urlslab_related_urls' );
define( 'URLSLAB_FILES_TABLE', $wpdb->prefix . 'urlslab_files' );
define( 'URLSLAB_FILE_URLS_TABLE', $wpdb->prefix . 'urlslab_file_urls' );
define( 'URLSLAB_FILE_DB_DRIVER_CONTENTS_TABLE', $wpdb->prefix . 'urlslab_file_db_driver_contents' );
define( 'URLSLAB_FILE_POINTERS_TABLE', $wpdb->prefix . 'urlslab_file_pointers' );
define( 'URLSLAB_YOUTUBE_CACHE_TABLE', $wpdb->prefix . 'urlslab_youtube_cache' );
define( 'URLSLAB_YOUTUBE_URLS_TABLE', $wpdb->prefix . 'urlslab_youtube_urls' );
define( 'URLSLAB_CSS_CACHE_TABLE', $wpdb->prefix . 'urlslab_css_cache' );
define( 'URLSLAB_CONTENT_CACHE_TABLE', $wpdb->prefix . 'urlslab_content_cache' );
define( 'URLSLAB_SEARCH_AND_REPLACE_TABLE', $wpdb->prefix . 'urlslab_search_replace' );
define( 'URLSLAB_SCREENSHOT_URLS_TABLE', $wpdb->prefix . 'urlslab_screenshot_urls' );

define( 'URLSLAB_GENERATOR_SHORTCODES_TABLE', $wpdb->prefix . 'urlslab_generator_shortcodes' );
define( 'URLSLAB_GENERATOR_RESULTS_TABLE', $wpdb->prefix . 'urlslab_generator_results' );
define( 'URLSLAB_GENERATOR_URLS_TABLE', $wpdb->prefix . 'urlslab_generator_urls' );

//OLD TABLES - not used anymore
define( 'URLSLAB_CONTENT_GENERATORS_TABLE', $wpdb->prefix . 'urlslab_content_generators' );
define( 'URLSLAB_CONTENT_GENERATOR_URLS_TABLE', $wpdb->prefix . 'urlslab_content_generator_urls' );

define( 'URLSLAB_NOT_FOUND_LOG_TABLE', $wpdb->prefix . 'urlslab_log_notfound' );
define( 'URLSLAB_REDIRECTS_TABLE', $wpdb->prefix . 'urlslab_redirects' );
define( 'URLSLAB_CACHE_RULES_TABLE', $wpdb->prefix . 'urlslab_cache_rules' );
define( 'URLSLAB_CUSTOM_HTML_RULES_TABLE', $wpdb->prefix . 'urlslab_custom_html_rules' );
define( 'URLSLAB_LABELS_TABLE', $wpdb->prefix . 'urlslab_labels' );
