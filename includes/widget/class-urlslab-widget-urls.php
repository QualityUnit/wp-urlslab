<?php

// phpcs:disable WordPress.NamingConventions


class Urlslab_Widget_Urls extends Urlslab_Widget {
	public const SLUG = 'urlslab-urls';
	public const DESC_TEXT_SUMMARY = 'S';
	public const DESC_TEXT_URL = 'U';
	public const DESC_TEXT_TITLE = 'T';
	public const DESC_TEXT_H1 = 'H1';
	public const DESC_TEXT_META_DESCRIPTION = 'M';

	public const SETTING_NAME_DESC_REPLACEMENT_STRATEGY = 'urlslab_desc_replacement_strategy';
	public const SETTING_NAME_REMOVE_LINKS = 'urlslab_remove_links';
	public const SETTING_NAME_VALIDATE_LINKS = 'urlslab_validate_links';
	public const SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL = 'urlslab_url_http_status_interval';
	public const SETTING_NAME_URLS_MAP = 'urlslab_urls_map';
	public const SETTING_NAME_ADD_LINK_FRAGMENT = 'urlslab_add_lnk_fragment';

	public const SETTING_NAME_ADD_ID_TO_ALL_H_TAGS = 'urlslab_H_add_id';
	public const SETTING_NAME_PAGE_ID_LINKS_TO_SLUG = 'urlslab_pid_to_slug';
	public const SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND = 'urlslab_pid_del_notfound';
	public const SETTING_NAME_MARK_AS_VALID_CURRENT_URL = 'urlslab_mark_as_valid_current_url';
	public const SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS = 'urlslab_auto_sum_int_links';
	public const SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS = 'urlslab_auto_sum_ext_links';
	const SETTING_NAME_REPLACE_3XX_LINKS = 'urlslab_replace_3xx_links';
	const SETTING_NAME_FIX_PROTOCOL = 'urlslab_fix_protocol';
	const SETTING_NAME_ADD_HREFLANG = 'urlslab_add_hreflang';
	public const SETTING_NAME_META_DESCRIPTION_GENERATION = 'urlslab_meta_description_generation';
	const SETTING_NAME_META_TITLE_GENERATION = 'urlslab_meta_title_generation';

	public const SETTING_NAME_META_OG_IMAGE_GENERATION = 'urlslab_og_image_generation';
	public const SETTING_NAME_META_OG_TITLE_GENERATION = 'urlslab_og_title_generation';

	public const SETTING_NAME_META_OG_DESC_GENERATION = 'urlslab_og_desc_generation';

	public const ADD_VALUE = 'A';
	public const REPLACE_VALUE = 'R';
	public const NO_CHANGE_VALUE = '-';
	public const TWITTER_CARD_SUMMARY_LARGE_IMAGE = 'summary_large_image';
	public const SETTING_NAME_CARD_TYPE = 'urlslab_tw_card_type';
	public const TWITTER_CARD_SUMMARY = 'summary';
	public const TWITTER_CARD_APP = 'app';
	public const TWITTER_CARD_PLAYER = 'player';
	public const SETTING_NAME_TWITTER = 'urlslab_tw';
	public const SETTING_NAME_TW_HANLDE = 'urlslab_tw_handle';
	public const SETTING_NAME_TW_CREATOR = 'urlslab_tw_creator';
	public const SETTING_NAME_TW_PLAYER = 'urlslab_tw_player';
	public const SETTING_NAME_TW_PLAYER_WIDTH = 'urlslab_tw_player_width';
	public const SETTING_NAME_TW_PLAYER_HEIGHT = 'urlslab_tw_player_height';
	public const SETTING_NAME_TW_IPHONE_NAME = 'urlslab_tw_iphone_name';
	public const SETTING_NAME_TW_IPHONE_ID = 'urlslab_tw_iphone_id';
	public const SETTING_NAME_TW_IPHONE_URL = 'urlslab_tw_iphone_url';
	public const SETTING_NAME_TW_IPAD_URL = 'urlslab_tw_ipad_url';
	public const SETTING_NAME_TW_IPAD_ID = 'urlslab_tw_ipad_id';
	public const SETTING_NAME_TW_IPAD_NAME = 'urlslab_tw_ipad_name';
	public const SETTING_NAME_TW_GOOGLEPLAY_NAME = 'urlslab_tw_googleplay_name';
	public const SETTING_NAME_TW_GOOGLEPLAY_ID = 'urlslab_tw_googleplay_id';
	public const SETTING_NAME_TW_GOOGLEPLAY_URL = 'urlslab_tw_googleplay_url';

	public const SETTING_NAME_ALT_TAG_SOURCE = 'urlslab_img_alt_tag_src';
	public const SOURCE_H = 'H';
	public const SOURCE_FIGCAPTION = 'C';
	public const SOURCE_LINK = 'L';
	const SETTING_NAME_ADD_BLANK = 'urlslab_add_blank';

	public const SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL = 'urlslab-refresh-sum';
	const SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL = 'urlslab-scr-refresh';
	const SETTING_NAME_SUMMARIZATION_FLOW = 'urlslab-summary-flow';
	const SETTING_NAME_FIX_DOUBLESLASH = 'urlslab-fix-doubleslash';

	private static $page_alternate_links = array();

