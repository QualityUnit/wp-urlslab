<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://www.liveagent.com
 * @since      1.0.0
 *
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/includes
 * @author     Quality Unit <jremen@qualityunit.com>
 */
class QU_Enhanced_FAQ_I18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'class-qu-enhanced-faq',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}
}
