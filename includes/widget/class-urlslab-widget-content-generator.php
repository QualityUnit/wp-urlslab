<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;

class Urlslab_Widget_Content_Generator extends Urlslab_Widget {
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
		return __( 'AI Content Generator', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Effortlessly improve your website\'s content with our AI-driven module that creates distinctive texts', 'urlslab' );
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

		$obj = $this->get_shortcode_row( (int) $atts['id'] );

		if ( $obj->is_loaded_from_db() ) {
			if ( Urlslab_Data_Generator_Shortcode::TYPE_VIDEO == $obj->get_shortcode_type() ) {
				if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $atts['videoid'] ) ) {
					if ( $this->is_edit_mode() ) {
						$atts['STATUS'] = __( 'Invalid videoid attribute!', 'urlslab' );

						return $this->get_placeholder_html( $atts, self::SLUG );
					}

					return '';
				}
				$video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
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

		$extracted_data = array(
			'shortcode_id'     => $atts['id'],
			'semantic_context' => $this->get_template_value( $obj->get_semantic_context(), $atts ),
			'prompt_variables' => json_encode( $this->unset_computed_variables( $atts ) ),
			'url_filter'       => $this->get_template_value( $obj->get_url_filter(), $atts ),
		);
		$obj_result     = new Urlslab_Data_Generator_Result(
			$extracted_data,
			false
		);

