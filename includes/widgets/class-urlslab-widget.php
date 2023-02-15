<?php

abstract class Urlslab_Widget {


	const OPTION_TYPE_CHECKBOX = 'checkbox';
	const OPTION_TYPE_TEXT = 'text';
	const OPTION_TYPE_PASSWORD = 'password';
	const PASSWORD_PLACEHOLDER = '********';

	const OPTION_TYPE_LISTBOX = 'listbox';
	const OPTION_TYPE_DATETIME = 'datetime';
	const OPTION_TYPE_MULTI_CHECKBOX = 'multicheck';
	const OPTION_TYPE_NUMBER = 'number';


	private $current_page_url = null;

	private $options = false;
	private $option_sections = array();

	public abstract function init_widget();

	/**
	 * @return string Widget slug for identifying the widget
	 */
	public abstract function get_widget_slug(): string;

	/**
	 * @return string Widget Title
	 */
	public abstract function get_widget_title(): string;

	/**
	 * @return string Widget Description
	 */
	public abstract function get_widget_description(): string;

	/**
	 * @return string External landing page introduction of the widget
	 */
	public abstract function get_landing_page_link(): string;

	/**
	 * @return Urlslab_Admin_Page urlslab_admin page where the widget exists
	 */
	public abstract function get_parent_page(): Urlslab_Admin_Page;

	/**
	 * @return string get tab slug that the widget is located in
	 */
	public abstract function get_widget_tab(): string;

	/**
	 * @param $args array|string extra arguments by the user
	 *
	 * @return string the url of the subpage where the widget exists in
	 */
	public function admin_widget_page( $args = '' ): string {
		$args = wp_parse_args( $args, array() );
		$url  = $this->get_parent_page()->menu_page( $this->get_widget_tab() );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	/**
	 * @param $atts array attributes of the shortcode
	 * @param $content string the content of the shortcode
	 * @param $tag string the tag related to shortcode
	 *
	 * @return string
	 */
	public abstract function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string;

	/**
	 * @return bool indicates if this widget generates any shortcode
	 */
	public abstract function has_shortcode(): bool;

	/**
	 * @return mixed
	 */
	public abstract function render_widget_overview();

	/**
	 * @return string
	 */
	public abstract function get_thumbnail_demo_url(): string;

	public function is_api_key_required() {
		return false;
	}

	/**
	 * @return array - liest of module settings, where id is setting name and value is setting value
	 */
	public function get_options( $section_id = false ): array {
		if ( false === $this->options ) {
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
				case self::OPTION_TYPE_MULTI_CHECKBOX:
					$values = $this->get_option( $option_id );
					if ( ! is_array( $values ) ) {
						$values = explode( ',', $values );
					}
					foreach ( $values as $id => $value ) {
						if ( ! isset( $option['possible_values'] ) ) {
							unset( $values[ $id ] );
						}
					}
					$option['value'] = $values;
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

	public function get_option_sections(): array {
		return $this->option_sections;
	}

	public function add_options_on_activate() {
		if ( false === $this->options ) {
			$this->init_options();
		}
		foreach ( $this->options as $option ) {
			add_option( $option['id'], $option['default'] ?? false, '', $option['autoload'] ?? true );
		}
	}

	protected abstract function add_options();

	private function init_options() {
		$this->options = array();
		$this->add_options();
	}

	protected function add_options_form_section( $id, $title, $description ) {
		$this->option_sections[ $id ] = array(
			'id'          => $id,
			'title'       => $title,
			'description' => $description,
		);
	}

	protected function add_option_definition( string $option_id, $default_value = false, bool $autoload = true, string $title = '', string $description = '', $type = self::OPTION_TYPE_CHECKBOX, $possible_values = false, callable $validator = null, $form_section_id = 'default' ) {
		if ( $form_section_id && ! isset( $this->option_sections[ $form_section_id ] ) ) {
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
		);
	}

	public function update_option( $option_id, $value ): bool {
		if ( false === $this->options ) {
			$this->init_options();
		}

		if ( ! isset( $this->options[ $option_id ] ) ) {
			return false;
		}

		if ( null !== $this->options[ $option_id ]['validator'] ) {
			if ( ! call_user_func( $this->options[ $option_id ]['validator'], $value ) ) {
				return false;
			}
		}

		if ( is_array( $this->options[ $option_id ]['possible_values'] ) ) {
			if ( is_array( $value ) ) {
				foreach ( $value as $val ) {
					if ( ! isset( $this->options[ $option_id ]['possible_values'][ $val ] ) ) {
						return false;
					}
				}
			} else if ( ! isset( $this->options[ $option_id ]['possible_values'][ $value ] ) ) {
				return false;
			}
		}

		switch ( $this->options[ $option_id ]['type'] ) {
			case self::OPTION_TYPE_CHECKBOX:
				if ( $value ) {
					$value = true;
				} else {
					$value = false;
				}
				break;
			case self::OPTION_TYPE_MULTI_CHECKBOX:
				if ( is_array( $value ) ) {
					$value = implode( ',', $value );
				}
				break;
			case self::OPTION_TYPE_PASSWORD:
				if ( self::PASSWORD_PLACEHOLDER == $value ) {
					return false;
				}
				break;
			default:
				break;
		}


		return $value == $this->get_option( $option_id ) || update_option( $option_id, $value );
	}

	public function get_option( $option_id ) {
		if ( false === $this->options ) {
			$this->init_options();
		}

		if ( ! isset( $this->options[ $option_id ] ) ) {
			return null;
		}
		if ( ! isset( $this->options[ $option_id ]['value'] ) ) {
			$this->options[ $option_id ]['value'] = get_option( $option_id, $this->options[ $option_id ]['default'] ?? false );
		}

		return $this->options[ $option_id ]['value'];
	}

	protected function is_skip_elemenet( DOMNode $dom, $custom_widget_skip = '' ) {
		return $dom->hasAttributes() && $dom->hasAttribute( 'class' ) &&
			   (
				   ( ! empty( $custom_widget_skip ) && false !== strpos( $dom->getAttribute( 'class' ), 'urlslab-skip-' . $custom_widget_skip ) ) ||
				   ( false !== strpos( $dom->getAttribute( 'class' ), 'urlslab-skip-all' ) )
			   );
	}

	protected function get_current_page_url(): Urlslab_Url {
		if ( is_object( $this->current_page_url ) ) {
			return $this->current_page_url;
		}

		if ( is_category() ) {
			$this->current_page_url = new Urlslab_Url( get_category_link( get_query_var( 'cat' ) ) );
		} else {
			$this->current_page_url = new Urlslab_Url( get_permalink( get_the_ID() ) );
		}

		return $this->current_page_url;
	}
}
