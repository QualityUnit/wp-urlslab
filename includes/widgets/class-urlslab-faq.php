<?php

class Urlslab_Faq extends Urlslab_Widget {
	public const SLUG = 'faq';
	const SETTING_NAME_AUTOINCLUDE_TO_CONTENT = 'urlslab-faq-autoinc';
	const SETTING_NAME_AUTOINCLUDE_POST_TYPES = 'urlslab-faq-autoinc-types';

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

	protected function add_options() {
		$this->add_options_form_section( 'autoinclude', __( 'FAQ Settings' ), __( 'We can automatically include FAQs at the end of each content without the need for a WordPress shortcode in custom templates.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTOINCLUDE_TO_CONTENT,
			false,
			true,
			__( 'Append FAQs section to the Content' ),
			__( 'Automatically add FAQs at the end of each post. FAQs will be visible automatically once the data are processed in the URLsLab service. Depending on the amount of data, it can take a few hours or days.' ),
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
	}

}
