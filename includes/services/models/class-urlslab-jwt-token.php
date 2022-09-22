<?php

use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\Clock\FrozenClock;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\JWT\Token\DataSet;
use Lcobucci\JWT\Validation\Validator;

class Urlslab_Jwt_Token {

	private string $jwt_token;
	private string $issuer = 'https://www.urlslab.com';
	private string $aud = 'wp_urlslab_plugin';
	private DataSet $claims;
	private Parser $parser;

	public function __construct( $jwt_token ) {
		$this->jwt_token = $jwt_token;
		$this->parser = new Parser( new JoseEncoder() );
	}

	public function get_token(): string {
		return $this->jwt_token;
	}

	/**
	 * @param string $claim_key
	 *
	 * @return array
	 * false if the token couldn't be parsed
	 * and
	 */
	public function get_claim( string $claim_key ): array {
		if ( ! empty( $this->claims ) ) {
			try {
				$token = $this->parser->parse( $this->jwt_token );
			} catch ( CannotDecodeContent | InvalidTokenStructure | UnsupportedHeaderFound $e ) {
				return array();
			}
			assert( $token instanceof UnencryptedToken );
			$this->claims = $token->claims();
		}
		return $this->claims->get( $claim_key, array() );
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
		$public_key = "-----BEGIN PUBLIC KEY-----\n" . $api_key->get_api_key() . "\n-----END PUBLIC KEY-----";
		$signing_constraint = new SignedWith(
			new Sha256(),
			InMemory::plainText( $public_key )
		);
		$time_constraint = new FrozenClock( new DateTimeImmutable() );

		$validator->assert( $token, $signing_constraint );
		$validator->assert( $token, new StrictValidAt( $time_constraint ) );
		$validator->assert( $token, new IssuedBy( $this->issuer ) );
		$validator->assert( $token, new PermittedFor( $this->aud ) );
		return true;
	}

}
