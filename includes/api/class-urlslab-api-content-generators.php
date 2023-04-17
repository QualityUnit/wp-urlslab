<?php

class Urlslab_Api_Content_Generators extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/content-generator';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<generator_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'status' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Content_Generator_Row::STATUS_ACTIVE:
									case Urlslab_Content_Generator_Row::STATUS_DISABLED:
									case Urlslab_Content_Generator_Row::STATUS_NEW:
									case Urlslab_Content_Generator_Row::STATUS_PENDING:
										return true;

									default:
										return false;
								}
							},
						),
						'result' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/translate',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_translation' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'source_lang'   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'target_lang'   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'original_text' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
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
			$base . '/(?P<generator_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->generator_id = (int) $row->generator_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_translation( $request ) {
		$source_lang   = $request->get_param( 'source_lang' );
		$target_lang   = $request->get_param( 'target_lang' );
		$original_text = $request->get_param( 'original_text' );

		$translation = $original_text;

		if ( strlen( trim( $original_text ) ) > 0 && preg_match( '/[\p{L}]+/u', $original_text ) && Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG ) ) {
			$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );
			if ( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_TRANSLATE ) ) {
				$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
				if ( strlen( $api_key ) ) {
					$client  = new \OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client( array( 'timeout' => 29 ) ), \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key ) ); //phpcs:ignore
					$request = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest();
					$request->setModelName( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_TRANSLATE_MODEL ) );
					$request->setRenewFrequency( \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_NO_SCHEDULE );
					$prompt = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt();
					$prompt->setPromptTemplate( "Your only task is to translate text from $source_lang to $target_lang. If text contains HTML, keep exactly the same HTML formatting as original text. Keep the same capital letters structure in translated text. Translated text should have similar length as original text.\nTRANSLATE:" . $original_text );
					$prompt->setMetadataVars( array() );
					$request->setPrompt( $prompt );

					try {
						$response    = $client->memoryLessAugment( $request, 'false', 'true', 'true', 'false' );
						$translation = $response->getResponse();
					} catch ( \OpenAPI\Client\ApiException $e ) {
					}
				}
			}
		}


		return new WP_REST_Response( (object) array( 'translation' => $translation ), 200 );
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Content_Generator_Row( $params );
	}

	public function get_editable_columns(): array {
		return array( 'status', 'result' );
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_command'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_url_filter'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_semantic_context' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_result'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_status'           => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_status_changed'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
					)
				),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_CONTENT_GENERATORS_TABLE );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_semantic_context' );
		$sql->add_filter( 'filter_command' );
		$sql->add_filter( 'filter_url_filter' );
		$sql->add_filter( 'filter_result' );
		$sql->add_filter( 'filter_status' );
		$sql->add_filter( 'filter_status_changed' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'generator_id' );

		return $sql;
	}

}
