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

	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	/**
	 * @param Urlslab_Screenshot_Api $urlslab_screenshot_api
	 */
	public function __construct( Urlslab_Screenshot_Api $urlslab_screenshot_api ) {
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
				$content .= $this->render_shortcode_item( $url, $urlslab_atts );
			}
			return $content . $this->render_shortcode_footer();
		}
		return '';
	}

	public function has_shortcode(): bool {
		return true;
	}


	private function get_current_page_url() {
		$current_url = get_permalink( get_the_ID() );
		if ( is_category() ) {
			$current_url = get_category_link( get_query_var( 'cat' ) );
		}
		return $current_url;
	}

	private function get_url_md5( $url ) {
		$url_components = parse_url( $url );

		if ( ! isset( $url_components['host'] ) ) {
			$url_components['host'] = strtolower( parse_url( get_site_url(), PHP_URL_HOST ) );
		}

		if ( ! isset( $url_components['path'] ) ) {
			$url_components['path'] = '';
		}

		return md5( $url_components['host'] . $url_components['path'] . ( isset( $url_components['query'] ) ? '?' . $url_components['query'] : '' ) );
	}

	private function render_shortcode_header(): string {
		return '<ul>';
	}

	private function render_shortcode_footer(): string {
		return '</ul>';
	}

	private function render_shortcode_item( StdClass $url, array $urlslab_atts ): string {
		return '<li urlslab-skip="true">' .
			'<a href="' . esc_url( urlslab_get_current_page_protocol() . $url->urlName ) . '"' .
			' title="' . esc_attr( urlslab_get_url_description( $url->urlSummary, $url->urlMetaDescription, $url->urlTitle, $url->urlName ) ) . '"' .
			( urlslab_is_same_domain_url( $url->urlName ) ? '' : ' target="_blank"' ) .
			'urlslab-skip="true">' .
			$this->render_screenshot( $url, $urlslab_atts ) .
			esc_html( $url->urlTitle ) .
			'</a>' .
			'</li>';
	}

	private function render_screenshot( StdClass $url, array $urlslab_atts ): string {
		if ( $urlslab_atts['show-image'] === true || $urlslab_atts['show-image'] == 'true' ) {
			return '<img alt="' .
				esc_attr( urlslab_get_url_description( $url->urlSummary, $url->urlMetaDescription, $url->urlTitle, $url->urlName ) ) .
				'" src="aaa.jpg">';
		}
		return '';
	}

}
