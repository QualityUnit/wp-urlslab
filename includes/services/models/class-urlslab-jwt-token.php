<?php

use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\Clock\FrozenClock;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\JWT\Validation\Validator;

class Urlslab_Jwt_Token {

	private string $jwt_token;
	private string $issuer = 'https://www.urlslab.com';
	private string $aud = 'wp_urlslab_plugin';
	private Parser $parser;

	public function __construct( $jwt_token ) {
		$this->jwt_token = $jwt_token;
		$this->parser = new Parser( new JoseEncoder() );
	}

	public function get_token(): string {
		return $this->jwt_token;
	}

	/**
	 * @param Urlslab_Api_Key $api_key
	 *
	 * @return bool
	 * @throws Urlslab_Invalid_Jwt_Token_Exception|Urlslab_Invalid_Api_Key
	 */
	public function is_valid( Urlslab_Api_Key $api_key ): bool {
		if ( $api_key->is_empty() ) {
			throw new Urlslab_Invalid_Api_Key( 'empty API Key' );
		}
		if ( empty( $this->jwt_token ) ) {
			throw new Urlslab_Invalid_Jwt_Token_Exception( 'empty JWT Token' );
		}

		$token = $this->parser->parse( $this->jwt_token );
		$validator = new Validator();
		$signing_constraint = new SignedWith(
			new Sha256(),
			InMemory::plainText( $api_key->get_api_key() )
		);
		$time_constraint = new FrozenClock( new DateTimeImmutable() );

		try {
			$validator->assert( $token, $signing_constraint );
			$validator->assert( $token, new StrictValidAt( $time_constraint ) );
			$validator->assert( $token, new IssuedBy( $this->issuer ) );
			$validator->assert( $token, new PermittedFor( $this->aud ) );
			return true;
		} catch ( RequiredConstraintsViolated $e ) {
			throw new Urlslab_Invalid_Jwt_Token_Exception( 'JWT Token Not Valid' );
		}
	}

}
