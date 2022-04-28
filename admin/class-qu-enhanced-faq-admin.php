<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.liveagent.com
 * @since      1.0.0
 *
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/admin
 * @author     Quality Unit <jremen@qualityunit.com>
 */
class QU_Enhanced_FAQ_Admin {

	/**
	 * The ID of this plugin.
	 * Used on slug of plugin menu.
	 * Used on Root Div ID for React too.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The rest version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $rest_version    The rest version of this plugin..
	 */
	private $rest_version = 'v1';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}
	/**
	 * Register the CSS/JavaScript Resources for the admin area.
	 *
	 * Use Condition to Load it Only When it is Necessary
	 *
	 * @since    1.0.0
	 */
	public function enqueue_resources() {
		// Add/remove dependency blocks you need or don't 
		$dependency = array( 'wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-data' );

		wp_enqueue_script( $this->plugin_name . '-item', QU_ENHANCED_FAQ_URL . 'build/qu_enhanced_faq_edit_item.js', $dependency, $this->version, true );
		wp_enqueue_script( $this->plugin_name, QU_ENHANCED_FAQ_URL . 'build/qu_enhanced_faq_edit.js', $dependency, $this->version, true );
		wp_enqueue_style( $this->plugin_name, QU_ENHANCED_FAQ_URL . 'build/qu_enhanced_faq_edit.css', array(), $this->version, false );

		$localize = array(
			'version' => $this->version,
			'root_id' => $this->plugin_name,
		);
		wp_set_script_translations( $this->plugin_name, $this->plugin_name );
		wp_localize_script( $this->plugin_name, 'quPluginBoilerplateBuild', $localize );
	}
}
