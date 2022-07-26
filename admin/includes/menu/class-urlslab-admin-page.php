<?php

abstract class Urlslab_Admin_Page {

	/**
	 * @return void
	 */
	abstract public function on_page_load( string $action, string $component);

	/**
	 * @return void
	 */
	abstract public function on_screen_load();

	/**
	 * @param string $parent_slug
	 *
	 * @return void
	 */
	abstract public function register_submenu( string $parent_slug );

	/**
	 * @return string
	 */
	abstract public function get_menu_slug(): string;

	/**
	 * @return array
	 */
	abstract public function get_page_tabs(): array;

	/**
	 * @return string
	 */
	abstract public function get_page_title(): string;

	/**
	 * @return mixed
	 */
	abstract public function load_page();

	/**
	 * @return string
	 */
	abstract public function get_active_page_tab(): string;

	/**
	 * @param string $tab_slug
	 *
	 * @return string
	 */
	public function get_tab_link( string $tab_slug ): string {
		$url = urlslab_admin_menu_page_url( $this->get_menu_slug() );
		if ( ! empty( $tab_slug ) ) {
				$url = add_query_arg( array( 'tab' => $tab_slug ), $url );
		}
		return $url;
	}

}
