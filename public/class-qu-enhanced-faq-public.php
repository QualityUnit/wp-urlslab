<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.liveagent.com
 * @since      1.0.0
 *
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    QU_Enhanced_FAQ
 * @subpackage QU_Enhanced_FAQ/public
 * @author     Quality Unit <jremen@qualityunit.com>
 */
class QU_Enhanced_FAQ_Public {

	/**
	 * The ID of this plugin.
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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of the plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, QU_ENHANCED_FAQ_URL . 'build/qu_enhanced_faq_frontend.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, QU_ENHANCED_FAQ_URL . 'build/qu_enhanced_faq_frontend.js', array(), $this->version, false ); // @codingStandardsIgnoreLine

	}

	public function render_blocks() {

		/** This function imports dynamic blocks definitions */
		require_once plugin_dir_path( __FILE__ ) . 'partials/class-qu-enhanced-faq-renderer.php';
	}

}
