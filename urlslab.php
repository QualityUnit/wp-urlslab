<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           Plugin_Name
 *
 * @wordpress-plugin
 *
 * Plugin Name:       Urlslab
 * Plugin URI:        https://urlslab.com
 * Description:       URLSLAB Services
 * Version:           0.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            URLSLAB
 * Author URI:        https://urlslab.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
const URLSLAB_VERSION = '1.0.0';

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
define( 'URLSLAB_KEYWORDS_TABLE', $wpdb->prefix . 'urlslab_keywords' );
define( 'URLSLAB_RELATED_RESOURCE_TABLE', $wpdb->prefix . 'urlslab_related_urls' );


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

register_activation_hook( __FILE__, 'activate_urlslab' );
register_deactivation_hook( __FILE__, 'deactivate_urlslab' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-urlslab.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_urlslab() {
	$plugin = new Urlslab();
	$plugin->run();

}

run_urlslab();
