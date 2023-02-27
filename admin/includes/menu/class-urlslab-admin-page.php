<?php

abstract class Urlslab_Admin_Page {

	/**
	 *
	 * @return void
	 */
	abstract public function init_ajax_hooks();

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
	 * @return void renders subpages related to a specific page
	 */
	abstract public function render_subpage();

	function admin_menu_page_url( $menu_slug ): string {
		return admin_url() . 'admin.php?page=' . urlencode( $menu_slug );
	}

	/**
	 * @param string $tab
	 * @param $args
	 *
	 * @return string
	 */
	public function menu_page( string $tab = '', $args = '', $sub_tab = '' ): string {
		$args = wp_parse_args( $args, array() );
		$url  = $this->admin_menu_page_url( $this->get_menu_slug() );
		$url = remove_query_arg(
			array(
				'urlslab-message',
				'status',
			),
			$url
		);

		if ( ! empty( $tab ) ) {
			$url  = add_query_arg( array( 'tab' => $tab ), $url );
		}

		if ( ! empty( $sub_tab ) ) {
			$url = add_query_arg( array( 'sub-tab' => $sub_tab ), $url );
		}

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

}
