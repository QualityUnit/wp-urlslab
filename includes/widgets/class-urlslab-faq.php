<?php

use YusufKandemir\MicrodataParser\Microdata;
use YusufKandemir\MicrodataParser\MicrodataDOMDocument;
use YusufKandemir\MicrodataParser\MicrodataParser;

class Urlslab_Faq extends Urlslab_Widget {
	public const SLUG = 'urlslab-faq';
	const SETTING_NAME_AUTOINCLUDE_TO_CONTENT = 'urlslab-faq-autoinc';
	const SETTING_NAME_AUTOINCLUDE_POST_TYPES = 'urlslab-faq-autoinc-types';
	const SETTING_NAME_FAQ_COUNT = 'urlslab-faq-count';
	const SETTING_NAME_IMPORT_FAQ_FROM_CONTENT = 'urlslab-faq-import-from-content';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Frequently asked questions' );
	}

	public function get_widget_description(): string {
		return __( 'Enhance content of your website with frequently asked questions block. Optionally let AI to build the content of FAQ for you.' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID, self::LABEL_AI );
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
		if ( is_404() || ! $this->get_option( self::SETTING_NAME_IMPORT_FAQ_FROM_CONTENT ) ) {
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
										$faq_url = new Urlslab_Faq_Url_Row();
										$faq_url->set_faq_id( $faq_id );
										$faq_url->set_url_id( Urlslab_Url::get_current_page_url()->get_url_id() );
										$faq_url->set_sorting( $position + 1 );
										if ( $faq_url->insert() ) {
											$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
											if ( Urlslab_Url_Row::FAQ_STATUS_ACTIVE !== $current_url_obj->get_faq_status() ) {
												$current_url_obj->set_faq_status( Urlslab_Url_Row::FAQ_STATUS_ACTIVE );
												$current_url_obj->update();
											}
										}
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
			( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() )
		) {
			$html_attributes = array();
			foreach ( $this->get_attribute_values( $atts, $content, $tag ) as $id => $value ) {
				$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $value ) . '</i>"';
			}

			return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>urlslab-faq</b> ' . implode( ', ', $html_attributes ) . ']</div>';
		}

		$urlslab_atts = $this->get_attribute_values( $atts, $content, $tag );
		$content      = '';

		try {
			$current_url     = new Urlslab_Url( $urlslab_atts['url'] );
			$current_url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $current_url );
			if ( $current_url_obj ) {
				$current_url_obj->request_faq_schedule();

				if ( Urlslab_Url_Row::FAQ_STATUS_ACTIVE === $current_url_obj->get_faq_status() ) {
					$result = $this->load_faqs( $current_url_obj->get_url_id(), $urlslab_atts['count'] );
					if ( ! empty( $result ) && is_array( $result ) ) {
						$content .= $this->render_shortcode_header( $urlslab_atts );
						foreach ( $result as $faq ) {
							$faq_row = new Urlslab_Faq_Row( $faq );
							$content .= $this->render_shortcode_item( $faq_row, $urlslab_atts );
						}
						$content .= $this->render_shortcode_footer();
					}
				}
			}
		} catch ( Exception $e ) {
		}

		return $content;
	}

	private function load_faqs( string $url_id, int $limit ): array {
		global $wpdb;
		$faqs_table     = URLSLAB_FAQS_TABLE;
		$faq_urls_table = URLSLAB_FAQ_URLS_TABLE;
		$q              = "SELECT * FROM $faq_urls_table u INNER JOIN $faqs_table as f ON f.faq_id = u.faq_id WHERE u.url_id = %d AND f.status = '%s' ORDER BY u.sorting LIMIT %d";

		return $wpdb->get_results( $wpdb->prepare( $q, $url_id, Urlslab_Faq_Row::STATUS_ACTIVE, $limit ), ARRAY_A ); // phpcs:ignore
	}

	protected function add_options() {
		$this->add_options_form_section(
			'autoinclude',
			__( 'Automatic FAQ' ),
			__( 'We can automatically include FAQs at the end of each content without the need for a WordPress shortcode in custom templates.' ),
			array(
				self::LABEL_SEO,
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append FAQs section to the Content' ),
			__( 'Automatically add FAQs at the end of each post. FAQs will be visible automatically once the data are processed in the URLsLab service. Depending on the amount of data, it can take a few hours or days.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'autoinclude',
			array( self::LABEL_SEO )
		);

		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_POST_TYPES,
			false,
			true,
			__( 'WordPress Post Types' ),
			__( 'Select post types to append FAQs at the end of the content. If you don\'t configure anything, it will be added to all post types automatically.' ),
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

		$this->add_options_form_section( 'widget', __( 'FAQ Widget Default Values' ), __( 'Choose default value for your FAQ widget. Each widget can be overwrite these values with custom settings.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_FAQ_COUNT,
			8,
			true,
			__( 'Number of questions' ),
			__( 'Define the number of FAQ items to be appended to the content.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'widget',
			array( self::LABEL_PERFORMANCE )
		);

		$this->add_options_form_section(
			'import',
			__( 'FAQ Import' ),
			__( 'Automatically import FAQ items from existing content based on the Schema.org items' ),
			array(
				self::LABEL_EXPERT,
				self::LABEL_EXPERIMENTAL,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQ_FROM_CONTENT,
			false,
			true,
			__( 'Import all FAQ items from content' ),
			__( 'Automatically import FAQ items and assign them to current canonical URL from schema.org items. This option is recommened to use just limited time until you import existing items to UrlsLab tables and than switch off. Imported works on the fly during page load. Import can slow down the page load, therefore use it just for limited amount of time.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import',
			array(
				self::LABEL_EXPERT,
				self::LABEL_EXPERIMENTAL,
			)
		);
	}

	private function render_shortcode_header( array $urlslab_atts ): string {
		return '<div class="Urlslab-Faq urlslab-skip-faq" itemscope="" itemtype="https://schema.org/FAQPage"><h2 id="faq">' . __( 'Frequently asked questions' ) . '</h2>';
	}

	private function render_shortcode_footer(): string {
		return '</div>';
	}

	private function render_shortcode_item( Urlslab_Faq_Row $faq_row, array $urlslab_atts ): string {
		$content = '<div class="Urlslab-Faq__item" itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question">';
		$content .= '<h3 itemprop="name">' . esc_html( $faq_row->get_question() ) . '</h3>';
		$content .= '<div class="Urlslab-Faq__outer-wrapper" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer"><div class="Urlslab-Faq__inner-wrapper" itemprop="text">' . wp_kses_post( $faq_row->get_answer() ) . '</div></div></div>';

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
			$faq = new Urlslab_Faq_Row( $row );
			if ( $faq->get_answer() === $answer_text && $faq->get_question() === $question ) {
				return $faq->get_faq_id();
			}
		}

		$faq_row = new Urlslab_Faq_Row();
		$faq_row->set_question( $question );
		$faq_row->set_answer( $answer_text );
		$faq_row->set_language( $lang );
		$faq_row->set_status( Urlslab_Faq_Row::STATUS_ACTIVE );
		$faq_row->insert();

		return $faq_row->get_faq_id();
	}

}