		if ( $obj_result->load() ) {
			if ( $obj_result->is_active() ) {
				$value = $obj_result->get_result();
			} else {
				$value = $atts['default_value'] ?? $obj->get_default_value();
			}
		} else {
			$value     = $atts['default_value'] ?? $this->get_template_value( $obj->get_default_value(), $atts );
			$task_data = array_merge(
				$extracted_data,
				array(
					'shortcode_row' => $obj->as_array(),
				)
			);
			$this->create_generator_task( $obj_result->get_hash_id(), $task_data, $atts );
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
							$template = URLSLAB_PLUGIN_DIR . 'public/' . $atts['template'];
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

	private function get_shortcode_row( int $shortcode_id ): Urlslab_Data_Generator_Shortcode {
		if ( ! isset( self::$shortcodes_cache[ $shortcode_id ] ) ) {
			self::$shortcodes_cache[ $shortcode_id ] = new Urlslab_Data_Generator_Shortcode( array( 'shortcode_id' => $shortcode_id ), false );
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

	public function get_att_values( Urlslab_Data_Generator_Shortcode $obj, $atts = array(), $required_variables = array() ): array {
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
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_captions'] = $obj_video->get_captions();
						}
						break;
					case 'video_captions_text':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_captions_text'] = $obj_video->get_captions_as_text();
						}
						break;
					case 'video_title':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_title'] = $obj_video->get_title();
						}
						break;
					case 'video_description':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_description'] = $obj_video->get_description();
						}
						break;
					case 'video_published_at':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_published_at'] = $obj_video->get_published_at();
						}
						break;
					case 'video_duration':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_duration'] = $obj_video->get_duration();
						}
						break;
					case 'video_channel_title':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_channel_title'] = $obj_video->get_channel_title();
						}
						break;
					case 'video_tags':
						$obj_video = Urlslab_Data_Youtube::get_video_obj( $atts['videoid'] );
						if ( $obj_video->is_loaded_from_db() && $obj_video->is_active() ) {
							$atts['video_tags'] = $obj_video->get_video_tags();
						}
						break;
					case 'page_url':
						$atts['page_url'] = Urlslab_Url::get_current_page_url()->get_url_with_protocol();
						break;
					case 'page_title':
						$current_url_obj = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
						if ( ! empty( $current_url_obj ) ) {
							$atts['page_title'] = $current_url_obj->get_summary_text( Urlslab_Widget_Urls::DESC_TEXT_H1 );
						}
						if ( empty( $atts['page_title'] ) ) {
							$atts['page_title'] = wp_title( ' ', false );
						}
						break;
					case 'domain':
						$atts['domain'] = Urlslab_Url::get_current_page_url()->get_domain_name();
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

		return nl2br( $value );
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
			__( 'Schedule Configuration', 'urlslab' ),
			__( 'Texts are produced by the URLsLab service, a premium feature of this plugin. Purchase credits at www.urlslab.com and begin utilizing it immediately!', 'urlslab' ),
			array(
				self::LABEL_PAID,
				self::LABEL_AI,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_SCHEDULE,
			true,
			false,
			__( 'Text Generation', 'urlslab' ),
			__( 'Schedule server queries automatically for continuous text generation via the URLsLab service.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'schedule'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REFRESH_INTERVAL,
			7257600,
			false,
			__( 'Content Update Frequency', 'urlslab' ),
			__( 'Specify the frequency for updating content using URLsLab service in the background. Keep in mind, the costs for renewing are the same as the charges for initial content creation.', 'urlslab' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				604800           => __( 'Weekly', 'urlslab' ),
				2419200          => __( 'Monthly', 'urlslab' ),
				7257600          => __( 'Quarterly', 'urlslab' ),
				31536000         => __( 'Yearly', 'urlslab' ),
				self::FREQ_NEVER => __( 'Never', 'urlslab' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'schedule',
		);
		$this->add_options_form_section(
			'generator',
			__( 'Content Generator Configuration', 'urlslab' ),
			__( 'AI can sometimes generate content that isn\'t accurate, needing alterations for a better user experience. Easily oversee, confirm, or change AI-created content to maintain its quality and correctness.', 'urlslab' ),
			array( self::LABEL_PAID, self::LABEL_AI )
		);

		$this->add_option_definition(
			self::SETTING_NAME_AUTOAPPROVE,
			false,
			false,
			__( 'Automatic Content Approval', 'urlslab' ),
			__( 'Automatically validate AI-produced outcomes and immediately display them on your website.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'generator'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRACK_USAGE,
			true,
			false,
			__( 'Monitor Generated Text Utilization', 'urlslab' ),
			__( 'Monitor text usage and identify the URLs where the produced content was displayed during page visits.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'generator'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GENERATOR_MODEL,
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106,
			false,
			__( 'AI Model', 'urlslab' ),
			__( 'Select an AI model for the Content Generator. Remember, efficiency may come at a higher cost for certain models.', 'urlslab' ),
			self::OPTION_TYPE_LISTBOX,
			Urlslab_Connection_Augment::get_valid_ai_models(),
			function( $value ) {
				return Urlslab_Connection_Augment::is_valid_ai_model_name( $value );
			},
			'generator',
		);
		if ( defined( 'ICL_SITEPRESS_VERSION' ) && defined( 'ICL_LANGUAGE_CODE' ) ) {
			$this->add_options_form_section(
				'wpml',
				__( 'WPML Integration', 'urlslab' ),
				__( 'Seamlessly translate content on a large scale by pairing with WPML\'s translation editor. Enjoy automatic translations from the original to the desired language. This function only works with WPML\'s Classic Translation Editor.', 'urlslab' ),
				array( self::LABEL_PAID, self::LABEL_AI )
			);
			$this->add_option_definition(
				self::SETTING_NAME_TRANSLATE,
				true,
				false,
				__( 'Integration with WPML\'s Classic Translation Editor', 'urlslab' ),
				__( 'Use automatic translation in WPML\'s Classic Translation Editor for efficient translation time and accurate HTML structure retention.', 'urlslab' ),
				self::OPTION_TYPE_CHECKBOX,
				false,
				null,
				'wpml'
			);
			$this->add_option_definition(
				self::SETTING_NAME_TRANSLATE_MODEL,
				DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106,
				false,
				__( 'AI Model', 'urlslab' ),
				__( 'Select an AI model for translations. Remember, efficiency may come at a higher cost for certain models.', 'urlslab' ),
				self::OPTION_TYPE_LISTBOX,
				array(
					DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__4_1106_PREVIEW => 'OpenAI GPT 4 Turbo 128K',
					DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106 => 'OpenAI GPT 3.5 Turbo 16K',
				),
				function( $value ) {
					return DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__4_1106_PREVIEW == $value
						   || DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106 == $value;
				},
				'wpml',
			);
		}
	}

	private function track_usage( Urlslab_Data_Generator_Result $obj ) {
		if ( ! $this->get_option( self::SETTING_NAME_TRACK_USAGE ) || Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
			return;
		}
		// track screenshot usage
		$generator_url = new Urlslab_Data_Generator_Url();
		$generator_url->set_url_id( Urlslab_Url::get_current_page_url()->get_url_id() );
		$generator_url->set_shortcode_id( $obj->get_shortcode_id() );
		$generator_url->set_hash_id( $obj->get_hash_id() );
		$generator_url->insert_all( array( $generator_url ), true );
	}

	private function create_generator_task( $shortcode_hash_id, array $shortcode_data, $atts ) {
		global $wpdb;
		$task = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_GENERATOR_TASKS_TABLE . ' WHERE shortcode_hash_id = %s', //phpcs:ignore
				$shortcode_hash_id
			)
		);

		if ( ! empty( $task ) ) {
			return;
		}

		$task_data            = array_merge( $shortcode_data, $atts );
		$task_data['hash_id'] = $shortcode_hash_id;
		$data                 = array(
			'generator_type'    => Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE,
			'task_status'       => Urlslab_Data_Generator_Task::STATUS_NEW,
			'task_data'         => json_encode( $task_data ),
			'shortcode_hash_id' => $shortcode_hash_id,
		);
		$generator_task       = new Urlslab_Data_Generator_Task( $data );
		$generator_task->insert_all( array( $generator_task ) );
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

	public function register_routes() {
		( new Urlslab_Api_Generators() )->register_routes();
		( new Urlslab_Api_Prompt_Template() )->register_routes();
		( new Urlslab_Api_Shortcodes() )->register_routes();
		( new Urlslab_Api_Process() )->register_routes();
	}

	public function get_widget_group() {
		return __( 'SEO', 'urlslab' );
	}
}
