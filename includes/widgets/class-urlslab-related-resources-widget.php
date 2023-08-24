<?php

// phpcs:disable WordPress

use Elementor\Plugin;

class Urlslab_Related_Resources_Widget extends Urlslab_Widget {
	public const SLUG = 'urlslab-related-resources';
	private static $posts = array();

	public const SETTING_NAME_SYNC_URLSLAB = 'urlslab-relres-sync-urlslab';
	public const SETTING_NAME_SYNC_FREQ = 'urlslab-relres-update-freq';
	public const SETTING_NAME_AUTOINCLUDE_TO_CONTENT = 'urlslab-relres-autoinc';
	public const SETTING_NAME_ARTICLES_COUNT = 'urlslab-relres-count';
	public const SETTING_NAME_SHOW_IMAGE = 'urlslab-relres-show-img';
	public const SETTING_NAME_IMAGE_SIZE = 'urlslab-relres-img-size';
	public const SETTING_NAME_SHOW_SUMMARY = 'urlslab-relres-show-sum';
	public const SETTING_NAME_DEFAULT_IMAGE_URL = 'urlslab-relres-def-img';
	public const SETTING_NAME_DESIGN_TYPE = 'urlslab-relres-design-type';
	public const SETTING_NAME_AUTOINCLUDE_POST_TYPES = 'urlslab-relres-autoinc-post-types';
	const SETTING_NAME_DOMAINS = 'urlslab-relres-domains';
	const SETTING_NAME_LAST_SEEN = 'urlslab-relres-last-seen';

