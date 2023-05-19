<?php

class Urlslab_Content_Generator_Widget extends Urlslab_Widget {
	public const SLUG = 'urlslab-generator';
	public const SETTING_NAME_SCHEDULE = 'urlslab-gen-sched';
	public const SETTING_NAME_REFRESH_INTERVAL = 'urlslab-gen-refresh';
	public const SETTING_NAME_AUTOAPPROVE = 'urlslab-gen-autoapprove';
	public const SETTING_NAME_TRANSLATE = 'urlslab-gen-translate';
	public const SETTING_NAME_GENERATOR_MODEL = 'urlslab-gen-model';
	public const SETTING_NAME_TRANSLATE_MODEL = 'urlslab-gen-translate-model';
	const SETTING_NAME_TRACK_USAGE = 'urlslab-gen-track-usage';

	/**
	 * @var array[Urlslab_Generator_Shortcode_Row]
	 */
	private static $shortcodes_cache = array();
	private static array $video_cache = array();

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action(
			'init',
			$this,
			'hook_callback',
			10,
			0
		);
		Urlslab_Loader::get_instance()->add_action( 'admin_enqueue_scripts', $this, 'custom_admin_scripts' );
	}

	public function custom_admin_scripts() {
		global $pagenow;
		if (
			'admin.php' === $pagenow &&
			$this->get_option( self::SETTING_NAME_TRANSLATE ) &&
			is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) &&
			(
				current_user_can( 'activate_plugins' ) ||
				current_user_can( Urlslab_Api_Base::CAPABILITY_TRANSLATE ) ||
				current_user_can( Urlslab_Api_Base::CAPABILITY_ADMINISTRATION )
			)
		) {
			wp_enqueue_script( 'urlslab-admin-script', URLSLAB_PLUGIN_URL . 'admin/js/urlslab-wpml.js', array( 'jquery' ), URLSLAB_VERSION, true );
		}
	}

	public function hook_callback() {
		add_shortcode(
			$this->get_widget_slug(),
			array( $this, 'get_shortcode_content' )
		);
	}

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'AI Content Generator' );
	}

	public function get_widget_description(): string {
		return __(
			'Enhance your site\'s content effortlessly with our AI-powered module for generating unique texts'
		);
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_BETA, self::LABEL_AI, self::LABEL_PAID );
	}


	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		if ( ! isset( $atts['id'] ) || empty( $atts['id'] ) ) {
			if ( $this->is_edit_mode() ) {
				$atts['STATUS'] = 'Missing shortcode ID attribute!!!';

				return $this->get_placeholder_html( $atts, self::SLUG );
			}

			return '';
		}

		$obj = $this->get_shortcode_row( $atts['id'] );

		if ( $obj->is_loaded_from_db() ) {
			if ( Urlslab_Generator_Shortcode_Row::TYPE_VIDEO == $obj->get_shortcode_type() ) {
				if ( empty( $atts['videoid'] ) ) {
					if ( $this->is_edit_mode() ) {
						$atts['STATUS'] = 'videoid attribute is missing in shortcode';

						return $this->get_placeholder_html( $atts, self::SLUG );
					}

					return '';
				}
				$video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
				if ( empty( $video->get_video_id() ) ) {
					return '';
				}
			}
			if ( ! $obj->is_active() ) {
				if ( $this->is_edit_mode() ) {
					$atts['STATUS'] = 'NOT ACTIVE!!!!';

					return $this->get_placeholder_html( $atts, self::SLUG );
				}

				return '';
			}
		} else {
			if ( $this->is_edit_mode() ) {
				$atts['STATUS'] = 'Short code with given ID does NOT exists!!!';

				return $this->get_placeholder_html( $atts, self::SLUG );
			}

			return '';
		}


		$atts = $this->get_att_values( $obj, $atts );

		if ( $this->is_edit_mode() ) {
			return $this->get_placeholder_html( $atts, self::SLUG );
		}

		$obj_result = new Urlslab_Generator_Result_Row(
			array(
				'shortcode_id'     => $atts['id'],
				'semantic_context' => $this->get_template_value( $obj->get_semantic_context(), $atts ),
				'prompt_variables' => json_encode( $this->unset_computed_variables( $atts ) ),
				'url_filter'       => $this->get_template_value( $obj->get_url_filter(), $atts ),
			),
			false
		);

		if ( $obj_result->load() ) {
			if ( $obj_result->is_active() ) {
				$value = $obj_result->get_result();
			} else {
				$value = $atts['default_value'] ?? $obj->get_default_value();
			}
		} else {
			$value = $atts['default_value'] ?? $this->get_template_value( $obj->get_default_value(), $atts );
			$obj_result->set_status( Urlslab_Generator_Result_Row::STATUS_NEW );
			$obj_result->insert_all( array( $obj_result ), true );
		}
		$this->track_usage( $obj_result );


		if ( ! empty( $value ) ) {

			if ( empty( $atts['template'] ) && empty( trim( $obj->get_template() ) ) ) {
				return $value;
			} else {

				$json_value = json_decode( $value, true );
				$arr_values = array(
					'value'      => $value,
					'json_value' => $json_value,
				);
				if ( ! empty( trim( $obj->get_template() ) ) ) {
					return $this->get_template_value( $obj->get_template(), array_merge( $atts, $arr_values ) );
				} else {
					$template = locate_template(
						$atts['template'],
						false,
						false,
						$atts
					);
					if ( empty( $template ) ) {
						if (
							file_exists(
								URLSLAB_PLUGIN_DIR . 'public/' . $atts['template']
							)
						) {
							$template = URLSLAB_PLUGIN_DIR
										. 'public/'
										. $atts['template'];
						} else {
							return $value;
						}
					}

					ob_start();

					load_template( $template, true, array_merge( $atts, $arr_values ) );

					return '' . ob_get_clean();
				}
			}
		} else {
			return '';
		}
	}

	private function get_shortcode_row( int $shortcode_id ): Urlslab_Generator_Shortcode_Row {
		if ( ! isset( self::$shortcodes_cache[ $shortcode_id ] ) ) {
			self::$shortcodes_cache[ $shortcode_id ] = new Urlslab_Generator_Shortcode_Row( array( 'shortcode_id' => $shortcode_id ), false );
			self::$shortcodes_cache[ $shortcode_id ]->load();
		}

		return self::$shortcodes_cache[ $shortcode_id ];
	}

	private function get_template_variables( $template ): array {
		preg_match_all( '/{{([\w\.]+)}}/', $template, $matches );
		if ( isset( $matches[1] ) ) {
			return array_unique( $matches[1] );
		}

		return array();
	}

	public function get_att_values( Urlslab_Generator_Shortcode_Row $obj, $atts = array(), $required_variables = array() ): array {
		$atts = array_change_key_case( (array) $atts );

		$required_variables = array_merge(
			$required_variables,
			$this->get_template_variables( $obj->get_prompt() ),
			$this->get_template_variables( $obj->get_semantic_context() ),
			$this->get_template_variables( $obj->get_default_value() ),
			$this->get_template_variables( $obj->get_template() ),
			$this->get_template_variables( $obj->get_url_filter() )
		);
		foreach ( $required_variables as $variable ) {
			if ( ! isset( $atts[ $variable ] ) ) {
				switch ( $variable ) {
					case 'video_captions':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_captions'] = $obj_video->get_captions();
						}
						break;
					case 'video_captions_text':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_captions_text'] = $obj_video->get_captions_as_text();
						}
						break;
					case 'video_title':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_title'] = $obj_video->get_title();
						}
						break;
					case 'video_description':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_description'] = $obj_video->get_description();
						}
						break;
					case 'video_published_at':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_published_at'] = $obj_video->get_published_at();
						}
						break;
					case 'video_duration':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_duration'] = $obj_video->get_duration();
						}
						break;
					case 'video_channel_title':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_channel_title'] = $obj_video->get_channel_title();
						}
						break;
					case 'video_tags':
						$obj_video = Urlslab_Youtube_Row::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_tags'] = $obj_video->get_video_tags();
						}
						break;
					case 'page_url':
						$atts['page_url'] = $this->get_current_page_url()->get_url_with_protocol();
						break;
					case 'page_title':
						$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $this->get_current_page_url() );
						if ( ! empty( $current_url_obj ) ) {
							$atts['page_title'] = $current_url_obj->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_TITLE );
						}
						if ( empty( $atts['page_title'] ) ) {
							$atts['page_title'] = wp_title( ' ', false );
						}
						break;
					case 'domain':
						$atts['domain'] = $this->get_current_page_url()->get_domain_name();
						break;
					case 'language_code':
						$atts['language_code'] = $this->get_current_language_code();
						break;
					case 'language':
						$atts['language'] = $this->get_current_language_name();
						break;
				}
			}
		}

		return $atts;
	}

	public function get_template_value( string $template, array $attributes ): string {
		$variables = $this->get_template_variables( $template );

		foreach ( $variables as $variable ) {
			$var = explode( '.', $variable );
			if ( isset( $attributes[ $var[0] ] ) ) {
				if ( isset( $var[1] ) ) {
					if ( isset( $attributes[ $var[0] ][ $var[1] ] ) ) {
						$template = str_replace( '{{' . $variable . '}}', $this->render_template_variable_value( $attributes[ $var[0] ][ $var[1] ] ), $template );
					} else {
						$template = str_replace( '{{' . $variable . '}}', '', $template );
					}
				} else {
					$template = str_replace( '{{' . $variable . '}}', $this->render_template_variable_value( $attributes[ $variable ] ), $template );
				}
			} else {
				$template = str_replace( '{{' . $variable . '}}', '', $template );
			}
		}

		return $template;
	}

	private function render_template_variable_value( $value ) {
		if ( is_array( $value ) && ! empty( $value ) ) {
			$rendered_value = '<ul>';
			foreach ( $value as $item ) {
				$rendered_value .= '<li>' . $item . '</li>';
			}
			$rendered_value .= '</ul>';

			return $rendered_value;
		} else if ( empty( $value ) ) {
			return '';
		}

		return str_replace( "\n", '<br/>', $value );
	}

	public
	function has_shortcode(): bool {
		return true;
	}

	public
	function is_api_key_required(): bool {
		return true;
	}

	protected
	function add_options() {
		$this->add_options_form_section(
			'schedule',
			__( 'Scheduling Settings' ),
			__( 'Texts are generated by the URLsLab service, a paid feature of the module. Buy credits on www.urlslab.com and start using it today!' ),
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_SCHEDULE,
			false,
			false,
			__( 'Text Generating Scheduling (paid)' ),
			__(
				'Automatically schedule the query to server for seamless text generation with URLsLab service.'
			),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'schedule'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REFRESH_INTERVAL,
			self::FREQ_NEVER,
			false,
			__( 'Content Refresh Interval (paid)' ),
			__(
				'Define how often we should generate refreshed content with the URLsLab service in the background. Be aware that renewal fees correspond to the initial content generation charges.'
			),
			self::OPTION_TYPE_LISTBOX,
			array(
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31536000         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'schedule',
		);
		$this->add_options_form_section(
			'generator',
			__( 'Content Generator' ),
			__(
				'AI may occasionally produce inaccurate content, requiring adjustments for optimal user experience. You can easily review, approve, or edit AI-generated content to ensure quality and accuracy.'
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_AUTOAPPROVE,
			false,
			false,
			__( 'Content Auto Approve' ),
			__(
				'Auto approve AI-generated results and show them instantly on your site.'
			),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'generator'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRACK_USAGE,
			true,
			false,
			__( 'Track Usage of Generated Texts' ),
			__( 'Monitor text usage and track the URLs where the generated content is used during last page view.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'generator'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GENERATOR_MODEL,
			\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			false,
			__( 'Used AI Model' ),
			__( 'Choose an AI model for Content Generator. Keep in mind that certain models may have higher efficiency but also come at a higher cost.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4            => __( 'OpenAI GPT 4' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO    => __( 'OpenAI GPT 3.5 Turbo' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 => __( 'OpenAI GPT Davinci 003' ),
			),
			function( $value ) {
				return \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 == $value;
			},
			'generator',
		);

		$this->add_options_form_section(
			'wpml',
			__( 'WPML Translations' ),
			__(
				'Effortlessly translate content at scale by connecting to WPML\'s translation editor. Experience automatic translations from the source to the target language as you copy the original text. This feature is working only with WPML Classic Translation Editor.'
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSLATE,
			true,
			false,
			__( 'Auto-translating for WPML Classic Translation Editor' ),
			__(
				'Leverage auto-translation in WPML\'s Classic Translation Editor to efficiently minimize time spent translating and ensuring accurate preservation of HTML structure.'
			),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'wpml'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSLATE_MODEL,
			\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			false,
			__( 'Used AI Model for Translations' ),
			__( 'Select an AI model for translation purposes. Keep in mind that certain models may have higher efficiency but also come at a higher cost.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4            => __( 'OpenAI GPT 4' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO    => __( 'OpenAI GPT 3.5 Turbo' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 => __( 'OpenAI GPT Davinci 003' ),
			),
			function( $value ) {
				return \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 == $value;
			},
			'wpml',
		);
	}

	private function track_usage( Urlslab_Generator_Result_Row $obj ) {
		if ( ! $this->get_option( self::SETTING_NAME_TRACK_USAGE ) ) {
			return;
		}
		// track screenshot usage
		$generator_url = new Urlslab_Generator_Url_Row();
		$generator_url->set_url_id( $this->get_current_page_url()->get_url_id() );
		$generator_url->set_shortcode_id( $obj->get_shortcode_id() );
		$generator_url->set_hash_id( $obj->get_hash_id() );
		$generator_url->insert_all( array( $generator_url ), true );
	}

	private function unset_computed_variables( array $atts ) {
		unset( $atts['video_captions'] );
		unset( $atts['video_captions_text'] );
		unset( $atts['video_title'] );
		unset( $atts['video_description'] );
		unset( $atts['video_published_at'] );
		unset( $atts['video_duration'] );
		unset( $atts['video_channel_title'] );
		unset( $atts['video_tags'] );

		return $atts;
	}
}
