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


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 12 );

		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
		Urlslab_Loader::get_instance()->add_action( 'widgets_init', $this, 'init_wp_widget', 10, 0 );

		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'meta_tags_content_hook' );
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
		return __( 'URLs' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor internal and external URLs on your site, take screenshots, etc.' );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_404() ) {
			return;
		}
		$this->validateCurrentPageUrl( $document );
		$this->addIdToHTags( $document );
		$this->fixProtocol( $document );
		$this->fixPageIdLinks( $document );
		$this->processTitleAttribute( $document );
		$this->processLinkFragments( $document );
		$this->process_image_alt_text( $document );
	}

	public function is_api_key_required(): bool {
		return true;
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
				'alt'             => 'Screenshot taken by URLsLab service',
				'default-image'   => '',
				'url'             => '',
				'screenshot-type' => Urlslab_Data_Url::SCREENSHOT_TYPE_CAROUSEL,
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
			|| ( class_exists( '\Elementor\Plugin' )
				 && \Elementor\Plugin::$instance->editor->is_edit_mode() )
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
					if (
						empty( $url_data->get_scr_status() ) &&
						Urlslab_Widget_General::SCHEDULE_NEVER != Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_SHEDULE_SCRRENSHOT )
					) {
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
					if ( ! Urlslab_Url::get_current_page_url()->is_domain_blacklisted() ) {
						$scr_url = new Urlslab_Data_Screenshot_Url();
						$scr_url->set_src_url_id( Urlslab_Url::get_current_page_url()->get_url_id() );
						$scr_url->set_screenshot_url_id( $url_data->get_url_id() );
						if ( ! $scr_url->load() ) {
							$scr_url->insert_all( array( $scr_url ), true );
						}
						Urlslab_Data_Url::update_screenshot_usage_count( array( $url_data->get_url_id() ) );
					}

					if ( empty( $screenshot_url ) ) {
						return ' <!-- URLSLAB processing '
							   . $urlslab_atts['url'] . ' -->';
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
		if ( ! is_singular() ) {
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

			$currentUrl->update();
		}
	}

	private function update_current_url_data( Urlslab_Data_Url $currentUrl, DOMDocument $document ) {
		$currentUrl->set_http_status( Urlslab_Data_Url::HTTP_STATUS_OK );
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
		$this->add_options_form_section( 'main', __( 'Link Formatting and Monitoring' ), __( 'This plugin seamlessly monitor link usage on your website during page view. Utilizing advanced data or preset enhancements, all links in the created HTML are evaluated and optimized for top performance.' ), array( self::LABEL_FREE ) );

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			__( 'Monitor Link Usage' ),
			__( 'It will automatically create and save a diagram illustrating the connections between your website\'s pages.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
			self::DESC_TEXT_SUMMARY,
			true,
			__( 'Link Description' ),
			__( 'The text that appears in the link\'s title/alt text. If the summary is not present, the meta description of the target URL is utilized.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Widget_Urls::DESC_TEXT_SUMMARY          => __( 'Use summaries' ),
				Urlslab_Widget_Urls::DESC_TEXT_META_DESCRIPTION => __( 'Use meta description' ),
				Urlslab_Widget_Urls::DESC_TEXT_TITLE            => __( 'Use page title' ),
				Urlslab_Widget_Urls::DESC_TEXT_H1               => __( 'Use H1' ),
				Urlslab_Widget_Urls::DESC_TEXT_URL              => __( 'Use URL path' ),
			),
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_LINK_FRAGMENT,
			false,
			true,
			__( 'Improve Links Using Text Fragment' ),
			__( 'Insert Text fragments into your website\'s links to enhance internal SEO and direct visitors to the relevant paragraph connected with the link. To bypass some links, add the `urlslab-skip-fragment` class name to either the link or sections housing these links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ADD_HREFLANG,
			true,
			true,
			__( 'Improve Links with Hreflang Attribute' ),
			__( 'When the destination page of the link is analyzed and includes a lang attribute, improve each link with an hreflang attribute.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS,
			false,
			true,
			__( 'Insert Anchor IDs to Every Heading' ),
			__( 'Improve all headers with ID attributes to enable users to link directly to a specific part of the website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section( 'validation', __( 'Link Validation' ), __( 'Maintaining your content\'s quality is a crucial SEO duty. Use the settings below to automate the dead or broken link checks on your website. This eliminates the manual hunt for these invalid links in your HTML content.' ), array( self::LABEL_FREE ) );

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			true,
			false,
			__( 'Validate Links' ),
			__( 'Verify the HTTP status of each link present in the website content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL,
			2419200,
			false,
			__( 'Validation Interval' ),
			__( 'Define the frequency for URL status checks on your site. This feature may require significant processing resources. For optimal performance, we suggest monthly or quarterly check.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400            => __( 'Daily' ),
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31536000         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'validation',
		);
		$this->add_option_definition(
			self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL,
			true,
			true,
			__( 'Mark URLs Processed by WordPress as Valid' ),
			__( 'When WordPress delivers an unvalidated URL, we\'ll deem it valid.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			__( 'Hide Links Marked as Hidden' ),
			__( 'Hide all links in HTML content that are manually marked as hidden.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REPLACE_3XX_LINKS,
			true,
			true,
			__( 'Replace Redirected Links for Their Destination URLs' ),
			__( 'Substitute all links that have redirects with their destination URLs.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG,
			true,
			true,
			__( 'Replace Non-SEO Friendly Links' ),
			__( 'Substitute all non-SEO friendly links with their SEO friendly versions, which search engines prefer. Currently, our support is limited to replacing `page_id` links. To omit certain links, assign the `urlslab-skip-page_id` class name to the link or to any elements that encompass the links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND,
			true,
			true,
			__( 'Hide Invalid Non-SEO Friendly Links' ),
			__( 'Hide all links that have an incorrect `page_id` within the website content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FIX_PROTOCOL,
			false,
			true,
			__( 'Unify Protocol' ),
			__( 'Ensure all links have the same protocol as the current domain.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_options_form_section( 'scheduling', __( 'Schedule Configuration' ), __( 'Boost your page\'s content quality using AI-powered summarizations by URLsLab service for all your site\'s URLs. Enhance link titles and meta descriptions, giving visitors a clear preview of the content they\'ll find on the destination page.' ), array( self::LABEL_PAID ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS,
			false,
			true,
			__( 'Schedule All Internal Links' ),
			__( 'When a fresh internal link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS,
			false,
			true,
			__( 'Schedule All External Links' ),
			__( 'When a fresh external link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);


		$this->add_options_form_section( 'meta', __( 'Meta Tags Configuration' ), __( 'The plugin creates an amplified page summary serving as a description. It provides more detail than a conventional page description, aiding search engines to grasp your page\'s context, thus improving user findability in search results.' ), array( self::LABEL_PAID ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_DESCRIPTION_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Meta Description' ),
			__( 'Add or replace the existing or absent meta description by summarizing the page\'s content.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => '-',
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
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
			__( 'Title tag' ),
			__( 'Add or replace the existing or absent title tag.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => '-',
				self::ADD_VALUE       => __( 'Add title tag if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current title tag' ),
			),
			function( $value ) {
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

		$this->add_options_form_section( 'og', __( 'Open Graph Meta Tags Configuration' ), __( 'Open Graph meta tags bolster your content\'s visibility and sharability on social media platforms. They enhance your social media presence with interactive and engaging previews, attracting more clicks and attention.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Open Graph Title' ),
			__( 'Add or replace the present or absent Open Graph title with the revised version.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => '-',
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
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
			__( 'Open Graph Description' ),
			__( 'Add or replace the existing or absent Open Graph description by summarizing the page\'s content.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => '-',
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
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
			__( 'Open Graph Image' ),
			__( 'Add or replace the existing or absent Open Graph image with a screenshot using the URLsLab service.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
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

		$this->add_options_form_section( 'twitter', __( 'Twitter Card Meta Tags Configuration' ), __( 'Enhance your content\'s visibility on social media using Twitter Card meta tags, providing engaging previews that attract users and boost shareability.' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_TWITTER,
			self::ADD_VALUE,
			true,
			__( 'Twitter Card Meta Tags' ),
			__( 'Add or replace the existing or absent Twitter Card description by summarizing the page\'s content.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => '-',
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
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
			__( 'Twitter Card Type' ),
			__( 'Select a default style for the "twitter:card" meta field value.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::TWITTER_CARD_SUMMARY             => __( 'Summary' ),
				self::TWITTER_CARD_SUMMARY_LARGE_IMAGE => __( 'Summary with Large Image' ),
				self::TWITTER_CARD_APP                 => __( 'App' ),
				self::TWITTER_CARD_PLAYER              => __( 'Player' ),
			),
			function( $value ) {
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
			__( 'Twitter Username' ),
			__( 'Enter default Twitter username starting with the "@" symbol.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_CREATOR,
			'',
			true,
			__( 'Twitter Creator' ),
			__( 'Enter default Twitter Creator username starting with the "@" symbol.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER,
			'',
			true,
			__( 'Twitter Player' ),
			__( 'Enter player iframe URL (HTTPS only) for Player Card use. Leave blank if unsure.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, 'http' ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_WIDTH,
			'',
			true,
			__( 'Twitter Player Width' ),
			__( 'Enter Twitter Player iframe width in pixels.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_HEIGHT,
			'',
			true,
			__( 'Twitter Player Height' ),
			__( 'Enter Twitter Player iframe height in pixels.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_NAME,
			'',
			true,
			__( 'iPhone App Name' ),
			__( 'Enter your iPhone app\'s name in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_ID,
			'',
			true,
			__( 'iPhone App ID in the Apple App Store' ),
			__( 'Enter your iPhone App ID in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_URL,
			'',
			true,
			__( 'iPhone App\'s Custom URL Scheme' ),
			__( 'Enter your iPhone app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_NAME,
			'',
			true,
			__( 'iPad App Name' ),
			__( 'Enter your iPad app\'s name in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_ID,
			'',
			true,
			__( 'iPad App ID in the Apple App Store' ),
			__( 'Enter your iPad App ID in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_URL,
			'',
			true,
			__( 'iPad App\'s Custom URL Scheme' ),
			__( 'Enter your iPad app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_NAME,
			'',
			true,
			__( 'Android App Name' ),
			__( 'Enter your Android app\'s name in the Google Play Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_ID,
			'',
			true,
			__( 'App ID in the Google Play Store' ),
			__( 'Enter your Android App ID in the Google Play Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_URL,
			'',
			true,
			__( 'Android App\'s Custom URL Scheme' ),
			__( 'Enter your Android app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);


		$this->add_options_form_section( 'image', __( 'Image Alt Text Attribute' ), __( 'Alt text is essential for accessibility, offering a text substitute for individuals with visual impairments. It also assists search engines in comprehending the image\'s content, promoting appropriate indexing and keyword association.' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_ALT_TAG_SOURCE,
			array( self::SOURCE_FIGCAPTION, self::SOURCE_LINK, self::SOURCE_H ),
			true,
			__( 'Alt Text Source' ),
			__( 'Select the Alt attribute text source providing a fallback function. The system will automatically switch to a fallback choice if the selected source is unavailable.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			array(
				self::SOURCE_FIGCAPTION => __( 'Image Caption' ),
				self::SOURCE_LINK       => __( 'Link Title if the image is in a link' ),
				self::SOURCE_H          => __( 'The nearest heading tag prior to the image' ),
			),
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
									if ( $permalink_url->is_same_domain_url() ) {
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

	private function update_urls_map( array $url_ids ) {
		if ( ! $this->get_option( self::SETTING_NAME_URLS_MAP ) || Urlslab_Url::get_current_page_url()->is_domain_blacklisted() ) {
			return;
		}

		$srcUrlId = Urlslab_Url::get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT dest_url_id FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE src_url_id = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$destinations = array();
		array_walk(
			$results,
			function( $value, $key ) use ( &$destinations ) {
				$destinations[ $value['dest_url_id'] ] = true;
			}
		);

		$tracked_urls = array();

		$values      = array();
		$placeholder = array();
		foreach ( $url_ids as $url_id ) {
			if ( ! isset( $destinations[ $url_id ] ) ) {
				array_push(
					$values,
					$srcUrlId,
					$url_id,
				);
				$placeholder[] = '(%d,%d)';
			} else {
				$tracked_urls[ $url_id ] = true;
			}
		}

		if ( ! empty( $values ) ) {
			$table               = URLSLAB_URLS_MAP_TABLE;
			$placeholder_string  = implode( ', ', $placeholder );
			$insert_update_query = "INSERT IGNORE INTO {$table} (src_url_id, dest_url_id) VALUES {$placeholder_string}";

			$wpdb->query(
				$wpdb->prepare(
					$insert_update_query, // phpcs:ignore
					$values
				)
			);
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

		if ( ! empty( $delete ) || ! empty( $values ) ) {
			$url_ids = array_merge( array( $srcUrlId ), array_keys( $destinations ) );
			Urlslab_Data_Url::update_url_links_count( $url_ids );
			Urlslab_Data_Url::update_url_usage_cnt( $url_ids );
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
				$result = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls(
					array_merge(
						array( Urlslab_Url::get_current_page_url() ),
						array_map( fn( $elem ): Urlslab_Url => $elem[1], $link_elements )
					)
				);

				if ( ! empty( $result ) ) {
					$strategy = $this->get_option( self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY );

					$this->update_urls_map( array_keys( $result ) );

					foreach ( $link_elements as $arr_element ) {
						list( $dom_elem, $url_obj ) = $arr_element;
						if ( isset( $result[ $url_obj->get_url_id() ] ) && ! empty( $result[ $url_obj->get_url_id() ] ) ) {
							if ( $this->get_option( self::SETTING_NAME_REMOVE_LINKS ) && ! $result[ $url_obj->get_url_id() ]->is_visible() ) {
								// link should not be visible, remove it from content
								if ( $dom_elem->childNodes->length > 0 ) {
									$fragment = $document->createDocumentFragment();
									if ( $dom_elem->childNodes->length > 0 ) {
										$fragment->appendChild( $dom_elem->childNodes->item( 0 ) );
									}
									$dom_elem->parentNode->replaceChild( $fragment, $dom_elem );
								} else {
									if ( property_exists( $dom_element, 'domValue' ) ) {
										$txt_value = $dom_elem->domValue;
									} else {
										$txt_value = '';
									}
									$txt_element = $document->createTextNode( $txt_value );
									$dom_elem->parentNode->replaceChild( $txt_element, $dom_elem );
								}
							} else if ( $result[ $url_obj->get_url_id() ]->is_http_redirect() && $this->get_option( self::SETTING_NAME_REPLACE_3XX_LINKS ) ) {
								if ( isset( $result[ $result[ $url_obj->get_url_id() ]->get_final_url_id() ] ) ) {
									$dom_elem->setAttribute( 'urlslab_href_old', $dom_elem->getAttribute( 'href' ) );
									$dom_elem->setAttribute( 'href', $result[ $result[ $url_obj->get_url_id() ]->get_final_url_id() ]->get_url()->get_url_with_protocol() );
								} else {
									$new_url = new Urlslab_Data_Url( array( 'url_id' => $result[ $url_obj->get_url_id() ]->get_final_url_id() ) );
									if ( $new_url->load() ) {
										$dom_elem->setAttribute( 'urlslab_href_old', $dom_elem->getAttribute( 'href' ) );
										$dom_elem->setAttribute( 'href', $new_url->get_url()->get_url_with_protocol() );
									}
								}
							} else {
								// enhance title if url has no title
								if ( empty( $dom_elem->getAttribute( 'title' ) ) ) {
									$new_title = $result[ $url_obj->get_url_id() ]->get_summary_text( $strategy );
									if ( strlen( $new_title ) ) {
										$dom_elem->setAttribute( 'title', $new_title );
									}
								}

								//add hreflang attribute
								if ( empty( $dom_elem->getAttribute( 'hreflang' ) ) && $this->get_option( self::SETTING_NAME_ADD_HREFLANG ) && ! empty( $result[ $url_obj->get_url_id() ]->get_url_lang() ) && Urlslab_Data_Url::VALUE_EMPTY !== $result[ $url_obj->get_url_id() ]->get_url_lang() ) {
									$dom_elem->setAttribute( 'hreflang', $result[ $url_obj->get_url_id() ]->get_url_lang() );
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
						if ( $url->is_url_valid() && $url->is_same_domain_url() ) {
							$dom_elem->setAttribute( 'href', $dom_elem->getAttribute( 'href' ) . '#:~:text=' . urlencode( $fragment_text ) );
						}
					} catch ( Exception $e ) {
						// noop, just skip link
					}
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
					if ( $url->is_url_valid() && $url->is_same_domain_url() && $current_page->get_protocol() !== $url->get_protocol() ) {
						$dom_elem->setAttribute( 'href', Urlslab_Url::add_current_page_protocol( $url->get_url() ) );
					}
				} catch ( Exception $e ) {
					// noop, just skip link
				}
			}
		}
	}

	public function register_routes() {}

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
				if ( strlen( $url_data->get_screenshot_url( Urlslab_Data_Url::SCREENSHOT_TYPE_CAROUSEL, true ) ) && $this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, $url_data->get_screenshot_url() ) ) {
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
		return __( 'SEO' );
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
