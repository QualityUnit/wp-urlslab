<?php

class Urlslab_Feature_Manager_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-feature-manager';
		$this->page_title = 'Feature Manager';
	}

	public function on_page_load( string $action, string $component ) {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'GET' == $_SERVER['REQUEST_METHOD'] and
			 ( 'activate' == $action or 'deactivate' == $action ) and
			 isset( $_GET['widget'] ) ) {

			$redirect_to = $this->menu_page(
				'',
				array(
					'status' => 'failure',
					'urlslab-message' => 'Invalid request',
				)
			);

			if ( 'activate' == $action ) {
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $_GET['widget'] );
				if ( is_bool( $widget ) && ! $widget ) {
					$redirect_to = $this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'Invalid Widget',
						)
					);
				} else {
					Urlslab_User_Widget::get_instance()->activate_widget( $widget );
					$redirect_to = $this->menu_page(
						'',
						array(
							'status' => 'success',
							'urlslab-message' => 'Widget ' . $widget->get_widget_title() . ' was activated successfully',
						)
					);
				}
			}

			if ( 'deactivate' == $action ) {
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( $_GET['widget'] );
				if ( is_bool( $widget ) && ! $widget ) {
					$redirect_to = $this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'Invalid Widget',
						)
					);
				} else {
					Urlslab_User_Widget::get_instance()->deactivate_widget( $widget );
					$redirect_to = $this->menu_page(
						'',
						array(
							'status' => 'success',
							'urlslab-message' => 'Widget ' . $widget->get_widget_title() . ' was deactivated successfully',
						)
					);
				}
			}

			wp_safe_redirect( $redirect_to );
			exit();
		}

	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Feature Manager',
			'Feature Manager',
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
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-feature-manager.php';
	}

	public function get_page_tabs(): array {
		return array();
	}

	public function get_active_page_tab(): string {
		return '';
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}
}
