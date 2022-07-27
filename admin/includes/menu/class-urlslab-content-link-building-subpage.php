<?php

class Urlslab_Content_Link_Building_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Keyword_Link_Table $keyword_table;
	private string $subpage_slug;

	public function __construct( $parent_page ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'link-building';
	}

	public function render_manage_buttons() {
		?>
		<div class="urlslab-action-container">
            <div>
                <button class="button button-primary">
                    Add Keyword
                </button>
                <a href="#ex1" rel="modal:open" class="button button-primary">
                    Import
                </a>
            </div>
            <div>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=export' ) ); ?>" target="_blank"
                   class="button export_keyword_csv">Export</a>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=clear' ) ); ?>"
                   class="button export_keyword_csv">Delete all</a>
                <a href="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=generate_sample_data' ) ); ?>"
                   class="button export_keyword_csv">Generate Sample Data</a>
            </div>
        </div>
		<?php
	}

	public function render_tables() {
		?>
		<form method="get" class="float-left">
			<?php
			$this->keyword_table->prepare_items();
			?>
			<input type="hidden" name="page" value="<?php echo esc_attr( $this->parent_page->menu_page( 'internal-linking' ) ); ?>">
			<?php
			$this->keyword_table->search_box( 'Search', 'urlslab-keyword-input' );
			$this->keyword_table->display();
			?>
		</form>
		<?php
	}

	public function render_modals() {
		?>
		<div id="ex1" class="modal">
			<h2>Import Keyword CSV</h2>
			<div>
				The CSV file should contain headers. the CSV file should include following headers:
				<ul>
					<li class="color-danger">Keyword (required)</li>
					<li class="color-danger">URL (required)</li>
					<li class="color-warning">priority (optional - defaults to 10)</li>
					<li class="color-warning">lang (optional - defaults to 'all')</li>
					<li class="color-warning">filter (optional - defaults to regular expression '.*')</li>
				</ul>
			</div>
			<form action="<?php echo esc_url( $this->parent_page->menu_page( $this->subpage_slug, 'action=import' ) ); ?>" method="post"
			      enctype="multipart/form-data">
				<?php wp_nonce_field( 'keyword-widget-import' ); ?>
				<input type="file" name="csv_file">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" id="submit" class="button import_keyword_csv" value="Import">
			</form>
		</div>
		<?php
	}

	public function set_table_screen_options() {
		$option = 'per_page';
		$args = array(
			'label' => 'Keywords',
			'default' => 50,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->keyword_table = new Urlslab_Keyword_Link_Table();
	}
}
