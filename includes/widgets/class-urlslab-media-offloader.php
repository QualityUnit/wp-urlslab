<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

class Urlslab_Media_Offloader_Widget extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-media-offloader';

	private string $widget_title = 'Media Offloader';

	private string $widget_description = 'Offload media files from local directory to database or S3';

	private string $landing_page_link = 'https://www.urlslab.com';

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_filter( 'wp_handle_upload_prefilter', $this, 'handle_upload_prefilter', 10, 1 );
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return 'Urlslab ' . $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function load_widget_page() {
		?>
		<div class="wrap">
			<h2>Media offloader</h2>

		</div>
		<?php
	}

	public function widget_admin_load() {

	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Media Offloader';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Media Offloader';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function handle_upload_prefilter( $file ) {
		return $file;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

}
