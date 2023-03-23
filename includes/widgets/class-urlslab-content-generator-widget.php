<?php

class Urlslab_Content_Generator_Widget extends Urlslab_Widget {
	const SLUG = 'urlslab-generator';
	const SETTING_NAME_SCHEDULE = 'urlslab-gen-sched';
	const SETTING_NAME_REFRESH_INTERVAL = 'urlslab-gen-refresh';
	const SETTING_NAME_AUTOAPPROVE = 'urlslab-gen-autoapprove';


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}

	public function hook_callback() {
		add_shortcode( $this->get_widget_slug(), array( $this, 'get_shortcode_content' ) );
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Content_Generator_Widget::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Content Generator' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'AI generated content based on the context of your page and custom query.' );
	}


	public function get_attribute_values( $atts = array(), $content = null, $tag = '' ) {
		$atts = array_change_key_case( (array) $atts );

		$urlslab_atts = shortcode_atts(
			array(
				'query'         => '',
				'context'       => '',
				'template'      => '',
				'default-value' => '',
				'lang'          => $this->get_current_language(),
			),
			$atts,
			$tag
		);

		return $urlslab_atts;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {

		$obj   = new Urlslab_Content_Generator_Row( $this->get_attribute_values( $atts, $content, $tag ), false );
		$value = $atts['default-value'];
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
			if ( ! locate_template( $atts['template'], false, false, $atts ) ) {
				return $value;
			}

			ob_start();
			$atts['result'] = $value;
			locate_template( $atts['template'], true, false, $atts );

			return '' . ob_get_clean();
		}

		return '';
	}

	public function has_shortcode(): bool {
		return true;
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'generate', __( 'Scheduling Settings' ), __( 'Automatically generate text for scheduled queries on background. Every request costs some credits.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SCHEDULE,
			false,
			false,
			__( 'Automatic Scheduling (paid)' ),
			__( 'Automatically schedule the query to server and generate content for every short code.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'schedule'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTOAPPROVE,
			false,
			false,
			__( 'Auto-approve' ),
			__( 'Automatically Approve all results genertaed by AI and display them online.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'generate'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REFRESH_INTERVAL,
			999999999,
			3600,
			__( 'Refresh Interval' ),
			__( 'How often should the content be refreshed. It is wise to generate the content just once if your content is not changing often. For regenerating the content we will decrease your credits in the same way as if we would generate new content piece.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				604800    => __( 'Weekly' ),
				2419200   => __( 'Monthly' ),
				7257600   => __( 'Quarterly' ),
				31536000  => __( 'Yearly' ),
				999999999 => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'generate',
		);
	}


}
