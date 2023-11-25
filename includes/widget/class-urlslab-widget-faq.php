<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use YusufKandemir\MicrodataParser\MicrodataDOMDocument;
use YusufKandemir\MicrodataParser\MicrodataParser;

class Urlslab_Widget_Faq extends Urlslab_Widget {
	public const SLUG = 'urlslab-faq';
	const SETTING_NAME_AUTOINCLUDE_TO_CONTENT = 'urlslab-faq-autoinc';
	const SETTING_NAME_AUTOINCLUDE_POST_TYPES = 'urlslab-faq-autoinc-types';
	const SETTING_NAME_FAQ_COUNT = 'urlslab-faq-count';
	const SETTING_NAME_IMPORT_FAQ_FROM_CONTENT = 'urlslab-faq-import-from-content';
	const SETTING_NAME_AUTO_GENERATE_ANSWER = 'urlslab-faq-auto-generate-answer';
	const SETTING_NAME_AUTO_APPROVAL_GENERATED_ANSWER = 'urlslab-faq-auto-approval-generated-answer';
	const SETTING_NAME_FAQ_PROMPT_TEMPLATE_ID = 'urlslab-faq-prompt-template';
	const SETTING_NAME_FAQ_GENERATOR_MODEL = 'urlslab-faq-generator-model';
	const SETTING_NAME_FAQ_DOMAINS = 'urlslab-faq-domains';
	const SETTING_NAME_FAQ_URL_ASSIGNMENT_LAST_SEEN = 'urlslab-faq-url-assignment-last-seen';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'FAQs', 'urlslab' );
	}

	public function get_widget_group() {
		return __( 'SEO', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Improve your site\'s content with an AI-powered FAQ section, optimized for search engine results', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_AI, self::LABEL_FREE, self::LABEL_PAID );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function hook_callback() {
		add_shortcode( $this->get_widget_slug(), array( $this, 'get_shortcode_content' ) );
	}


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
		Urlslab_Loader::get_instance()->add_filter( 'the_content', $this, 'the_content_filter' );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_body_content', $this, 'raw_body_content', 1 );
	}


	public function raw_body_content( $content ) {
		if ( is_404() || ! $this->get_option( self::SETTING_NAME_IMPORT_FAQ_FROM_CONTENT ) || Urlslab_Url::get_current_page_url()->is_blacklisted() ) {
			return $content;
		}

		$dom                      = new MicrodataDOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$dom->encoding            = get_bloginfo( 'charset' );
		$dom->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state    = libxml_use_internal_errors( true );
		$dom->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE );

		$microdata_parser = new MicrodataParser( $dom );

		$microdata = $microdata_parser->toObject();
		libxml_clear_errors();
		libxml_use_internal_errors( $libxml_previous_state );
		if ( property_exists( $microdata, 'items' ) && is_array( $microdata->items ) ) {
			foreach ( $microdata->items as $item ) {
				if ( 'https://schema.org/FAQPage' === $item->type[0] ) {

					if ( ! property_exists( $item, 'properties' ) || ! property_exists( $item->properties, 'mainEntity' ) || ! is_array( $item->properties->mainEntity ) ) {
						continue;
					}
					foreach ( $item->properties->mainEntity as $position => $entity ) {
						if ( isset( $entity->type[0] ) && 'https://schema.org/Question' === $entity->type[0] ) {
							$question = $entity->properties->name[0];

							if ( empty( $question ) || ! property_exists( $entity->properties, 'acceptedAnswer' ) || ! is_array( $entity->properties->acceptedAnswer ) ) {
								continue;
							}

							foreach ( $entity->properties->acceptedAnswer as $answer ) {
								if ( 'https://schema.org/Answer' === $answer->type[0] ) {
									$answer_text = $answer->properties->text[0];
									$faq_id      = $this->add_unique_faq( trim( $question ), trim( $answer_text ) );
									if ( $faq_id ) {
										$faq_url = new Urlslab_Data_Faq_Url();
										$faq_url->set_faq_id( $faq_id );
										$faq_url->set_url_id( Urlslab_Url::get_current_page_url()->get_url_id() );
										$faq_url->set_sorting( $position + 1 );
										$faq_url->insert_all( array( $faq_url ), true );
									}
								}
							}
						}
					}
				}
			}
		}

		return $content;
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
				'url'   => Urlslab_Url::get_current_page_url()->get_url_with_protocol(),
				'count' => $this->get_option( self::SETTING_NAME_FAQ_COUNT ),
			),
			$atts,
			$tag
		);
	}

	public function get_shortcode_content( $atts = array(), $shortcode_content = null, $tag = '' ): string {
		if (
			(
				isset( $_REQUEST['action'] ) && false !== strpos( sanitize_text_field( $_REQUEST['action'] ), 'elementor' ) ) ||
			in_array(
				get_post_status(),
				array(
					'trash',
					'auto-draft',
					'inherit',
				)
			) ||
			( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() )
		) {
			$html_attributes = array();
			foreach ( $this->get_attribute_values( $atts, $shortcode_content, $tag ) as $id => $value ) {
				$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $value ) . '</i>"';
			}

			return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>urlslab-faq</b> ' . implode( ', ', $html_attributes ) . ']</div>';
		}

		$urlslab_atts = $this->get_attribute_values( $atts, $shortcode_content, $tag );
		$content      = '';

		try {
			$current_url     = new Urlslab_Url( $urlslab_atts['url'] );
			$current_url_obj = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( $current_url );
			if ( $current_url_obj ) {
				$result = $this->load_faqs( $current_url_obj->get_url_id(), $urlslab_atts['count'] );
				if ( ! empty( $result ) && is_array( $result ) ) {
					$content .= $this->render_shortcode_header( $urlslab_atts, $shortcode_content );
					foreach ( $result as $faq ) {
						$faq_row = new Urlslab_Data_Faq( $faq );
						$content .= $this->render_shortcode_item( $faq_row, $urlslab_atts );
					}
					$content .= $this->render_shortcode_footer();
				}
			}
		} catch ( Exception $e ) {
		}

		return $content;
	}

	private function load_faqs( string $url_id, int $limit ): array {
		global $wpdb;

		return $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_FAQ_URLS_TABLE . ' u INNER JOIN ' . URLSLAB_FAQS_TABLE . ' as f ON f.faq_id = u.faq_id WHERE u.url_id = %d AND f.status=%s ORDER BY u.sorting LIMIT %d', // phpcs:ignore
				$url_id,
				Urlslab_Data_Faq::STATUS_ACTIVE,
				$limit
			),
			ARRAY_A
		);
	}

	protected function add_options() {
		$this->add_options_form_section(
			'answer-generation',
			__( 'FAQs Automation', 'urlslab' ),
			__( 'When a new FAQ is added to the list, URLsLab can automatically generate answer for your unanswered questions and find the best URL to include that FAQ in. Save the time you spend to manage your FAQs', 'urlslab' ),
			array(
				self::LABEL_PAID,
				self::LABEL_AI,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTO_GENERATE_ANSWER,
			false,
			true,
			__( 'Generate answers automatically', 'urlslab' ),
			__( 'With URLsLab you can automatically generate answer for all your unanswered questions and save the time to answer it yourself.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'answer-generation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTO_APPROVAL_GENERATED_ANSWER,
			false,
			true,
			__( 'Auto approve generated answers', 'urlslab' ),
			__( 'With this setting turned on, right after the answer is generated, you would be able to see the Question with its corresponding answer in your content', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'answer-generation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_PROMPT_TEMPLATE_ID,
			- 1, //Note: cannot use 0, because template_id starts from 0
			false,
			__( 'Prompt Template for Answer Generation', 'urlslab' ),
			__( 'The Prompt Template to use to generate answer for Questions in FAQ Section', 'urlslab' ),
			self::OPTION_TYPE_LISTBOX,
			function() {
				global $wpdb;
				$rows                = array();
				$rows[-1]         = __( 'A prompt of type Question Answering', 'urlslab' );
				$faq_generator_types = $wpdb->get_results( $wpdb->prepare( 'SELECT template_id, template_name FROM ' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE prompt_type = %s', Urlslab_Data_Prompt_Template::ANSWERING_TASK_PROMPT_TYPE ), ARRAY_A ); // phpcs:ignore
				foreach ( $faq_generator_types as $generator_type ) {
					$rows[ $generator_type['template_id'] ] = '[' . $generator_type['template_id'] . '] ' . $generator_type['template_name'];
				}

				return $rows;
			},
			null,
			'answer-generation',
		);
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_GENERATOR_MODEL,
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106,
			false,
			__( 'AI Model', 'urlslab' ),
			__( 'The AI Model to be used for generating answers', 'urlslab' ),
			self::OPTION_TYPE_LISTBOX,
			Urlslab_Connection_Augment::get_valid_ai_models(),
			function( $value ) {
				return Urlslab_Connection_Augment::is_valid_ai_model_name( $value );
			},
			'answer-generation',
		);

		$this->add_options_form_section(
			'auto-url-assignment',
			__( 'URL Assignment Suggestions', 'urlslab' ),
			__( 'You can boost the process of URL Assignment by using our suggestions when editing your FAQs. save yourself ton of time with AI to find the best URL to include your FAQ into.', 'urlslab' ),
			array(
				self::LABEL_PAID,
				self::LABEL_AI,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_DOMAINS,
			Urlslab_Url::get_current_page_url()->get_domain_name(),
			false,
			__( 'Domains to assign FAQs', 'urlslab' ),
			__( 'Define a list of domains that the FAQs can be included in. URLsLab will try to find the best URL out of all these domains to include the FAQ in. For pertinent results, ensure that domains are set for scanning by the URLsLab service.', 'urlslab' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			function( $param ) {
				return is_string( $param );
			},
			'auto-url-assignment'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_URL_ASSIGNMENT_LAST_SEEN,
			7257600,
			false,
			__( 'Include Recently Visited URLs', 'urlslab' ),
			__( 'Assign FAQs to URLs that have been recently analyzed by the URLsLab service', 'urlslab' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400    => __( 'Last 24 hours', 'urlslab' ),
				604800   => __( 'Last 7 days', 'urlslab' ),
				1209600  => __( 'Last 14 days', 'urlslab' ),
				2419200  => __( 'Last 30 days', 'urlslab' ),
				4838400  => __( 'Last 60 days', 'urlslab' ),
				7257600  => __( 'Last 90 days', 'urlslab' ),
				31556926 => __( 'Last year', 'urlslab' ),
				0        => __( 'Any time', 'urlslab' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'auto-url-assignment'
		);

		$this->add_options_form_section(
			'autoinclude',
			__( 'FAQs Configuration', 'urlslab' ),
			__( 'FAQs can be automatically appended to every post type content, eliminating the need for a WordPress shortcode.', 'urlslab' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append a FAQs Section to the Content.', 'urlslab' ),
			__( 'Auto-append FAQs to every post. FAQs will automatically appear after data processing through the URLsLab service.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'autoinclude'
		);

		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_POST_TYPES,
			array_keys( Urlslab_Widget_Related_Resources::get_available_post_types() ),
			true,
			__( 'WordPress Post Types', 'urlslab' ),
			__( 'Choose post types to attach FAQs at the content\'s end. If left unconfigured, FAQs will be added to all post types by default.', 'urlslab' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function() {
				return Urlslab_Widget_Related_Resources::get_available_post_types();
			},
			function( $value ) {
				if ( ! is_array( $value ) ) {
					return false;
				}

				$possible_values = Urlslab_Widget_Related_Resources::get_available_post_types();
				foreach ( $value as $v ) {
					if ( ! isset( $possible_values[ $v ] ) ) {
						return false;
					}
				}

				return true;
			},
			'autoinclude'
		);

		$this->add_options_form_section( 'widget', __( 'FAQ Widget Configuration', 'urlslab' ), __( 'Choose default settings for your FAQ widget. Individual widgets can modify these settings with unique configurations.', 'urlslab' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_COUNT,
			8,
			true,
			__( 'Number of Questions', 'urlslab' ),
			__( 'Set the count of FAQ entries to be added to the content.', 'urlslab' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'widget'
		);

		$this->add_options_form_section(
			'import',
			__( 'FAQ Import', 'urlslab' ),
			__( 'Automatic FAQ item import from existing content according to schema.org items.', 'urlslab' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQ_FROM_CONTENT,
			false,
			true,
			__( 'Import All FAQ Items from Content', 'urlslab' ),
			__( 'Automatically import FAQ items and link them to the current canonical URL from schema.org items. It is recommended to use this option for a short period until you import existing items into URLsLab database, then deactivate it. Importation occurs in real time during page loading.', 'urlslab' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
	}

	private function render_shortcode_header( array $urlslab_atts, $content = null ): string {
		wp_enqueue_style( 'Urlslab_Widget_Faq', plugin_dir_url( URLSLAB_PLUGIN_DIR . 'public/build/css/urlslab_faq.css' ) . 'urlslab_faq.css', false, URLSLAB_VERSION );
		if ( strlen( $content ) ) {
			return '<div class="Urlslab-Faq urlslab-skip-faq" itemscope="" itemtype="https://schema.org/FAQPage">' . $content . '<ul class="Urlslab-Faq__items">';
		}

		return '<div class="Urlslab-Faq urlslab-skip-faq" itemscope="" itemtype="https://schema.org/FAQPage"><h2>' . __( 'Frequently Asked Questions', 'urlslab' ) . '</h2><ul class="Urlslab-Faq__items">';

	}

	private function render_shortcode_footer(): string {
		return '</ul></div>';
	}

	private function render_shortcode_item( Urlslab_Data_Faq $faq_row, array $urlslab_atts ): string {
		$content = '<li class="Urlslab-Faq__item" itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question">';
		$content .= '<h3 itemprop="name">' . esc_html( $faq_row->get_question() ) . '</h3>';
		$content .= '<div class="Urlslab-Faq__outer-wrapper" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer"><div class="Urlslab-Faq__inner-wrapper" itemprop="text"><p>' . wp_kses_post( $faq_row->get_answer() ) . '</p></div></div></li>';

		return $content;
	}

	private function add_unique_faq( $question, $answer_text ): int {
		if ( empty( $question ) || empty( $answer_text ) ) {
			return 0;
		}

		global $wpdb;
		$lang   = $this->get_current_language_code();
		$result = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_FAQS_TABLE . ' WHERE question = %s and (language=%s OR language=%s)', $question, 'all', $lang ), ARRAY_A ); // phpcs:ignore
		foreach ( $result as $row ) {
			$faq = new Urlslab_Data_Faq( $row );
			if ( $faq->get_answer() === $answer_text && $faq->get_question() === $question ) {
				return $faq->get_faq_id();
			}
		}

		$faq_row = new Urlslab_Data_Faq();
		$faq_row->set_question( $question );
		$faq_row->set_answer( $answer_text );
		$faq_row->set_language( $lang );
		$faq_row->set_status( Urlslab_Data_Faq::STATUS_ACTIVE );
		$faq_row->insert();

		return $faq_row->get_faq_id();
	}

	public function register_routes() {
		( new Urlslab_Api_Faq() )->register_routes();
		( new Urlslab_Api_Faq_Urls() )->register_routes();
	}
}
