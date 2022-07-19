<?php

interface Urlslab_Admin_Page {

	/**
	 * @return void
	 */
	public function on_menu_load();

	/**
	 * @param string $parent_slug
	 *
	 * @return void
	 */
	public function register_submenu( string $parent_slug );

	/**
	 * @return string
	 */
	public function get_menu_slug(): string;

	/**
	 * @return mixed
	 */
	public function load_page();

}
