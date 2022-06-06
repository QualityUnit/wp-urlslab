<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {

	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 * @param string $landing_page_link
	 * @param Urlslab_Screenshot_Api $urlslab_screenshot_api
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description,
		string $landing_page_link,
		Urlslab_Screenshot_Api $urlslab_screenshot_api
	) {
		$this->widget_slug            = $widget_slug;
		$this->widget_title           = $widget_title;
		$this->widget_description     = $widget_description;
		$this->landing_page_link      = $landing_page_link;
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
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

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_url(): string {
		return $this->menu_page_url( URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php' );
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

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args           = wp_parse_args( $args, array() );
		$url            = $this->menu_page_url( $main_menu_slug );
		$url            = add_query_arg( array( 'component' => $this->widget_slug ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	public function get_shortcode_content($atts = array(), $content = null, $tag = ''): string
	{
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );
		global $wpdb;

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => $this->get_current_page_url(),
				'related-count'           => 8,
				'show-image'          => false,
				'default-image'   => '',
			),
			$atts,
			$tag
		);

		$urls_table = $wpdb->prefix . 'urlslab_urls';
		$related_urls_table = $wpdb->prefix . 'urlslab_related_urls';
		$select_sql = "SELECT u.urlName, u.domainId, u.urlId, u.screenshotDate, u.urlTitle, u.urlMetaDescription, u.urlSummary
						FROM $urls_table as u
                        INNER JOIN $related_urls_table r ON r.destUrlMd5 = u.urlMd5
						WHERE r.srcUrlMd5 = %s AND u.status='A'
						LIMIT %d";


		$result = $wpdb->get_results( $wpdb->prepare( "$select_sql",  $this->get_url_md5($urlslab_atts['url']), $urlslab_atts['related-count']), OBJECT_K); // phpcs:ignore

		if ( ! empty( $result ) ) {
			$content = $this->render_shortcode_header();
			foreach ( $result as $url ) {
				$content .= $this->render_shortcode_item($url, $urlslab_atts);
			}
			return $content . $this->render_shortcode_footer();
		}
		return '';
	}

	public function has_shortcode(): bool
	{
		return true;
	}


	private function get_current_page_url() {
		$current_url = get_permalink( get_the_ID() );
		if( is_category() ) $current_url = get_category_link( get_query_var( 'cat' ) );
		return $current_url;
	}

	private function get_url_md5($url) {
		$url_components = parse_url($url);

		if (!isset($url_components['host'])) {
			$url_components['host'] = strtolower( parse_url( get_site_url(), PHP_URL_HOST ) );
		}

		if (!isset($url_components['path'])) {
			$url_components['path'] = '';
		}

		return md5($url_components['host'] . $url_components['path'] . (isset($url_components['query']) ? '?' . $url_components['query'] : ''));
	}

	private function render_shortcode_header() {
		return '<ul>';
	}

	private function render_shortcode_footer() {
		return '</ul>';
	}

	private function render_shortcode_item(StdClass $url, array $urlslab_atts) {
		return '<li urlslab-skip="true">' .
			'<a href="' . esc_attr(urlslab_get_current_page_protocol() . $url->urlName) . '"' .
			' title="' . esc_attr(urlslab_get_url_description($url->urlSummary, $url->urlMetaDescription, $url->urlTitle, $url->urlName)) . '"' .
			(urlslab_is_same_domain_url($url->urlName) ? '' : ' target="_blank"').
			'urlslab-skip="true">' .
			$this->render_screenshot($url, $urlslab_atts) .
			esc_html($url->urlTitle) .
			'</a>' .
			'</li>';
	}

	private function render_screenshot(StdClass $url, array $urlslab_atts) {
		if ($urlslab_atts['show-image'] === true || $urlslab_atts['show-image'] == 'true') {
			return '<img alt="' .
				esc_attr(urlslab_get_url_description($url->urlSummary, $url->urlMetaDescription, $url->urlTitle, $url->urlName)) .
				'" src="aaa.jpg">';
		}
		return '';
	}

}
