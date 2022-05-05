<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Screenshot_Widget extends Urlslab_Widget {

	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	// TODO - add services
	private Urlslab_Service $service;

	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 * @param string $landing_page_link
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description,
		string $landing_page_link ) {
		$this->widget_slug = $widget_slug;
		$this->widget_title       = $widget_title;
		$this->widget_description = $widget_description;
		$this->landing_page_link = $landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return 'Urlslab ' . $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_url(): string {
		return $this->menu_page_url( URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php' );
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Screenshot';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Screenshots';
	}

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_integration_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args = wp_parse_args( $args, array() );
		$url = $this->menu_page_url( $main_menu_slug );
		$url = add_query_arg( array( 'widget' => $this->widget_slug ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	/**
	 * @param $api_key
	 *
	 * @return void
	 */
	public function render_form( $api_key = '' ) {
		$api_key_masked = '';
		$raw_api_key = '';
		if ( ! empty( $api_key ) ) {
			$api_key_masked = $api_key->get_api_key_masked();
			$raw_api_key = $api_key->get_api_key();
		}
		$user_widget = Urlslab_User_Widget::get_instance();
		?>
		<form method="post" action="<?php echo esc_url( $this->get_integration_page_url( 'action=setup' ) ); ?>">
			<?php wp_nonce_field( 'urlslab-screenshot-setup' ); ?>
			<table class="form-table">
				<tbody>
				<tr>
					<th scope="row"><label
							for="publishable"><?php echo esc_html( 'API key' ); ?></label></th>
					<td>
						<?php
						if ( $user_widget->is_widget_active( $this->widget_slug ) ) {
							echo esc_html( $api_key_masked );
							echo sprintf(
								'<input type="hidden" value="%s" id="api_key" name="api_key" />',
								esc_attr( $api_key_masked )
							);
						} else {
							echo sprintf(
								'<input type="text" aria-required="true" value="%s" id="api_key" name="api_key" class="regular-text code" />',
								esc_attr( $raw_api_key )
							);
						}
						?>
					</td>
				</tr>
				</tbody>
			</table>
			<?php
			if ( $user_widget->is_widget_active( $this->widget_slug ) ) {
				submit_button( 'Remove key', 'small', 'reset-api-key' );
				submit_button( 'Deactivate', 'small', 'deactivate-widget' );
			} else {
				submit_button( 'Save changes' );
			}
			?>
		</form>
		<?php
	}

	public function widget_configuration_response( $action = '' ) {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] ) {
			check_admin_referer( 'urlslab-screenshot-setup' );

			if ( ! empty( $_POST['reset-api-key'] ) ) {
				$this->reset_data();
				$redirect_to = $this->get_integration_page_url(
					array(
						'action' => 'setup',
						'message' => 'success',
					)
				);
			} elseif ( ! empty( $_POST['deactivate-widget'] ) ) {
				Urlslab_User_Widget::get_instance()->remove_widget( $this );
				$redirect_to = $this->get_integration_page_url(
					array(
						'action' => 'setup',
						'message' => 'success',
					)
				);
			} else {
				$api_key = isset( $_POST['api_key'] )
					? trim( $_POST['api_key'] )
					: '';

				$confirmed = $this->confirm_key();

				if ( true === $confirmed ) {
					$redirect_to = $this->get_integration_page_url(
						array(
							'message' => 'success',
						)
					);

					$this->save_data( $api_key );
				} elseif ( false === $confirmed ) {
					$redirect_to = $this->get_integration_page_url(
						array(
							'action' => 'setup',
							'message' => 'unauthorized',
						) 
					);
				} else {
					$redirect_to = $this->get_integration_page_url(
						array(
							'action' => 'setup',
							'message' => 'invalid',
						) 
					);
				}
			}

			wp_safe_redirect( $redirect_to );
			exit();
		}
	}

	public function admin_notice( string $message = '' ) {
		if ( 'unauthorized' == $message ) {
			echo sprintf(
				'<div class="notice notice-error"><p><strong>%1$s</strong>: %2$s</p></div>',
				esc_html( 'Error' ),
				esc_html( 'You have not been authenticated. Make sure the provided API key is correct.' )
			);
		}

		if ( 'invalid' == $message ) {
			echo sprintf(
				'<div class="notice notice-error"><p><strong>%1$s</strong>: %2$s</p></div>',
				esc_html( 'Error' ),
				esc_html( 'Invalid key values.' )
			);
		}

		if ( 'success' == $message ) {
			echo sprintf(
				'<div class="notice notice-success"><p>%s</p></div>',
				esc_html( 'Settings saved.' )
			);
		}
	}


	private function confirm_key(): bool {
		//TODO - confirm the key given in the body. connect to API
		return true;
	}

	private function save_data( $api_key ) {
		Urlslab::update_option( 'api-key', $api_key );
		$user_widget = Urlslab_User_Widget::get_instance();
		$user_widget->add_api_key(
			new Urlslab_Api_Key( $api_key )
		);
		$user_widget->add_widget( $this );
	}

	private function reset_data() {
		Urlslab::update_option( 'api-key', '' );
		$user_widget = Urlslab_User_Widget::get_instance();
		$user_widget->remove_api_key();
		$user_widget->remove_all_widgets();
	}

	function get_screenshot_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		// normalize attribute keys, lowercase
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		global $wpdb;
		$table_name = $wpdb->prefix . 'urlslab_screenshot';

		// override default attributes with user attributes
		$urlslab_atts = shortcode_atts(
			array(
				'width' => '100%',
				'height' => '100%',
				'alt' => 'URLSLAB Screenshot',
				'default-image-url' => 'https://img.com/jpg.jpg',
				'url' => 'https://urlslab.com',
				'screenshot-type' => 'carousel',
			),
			$atts,
			$tag
		);


		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table_name WHERE urlMd5 = %s", // phpcs:ignore
				( new Urlslab_Url( $urlslab_atts['url'] ) )->get_url_id(),
			),
			ARRAY_A
		);


		if ( null !== $row ) {
			switch ( $row['status'] ) {
				case Urlslab::$link_status_waiting_for_update:
				case Urlslab::$link_status_available:
					return $this->render_shortcode(
						$this->create_url_path( $row, $urlslab_atts['screenshot-type'] ),
						$urlslab_atts['alt'],
						$urlslab_atts['width'],
						$urlslab_atts['height']
					);

				case Urlslab::$link_status_not_scheduled:
				case Urlslab::$link_status_waiting_for_screenshot:
				default:
					//default url
					return $this->render_shortcode(
						$urlslab_atts['default-image-url'],
						$urlslab_atts['alt'],
						$urlslab_atts['width'],
						$urlslab_atts['height']
					);


			}
		} else {
			// no link found, insert
			//default url
			$urlslab_url = new Urlslab_Url( $urlslab_atts['url'] );
			$wpdb->query(
				$wpdb->prepare(
					'
                        INSERT INTO ' . $table_name . // phpcs:ignore
					' 
                            (urlMd5, urlName, status, updateStatusDate)
                        VALUES (%s, %s, %s, %s);
                    ',
					$urlslab_url->get_url_id(),
					$urlslab_url->get_url(),
					Urlslab::$link_status_not_scheduled,
					gmdate( 'Y-m-d H:i:s' )
				)
			);
			return $this->render_shortcode(
				$urlslab_atts['default-image-url'],
				$urlslab_atts['alt'],
				$urlslab_atts['width'],
				$urlslab_atts['height']
			);
		}
	}

	private function render_shortcode( string $src, string $alt, string $width, string $height ): string {
		return sprintf(
			'<img src="%s" alt="%s" width="%s" height="%s">',
			esc_url( $src ),
			esc_attr( $alt ),
			esc_attr( $width ),
			esc_attr( $height )
		);
	}

	private function create_url_path( $row, $screenshot_type = 'carousel' ): string {
		switch ( $screenshot_type ) {
			case 'thumbnail':
				return sprintf(
					'https://urlslab.com/public/thumbnail/%s/%s/%s.jpg',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);
			case 'full-page':
				return sprintf(
					'https://urlslab.com/public/image/%s/%s/%s.png',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);

			case 'carousel':
			default:
				return sprintf(
					'https://urlslab.com/public/carousel/%s/%s/%s',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);
		}
	}

}
