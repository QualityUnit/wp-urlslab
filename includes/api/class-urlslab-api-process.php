<?php

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Api_Process extends Urlslab_Api_Base {
	const SLUG = 'process';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base . '/posts-gen-task',
			$this->get_route_get_items()
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/posts-gen-task/create',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_post_generator_task' ),
				'args'                => array(
					'model_name' => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'prompt_template' => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'post_type' => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
				),
				'permission_callback' => array(
					$this,
					'create_item_permissions_check',
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/count',
			$this->get_count_route( array( $this->get_route_get_items() ) )
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/delete-all',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_all_items' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/complex-augment/(?P<process_id>[a-zA-Z0-9_-]+)',
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_process_result' ),
				'args' => array(
					'process_id' => array(
						'required' => true,
						'validate_callback' => function( $param ) {
							return is_string( $param );
						},
					),
				),
			) 
		);

	}

	public function get_process_result( $request ) {
		$process_id = $request->get_param( 'process_id' );
		if ( empty( $process_id ) ) {
			return new WP_Error( 'urlslab_process_not_found', __( 'Empty process given' ), array( 'status' => 404 ) );
		}

		// creating the API Instance
		$config         = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) );
		$api_client = new Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $config );
		try {
			$rsp = $api_client->getProcessResult( $process_id );

			if ( $rsp->getStatus() === 'ERROR' ) {
				return new WP_REST_Response(
					(object) array(
						'message' => $rsp->getResponse()[0],
					),
					400
				);
			}       
		} catch ( Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
			return new WP_Error( 'urlslab_process_not_found', __( 'Process not found' ), array( 'status' => 404 ) );
		}

		return new WP_REST_Response(
			(object) array(
				'response' => $rsp->getResponse(),
				'intermediate_result' => $rsp->getIntermediateResponse(),
				'status' => $rsp->getStatus(),
			),
			200 
		);
	}

}
