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

			self::$menus                  = array(
				$dashboard->get_menu_slug() => $dashboard,
			);
			self::$admin_plugin_main_page = $dashboard;
			self::$instance               = new self;
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

	public function init_page_ajax() {
		foreach ( self::$menus as $menu ) {
			$menu->init_ajax_hooks();
		}
	}

	public function init_on_page_loads(
		string $page_slug,
		string $action,
		string $component
	) {
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
