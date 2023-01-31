<?php

class Urlslab_Page_Factory {

	/**
	 * @since 1.2.0
	 * @var Urlslab_Admin_page[]
	 */
	private static array $menus;

	private static Urlslab_Page_Factory $instance;

	/**
	 * @since 1.2.0
	 * @var Urlslab_Admin_Page
	 */
	private static Urlslab_Admin_Page $admin_plugin_main_page;

	public static function get_instance(): Urlslab_Page_Factory {
		if ( empty( self::$instance ) ) {
			$dashboard = new Urlslab_Dashboard_Page();
			$urls_page = new Urlslab_Urls_Page();
			$header_widgets = new Urlslab_Header_Widgets_Page();
			$link_building_page = new Urlslab_Link_Building_Page();
			$image_seo = new Urlslab_Image_Seo_Widgets_Page();
			$media_page = new Urlslab_Media_Page();
			$ui_elements = new Urlslab_UI_Elements_Page();
			$integrations_page = new Urlslab_Integrations_Page();

			self::$menus = array(
				$dashboard->get_menu_slug() => $dashboard,
				$urls_page->get_menu_slug() => $urls_page,
				$header_widgets->get_menu_slug() => $header_widgets,
				$link_building_page->get_menu_slug() => $link_building_page,
				$image_seo->get_menu_slug() => $image_seo,
				$media_page->get_menu_slug() => $media_page,
				$ui_elements->get_menu_slug() => $ui_elements,
				$integrations_page->get_menu_slug() => $integrations_page,
			);
			self::$admin_plugin_main_page = $dashboard;
			self::$instance = new self;
		}
		return self::$instance;
	}

	/**
	 * @return void
	 */
	public function init_admin_menus() {
		foreach ( self::$menus as $menu ) {
			$menu->register_submenu(
				self::$admin_plugin_main_page->get_menu_slug()
			);
		}
	}

	public function init_page_ajax( Urlslab_Loader $urlslab_loader ) {
		foreach ( self::$menus as $menu ) {
			$menu->init_ajax_hooks(
				$urlslab_loader
			);
		}
	}

	public function init_on_page_loads(
		string $page_slug,
		string $action,
		string $component ) {
		if ( isset( self::$menus[ $page_slug ] ) ) {
			self::$menus[ $page_slug ]->on_page_load( $action, $component );
		}
	}

	/**
	 * @param string $page_slug
	 *
	 * @return Urlslab_Admin_Page|null
	 */
	public function get_page( string $page_slug ): ?Urlslab_Admin_Page {
		if ( ! isset( self::$menus[ $page_slug ] ) ) {
			return null;
		}
		return self::$menus[ $page_slug ];
	}

	/**
	 * @return string
	 */
	public function main_menu_slug(): string {
		return self::$admin_plugin_main_page->get_menu_slug();
	}


}
