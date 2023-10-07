<?php


use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequestWithURLContext;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentResponse;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalStatefulResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Augment_Connection {
	private static Urlslab_Augment_Connection $instance;
	private static ContentApi $content_client;

	public static function get_instance(): Urlslab_Augment_Connection {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$content_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			self::$content_client = new ContentApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore
			return ! empty( self::$content_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );
	}

	public function get_valid_ai_models() {
		return array(
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO => 'OpenAI GPT-3.5 Turbo 8K',
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO_16K         => 'OpenAI GPT-3.5 Turbo 16K',
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4         => 'OpenAI GPT 4 8K',
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_4_32K         => 'OpenAI GPT 4 32K',
			DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_TEXT_DAVINCI_003         => 'OpenAI Davinci 0.3',
		);
	}

	public function is_valid_ai_model_name( $model_name ) {
		return in_array( $model_name, array_keys( $this->get_valid_ai_models() ) );
	}

	public function augment( DomainDataRetrievalAugmentRequest $request ): DomainDataRetrievalAugmentResponse {
		$ignore_query = 'false';
		$custom_context = 'false';
		$context_mandatory = 'true';

		if ( ! strlen( $request->getAugmentCommand() ) ) {
			$ignore_query = 'true';
		}

		if ( ! $request->getFilter() ||
			( $request->getFilter()->getDomains() && count( $request->getFilter()->getDomains() ) == 0 &&
				$request->getFilter()->getUrls() && count( $request->getFilter()->getUrls() ) == 0 ) ) {
			if ( ! strlen( $request->getAugmentCommand() ) ) {
				$custom_context = 'true';
				$context_mandatory = 'false';
			}
		}

		return self::$content_client->memoryLessAugment(
			$request,
			'false',
			$ignore_query,
			$custom_context,
			$context_mandatory
		);

	}

	public function async_augment( DomainDataRetrievalAugmentRequest $request ): DomainDataRetrievalStatefulResponse {
		$ignore_query = 'false';
		$custom_context = 'false';
		$context_mandatory = 'true';

		if ( ! strlen( $request->getAugmentCommand() ) ) {
			$ignore_query = 'true';
		}

		if ( ! $request->getFilter() ||
			 ( $request->getFilter()->getDomains() && count( $request->getFilter()->getDomains() ) == 0 &&
			   $request->getFilter()->getUrls() && count( $request->getFilter()->getUrls() ) == 0 ) ) {
			if ( ! strlen( $request->getAugmentCommand() ) ) {
				$custom_context = 'true';
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

	public function complex_augment( DomainDataRetrievalAugmentRequestWithURLContext $request ) {
		return self::$content_client->complexAugmentWithURLContext( $request );
	}


}
