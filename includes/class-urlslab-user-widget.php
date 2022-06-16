<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-api-key.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-user-management-api.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/helpers/urlslab-helpers.php';

class Urlslab_User_Widget {

	private $user_api_key;
	private array $activated_widgets = array();

	private static Urlslab_User_Widget $instance;


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_User_Widget The instance.
	 */
	public static function get_instance(): Urlslab_User_Widget {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
			$widgets = (array) Urlslab::get_option( 'user_widgets' );
			$available_widgets = Urlslab_Available_Widgets::get_instance();
			foreach ( $widgets as $widget ) {
				$widget_detail = $available_widgets->get_widget( $widget );
				if ( $widget_detail !== false ) {
					self::$instance->activated_widgets[ $widget_detail->get_widget_slug() ] = $widget_detail;
				}
			}
		}

		return self::$instance;
	}

	public function activate_widget( Urlslab_Widget $urlslab_widget ) {
		if ( empty( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] ) ) {
			$this->activated_widgets[ $urlslab_widget->get_widget_slug() ] = $urlslab_widget;
			Urlslab::update_option( 'user_widgets', array_keys( $this->activated_widgets ) );
		}
	}

	public function deactivate_widget( Urlslab_Widget $urlslab_widget ) {
		if ( ! empty( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] ) ) {
			unset( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] );
			Urlslab::update_option( 'user_widgets', array_keys( $this->activated_widgets ) );
		}
	}

	public function activate_widgets( array $urlslab_widget ) {
		foreach ( $urlslab_widget as $widget ) {
			$this->activate_widget( $widget );
		}
	}

	public function get_activated_widget( string $widget_slug = '' ) {
		if ( empty( $widget_slug ) ) {
			return array_values( $this->activated_widgets );
		}

		return $this->activated_widgets[ $widget_slug ];
	}

	public function is_widget_activated( string $widget_slug ): bool {
		$widget = $this->activated_widgets[ $widget_slug ];
		return ! empty( $widget );
	}

	public function add_api_key( Urlslab_Api_Key $api_key ): bool {
		if ( empty( $this->user_api_key ) ) {
			$this->user_api_key = $api_key;
			return true;
		}

		return false;
	}

	public function has_api_key(): bool {
		if ( empty( $this->user_api_key ) ) {
			return false;
		}
		return true;
	}

	public function get_api_key(): Urlslab_Api_Key {
		return $this->user_api_key;
	}

	public function remove_api_key() {
		$this->user_api_key = null;
	}

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_api_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args = wp_parse_args( $args, array() );
		$url = urlslab_admin_menu_page_url( $main_menu_slug );
		$url = add_query_arg( array( 'component' => 'api-key' ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	/**
	 * @return void
	 */
	public function render_form() {
		?>
		<form method="post" action="<?php echo esc_url( $this->get_api_conf_page_url( 'action=setup' ) ); ?>">
			<?php wp_nonce_field( 'api-key-setup' ); ?>
			<table class="form-table">
				<tbody>
				<tr>
					<th scope="row"><label
							for="publishable"><?php echo esc_html( 'API key' ); ?></label></th>
					<td>
						<?php
						if ( ! empty( $this->user_api_key ) ) {
							echo esc_html( $this->user_api_key->get_api_key_masked() );
							echo sprintf(
								'<input type="hidden" value="%s" id="api_key" name="api_key" />',
								esc_html( $this->user_api_key->get_api_key() )
							);
						} else {
							echo '<input type="text" aria-required="true" id="api_key" name="api_key" class="regular-text code" />';
						}
						?>
					</td>
				</tr>
				</tbody>
			</table>
			<?php
			if ( ! empty( $this->user_api_key ) ) {
				submit_button( 'Remove key', 'small', 'reset-api-key' );
				submit_button( 'Revalidate key', 'small', 'revalidate-api-key' );
			} else {
				submit_button( 'Save changes' );
			}
			?>
			<a href="<?php echo esc_url( urlslab_admin_menu_page_url() ); ?>" class="button">Cancel</a>
		</form>
		<?php
	}


	public function api_setup_response( $action = '' ) {
		//# Validating the API Key and adding it to WP user table
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] ) {
			check_admin_referer( 'api-key-setup' );

			if ( ! empty( $_POST['reset-api-key'] ) ) {
				$this->reset_api_key();
				$redirect_to = $this->get_api_conf_page_url(
					array(
						'action' => 'setup',
						'message' => 'success',
					)
				);
			} else {
				$api_key = isset( $_POST['api_key'] )
					? trim( $_POST['api_key'] )
					: '';


				$confirmed = $this->confirm_key( new Urlslab_Api_Key( $api_key ) );

				if ( true === $confirmed ) {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'message' => 'success',
						)
					);

					$this->save_api_key( $api_key );
				} elseif ( false === $confirmed ) {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'action' => 'setup',
							'message' => 'unauthorized',
						)
					);
				} else {
					$redirect_to = $this->get_api_conf_page_url(
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

		//# Just Validate the API Key and give back response
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] and
									! empty( $_POST['revalidate-api-key'] ) ) {
			check_admin_referer( 'api-key-setup' );

			if ( ! empty( trim( $this->user_api_key ) ) ) {
				$confirmed = $this->confirm_key( new Urlslab_Api_Key( $this->user_api_key ) );

				if ( true === $confirmed ) {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'message' => 'success',
						)
					);
				} elseif ( false === $confirmed ) {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'action' => 'setup',
							'message' => 'unauthorized',
						)
					);
				} else {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'action' => 'setup',
							'message' => 'invalid',
						)
					);
				}
			} else {
				$redirect_to = $this->get_api_conf_page_url(
					array(
						'action' => 'setup',
						'message' => 'invalid',
					)
				);
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
				esc_html( 'Invalid or Empty API Key has been inserted' )
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
				esc_html( 'Process successful' )
			);
		}
	}


	private function confirm_key( $api_key ): bool {
		$screenshot_api = new Urlslab_User_Management_Api( $api_key );
		return $screenshot_api->confirm_api_key();
	}

	private function save_api_key( $api_key ) {
		Urlslab::update_option( 'api-key', $api_key );
		$this->add_api_key(
			new Urlslab_Api_Key( $api_key )
		);
	}

	private function reset_api_key() {
		Urlslab::update_option( 'api-key', '' );
		$this->remove_api_key();
	}

}
