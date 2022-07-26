<?php
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-admin-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-dashboard-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-feature-manager-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-general-settings-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-header-widgets-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-image-seo-widgets-page.php';
require_once URLSLAB_PLUGIN_DIR . '/admin/includes/menu/class-urlslab-content-widgets-page.php';

class Urlslab_Page_Factory {

	/**
	 * @since 1.2.0
	 * @var Urlslab_Admin_page[]
	 */
	private array $menus;

	/**
	 * @since 1.2.0
	 * @var Urlslab_Admin_Page
	 */
	private Urlslab_Admin_Page $admin_plugin_main_page;

	public function __construct() {
		$dashboard = new Urlslab_Dashboard_Page();
		$general_settings = new Urlslab_General_Settings_Page();
		$header_widgets = new Urlslab_Header_Widgets_Page();
		$content_widgets = new Urlslab_Content_Widgets_Page();
		$image_seo = new Urlslab_Image_Seo_Widgets_Page();
		$feature_manager = new Urlslab_Feature_Manager_Page();

		$this->menus = array(
			$dashboard->get_menu_slug() => $dashboard,
			$general_settings->get_menu_slug() => $general_settings,
			$header_widgets->get_menu_slug() => $header_widgets,
			$content_widgets->get_menu_slug() => $content_widgets,
			$image_seo->get_menu_slug() => $image_seo,
			$feature_manager->get_menu_slug() => $feature_manager,
		);
		$this->admin_plugin_main_page = $dashboard;
	}

	/**
	 * @return void
	 */
	public function init_admin_menus() {
		foreach ( $this->menus as $menu ) {
			$menu->register_submenu(
				$this->admin_plugin_main_page->get_menu_slug()
			);
		}
	}

	public function init_on_page_loads(
		string $page_slug,
		string $action,
		string $component ) {
		if ( isset( $this->menus[ $page_slug ] ) ) {
			$this->menus[ $page_slug ]->on_page_load( $action, $component );
		}
	}

	/**
	 * @param string $page_slug
	 *
	 * @return Urlslab_Admin_Page|null
	 */
	public function get_page( string $page_slug ): ?Urlslab_Admin_Page {
		if ( ! isset( $this->menus[ $page_slug ] ) ) {
			return null;
		}
		return $this->menus[ $page_slug ];
	}

	/**
	 * @return string
	 */
	public function main_menu_slug(): string {
		return $this->admin_plugin_main_page->get_menu_slug();
	}


}
