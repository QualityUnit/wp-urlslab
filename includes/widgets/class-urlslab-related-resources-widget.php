<?php

// phpcs:disable WordPress

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {
	const SLUG = 'urlslab-related-resources';

	const SETTING_NAME_UPDATE_FREQ = 'urlslab-relres-update-freq';
	const SETTING_NAME_AUTOINCLUDE_TO_CONTENT = 'urlslab-relres-autoinc';
	const SETTING_NAME_ARTICLES_COUNT = 'urlslab-relres-count';
	const SETTING_NAME_SHOW_IMAGE = 'urlslab-relres-show-img';
	const SETTING_NAME_SHOW_SUMMARY = 'urlslab-relres-show-sum';
	const SETTING_NAME_DEFAULT_IMAGE_URL = 'urlslab-relres-def-img';
	const SETTING_NAME_AUTOINCLUDE_POST_TYPES = 'urlslab-relres-autoinc-post-types';


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
		Urlslab_Loader::get_instance()->add_filter( 'the_content', $this, 'the_content_filter' );
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
		return __( 'Related Articles' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Enhance the onsite SEO and internal link structure by creating pairs of content clusters' );
	}

	public function the_content_filter( $content ) {
		$shortcode_content = '';
		if ( $this->get_option( self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT ) ) {
			$post_types = $this->get_option( self::SETTING_NAME_AUTOINCLUDE_POST_TYPES );
			if ( empty( $post_types ) || in_array( get_post_type(), explode( ',', $post_types ) ) ) {
				$shortcode_content = $this->get_shortcode_content();
			}
		}

		return $content . $shortcode_content;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		$urlslab_atts = shortcode_atts(
			array(
				'url'           => $this->get_current_page_url()->get_url_with_protocol(),
				'related-count' => $this->get_option( self::SETTING_NAME_ARTICLES_COUNT ),
				'show-image'    => $this->get_option( self::SETTING_NAME_SHOW_IMAGE ),
				'show-summary'  => $this->get_option( self::SETTING_NAME_SHOW_SUMMARY ),
				'default-image' => $this->get_option( self::SETTING_NAME_DEFAULT_IMAGE_URL ),
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
		$q                  = "SELECT u.* FROM $related_urls_table r INNER JOIN $urls_table as u ON r.dest_url_id = u.url_id WHERE r.src_url_id = %d AND u.visibility = '%s' ORDER BY r.pos LIMIT %d";

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
		try {
			$url_obj = new Urlslab_Url_Row( $url );
			if ( ! $url_obj->is_visible() ) {
				return '';
			}

			$title = $url_obj->get_url_title();
			if ( empty( $title ) ) {
				return '';
			}

			if ( false !== $urlslab_atts['show-summary'] && Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY == $strategy ) {
				$strategy = Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION;    //if we display text of summary under link, we should use metadescription for alt text and title
			}

			return '<div class="urlslab-rel-res-item">' .
				   '<a href="' . esc_url( $url_obj->get_url()->get_url_with_protocol() ) . '"' .
				   ' title="' . esc_attr( $url_obj->get_summary_text( $strategy ) ) . '"' .
				   ( $url_obj->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
				   '>' .
				   $this->render_screenshot( $url_obj, $urlslab_atts, $strategy ) .
				   '<div class="urlslab-rel-res-item-text"><p class="urlslab-rel-res-item-title">' . esc_html( $title ) . '</p>' .
				   ( false !== $urlslab_atts['show-summary'] ? '<p  class="urlslab-rel-res-item-summary">' . esc_html( $url_obj->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) ) . '</p>' : '' ) .
				   '</div></a>' .
				   '</div>';
		} catch ( Exception $e ) {
			//in case of invalid link
			return '';
		}
	}

	private function render_screenshot( Urlslab_Url_Row $url, array $urlslab_atts, $strategy ): string {
		if ( false !== $urlslab_atts['show-image'] ) {
			if ( ! empty( $url->get_screenshot_url( 'thumbnail' ) ) ) {
				return '<div class="urlslab-rel-res-item-screenshot"><img alt="' . esc_attr( $url->get_summary_text( $strategy ) ) . '" src="' . $url->get_screenshot_url( 'thumbnail' ) . '"></div>';
			} else if ( ! empty( $urlslab_atts['default-image'] ) ) {
				return '<div class="urlslab-rel-res-item-screenshot urlslab-rel-res-item-default-image"><img src="' . $urlslab_atts['default-image'] . '"></div>';
			}
		}

		return '';
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'general', __( 'Related Articles Settings' ), __( 'We can automatically include related articles at the end of each content without the need for a WordPress shortcode in custom templates.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append Related Articles to the Content' ),
			__( 'Automatically add related articles at the end of each post. Related articles will be visible automatically once the data are processed in the URLsLab service. Depending on the amount of data, it can take a few hours or days.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'general'
		);


		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_POST_TYPES,
			false,
			true,
			__( 'WordPress Post Types' ),
			__( 'Select post types to append Related articles at the end of the content. If you don\'t configure anything, it will be added to all post types automatically.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function() {
				$post_types = get_post_types(
					array(
						'show_ui'      => true,
						'show_in_menu' => true,
					),
					'objects'
				);
				$posts      = array();
				foreach ( $post_types as $post_type ) {
					$posts[ $post_type->name ] = $post_type->labels->singular_name;
				}

				return $posts;
			},
			null,
			'general'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ARTICLES_COUNT,
			8,
			true,
			__( 'The number of Related Articles' ),
			__( 'Define the number of related article items to be appended to the end of the content.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'general'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SHOW_IMAGE,
			false,
			true,
			__( 'Show Image' ),
			__( 'Define if the Related articles item should display a screenshot of the destination URL.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'general'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SHOW_SUMMARY,
			false,
			true,
			__( 'Show Summary Text' ),
			__( 'Define if the Related articles item should display a text summary of the destination URL.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'general'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_IMAGE_URL,
			'',
			true,
			__( 'Default Screenshot URL' ),
			__( 'URL of an image to be used as a screenshot until URLsLab service generates it. Leave empty if not needed.' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'general'
		);
	}
}
