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

	public const MENU_ID = 'urlslab-menu';
	const URLSLAB_ENC = 'urlslab-enc-';
	private static array $skip_classes;

	private const OPTION_VALUE = 'value';
	private const OPTION_TYPE = 'type';
	private const OPTION_DEFAULT = 'default';
	protected static $secret = false;


	private $options = false;
	private $option_sections = array();

	public function init_widget() {}

	public function init_wp_admin_menu( string $plugin_name, WP_Admin_Bar $wp_admin_bar ) {}

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

	public abstract function register_routes();

	public function register_public_routes() {}

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
			switch ( $option[ self::OPTION_TYPE ] ) {
				case self::OPTION_TYPE_PASSWORD:
					if ( get_option( $option_id, $option[ self::OPTION_DEFAULT ] ?? false ) ) {
						$option[ self::OPTION_VALUE ] = self::PASSWORD_PLACEHOLDER;
					} else {
						$option[ self::OPTION_VALUE ] = '';
					}

					break;

				case self::OPTION_TYPE_CHECKBOX:
					$value = $this->get_option( $option_id );
					if ( $value ) {
						$option[ self::OPTION_VALUE ] = true;
					} else {
						$option[ self::OPTION_VALUE ] = false;
					}

					break;

				case self::OPTION_TYPE_LISTBOX:
					$value                     = $this->get_option( $option_id );
					$possible_values           = $this->get_option_possible_values(
						$option_id
					);
					$option['possible_values'] = $possible_values;
					if ( ! isset( $possible_values[ $value ] ) ) {
						$value = $option[ self::OPTION_DEFAULT ];
					}
					$option[ self::OPTION_VALUE ] = $value;

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
					$option[ self::OPTION_VALUE ] = array_values( $values );

					break;

				default:
					$option[ self::OPTION_VALUE ] = $this->get_option( $option_id );
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

		if ( ! isset( $this->options[ $option_id ][ self::OPTION_VALUE ] ) ) {
			$this->options[ $option_id ][ self::OPTION_VALUE ] = get_option( $option_id, $this->options[ $option_id ][ self::OPTION_DEFAULT ] ?? false );
		}

		if ( self::OPTION_TYPE_PASSWORD === $this->options[ $option_id ][ self::OPTION_TYPE ] ) {
			//decrypt once, then use decrypted in memory
			$this->options[ $option_id ][ self::OPTION_VALUE ] = $this->decrypt_option_value( $this->options[ $option_id ][ self::OPTION_VALUE ] );
		}

		return $this->options[ $option_id ][ self::OPTION_VALUE ];
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
			if ( self::OPTION_TYPE_BUTTON_API_CALL !== $option[ self::OPTION_TYPE ] ) {
				add_option(
					$option['id'],
					$option[ self::OPTION_DEFAULT ] ?? false,
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

		if ( self::OPTION_TYPE_BUTTON_API_CALL === $this->options[ $option_id ][ self::OPTION_TYPE ] ) {
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

		switch ( $this->options[ $option_id ][ self::OPTION_TYPE ] ) {
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
			$this->options[ $option_id ][ self::OPTION_VALUE ] = $value;
			if ( self::OPTION_TYPE_PASSWORD === $this->options[ $option_id ][ self::OPTION_TYPE ] ) {
				return update_option( $option_id, $this->encrypt_option_value( $value ) );
			}

			return update_option( $option_id, $value );
		}
	}

	protected function add_options() {}

	public function get_widget_labels(): array {
		return array();
	}

	public function get_widget_group() {
		return (object) array( 'General' => __( 'General', 'urlslab' ) );
	}

	public function on_activate() {}

	public function on_deactivate() {}

	protected function add_options_form_section( $id, callable $title, callable $description, $labels = array() ) {
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
		$default_value,
		bool $autoload,
		callable $title,
		callable $description,
		$type = self::OPTION_TYPE_CHECKBOX,
		$possible_values = false,
		callable $validator = null,
		$form_section_id = 'default',
		$labels = array()
	) {
		if ( empty( $this->option_sections ) ) {
			$this->option_sections[] = array(
				'id'          => 'default',
				'title'       => function() {
					return __( 'Module Settings', 'urlslab' );
				},
				'description' => '',
				'labels'      => array(),
			);
		}

		if ( $form_section_id && ! isset( $this->option_sections[ $form_section_id ] ) ) {
			$form_section_id = 'default';
		}
		$this->options[ $option_id ] = array(
			'id'                 => $option_id,
			self::OPTION_DEFAULT => $default_value,
			'autoload'           => $autoload,
			'title'              => $title,
			'description'        => $description,
			self::OPTION_TYPE    => $type,
			'possible_values'    => $possible_values,
			'validator'          => $validator,
			'section'            => $form_section_id,
			'labels'             => $labels,
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
		if ( isset( $this->options[ $option_id ]['possible_values'] ) ) {
			if ( is_callable( $this->options[ $option_id ]['possible_values'] ) ) {
				return call_user_func( $this->options[ $option_id ]['possible_values'] );
			}
			if ( is_array( $this->options[ $option_id ]['possible_values'] ) ) {
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

	public static function get_anonymized_visitor_ip(): string {
		$ip = self::get_visitor_ip();
		if ( empty( $ip ) ) {
			return '';
		}

		if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_IP_ANONYMIZATION ) ) {
			if ( false !== strpos( $ip, ':' ) ) {
				return preg_replace( '/^([0-9a-fA-F]*:[0-9a-fA-F]*):(?:[0-9a-fA-F]*:){1,5}([0-9a-fA-F]*:[0-9a-fA-F]*)$/', '$1:****:$2', $ip );
			}

			return preg_replace( '/(\d+\.)\d+\.\d+(\.\d+)/', '$1**$2', $ip );
		}

		return $ip;
	}

	public static function get_visitor_ip(): string {
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


	protected function get_xpath_query( array $custom_classes = array(), $custom_ids = array() ): string {
		if ( empty( self::$skip_classes ) ) {
			self::$skip_classes = array( 'urlslab-skip-all' );
			$settings_classes   = preg_split( '/(,|\n|\t)\s*/', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_CLASSNAMES_BLACKLIST ) );
			foreach ( $settings_classes as $value ) {
				$value = trim( $value );
				if ( strlen( $value ) && ! in_array( $value, $custom_classes ) ) {
					self::$skip_classes[] = $value;
				}
			}
		}
		$custom_classes = array_merge( self::$skip_classes, $custom_classes );

		$custom_ids[] = 'wpadminbar';
		$conditions   = array();
		foreach ( $custom_classes as $value ) {
			$conditions[] = "contains(@class, '$value')";
		}
		foreach ( $custom_ids as $value ) {
			$conditions[] = "@id='$value'";
		}

		return 'not(ancestor-or-self::*[' . implode( ' or ', $conditions ) . '])';
	}

	protected function get_on_click_api_call( $api, $method = 'GET', $body_data = '' ): string {
		return "(async function(){ try { const response = await fetch(wpApiSettings.root + \"urlslab/v1/$api\", { method: \"$method\", headers: {	\"Content-Type\": \"application/json\", accept: \"application/json\", \"X-WP-Nonce\": window.wpApiSettings.nonce, }, credentials: \"include\"" . ( empty( $body_data ) ? '' : ",body: JSON.stringify($body_data)" ) . ' }); if (response.ok) { urlsLab.setNotification({ message: "Done.", status: "success" }); return true;}} catch (error) {console.error(error);}urlsLab.setNotification({ message: "Failed.", status: "error" });})(); return false;';
	}

	private function decrypt_option_value( $encrypted_value ) {
		if ( empty( $encrypted_value ) || ! is_string( $encrypted_value ) || false === str_starts_with( $encrypted_value, self::URLSLAB_ENC ) || ! function_exists( 'openssl_decrypt' ) ) {
			return $encrypted_value;
		}

		$decoded = base64_decode( substr( $encrypted_value, strlen( self::URLSLAB_ENC ) - 1 ) );

		if ( false === strpos( $decoded, '::' ) ) {
			return $encrypted_value;
		}

		list( $encrypted_data, $iv ) = explode( '::', $decoded, 2 );
		$iv = base64_decode( $iv );

		$decrypted = openssl_decrypt( $encrypted_data, 'aes-256-cbc', $this->get_secret(), 0, $iv );
		if ( false === $decrypted ) {
			return $encrypted_value;
		}

		return $decrypted;
	}

	private function encrypt_option_value( $value ) {
		if ( empty( $value ) || ! is_string( $value ) || ! function_exists( 'openssl_encrypt' ) || str_starts_with( $value, self::URLSLAB_ENC ) ) {
			return $value;
		}

		$iv = openssl_random_pseudo_bytes( openssl_cipher_iv_length( 'aes-256-cbc' ) );

		$encrypted = openssl_encrypt( $value, 'aes-256-cbc', $this->get_secret(), 0, $iv );
		if ( false === $encrypted ) {
			return $value;
		}

		return self::URLSLAB_ENC . base64_encode( $encrypted . '::' . base64_encode( $iv ) );
	}

	private function get_secret() {
		if ( self::$secret ) {
			return self::$secret;
		}

		if ( defined( 'URLSLAB_SECRET' ) ) {
			self::$secret = URLSLAB_SECRET;

			return self::$secret;
		}
		$secret = getenv( 'URLSLAB_SECRET' );
		if ( $secret ) {
			self::$secret = $secret;

			return self::$secret;
		}

		self::$secret = "ugy&'2S^X" . '4n%SDTx$dVxT#gYP3mnAyg@UOo6';

		return self::$secret;
	}
}
