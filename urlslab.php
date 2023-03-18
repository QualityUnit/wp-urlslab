<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.urlslab.com
 * @package           Urlslab
 *
 * @wordpress-plugin
 *
 * Plugin Name:       URLsLab
 * Plugin URI:        https://github.com/QualityUnit/wp-urlslab
 * Description:       URLsLab WordPress Plugin to optimize your website for search engines and enhance automatically content
 * Version:           2.2.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            URLsLab
 * Author URI:        https://www.urlslab.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


const URLSLAB_VERSION = '2.2.0';
const URLSLAB_VERSION_SETTING = 'urlslab_ver';

/**
 * Fetching the plugin name based on the plugin absolute path.
 */
const URLSLAB_PLUGIN = __FILE__;

/**
 * URLSLAB Plugin Base DIR path
 */

define( 'URLSLAB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'URLSLAB_PLUGIN_BASENAME', plugin_basename( URLSLAB_PLUGIN ) );


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
define( 'URLSLAB_CSS_CACHE_TABLE', $wpdb->prefix . 'urlslab_css_cache' );
define( 'URLSLAB_CONTENT_CACHE_TABLE', $wpdb->prefix . 'urlslab_content_cache' );
define( 'URLSLAB_SEARCH_AND_REPLACE_TABLE', $wpdb->prefix . 'urlslab_search_replace' );
define( 'URLSLAB_SCREENSHOT_URLS_TABLE', $wpdb->prefix . 'urlslab_screenshot_urls' );
define( 'URLSLAB_PLUGIN_LOG', plugin_dir_path( __FILE__ ) . 'debug.log' );

define( 'URLSLAB_INFO_URL', 'https://github.com/QualityUnit/wp-urlslab/blob/main/info.json' );


add_filter( 'cron_schedules', 'urlslab_add_cron_interval' );
function urlslab_add_cron_interval( $schedules ): array {
	$my_schedule['every_minute'] = array(
		'interval' => 60,
		'display'  => esc_html__( 'Every Minute' ),
	);
	return array_merge( $my_schedule, $schedules );
}


/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_urlslab() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-urlslab-activator.php';
	Urlslab_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_urlslab() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-urlslab-deactivator.php';
	Urlslab_Deactivator::deactivate();
}

function urlslab_plugin_action_links( array $links ) {
	return array_merge(
		array(
			'<a href="' . admin_url( '/admin.php?page=urlslab-dashboard' ) . '" title="' . __( 'URLsLab Settings', 'urlslab' ) . '">' . __( 'Settings', 'urlslab' ) . '</a>',
		), $links
	);
}

add_filter( 'plugin_action_links_' . URLSLAB_PLUGIN_BASENAME, 'urlslab_plugin_action_links' );

add_filter( 'plugins_api', 'urlslab_plugin_info', 20, 3 );

function urlslab_plugin_info( $res, $action, $args ) {
	if ( 'plugin_information' !== $action || URLSLAB_PLUGIN_BASENAME !== $args->slug ) {
		return $res;
	}

	$remote = wp_remote_get(
		URLSLAB_INFO_URL,
		array(
			'timeout' => 5,
			'headers' => array(
				'Accept' => 'application/json',
			),
		)
	);

	if ( is_wp_error( $remote ) || 200 !== wp_remote_retrieve_response_code( $remote ) || empty( wp_remote_retrieve_body( $remote ) ) ) {
		return $res;
	}

	$remote = json_decode( wp_remote_retrieve_body( $remote ) );

	$res                 = new stdClass();
	$res->name           = $remote->name;
	$res->slug           = $remote->slug;
	$res->author         = $remote->author;
	$res->author_profile = $remote->author_profile;
	$res->version        = $remote->version;
	$res->tested         = $remote->tested;
	$res->requires       = $remote->requires;
	$res->requires_php   = $remote->requires_php;
	$res->download_link  = $remote->download_url;
	$res->trunk          = $remote->download_url;
	$res->last_updated   = $remote->last_updated;
	$res->sections       = array(
		'description'  => $remote->sections->description,
		'installation' => $remote->sections->installation,
		'changelog'    => $remote->sections->changelog,
	);
	if ( ! empty( $remote->sections->screenshots ) ) {
		$res->sections['screenshots'] = $remote->sections->screenshots;
	}

	$res->banners = array(
		'low'  => $remote->banners->low,
		'high' => $remote->banners->high,
	);

	return $res;
}

add_filter( 'site_transient_update_plugins', 'urlslab_push_update' );
function urlslab_push_update( $transient ) {
	if ( empty( $transient->checked ) ) {
		return $transient;
	}

	$remote = wp_remote_get(
		URLSLAB_INFO_URL,
		array(
			'timeout' => 5,
			'headers' => array(
				'Accept' => 'application/json',
			),
		)
	);

	if ( is_wp_error( $remote ) || 200 !== wp_remote_retrieve_response_code( $remote ) || empty( wp_remote_retrieve_body( $remote ) ) ) {
		return $transient;
	}

	$remote = json_decode( wp_remote_retrieve_body( $remote ) );

	// your installed plugin version should be on the line below! You can obtain it dynamically of course
	if (
		$remote
		&& version_compare( URLSLAB_VERSION, $remote->version, '<' )
		&& version_compare( $remote->requires, get_bloginfo( 'version' ), '<' )
		&& version_compare( $remote->requires_php, PHP_VERSION, '<' )
	) {

		$res                                 = new stdClass();
		$res->slug                           = $remote->slug;
		$res->plugin                         = URLSLAB_PLUGIN_BASENAME;
		$res->new_version                    = $remote->version;
		$res->tested                         = $remote->tested;
		$res->package                        = $remote->download_url;
		$transient->response[ $res->plugin ] = $res;

		if ( property_exists( $remote, 'version' ) ) {
			$transient->checked[ $res->plugin ] = $remote->version;
		}
	}

	return $transient;
}

register_activation_hook( __FILE__, 'activate_urlslab' );
register_deactivation_hook( __FILE__, 'deactivate_urlslab' );
require plugin_dir_path( __FILE__ ) . 'includes/class-urlslab.php';

function run_urlslab() {
	$plugin = new Urlslab();
	$plugin->run();

}

run_urlslab();
