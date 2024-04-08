<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;

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
			$base . '/generator-task/(?P<task_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'task_status' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Generator_Task::STATUS_NEW == $param;
							},
						),
					),
				),
			)
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
						'validate_callback' => function ( $param ) {
							return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
						},
					),
					'model_name'            => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'post_type'             => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'prompt_template'       => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
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
			$base . '/generator-task/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
			)
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
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_process_result' ),
				'args'     => array(
					'process_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
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
			return new WP_Error( 'urlslab_process_not_found', __( 'Empty process given', 'wp-urlslab' ), array( 'status' => 404 ) );
		}

		// creating the API Instance
		$augment_conn = Urlslab_Connection_Augment::get_instance();
		try {
			$rsp = $augment_conn->get_process_result( $process_id );

			if ( $rsp->getStatus() === 'ERROR' ) {
				return new WP_REST_Response(
					(object) array(
						'message' => $rsp->getResponse()[0],
					),
					400
				);
			}
		} catch ( Urlslab_Vendor\OpenAPI\Client\ApiException $e ) {
			return new WP_Error( 'urlslab_process_not_found', __( 'Process not found', 'wp-urlslab' ), array( 'status' => 404 ) );
		}

		return new WP_REST_Response(
			(object) array(
				'response'            => $augment_conn->remove_markdown( $rsp->getResponse() ),
				'intermediate_result' => $rsp->getIntermediateResponse(),
				'status'              => $rsp->getStatus(),
			),
			200
		);
	}

	public function create_post_generator_tasks( $request ) {
		$model_name            = $request->get_param( 'model_name' );
		$post_type             = $request->get_param( 'post_type' );
		$prompt_template       = $request->get_param( 'prompt_template' );
		$rows                  = array();
		$with_serp_url_context = $request->get_param( 'with_serp_url_context' );

		//validating prompt template
		if (
			$with_serp_url_context &&
			! str_contains( $prompt_template, '{keyword}' ) &&
			! str_contains( $prompt_template, '{context}' )
		) {
			return new WP_REST_Response(
				(object) array( 'message' => 'Prompt template must contain {keyword} and {context} variables' ),
				400
			);
		}
		//validating prompt template

		if ( $with_serp_url_context ) {
			$serp_conn = Urlslab_Connection_Serp::get_instance();
			$queries   = array_map(
				function ( $item ) {
					return new Urlslab_Data_Serp_Query(
						array(
							'query'   => $item['keyword'],
							'country' => $item['country'] ?? 'us',
						)
					);
				},
				$request->get_json_params()['rows']
			);
			$serp_urls = $serp_conn->get_serp_top_urls( $queries );
		}

		foreach ( $request->get_json_params()['rows'] as $item ) {
			$task_data              = array();
			$task_data['model']     = $model_name;
			$task_data['post_type'] = $post_type;
			$task_data['keyword']   = $item['keyword'];
			$row_prompt_template    = $prompt_template;
			if ( str_contains( $row_prompt_template, '{keyword}' ) ) {
				$row_prompt_template = str_replace( '{keyword}', $task_data['keyword'], $row_prompt_template );
			}
			$task_data['prompt'] = $row_prompt_template;

			if ( $with_serp_url_context ) {
				$task_data['urls'] = $serp_urls[ $item['keyword'] ] ?? array();
			}
			$rows[] = $this->get_row_object(
				array(
					'generator_type' => Urlslab_Data_Generator_Task::GENERATOR_TYPE_POST_CREATION,
					'task_data'      => json_encode( $task_data ),
				)
			);
		}

		$result = $this->get_row_object()->import( $rows );

		if ( ! $result ) {
			return new WP_REST_Response(
				(object) array(
					'message' => __( 'Import failed', 'wp-urlslab' ),
				),
				500
			);
		}

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Imported successfully', 'wp-urlslab' ),
			),
			200
		);
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Generator_Task( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
