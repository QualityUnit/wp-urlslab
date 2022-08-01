<?php

class Urlslab_UI_Elements_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-ui-elements';
		$this->page_title = 'UI Elements';
	}

	public function on_page_load( string $action, string $component ) {
		// TODO: Implement on_page_load() method.
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab UI Elements',
			'UI Elements',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
		add_action( "load-$hook", array( $this, 'on_screen_load' ) );
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function get_page_tabs(): array {
		return array(
			'screenshot-widget' => 'Screenshot',
		);
	}

	public function get_page_title(): string {
		return $this->page_title;
	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-ui-elements.php';
	}

	public function get_active_page_tab(): string {
		$active_tab = 'screenshot-widget';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}
}
