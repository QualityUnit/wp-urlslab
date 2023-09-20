<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest;

class Urlslab_Api_Process extends Urlslab_Api_Table {
	const SLUG = 'process';
	public const MAX_ROWS_PER_PAGE = 30;

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base . '/generator-task',
			$this->get_route_get_items()
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/generator-task/import',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_post_generator_tasks' ),
				'args'                => array(
					'rows'                  => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
						},
					),
					'model_name' => array(
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
					'prompt_template' => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'with_serp_url_context' => array(
						'required'          => false,
						'default'           => false,
						'validate_callback' => function ( $param ) {
							return is_bool( $param );
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
			$base . '/generator-task/count',
			$this->get_count_route( array( $this->get_route_get_items() ) )
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/generator-task/delete',
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
			$base . '/generator-task/delete-all',
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

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
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

	public function create_post_generator_tasks( $request ) {
		$model_name = $request->get_param( 'model_name' );
		$post_type = $request->get_param( 'post_type' );
		$prompt_template = $request->get_param( 'prompt_template' );
		$rows                  = array();
		$with_serp_url_context = $request->get_param( 'with_serp_url_context' );

		$serp_urls = array();
		if ( $with_serp_url_context ) {
			// getting serp res
			$batches = array_chunk( $request->get_json_params()['rows'], 5 );
			foreach ( $batches as $batch_items ) {
				// processing each batch

				$requesting_queries = array();

				foreach ( $batch_items as $keyword ) {
					$query = new Urlslab_Serp_Query_Row(
						array(
							'query' => $keyword,
						)
					);

					if ( ! $query->load() || Urlslab_Serp_Query_Row::STATUS_SKIPPED === $query->get_status() ) {
						$requesting_queries[] = $query;
					} else {
						global $wpdb;
						$results = $wpdb->get_results(
							$wpdb->prepare(
								'SELECT u.* FROM ' . URLSLAB_GSC_POSITIONS_TABLE . ' p INNER JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON u.url_id = p.url_id WHERE p.query_id=%d ORDER BY p.position LIMIT 3', // phpcs:ignore
								$query->get_query_id()
							),
							ARRAY_A
						);


						$urls = array();
						foreach ( $results as $result ) {
							$row    = new Urlslab_Serp_Url_Row( $result, true );
							$urls[] = $row->get_url_name();
						}
						$serp_urls[ $query->get_query() ] = $urls;
					}

					// serp requests
				}
				if ( ! empty( $requesting_queries ) ) {
					$ret = $this->get_serp_results( $requesting_queries );
					foreach ( $ret as $keyword => $urls ) {
						$data = array();
						foreach ( $urls as $url ) {
							$data[] = $url->get_url_name();
						}
						$serp_urls[ $keyword ] = $data;
					}
				}
			}       
		}

		foreach ( $request->get_json_params()['rows'] as $keyword ) {
			$task_data              = array();
			$task_data['model']     = $model_name;
			$task_data['post_type'] = $post_type;
			$task_data['keyword']   = $keyword;
			$row_prompt_template        = $prompt_template;
			if ( str_contains( $row_prompt_template, '{keyword}' ) ) {
				$row_prompt_template = str_replace( '{keyword}', $task_data['keyword'], $row_prompt_template );
			}
			$task_data['prompt'] = $row_prompt_template;

			if ( $with_serp_url_context ) {
				$task_data['urls'] = $serp_urls[ $keyword ] ?? array();
			}
			$rows[] = $this->get_row_object(
				array(
					'generator_type' => Urlslab_Generator_Task_Row::GENERATOR_TYPE_POST_CREATION,
					'task_data'      => json_encode( $task_data ),
				)
			);
		}

		$result = $this->get_row_object()->import( $rows );

		if ( ! $result ) {
			return new WP_REST_Response( 'Import failed', 500 );
		}

		return new WP_REST_Response( 'Imported successfully', 200 );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_GENERATOR_TASKS_TABLE );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	private function get_serp_results( $queries ): array {
		$serp_conn = Urlslab_Serp_Connection::get_instance();
		$serp_res  = $serp_conn->bulk_search_serp( $queries, DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY );

		$saving_qs = array();
		$ret = array();
		foreach ( $serp_res->getSerpData() as $idx => $rsp ) {
			$query = $queries[ $idx ];
			$serp_data = $serp_conn->extract_serp_data( $query, $rsp, 50 ); // max_import_pos doesn't matter here
			$serp_conn->save_extracted_serp_data( $serp_data['urls'], $serp_data['positions'], $serp_data['domains'] );
			$query->set_status( Urlslab_Serp_Query_Row::STATUS_PROCESSED );
			$saving_qs[] = $query;

			$cnt = 0;
			$urls = array();
			foreach ( $serp_data['urls'] as $url ) {
				if ( $cnt >= 4 ) {
					break;
				}
				$cnt++;
				$urls[] = $url;
			}
			$ret[ $query->get_query() ] = $urls;
		}

		if ( ! empty( $saving_qs ) ) {
			$saving_qs[0]->insert_all( $saving_qs );
		}
		return $ret;
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Generator_Task_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
