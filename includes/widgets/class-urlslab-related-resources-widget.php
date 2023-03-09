<?php

// phpcs:disable WordPress

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {
	const SLUG = 'urlslab-related-resources';

	const SETTING_NAME_UPDATE_FREQ = 'urlslab-rel-res-update-freq';
	const SETTING_NAME_RELATED_RESOURCES_SCHEDULING = 'urlslab-rel-res-scheduling';


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}

	public function hook_callback() {
		add_shortcode( $this->get_widget_slug(), array( $this, 'get_shortcode_content' ) );
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Related_Resources_Widget::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Related Resources' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( '[SEO] Connect pages within content cluster with Related Resources widget to link contextually similar pages' );
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => $this->get_current_page_url()->get_url_with_protocol(),
				'related-count' => 8,
				'show-image'    => false,
				'show-summary'  => false,
				'default-image' => '',
			),
			$atts,
			$tag
		);

		try {
			$current_url = new Urlslab_Url( $urlslab_atts['url'] );
			$result      = $this->load_related_urls( $current_url->get_url_id(), $urlslab_atts['related-count'] );
			$content     = '';

			if ( ! empty( $result ) && is_array( $result ) ) {
				$content  .= $this->render_shortcode_header();
				$strategy = get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
				foreach ( $result as $url ) {
					$content .= $this->render_shortcode_item( $url, $urlslab_atts, $strategy );
				}

				$content .= $this->render_shortcode_footer();
			}
		} catch ( Exception $e ) {
		}

		return $content;
	}

	private function load_related_urls( string $url_id, int $limit ): array {
		global $wpdb;
		$urls_table         = URLSLAB_URLS_TABLE;
		$related_urls_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$q                  = "SELECT u.* FROM $related_urls_table r INNER JOIN $urls_table as u ON r.destUrlMd5 = u.urlMd5 WHERE r.srcUrlMd5 = %d AND u.visibility = '%s' ORDER BY r.pos LIMIT %d";

		return $wpdb->get_results( $wpdb->prepare( $q, $url_id, Urlslab_Url_Row::VISIBILITY_VISIBLE, $limit ), ARRAY_A ); // phpcs:ignore
	}


	public function has_shortcode(): bool {
		return true;
	}

	private function render_shortcode_header(): string {
		return '<div class="urlslab-rel-res-items urlslab-skip-all">';
	}

	private function render_shortcode_footer(): string {
		return '</div>';
	}

	private function render_shortcode_item( array $url, array $urlslab_atts, $strategy ): string {
		$url_obj = new Urlslab_Url_Row( $url );
		if ( ! $url_obj->is_visible() ) {
			return '';
		}

		$title = $url_obj->get( 'urlTitle' );
		if ( empty( $title ) ) {
			return '';
		}

		return '<div class="urlslab-rel-res-item">' .
			   '<a href="' . esc_url( $url_obj->get_url()->get_url_with_protocol() ) . '"' .
			   ' title="' . esc_attr( $url_obj->get_summary( $strategy ) ) . '"' .
			   ( $url_obj->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
			   '>' .
			   $this->render_screenshot( $url_obj, $urlslab_atts, $strategy ) .
			   '<div class="urlslab-rel-res-item-text"><p class="urlslab-rel-res-item-title">' . esc_html( $title ) . '</p>' .
			   ( false !== $urlslab_atts['show-summary'] ? '<p  class="urlslab-rel-res-item-summary">' . esc_html( $url_obj->get_summary( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) ) . '</p>' : '' ) .
			   '</div></a>' .
			   '</div>';
	}

	private function render_screenshot( Urlslab_Url_Row $url, array $urlslab_atts, $strategy ): string {
		if ( false !== $urlslab_atts['show-image'] ) {
			if ( ! empty( $url->get_screenshot_url( 'thumbnail' ) ) ) {
				return '<div class="urlslab-rel-res-item-screenshot"><img alt="' . esc_attr( $url->get_summary( $strategy ) ) . '" src="' . $url->get_screenshot_url( 'thumbnail' ) . '"></div>';
			} else if ( ! empty( $urlslab_atts['default-image'] ) ) {
				return '<div class="urlslab-rel-res-item-screenshot urlslab-rel-res-item-default-image"><img src="' . $urlslab_atts['default-image'] . '"></div>';
			}
		}

		return '';
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_UPDATE_FREQ,
			2419200,
			false,
			__( 'Update frequency' ),
			__( 'Define how often should be updated semantic relation between URLs from www.urlslab.com. If your website is changing daily, we recommend shorter periods. If your website change just time to time, even yearly updates should be fine for you.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400     => __( 'Daily' ),
				604800    => __( 'Weekly' ),
				2419200   => __( 'Monthly' ),
				7257600   => __( 'Quarterly' ),
				31536000  => __( 'Yearly' ),
				999999999 => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
		);
		$this->add_option_definition(
			self::SETTING_NAME_RELATED_RESOURCES_SCHEDULING,
			'all',
			false,
			__( 'Update strategy' ),
			__( 'Choose when will WP update relations between urls' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				'all'       => __( 'Periodic updates for all urls' ),
				'shortcode' => __( 'Update just relations for urls where we use Related Resources shortcode.' ),
			),
		);
	}
}
