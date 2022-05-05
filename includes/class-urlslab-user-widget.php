<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-api-key.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/helpers/urlslab-helpers.php';

class Urlslab_User_Widget {

	private $user_api_key;

	private static Urlslab_User_Widget $instance;


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_User_Widget The instance.
	 */
	public static function get_instance(): Urlslab_User_Widget {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
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
			} else {
				submit_button( 'Save changes' );
			}
			?>
		</form>
		<?php
	}


	public function api_setup_response( $action = '' ) {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] ) {
			check_admin_referer( 'api-key-setup' );

			if ( ! empty( $_POST['reset-api-key'] ) ) {
				$this->reset_data();
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

				$confirmed = $this->confirm_key();

				if ( true === $confirmed ) {
					$redirect_to = $this->get_api_conf_page_url(
						array(
							'message' => 'success',
						)
					);

					$this->save_data( $api_key );
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
		$this->add_api_key(
			new Urlslab_Api_Key( $api_key )
		);
	}

	private function reset_data() {
		Urlslab::update_option( 'api-key', '' );
		$this->remove_api_key();
	}

}
