<?php

/**
 * The file that defines the core plugin class.
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @see        http://example.com
 * @since      1.0.0
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
 */
class Urlslab {
	private static $buffer_started = false;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 *
	 * @var string the string used to uniquely identify this plugin
	 */
	protected string $urlslab;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 *
	 * @var string the current version of the plugin
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
		$this->urlslab = 'URLsLab';
	}

	/**
	 * gets wp_option for URLSLAB plugin.
	 *
	 * @param mixed $name
	 * @param mixed $default
	 */
	public static function get_option( $name, $default = false ) {
		$option = get_option( 'urlslab' );

		if ( false === $option ) {
			return $default;
		}

		return $option[ $name ] ?? $default;
	}

	/**
	 * updates wp_option for URLSLAB plugin.
	 *
	 * @param mixed $name
	 * @param mixed $value
	 */
	public static function update_option( $name, $value ) {
		$option = get_option( 'urlslab' );
		$option = ( false === $option ) ? array() : (array) $option;
		$option = array_merge( $option, array( $name => $value ) );
		update_option( 'urlslab', $option );
	}

	public function buffer_start( $content ) {
		if ( self::$buffer_started || is_admin() ) {
			return;
		}
		ob_start(
			array(
				$this,
				'urlslab_content_check',
			),
			0,
			PHP_OUTPUT_HANDLER_FLUSHABLE | PHP_OUTPUT_HANDLER_REMOVABLE
		);
		self::$buffer_started = true;

		return $content;
	}

	public function buffer_end() {
		if ( self::$buffer_started && ob_get_length() ) {
			ob_end_flush();
		}
	}

	public function urlslab_content_check( $content ) {
		global $pagenow;
		if (
			empty( $content ) ||
			( false === strpos( $content, '<!DOCTYPE html>' ) && false === strpos( $content, '<!doctype html>' ) && false === str_starts_with( $content, '<html' ) ) ||
			wp_is_maintenance_mode() ||
			wp_is_recovery_mode() ||
			is_admin() ||
			wp_is_xml_request() ||
			wp_is_json_request() ||
			'wp-login.php' === $pagenow ||
			'admin-ajax.php' === $pagenow ||
			Urlslab_Public::is_download_request()
		) {
			return $content;
		}

		if ( false !== strpos( strtolower( substr( $content, 0, 300 ) ), '<head>' ) ) {
			if ( preg_match( '|(.*?)<head>(.*?)</head>(.*)|imus', $content, $matches ) ) {
				$content = $matches[1] . apply_filters( 'urlslab_raw_head_content_final', $this->urlslab_head_content( $matches[2] ) ) . $matches[3];
			}
		}

		if ( false !== strpos( $content, '<body' ) ) {
			if ( preg_match( '|(.*?)<body(.*?)>(.*?)</body>(.*?)|imus', $content, $matches ) ) {
				$content = $matches[1] . apply_filters( 'urlslab_raw_body_content_final', $this->urlslab_body_content( $matches[3], $matches[2] ) ) . $matches[4];
			}
		}

		return apply_filters( 'urlslab_raw_content', $content );
	}


	private function urlslab_head_content( $content ) {
		if ( empty( $content ) ) {
			return $content;    // nothing to process
		}

		$content = apply_filters( 'urlslab_head_content_raw', $content );

		if ( ! has_action( 'urlslab_head_content' ) ) {
			return '<head>' . $content . '</head>';
		}

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$document->loadHTML(
				mb_convert_encoding( '<html><head>' . $content . '</head><body></body></html>', 'HTML-ENTITIES', get_bloginfo( 'charset' ) ),
				LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
			);

			foreach ( libxml_get_errors() as $error ) {
				if ( false !== strpos( $error->message, 'Unexpected' ) || false !== strpos( $error->message, 'misplaced' ) ) {
					return '<head>' . $content . '</head>';
				}
			}

			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			do_action( 'urlslab_head_content', $document );

			return $document->saveHTML( $document->getElementsByTagName( 'head' )[0] );
		} catch ( Exception $e ) {
			return '<head>' . $content . '</head>';
		}
	}


	public function urlslab_body_content( $content, $body_attributes ) {
		if ( empty( $content ) ) {
			return $content;    // nothing to process
		}

		$content = apply_filters( 'urlslab_raw_body_content', $content );

		if ( has_action( 'urlslab_body_content' ) ) {
			$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
			$document->encoding            = get_bloginfo( 'charset' );
			$document->strictErrorChecking = false; // phpcs:ignore
			$libxml_previous_state         = libxml_use_internal_errors( true );

			try {
				$document->loadHTML(
					mb_convert_encoding( '<html><head></head><body' . $body_attributes . '>' . $content . '</body></html>', 'HTML-ENTITIES', get_bloginfo( 'charset' ) ),
					LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE
				);

				// not continuing if its sitemap
				if ( $this->is_url_sitemap( Urlslab_Url::get_current_page_url()->get_url_path() ) ) {
					return $content;
				}

				libxml_clear_errors();
				libxml_use_internal_errors( $libxml_previous_state );

				do_action( 'urlslab_body_content', $document );

				return $document->saveHTML( $document->getElementsByTagName( 'body' )[0] );
			} catch ( Exception $e ) {
			}
		}

		return '<body' . $body_attributes . '>' . $content . '</body>';
	}

	public function is_url_sitemap( string $url ) {
		// List regex patterns to match.
		$patterns = array(
			'\/sitemap_index\.xml$',
			'\/([^/]+?)-sitemap([0-9]+)?\.xml$',
			'\/([a-z]+)?-?sitemap\.xsl$',
		);

		// Iterate through the patterns and check if any of them match the $url.
		foreach ( $patterns as $pattern ) {
			if ( preg_match( '~' . $pattern . '~', $url ) ) {
				return true; // Pattern matched - URL is a sitemap.
			}
		}

		return false; // No matching pattern found - URL is not a sitemap.
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
		$this->init_table_names();
		Urlslab_Available_Widgets::get_instance()->init_widgets();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_backend_hooks();
		$this->define_api_hooks();
		$this->init_blocks();

		Urlslab_Loader::get_instance()->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @return string the name of the plugin
	 *
	 * @since     1.0.0
	 */
	public function get_urlslab(): string {
		return $this->urlslab;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @return string the version number of the plugin
	 *
	 * @since     1.0.0
	 */
	public function get_version(): string {
		return $this->version;
	}

	public function plugin_action_links( array $links ) {
		return array_merge(
			array(
				'<a href="' . admin_url( '/admin.php?page=urlslab-dashboard' ) . '" title="' . __( 'URLsLab Settings', 'urlslab' ) . '">' . __( 'Settings', 'urlslab' ) . '</a>',
			),
			$links
		);
	}

	public function add_cron_interval( $schedules ): array {
		$my_schedule['every_minute'] = array(
			'interval' => 60,
			'display'  => esc_html__( 'Every Minute' ),
		);

		return array_merge( $my_schedule, $schedules );
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
	 */
	private function load_dependencies() {
		require_once URLSLAB_PLUGIN_DIR . '/vendor/autoload.php';
		require_once URLSLAB_PLUGIN_DIR . '/vendor_prefixed/autoload.php';

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

		require_once URLSLAB_PLUGIN_DIR . '/includes/cache/class-urlslab-cache.php';

		// data
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-data.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-cache-rule-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-generator-shortcode-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-generator-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-generator-result-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-generator-task-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-prompt-template-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-keyword-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-keyword-map-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-relation-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-file-pointer-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-youtube-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-youtube-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-url-data-fetcher.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-search-replace-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-screenshot-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-not-found-log-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-redirect-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-label-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-custom-html-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-js-cache-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-css-cache-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-faq-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-faq-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-task-row.php';

		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-serp-query-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-serp-url-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-serp-domain-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-gsc-position-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-serp-position-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-serp-position-history-row.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-gsc-site-row.php';

		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-gap-analyses.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-urls-batch.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-download-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-generate.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/executor/class-urlslab-executor-url-intersection.php';


		// additional
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

		//connections
		require_once URLSLAB_PLUGIN_DIR . '/includes/connections/class-urlslab-augment-connection.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/connections/class-urlslab-serp-connection.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/connections/class-urlslab-yt-connection.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/connections/class-urlslab-summaries-connection.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/connections/class-urlslab-related-urls-connection.php';


		// widgets
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';

		// router
		require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-api-router.php';

		// editor blocks
		require_once URLSLAB_PLUGIN_DIR . '/blocks/class-urlslab-blocks.php';
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the urlslab_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
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
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Urlslab_Admin( $this->get_urlslab(), $this->get_version() );

		add_action(
			'admin_enqueue_scripts',
			function( $hook ) {
				if ( ! did_action( 'wp_enqueue_media' ) ) {
					wp_enqueue_media();
				}
			}
		);
		Urlslab_Loader::get_instance()->add_action( 'admin_init', $this, 'urlslab_upgrade', 10, 0 );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_react_settings' );
		Urlslab_Loader::get_instance()->add_action( 'admin_menu', $plugin_admin, 'urlslab_admin_menu', 9, 0 );
		Urlslab_Loader::get_instance()->add_action( 'admin_bar_menu', $plugin_admin, 'urlslab_admin_bar_menu', 9999 );
		Urlslab_Loader::get_instance()->add_filter( 'plugin_action_links_' . URLSLAB_PLUGIN_BASENAME, $this, 'plugin_action_links' );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 */
	private function define_public_hooks() {
		if ( ! defined( 'DOING_AJAX' ) && ! wp_installing() ) {
			$plugin_public = new Urlslab_Public( $this->get_urlslab(), $this->get_version() );
			Urlslab_Loader::get_instance()->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
			Urlslab_Loader::get_instance()->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
			Urlslab_Loader::get_instance()->add_action( 'template_redirect', $plugin_public, 'download_offloaded_file', PHP_INT_MIN );
			if ( ! defined( 'WP_ADMIN' ) ) {
				Urlslab_Loader::get_instance()->add_action( 'wp_loaded', $this, 'buffer_start', PHP_INT_MAX );
				Urlslab_Loader::get_instance()->add_action( 'wp_before_load_template', $this, 'buffer_start', PHP_INT_MAX );
				Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'buffer_start', PHP_INT_MAX );
				Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'buffer_end', PHP_INT_MIN );
			}
		}
		$this->init_activated_widgets();
	}

	private function init_activated_widgets() {
		$active_widgets = Urlslab_User_Widget::get_instance()->get_activated_widgets();
		foreach ( $active_widgets as $active_widget ) {
			$active_widget->init_widget();
		}
	}

	private function define_backend_hooks() {
		add_filter( 'cron_schedules', array( $this, 'add_cron_interval' ) );
		if ( ! wp_next_scheduled( 'urlslab_cron_hook' ) ) {
			wp_schedule_event( time(), 'every_minute', 'urlslab_cron_hook' );
		}

		require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron-manager.php';
		Urlslab_Loader::get_instance()->add_action( 'urlslab_cron_hook', Urlslab_Cron_Manager::get_instance(), 'exec_cron_task', 10, 0 );
	}

	private function init_table_names() {
		include_once URLSLAB_PLUGIN_DIR . '/table-names.php';
	}

	private function define_api_hooks() {
		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-base.php';
		if ( ! isset( $_SERVER['REQUEST_URI'] ) || false === strpos( sanitize_url( $_SERVER['REQUEST_URI'] ), Urlslab_Api_Base::NAMESPACE ) ) {
			return;
		}

		add_action(
			'rest_api_init',
			function() {
				if ( ! current_user_can( 'read' ) ) {
					return;
				}
				( new Urlslab_Api_Router() )->register_routes();
			}
		);
	}

	private function init_blocks() {
		Urlslab_Blocks::run();
	}
}
