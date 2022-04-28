<?php

/**
 * The plugin bootstrap file
 *
 * @link              https://www.liveagent.com
 * @since             1.0.0
 * @package           QU_Enhanced_FAQ
 *
 * @wordpress-plugin
 * Plugin Name:       Quality Unit Enhanced FAQ
 * Plugin URI:        https://www.liveagent.com/class-qu-enhanced-faq
 * Description:       Enhanced FAQ Plugin for adding FAQ question/answer with Schema microdata
 * Version:           1.0.0
 * Author:            Quality Unit
 * Author URI:        https://www.liveagent.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       class-qu-enhanced-faq
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Current plugin path.
 * Current plugin url.
 * Current plugin version.
 *
 * Rename these constants for your plugin
 * Update version as you release new versions.
 */

define( 'QU_ENHANCED_FAQ_PATH', plugin_dir_path( __FILE__ ) );
define( 'QU_ENHANCED_FAQ_URL', plugin_dir_url( __FILE__ ) );
define( 'QU_ENHANCED_FAQ_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-qu-enhanced-faq-activator.php
 */
function activate_qu_enhanced_faq() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-qu-enhanced-faq-activator.php';
	QU_Enhanced_FAQ_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-qu-enhanced-faq-deactivator.php
 */
function deactivate_qu_enhanced_faq() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-qu-enhanced-faq-deactivator.php';
	QU_Enhanced_FAQ_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_qu_enhanced_faq' );
register_deactivation_hook( __FILE__, 'deactivate_qu_enhanced_faq' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-qu-enhanced-faq.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_qu_enhanced_faq() {

	$plugin = new QU_Enhanced_FAQ();
	$plugin->run();

}
run_qu_enhanced_faq();