	/**
	 * @var Urlslab_Data_Url[]
	 */
	private static $page_urls = array();


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 12 );

		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
		Urlslab_Loader::get_instance()->add_action( 'widgets_init', $this, 'init_wp_widget', 10, 0 );

		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'meta_tags_content_hook' );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'track_alternate_links' );
	}

	public function hook_callback() {
		add_shortcode( 'urlslab-screenshot', array( $this, 'get_screenshot_shortcode_content' ) );
	}

	public function has_shortcode(): bool {
		return true;
	}


	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID );
	}

	public function post_updated( $post_id, $post, $post_before ) {
		$url_obj = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( new Urlslab_Url( get_permalink( $post_id ), true ) );
		if ( $url_obj ) {

			if ( 'publish' === $post->post_status ) {
				//rescan page again
				$url_obj->set_http_status( Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED );
			} else {
				$url_obj->set_http_status( Urlslab_Data_Url::HTTP_STATUS_CLIENT_ERROR );
			}

			//request update of screenshot
			if ( Urlslab_Data_Url::SCR_STATUS_ACTIVE === $url_obj->get_scr_status() ) {
				$url_obj->set_scr_status( Urlslab_Data_Url::SCR_STATUS_NEW );
			}
			if ( Urlslab_Data_Url::SUM_STATUS_ACTIVE === $url_obj->get_sum_status() ) {
				$url_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_NEW );
			}

			$url_obj->update();
		}
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Urls::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'URLs', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor internal and external URLs on your site, take screenshots, etc.', 'urlslab' );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_404() ) {
			return;
		}
		$this->validateCurrentPageUrl( $document );
		$this->addIdToHTags( $document );
		$this->fixProtocol( $document );
		if ( ! is_search() ) {
			$this->fixPageIdLinks( $document );
			$this->processTitleAttribute( $document );
			$this->processLinkFragments( $document );
			$this->process_image_alt_text( $document );
		}
		$this->fixDoubleSlashesInPath( $document );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_wp_widget() {
		register_widget( 'Urlslab_Wpwidget_Screenshot' );
	}

	private function render_screenshot_shortcode(
		string $url,
		string $src,
		string $alt,
		string $width,
		string $height
	): string {
		return sprintf(
			'<div class="urlslab-screenshot-container"><img src="%s" alt="%s" width="%s" height="%s"></div>',
			esc_url( $src ),
			esc_attr( $alt ),
			esc_attr( $width ),
			esc_attr( $height ),
		);
	}


	public function get_screenshot_attribute_values( $atts = array(), $content = null, $tag = '' ) {
		$atts = array_change_key_case( (array) $atts );

		return shortcode_atts(
			array(
				'width'           => '100%',
				'height'          => '100%',
				'alt'             => 'Screenshot of page taken by FlowHunt.io',
				'default-image'   => '',
				'url'             => '',
				'screenshot-type' => Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE,
			),
			$atts,
			$tag
		);
	}

	public function get_screenshot_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		if (
			(
				isset( $_REQUEST['action'] )
				&& false !== strpos( sanitize_text_field( $_REQUEST['action'] ), 'elementor' )
			)
			|| in_array(
				get_post_status(),
				array( 'trash', 'auto-draft', 'inherit' )
			)
			|| ( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() )
		) {
			$html_attributes = array();
			foreach ( $this->get_screenshot_attribute_values( $atts, $content, $tag ) as $id => $value ) {
				$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $value ) . '</i>"';
			}

			return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>urlslab-screenshot</b> ' . implode( ', ', $html_attributes ) . ']</div>';
		}
		$urlslab_atts = $this->get_screenshot_attribute_values( $atts, $content, $tag );

		try {
			if ( ! empty( $urlslab_atts['url'] ) ) {
				$url_data = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( new Urlslab_Url( $urlslab_atts['url'] ) );

				if ( ! empty( $url_data ) ) {
					if ( empty( $url_data->get_scr_status() ) || Urlslab_Data_Url::SCR_STATUS_NOT_REQUESTED === $url_data->get_scr_status() ) {
						$url_data->set_scr_status( Urlslab_Data_Url::SCR_STATUS_NEW );
						$url_data->update();
					}
					$alt_text = $url_data->get_summary_text( Urlslab_Widget_Urls::DESC_TEXT_SUMMARY );
					if ( empty( $alt_text ) ) {
						$alt_text = $urlslab_atts['alt'];
					}

					$screenshot_url = $url_data->get_screenshot_url( $urlslab_atts['screenshot-type'], true );
					if ( empty( $screenshot_url ) ) {
						$screenshot_url = $urlslab_atts['default-image'];
					}

					// track screenshot usage
					if ( ! is_user_logged_in() && ! Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
						$scr_url = new Urlslab_Data_Screenshot_Url();
						$scr_url->set_src_url_id( Urlslab_Url::get_current_page_url()->get_url_id() );
						$scr_url->set_screenshot_url_id( $url_data->get_url_id() );
						if ( ! $scr_url->load() ) {
							$scr_url->insert_all( array( $scr_url ), true );
						}
					}

					if ( empty( $screenshot_url ) ) {
						return ' <!-- URLSLAB processing ' . $urlslab_atts['url'] . ' -->';
					}

					return $this->render_screenshot_shortcode(
						$urlslab_atts['url'],
						$screenshot_url,
						$alt_text,
						$urlslab_atts['width'],
						$urlslab_atts['height']
					);
				}
			}
		} catch ( Exception $e ) {
		}

		return '';
	}

	private function validateCurrentPageUrl( DOMDocument $document ): void {
		if ( ! is_singular() || is_search() ) {
			return;
		}

		$currentUrl = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
		if ( null !== $currentUrl ) {
			if ( Urlslab_Data_Url::URL_TYPE_EXTERNAL == $currentUrl->get_url_type() ) {
				$currentUrl->set_url_type( Urlslab_Data_Url::URL_TYPE_INTERNAL ); //fix incorrect type - all what is loaded by this WP is internal url
			}

			if ( $this->get_option( self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL ) ) {
				if ( Urlslab_Data_Url::HTTP_STATUS_OK === $currentUrl->get_http_status() ) {
					if ( strtotime( $currentUrl->get_update_http_date() ) < time() - $this->get_option( Urlslab_Widget_Urls::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) ) {
						$this->update_current_url_data( $currentUrl, $document );
					}
				} else {
					if ( is_404() ) {
						$currentUrl->set_http_status( 404 );
					} else {
						$this->update_current_url_data( $currentUrl, $document );
					}
				}
			}

			$id = get_the_ID();
			if ( $id ) {
				$currentUrl->set_post_id( $id );
			}

			$currentUrl->update();
		}
	}

	private function update_current_url_data( Urlslab_Data_Url $currentUrl, DOMDocument $document ) {
		$currentUrl->set_http_status( Urlslab_Data_Url::HTTP_STATUS_OK );
		$currentUrl->set_content_type( 'text/html' );
		if ( ! strlen( $currentUrl->get_url_h1() ) ) {
			$xpath   = new DOMXPath( $document );
			$headers = $xpath->query( '//h1' );
			foreach ( $headers as $header_element ) {
				$currentUrl->set_url_h1( $header_element->nodeValue );
				break;
			}
		}
		if ( ! strlen( $currentUrl->get_url_title() ) ) {
			$currentUrl->set_url_title( get_the_title() );
		}
		if ( ! strlen( $currentUrl->get_url_meta_description() ) ) {
			$meta = $this->extract_current_page_meta_description();
			if ( strlen( $meta ) ) {
				if ( 160 <= strlen( $meta ) ) {
					$meta                = substr( $meta, 0, 155 );
					$last_space_position = strrpos( $meta, ' ' );
					if ( $last_space_position > 120 ) {
						$meta = substr( $meta, 0, $last_space_position );
					}
					$meta .= '...';
				}
				$currentUrl->set_url_meta_description( $meta );
			}
		}
	}

	private function extract_current_page_meta_description() {
		if ( class_exists( 'WPSEO_Frontend' ) ) {
			$meta = get_post_meta( get_the_ID(), '_yoast_wpseo_metadesc', true );
			if ( strlen( $meta ) ) {
				return $meta;
			}
		}
		if ( defined( 'AIOSEOP_VERSION' ) ) {
			$meta = get_post_meta( get_the_ID(), '_aioseop_description', true );
			if ( strlen( $meta ) ) {
				return $meta;
			}
		}
		if ( defined( 'RANK_MATH_VERSION' ) ) {
			$meta = get_post_meta( get_the_ID(), 'rank_math_description', true );
			if ( strlen( $meta ) ) {
				return $meta;
			}
		}
		if ( class_exists( 'The_SEO_Framework\Plugin' ) ) {
			// The SEO Framework is active
			$meta = get_post_meta( get_the_ID(), '_description', true );
			if ( strlen( $meta ) ) {
				return $meta;
			}
		}
		$meta = get_post_meta( get_the_ID(), 'description', true );
		if ( strlen( $meta ) ) {
			return $meta;
		}
		$meta = get_post_meta( get_the_ID(), 'excerpt', true );
		if ( strlen( $meta ) ) {
			return $meta;
		}
		$meta = get_the_excerpt();
		if ( strlen( $meta ) ) {
			return $meta;
		}

		return '';
	}

	protected function add_options() {
		$this->add_options_form_section(
			'main',
			function () {
				return __( 'Link Formatting and Monitoring', 'urlslab' );
			},
			function () {
				return __( 'This plugin seamlessly monitor link usage on your website during page view. Utilizing advanced data or preset enhancements, all links in the created HTML are evaluated and optimized for top performance.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			function () {
				return __( 'Monitor Link Usage', 'urlslab' );
			},
			function () {
				return __( 'It will automatically create and save a diagram illustrating the connections between your website\'s pages.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
			self::DESC_TEXT_SUMMARY,
			true,
			function () {
				return __( 'Link Description', 'urlslab' );
			},
			function () {
				return __( 'The text that appears in the link\'s title/alt text. If the summary is not present, the meta description of the target URL is utilized.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					Urlslab_Widget_Urls::DESC_TEXT_SUMMARY          => __( 'Use summaries', 'urlslab' ),
					Urlslab_Widget_Urls::DESC_TEXT_META_DESCRIPTION => __( 'Use meta description', 'urlslab' ),
					Urlslab_Widget_Urls::DESC_TEXT_TITLE            => __( 'Use page title', 'urlslab' ),
					Urlslab_Widget_Urls::DESC_TEXT_H1               => __( 'Use H1', 'urlslab' ),
					Urlslab_Widget_Urls::DESC_TEXT_URL              => __( 'Use URL path', 'urlslab' ),
				);
			},
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_LINK_FRAGMENT,
			false,
			true,
			function () {
				return __( 'Improve Links Using Text Fragment', 'urlslab' );
			},
			function () {
				return __( 'Insert Text fragments into your website\'s links to enhance internal SEO and direct visitors to the relevant paragraph connected with the link. To bypass some links, add the `urlslab-skip-fragment` class name to either the link or sections housing these links.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ADD_HREFLANG,
			true,
			true,
			function () {
				return __( 'Improve Links with Hreflang Attribute', 'urlslab' );
			},
			function () {
				return __( 'When the destination page of the link is analyzed and includes a lang attribute, improve each link with an hreflang attribute.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ADD_BLANK,
			true,
			true,
			function () {
				return __( 'Set target _blank for external urls', 'urlslab' );
			},
			function () {
				return __( 'Set target `_blank` for all links with urls pointing to other domains.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS,
			false,
			true,
			function () {
				return __( 'Insert Anchor IDs to Every Heading', 'urlslab' );
			},
			function () {
				return __( 'Improve all headers with ID attributes to enable users to link directly to a specific part of the website.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section(
			'validation',
			function () {
				return __( 'Link Validation', 'urlslab' );
			},
			function () {
				return __( 'Maintaining your content\'s quality is a crucial SEO duty. Use the settings below to automate the dead or broken link checks on your website. This eliminates the manual hunt for these invalid links in your HTML content.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			true,
			false,
			function () {
				return __( 'Validate Links', 'urlslab' );
			},
			function () {
				return __( 'Verify the HTTP status of each link present in the website content.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL,
			2419200,
			false,
			function () {
				return __( 'Validation Interval', 'urlslab' );
			},
			function () {
				return __( 'Define the frequency for URL status checks on your site. This feature may require significant processing resources. For optimal performance, we suggest monthly or quarterly check.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					86400            => __( 'Daily', 'urlslab' ),
					604800           => __( 'Weekly', 'urlslab' ),
					2419200          => __( 'Monthly', 'urlslab' ),
					7257600          => __( 'Quarterly', 'urlslab' ),
					31536000         => __( 'Yearly', 'urlslab' ),
					self::FREQ_NEVER => __( 'Never', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'validation',
		);
		$this->add_option_definition(
			self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL,
			true,
			true,
			function () {
				return __( 'Mark URLs Processed by WordPress as Valid', 'urlslab' );
			},
			function () {
				return __( 'When WordPress delivers an unvalidated URL, we\'ll deem it valid.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			function () {
				return __( 'Hide Invalid Links or Links Marked as Hidden', 'urlslab' );
			},
			function () {
				return __( 'Hide all links in HTML content that are manually marked as hidden or point to invalid link (e.g. 404 Not Found, 503 Server Error, etc). Links resolved with status code 429 Rate limit or 403 Forbidden will not be removed from content as it is quite common problem.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REPLACE_3XX_LINKS,
			true,
			true,
			function () {
				return __( 'Replace Redirected Links for Their Destination URLs', 'urlslab' );
			},
			function () {
				return __( 'Substitute all links that have redirects with their destination URLs.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG,
			true,
			true,
			function () {
				return __( 'Replace Non-SEO Friendly Links', 'urlslab' );
			},
			function () {
				return __( 'Substitute all non-SEO friendly links with their SEO friendly versions, which search engines prefer. Currently, our support is limited to replacing `page_id` links. To omit certain links, assign the `urlslab-skip-page_id` class name to the link or to any elements that encompass the links.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND,
			true,
			true,
			function () {
				return __( 'Hide Invalid Non-SEO Friendly Links', 'urlslab' );
			},
			function () {
				return __( 'Hide all links that have an incorrect `page_id` within the website content.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FIX_PROTOCOL,
			false,
			true,
			function () {
				return __( 'Unify Protocol', 'urlslab' );
			},
			function () {
				return __( 'Ensure all links have the same protocol as the current domain.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FIX_DOUBLESLASH,
			true,
			true,
			function () {
				return __( 'Fix double slashes in URL path', 'urlslab' );
			},
			function () {
				return __( 'Some plugins corrupt urls with double slashes, fix paths in urls and replace duplicate double slashes with single slash', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_options_form_section(
			'scheduling',
			function () {
				return __( 'FlowHunt Service', 'urlslab' );
			},
			function () {
				return __( 'Boost your page\'s content quality using AI-powered summarizations and screenshots by FlowHunt service. Enhance link titles and meta descriptions, giving visitors a clear preview of the content they\'ll find on the destination page.', 'urlslab' );
			},
			array( self::LABEL_PAID )
		);

		$this->add_option_definition(
			self::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL,
			31536000,
			false,
			function () {
				return __( 'Update Interval of URL Summaries', 'urlslab' );
			},
			function () {
				return __( 'Choose frequency of summary updates.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					604800           => __( 'Weekly', 'urlslab' ),
					2419200          => __( 'Monthly', 'urlslab' ),
					7257600          => __( 'Quarterly', 'urlslab' ),
					31536000         => __( 'Yearly', 'urlslab' ),
					self::FREQ_NEVER => __( 'Never', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'scheduling',
		);

		$this->add_option_definition(
			self::SETTING_NAME_SUMMARIZATION_FLOW,
			'5b9daf7e-d7b8-4ee3-9a84-345703c628cb',
			false,
			function () {
				return __( 'Summarization flow', 'urlslab' );
			},
			function () {
				return __( 'Choose custom flow to generate summaries of URLs.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					'5b9daf7e-d7b8-4ee3-9a84-345703c628cb' => __( 'Default Flow', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_string( $value ) && strlen( $value ) == 36;
			},
			'scheduling',
		);


		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS,
			false,
			true,
			function () {
				return __( 'Schedule All Internal Links', 'urlslab' );
			},
			function () {
				return __( 'When a fresh internal link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS,
			false,
			true,
			function () {
				return __( 'Schedule All External Links', 'urlslab' );
			},
			function () {
				return __( 'When a fresh external link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);


		$this->add_option_definition(
			self::SETTING_NAME_SCREENSHOT_REFRESH_INTERVAL,
			3600 * 24 * 30,
			false,
			function () {
				return __( 'Screenshot Synchronization', 'urlslab' );
			},
			function () {
				return __( 'Choose the frequency at which plugin synchronize screenshots with URLsLab service.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					3600 * 24       => __( 'Daily', 'urlslab' ),
					3600 * 24 * 7   => __( 'Weekly', 'urlslab' ),
					3600 * 24 * 30  => __( 'Monthly', 'urlslab' ),
					3600 * 24 * 365 => __( 'Yearly', 'urlslab' ),
					0               => __( 'Never', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_int( $value );
			},
			'scheduling',
		);

		$this->add_options_form_section(
			'meta',
			function () {
				return __( 'Meta Tags Configuration', 'urlslab' );
			},
			function () {
				return __( 'The plugin creates an amplified page summary serving as a description. It provides more detail than a conventional page description, aiding search engines to grasp your page\'s context, thus improving user findability in search results.', 'urlslab' );
			},
			array( self::LABEL_PAID )
		);

		$this->add_option_definition(
			self::SETTING_NAME_META_DESCRIPTION_GENERATION,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Meta Description', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the existing or absent meta description by summarizing the page\'s content.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => '-',
					self::ADD_VALUE       => __( 'Add if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current values', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'meta'
		);

		$this->add_option_definition(
			self::SETTING_NAME_META_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Title tag', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the existing or absent title tag.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => '-',
					self::ADD_VALUE       => __( 'Add title tag if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current title tag', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'meta'
		);

		$this->add_options_form_section(
			'og',
			function () {
				return __( 'Open Graph Meta Tags Configuration', 'urlslab' );
			},
			function () {
				return __( 'Open Graph meta tags bolster your content\'s visibility and sharability on social media platforms. They enhance your social media presence with interactive and engaging previews, attracting more clicks and attention.', 'urlslab' );
			}
		);

		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Open Graph Title', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the present or absent Open Graph title with the revised version.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => '-',
					self::ADD_VALUE       => __( 'Add if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current values', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og',
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_DESC_GENERATION,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Open Graph Description', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the existing or absent Open Graph description by summarizing the page\'s content.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => '-',
					self::ADD_VALUE       => __( 'Add if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current values', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og'
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_IMAGE_GENERATION,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Open Graph Image - og:image', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the existing or absent Open Graph image with a screenshot using the URLsLab service. In case of shop products use product thumbnail.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => __( 'No action', 'urlslab' ),
					self::ADD_VALUE       => __( 'Add if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current values', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og'
		);

		$this->add_options_form_section(
			'twitter',
			function () {
				return __( 'Twitter Card Meta Tags Configuration', 'urlslab' );
			},
			function () {
				return __( 'Enhance your content\'s visibility on social media using Twitter Card meta tags, providing engaging previews that attract users and boost shareability.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_TWITTER,
			self::ADD_VALUE,
			true,
			function () {
				return __( 'Twitter Card Meta Tags', 'urlslab' );
			},
			function () {
				return __( 'Add or replace the existing or absent Twitter Card description by summarizing the page\'s content.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::NO_CHANGE_VALUE => '-',
					self::ADD_VALUE       => __( 'Add if missing', 'urlslab' ),
					self::REPLACE_VALUE   => __( 'Replace the current values', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'twitter',
			array( self::LABEL_PAID )
		);

		$this->add_option_definition(
			self::SETTING_NAME_CARD_TYPE,
			self::TWITTER_CARD_SUMMARY_LARGE_IMAGE,
			true,
			function () {
				return __( 'Twitter Card Type', 'urlslab' );
			},
			function () {
				return __( 'Select a default style for the "twitter:card" meta field value.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					self::TWITTER_CARD_SUMMARY             => __( 'Summary', 'urlslab' ),
					self::TWITTER_CARD_SUMMARY_LARGE_IMAGE => __( 'Summary with Large Image', 'urlslab' ),
					self::TWITTER_CARD_APP                 => __( 'App', 'urlslab' ),
					self::TWITTER_CARD_PLAYER              => __( 'Player', 'urlslab' ),
				);
			},
			function ( $value ) {
				switch ( $value ) {
					case self::TWITTER_CARD_SUMMARY:
					case self::TWITTER_CARD_SUMMARY_LARGE_IMAGE:
					case self::TWITTER_CARD_APP:
					case self::TWITTER_CARD_PLAYER:
						return true;

					default:
						return false;
				}
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_HANLDE,
			'',
			true,
			function () {
				return __( 'Twitter Username', 'urlslab' );
			},
			function () {
				return __( 'Enter default Twitter username starting with the "@" symbol.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_CREATOR,
			'',
			true,
			function () {
				return __( 'Twitter Creator', 'urlslab' );
			},
			function () {
				return __( 'Enter default Twitter Creator username starting with the "@" symbol.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER,
			'',
			true,
			function () {
				return __( 'Twitter Player', 'urlslab' );
			},
			function () {
				return __( 'Enter player iframe URL (HTTPS only) for Player Card use. Leave blank if unsure.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || ( false !== strpos( $value, 'http' ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_WIDTH,
			'',
			true,
			function () {
				return __( 'Twitter Player Width', 'urlslab' );
			},
			function () {
				return __( 'Enter Twitter Player iframe width in pixels.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_HEIGHT,
			'',
			true,
			function () {
				return __( 'Twitter Player Height', 'urlslab' );
			},
			function () {
				return __( 'Enter Twitter Player iframe height in pixels.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_NAME,
			'',
			true,
			function () {
				return __( 'iPhone App Name', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPhone app\'s name in the Apple App Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_ID,
			'',
			true,
			function () {
				return __( 'iPhone App ID in the Apple App Store', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPhone App ID in the Apple App Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_URL,
			'',
			true,
			function () {
				return __( 'iPhone App\'s Custom URL Scheme', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPhone app\'s custom URL Scheme, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_NAME,
			'',
			true,
			function () {
				return __( 'iPad App Name', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPad app\'s name in the Apple App Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_ID,
			'',
			true,
			function () {
				return __( 'iPad App ID in the Apple App Store', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPad App ID in the Apple App Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_URL,
			'',
			true,
			function () {
				return __( 'iPad App\'s Custom URL Scheme', 'urlslab' );
			},
			function () {
				return __( 'Enter your iPad app\'s custom URL Scheme, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_NAME,
			'',
			true,
			function () {
				return __( 'Android App Name', 'urlslab' );
			},
			function () {
				return __( 'Enter your Android app\'s name in the Google Play Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_ID,
			'',
			true,
			function () {
				return __( 'App ID in the Google Play Store', 'urlslab' );
			},
			function () {
				return __( 'Enter your Android App ID in the Google Play Store, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_URL,
			'',
			true,
			function () {
				return __( 'Android App\'s Custom URL Scheme', 'urlslab' );
			},
			function () {
				return __( 'Enter your Android app\'s custom URL Scheme, applicable for App Card usage.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);


		$this->add_options_form_section(
			'image',
			function () {
				return __( 'Image Alt Text Attribute', 'urlslab' );
			},
			function () {
				return __( 'Alt text is essential for accessibility, offering a text substitute for individuals with visual impairments. It also assists search engines in comprehending the image\'s content, promoting appropriate indexing and keyword association.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_ALT_TAG_SOURCE,
			array( self::SOURCE_FIGCAPTION, self::SOURCE_LINK, self::SOURCE_H ),
			true,
			function () {
				return __( 'Alt Text Source', 'urlslab' );
			},
			function () {
				return __( 'Select the Alt attribute text source providing a fallback function. The system will automatically switch to a fallback choice if the selected source is unavailable.', 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function () {
				return array(
					self::SOURCE_FIGCAPTION => __( 'Image Caption', 'urlslab' ),
					self::SOURCE_LINK       => __( 'Link Title if the image is in a link', 'urlslab' ),
					self::SOURCE_H          => __( 'The nearest heading tag prior to the image', 'urlslab' ),
				);
			},
			null,
			'image'
		);
	}

	public function process_image_alt_text( DOMDocument $document ) {
		if ( empty( $this->get_option( self::SETTING_NAME_ALT_TAG_SOURCE ) ) ) {
			return;
		}

		try {
			$xpath      = new DOMXPath( $document );
			$table_data = $xpath->query( "//img[(not(@alt) or @alt='') and " . $this->get_xpath_query( array( 'urlslab-skip-img-alt' ) ) . "]|//*[substring-after(name(), 'h') > 0]" );
			$last_title = get_the_title();

			if ( ! empty( $table_data ) ) {
				foreach ( $table_data as $element ) {
					if ( preg_match( '/^[hH][0-6].*$/', $element->nodeName ) ) {
						$last_title = $element->nodeValue;
					} else {
						if ( 'img' == $element->nodeName && ! $this->is_skip_elemenet( $element, 'img-alt' ) ) {
							if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && 'a' == $element->parentNode->nodeName && $element->parentNode->hasAttribute( 'figure' ) && $this->get_option( self::SOURCE_FIGCAPTION ) ) {
								foreach ( $element->parentNode->childNodes as $child ) {
									if ( 'figcaption' == $child->nodeName ) {
										$element->setAttribute( 'alt', $child->nodeValue );

										break;
									}
								}
							}

							if ( empty( $element->getAttribute( 'alt' ) ) && isset( $element->parentNode ) && 'a' == $element->parentNode->nodeName && $element->parentNode->hasAttribute( 'title' ) && $this->get_option( self::SOURCE_LINK ) ) {
								$element->setAttribute( 'alt', trim( $last_title . ' - ' . $element->parentNode->getAttribute( 'title' ), ' -' ) );
							}

							if ( empty( $element->getAttribute( 'alt' ) ) && strlen( $last_title ) && $this->get_option( self::SOURCE_H ) ) {
								$element->setAttribute( 'alt', $last_title );
							}
						}
					}
				}
			} else {
				return;
			}

			return;
		} catch ( Exception $e ) {
			return;
		}
	}

	private function fixPageIdLinks( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG ) ) {
			return;
		}

		$xpath     = new DOMXPath( $document );
		$link_data = $xpath->query( "//a[contains(@href, '?page_id=') and " . $this->get_xpath_query( array( 'urlslab-skip-page_id' ) ) . ']' );

		foreach ( $link_data as $link_element ) {
			try {
				$url = new Urlslab_Url( $link_element->getAttribute( 'href' ) );
				if ( preg_match( '/page_id=(\d*)/i', $url->get_url_query(), $mathes ) ) {
					if ( isset( $mathes[1] ) && is_numeric( $mathes[1] ) ) {
						$post_permalink = get_the_permalink( $mathes[1] );
						if ( $post_permalink ) {
							$link_element->setAttribute( 'href', $post_permalink );
							if ( $link_element->hasAttribute( 'target' ) && '_blank' == $link_element->getAttribute( 'target' ) ) {
								try {
									$permalink_url = new Urlslab_Url( $post_permalink );
									if ( $permalink_url->is_wp_domain() ) {
										$link_element->removeAttribute( 'target' );
									}
								} catch ( Exception $e ) {
								}
							}
						} else {
							if ( $this->get_option( self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND ) ) {
								// link should not be visible, remove it from content
								if ( $link_element->childNodes->length > 0 ) {
									$fragment = $document->createDocumentFragment();
									if ( $link_element->childNodes->length > 0 ) {
										$fragment->appendChild( $link_element->childNodes->item( 0 ) );
									}
									$link_element->parentNode->replaceChild( $fragment, $link_element );
								} else {
									if ( property_exists( $link_element, 'domValue' ) ) {
										$txt_value = $link_element->domValue;
									} else {
										$txt_value = '';
									}
									$txt_element = $document->createTextNode( $txt_value );
									$link_element->parentNode->replaceChild( $txt_element, $link_element );
								}
							}
						}
					}
				}
			} catch ( Exception $e ) {
			}
		}
	}

	private function update_urls_map() {
		if ( is_search() || is_user_logged_in() || ! $this->get_option( self::SETTING_NAME_URLS_MAP ) || Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
			return;
		}

		$srcUrlId = Urlslab_Url::get_current_page_url()->get_url_id();

		$x_default_alternate = $srcUrlId;
		if ( ! empty( self::$page_alternate_links ) ) {
			foreach ( self::$page_alternate_links as $url_id => $rel ) {
				if ( 'x-default' === $rel ) {
					$x_default_alternate = $url_id;
					break;
				}
			}
		}

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT dest_url_id, rel_type FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE src_url_id = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$destinations = array();
		array_walk(
			$results,
			function ( $value, $key ) use ( &$destinations ) {
				$destinations[ $value['dest_url_id'] ] = $value['rel_type'];
			}
		);

		$tracked_urls = array();
		$map_objects  = array();

		foreach ( array_keys( self::$page_urls ) as $url_id ) {
			if ( ! isset( $destinations[ $url_id ] ) ) {
				if ( isset( self::$page_alternate_links[ $url_id ] ) ) {
					if ( $x_default_alternate !== $url_id ) {
						$map_objects[] = new Urlslab_Data_Url_Map(
							array(
								'src_url_id'    => $x_default_alternate,
								'dest_url_id'   => $url_id,
								'rel_type'      => Urlslab_Data_Url_Map::REL_TYPE_ALTERNATE,
								'rel_attribute' => self::$page_alternate_links[ $url_id ],
							),
							false
						);
					}
				} else {
					$map_objects[] = new Urlslab_Data_Url_Map(
						array(
							'src_url_id'    => $srcUrlId,
							'dest_url_id'   => $url_id,
							'rel_type'      => Urlslab_Data_Url_Map::REL_TYPE_LINK,
							'rel_attribute' => '',
						),
						false
					);
				}
			} else {
				$tracked_urls[ $url_id ] = true;
			}
		}

		if ( ! empty( $map_objects ) ) {
			$map_objects[0]->insert_all( $map_objects, true );
		}

		$delete = array_diff( array_keys( $destinations ), array_keys( $tracked_urls ) );
		if ( ! empty( $delete ) ) {
			$values      = array( $srcUrlId );
			$placeholder = array();
			foreach ( $delete as $url_id ) {
				$placeholder[] = '%d';
				$values[]      = $url_id;
			}
			$table              = URLSLAB_URLS_MAP_TABLE;
			$placeholder_string = implode( ',', $placeholder );
			$delete_query       = "DELETE FROM {$table} WHERE src_url_id=%d AND dest_url_id IN ({$placeholder_string})";
			$wpdb->query( $wpdb->prepare( $delete_query, $values ) ); // phpcs:ignore
		}
	}

	private function processTitleAttribute( DOMDocument $document ): void {
		try {
			$xpath    = new DOMXPath( $document );
			$elements = $xpath->query( '//a[' . $this->get_xpath_query( array( 'urlslab-skip-title' ) ) . ']' );

			$link_elements = array();
			if ( $elements instanceof DOMNodeList ) {
				foreach ( $elements as $dom_element ) {
					// skip processing if A tag contains attribute "urlslab-skip-all" or urlslab-skip-title
					if ( $this->is_skip_elemenet( $dom_element, 'title' ) ) {
						continue;
					}

					if ( ! empty( trim( $dom_element->getAttribute( 'href' ) ) ) ) {
						try {
							$url             = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
							$link_elements[] = array( $dom_element, $url );
						} catch ( Exception $e ) {
						}
					}
				}
			}

			if ( ! empty( $link_elements ) ) {
				self::$page_urls =
					self::$page_urls +
					Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls(
						array_merge(
							array( Urlslab_Url::get_current_page_url() ),
							array_map( fn( $elem ): Urlslab_Url => $elem[1], $link_elements )
						)
					);

				if ( ! empty( self::$page_urls ) ) {
					$this->update_urls_map();
					$strategy = $this->get_option( self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY );

					foreach ( $link_elements as $link_element_id => $arr_element ) {
						list( $dom_elem, $url_obj ) = $arr_element;

						if ( ! empty( self::$page_urls[ $url_obj->get_url_id() ] ) ) {

							if ( self::$page_urls[ $url_obj->get_url_id() ]->is_http_redirect() && $this->get_option( self::SETTING_NAME_REPLACE_3XX_LINKS ) ) {
								if ( isset( self::$page_urls[ self::$page_urls[ $url_obj->get_url_id() ]->get_final_url_id() ] ) ) {
									$url_obj                              = self::$page_urls[ self::$page_urls[ $url_obj->get_url_id() ]->get_final_url_id() ]->get_url();
									$link_elements[ $link_element_id ][1] = $url_obj;
									$dom_elem->setAttribute( 'urlslab_href_old', $dom_elem->getAttribute( 'href' ) );
									$dom_elem->setAttribute( 'href', $url_obj->get_url_with_protocol() );
								}
							}

							if ( ! self::$page_urls[ $url_obj->get_url_id() ]->is_http_valid() && $this->get_option( self::SETTING_NAME_REMOVE_LINKS ) ) {
								// link should not be visible, remove it from content
								if ( 0 > $dom_elem->childNodes->length ) {
									$fragment = $document->createDocumentFragment();
									if ( $dom_elem->childNodes->length > 0 ) {
										$fragment->appendChild( $dom_elem->childNodes->item( 0 ) );
									}
									$dom_elem->parentNode->replaceChild( $fragment, $dom_elem );
								} else {
									if ( property_exists( $dom_element, 'nodeValue' ) ) {
										$txt_value = $dom_elem->nodeValue;
									} else {
										$txt_value = '';
									}
									$txt_element = $document->createTextNode( $txt_value );
									$dom_elem->parentNode->replaceChild( $txt_element, $dom_elem );
								}
							} else {
								// enhance title if url has no title
								if ( empty( $dom_elem->getAttribute( 'title' ) ) ) {
									$new_title = self::$page_urls[ $url_obj->get_url_id() ]->get_summary_text( $strategy );
									if ( strlen( $new_title ) ) {
										$dom_elem->setAttribute( 'title', $new_title );
									}
								}

								//add hreflang attribute
								if ( empty( $dom_elem->getAttribute( 'hreflang' ) ) && $this->get_option( self::SETTING_NAME_ADD_HREFLANG ) && ! empty( self::$page_urls[ $url_obj->get_url_id() ]->get_url_lang() ) && Urlslab_Data_Url::VALUE_EMPTY !== self::$page_urls[ $url_obj->get_url_id() ]->get_url_lang() ) {
									$dom_elem->setAttribute( 'hreflang', self::$page_urls[ $url_obj->get_url_id() ]->get_url_lang() );
								}

								if (
									empty( $dom_elem->getAttribute( 'target' ) ) &&
									$this->get_option( self::SETTING_NAME_ADD_BLANK ) &&
									Urlslab_Url::get_current_page_url()->get_domain_id() != $url_obj->get_domain_id() &&
									! $url_obj->is_wp_domain()
								) {
									$dom_elem->setAttribute( 'target', '_blank' );
								}
							}
						}
					}
				}
			}
		} catch ( Exception $e ) {
		}
	}

	private function addIdToHTags( DOMDocument $document ) {
		if ( $this->get_option( self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS ) ) {
			$used_ids = array();
			$xpath    = new DOMXPath( $document );
			$headers  = $xpath->query( "//*[substring-after(name(), 'h') > 0 and " . $this->get_xpath_query( array( 'urlslab-skip-keywords' ) ) . ']' );
			foreach ( $headers as $header_element ) {
				if ( ! $header_element->hasAttribute( 'id' ) ) {
					$id = strtolower( trim( $header_element->nodeValue ) );
					$id = 'h-' . trim( preg_replace( '/[^\w]+/', '-', $id ), '-' );
					if ( ! isset( $used_ids[ $id ] ) ) {
						$header_element->setAttribute( 'id', $id );
					}
				}
				$used_ids[ $header_element->getAttribute( 'id' ) ] = 1;
			}
		}
	}

	private function processLinkFragments( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_ADD_LINK_FRAGMENT ) ) {
			return;
		}
		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( '//a[@href and ' . $this->get_xpath_query( array( 'urlslab-skip-fragment' ) ) . ']' );
		foreach ( $elements as $dom_elem ) {
			if ( strlen( $dom_elem->getAttribute( 'href' ) ) && false === strpos( $dom_elem->getAttribute( 'href' ), '#' ) ) {
				$fragment_text = '';
				if ( $dom_elem->childNodes->length > 0 && property_exists( $dom_elem->childNodes->item( 0 ), 'wholeText' ) ) {
					$fragment_text = trim( $dom_elem->childNodes->item( 0 )->wholeText );
				} else {
					if ( property_exists( $dom_elem, 'domValue' ) ) {
						$fragment_text = trim( $dom_elem->domValue );
					}
				}
				if ( strlen( $fragment_text ) ) {
					try {
						$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
						if ( $url->is_url_valid() && $url->is_wp_domain() ) {
							$dom_elem->setAttribute( 'href', $dom_elem->getAttribute( 'href' ) . '#:~:text=' . urlencode( $fragment_text ) );
						}
					} catch ( Exception $e ) {
						// noop, just skip link
					}
				}
			}
		}
	}

	private function fixDoubleSlashesInPath( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_FIX_DOUBLESLASH ) ) {
			return;
		}
		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( '//a[@href and ' . $this->get_xpath_query( array( 'urlslab-skip-doubleslash-fix' ) ) . ']' );
		foreach ( $elements as $dom_elem ) {
			if ( strlen( $dom_elem->getAttribute( 'href' ) ) ) {
				try {
					$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
					if ( false !== strpos( $url->get_url_path(), '//' ) && $url->is_url_valid() ) {
						$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ), true, true );
						$dom_elem->setAttribute( 'href', $url->get_url_with_protocol() );
					}
				} catch ( Exception $e ) {
					// noop, just skip link
				}
			}
		}
	}


	private function fixProtocol( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_FIX_PROTOCOL ) ) {
			return;
		}
		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( '//a[@href and ' . $this->get_xpath_query( array( 'urlslab-skip-protocol-fix' ) ) . ']' );

		$current_page = Urlslab_Url::get_current_page_url();

		foreach ( $elements as $dom_elem ) {
			if ( strlen( $dom_elem->getAttribute( 'href' ) ) && str_starts_with( $dom_elem->getAttribute( 'href' ), 'http' ) ) {
				try {
					$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
					if ( $url->is_url_valid() && $url->is_wp_domain() && $current_page->get_protocol() !== $url->get_protocol() ) {
						$dom_elem->setAttribute( 'href', Urlslab_Url::add_current_page_protocol( $url->get_url() ) );
					}
				} catch ( Exception $e ) {
					// noop, just skip link
				}
			}
		}
	}

	public function register_routes() {
	}

	public function track_alternate_links( DOMDocument $document ) {
		if ( is_404() || is_attachment() || is_search() || is_user_logged_in() || ! $this->get_option( self::SETTING_NAME_URLS_MAP ) || Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
			return;
		}

		$link_urls               = array();
		$xpath                   = new DOMXPath( $document );
		$alternate_link_elements = $xpath->query( '//link[@rel="alternate" and @hreflang and @href]' );
		foreach ( $alternate_link_elements as $element ) {
			try {
				$url = new Urlslab_Url( $element->getAttribute( 'href' ) );
				if ( $url->is_url_valid() ) {
					$link_urls[]                                      = $url;
					self::$page_alternate_links[ $url->get_url_id() ] = $element->getAttribute( 'hreflang' );
				}
			} catch ( Exception $e ) {
				// noop, just skip link
			}
		}

		try {
			self::$page_urls = self::$page_urls + Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( $link_urls );
		} catch ( Exception $e ) {
			return;
		}
	}

	public function meta_tags_content_hook( DOMDocument $document ) {
		if ( is_404() || is_attachment() ) {
			return;
		}
		try {
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if ( empty( $head_tag ) || ! is_object( $head_tag ) ) {
				return;
			}

			try {
				$url_data = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
			} catch ( Exception $e ) {
				return;
			}

			if ( is_object( $url_data ) && $url_data->is_http_valid() ) {
				$summary = $url_data->get_summary_text( Urlslab_Widget_Urls::DESC_TEXT_SUMMARY );
				$title   = $url_data->get_summary_text( Urlslab_Widget_Urls::DESC_TEXT_TITLE );

				$this->set_tag( $document, $head_tag, 'title', self::SETTING_NAME_META_TITLE_GENERATION, $title );

				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'description', self::SETTING_NAME_META_DESCRIPTION_GENERATION, $summary );

				//Open Graph
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:title', self::SETTING_NAME_META_OG_TITLE_GENERATION, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:description', self::SETTING_NAME_META_OG_DESC_GENERATION, $summary );

				if ( ( is_single() || is_page() || ( function_exists( 'is_product' ) && is_product() ) ) && get_the_post_thumbnail_url() ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, get_the_post_thumbnail_url() );
				} else if (
					strlen( $url_data->get_screenshot_url( Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE, true ) ) &&
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, $url_data->get_screenshot_url() )
				) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:width', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 1366 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:height', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 768 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:type', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 'image/jpeg' );
				}

				//Twitter
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:card', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_CARD_TYPE ) );
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_HANLDE ) ) > 0 ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:site', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_HANLDE ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_CREATOR ) ) > 0 ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:creator', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_CREATOR ) );
				}
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:title', self::SETTING_NAME_TWITTER, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:description', self::SETTING_NAME_TWITTER, $summary );
				if ( strlen( $url_data->get_screenshot_url() ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:image', self::SETTING_NAME_TWITTER, $url_data->get_screenshot_url() );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER_WIDTH ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player:width', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER_WIDTH ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER_HEIGHT ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player:height', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER_HEIGHT ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_URL ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_URL ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_URL ) );
				}
			}
		} catch ( Exception $e ) {
		}
	}

	private function set_meta_tag( $document, $head_tag, $tag, $attribute_name, $attribute_value, $setting_name, $content_value ): bool {
		if ( ! empty( $this->get_option( $setting_name ) ) && self::NO_CHANGE_VALUE != $this->get_option( $setting_name ) && ! empty( $content_value ) ) {
			$xpath     = new DOMXPath( $document );
			$meta_tags = $xpath->query( '//' . $tag . '[@' . $attribute_name . "='{$attribute_value}']" );
			if ( 0 == $meta_tags->count() ) {
				$node = $document->createElement( $tag );
				$node->setAttribute( $attribute_name, $attribute_value );
				$node->setAttribute( 'content', $content_value );
				$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );
				$head_tag->appendChild( $node );

				return true;
			}
			if ( self::REPLACE_VALUE == $this->get_option( $setting_name ) ) {
				foreach ( $meta_tags as $node ) {
					$node->setAttribute( 'content', $content_value );
					$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );

					return true;
				}
			}
		}

		return false;
	}

	private function set_tag( $document, $head_tag, $tag, $setting_name, $content_value ): bool {
		if ( ! empty( $this->get_option( $setting_name ) ) && self::NO_CHANGE_VALUE != $this->get_option( $setting_name ) && ! empty( $content_value ) ) {
			$xpath      = new DOMXPath( $document );
			$title_tags = $xpath->query( '//' . $tag );
			if ( 0 == $title_tags->count() ) {
				$node = $document->createElement( $tag, $content_value );
				$head_tag->appendChild( $node );

				return true;
			}
			if ( self::REPLACE_VALUE == $this->get_option( $setting_name ) ) {
				foreach ( $title_tags as $node ) {
					$node->nodeValue = $content_value;

					return true;
				}
			}
		}

		return false;
	}

	public function get_widget_group() {
		return (object) array( 'Tools' => __( 'Tools', 'urlslab' ) );
	}
}


function urlslab_url_attribute( $attribute_name, $url = false ) {
	try {
		if ( $url ) {
			$url_obj = new Urlslab_Url( $url, true );
		} else {
			$url_obj = Urlslab_Url::get_current_page_url();
		}
		$url_row = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( $url_obj );

		if ( $url_row ) {
			return $url_row->get_public( $attribute_name );
		}
	} catch ( Exception $e ) {
	}

	return '';
}

function urlslab_url_attributes( $url = false ): array {
	try {
		if ( $url ) {
			$url_obj = new Urlslab_Url( $url, true );
		} else {
			$url_obj = Urlslab_Url::get_current_page_url();
		}
		$url_row = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( $url_obj );

		if ( $url_row ) {
			return $url_row->as_array();
		}
	} catch ( Exception $e ) {
	}

	return array();
}
