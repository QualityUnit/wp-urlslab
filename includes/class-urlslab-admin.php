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
    private array $editor_modules;

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

		// list of modules available on editor pages
		$this->editor_modules = array(
			// 'ai-content-assistant',
		);
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'enqueue_elementor_editor_assets' ) );
		add_action( 'admin_head', array( $this, 'admin_head' ) );
		add_filter( 'script_loader_tag', array( $this, 'script_loader_tag' ), 10, 3 );
		add_filter( 'admin_body_class', array( $this, 'admin_body_class' ), 10, 1 );
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_react_settings() {
		if ( $this->is_urlslab_admin_page() ) {
			$maincss = glob( URLSLAB_PLUGIN_DIR . 'admin/dist/assets/main-*.css' );
			$mainjs  = glob( URLSLAB_PLUGIN_DIR . 'admin/dist/main-*.js' );

			if ( ! empty( $maincss ) ) {
				wp_enqueue_style( $this->urlslab . '-main', URLSLAB_PLUGIN_URL . 'admin/dist/assets/' . basename( $maincss[0] ), false, $this->version );
			}

			if ( ! empty( $mainjs ) ) {
				wp_enqueue_script(
					$this->urlslab . '-main',
					URLSLAB_PLUGIN_URL . 'admin/dist/' . basename( $mainjs[0] ),
					array(
						'react',
						'react-dom',
						'wp-api-fetch',
						'wp-element',
						'wp-i18n',
						'wp-date',
					),
					null, // do not include versioning for react apps, is unnecessary and cause problems with lazy loaded components
					true
				);

				wp_localize_script( 
					$this->urlslab . '-main', 
					'urlslabData', 
					array( 
						'urls' => array(
							'root'      => get_site_url(),
							'rootAdmin' => get_admin_url(),
						),
					)
				);
			}
		}
	}

	public function admin_head() {
		if ( $this->is_urlslab_admin_page() ) {
			$this->add_svg_sprites();

		}
	}

	/**
	 * Register block editor assets.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_block_editor_assets() {
		$this->enqueue_editors_modules( 'gutenberg' );
	}

	/**
	 * Register elementor editor assets.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_elementor_editor_assets() {
		$this->enqueue_editors_modules( 'elementor' );
	}


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
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_localize_script(
			$this->urlslab,
			'wpApiSettings',
			array(
				'root'  => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	public function get_urlslab_admin_menu_hook_suffix(): string {
		return 'toplevel_page_urlslab/admin/templates/urlslab-admin-display';
	}

	public function urlslab_admin_menu() {
		do_action( 'urlslab_admin_menu' );

		add_menu_page(
			'URLsLab Plugin',
			'URLsLab',
			'manage_options',
			'urlslab-dashboard',
			null,
			URLSLAB_PLUGIN_URL . 'admin/assets/urlslab-logo.png',
			2
		);

		add_submenu_page(
			'urlslab-dashboard',
			'URLsLab Modules',
			'Modules',
			'manage_options',
			'urlslab-dashboard',
			function () {
				require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-dashboard.php';
			}
		);
	}

	public function urlslab_admin_bar_menu( WP_Admin_Bar $wp_admin_bar ) {
		do_action( 'urlslab_admin_bar_menu' );

		wp_enqueue_script( $this->urlslab . '-notifications', URLSLAB_PLUGIN_URL . 'public/build/js/urlslab-notifications.js', false, URLSLAB_VERSION, false );
		wp_enqueue_style( $this->urlslab . '-notifications', URLSLAB_PLUGIN_URL . 'public/build/css/urlslab_notifications.css', false, URLSLAB_VERSION, false );

		$this->add_root_bar_menu( $wp_admin_bar );

		$active_widgets = Urlslab_User_Widget::get_instance()->get_activated_widgets();
		foreach ( $active_widgets as $active_widget ) {
			$active_widget->init_wp_admin_menu( $this->urlslab, $wp_admin_bar );
		}
	}

	public function script_loader_tag( $tag, $handle, $src ) {
		$handles = array_merge( array( 'main' ), $this->editor_modules );
		// if script is our module, update type attribute
		if ( strpos( $handle, $this->urlslab ) === 0 && in_array( str_replace( "{$this->urlslab}-", '', $handle ), $handles ) ) {
			return str_replace( ' src', ' type="module" src', $tag );
		}

		return $tag;
	}

	public function enqueue_editors_modules( $editor_type ) {
		foreach ( $this->editor_modules as $module_name ) {
			$handle  = "{$this->urlslab}-{$module_name}";
			$cssfile = glob( URLSLAB_PLUGIN_DIR . "admin/apps/{$module_name}/dist/assets/main-*.css" );
			$jsfile  = glob( URLSLAB_PLUGIN_DIR . "admin/apps/{$module_name}/dist/main-*.js" );

			if ( ! empty( $cssfile ) ) {
				wp_enqueue_style( $handle, URLSLAB_PLUGIN_URL . "admin/apps/{$module_name}/dist/assets/" . basename( $cssfile[0] ), false, $this->version );
			}

			if ( ! empty( $jsfile ) ) {
				wp_enqueue_script(
					$handle,
					URLSLAB_PLUGIN_URL . "admin/apps/{$module_name}/dist/" . basename( $jsfile[0] ),
					array(
						'react',
						'react-dom',
						'wp-data',
						'wp-editor',
						'wp-dom-ready',
						'wp-i18n',
						'wp-blocks',
					),
					null, // do not include versioning for react apps, is unnecessary and cause problems with lazy loaded components
					true
				);

				wp_localize_script( $handle, 'scriptData', array( 'editor_type' => $editor_type ) );
			}
		}
	}

	public function admin_body_class( $classes ) {
		return $this->is_urlslab_admin_page() || $this->is_admin_post_type_page() ? $classes . ' urlslab-admin-page ' : $classes;
	}

	public function add_svg_sprites() {
		if ( $this->is_urlslab_admin_page() ) {
			echo '<div id="urlslab-svg-sprites">' . file_get_contents( URLSLAB_PLUGIN_DIR . 'admin/dist/spritemap.svg' ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	public function is_urlslab_admin_page() {
		return isset( $_GET['page'] ) && str_contains( sanitize_text_field( $_GET['page'] ), 'urlslab' );
	}

	public function is_admin_post_type_page() {
		$current_screen = get_current_screen();

		return $current_screen && 'post' === $current_screen->base;
	}

	private function add_root_bar_menu( WP_Admin_Bar $wp_admin_bar ) {

		$menu_title = 'URLsLab';
		$widget     = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );

		if ( 0 === strlen( $widget->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_API_KEY ) ) ) {
			$menu_title .= ': <span style="color: red" class="notification-api-key">API key missing</span>';
		} else {
			if ( 0 >= $widget->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS ) ) {
				$menu_title .= ': <span style="color: red">No FlowHunt Credits</span>';
			}
		}

		$menu_title .= $this->get_cron_notification();

		$menu_args = array(
			'id'    => Urlslab_Widget::MENU_ID,
			'title' => $menu_title,
			'href'  => admin_url( 'admin.php?page=urlslab-dashboard' ),
			'meta'  => array( 'tabindex' => '0' ),
		);
		$wp_admin_bar->add_menu( $menu_args );
	}

	private function get_cron_notification(): string {
		$jobs = wp_get_ready_cron_jobs();
		foreach ( $jobs as $timestamp => $job ) {
			if ( $timestamp < time() - 300 ) {
				foreach ( $job as $hook => $details ) {
					if ( strpos( $hook, 'urlslab' ) !== false ) {
						return ' <span style="color: lightsalmon">Cron not running!</span>';
					}
				}
			}
		}

		return '';
	}
}
