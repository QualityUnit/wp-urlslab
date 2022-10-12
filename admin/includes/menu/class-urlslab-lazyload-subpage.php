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

	public function render_settings() {
		$settings = array(
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Lazy_Loading::SETTING_NAME_IMG_LAZY_LOADING,
				'Enable/Disable lazy loading for Images in your pages',
				'Image Lazy Loading',
				get_option( Urlslab_Lazy_Loading::SETTING_NAME_IMG_LAZY_LOADING, false )
			),
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Lazy_Loading::SETTING_NAME_VIDEO_LAZY_LOADING,
				'Enable/Disable lazy loading for Videos in your pages',
				'Video Lazy Loading',
				get_option( Urlslab_Lazy_Loading::SETTING_NAME_VIDEO_LAZY_LOADING, false )
			),
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING,
				'Enable/Disable lazy loading for Youtube Videos in your pages',
				'Youtube Lazy Loading',
				get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_LAZY_LOADING, false )
			),
			new Urlslab_Setting_Input(
				'password',
				Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY,
				get_option( Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY, '' ),
				'Youtube API Key is used to cache video preview images localy and serve them on place of youtube code. Leave empty to load the key from environment variable YOUTUBE_API_KEY.',
				'Youtube API Key',
				'Youtube API Key'
			),
		);
		?>
		<form method="post" action="<?php echo esc_url( $this->parent_page->menu_page( 'lazy-load', 'action=update-lazy-loading-settings', 1 ) ); ?>">
			<?php wp_nonce_field( 'lazy-loading-update' ); ?>
			<h3>Lazy Loading</h3>
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
		<?php
	}

	public function set_table_screen_options() {}

	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] and
			 isset( $_POST['submit'] ) and
			 isset( $_GET['action'] ) and
			 'update-lazy-loading-settings' == $_GET['action'] ) {
			//# Edit Lazy Loading
			check_admin_referer( 'lazy-loading-update' );

			if ( 'Save Changes' === $_POST['submit'] ) {
				$saving_opt = array();
				if ( isset( $_POST['lazy-loading'] ) ) {
					foreach ( $_POST['lazy-loading'] as $image_opt_setting ) {
						$saving_opt[ $image_opt_setting ] = true;
					}
				}
				if ( isset( $_POST[ Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY ] ) ) {
					$saving_opt[ Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY ] =
						$_POST[ Urlslab_Lazy_Loading::SETTING_NAME_YOUTUBE_API_KEY ];
				}

				Urlslab_Lazy_Loading::update_settings( $saving_opt );


				wp_safe_redirect(
					$this->parent_page->menu_page(
						'lazy-load',
						array(
							'status' => 'success',
							'urlslab-message' => 'Lazy Load settings was saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			}
			//# Edit Lazy Loading
		}
	}
}
