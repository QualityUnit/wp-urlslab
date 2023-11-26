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
			$base . '/create',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'args'                => array(
					'template_name' => array(
						'required'          => true,
						'validate_callback' => function( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
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
					'prompt_type' => array(
						'required'          => false,
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
						'template_name' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param ) && ! empty( $param );
							},
						),
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
						'prompt_type' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
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

	public function create_item( $request ) {
		// prompt template validation
		$prompt_type = $request->get_param( 'prompt_type' );
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


