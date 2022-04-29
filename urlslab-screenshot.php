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
 * Plugin Name:       Urlslab Screenshot
 * Plugin URI:        https://urlslab.com
 * Description:       Serving screenshots of URL
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
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_urlslab_screenshot() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-urlslab-screenshot-activator.php';
	Urlslab_Screenshot_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_urlslab_screenshot() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-urlslab-screenshot-deactivator.php';
	Urlslab_Screenshot_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_urlslab_screenshot' );
register_deactivation_hook( __FILE__, 'deactivate_urlslab_screenshot' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-urlslab-screenshot.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_urlslab_screenshot() { 
	$plugin = new Urlslab_Screenshot();
	$plugin->run();

}

run_urlslab_screenshot();
