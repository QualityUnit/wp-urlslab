<?php

class Urlslab_Urls_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private Urlslab_Screenshot_Table $screenshot_table;

	public function __construct() {
		$this->menu_slug  = 'urlslab-urls';
		$this->page_title = 'URLS';
	}

	public function init_ajax_hooks( Urlslab_Loader $urlslab_loader ) {
		$urlslab_loader->add_action( 'wp_ajax_urlslab_url_backlink_fetch', $this, 'url_backlink_fetch' );
    }

    public function url_backlink_fetch() {
        
    }

	/**
	 * @param string $action
	 * @param string $component
	 *
	 * @return void
	 */
	public function on_page_load( string $action, string $component ) {}

	/**
	 * @return void after rendering of menu and fetch of user options
	 */
	public function on_screen_load() {
		//# Table configuration of the URLs
		$option = 'per_page';
		$args = array(
			'label' => 'Urls',
			'default' => 50,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->screenshot_table = new Urlslab_Screenshot_Table();
		//# Table configuration of the URLs
	}

	/**
	 * @return void render screenshot table
	 */
	public function render_screenshot_table() {
		?>
		<div class="wrap">
			<form method="get">
				<?php
				$this->screenshot_table->views();
				$this->screenshot_table->prepare_items();
				?>
				<input type="hidden" name="page" value="<?php echo esc_attr( $this->menu_slug ); ?>">
				<?php
				$this->screenshot_table->search_box( 'Search', 'urlslab-screenshot-input' );
				$this->screenshot_table->display();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * @param string $parent_slug
	 *
	 * @return void creates the submenu and loading action of page
	 */
	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Urls',
			'Urls',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
		add_action( "load-$hook", array( $this, 'on_screen_load' ) );
	}

	public function get_page_tabs(): array {
		return array(
			'urls' => 'Urls',
		);
	}

	/**
	 * @return string
	 */
	public function get_active_page_tab(): string {
		$active_tab = 'urls';
		if ( isset( $_GET['tab'] ) ) {
			$active_tab = $_GET['tab'];
		}
		return $active_tab;
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function get_page_title(): string {
		return $this->page_title;
	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-urls.php';
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}
}
