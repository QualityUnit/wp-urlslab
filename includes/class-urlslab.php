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
		$urlslab_available_widgets = Urlslab_Available_Widgets::get_instance();
		$this->url_data_fetcher    = new Urlslab_Url_Data_Fetcher();
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

		//data
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-keyword-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-keyword-map-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-relation-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-pointer-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-youtube-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-api-key.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-data-fetcher.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-search-replace-row.php';


		//additional
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

		//widgets
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-general.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-optimize.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-related-resources-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-media-offloader-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-lazy-loading.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-link-enhancer.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-keywords-links.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-image-alt-text.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-meta-tag.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-css-optimizer.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-search-replace.php';


		//menu pages
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-page-factory.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-admin-page.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-admin-subpage.php';
		require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-dashboard-page.php';

		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-api-router.php';
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

		Urlslab_Loader::get_instance()->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

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
		$plugin_admin->urlslab_page_ajax();

		Urlslab_Loader::get_instance()->add_action( 'admin_init', $this, 'urlslab_upgrade', 10, 0 );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_react_settings' );
		Urlslab_Loader::get_instance()->add_action( 'admin_menu', $plugin_admin, 'urlslab_admin_menu', 9, 0 );
		Urlslab_Loader::get_instance()->add_action(
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

		Urlslab_Loader::get_instance()->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		Urlslab_Loader::get_instance()->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $plugin_public, 'download_offloaded_file', PHP_INT_MAX );

		Urlslab_Loader::get_instance()->add_action( 'wp_before_load_template', $this, 'buffer_head_start', PHP_INT_MIN );
		Urlslab_Loader::get_instance()->add_action( 'wp_after_load_template', $this, 'buffer_end', PHP_INT_MAX );

		//body content
		Urlslab_Loader::get_instance()->add_action( 'wp_body_open', $this, 'buffer_content_start', PHP_INT_MAX );
		Urlslab_Loader::get_instance()->add_action( 'wp_footer', $this, 'buffer_end', PHP_INT_MIN );

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
		if ( empty( $content ) || ! has_action( 'urlslab_head_content' ) ) {
			return $content;    //nothing to process
		}

		$content = apply_filters( 'urlslab_head_content_raw', $content );

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$document->loadHTML(
				mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ),
				LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
			);

			foreach ( libxml_get_errors() as $error ) {
				if ( false !== strpos( $error->message, 'Unexpected' ) || false !== strpos( $error->message, 'misplaced' ) ) {
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

		$content = apply_filters( 'urlslab_content_raw', $content );

		if ( has_action( 'urlslab_content' ) ) {
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
			}
		}

		return $content;
	}

	private function init_activated_widgets() {
		$active_widgets = Urlslab_User_Widget::get_instance()->get_activated_widgets();
		foreach ( $active_widgets as $active_widget ) {
			$active_widget->init_widget();
		}
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

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron-manager.php';

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-download-css-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Download_CSS_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-screenshots-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Screenshots_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-optimize-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Optimize_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-youtube-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Youtube_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-background-attachments-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Offload_Background_Attachments_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-transfer-files-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Offload_Transfer_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-update-urls-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Update_Urls_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-offload-enqueue-files-cron.php';
		Urlslab_Cron_Manager::get_instance()->add_cron_task( new Urlslab_Offload_Enqueue_Files_Cron() );

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-webp-images-cron.php';
		$cron_job_webp_convert = new Urlslab_Convert_Webp_Images_Cron();
		if ( $cron_job_webp_convert->is_format_supported() ) {
			Urlslab_Cron_Manager::get_instance()->add_cron_task( $cron_job_webp_convert );
		}

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-convert-avif-images-cron.php';
		$cron_job_avif_convert = new Urlslab_Convert_Avif_Images_Cron();
		if ( $cron_job_avif_convert->is_format_supported() ) {
			Urlslab_Cron_Manager::get_instance()->add_cron_task( $cron_job_avif_convert );
		}
	}

	/**
	 * Upgrades option data when necessary.
	 */
	public function urlslab_upgrade() {
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-activator.php';
		Urlslab_Activator::upgrade_steps();
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->load_dependencies();
		$this->set_locale();
		$this->init_urlslab_user();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_backend_hooks();

		Urlslab_Loader::get_instance()->run();
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
	 * Retrieve the version number of the plugin.
	 *
	 * @return    string    The version number of the plugin.
	 * @since     1.0.0
	 */
	public function get_version(): string {
		return $this->version;
	}

}
