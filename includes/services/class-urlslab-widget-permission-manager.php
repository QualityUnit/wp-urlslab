<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Widget_Permission_Manager {
	
	private static Urlslab_Widget_Permission_Manager $instance;
	private static string $JWT_TOKEN_OPTION = 'urlslab_jwt_token';
	private ?Urlslab_Jwt_Token $token;
	private Urlslab_User_Management_Api $user_management_api;
	
	public static function get_instance(): Urlslab_Widget_Permission_Manager {
		if ( empty( self::$instance ) ) {
			self::$instance                    = new self;
		}

		return self::$instance;
	}

	public function init( Urlslab_User_Management_Api $user_management_api ) {
		if ( $user_management_api->get_api_key()->is_empty() ) {
			return;
		}
		$this->user_management_api = $user_management_api;
		$jwt_plain_token = get_option( self::$JWT_TOKEN_OPTION, '' );
		if ( empty( $jwt_plain_token ) ) {
			//# probably first time requesting token
			$this->update_token();
		} else {
			try {
				$maybe_jwt_token = new Urlslab_Jwt_Token( $jwt_plain_token );
				if ( ! $maybe_jwt_token->is_valid( $this->user_management_api->get_api_key() ) ) {
					$this->update_token();
				} else {
					//# Token is still valid
					$this->token = $maybe_jwt_token;
				}
			} catch ( Exception $e ) {
				//# Token not valid
				$this->update_token();
			}
		}
	}

	/**
	 * @param Urlslab_Widget $widget
	 * @param array $default_val
	 *
	 * @return array returns false if the jwt token is not available and
	 * associative array containing all the limit params if the token exists
	 */
	public function get_limitation( Urlslab_Widget $widget, array $default_val = array() ): array {
		if ( empty( $this->token ) ) {
			return $default_val;
		} else {
			$token_permission_claim = $this->token->get_claim( $widget->get_widget_slug() );
			if ( ! empty( $token_permission_claim ) ) {
				return $token_permission_claim;
			} else {
				return $default_val;
			}
		}
	}

	private function update_token() {
		try {
			$token = $this->user_management_api->fetch_jwt_token();
			if ( $token->is_valid( $this->user_management_api->get_api_key() ) ) {
				update_option( self::$JWT_TOKEN_OPTION, $token->get_token() );
				$this->token = $token;
			}
		} catch ( Exception $e ) {
			//# not updating anything, not valid
		}
	}
	
}
