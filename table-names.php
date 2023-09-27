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
define( 'URLSLAB_JS_CACHE_TABLE', $wpdb->prefix . 'urlslab_js_cache' );
define( 'URLSLAB_CONTENT_CACHE_TABLE', $wpdb->prefix . 'urlslab_content_cache' );
define( 'URLSLAB_SEARCH_AND_REPLACE_TABLE', $wpdb->prefix . 'urlslab_search_replace' );
define( 'URLSLAB_SCREENSHOT_URLS_TABLE', $wpdb->prefix . 'urlslab_screenshot_urls' );

// GENERATOR TABLES
define( 'URLSLAB_GENERATOR_SHORTCODES_TABLE', $wpdb->prefix . 'urlslab_generator_shortcodes' );
define( 'URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE', $wpdb->prefix . 'urlslab_generator_results' );
define( 'URLSLAB_GENERATOR_TASKS_TABLE', $wpdb->prefix . 'urlslab_generator_tasks' );
define( 'URLSLAB_GENERATOR_URLS_TABLE', $wpdb->prefix . 'urlslab_generator_urls' );
define( 'URLSLAB_PROMPT_TEMPLATE_TABLE', $wpdb->prefix . 'urlslab_prompt_templates' );

define( 'URLSLAB_NOT_FOUND_LOG_TABLE', $wpdb->prefix . 'urlslab_log_notfound' );
define( 'URLSLAB_REDIRECTS_TABLE', $wpdb->prefix . 'urlslab_redirects' );
define( 'URLSLAB_CACHE_RULES_TABLE', $wpdb->prefix . 'urlslab_cache_rules' );
define( 'URLSLAB_CUSTOM_HTML_RULES_TABLE', $wpdb->prefix . 'urlslab_custom_html_rules' );
define( 'URLSLAB_LABELS_TABLE', $wpdb->prefix . 'urlslab_labels' );
define( 'URLSLAB_FAQS_TABLE', $wpdb->prefix . 'urlslab_faqs' );
define( 'URLSLAB_FAQ_URLS_TABLE', $wpdb->prefix . 'urlslab_faq_urls' );

//SERP
define( 'URLSLAB_SERP_QUERIES_TABLE', $wpdb->prefix . 'urlslab_serp_queries' );
define( 'URLSLAB_SERP_URLS_TABLE', $wpdb->prefix . 'urlslab_serp_urls' );
define( 'URLSLAB_SERP_DOMAINS_TABLE', $wpdb->prefix . 'urlslab_serp_domains' );
define( 'URLSLAB_SERP_POSITIONS_TABLE', $wpdb->prefix . 'urlslab_serp_positions' );
define( 'URLSLAB_SERP_POSITIONS_HISTORY_TABLE', $wpdb->prefix . 'urlslab_serp_pos_history' );
define( 'URLSLAB_GSC_POSITIONS_TABLE', $wpdb->prefix . 'urlslab_gsc_positions' );
define( 'URLSLAB_GSC_SITES_TABLE', $wpdb->prefix . 'urlslab_gsc_sites' );

//OLD TABLES - not used anymore
define( 'URLSLAB_CONTENT_GENERATORS_TABLE', $wpdb->prefix . 'urlslab_content_generators' );
define( 'URLSLAB_CONTENT_GENERATOR_URLS_TABLE', $wpdb->prefix . 'urlslab_content_generator_urls' );
define( 'URLSLAB_SERP_QGROUPS_TABLE', $wpdb->prefix . 'urlslab_serp_qgroups' );
define( 'URLSLAB_SERP_QGROUP_QUERIES_TABLE', $wpdb->prefix . 'urlslab_serp_qgroup_queries' );
