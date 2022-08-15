<?php

class Urlslab_Header_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private array $sub_widgets;

	public function __construct() {
		$this->menu_slug = 'urlslab-header-seo';
		$this->page_title = 'Header SEO';
		$this->init_sub_widgets();
	}

	public function on_page_load( string $action, string $component ) {
		if ( isset( $_GET['action'] ) &&
			 'activation' == $_GET['action'] ) {
			check_admin_referer( 'sub-widget-activation' );
			if ( isset( $_POST['meta-opt'] ) ) {
				Urlslab::update_option( 'header-seo', $_POST['meta-opt'] );
				wp_safe_redirect(
					$this->menu_page(
						'meta-tags',
						array(
							'status' => 'success',
							'urlslab-message' => 'Meta tag settings saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			} else {
				Urlslab::update_option( 'header-seo', array() );
				wp_safe_redirect(
					$this->menu_page(
						'meta-tags',
						array(
							'status' => 'success',
							'urlslab-message' => 'Meta tag settings saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			}
		}
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Header SEO',
			'Header SEO',
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
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-header-widgets.php';
	}

	public function get_page_tabs(): array {
		return array(
			'meta-tags' => 'Meta Tags',
		);
	}

	public function render_widget_form() {
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'meta-tags', 'action=activation', 1 ) ); ?>">
			<h3>Meta Tags settings</h3>
			<?php wp_nonce_field( 'sub-widget-activation' ); ?>
			<div class="urlslab-setting-item">
				<div>
					<h4>Meta Description Generation</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input" type="checkbox" id="meta-desc" name="meta-opt[]" value="meta-description"
							<?php echo $this->sub_widgets['meta-description'] ? 'checked' : ''; ?>>
						<label for="meta-desc" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
						width="10px">
						Generate Meta description tag automatically from the content of webpage
					</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Meta OG Image Generation</h4>
				</div>
				<div>
					<p>
						<div class="urlslab-switch">
							<input class="urlslab-switch-input" type="checkbox" id="meta-og-image" name="meta-opt[]" value="meta-og-image"
								<?php echo $this->sub_widgets['meta-og-image'] ? 'checked' : ''; ?>>
							<label for="meta-og-image" class="urlslab-switch-label">switch</label>
						</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Generate Meta og image tag automatically from the screenshot of the webpage
					</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Meta OG Description Generation</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input" type="checkbox" id="meta-og-desc" name="meta-opt[]" value="meta-og-desc"
							<?php echo $this->sub_widgets['meta-og-desc'] ? 'checked' : ''; ?>>
						<label for="meta-og-desc" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Generate Meta og description tag automatically from the content summary of the webpage
					</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Meta OG Title Generation</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input" id="meta-og-title" type="checkbox" name="meta-opt[]" value="meta-og-title"
							<?php echo $this->sub_widgets['meta-og-title'] ? 'checked' : ''; ?>>
						<label for="meta-og-title" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Generate Meta og title tag automatically from the url title of the webpage
					</span>
				</div>
			</div>
			<p>
				<input
						type="submit"
						name="save-sub-widget"
						id="save-sub-widget"
						class="urlslab-btn-primary"
						value="Save changes">
			</p>
		</form>
		<?php
	}

	public function get_active_page_tab(): string {
		$active_tab = 'meta-tags';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}

	private function init_sub_widgets() {
		$active_sub_widget_slugs = Urlslab::get_option( 'header-seo', array() );
		$all_sub_widgets = array(
			'meta-description' => false,
			'meta-og-image' => false,
			'meta-og-desc' => false,
			'meta-og-title' => false,
		);
		if ( ! empty( $active_sub_widget_slugs ) ) {
			foreach ( $all_sub_widgets as $sub_widget_slug => $val ) {
				$this->sub_widgets[ $sub_widget_slug ] = in_array( $sub_widget_slug, $active_sub_widget_slugs );
			}
		} else {
			$this->sub_widgets = $all_sub_widgets;
		}
	}

	public function render_subpage() {}
}
