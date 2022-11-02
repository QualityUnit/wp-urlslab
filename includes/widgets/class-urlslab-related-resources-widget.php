<?php

// phpcs:disable WordPress

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->widget_slug        = 'urlslab-related-resources';
		$this->widget_title       = 'Related Resources';
		$this->widget_description = 'Configure widget to show contextually similar pages to any of your pages to build internal link building';
		$this->landing_page_link  = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
		$this->url_data_fetcher   = $url_data_fetcher;
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}

	public function hook_callback() {
		add_shortcode( $this->widget_slug, array( $this, 'get_shortcode_content' ) );
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
		return $this->widget_title . ' Widget';
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

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );
		global $wpdb;

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => urlslab_add_current_page_protocol( $this->get_current_page_url()->get_url() ),
				'related-count' => 8,
				'show-image'    => false,
				'default-image' => '',
			),
			$atts,
			$tag
		);

		$result = $this->url_data_fetcher->fetch_related_urls_to(
			new Urlslab_Url( $urlslab_atts['url'] ),
			$urlslab_atts['related-count']
		);

		if ( ! empty( $result ) ) {
			$content  = $this->render_shortcode_header();
			$strategy = get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
			foreach ( $result as $url ) {
				$content .= $this->render_shortcode_item( $url, $urlslab_atts, $strategy );
			}

			return $content . $this->render_shortcode_footer();
		}

		return '';
	}

	public function has_shortcode(): bool {
		return true;
	}

	private function render_shortcode_header(): string {
		return '<ul class="urlslab-skip">';
	}

	private function render_shortcode_footer(): string {
		return '</ul>';
	}

	private function render_shortcode_item( Urlslab_Url_Data $url, array $urlslab_atts, $strategy ): string {
		$title = $url->get_url_title();
		if ( empty( $title ) ) {
			return '';
		}

		return '<li>' .
			   '<a href="' . esc_url( urlslab_add_current_page_protocol( $url->get_url()->get_url() ) ) . '"' .
			   ' title="' . esc_attr( $url->get_url_summary_text( $strategy ) ) . '"' .
			   ( $url->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
			   '>' .
			   $this->render_screenshot( $url, $urlslab_atts, $strategy ) .
			   esc_html( $title ) .
			   '</a>' .
			   '</li>';
	}

	private function render_screenshot( Urlslab_Url_Data $url, array $urlslab_atts, $strategy ): string {
		if (
			( $urlslab_atts['show-image'] === true || $urlslab_atts['show-image'] == 'true' )
			&& $url->screenshot_exists()
		) {
			return '<img alt="' .
				   esc_attr( $url->get_url_summary_text( $strategy ) ) .
				   '" src="' . $url->render_screenshot_path( 'thumbnail' ) . '">';
		}

		return '';
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/related-resource-widget-demo.png' ) . 'related-resource-widget-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'related-resource';
	}

	public static function update_settings( array $new_settings ) {}
}
