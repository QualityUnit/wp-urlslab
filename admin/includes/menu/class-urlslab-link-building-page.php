<?php

class Urlslab_Link_Building_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private Urlslab_Keyword_Linking_Subpage $link_building_subpage;
	private Urlslab_Related_Resource_Subpage $related_resource_subpage;
	private Urlslab_Link_Management_Subpage $link_management_subpage;

	public function __construct() {
		$this->menu_slug = 'urlslab-link-building';
		$this->page_title = 'Link Building';
		$this->link_building_subpage = new Urlslab_Keyword_Linking_Subpage(
			$this,
			new Urlslab_Url_Data_Fetcher( null )
		);
		$this->related_resource_subpage = new Urlslab_Related_Resource_Subpage(
			$this,
			new Urlslab_Url_Data_Fetcher( null )
		);
		$this->link_management_subpage = new Urlslab_Link_Management_Subpage( $this );

	}

	public function init_ajax_hooks( Urlslab_Loader $urlslab_loader ) {}

	public function on_page_load( string $action, string $component ) {

		$active_tab = $this->get_active_page_tab();
		//# Handle request for link building tab
		if ( 'keyword-linking' == $active_tab ) {
			$this->link_building_subpage->handle_action();
		}
		//# Handle request for link building tab

		//# Handle request for related resource tab
		if ( 'related-resource' == $active_tab ) {
			$this->related_resource_subpage->handle_action();
		}
		//# Handle request for related resource tab

		//# Handle request for link management tab
		if ( 'link-management' == $active_tab ) {
			$this->link_management_subpage->handle_action();
		}
		//# Handle request for link management tab

	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Content Widgets',
			'Link Building',
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
		require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-link-building.php';
	}

	public function get_page_tabs(): array {
		return array(
			'keyword-linking' => 'Keyword Linking',
			'related-resource' => 'Related Resource',
			'link-management' => 'Link Management',
		);
	}

	public function get_active_page_tab(): string {
		$active_tab = 'keyword-linking';
		if ( isset( $_GET['tab'] ) && ! empty($_GET['tab']) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		$active_tab = $this->get_active_page_tab();
		if ( 'keyword-linking' == $active_tab ) {
			$this->link_building_subpage->set_table_screen_options();
		}

		if ( 'related-resource' == $active_tab ) {
			$this->related_resource_subpage->set_table_screen_options();
		}
	}

	public function render_subpage() {
		$active_tab = $this->get_active_page_tab();
		if ( 'keyword-linking' == $active_tab ) {
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
