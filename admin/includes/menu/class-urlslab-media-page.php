<?php

class Urlslab_Media_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private Urlslab_Media_Offloader_Subpage $media_offloader_subpage;
	private Urlslab_Lazyload_Subpage $lazyload_subpage;

	public function __construct() {
		$this->menu_slug = 'urlslab-media';
		$this->page_title = 'Media';
		$this->media_offloader_subpage = new Urlslab_Media_Offloader_Subpage( $this );
		$this->lazyload_subpage = new Urlslab_Lazyload_Subpage( $this );
	}

	public function on_page_load( string $action, string $component ) {

		$active_tab = $this->get_active_page_tab();
		//# Handle request for link building tab
		if ( 'media-offloading' == $active_tab ) {
			$this->media_offloader_subpage->handle_action();
		}
		//# Handle request for link building tab

		//# Handle request for related resource tab
		if ( 'lazy-load' == $active_tab ) {
			$this->lazyload_subpage->handle_action();
		}
		//# Handle request for related resource tab

	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Media',
			'Media',
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
		require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-media.php';
	}

	public function get_page_tabs(): array {
		return array(
			'media-offloading' => 'Media Offloading',
			'lazy-load' => 'Lazy Loading',
		);
	}

	public function get_active_page_tab(): string {
		$active_tab = 'media-offloading';
		if ( isset( $_GET['tab'] ) && ! empty( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		$active_tab = $this->get_active_page_tab();
		if ( 'media-offloading' == $active_tab ) {
			$this->media_offloader_subpage->set_table_screen_options();
		}

		if ( 'lazy-load' == $active_tab ) {
			$this->lazyload_subpage->set_table_screen_options();
		}
	}

	public function render_subpage() {
		$active_tab = $this->get_active_page_tab();
		if ( 'media-offloading' == $active_tab ) {
			$this->media_offloader_subpage->render_manage_buttons();
			$this->media_offloader_subpage->render_tables();
			$this->media_offloader_subpage->render_modals();
		}

		if ( 'lazy-load' == $active_tab ) {
			$this->lazyload_subpage->render_manage_buttons();
			$this->lazyload_subpage->render_tables();
			$this->lazyload_subpage->render_modals();
		}
	}
}
