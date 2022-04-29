<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    urlslab_screenshot
 * @subpackage urlslab_screenshot/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    urlslab_screenshot
 * @subpackage urlslab_screenshot/admin
 */
class Urlslab_screenshot_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $urlslab_screenshot    The ID of this plugin.
	 */
	private $urlslab_screenshot;

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
	 * @param      string    $urlslab_screenshot       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $urlslab_screenshot, $version ) {

		$this->urlslab_screenshot = $urlslab_screenshot;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in urlslab_screenshot_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The urlslab_screenshot_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->urlslab_screenshot, plugin_dir_url( __FILE__ ) . 'css/urlslab-screenshot-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in urlslab_screenshot_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The urlslab_screenshot_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->urlslab_screenshot, plugin_dir_url( __FILE__ ) . 'js/urlslab-screenshot-admin.js', array( 'jquery' ), $this->version, false );

	}

}
