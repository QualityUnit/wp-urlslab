<?php

class Urlslab_Api_Prompt_Template extends Urlslab_Api_Table {
	const SLUG = 'prompt-template';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
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
			$this->get_count_route(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
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
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'DELETE * FROM' . URLSLAB_PROMPT_TEMPLATE_TABLE . ' WHERE prompt_type = %s', //phpcs:ignore
				Urlslab_Prompt_Template_Row::USER_PROMPT_TYPE
			)
		);
		return new WP_REST_Response( array( 'message' => 'All items deleted' ), 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Prompt_Template_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'template_name',
			'model_name',
			'prompt_template',
		);
	}
}


