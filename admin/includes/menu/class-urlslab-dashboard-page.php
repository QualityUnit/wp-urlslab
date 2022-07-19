<?php

class Urlslab_Dashboard_Page implements Urlslab_Admin_Page {

	private string $menu_slug;

	public function __construct() {
		$this->menu_slug = 'urlslab-dashboard';
	}


	public function on_menu_load() {
		// TODO: Implement on_menu_load() method.
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
		add_action( "load-$hook", array( $this, 'on_menu_load' ) );
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function load_page() {
		echo 'hi';
		// TODO: Implement load_page() method.
	}
}
