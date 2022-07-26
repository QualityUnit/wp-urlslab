<?php

class Urlslab_Image_Seo_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-image-seo-widgets';
		$this->page_title = 'Image SEO Widgets';
	}

	public function on_page_load( string $action, string $component ) {
		// TODO: Implement on_menu_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Image SEO Widgets',
			'Image SEO Widgets',
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
		// TODO: Implement load_page() method.
	}

	public function get_page_tabs(): array {
		return array();
	}

	public function get_active_page_tab(): string {
		return '';
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}
}
