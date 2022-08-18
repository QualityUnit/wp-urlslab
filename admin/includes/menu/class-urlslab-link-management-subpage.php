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
		$current_replacement_strategy = get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
		$settings = array(
			new Urlslab_Setting_Switch(
				'link-management[]',
				Urlslab_Link_Enhancer::SETTING_NAME_REMOVE_LINKS,
				'Hide the links you want from any of your pages',
				'Hide Links',
				get_option( Urlslab_Link_Enhancer::SETTING_NAME_REMOVE_LINKS, Urlslab_Link_Enhancer::SETTING_DEFAULT_REMOVE_LINKS )
			),
			new Urlslab_Setting_Switch(
				'link-management[]',
				Urlslab_Link_Enhancer::SETTING_NAME_URLS_MAP,
				'Get data of which pages are linking to each other',
				'Track Internal links',
				get_option(
					Urlslab_Link_Enhancer::SETTING_NAME_URLS_MAP,
					Urlslab_Link_Enhancer::SETTING_DEFAULT_URLS_MAP
				)
			),
			new Urlslab_Setting_Option(
				Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
				array(
					array(
						'value' => Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY,
						'is_selected' => Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY == $current_replacement_strategy,
						'option_name' => 'Generate descriptions with summaries',
					),
					array(
						'value' => Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION,
						'is_selected' => Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION == $current_replacement_strategy,
						'option_name' => 'Generate descriptions with meta description',
					),
					array(
						'value' => Urlslab_Link_Enhancer::DESC_TEXT_TITLE,
						'is_selected' => Urlslab_Link_Enhancer::DESC_TEXT_TITLE == $current_replacement_strategy,
						'option_name' => 'Generate descriptions with Url title',
					),
					array(
						'value' => Urlslab_Link_Enhancer::DESC_TEXT_URL,
						'is_selected' => Urlslab_Link_Enhancer::DESC_TEXT_URL == $current_replacement_strategy,
						'option_name' => 'Generate descriptions with Url path',
					),
				),
				'Specify which data should be used to enhance your links automatically',
				'Description generation'
			),
		);

		?>
		<div>
			<form method="post" action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=update-settings', 1 ) ); ?>">
				<?php wp_nonce_field( 'link-management-settings' ); ?>
				<?php 
				foreach ( $settings as $setting ) {
					$setting->render_setting();
				}
				?>
				<p>
					<input
							type="submit"
							name="submit"
							id="save-sub-widget"
							class="urlslab-btn-primary"
							value="Save Changes">
				</p>
			</form>
		</div>
		<?php
	}

	public function set_table_screen_options() {}

}
