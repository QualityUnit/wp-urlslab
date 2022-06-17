<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-related-resources';

	private string $widget_title = 'Related Resources';

	private string $widget_description = 'Urlslab Widget Related Resources - show contextually related pages';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Url_Data_Fetcher $url_data_fetcher;

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $url_data_fetcher ) {
		$this->url_data_fetcher = $url_data_fetcher;
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

	public function load_widget_page() {
		//Nothing to show
	}

	public function widget_admin_load() {
		//Nothing to show
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Related Resources';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Related Resources';
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );
		global $wpdb;

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => get_current_page_url()->get_url(),
				'related-count'           => 8,
				'show-image'          => false,
				'default-image'   => '',
			),
			$atts,
			$tag
		);

		$result = $this->url_data_fetcher->fetch_related_urls_to(
			$urlslab_atts['url'],
			$urlslab_atts['related-count']
		);

		if ( ! empty( $result ) ) {
			$content = $this->render_shortcode_header();
			foreach ( $result as $url ) {
				$content .= $this->render_shortcode_item( $url, $urlslab_atts );
			}
			return $content . $this->render_shortcode_footer();
		}
		return '';
	}

	public function has_shortcode(): bool {
		return true;
	}

	private function render_shortcode_header(): string {
		return '<ul>';
	}

	private function render_shortcode_footer(): string {
		return '</ul>';
	}

	private function render_shortcode_item( Urlslab_Url_Data $url, array $urlslab_atts ): string {
		return '<li urlslab-skip="true">' .
			'<a href="' . esc_url( urlslab_get_current_page_protocol() . $url->get_url()->get_url() ) . '"' .
			' title="' . esc_attr( $url->get_url_summary_text() ) . '"' .
			( urlslab_is_same_domain_url( $url->get_url()->get_url() ) ? '' : ' target="_blank"' ) .
			'urlslab-skip="true">' .
			$this->render_screenshot( $url, $urlslab_atts ) .
			esc_html( $url->get_url_title() ) .
			'</a>' .
			'</li>';
	}

	private function render_screenshot( Urlslab_Url_Data $url, array $urlslab_atts ): string {
		if ( ( $urlslab_atts['show-image'] === true || $urlslab_atts['show-image'] == 'true' )
			 && $url->screenshot_exists() ) {
			return '<img alt="' .
				esc_attr( $url->get_url_summary_text() ) .
				'" src="' . $url->render_screenshot_path( 'thumbnail' ) . '">';
		}
		return '';
	}

}
