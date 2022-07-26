<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-page-factory.php';

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
	 * @var      string $urlslab The ID of this plugin.
	 */
	private string $urlslab;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private string $version;

	/**
	 * The menu factory to create different menus
	 *
	 * @since    1.1.0
	 * @access   private
	 * @var Urlslab_Page_Factory
	 */
	private Urlslab_Page_Factory $urlslab_menu_factory;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $urlslab The name of this plugin.
	 * @param string $version The version of this plugin.
	 *
	 * @since    1.0.0
	 */
	public function __construct( string $urlslab, string $version ) {

		$this->urlslab = $urlslab;
		$this->version = $version;
		$this->urlslab_menu_factory = new Urlslab_Page_Factory();

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

	public function get_urlslab_admin_menu_hook_suffix(): string {
		return 'toplevel_page_urlslab/admin/partials/urlslab-admin-display';
	}

	public function urlslab_admin_menu() {
		do_action( 'urlslab_admin_menu' );

		add_menu_page(
			'Urlslab Plugin',
			'Urlslab',
			'manage_options',
			$this->urlslab_menu_factory->main_menu_slug(),
			null,
			plugin_dir_url( __FILE__ ) . 'assets/urlslab-logo.png',
			80
		);

		$this->urlslab_menu_factory->init_admin_menus();
	}

	function urlslab_load_add_widgets_page() {
		$action = '';
		$page_slug = '';
		$component = '';

		//# action initialization
		if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
			$action = $_REQUEST['action'];
		}
		//# action initialization

		//# slug initialization
		if ( isset( $_REQUEST['page'] ) and -1 != $_REQUEST['page'] ) {
			$page_slug = $_REQUEST['page'];
		}
		//# slug initialization

		//# component initialization
		if ( isset( $_REQUEST['component'] ) and -1 != $_REQUEST['component'] ) {
			$component = $_REQUEST['component'];
		}
		//# component initialization

		$this->urlslab_menu_factory->init_on_page_loads( $page_slug, $action, $component );
	}

}
