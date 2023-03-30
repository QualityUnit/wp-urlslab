<?php

// phpcs:disable WordPress

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {
	const SLUG = 'urlslab-related-resources';
	private static $posts = array();

	const SETTING_NAME_SYNC_URLSLAB = 'urlslab-relres-sync-urlslab';
	const SETTING_NAME_SYNC_FREQ = 'urlslab-relres-update-freq';
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

			$result  = $this->load_related_urls( $current_url->get_url_id(), $urlslab_atts['related-count'] );
			$content = '';

			$urls = array( $current_url );
			foreach ( $result as $row ) {
				$urls[] = new Urlslab_Url( Urlslab_Url::add_current_page_protocol( $row['url_name'] ) );
			}
			//store url objects to cache
			Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_urls( $urls );
			$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $current_url );
			$current_url_obj->request_rel_schedule();

			if ( ! empty( $result ) && is_array( $result ) ) {

				$content  .= $this->render_shortcode_header();
				$strategy = get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
				foreach ( $urls as $url ) {
					if ( $current_url_obj->get_url_id() != $url->get_url_id() ) {
						$url     = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $url );
						$content .= $this->render_shortcode_item( $url, $urlslab_atts, $strategy );
					}
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
		$q                  = "SELECT DISTINCT u.url_name FROM $related_urls_table r INNER JOIN $urls_table as u ON r.dest_url_id = u.url_id WHERE r.src_url_id = %d AND u.visibility = '%s' ORDER BY r.pos LIMIT %d";

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

	private function render_shortcode_item( Urlslab_Url_Row $url_obj, array $urlslab_atts, $strategy ): string {
		try {
			if ( ! $url_obj->is_visible() ) {
				return '';
			}

			$title = $url_obj->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_TITLE );

			if ( ! empty( $urlslab_atts['show-summary'] ) && Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY == $strategy ) {
				$strategy = Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION;    //if we display text of summary under link, we should use metadescription for alt text and title
			}

			$summary_text = '';
			if ( ! empty( $urlslab_atts['show-summary'] ) ) {
				$summary_text = $url_obj->get_url_summary();
				if ( empty( $summary_text ) ) {
					$summary_text = $url_obj->get_url_meta_description();
				}
			}

			return '<div class="urlslab-rel-res-item">' .
				   '<a href="' . esc_url( $url_obj->get_url()->get_url_with_protocol() ) . '"' .
				   ' title="' . esc_attr( $url_obj->get_summary_text( $strategy ) ) . '"' .
				   ( $url_obj->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
				   '>' .
				   $this->render_screenshot( $url_obj, $urlslab_atts, $strategy ) .
				   '<div class="urlslab-rel-res-item-text"><p class="urlslab-rel-res-item-title">' . esc_html( $title ) . '</p>' .
				   ( ! empty( $summary_text ) ? '<p  class="urlslab-rel-res-item-summary">' . esc_html( $summary_text ) . '</p>' : '' ) .
				   '</div></a>' .
				   '</div>';
		} catch ( Exception $e ) {
			//in case of invalid link
			return '';
		}
	}

	private function render_screenshot( Urlslab_Url_Row $url, array $urlslab_atts, $strategy ): string {
		if ( ! empty( $urlslab_atts['show-image'] ) ) {
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


	public static function get_available_post_types(): array {
		if ( ! empty( self::$posts ) ) {
			return self::$posts;
		}

		$post_types  = get_post_types(
			array(
				'show_ui'      => true,
				'show_in_menu' => true,
			),
			'objects'
		);
		self::$posts = array();
		foreach ( $post_types as $post_type ) {
			self::$posts[ $post_type->name ] = $post_type->labels->singular_name;
		}

		return self::$posts;
	}

	protected function add_options() {
		$this->add_options_form_section( 'sync', __( 'URLsLab Synchronization' ), __( 'Module can work independent of URLsLab service, but you will need to upload relations between URLs manually. If you choose automatic syncing, URLsLAb will generate relations for you and update them regullary as your content change.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_URLSLAB,
			false,
			false,
			__( 'Load data from URLsLab' ),
			__( 'Automatically load data from URLsLab and update them with defined interval. This feature require URLsLab API key.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'sync'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_FREQ,
			2419200,
			false,
			__( 'Update Data Frequency' ),
			__( 'Define how often we should sync relation data with the URLsLab database in the background. New relations will be updated independently on this setting.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400            => __( 'Daily' ),
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31556926         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'sync'
		);


		$this->add_options_form_section( 'autoinclude', __( 'Related Articles Settings' ), __( 'We can automatically include related articles at the end of each content without the need for a WordPress shortcode in custom templates.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append Related Articles to the Content' ),
			__( 'Automatically add related articles at the end of each post. Related articles will be visible automatically once the data are processed in the URLsLab service. Depending on the amount of data, it can take a few hours or days.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'autoinclude'
		);

		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_POST_TYPES,
			false,
			true,
			__( 'WordPress Post Types' ),
			__( 'Select post types to append Related articles at the end of the content. If you don\'t configure anything, it will be added to all post types automatically.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function() {
				return Urlslab_Related_Resources_Widget::get_available_post_types();
			},
			function( $value ) {
				if ( ! is_array( $value ) ) {
					return false;
				}

				$possible_values = Urlslab_Related_Resources_Widget::get_available_post_types();
				foreach ( $value as $v ) {
					if ( ! isset( $possible_values[ $v ] ) ) {
						return false;
					}
				}

				return true;
			},
			'autoinclude'
		);

		$this->add_options_form_section( 'widget', __( 'Widget Default Values' ), __( 'Choose default value for your widget. Each widget can be overwrite these values with custom settings.' ) );
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
			'widget'
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
			'widget'
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
			'widget'
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
			'widget'
		);
	}
}
