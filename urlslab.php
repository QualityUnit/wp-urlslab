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
 * Version: 2.130.9
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

define( 'URLSLAB_VERSION', '2.130.9' );
define( 'URLSLAB_VERSION_SETTING', 'urlslab_ver' );
define( 'URLSLAB_PLUGIN', __FILE__ );

define( 'URLSLAB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'URLSLAB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'URLSLAB_PLUGIN_BASENAME', plugin_basename( URLSLAB_PLUGIN ) );
define( 'URLSLAB_PLUGIN_SLUG', 'urlslab' );
define( 'URLSLAB_PLUGIN_LOG', plugin_dir_path( __FILE__ ) . 'debug.log' );

function urlslab_autoloader( $class_name ) {
	$class = strtolower( $class_name );
	if ( 0 !== strpos( $class, 'urlslab' ) ) {
		return;
	}

	$include_dir = __DIR__ . '/includes/';
	$filename    = 'class-' . str_replace( '_', '-', $class ) . '.php';
	$dir         = '';

	$class_dirs = explode( '_', trim( substr( $class, 7 ), '_' ) );

	while ( true ) {
		if ( file_exists( $include_dir . $dir . $filename ) ) {
			require_once $include_dir . $dir . $filename;

			return;
		}
		if ( count( $class_dirs ) > 0 ) {
			$dir .= array_shift( $class_dirs ) . '/';
		} else {
			return;
		}
	}
}

spl_autoload_register( 'urlslab_autoloader' );


function activate_urlslab() {
	Urlslab_Activator::activate();
}

register_activation_hook( __FILE__, 'activate_urlslab' );

function deactivate_urlslab() {
	Urlslab_Activator::deactivate();
}

register_deactivation_hook( __FILE__, 'deactivate_urlslab' );

$urlslab_plugin = new Urlslab();
$urlslab_plugin->run();
