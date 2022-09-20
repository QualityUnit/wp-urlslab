<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Jwt_Manager {
	
	private static Urlslab_Jwt_Manager $instance;
	private static string $JWT_TOKEN_OPTION = 'urlslab_jwt_token';
	private ?Urlslab_Jwt_Token $token;
	private Urlslab_User_Management_Api $user_management_api;
	
	public static function get_instance() {
		if ( empty( self::$instance ) ) {
			self::$instance                    = new self;
		}

		return self::$instance;
	}

	public function init( Urlslab_User_Management_Api $user_management_api ) {
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
