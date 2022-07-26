<?php

class Urlslab_Dashboard_Page implements Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-dashboard';
		$this->page_title = 'Dashboard';
	}


	public function on_page_load( string $action, string $component ) {
		// TODO: Implement on_menu_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		add_submenu_page(
			$parent_slug,
			'Urlslab Dashboard',
			'Dashboard',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
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
}
