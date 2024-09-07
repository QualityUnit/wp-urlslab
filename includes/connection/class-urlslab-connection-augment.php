<?php


use FlowHunt_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Connection_Augment {
	private static Urlslab_Connection_Augment $instance;
	private static ContentApi $content_client;

	public static function get_instance(): Urlslab_Connection_Augment {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			} else {
				throw new ApiException( esc_html( __( 'AI Generator not active', 'urlslab' ) ), 402, array( 'status' => 402 ) );
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$content_client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			$config               = Urlslab_Connection_FlowHunt::getConfiguration();
			// TODO new API
			self::$content_client = new ContentApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore

			return ! empty( self::$content_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( esc_html( __( 'AI Generator not active', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}

	public function async_augment( DomainDataRetrievalAugmentRequest $request ): DomainDataRetrievalStatefulResponse {
		$ignore_query      = 'false';
		$custom_context    = 'false';
		$context_mandatory = 'true';

		if ( ! strlen( $request->getAugmentCommand() ) ) {
			$ignore_query = 'true';
		}

		if ( ! $request->getFilter() ||
			 ( $request->getFilter()->getDomains() && count( $request->getFilter()->getDomains() ) == 0 &&
			   $request->getFilter()->getUrls() && count( $request->getFilter()->getUrls() ) == 0 )
		) {
			if ( ! strlen( $request->getAugmentCommand() ) ) {
				$custom_context    = 'true';
				$context_mandatory = 'false';
			}
		}

		return self::$content_client->asyncMemoryLessAugment(
			$request,
			'false',
			$ignore_query,
			$custom_context,
			$context_mandatory
		);
	}

	public function complex_augment_docs( DomainDataRetrievalComplexAugmentRequest $request ) {
		return self::$content_client->complexAugment( $request );
	}

	public function get_process_result( string $process_id ) {
		return self::$content_client->getProcessResult( $process_id );
	}

	public function remove_markdown( $content ) {
		if ( is_array( $content ) ) {
			foreach ( $content as $id => $item ) {
				if ( preg_match( '/```(.*?)\n(.*?)\n\\s*?```/s', $item, $matches ) ) {
					$content[ $id ] = $matches[2];
				}
			}
		} else {
			if ( preg_match( '/```(.*?)\n(.*?)\n\\s*?```/s', $content, $matches ) ) {
				return $matches[2];
			}
		}

		return $content;
	}
}
