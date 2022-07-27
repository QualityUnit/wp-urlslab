<?php

class Urlslab_Dashboard_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-dashboard';
		$this->page_title = 'Dashboard';
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Dashboard',
			'Dashboard',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
		add_action( "load-$hook", array( $this, 'on_screen_load' ) );
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function get_page_title(): string {
		return $this->page_title;
	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-dashboard.php';
	}

	public function get_page_tabs(): array {
		return array();
	}

	public function get_active_page_tab(): string {
		return '';
	}

	public function on_page_load( string $action, string $component ) {}

	public function on_screen_load() {}

	public function render_subpage() {}
}
