<?php

abstract class Urlslab_Widget {
	public const FREQ_NEVER = 999999999;

	public const OPTION_TYPE_CHECKBOX = 'checkbox';
	public const OPTION_TYPE_BUTTON_API_CALL = 'api_button';
	public const OPTION_TYPE_TEXT = 'text';
	public const OPTION_TYPE_TEXTAREA = 'textarea';
	public const OPTION_TYPE_PASSWORD = 'password';
	public const PASSWORD_PLACEHOLDER = '********';

	public const OPTION_TYPE_LISTBOX = 'listbox';
	public const OPTION_TYPE_DATETIME = 'datetime';
	public const OPTION_TYPE_MULTI_CHECKBOX = 'multicheck';
	public const OPTION_TYPE_NUMBER = 'number';
	public const OPTION_TYPE_HIDDEN = 'hidden';

	public const LABEL_PAID = 'paid';
	public const LABEL_FREE = 'free';
	public const LABEL_EXPERIMENTAL = 'experimental';
	public const LABEL_BETA = 'beta';
	public const LABEL_ALPHA = 'alpha';
	public const LABEL_EXPERT = 'expert';
	public const LABEL_SEO = 'seo';
	public const LABEL_PERFORMANCE = 'performance';
	public const LABEL_TOOLS = 'tools';
	public const LABEL_AI = 'ai';
	public const LABEL_CRON = 'cron';

	private $options = false;
	private $option_sections = array();

	public function init_widget() {}

	/**
	 * @return string Widget slug for identifying the widget
	 */
	abstract public function get_widget_slug(): string;

	/**
	 * @return string Widget Title
	 */
	abstract public function get_widget_title(): string;

	/**
	 * @return string Widget Description
	 */
	abstract public function get_widget_description(): string;

	/**
	 * @param $atts    array attributes of the shortcode
	 * @param $content string the content of the shortcode
	 * @param $tag     string the tag related to shortcode
	 */
	public function get_shortcode_content(
		$atts = array(),
		$content = null,
		$tag = ''
	): string {
		return '';
	}

	/**
	 * @return bool indicates if this widget generates any shortcode
	 */
	public function has_shortcode(): bool {
		return false;
	}

	public function is_api_key_required(): bool {
		return false;
	}

	/**
	 * @param mixed $section_id
	 *
	 * @return array - liest of module settings, where id is setting name and value is setting value
	 */
	public function get_options( $section_id = false ): array {
		if ( empty( $this->options ) ) {
			$this->init_options();
		}

		$result = array();

		foreach ( $this->options as $option_id => $option ) {
			switch ( $option['type'] ) {
				case self::OPTION_TYPE_PASSWORD:
					if ( get_option( $option_id, $option['default'] ?? false ) ) {
						$option['value'] = self::PASSWORD_PLACEHOLDER;
					} else {
						$option['value'] = '';
					}

					break;

				case self::OPTION_TYPE_CHECKBOX:
					$value = $this->get_option( $option_id );
					if ( $value ) {
						$option['value'] = true;
					} else {
						$option['value'] = false;
					}

					break;

				case self::OPTION_TYPE_LISTBOX:
					$value                     = $this->get_option( $option_id );
					$possible_values           = $this->get_option_possible_values(
						$option_id
					);
					$option['possible_values'] = $possible_values;
					if ( ! isset( $possible_values[ $value ] ) ) {
						$value = $option['default'];
					}
					$option['value'] = $value;

					break;

				case self::OPTION_TYPE_MULTI_CHECKBOX:
					$values = $this->get_option( $option_id );
					if ( ! is_array( $values ) ) {
						$values = explode(
							',',
							trim( $values, ", \t\n\r\0\x0B" )
						);
					}
					$possible_values           = $this->get_option_possible_values(
						$option_id
					);
					$option['possible_values'] = $possible_values;
					foreach ( $values as $id => $value ) {
						if ( ! isset( $possible_values[ $value ] ) ) {
							unset( $values[ $id ] );
						}
					}
					$option['value'] = array_values( $values );

					break;

				default:
					$option['value'] = $this->get_option( $option_id );
			}
			if ( false == $section_id || $option['section'] == $section_id ) {
				$result[ $option_id ] = $option;
			}
		}

		return $result;
	}

