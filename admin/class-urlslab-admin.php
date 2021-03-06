<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';

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

		$main_menu = add_menu_page(
			'Urlslab Plugin',
			'Urlslab',
			'manage_options',
			plugin_dir_path( __FILE__ ) . 'partials/urlslab-admin-display.php',
			null,
			plugin_dir_url( __FILE__ ) . 'assets/urlslab-logo.png',
			80
		);

		foreach ( Urlslab_User_Widget::get_instance()->get_activated_widget() as $widget ) {
			$hook = add_submenu_page(
				plugin_dir_path( __FILE__ ) . 'partials/urlslab-admin-display.php',
				$widget->get_admin_menu_page_title(),
				$widget->get_admin_menu_title(),
				'manage_options',
				$widget->get_widget_slug(),
				array( $widget, 'load_widget_page' )
			);
			add_action( "load-$hook", array( $widget, 'widget_admin_load' ) );
		}
	}

	function urlslab_load_add_widgets_page() {
		$current_action = '';
		if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
			$current_action = $_REQUEST['action'];
		}

		if ( isset( $_REQUEST['component'] ) ) {
			if ( 'api-key' == $_REQUEST['component'] && ( 'setup' == $current_action ) ) {
				Urlslab_User_Widget::get_instance()->api_setup_response( $current_action );
			}

			if ( 'activation' == $current_action ) {
				foreach ( Urlslab_Available_Widgets::get_instance()->get_available_widgets() as $widget ) {
					if ( $widget->get_widget_slug() == $_REQUEST['component'] ) {
						$widget->widget_management_response( $current_action );
					}
				}
			}
		}
	}

}
