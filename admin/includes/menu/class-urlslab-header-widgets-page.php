<?php

class Urlslab_Header_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-header-widgets';
		$this->page_title = 'Header Widgets';
	}

	public function on_page_load( string $action, string $component ) {
		// TODO: Implement on_menu_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Header Widgets',
			'Header Widgets',
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
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-header-widgets.php';
	}

	public function get_page_tabs(): array {
		return array(
			'meta-description' => 'Meta Description',
			'meta-og' => 'Meta OG Tag',
		);
	}

	public function get_active_page_tab(): string {
		$active_tab = 'meta-description';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}
}
