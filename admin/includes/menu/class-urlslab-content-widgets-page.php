<?php

class Urlslab_Content_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private Urlslab_Link_Building_Subpage $link_building_subpage;
	private Urlslab_Related_Resource_Subpage $related_resource_subpage;

	public function __construct() {
		$this->menu_slug = 'urlslab-content-seo';
		$this->page_title = 'Content SEO';
		$this->link_building_subpage = new Urlslab_Link_Building_Subpage( $this );
		$this->related_resource_subpage = new Urlslab_Related_Resource_Subpage(
			$this,
			new Urlslab_Url_Data_Fetcher( null )
		);

	}

	public function on_page_load( string $action, string $component ) {

		//# Handle request for link building tab
		if ( ( ! isset( $_REQUEST['tab'] ) ) or ( 'link-building' == $_REQUEST['tab'] ) ) {
			$this->link_building_subpage->handle_action();
		}
		//# Handle request for link building tab

		//# Handle request for related resource tab
		if ( isset( $_REQUEST['tab'] ) and 'related-resource' == $_REQUEST['tab'] ) {
			$this->related_resource_subpage->handle_action();
		}
		//# Handle request for related resource tab

	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Content Widgets',
			'Content SEO',
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
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-content-widgets.php';
	}

	public function get_page_tabs(): array {
		return array(
			'link-building' => 'Link Building',
			'related-resource' => 'Related Resource',
			'link-enhancer' => 'Link Enhancer',
		);
	}

	public function get_active_page_tab(): string {
		$active_tab = 'link-building';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		$active_tab = $this->get_active_page_tab();
		if ( 'link-building' == $active_tab ) {
			$this->link_building_subpage->set_table_screen_options();
		}

		if ( 'related-resource' == $active_tab ) {
			$this->related_resource_subpage->set_table_screen_options();
		}
	}

	public function render_subpage() {
		$active_tab = $this->get_active_page_tab();
		if ( 'link-building' == $active_tab ) {
			$this->link_building_subpage->render_manage_buttons();
			$this->link_building_subpage->render_tables();
			$this->link_building_subpage->render_modals();
		}

		if ( 'related-resource' == $active_tab ) {
			$this->related_resource_subpage->render_manage_buttons();
			$this->related_resource_subpage->render_tables();
			$this->related_resource_subpage->render_modals();
		}
	}
}
