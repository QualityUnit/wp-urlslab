<?php


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

		$this->load_dependencies();
		$this->set_locale();
		$this->init_urlslab_user();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_backend_hooks();
	}

	/**
	 *
	 * gets wp_option for URLSLAB plugin
	 */
	public static function get_option( $name, $default = false ) {
		$option = get_option( 'urlslab' );

		if ( false === $option ) {
			return $default;
		}

		return $option[ $name ] ?? $default;
	}

	/**
	 * @return int
	 */
	public static function get_installation_id() {
		$installation_id = self::get_option( 'installation_id' );
		if ( is_bool( $installation_id ) && ! $installation_id ) {
			$installation_id = rand();
			self::update_option( 'installation_id', $installation_id );
		}

		return $installation_id;
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
		$api_key                   = $this->get_option( 'api-key' );
		$urlslab_available_widgets = Urlslab_Available_Widgets::get_instance();
		$urlslab_api               = new Urlslab_Api_Key( $api_key );
		$this->url_data_fetcher    = new Urlslab_Url_Data_Fetcher(
			new Urlslab_Screenshot_Api( $urlslab_api )
		);
		$urlslab_available_widgets->init_widgets( $this->url_data_fetcher );
		$urlslab_user_widget = Urlslab_User_Widget::get_instance();

		if ( ! empty( $api_key ) ) {
			$urlslab_user_widget->add_api_key(
				new Urlslab_Api_Key( $api_key )
			);
		}
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
		require_once URLSLAB_PLUGIN_DIR . '/vendor/autoload.php';

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

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshot-cron.php';

		//services
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-screenshot-api.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-user-management-api.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/urlslab-api-model.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-batch-request.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-url-data-response.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/models/class-urlslab-screenshot-error-response.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-keyword-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-file-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-file-pointer-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-youtube-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-api-key.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-url-data-fetcher.php';

		//settings
		require_once URLSLAB_PLUGIN_DIR . '/admin/templates/settings/class-urlslab-admin-setting-element.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/templates/settings/class-urlslab-setting-disabled.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/templates/settings/class-urlslab-setting-input.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/templates/settings/class-urlslab-setting-switch.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/templates/settings/class-urlslab-setting-option.php';

		//additional
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/helpers/urlslab-helpers.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/helpers/class-urlslab-status.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

		//widgets
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-related-resources-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-media-offloader-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-lazy-loading.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-link-enhancer.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-keywords-links.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-image-alt-text.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-meta-tag.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-css-optimizer.php';


		//menu pages
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-page-factory.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-admin-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-admin-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-dashboard-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-urls-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-integrations-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-header-widgets-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-image-seo-widgets-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-link-building-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-media-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-media-offloader-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-lazyload-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-related-resource-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-keyword-linking-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-link-management-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-ui-elements-page.php';

		//tables
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/tables/class-urlslab-keyword-link-table.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/tables/class-urlslab-screenshot-table.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/tables/class-urlslab-offloader-table.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/tables/class-urlslab-related-resources-widget-table.php';

		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-api-router.php';

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
		$this->loader->add_action( 'wp_ajax_urlslab_exec_cron', $this, 'execute_cron_tasks' );

		$plugin_admin = new Urlslab_Admin( $this->get_urlslab(), $this->get_version(), $this->loader );
		$plugin_admin->urlslab_page_ajax();

		$this->loader->add_action( 'admin_init', $this, 'urlslab_upgrade', 10, 0 );
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
		$this->loader->add_action( 'template_redirect', $plugin_public, 'download_offloaded_file', PHP_INT_MAX );

		$this->loader->add_action( 'wp_before_load_template', $this, 'buffer_head_start', PHP_INT_MIN );
		$this->loader->add_action( 'wp_after_load_template', $this, 'buffer_end', PHP_INT_MAX );

		//body content
		$this->loader->add_action( 'wp_body_open', $this, 'buffer_content_start', PHP_INT_MAX );
		$this->loader->add_action( 'wp_footer', $this, 'buffer_end', PHP_INT_MIN );

		$this->init_activated_widgets();
	}

	public function buffer_head_start() {
		ob_start(
			array(
				$this,
				'urlslab_head_content_check',
			),
			0,
			PHP_OUTPUT_HANDLER_FLUSHABLE | PHP_OUTPUT_HANDLER_REMOVABLE
		);
	}


	public function buffer_content_start() {
		ob_start( array( $this, 'urlslab_content' ), 0, PHP_OUTPUT_HANDLER_FLUSHABLE | PHP_OUTPUT_HANDLER_REMOVABLE );
	}

	public function buffer_end() {
		ob_end_flush();
	}

	public function urlslab_head_content_check( $content ) {
		if ( false !== strpos( strtolower( substr( $content, 0, 30 ) ), '<head>' ) ) {
			if ( preg_match( '|(.*?)(<head>.*?</head>)(.*?)|imus', $content, $matches ) ) {
				return $matches[1] . $this->urlslab_head_content( '<html>' . $matches[2] . '<body></body></html>' ) . $matches[3];
			}
		}

		return $content;
	}

	private function urlslab_head_content( $content ) {
		if ( empty( $content ) ) {
			return $content;    //nothing to process
		}

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$document->loadHTML(
				mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ),
				LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
			);

			foreach (libxml_get_errors() as $error){
				if (false !== strpos($error->message, 'Unexpected') || false !== strpos($error->message, 'misplaced')) {
					return $content;
				}
			}

			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			do_action( 'urlslab_head_content', $document );


			return $document->saveHTML( $document->getElementsByTagName( 'head' )[0] );
		} catch ( Exception $e ) {
			return $content;
		}
	}

	public function urlslab_content( $content ) {
		if ( empty( $content ) || http_response_code() !== 200 ) {
			return $content;    //nothing to process
		}

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$document->loadHTML(
				mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ),
				LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
			);
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			do_action( 'urlslab_content', $document );

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content;
		}
	}

	private function init_activated_widgets() {
		$active_widgets = Urlslab_User_Widget::get_instance()->get_activated_widget();
		foreach ( $active_widgets as $active_widget ) {
			$active_widget->init_widget( $this->loader );
		}
	}

	private function add_cron_task( $task ) {
		$this->cron_tasks[] = $task;
		$this->loader->add_action( 'urlslab_cron_hook', $task, 'cron_exec', 10, 0 );
	}


	public function execute_cron_tasks() {
		$data       = array();
		$start_time = time();
		$max_time   = 15;
		foreach ( $this->cron_tasks as $task ) {
			if ( $max_time > ( time() - $start_time ) ) {
				try {
					$task_time = time();
					$task->ajax_exec( $start_time, 15 );
					$data[ get_class( $task ) ] = time() - $task_time;
				} catch ( Exception $e ) {
					$data[ get_class( $task ) ] = $e->getMessage();
				}
			}
		}
		wp_send_json_success( $data );
	}

	private function define_backend_hooks() {

		add_action(
			'rest_api_init',
			function() {
				( new Urlslab_Api_Router() )->register_routes();
			}
		);


		if ( ! wp_next_scheduled( 'urlslab_cron_hook' ) ) {
			wp_schedule_event( time(), 'every_minute', 'urlslab_cron_hook' );
		}

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-download-css-cron.php';
		$this->add_cron_task( new Urlslab_Download_CSS_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshot-cron.php';
		$this->add_cron_task( new Urlslab_Screenshot_Cron( $this->url_data_fetcher ) );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-youtube-cron.php';
		$this->add_cron_task( new Urlslab_Youtube_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Background_Attachments_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-transfer-files-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Transfer_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-update-urls-cron.php';
		$this->add_cron_task( new Urlslab_Update_Urls_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-enqueue-files-cron.php';
		$this->add_cron_task( new Urlslab_Offload_Enqueue_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-webp-images-cron.php';
		$cron_job_webp_convert = new Urlslab_Convert_Webp_Images_Cron();
		if ( $cron_job_webp_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_webp_convert );
		}

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-avif-images-cron.php';
		$cron_job_avif_convert = new Urlslab_Convert_Avif_Images_Cron();
		if ( $cron_job_avif_convert->is_format_supported() ) {
			$this->add_cron_task( $cron_job_avif_convert );
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
