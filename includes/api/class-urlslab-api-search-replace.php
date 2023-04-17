<?php

class Urlslab_Api_Search_Replace extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/search-replace';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'str_search'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'str_replace' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'url_filter'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'search_type' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Search_Replace_Row::TYPE_PLAIN_TEXT:
									case Urlslab_Search_Replace_Row::TYPE_REGEXP:
										return true;

									default:
										return false;
								}
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
			$base . '/(?P<id>[0-9]+)',
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
							'validate_callback' => function( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
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
				'str_search'  => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'str_replace' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'search_type' => array(
					'required'          => false,
					'default'           => Urlslab_Search_Replace_Row::TYPE_PLAIN_TEXT,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Search_Replace_Row::TYPE_PLAIN_TEXT:
							case Urlslab_Search_Replace_Row::TYPE_REGEXP:
								return true;

							default:
								return false;
						}
					},
				),
				'urlFilter'   => array(
					'required'          => false,
					'default'           => '.*',
					'validate_callback' => function( $param ) {
						return 250 > strlen( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Search_Replace_Row( $params );
	}

	public function get_editable_columns(): array {
		return array(
			'str_search',
			'str_replace',
			'search_type',
			'url_filter',
		);
	}

	protected function get_items_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_SEARCH_AND_REPLACE_TABLE );

		$sql->add_filters( $this->get_row_object()->get_columns(), $request );
		$sql->add_sorting( $this->get_row_object()->get_columns(), $request );
		return $sql;
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
}
