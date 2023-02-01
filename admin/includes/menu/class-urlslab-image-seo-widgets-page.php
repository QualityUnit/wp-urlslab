<?php

class Urlslab_Image_Seo_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-image-seo';
		$this->page_title = 'Image SEO';
	}

	public function init_ajax_hooks() {}

	public function on_page_load( string $action, string $component ) {
		// TODO: Implement on_menu_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Image SEO Widgets',
			'Image SEO',
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
		require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-image-seo-widgets.php';
	}

	public function get_page_tabs(): array {
		return array(
			'image-alt-text' => 'Image Alt Text',
		);
	}

	public function get_active_page_tab(): string {
		$active_tab = 'image-alt-text';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}
}
