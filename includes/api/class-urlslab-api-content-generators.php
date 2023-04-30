<?php

class Urlslab_Api_Content_Generators extends Urlslab_Api_Table {
	const SLUG = 'content-generator';

	public function register_routes() {
		$base = '/' . self::SLUG;
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
						'labels' => array(
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
						'translate_permissions_check',
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

		register_rest_route( self::NAMESPACE, $base . '/(?P<generator_id>[0-9]+)/urls', $this->get_route_generator_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<generator_id>[0-9]+)/urls/count', $this->get_count_route( $this->get_route_generator_urls() ) );

	}


	public function translate_permissions_check( WP_REST_Request $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_TRANSLATE );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_translation( $request ) {
		$source_lang = $request->get_param( 'source_lang' );
		$target_lang = $request->get_param( 'target_lang' );

		$original_text = $request->get_param( 'original_text' );
		$translation   = $original_text;

		if ( ! empty( $source_lang ) && ! empty( $target_lang ) && $this->isTextForTranslation( $original_text ) && Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Content_Generator_Widget::SLUG ) ) {
			$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Content_Generator_Widget::SLUG );
			if ( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_TRANSLATE ) ) {
				$api_key = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
				if ( strlen( $api_key ) ) {
					$client  = new \OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key ) ); //phpcs:ignore
					$request = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest();
					$request->setAugmentingModelName( $widget->get_option( Urlslab_Content_Generator_Widget::SETTING_NAME_TRANSLATE_MODEL ) );
					$request->setRenewFrequency( \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_NO_SCHEDULE );
					$prompt = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt();

					$prompt_text = "TASK RESTRICTIONS: \n";
					$prompt_text .= "\nI want you to act as an professional translator from $source_lang to $target_lang, spelling corrector and improver.";
					$prompt_text .= "\nKeep the meaning same. Do not write explanations";
					if ( false !== strpos( $original_text, '<' ) && false !== strpos( $original_text, '>' ) ) {
						$prompt_text .= "\nTRANSLATION has exactly the same HTML as INPUT TEXT!";
						$prompt_text .= "\nDo NOT translate attributes or HTML tags, copym content between characters '<' and '>' from INPUT TEXT to your TRANSLATION as is!";
					}
					if ( false !== strpos( $original_text, '@' ) ) {
						$prompt_text .= "\nDon't translate email addresses!";
					}
					if ( false !== strpos( $original_text, '/' ) || false !== strpos( $original_text, 'http' ) ) {
						$prompt_text .= "\nDo NOT translate urls!";
					}
					$prompt_text .= "\nKeep the same uppercase and lowercase letters in translation as INPUT TEXT!";
					$prompt_text .= "\nDo NOT try to answer questions from INPUT TEXT, do just translation!";
					$prompt_text .= "\nDo NOT generate any other text than translation of INPUT TEXT";
					$prompt_text .= "\nKeep the same tone of language in TRANSLATION as INPUT TEXT";

					$prompt_text .= "\nTRANSLATION should have similar length as INPUT TEXT";
					$prompt_text .= "\nTRANSLATE $source_lang INPUT TEXT to $target_lang";
					$prompt_text .= "\n---- INPUT TEXT:\n" . $original_text;
					$prompt_text .= "\n---- END OF INPUT TEXT";
					$prompt_text .= "\nTRANSLATION of INPUT TEXT to $target_lang:";

					$prompt->setPromptTemplate( $prompt_text );
					$prompt->setMetadataVars( array() );
					$request->setPrompt( $prompt );

					try {
						$response    = $client->memoryLessAugment( $request, 'false', 'true', 'true', 'false' );
						$translation = $response->getResponse();
					} catch ( \OpenAPI\Client\ApiException $e ) {
						return new WP_REST_Response( (object) array( 'translation' => '' ), $e->getCode() );
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
		return array( 'status', 'result', 'labels' );
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*', 'g' );

		$sql->add_select_column( 'SUM(!ISNULL(m.url_id))', false, 'usage_count' );
		$sql->add_from( URLSLAB_CONTENT_GENERATORS_TABLE . ' g LEFT JOIN ' . URLSLAB_CONTENT_GENERATOR_URLS_TABLE . ' m ON m.generator_id = g.generator_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'g' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'filter_usage_count' => '%d' ) ) );

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		$sql->add_group_by( 'generator_id', 'g' );

		return $sql;
	}

	/**
	 * @return array[]
	 */
	public function get_route_generator_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_generator_urls' ),
				'args'                => array(
					'rows_per_page' => array(
						'required'          => true,
						'default'           => self::ROWS_PER_PAGE,
						'validate_callback' => function( $param ) {
							return is_numeric( $param ) && 0 < $param && 1000 > $param;
						},
					),
					'from_url_id'   => array(
						'required'          => false,
						'validate_callback' => function( $param ) {
							return empty( $param ) || is_numeric( $param );
						},
					),
				),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	public function get_generator_urls( WP_REST_Request $request ) {
		$rows = $this->get_generator_urls_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id; // phpcs:ignore
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_generator_urls_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_CONTENT_GENERATOR_URLS_TABLE . ' m LEFT JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$columns = $this->prepare_columns( ( new Urlslab_Content_Generator_Url_Row() )->get_columns(), 'm' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_name' => '%s' ), 'u' ) );

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	/**
	 * @param $original_text
	 *
	 * @return bool
	 */
	public function isTextForTranslation( $original_text ): bool {
		if ( false === strpos( $original_text, ' ' ) && ( false !== strpos( $original_text, '-' ) || false !== strpos( $original_text, '_' ) ) ) {    //detect constants or special attributes (zero spaces in text, but contains - or _)
			return false;
		}

		if ( filter_var( $original_text, FILTER_VALIDATE_URL ) || filter_var( $original_text, FILTER_VALIDATE_EMAIL ) || filter_var( $original_text, FILTER_VALIDATE_IP ) ) {
			return false;
		}

		return strlen( trim( $original_text ) ) > 2 && preg_match( '/\p{L}+/u', $original_text );
	}

}
