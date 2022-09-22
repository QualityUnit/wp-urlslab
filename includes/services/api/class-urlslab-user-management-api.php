<?php

// phpcs:disable WordPress.NamingConventions

require_once URLSLAB_PLUGIN_DIR . '/includes/exceptions/class-urlslab-technical-exception.php';

class Urlslab_User_Management_Api extends Urlslab_Api {

	private int $installation_id;
	public static string $JWT_OPTION = 'urlslab_jwt_token';

	public function __construct( Urlslab_Api_Key $api_key, int $installation_id ) {
		parent::__construct( $api_key );
		$this->installation_id = $installation_id;
	}

	public function confirm_api_key(): bool {
		return 200 == $this->urlslab_get_response(
			$this->base_url . 'manage/validation/' . $this->installation_id,
			''
		)[0];
	}

	public function update_token( bool $force = false ): bool {
		$jwt_token = get_option( self::$JWT_OPTION, '' );
		if ( empty( $jwt_token ) || $force ) {
			//# No token available
			try {
				$urlslab_jwt_token = $this->fetch_jwt_token();
				if ( $urlslab_jwt_token->is_valid( $this->get_api_key() ) ) {
					update_option( self::$JWT_OPTION, $urlslab_jwt_token->get_token() );
					return true;
				}
			} catch ( Exception $e ) {
				return false;
			}
		}
		return false;
	}

	/**
	 * @return Urlslab_Jwt_Token
	 * @throws Urlslab_Technical_Exception
	 */
	public function fetch_jwt_token(): Urlslab_Jwt_Token {
		$rsp = $this->urlslab_get_response(
			$this->base_url . 'token/',
			''
		);
		if ( 200 != $rsp[0] ) {
			throw new Urlslab_Technical_Exception( 'Error From Urlslab Server' );
		}

		$token_string = json_decode( $rsp[1], true )['token'];
		return new Urlslab_Jwt_Token( $token_string );
	}

}
