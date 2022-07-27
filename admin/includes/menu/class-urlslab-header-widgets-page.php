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
		if ( isset( $_POST['meta-opt'] ) ) {
			check_admin_referer( 'sub-widget-activation' );
			Urlslab::update_option( 'header-seo', $_POST['meta-opt'] );
			wp_safe_redirect(
				$this->menu_page(
					'meta-tags',
					array(
						'status' => 'success',
					)
				)
			);
			exit;
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
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'meta-tags', 'action=activation' ) ); ?>">
			<?php wp_nonce_field( 'sub-widget-activation' ); ?>
			<input type="checkbox" id="meta-desc" name="meta-opt[]" value="meta-description"
				<?php echo $this->sub_widgets['meta-description'] ? 'checked' : ''; ?>>
			<label for="meta-desc">Meta Description Generation</label> <br>
			<input type="checkbox" id="meta-og-image" name="meta-opt[]" value="meta-og-image"
				<?php echo $this->sub_widgets['meta-og-image'] ? 'checked' : ''; ?>>
			<label for="meta-og-image">Meta OG Image Generation</label> <br>
			<input type="checkbox" id="meta-og-desc" name="meta-opt[]" value="meta-og-desc"
				<?php echo $this->sub_widgets['meta-og-desc'] ? 'checked' : ''; ?>>
			<label for="meta-og-desc">Meta OG Description Generation</label> <br>
			<input type="checkbox" name="meta-opt[]" value="meta-og-title"
				<?php echo $this->sub_widgets['meta-og-title'] ? 'checked' : ''; ?>>
			<label for="meta-og-title">Meta OG Title Generation</label> <br>
			<?php
			submit_button( 'Save changes', 'small', 'save-sub-widget' );
			?>
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
}