	public function get_option( $option_id ) {
		if ( ! $this->option_exists( $option_id ) ) {
			return null;
		}

		$value = getenv( $option_id );
		if ( false !== $value ) {
			return $value;
		}

		if ( ! isset( $this->options[ $option_id ]['value'] ) ) {
			$this->options[ $option_id ]['value'] = get_option( $option_id, $this->options[ $option_id ]['default'] ?? false );
		}

		return $this->options[ $option_id ]['value'];
	}

	public function option_exists( $option_id ) {
		if ( false === $this->options ) {
			$this->init_options();
		}

		return isset( $this->options[ $option_id ] );
	}

	public function get_option_sections(): array {
		if ( empty( $this->option_sections ) ) {
			$this->init_options();
		}

		return $this->option_sections;
	}

	public function add_options_on_activate() {
		if ( false === $this->options ) {
			$this->init_options();
		}
		foreach ( $this->options as $option ) {
			if ( self::OPTION_TYPE_BUTTON_API_CALL !== $option['type'] ) {
				add_option(
					$option['id'],
					$option['default'] ?? false,
					'',
					$option['autoload'] ?? true
				);
			}
		}
	}

	public function update_option( $option_id, $value ): bool {
		if ( ! $this->option_exists( $option_id ) ) {
			return false;
		}

		if ( self::OPTION_TYPE_BUTTON_API_CALL === $this->options[ $option_id ]['type'] ) {
			return true;
		}

		if ( null !== $this->options[ $option_id ]['validator'] ) {
			if ( ! call_user_func(
				$this->options[ $option_id ]['validator'],
				$value
			)
			) {
				return false;
			}
		}

		$posible_values = $this->get_option_possible_values( $option_id );
		if ( ! empty( $posible_values ) ) {
			if ( is_array( $value ) ) {
				foreach ( $value as $val ) {
					if ( ! isset( $posible_values[ $val ] ) ) {
						return false;
					}
				}
			} else {
				if ( ! isset( $posible_values[ $value ] ) ) {
					return false;
				}
			}
		}

		switch ( $this->options[ $option_id ]['type'] ) {
			case self::OPTION_TYPE_CHECKBOX:
				$value = (int) $value;
				break;

			case self::OPTION_TYPE_MULTI_CHECKBOX:
				if ( is_array( $value ) ) {
					$value = implode( ',', $value );
				}

				break;

			case self::OPTION_TYPE_PASSWORD:
				if ( self::PASSWORD_PLACEHOLDER === $value ) {
					return true;
				}

				break;

			default:
				break;
		}

		if ( $value === $this->get_option( $option_id ) ) {
			return true;
		} else {
			$this->options[ $option_id ]['value'] = $value;

			return update_option( $option_id, $value );
		}
	}

	protected function add_options() {}

	public function get_widget_labels(): array {
		return array();
	}

	protected function add_options_form_section( $id, $title, $description, $labels = array() ) {
		$this->option_sections[ $id ] = array(
			'id'          => $id,
			'title'       => $title,
			'description' => $description,
			'labels'      => $labels,
		);
	}

	/**
	 * @param array|callable|false $possible_values
	 * @param mixed $default_value
	 * @param mixed $type
	 * @param mixed $form_section_id
	 */
	protected function add_option_definition(
		string $option_id,
		$default_value = false,
		bool $autoload = true,
		string $title = '',
		string $description = '',
		$type = self::OPTION_TYPE_CHECKBOX,
		$possible_values = false,
		callable $validator = null,
		$form_section_id = 'default',
		$labels = array()
	) {
		if ( empty( $this->option_sections ) ) {
			$this->option_sections[] = array(
				'id'          => 'default',
				'title'       => __( 'Module Settings' ),
				'description' => '',
				'labels'      => array(),
			);
		}

		if (
			$form_section_id
			&& ! isset( $this->option_sections[ $form_section_id ] )
		) {
			$form_section_id = 'default';
		}
		$this->options[ $option_id ] = array(
			'id'              => $option_id,
			'default'         => $default_value,
			'autoload'        => $autoload,
			'title'           => $title,
			'description'     => $description,
			'type'            => $type,
			'possible_values' => $possible_values,
			'validator'       => $validator,
			'section'         => $form_section_id,
			'labels'          => $labels,
		);
	}

	protected function is_skip_elemenet( DOMNode $dom, $custom_widget_skip = '' ): bool {
		return $dom->hasAttributes() && $dom->hasAttribute( 'class' )
			   && ( ( ! empty( $custom_widget_skip )
					  && false !== strpos( $dom->getAttribute( 'class' ), 'urlslab-skip-' . $custom_widget_skip ) )
					|| ( false !== strpos( $dom->getAttribute( 'class' ), 'urlslab-skip-all' ) ) );
	}

