<?php

class Urlslab_Api_Prompt_Template extends Urlslab_Api_Table {
	const SLUG = 'prompt-template';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			$this->get_route_get_items()
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/import',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'import_items' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'rows' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/create',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'args'                => array(
					'template_name'   => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'model_name'      => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'prompt_template' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
					'prompt_type'     => array(
						'required'          => false,
						'validate_callback' => function ( $param ) {
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
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/columns', $this->get_columns_route( array( $this, 'get_sorting_columns' ) ) );

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
			$base . '/(?P<template_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'template_name'   => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'model_name'      => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'prompt_template' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
						'prompt_type'     => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
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

	public function validate_item( Urlslab_Data $row ) {
		if ( ! ( $row instanceof Urlslab_Data_Prompt_Template ) ) {
			throw new Exception( __( 'Invalid prompt template data' ) );
		}

		/* @var Urlslab_Data_Prompt_Template $row */

		if ( ! in_array( $row->get_prompt_type(), Urlslab_Data_Prompt_Template::get_all_prompt_types() ) ) {
			throw new Exception( __( 'Invalid prompt type for prompt: ' ) . $row->get_template_name() );
		}

		if ( empty( $row->get_prompt_template() ) ) {
			throw new Exception( __( 'No prompt template or empty prompt template for prompt: ' ) . $row->get_template_name() );
		}

		if ( ! in_array( $row->get_model_name(), array_keys( Urlslab_Connection_Augment::get_valid_ai_models() ) ) ) {
			throw new Exception( __( 'Invalid Model Name for prompt: ' ) . $row->get_template_name() );
		}
	}

	public function create_item( $request ) {
		// prompt template validation
		$prompt_type     = $request->get_param( 'prompt_type' );
		$prompt_template = $request->get_param( 'prompt_template' );

		if ( Urlslab_Data_Prompt_Template::ANSWERING_TASK_PROMPT_TYPE === $prompt_type ) {
			if ( ! str_contains( $prompt_template, '{question}' ) ) {
				return new WP_REST_Response( array( 'message' => 'prompt_template must contain {question} variable' ), 400 );
			}
		}

		return parent::create_item( $request );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Prompt_Template( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'template_name',
			'model_name',
			'prompt_template',
			'prompt_type',
		);
	}
}
