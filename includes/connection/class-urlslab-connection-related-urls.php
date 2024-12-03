<?php


use FlowHunt_Vendor\FlowHunt\Api\SemanticSearchApi;
use FlowHunt_Vendor\FlowHunt\ApiException;
use FlowHunt_Vendor\FlowHunt\Model\DocumentSimilarityRequest;
use FlowHunt_Vendor\FlowHunt\Model\QuerySimilarityRequest;
use FlowHunt_Vendor\FlowHunt\Model\VectorDocumentType;
use FlowHunt_Vendor\GuzzleHttp\Client;

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
			self::$client = new SemanticSearchApi( new Client( array( 'timeout' => 59 ) ), Urlslab_Connection_FlowHunt::get_configuration() ); //phpcs:ignore

			return ! empty( self::$client );
		}

		throw new ApiException( esc_html( __( 'Not Enough FlowHunt Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}

	public function get_related_urls_to_url( Urlslab_Data_Url $url, int $max_count ) {
		$filter_domains = array();
		$filter_domains[] = $url->get_domain_name(); //add current domain to filter
		$additional_domains = trim( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Related_Resources::SLUG )->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_ADDITIONAL_DOMAINS ) );
		$additional_domains = explode( "\n", $additional_domains );
		foreach ( $additional_domains as $domain ) {
			$domain = trim( $domain );
			if ( ! empty( $domain ) ) {
				$filter_domains[] = $domain;
			}
		}

		$request = new DocumentSimilarityRequest(
			array(
				'document_type' => VectorDocumentType::U,
				'limit' => $max_count * 2,
				'score_trheshold' => 0.7,
				'vector_id_to' => 2,
				'url' => 'https:' . $url->get_url()->get_url_with_protocol_relative(),
				'filter_domains' => $filter_domains,
			)
		);
		try {
			$result = self::$client->getSimilarDocsByDocId( Urlslab_Connection_FlowHunt::get_workspace_id(), $request );
			$urls = array();
			foreach ( $result as $doc ) {
				$urls[ $doc->getData()->getUrl() ] = $doc->getData()->getUrl();
				if ( count( $urls ) === $max_count ) {
					break;
				}
			}

			if ( empty( $urls ) ) {
				$urls = $this->get_related_urls_to_query( $url->get_url_title() . ' - ' . $url->get_summary_text( Urlslab_Widget_Urls::DESC_TEXT_SUMMARY ), $max_count, VectorDocumentType::U, null, $filter_domains );
			}

			return array_values( $urls );
		} catch ( Exception $e ) {
			return array();
		}
	}

	public function get_related_urls_to_query( string $query, int $max_count, $document_type = VectorDocumentType::U, $pointer_type = null, $filter_domains = null ) {
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

		if ( $filter_domains ) {
			$data['filter_domains'] = $filter_domains;
		}

		$request = new QuerySimilarityRequest( $data );
		$urls = array();
		try {
			$result = self::$client->getSimilarDocsByQuery( Urlslab_Connection_FlowHunt::get_workspace_id(), $request );
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
	}
}
