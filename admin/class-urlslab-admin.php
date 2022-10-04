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

	private Urlslab_Loader $urlslab_loader;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $urlslab The name of this plugin.
	 * @param string $version The version of this plugin.
	 *
	 * @since    1.0.0
	 */
	public function __construct( string $urlslab, string $version, Urlslab_Loader $urlslab_loader ) {

		$this->urlslab = $urlslab;
		$this->version = $version;
		$this->urlslab_loader = $urlslab_loader;
		$this->urlslab_menu_factory = Urlslab_Page_Factory::get_instance();

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

		wp_enqueue_style( $this->urlslab . '-jquery-modal', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css' );

		wp_enqueue_style(
			$this->urlslab,
			plugin_dir_url( __FILE__ ) . 'css/urlslab-admin.css',
			array(),
			$this->version,
			'all'
		);

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

		wp_enqueue_script(
			$this->urlslab,
			plugin_dir_url( __FILE__ ) . 'js/urlslab-admin.js',
			array( 'jquery', 'jquery-ui-tabs', 'jquery-ui-dialog', 'wp-util' ),
			$this->version,
			false
		);
		wp_localize_script(
			$this->urlslab,
			'params',
			array(
				'nonce' => wp_create_nonce( 'backlink_discovery_nonce' ),
				'ajaxURL' => admin_url( 'admin-ajax.php' ),
			)
		);

	}

	public function get_urlslab_admin_menu_hook_suffix(): string {
		return 'toplevel_page_urlslab/admin/templates/urlslab-admin-display';
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

	public function urlslab_page_ajax() {
		$this->urlslab_menu_factory->init_page_ajax( $this->urlslab_loader );
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
