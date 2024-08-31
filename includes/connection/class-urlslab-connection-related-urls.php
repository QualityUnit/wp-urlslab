<?php


use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\SemanticSearchApi;
use FlowHunt_Vendor\OpenAPI\Client\Model\VectorDocumentType;

class Urlslab_Connection_Related_Urls {
	private static Urlslab_Connection_Related_Urls $instance;
	private static SemanticSearchApi $client;

	public static function get_instance(): Urlslab_Connection_Related_Urls {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	/**
	 * @throws ApiException
	 */
	private static function init_client(): bool {
		if ( empty( self::$client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			self::$client = new SemanticSearchApi( new Client( array( 'timeout' => 59 ) ), Urlslab_Connection_FlowHunt::getConfiguration() ); //phpcs:ignore

			return ! empty( self::$client );
		}

		throw new ApiException( esc_html( __( 'Not Enough FlowHunt Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}

	public function get_related_urls_to_url( Urlslab_Data_Url $url, int $max_count ) {
		$request = new \FlowHunt_Vendor\OpenAPI\Client\Model\DocumentSimilarityRequest(
			array(
				'document_type' => VectorDocumentType::U,
				'limit' => $max_count * 2,
				'score_trheshold' => 0.7,
				'vector_id_to' => 2,
				'url' => 'https:' . $url->get_url()->get_url_with_protocol_relative(),
			)
		);
		try {
			$result = self::$client->getSimilarDocsByDocId( Urlslab_Connection_FlowHunt::getWorkspaceId(), $request );
			$urls = array();
			foreach ( $result as $doc ) {
				$urls[ $doc->getData()->getUrl() ] = $doc->getData()->getUrl();
				if ( count( $urls ) === $max_count ) {
					break;
				}
			}

			return array_values( $urls );
		} catch ( Exception $e ) {
			return array();
		}

		return array();
	}

	public function get_related_urls_to_query( string $query, int $max_count, $document_type = VectorDocumentType::U, $pointer_type = null ) {
		$data = array(
			'document_type' => $document_type,
			'limit' => $max_count * 2,
			'score_trheshold' => 0.7,
			'vector_id_to' => 2,
			'query' => $query,
		);

		if ( $pointer_type ) {
			$data['pointer_type'] = $pointer_type;
		}

		$request = new \FlowHunt_Vendor\OpenAPI\Client\Model\QuerySimilarityRequest( $data );
		$urls = array();
		try {
			$result = self::$client->getSimilarDocsByQuery( Urlslab_Connection_FlowHunt::getWorkspaceId(), $request );
			foreach ( $result as $doc ) {
				if ( $doc->getData() ) {
					$urls[ $doc->getData()->getUrl() ] = $doc->getData()->getUrl();
					if ( count( $urls ) === $max_count ) {
						break;
					}
				}
			}

			return array_values( $urls );
		} catch ( Exception $e ) {
			return array();
		}

		return array();
	}
}
