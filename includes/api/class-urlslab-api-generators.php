<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequestWithURLContext;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;

class Urlslab_Api_Generators extends Urlslab_Api_Table {
	const SLUG = 'generator';

	public function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/models',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_ai_models' ),
					'args'                => array(),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/translate',
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
			'/' . self::SLUG . '/post/create',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'create_post' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(
						'post_content' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'post_type'    => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'post_title'   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/post',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_post_types' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/augment/with-context/urls',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_url_context_augmentation' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(
						'urls'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
						'prompt' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'model'  => array(
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
			'/' . self::SLUG . '/augment',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'async_augment' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(
						'user_prompt'      => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'model'            => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'semantic_context' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'url_filter'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
						'domain_filter'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/complete',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_instant_augmentation' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(
						'user_prompt'      => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'tone'             => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'model'            => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'lang'             => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'semantic_context' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'url_filter'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
						'domain_filter'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/' . self::SLUG . '/yt-complete',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_youtube_augmentation' ),
					'permission_callback' => array(
						$this,
						'augment_permission_check',
					),
					'args'                => array(
						'user_prompt' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'yt_id'       => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'model'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'lang'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);

		$base = '/' . self::SLUG . '/result';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
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
			$base . '/delete',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'delete_items' ),
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
			$base . '/(?P<hash_id>[0-9]+)',
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
									case Urlslab_Data_Generator_Result::STATUS_ACTIVE:
									case Urlslab_Data_Generator_Result::STATUS_DISABLED:
									case Urlslab_Data_Generator_Result::STATUS_WAITING_APPROVAL:
									case Urlslab_Data_Generator_Result::STATUS_PENDING:
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

		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/(?P<hash_id>[0-9]+)/urls', $this->get_route_generator_urls() );
		register_rest_route( self::NAMESPACE, $base . '/(?P<shortcode_id>[0-9]+)/(?P<hash_id>[0-9]+)/urls/count', $this->get_count_route( $this->get_route_generator_urls() ) );
	}

	function get_ai_models() {
		return new WP_REST_Response(
			Urlslab_Connection_Augment::get_valid_ai_models(),
			200
		);
	}

	protected function delete_rows( array $rows ): bool {
		( new Urlslab_Data_Generator_Result() )->delete_rows( $rows, array( 'hash_id' ) );
		( new Urlslab_Data_Generator_Url() )->delete_rows( $rows, array( 'hash_id' ) );

		return parent::delete_rows( $rows );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_GENERATOR_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Truncated', 'urlslab' ),
			),
			200
		);
	}

	public function translate_permissions_check( WP_REST_Request $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_TRANSLATE );
	}

	public function augment_permission_check( WP_REST_Request $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_AUGMENT );
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
			$row->shortcode_id = (int) $row->shortcode_id;
			$row->hash_id      = (int) $row->hash_id;
			$row->usage_count  = (int) $row->usage_count;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function update_item( $request ) {
		// scheduling a new process in the running processes.

		if ( $request->get_param( 'status' ) == Urlslab_Data_Generator_Result::STATUS_PENDING ) {
			// user requested regenerate
			$res = new Urlslab_Data_Generator_Result( array( 'hash_id' => $request->get_param( 'hash_id' ) ), false );
			$res->load();
			$shortcode = new Urlslab_Data_Generator_Shortcode( array( 'shortcode_id' => $res->get_shortcode_id() ), false );
			$shortcode->load();
			$task_data      = array(
				'shortcode_row'    => $shortcode->as_array(),
				'model'            => $shortcode->get_model(),
				'prompt_variables' => $res->get_prompt_variables(),
				'url_filter'       => $shortcode->get_url_filter(),
				'semantic_context' => $shortcode->get_semantic_context(),
				'hash_id'          => $request->get_param( 'hash_id' ),
			);
			$data           = array(
				'generator_type'    => Urlslab_Data_Generator_Task::GENERATOR_TYPE_SHORTCODE,
				'task_status'       => Urlslab_Data_Generator_Task::STATUS_NEW,
				'task_data'         => json_encode( $task_data ),
				'shortcode_hash_id' => $res->get_hash_id(),
			);
			$generator_task = new Urlslab_Data_Generator_Task( $data );
			$generator_task->insert_all( array( $generator_task ) );
		}

		return parent::update_item( $request ); // updating the data model
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

		if ( ! empty( $source_lang ) && ! empty( $target_lang ) && $this->isTextForTranslation( $original_text ) && Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Content_Generator::SLUG ) && Urlslab_Widget_General::is_urlslab_active() ) {
			$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
			if ( $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_TRANSLATE ) ) {
				$request = new DomainDataRetrievalAugmentRequest();
				$request->setAugmentingModelName( $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_TRANSLATE_MODEL ) );
				$request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_NO_SCHEDULE );
				$prompt = new DomainDataRetrievalAugmentPrompt();

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
				$prompt_text .= "\n---- INPUT TEXT:\n{context}\n---- END OF INPUT TEXT";
				$prompt_text .= "\nTRANSLATION of INPUT TEXT to $target_lang:";

				$prompt->setPromptTemplate( $prompt_text );
				$prompt->setDocumentTemplate( $original_text );
				$prompt->setMetadataVars( array() );
				$request->setPrompt( $prompt );

				try {
					$response    = Urlslab_Connection_Augment::get_instance()->augment( $request );
					$translation = $response->getResponse();
				} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
					switch ( $e->getCode() ) {
						case 402:
							Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 ); //continue

							return new WP_REST_Response(
								(object) array(
									'translation' => '',
									'error'       => 'not enough credits',
								),
								402
							);
						case 500:
						case 504:
							return new WP_REST_Response( (object) array( 'translation' => $original_text ), $e->getCode() );
						default:
							$response_obj = (object) array(
								'translation' => '',
								'error'       => $e->getMessage(),
							);

							return new WP_REST_Response( $response_obj, $e->getCode() );
					}
				}
			}
		}


		return new WP_REST_Response( (object) array( 'translation' => $translation ), 200 );
	}

	public function get_url_context_augmentation( $request ) {
		$urls      = $request->get_param( 'urls' );
		$prompt    = $request->get_param( 'prompt' );
		$aug_model = $request->get_param( 'model' );

		if ( empty( $urls ) ) {
			return new WP_Error( 'invalid_request', 'urls should not be empty', array( 'status' => 400 ) );
		}

		if ( strpos( $prompt, '{context}' ) < 0 ) {
			return new WP_Error( 'invalid_request', 'Add {context} to the prompt to pull data from source URLs', array( 'status' => 400 ) );
		}

		$config     = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_API_KEY ) );
		$api_client = new Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $config );

		// making request to get the process ID
		$augment_request = new DomainDataRetrievalAugmentRequestWithURLContext();
		$augment_request->setUrls( $urls );
		$augment_request->setPrompt(
			(object) array(
				'map_prompt'             => 'Summarize the given context: \n CONTEXT: \n {context}',
				'reduce_prompt'          => $prompt,
				'document_variable_name' => 'context',
			)
		);
		$augment_request->setModeName( $aug_model );
		$augment_request->setGenerationStrategy( 'map_reduce' );
		$augment_request->setTopKChunks( 3 );

		try {
			$rsp = $api_client->complexAugmentWithURLContext( $augment_request );

			return new WP_REST_Response( (object) array( 'processId' => $rsp->getProcessId() ), 200 );
		} catch ( ApiException $e ) {
			return new WP_Error( 'invalid_request', $e->getMessage(), array( 'status' => $e->getCode() ) );
		}

	}


	public function async_augment( $request ) {
		$user_prompt      = $request->get_param( 'user_prompt' );
		$aug_model        = $request->get_param( 'model' );
		$semantic_context = $request->get_param( 'semantic_context' );
		$url_filter       = $request->get_param( 'url_filter' );
		$domain_filter    = $request->get_param( 'domain_filter' );

		if ( ! empty( $user_prompt ) ) {
			$augment_request = new DomainDataRetrievalAugmentRequest();
			$augment_request->setAugmentingModelName( $aug_model );

			if (
				( $semantic_context && strlen( $semantic_context ) ) ||
				( $url_filter && count( $url_filter ) ) ||
				( $domain_filter && count( $domain_filter ) )
			) {
				if (
					( $url_filter && count( $url_filter ) ) ||
					( $domain_filter && count( $domain_filter ) )
				) {
					$filter = new DomainDataRetrievalContentQuery();
					$filter->setLimit( 5 );

					if ( $url_filter && count( $url_filter ) ) {
						$filter->setUrls( $url_filter );
					}

					if ( $domain_filter && count( $domain_filter ) ) {
						$filter->setDomains( $domain_filter );
					}
					$augment_request->setFilter( $filter );
				}

				if ( strlen( $semantic_context ) ) {
					$augment_request->setAugmentCommand( $semantic_context );
				}
			}

			$prompt = new DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( $user_prompt );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$augment_request->setPrompt( $prompt );

			$augment_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

			try {
				$response   = Urlslab_Connection_Augment::get_instance()->async_augment( $augment_request );
				$process_id = $response->getProcessId();

			} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
				switch ( $e->getCode() ) {
					case 402:
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );

						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => __( 'Not enough credits', 'urlslab' ),
							),
							402
						);
					//continue
					case 500:
					case 504:
						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => __( 'Something went wrong, try again later', 'urlslab' ),
							),
							$e->getCode()
						);

					case 404:
						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => __( 'Given context data hasn’t been indexed yet', 'urlslab' ),
							),
							$e->getCode()
						);
					default:
						$response_obj = (object) array(
							'completion' => '',
							'error'      => $e->getMessage(),
						);

						return new WP_REST_Response( $response_obj, $e->getCode() );
				}
			}
		}

		return new WP_REST_Response( (object) array( 'processId' => $process_id ), 200 );

	}

	public function get_instant_augmentation( $request ) {
		$user_prompt      = $request->get_param( 'user_prompt' );
		$aug_tone         = $request->get_param( 'tone' );
		$aug_lang         = $request->get_param( 'lang' );
		$aug_model        = $request->get_param( 'model' );
		$semantic_context = $request->get_param( 'semantic_context' );
		$url_filter       = $request->get_param( 'url_filter' );
		$domain_filter    = $request->get_param( 'domain_filter' );
		$completion       = '';

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
		if ( empty( $aug_model ) ) {
			$aug_model = $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_GENERATOR_MODEL );
		}

		if ( ! empty( $user_prompt ) ) {
			$augment_request = new DomainDataRetrievalAugmentRequest();
			$augment_request->setAugmentingModelName( $aug_model );

			$user_prompt .= "\n you are a knowledgeable assistant. you are tasked to answer any given prompt based on your knowledge";
			$user_prompt .= "\n whether it would based on the given COTNEXT or based on the your own trained data with natural completion";
			$user_prompt .= "\n your OUTPUT should be as natural as possible and meet the TASK_RESTRICTION requirement";
			$user_prompt .= "\nTASK_RESTRICTIONS: ";
			if ( strlen( $aug_tone ) ) {
				$user_prompt .= "\nTONE OF OUTPUT: $aug_tone";
			}

			if ( strlen( $aug_lang ) ) {
				$user_prompt .= "\nLANGUAGE OF OUTPUT: $aug_lang";
			} else {
				$user_prompt .= "\nLANGUAGE OF OUTPUT: the same language as INPUT TEXT";
			}

			if (
				( $semantic_context && strlen( $semantic_context ) ) ||
				( $url_filter && count( $url_filter ) ) ||
				( $domain_filter && count( $domain_filter ) )
			) {
				$user_prompt .= "\n Try to generate the output based on the given context";
				$user_prompt .= "\n If the context is not provided, still try to generate an output as best as you can with you're own knowledge";
				$user_prompt .= "\n CONTEXT: ";
				$user_prompt .= "\n{context}";


				if (
					( $url_filter && count( $url_filter ) ) ||
					( $domain_filter && count( $domain_filter ) )
				) {
					$filter = new DomainDataRetrievalContentQuery();
					$filter->setLimit( 5 );

					if ( $url_filter && count( $url_filter ) ) {
						$filter->setUrls( $url_filter );
					}

					if ( $domain_filter && count( $domain_filter ) ) {
						$filter->setDomains( $domain_filter );
					}
					$augment_request->setFilter( $filter );
				}

				if ( strlen( $semantic_context ) ) {
					$augment_request->setAugmentCommand( $semantic_context );
				}
			}
			$user_prompt .= "\nOUTPUT: ";

			$prompt = new DomainDataRetrievalAugmentPrompt();
			$prompt->setPromptTemplate( $user_prompt );
			$prompt->setDocumentTemplate( "--\n{text}\n--" );
			$prompt->setMetadataVars( array( 'text' ) );
			$augment_request->setPrompt( $prompt );

			$augment_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_ONE_TIME );

			try {
				$response   = Urlslab_Connection_Augment::get_instance()->augment( $augment_request );
				$completion = $response->getResponse();
			} catch ( \Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
				switch ( $e->getCode() ) {
					case 402:
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );

						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => 'not enough credits',
							),
							402
						);
					//continue
					case 500:
					case 504:
						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => __( 'Something went wrong, try again later', 'urlslab' ),
							),
							$e->getCode()
						);

					case 404:
						return new WP_REST_Response(
							(object) array(
								'completion' => '',
								'message'    => __( 'Given context data hasn’t been indexed yet', 'urlslab' ),
							),
							$e->getCode()
						);
					default:
						$response_obj = (object) array(
							'completion' => '',
							'error'      => $e->getMessage(),
						);

						return new WP_REST_Response( $response_obj, $e->getCode() );
				}
			}
		}

		return new WP_REST_Response( (object) array( 'completion' => $completion ), 200 );
	}

	public function get_youtube_augmentation( WP_REST_Request $request ) {
		$user_prompt = $request->get_param( 'user_prompt' );
		$aug_lang    = $request->get_param( 'lang' );
		$aug_model   = $request->get_param( 'model' );
		$yt_id       = $request->get_param( 'yt_id' );


		if ( empty( $yt_id ) || empty( $user_prompt ) ) {
			return new WP_REST_Response(
				(object) array(
					'completion' => '',
					'message'    => __( 'Missing required parameters', 'urlslab' ),
				),
				400
			);
		}

		$yt_data = Urlslab_Connection_Youtube::get_instance()->get_yt_data( $yt_id );

		if ( ! $yt_data ) {
			return new WP_REST_Response(
				(object) array(
					'completion' => '',
					'message'    => __( 'Youtube data cannot be fetched', 'urlslab' ),
				),
				404
			);
		}

		$aug_request = new DomainDataRetrievalAugmentRequest();

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
		if ( empty( $aug_model ) ) {
			$aug_model = $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_GENERATOR_MODEL );
		}
		$aug_request->setAugmentingModelName( $aug_model );

		if ( empty( $yt_data->get_captions() ) ) {
			return new WP_REST_Response(
				(object) array(
					'completion' => '',
					'message'    => __( 'Youtube Caption is Empty', 'urlslab' ),
				),
				404
			);
		}

		$prompt = new DomainDataRetrievalAugmentPrompt();

		if ( empty( $aug_lang ) ) {
			$aug_lang = 'The same language as VIDEO CAPTIONS';
		}

		$command = 'Never appologize! We know you are language model.' . "\n" . $user_prompt .
				   "\nOUTPUT Language should be in: $aug_lang ";

		$command .= "\n\n--VIDEO CAPTIONS:\n{context}\n--VIDEO CAPTIONS END\nOUTPUT:";
		$prompt->setPromptTemplate( $command );
		$prompt->setDocumentTemplate( $yt_data->get_captions() );
		$prompt->setMetadataVars( array() );

		$aug_request->setPrompt( $prompt );
		$aug_request->setRenewFrequency( DomainDataRetrievalAugmentRequest::RENEW_FREQUENCY_NO_SCHEDULE );
		try {
			$response = Urlslab_Connection_Augment::get_instance()->augment( $aug_request );

			return new WP_REST_Response( (object) array( 'completion' => $response->getResponse() ), 200 );
		} catch ( Exception $e ) {
			return new WP_REST_Response(
				(object) array(
					'completion' => '',
					'message'    => $e->getMessage(),
				),
				500
			);
		}
	}

	public function create_post( $request ) {
		$post_content = $request->get_param( 'post_content' );
		$post_type    = $request->get_param( 'post_type' );
		$post_title   = $request->get_param( 'post_title' );

		$post_id = wp_insert_post(
			array(
				'post_title'   => $post_title,
				'post_content' => $post_content,
				'post_status'  => 'draft',
				'post_type'    => $post_type,
			)
		);

		return new WP_REST_Response(
			(object) array(
				'post_id'        => $post_id,
				'edit_post_link' => html_entity_decode( get_edit_post_link( $post_id ) ),
			),
			200
		);
	}

	public function get_post_types( $request ) {
		return Urlslab_Widget_Related_Resources::get_available_post_types();
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Generator_Result( $params, $loaded_from_db );
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
		$sql->add_from( URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE . ' g LEFT JOIN ' . URLSLAB_GENERATOR_URLS_TABLE . ' m ON m.shortcode_id = g.shortcode_id AND m.hash_id = g.hash_id' );

		$sql->add_group_by( 'hash_id', 'g' );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return $this->prepare_columns( $this->get_row_object()->get_columns(), 'g' );
	}

	protected function get_having_columns(): array {
		return $this->prepare_columns( array( 'usage_count' => '%d' ) );
	}

	/**
	 * @return array[]
	 */
	public function get_route_generator_urls(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_generator_urls' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		);
	}

	public function get_generator_urls( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'shortcode_id', 'hash_id' ) );

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
		$this->prepare_url_filter( $request, array( 'url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'created', 'm' );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_from( URLSLAB_GENERATOR_URLS_TABLE . ' m INNER JOIN ' . URLSLAB_URLS_TABLE . ' u ON (m.url_id = u.url_id)' );

		$sql->add_filters( $this->get_filter_gen_url_columns(), $request );
		$sql->add_sorting( $this->get_filter_gen_url_columns(), $request );

		return $sql;
	}

	private function get_filter_gen_url_columns() {
		return array_merge( $this->prepare_columns( ( new Urlslab_Data_Generator_Url() )->get_columns(), 'm' ), $this->prepare_columns( array( 'url_name' => '%s' ), 'u' ) );
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