	protected function get_current_language_code() {
		global $sitepress, $polylang;

		if ( ! empty( $sitepress ) && is_object( $sitepress ) && method_exists( $sitepress, 'get_active_languages' ) ) {
			return apply_filters( 'wpml_current_language', null );
		}

		if ( ! empty( $polylang ) && function_exists( 'pll_current_language' ) && strlen( pll_current_language() ) ) {
			return pll_current_language();
		}

		return substr( get_locale(), 0, 2 );
	}

	protected function get_current_language_name() {
		if ( function_exists( 'wpml_get_active_languages_filter' ) ) {
			$languages = wpml_get_active_languages_filter( '', array( 'skip_missing' => 0 ) );
			$lang_code = $this->get_current_language_code();
			if ( isset( $languages[ $lang_code ]['translated_name'] ) ) {
				$language_name = $languages[ $lang_code ]['translated_name'];
			} else {
				$language_name = get_bloginfo( 'language' );
			}
		} else {
			$language_name = get_bloginfo( 'language' );
		}

		return $language_name;
	}

	private function init_options() {
		$this->options = array();
		$this->add_options();
	}

	private function get_option_possible_values( $option_id ): array {
		if (
			isset( $this->options[ $option_id ]['possible_values'] )
		) {
			if (
				is_callable(
					$this->options[ $option_id ]['possible_values']
				)
			) {
				return call_user_func(
					$this->options[ $option_id ]['possible_values']
				);
			}
			if (
				is_array(
					$this->options[ $option_id ]['possible_values']
				)
			) {
				return $this->options[ $option_id ]['possible_values'];
			}
		}

		return array();
	}

	public function uninstall() {
		foreach ( $this->options as $option_id => $option ) {
			delete_option( $option_id );
		}
	}

	protected function is_edit_mode(): bool {
		$arr_modes = array(
			'trash',
			'auto-draft',
			'inherit',
		);

		return isset( $_REQUEST['elementor-preview'] ) ||
			   ( isset( $_REQUEST['action'] ) && false !== strpos( sanitize_text_field( $_REQUEST['action'] ), 'elementor' ) ) ||
			   in_array( get_post_status(), $arr_modes ) ||
			   ( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() );
	}


	public function get_placeholder_html( array $atts, $shortcode_name ): string {
		$html_attributes = array();
		foreach ( $atts as $id => $val ) {
			$html_attributes[] = '<b>' . esc_html( $id ) . '</b>="<i>' . esc_html( $val ) . '</i>"';
		}

		return '<div style="padding: 20px; background-color: #f5f5f5; border: 1px solid #ccc;text-align: center">[<b>' . $shortcode_name . '</b> ' . implode( ', ', $html_attributes ) . ']</div>';
	}

	public function get_placeholder_txt( array $atts, $shortcode_name ): string {
		$html_attributes = array();
		foreach ( $atts as $id => $val ) {
			$html_attributes[] = $id . '="' . $val . '"';
		}

		return '[' . $shortcode_name . ' ' . implode( ' ', $html_attributes ) . ']';
	}

	protected function get_visitor_ip(): string {
		if ( getenv( 'HTTP_CF_CONNECTING_IP' ) ) {
			return getenv( 'HTTP_CF_CONNECTING_IP' );
		}
		if ( getenv( 'HTTP_CLIENT_IP' ) ) {
			return getenv( 'HTTP_CLIENT_IP' );
		}
		if ( getenv( 'HTTP_X_FORWARDED_FOR' ) ) {
			return getenv( 'HTTP_X_FORWARDED_FOR' );
		}
		if ( getenv( 'HTTP_X_FORWARDED' ) ) {
			return getenv( 'HTTP_X_FORWARDED' );
		}
		if ( getenv( 'HTTP_FORWARDED_FOR' ) ) {
			return getenv( 'HTTP_FORWARDED_FOR' );
		}
		if ( getenv( 'HTTP_FORWARDED' ) ) {
			return getenv( 'HTTP_FORWARDED' );
		}
		if ( getenv( 'HTTP_X_REAL_IP' ) ) {
			return getenv( 'HTTP_X_REAL_IP' );
		}
		if ( getenv( 'REMOTE_ADDR' ) ) {
			return getenv( 'REMOTE_ADDR' );
		}

		return '';
	}
}
