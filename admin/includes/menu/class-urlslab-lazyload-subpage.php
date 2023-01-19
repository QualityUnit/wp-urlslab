<?php

class Urlslab_Lazyload_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;

	/**
	 * @param Urlslab_Admin_Page $parent_page
	 */
	public function __construct( Urlslab_Admin_Page $parent_page ) {
		$this->parent_page = $parent_page;
	}


	public function render_manage_buttons() {}

	public function render_tables() {}

	public function render_modals() {}

	public function set_table_screen_options() {}

	public function handle_action() {
	}
}
