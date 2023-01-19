<?php

class Urlslab_Link_Management_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private string $subpage_slug;

	public function __construct( $parent_page ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'link-management';
	}

	public function handle_action() {
	}

	public function render_manage_buttons() {}

	public function render_tables() {}

	public function render_modals() {}

	public function set_table_screen_options() {}

}
