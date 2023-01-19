<?php

abstract class Urlslab_Widget {


	const OPTION_TYPE_CHECKBOX = 'C';
	const OPTION_TYPE_TEXT = 'T';
	const OPTION_TYPE_PASSWORD = 'P';
	const OPTION_TYPE_LISTBOX = 'L';
	const OPTION_TYPE_MULTI_CHECKBOX = 'M';
	const OPTION_TYPE_NUMBER = 'N';


	private $current_page_url = null;

	private $options = array();

	/**
	 * @param Urlslab_Loader $loader
	 *
	 * @return void
	 */
	public abstract function init_widget( Urlslab_Loader $loader );

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

	/**
	 * @param array $new_settings
	 *
	 * @return void
	 */
	public abstract static function update_settings( array $new_settings );

	public function is_api_key_required() {
		return false;
	}

	/**
	 * @return array - liest of module settings, where id is setting name and value is setting value
	 */
	public function get_options() {
		if ( empty( $this->options ) ) {
			$this->init_options();
		}
		foreach ( $this->options as $id => $option ) {
			$this->options[ $id ]['value'] = get_option( $id, $option['default'] ?? false );
		}

		return $this->options;
	}

	public function add_options_on_activate() {
		if ( empty( $this->options ) ) {
			$this->init_options();
		}
		foreach ( $this->options as $option ) {
			add_option( $option['id'], $option['default'] ?? false, '', $option['autoload'] ?? true );
		}
	}

	protected abstract function init_options();

	protected function add_option_definition( string $option_id, $default_value = false, bool $autoload = true, string $title = '', string $description = '', $type = self::OPTION_TYPE_CHECKBOX, $possible_values = false, callable $validator = null ) {
		$this->options[ $option_id ] = array(
			'id'              => $option_id,
			'default'         => $default_value,
			'autoload'        => $autoload,
			'title'           => $title,
			'description'     => $description,
			'type'            => $type,
			'possible_values' => $possible_values,
			'validator'       => $validator,
		);
	}

	public function update_option( $option_id, $value ): bool {
		if ( empty( $this->options ) ) {
			$this->init_options();
		}
		if ( ! isset( $this->options[ $option_id ] ) ) {
			return false;
		}
		if ( null !== $this->options[ $option_id ]['validator'] ) {
			if ( ! call_user_func( $this->options[ $option_id ]['validator']($value) ) ) {
				return false;
			}
		}
		return update_option($option_id, $value);
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
