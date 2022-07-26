<?php

interface Urlslab_Admin_Page {

	/**
	 * @return void
	 */
	public function on_page_load( string $action, string $component);

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
	 * @return string
	 */
	public function get_page_title(): string;

	/**
	 * @return mixed
	 */
	public function load_page();

}
