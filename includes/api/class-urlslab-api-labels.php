<?php

class Urlslab_Api_Labels extends Urlslab_Api_Table {
	const SLUG = 'label';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/modules', $this->get_route_get_modules() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );

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
			$base . '/(?P<label_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}


	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'name'    => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'bgcolor' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'modules' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_array( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->label_id = (int) $row->label_id;
			$row->value = (int) $row->label_id;
			$row->label = (string) $row->name;
			$row->modules  = explode( ',', $row->modules );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_modules( $request ) {
		$rows   = (object) array(
			Urlslab_Api_Urls::SLUG => __( 'URL Monitoring', 'urlslab' ),
			Urlslab_Api_Keywords::SLUG => __( 'Link Building', 'urlslab' ),
			Urlslab_Api_Generators::SLUG => __( 'AI Content Generator', 'urlslab' ),
			Urlslab_Api_Faq::SLUG => __( 'Frequently Asked Questions', 'urlslab' ),
			Urlslab_Api_Meta_Tags::SLUG => __( 'Meta Tags Manager', 'urlslab' ),
			Urlslab_Api_Files::SLUG => __( 'Media Manager', 'urlslab' ),
			Urlslab_Api_Screenshots::SLUG => __( 'Screenshots', 'urlslab' ),
			Urlslab_Api_Redirects::SLUG => __( 'Redirects and 404 Monitor', 'urlslab' ),
			Urlslab_Api_Search_Replace::SLUG => __( 'Search and Replace', 'urlslab' ),
			Urlslab_Serp::SLUG => __( 'SERP Monitoring', 'urlslab' ),
			Urlslab_Api_Js_Cache::SLUG => __( 'Cache', 'urlslab' ),
			Urlslab_Api_Youtube_Cache::SLUG => __( 'Lazy Loading', 'urlslab' ),
			Urlslab_Api_Custom_Html::SLUG => __( 'Code Injection', 'urlslab' ),
		);

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Label_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'name', 'bgcolor', 'modules' );
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
		$sql->add_select_column( '*' );
		$sql->add_from( $this->get_row_object()->get_table_name() );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	private function get_route_get_modules() {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_modules' ),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}
}
