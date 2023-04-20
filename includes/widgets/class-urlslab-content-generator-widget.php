<?php

class Urlslab_Content_Generator_Widget extends Urlslab_Widget {
	public const SLUG = 'urlslab-generator';
	public const SETTING_NAME_SCHEDULE = 'urlslab-gen-sched';
	public const SETTING_NAME_REFRESH_INTERVAL = 'urlslab-gen-refresh';
	public const SETTING_NAME_AUTOAPPROVE = 'urlslab-gen-autoapprove';
	public const SETTING_NAME_TRANSLATE = 'urlslab-gen-translate';
	public const SETTING_NAME_GENERATOR_MODEL = 'urlslab-gen-model';
	public const SETTING_NAME_TRANSLATE_MODEL = 'urlslab-gen-translate-model';

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
			is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' )
		) {
			wp_enqueue_script( 'urlslab-admin-script', URLSLAB_PLUGIN_URL . 'admin/js/urlslab-wpml.js', array( 'jquery' ), URLSLAB_VERSION );
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

	public function get_shortcode_content(
		$atts = array(),
		$content = null,
		$tag = ''
	): string {
		if (
			(
				isset( $_REQUEST['action'] )
				&& false !== strpos(
					$_REQUEST['action'],
					'elementor'
				)
			)
			|| in_array(
				get_post_status(),
				array( 'trash', 'auto-draft', 'inherit' )
			)
			|| ( class_exists( '\Elementor\Plugin' )
				 && \Elementor\Plugin::$instance->editor->is_edit_mode() )
		) {
			$html_attributes = array();
			foreach ( $this->get_attribute_values( $atts, $content, $tag ) as $id => $value ) {
				if ( 'url_filter' !== $id && 'semantic_context' !== $id ) {
					$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $value ) . '</i>"';
				}
			}

			return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>urlslab-generator</b> ' . implode( ', ', $html_attributes ) . ']</div>';
		}

		$atts  = $this->get_attribute_values( $atts, $content, $tag );
		$obj   = new Urlslab_Content_Generator_Row( $atts, false );
		$value = $atts['default_value'];
		if ( $obj->is_valid() ) {
			if ( $obj->load() ) {
				if ( $obj->is_active() ) {
					$value = $obj->get_result();
				}
			} else {
				$obj->set_status( Urlslab_Content_Generator_Row::STATUS_NEW );
				$obj->insert_all( array( $obj ), true );
			}
		}

		if ( ! empty( $value ) ) {
			if ( empty( $atts['template'] ) ) {
				return $value;
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
				$atts['result'] = $value;
				load_template( $template, true, $atts );

				return '' . ob_get_clean();
			}
		} else {
			return '';
		}
	}

	public
	function get_attribute_values(
		$atts = array(), $content = null, $tag = ''
	): array {
		$atts            = array_change_key_case( (array) $atts );
		$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $this->get_current_page_url() );
		if ( ! empty( $current_url_obj ) ) {
			$title = $current_url_obj->get_summary_text(
				Urlslab_Link_Enhancer::DESC_TEXT_TITLE
			);
		} else {
			$title = get_the_title();
		}

		$replacements = array(
			'www.',
			'https://',
			'http://',
		);

		$atts = shortcode_atts(
			array(
				'semantic-context' => $title,
				'command'          => 'Summarize information I gave you. Generate summarization in language |lang|.',
				'source-url'       => str_replace( $replacements, '', $this->get_current_page_url()->get_domain_name() ) . '*',
				'template'         => '',
				'default_value'    => '',
				'lang'             => $this->get_current_language(),
			),
			$atts,
			$tag
		);

		$atts['semantic_context'] = $atts['semantic-context'];
		$atts['url_filter']       = $atts['source-url'];

		return $atts;
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
			__(
				'Texts are generated by the URLsLab service, a paid feature of the module. Buy credits on www.urlslab.com and start using it today!'
			)
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
			self::SETTING_NAME_GENERATOR_MODEL,
			\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			false,
			__( 'Content Generator AI model' ),
			__( 'Choose quality of model, which we will use for Content Generator widget. Difference between models is not just the quality, but also proce (GPT4 is 10x more expensive as other models).' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4            => __( 'GPT 4' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO    => __( 'GPT 3.5 Turbo' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 => __( 'GPT Davinci 003' ),
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
			false,
			false,
			__( 'Use our auto-translating feature with copy buttons ' ),
			__(
				'Translation will be generated upon clicking "Copy from Original" or "Copy All Fields from Original," ensuring accurate preservation of HTML structure. The original functionality of those buttons will be replaced!'
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
			__( 'Translation model' ),
			__( 'Choose quality of model used for translation task in WPML editor. Difference between models is not just the quality, but also proce (GPT4 is 10x more expensive as other models).' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4            => __( 'GPT 4' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO    => __( 'GPT 3.5 Turbo' ),
				\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 => __( 'GPT Davinci 003' ),
			),
			function( $value ) {
				return \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4 == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO == $value ||
					   \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003 == $value;
			},
			'wpml',
		);
	}
}
