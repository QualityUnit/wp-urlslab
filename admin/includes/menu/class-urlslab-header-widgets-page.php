<?php

class Urlslab_Header_Widgets_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-header-seo';
		$this->page_title = 'Header SEO';
	}

	public function on_page_load( string $action, string $component ) {

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
		<form method="post" action="<?php echo esc_url( $this->menu_slug( 'meta-tags', 'action=activation' ) ); ?>">
			<input type="checkbox" name="meta-opt" value="meta-description">
			Meta Description Generation <br>
			<input type="checkbox" name="meta-opt" value="meta-og-image">
			Meta OG Image Generation <br>
			<input type="checkbox" name="meta-opt" value="meta-og-desc">
			Meta OG Description Generation <br>
			<input type="checkbox" name="meta-opt" value="meta-og-title">
			Meta OG Title Generation
			<?php
			submit_button( 'Save changes', 'small', 'save-meta-tags' );
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
}