	// type - design
	public const DESIGN_TYPE_DEFAULT = 'default';
	public const DESIGN_TYPE_PLAIN = 'plain';

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID );
	}


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
		Urlslab_Loader::get_instance()->add_filter( 'the_content', $this, 'the_content_filter' );
	}

	public function hook_callback() {
		add_shortcode( $this->get_widget_slug(), array( $this, 'get_shortcode_content', ) );
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
		return __( 'Improve the on-page SEO and internal linking by making content cluster pairs' );
	}

	public function the_content_filter( $content ) {
		if ( is_admin() ) {
			return $content;
		}
		$shortcode_content = '';
		if ( $this->get_option( self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT ) && is_singular() ) {
			$post_types = $this->get_option( self::SETTING_NAME_AUTOINCLUDE_POST_TYPES );
			if ( empty( $post_types ) || in_array( get_post_type(), explode( ',', $post_types ) ) ) {
				$shortcode_content = $this->get_shortcode_content();
			}
		}

		return $content . $shortcode_content;
	}

	public function get_attribute_values( $atts = array(), $content = null, $tag = '' ): array {
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		return shortcode_atts(
			array(
				'url'           => Urlslab_Url::get_current_page_url()->get_url_with_protocol(),
				'related-count' => $this->get_option( self::SETTING_NAME_ARTICLES_COUNT ),
				'show-image'    => $this->get_option( self::SETTING_NAME_SHOW_IMAGE ),
				'image-size'    => $this->get_option( self::SETTING_NAME_IMAGE_SIZE ),
				'show-summary'  => $this->get_option( self::SETTING_NAME_SHOW_SUMMARY ),
				'default-image' => $this->get_option( self::SETTING_NAME_DEFAULT_IMAGE_URL ),
			),
			$atts,
			$tag
		);
	}


	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		if (
			(
				isset( $_REQUEST['action'] ) && false !== strpos( $_REQUEST['action'], 'elementor' ) ) ||
			in_array(
				get_post_status(),
				array(
					'trash',
					'auto-draft',
					'inherit',
				)
			) ||
			( class_exists( '\Elementor\Plugin' ) && Plugin::$instance->editor->is_edit_mode() )
		) {
			$html_attributes = array();
			foreach ( $this->get_attribute_values( $atts, $content, $tag ) as $id => $value ) {
				$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $value ) . '</i>"';
			}

			return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>urlslab-related-resources</b> ' . implode( ', ', $html_attributes ) . ']</div>';
		}

		$urlslab_atts = $this->get_attribute_values( $atts, $content, $tag );
		$content      = '';

		try {
			$current_url = new Urlslab_Url( $urlslab_atts['url'] );
			$result      = $this->load_related_urls( $current_url->get_url_id(), $urlslab_atts['related-count'] );

			$urls = array( $current_url );
			foreach ( $result as $row ) {
				$urls[] = new Urlslab_Url( $row['url_name'], true );
			}
			//store url objects to cache
			Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_urls( $urls );
			$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $current_url );
			if ( $current_url_obj ) {
				$current_url_obj->request_rel_schedule();
				if ( ! empty( $result ) && is_array( $result ) ) {
					$content  .= $this->render_shortcode_header( $urlslab_atts );
					$strategy = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Link_Enhancer::SLUG )->get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY );
					foreach ( $urls as $url ) {
						if ( $current_url_obj->get_url_id() != $url->get_url_id() ) {
							$url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $url );
							if ( $url_obj && $url_obj->is_visible() && $url_obj->is_http_valid() ) {
								$content .= $this->render_shortcode_item( $url_obj, $urlslab_atts, $strategy );
							}
						}
					}
					$content .= $this->render_shortcode_footer();
				}
			}
		} catch ( Exception $e ) {
		}

		return $content;
	}

	private function load_related_urls( string $url_id, int $limit ): array {
		global $wpdb;
		$urls_table         = URLSLAB_URLS_TABLE;
		$related_urls_table = URLSLAB_RELATED_RESOURCE_TABLE;
		$q                  = "SELECT DISTINCT u.url_name FROM $related_urls_table r INNER JOIN $urls_table as u ON r.dest_url_id = u.url_id WHERE r.src_url_id = %d AND r.dest_url_id <> %d AND u.visibility = '%s' AND u.http_status IN (%d, %d, %d) ORDER BY (u.url_priority * r.pos) LIMIT %d";

		return $wpdb->get_results( $wpdb->prepare( $q, $url_id, $url_id, Urlslab_Url_Row::VISIBILITY_VISIBLE, Urlslab_Url_Row::HTTP_STATUS_OK, Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED, Urlslab_Url_Row::HTTP_STATUS_PENDING, $limit ), ARRAY_A ); // phpcs:ignore
	}

	public function has_shortcode(): bool {
		return true;
	}

	private function render_shortcode_header( array $urlslab_atts ): string {
		$design_type = $this->get_option( self::SETTING_NAME_DESIGN_TYPE );
		if ( $design_type === 'default' ) {
			wp_enqueue_style( 'urlslab-related-resources', plugin_dir_url( URLSLAB_PLUGIN_DIR . 'public/build/css/urlslab_related_resources.css' ) . 'urlslab_related_resources.css', false, URLSLAB_VERSION );
		}
		$css_class = "urlslab-rel-res-items urlslab-rel-res-design-${design_type}";
		if ( ! empty( $urlslab_atts['show-image'] ) ) {
			$css_class .= ' urlslab-rel-res-items-with-image';
		}
		if ( ! empty( $urlslab_atts['show-summary'] ) ) {
			$css_class .= ' urlslab-rel-res-items-with-summary';
		}

		return '<div class="' . $css_class . '">';
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

			return '<div class="urlslab-rel-res-item urlslab-skip-keywords">' .
				   $this->render_screenshot( $url_obj, $urlslab_atts, $strategy ) .
				   '<div class="urlslab-rel-res-item-text"><p class="urlslab-rel-res-item-title">' .
				   '<a href="' . esc_url( $url_obj->get_url()->get_url_with_protocol() ) . '"' .
				   ' title="' . esc_attr( $url_obj->get_summary_text( $strategy ) ) . '"' .
				   ( $url_obj->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
				   '>' .
				   esc_html( $title ) .
				   '</a>' .
				   '</p>' .
				   ( ! empty( $summary_text ) ? '<p  class="urlslab-rel-res-item-summary">' . esc_html( $summary_text ) . '</p>' : '' ) .
				   '<a href="' . esc_url( $url_obj->get_url()->get_url_with_protocol() ) . '"' .
				   ' title="' . esc_attr( $url_obj->get_summary_text( $strategy ) ) . '" class="urlslab-rel-res-item-arrow"' .
				   ( $url_obj->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
				   '>' .
				   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="m17.856 17.056-12.16 12.16a1.507 1.507 0 0 1-2.112 0l-1.44-1.408a1.546 1.546 0 0 1 0-2.144L11.776 16 2.144 6.336c-.576-.608-.576-1.536 0-2.112l1.44-1.44a1.507 1.507 0 0 1 2.112 0l12.16 12.16a1.507 1.507 0 0 1 0 2.112z"/></svg>' .
				   '</a>' .
				   '</div>' .
				   '</div>';
		} catch ( Exception $e ) {
			//in case of invalid link
			return '';
		}
	}

	private function render_screenshot( Urlslab_Url_Row $url, array $urlslab_atts, $strategy ): string {
		if ( ! empty( $urlslab_atts['show-image'] ) ) {
			$img_url = $url->get_screenshot_url( $urlslab_atts['image-size'], true );
			if ( ! empty( $img_url ) ) {
				return '<div class="urlslab-rel-res-item-screenshot">' .
					   '<a href="' . esc_url( $url->get_url()->get_url_with_protocol() ) . '"' .
					   ' title="' . esc_attr( $url->get_summary_text( $strategy ) ) . '"' .
					   ( $url->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
					   '>' .
					   '<img alt="' . esc_attr( $url->get_summary_text( $strategy ) ) . '" src="' . $img_url . '">' .
					   '</a>' .
					   '</div>';
			} else {
				if ( ! empty( $urlslab_atts['default-image'] ) ) {
					return '<div class="urlslab-rel-res-item-screenshot urlslab-rel-res-item-default-image">' .
						   '<a href="' . esc_url( $url->get_url()->get_url_with_protocol() ) . '"' .
						   ' title="' . esc_attr( $url->get_summary_text( $strategy ) ) . '"' .
						   ( $url->get_url()->is_same_domain_url() ? '' : ' target="_blank"' ) .
						   '>' .
						   '<img src="' . $urlslab_atts['default-image'] . '">' .
						   '</a>' .
						   '</div>';
				}
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
		$this->add_options_form_section( 'sync', __( 'URLsLab Synchronization' ), __( 'The module is capable of operating independently from URLsLab service, however, you\'ll need to manually upload URL relationships. If you opt for automatic syncing, URLsLab will produce these relationships for you, updating them consistently in response to any changes to your content.' ), array( self::LABEL_PAID ) );
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_URLSLAB,
			false,
			false,
			__( 'Auto-synchronization From URLsLab' ),
			__( 'Automatically fetch and update data from the URLsLab service at a set interval.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'sync'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_FREQ,
			2419200,
			false,
			__( 'Data Synchronization Frequency' ),
			__( 'Set the interval for synchronizing relation data with the URLsLab database. Be aware that this setting doesn\'t impact the update of new relations.' ),
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
		$this->add_option_definition(
			self::SETTING_NAME_LAST_SEEN,
			7257600,
			false,
			__( 'Include Recently Visited URLs' ),
			__( 'Show only the URLs analyzed by the URLsLab service during a definite time period.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400    => __( 'Last 24 hours' ),
				604800   => __( 'Last 7 days' ),
				1209600  => __( 'Last 14 days' ),
				2419200  => __( 'Last 30 days' ),
				4838400  => __( 'Last 60 days' ),
				7257600  => __( 'Last 90 days' ),
				31556926 => __( 'Last year' ),
				0        => __( 'Any time' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'sync'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DOMAINS,
			false,
			false,
			__( 'Additional Domains' ),
			__( 'Define a list of domains for related article searches. The default setting searches only the same domain as the evaluated link. For pertinent results, ensure that domains are set for scanning by the URLsLab service.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $param ) {
				return is_string( $param );
			},
			'sync'
		);

		$this->add_options_form_section( 'autoinclude', __( 'Related Articles Configuration' ), __( 'We can auto-append related article at the end of each article, eliminating the need for a WordPress shortcode in templates.' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append Related Articles' ),
			__( 'Automatically append relevant articles to every post. Relevant articles will automatically display after the data has been processed by the URLsLab service.' ),
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
			__( 'Choose post types where Related articles will auto-append at the content\'s end. If left unconfigured, it will default to all post categories.' ),
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
		$this->add_option_definition(
			self::SETTING_NAME_DESIGN_TYPE,
			self::DESIGN_TYPE_DEFAULT,
			false,
			__( 'Design Type' ),
			__( 'Choose the type of design. In case of the plain design, you\'ll handle your own custom CSS styling.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::DESIGN_TYPE_DEFAULT => __( 'Default' ),
				self::DESIGN_TYPE_PLAIN   => __( 'Plain' ),
			),
			null,
			'autoinclude',
		);
		$this->add_option_definition(
			self::SETTING_NAME_ARTICLES_COUNT,
			8,
			true,
			__( 'Count of Related Articles' ),
			__( 'Specify the number of related article suggestions to display.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'autoinclude'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SHOW_IMAGE,
			true,
			true,
			__( 'Show Image' ),
			__( 'Specify if a screenshot of the target URL should appear in the Related articles section.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'autoinclude'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMAGE_SIZE,
			Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL,
			true,
			__( 'Image Size' ),
			__( 'Specify the default image size for screenshots in your Related Articles. ' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL  => __( 'Top Part Thumbnail (200px x 112px)' ),
				Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL            => __( 'Top Part (1358px x 642px)' ),
				Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL => __( 'Full Page Thumbnail (200px x dynamic height)' ),
				Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE           => __( 'Full Page (1358px x dynamic height)' ),
			),
			function( $value ) {
				switch ( $value ) {
					case Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL:
					case Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL:
					case Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL:
					case Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE:
						return true;
					default:
						return false;
				}
			},
			'autoinclude'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEFAULT_IMAGE_URL,
			'',
			true,
			__( 'Default Screenshot URL' ),
			__( 'Image URL for temporary image until URLsLab service creates one. Leave blank if not required.' ),
			self::OPTION_TYPE_TEXT,
			false,
			null,
			'autoinclude'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SHOW_SUMMARY,
			true,
			true,
			__( 'Show Summary Text' ),
			__( 'Specify if the Related articles section should show a text summarization of the target URL.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'autoinclude'
		);
	}
}
