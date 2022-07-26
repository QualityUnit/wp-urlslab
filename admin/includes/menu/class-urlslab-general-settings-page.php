<?php

class Urlslab_General_Settings_Page implements Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug  = 'urlslab-general-settings';
		$this->page_title = 'General Settings';
	}

	/**
	 * @param string $action
	 * @param string $component
	 *
	 * @return void
	 */
	public function on_page_load( string $action, string $component ) {
		$redirect_to = '';

		//# Setup process of API Key
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] ) {
			$redirect_to = $this->setup_apikey();
		}
		//# Setup process of API Key


		//# Revalidation process of API Key
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'setup' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] and
									! empty( $_POST['revalidate-api-key'] ) ) {
			check_admin_referer( 'api-key-setup' );
			$redirect_to = $this->revalidate_apikey();
		}
		//# Revalidation process of API Key

		if ( ! empty( $redirect_to ) ) {
			wp_safe_redirect( $redirect_to );
			exit();
		}

	}

	/**
	 * @param string $parent_slug
	 *
	 * @return void creates the submenu and loading action of page
	 */
	public function register_submenu( string $parent_slug ) {
		add_submenu_page(
			$parent_slug,
			'Urlslab General Settings',
			'General Settings',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
	}

	/**
	 * @return void Generates the API Key
	 */
	public function render_apikey_form() {
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'api-key', 'action=setup' ) ); ?>">
			<?php wp_nonce_field( 'api-key-setup' ); ?>
			<?php
			$user_api_key = Urlslab_User_Widget::get_instance()->get_api_key();
			if ( ! empty( $user_api_key ) ) {
				echo esc_html( $user_api_key->get_api_key_masked() );
				echo sprintf(
					'<input type="hidden" value="%s" id="api_key" name="api_key" />',
					esc_html( $user_api_key->get_api_key() )
				);
			} else {
				echo '<input type="text" aria-required="true" id="api_key" name="api_key" class="regular-text code" />';
			}
			?>
			<?php
			if ( ! empty( $user_api_key ) ) {
				submit_button( 'Remove key', 'small', 'reset-api-key' );
				submit_button( 'Revalidate key', 'small', 'revalidate-api-key' );
			} else {
				submit_button( 'Save changes' );
			}
			?>
			<a href="<?php echo esc_url( $this->menu_page() ); ?>" class="button">Cancel</a>
		</form>
		<?php
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function get_page_title(): string {
		return $this->page_title;
	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-general-settings.php';
	}

	/**
	 * @return string revalidate the currectly saved api key
	 */
	private function revalidate_apikey(): string {
		$user_api_key = Urlslab_User_Widget::get_instance()->get_api_key();
		$redirect_to = '';

		if ( ! $user_api_key->is_empty() ) {
			$confirmed = $this->confirm_key( $user_api_key );
			if ( $confirmed ) {
				$redirect_to = $this->menu_page(
					'api-key',
					array(
						'status' => 'success',
					)
				);
			} else {
				$redirect_to = $this->menu_page(
					'api-key',
					array(
						'status' => 'unauthorized',
					)
				);
			}
		} else {
			$redirect_to = $this->menu_page(
				'api-key',
				array(
					'status' => 'unauthorized',
				)
			);
		}
		return $redirect_to;
	}

	/**
	 * @return string process of setting up an API Key
	 */
	private function setup_apikey(): string {
		$redirect_to = '';
		//# Setup process of API Key
		check_admin_referer( 'api-key-setup' );
		if ( ! empty( $_POST['reset-api-key'] ) ) {
			$this->reset_api_key();
			$redirect_to = $this->menu_page(
				'api-key',
				array(
					'status' => 'success',
				)
			);
		} else {
			$api_key = isset( $_POST['api_key'] )
				? trim( $_POST['api_key'] )
				: '';

			$confirmed = $this->confirm_key( new Urlslab_Api_Key( $api_key ) );
			if ( $confirmed ) {
				$redirect_to = $this->menu_page(
					'api-key',
					array(
						'status' => 'success',
					)
				);

				$this->save_api_key( $api_key );
			} else {
				$redirect_to = $this->menu_page(
					'api-key',
					array(
						'status' => 'unauthorized',
					)
				);
			}
		}
		//# Setup process of API Key
		return $redirect_to;
	}

	/**
	 * @param string $component
	 * @param $args
	 *
	 * @return string
	 */
	private function menu_page( string $component = 'api-key', $args = '' ): string {
		$args = wp_parse_args( $args, array() );
		$url  = urlslab_admin_menu_page_url( $this->menu_slug );
		$url  = add_query_arg( array( 'component' => $component ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	/**
	 * @param $api_key
	 *
	 * @return bool
	 */
	private function confirm_key( $api_key ): bool {
		$screenshot_api = new Urlslab_User_Management_Api( $api_key );
		return $screenshot_api->confirm_api_key();
	}

	/**
	 * @param $api_key
	 *
	 * @return void
	 */
	private function save_api_key( $api_key ) {
		$user = new Urlslab_User_Widget();
		Urlslab::update_option( 'api-key', $api_key );
		$user->add_api_key(
			new Urlslab_Api_Key( $api_key )
		);
	}

	/**
	 * @return void
	 */
	private function reset_api_key() {
		$user = new Urlslab_User_Widget();
		$user->remove_api_key();
		Urlslab::update_option( 'api-key', '' );
	}
}
