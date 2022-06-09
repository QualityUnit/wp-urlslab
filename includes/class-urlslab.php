<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-data-fetcher.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshot-cron.php';

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    urlslab
 * @subpackage urlslab/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    urlslab
 * @subpackage urlslab/includes
 */
class Urlslab {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Urlslab_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected Urlslab_Loader $loader;

	/**
	 * @var Urlslab_Url_Data_Fetcher
	 */
	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $urlslab The string used to uniquely identify this plugin.
	 */
	protected string $urlslab;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $version The current version of the plugin.
	 */
	protected string $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		$this->version = URLSLAB_VERSION;
		$this->urlslab = 'URLSLAB';

		$this->init_urlslab_user();
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_backend_hooks();
	}

	public static string $link_status_waiting_for_update = 'U';
	public static string $link_status_available = 'A';
	public static string $link_status_waiting_for_screenshot = 'P';
	public static string $link_status_not_scheduled = 'N';
	public static string $link_status_broken = 'B';

	/**
	 *
	 * gets wp_option for URLSLAB plugin
	 */
	public static function get_option( $name, $default = false ) {
		$option = get_option( 'urlslab' );

		if ( false === $option ) {
			return $default;
		}

		if ( isset( $option[ $name ] ) ) {
			return $option[ $name ];
		} else {
			return $default;
		}
	}

	/**
	 *
	 * updates wp_option for URLSLAB plugin
	 */
	public static function update_option( $name, $value ) {
		$option = get_option( 'urlslab' );
		$option = ( false === $option ) ? array() : (array) $option;
		$option = array_merge( $option, array( $name => $value ) );
		update_option( 'urlslab', $option );
	}


	public function init_urlslab_user() {
		$api_key = $this->get_option( 'api-key' );
		$urlslab_user_widget = Urlslab_User_Widget::get_instance();
		$urlslab_available_widgets = Urlslab_Available_Widgets::get_instance();

		if ( ! empty( $api_key ) ) {
			$urlslab_user_widget->add_api_key(
				new Urlslab_Api_Key( $api_key )
			);
		}
		$urlslab_api = new Urlslab_Api_Key( $api_key );
		$this->url_data_fetcher = new Urlslab_Url_Data_Fetcher(
			new Urlslab_Screenshot_Api( $urlslab_api )
		);
		$urlslab_available_widgets->init_widgets( $this->url_data_fetcher );
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - urlslab_Loader. Orchestrates the hooks of the plugin.
	 * - urlslab_i18n. Defines internationalization functionality.
	 * - urlslab_Admin. Defines all hooks for the admin area.
	 * - urlslab_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-urlslab-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-urlslab-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-urlslab-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-urlslab-public.php';

		$this->loader = new Urlslab_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the urlslab_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Urlslab_I18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Urlslab_Admin( $this->get_urlslab(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'urlslab_admin_menu', 9, 0 );
		$this->loader->add_action(
			'wp_loaded',
			$plugin_admin,
			'urlslab_load_add_widgets_page',
			10,
			0
		);

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Urlslab_Public( $this->get_urlslab(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_filter( 'the_content', $plugin_public, 'the_content' );
	}

	private function define_backend_hooks() {
		//defining Upgrade hook
		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshot-cron.php';
		$cron_job = new Urlslab_Screenshot_Cron( $this->url_data_fetcher );

		$this->loader->add_action( 'admin_init', $this, 'urlslab_upgrade', 10, 0 );
		$this->loader->add_action( 'init', $this, 'urlslab_shortcodes_init', 10, 0 );
		$this->loader->add_action( 'urlslab_cron_hook', $cron_job, 'urlslab_cron_exec', 10, 0 );
		if ( ! wp_next_scheduled( 'urlslab_cron_hook' ) ) {
			wp_schedule_event( time(), 'every_minute', 'urlslab_cron_hook' );
		}
	}


	public function urlslab_shortcodes_init() {
		foreach ( Urlslab_Available_Widgets::get_instance()->get_all_widgets() as $i => $widget ) {
			add_shortcode( $widget->get_widget_slug(), array( $widget, 'get_shortcode_content' ) );
		}
	}

	/**
	 * Upgrades option data when necessary.
	 */
	public function urlslab_upgrade() {
		$old_ver = $this->get_option( 'version', '0' );
		$new_ver = URLSLAB_VERSION;

		if ( $old_ver == $new_ver ) {
			return;
		}
		// Any Upgrade hook should be done here. For now no Upgrade migration is available

		$this->update_option( 'version', $new_ver );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @return    string    The name of the plugin.
	 * @since     1.0.0
	 */
	public function get_urlslab(): string {
		return $this->urlslab;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @return    Urlslab_Loader    Orchestrates the hooks of the plugin.
	 * @since     1.0.0
	 */
	public function get_loader(): Urlslab_Loader {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @return    string    The version number of the plugin.
	 * @since     1.0.0
	 */
	public function get_version(): string {
		return $this->version;
	}

}
