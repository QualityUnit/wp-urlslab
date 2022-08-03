<?php

class Urlslab_Offloader_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-media-offloader';
		$this->page_title = 'Media Offloader';
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
			'Urlslab Media Offloader',
			'Media Offloader',
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
			'media-offloader' => 'Media Offloader',
		);
	}

	public function get_page_title(): string {
		return $this->page_title;

	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-feature-manager.php';
	}

	public function get_active_page_tab(): string {
		return 'media-offloader';
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}
}
