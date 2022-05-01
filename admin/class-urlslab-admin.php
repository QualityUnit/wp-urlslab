<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    urlslab
 * @subpackage urlslab/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    urlslab
 * @subpackage urlslab/admin
 */
class Urlslab_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $urlslab    The ID of this plugin.
	 */
	private $urlslab;

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
	 * @param      string    $urlslab       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $urlslab, $version ) {

		$this->urlslab = $urlslab;
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
		 * defined in urlslab_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The urlslab_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->urlslab, plugin_dir_url( __FILE__ ) . 'css/urlslab-admin.css', array(), $this->version, 'all' );

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
		 * defined in urlslab_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The urlslab_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->urlslab, plugin_dir_url( __FILE__ ) . 'js/urlslab-admin.js', array( 'jquery' ), $this->version, false );

	}

	public function urlslab_admin_menu() {
		do_action( "urlslab_admin_menu" );

		add_menu_page(
			'Urlslab Plugin',
			'Urlslab',
			'manage_options',
			plugin_dir_path( __FILE__ ) . 'partials/urlslab-admin-display.php',
			null,
			plugin_dir_url( __FILE__ ) . 'assets/urlslab-logo.png',
			30
		);

		add_submenu_page( plugin_dir_path( __FILE__ ) . 'partials/urlslab-admin-display.php',
			'Urlslab Screenshots',
			'Screenshots',
			'manage_options',
			plugin_dir_path( __FILE__ ) . 'partials/urlslab-admin-screenshot-display.php',
			null
		);
	}

}
