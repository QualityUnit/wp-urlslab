<?php

class Urlslab_Link_Management_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private string $subpage_slug;

	public function __construct( $parent_page ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'link-management';
	}

	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] ) {

			//# Widget Settings
			if ( isset( $_POST['submit'] ) &&
				'Save Changes' === $_POST['submit'] ) {
				check_admin_referer( 'link-management-settings' );

				$saving_opt = array();
				if ( isset( $_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] ) &&
				! empty( $_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] ) ) {
					$saving_opt[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] =
						$_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ];
				}

				if ( isset( $_POST['link-management'] ) ) {
					foreach ( $_POST['link-management'] as $setting_widget ) {
						$saving_opt[ $setting_widget ] = true;
					}
				}

				Urlslab_Link_Enhancer::update_settings( $saving_opt );
				wp_safe_redirect(
					$this->parent_page->menu_page(
						$this->subpage_slug,
						array(
							'status' => 'success',
							'urlslab-message' => 'Link management setting saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			}
			//# Widget Settings

		}
	}

	public function render_manage_buttons() {}

	public function render_tables() {}

	public function render_modals() {}

	public function render_settings() {
	}

	public function set_table_screen_options() {}

}
