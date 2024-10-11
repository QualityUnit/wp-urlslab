<?php
use FlowHunt_Vendor\OpenAPI\Client\Model\FlowInvokeRequest;

class Urlslab_Api_Generators extends Urlslab_Api_Table {
	const SLUG = 'generator';

	public function register_routes() {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'target_lang'   => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'original_text' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'post_type'    => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'post_title'   => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_array( $param );
							},
						),
						'prompt' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'model'  => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'model'            => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'domain_filter'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'tone'             => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'model'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'lang'             => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'domain_filter'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_array( $param );
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
							'validate_callback' => function ( $param ) {
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
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'labels' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
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
				'prompt_variables' => $res->get_prompt_variables(),
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

		if ( ! empty( $source_lang ) && ! empty( $target_lang ) && $this->isTextForTranslation( $original_text ) && Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Content_Generator::SLUG ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Content_Generator::SLUG );
			if ( $widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_TRANSLATE ) ) {
				$request = new FlowInvokeRequest( array( 'human_input' => $original_text ) );
				$request->setVariables(
					array(
						'source_lang' => $source_lang,
						'target_lang' => $target_lang,
					)
				);

				$response = Urlslab_Connection_Flows::get_instance()->get_client()->invokeFlowSingleton(
					$widget->get_option( Urlslab_Widget_Content_Generator::SETTING_NAME_TRANSLATE_FLOW_ID ),
					Urlslab_Connection_FlowHunt::get_workspace_id(),
					$request
				);

				switch ( $response->getStatus() ) {
					case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::SUCCESS:
						$result = json_decode( $response->getResult() );
						$translation = $result->output;
						break;
					case \FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus::PENDING:
						$translation = 'translating, repeat request in few seconds to get translation...';
						break;
					default:
						$translation = $original_text;
				}
			}
		}


		return new WP_REST_Response( (object) array( 'translation' => $translation ), 200 );
	}

	public function get_url_context_augmentation( $request ) {
		throw new Exception( 'Not implemented' );
	}


	public function async_augment( $request ) {
		throw new Exception( 'Not implemented' );
	}

	public function get_instant_augmentation( $request ) {
		throw new Exception( 'Not implemented' );
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
			try {
				if ( ! empty( $row->url_name ) ) {
					$url           = new Urlslab_Url( $row->url_name, true );
					$row->url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {
				$row->url_name = '';
			}
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
