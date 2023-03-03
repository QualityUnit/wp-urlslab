<?php

class Urlslab_Api_Search_Replace extends Urlslab_Api_Table {

	public function register_routes() {
		$base = '/search-replace';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'str_search'  => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'str_replace' => array(
							'required'          => true,
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
							'required'          => true,
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
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
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);

	}

	private function get_route_get_items(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => $this->get_table_arguments(
					array(
						'filter_str_search'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_str_replace' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_search_type' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
						'filter_url_filter'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return Urlslab_Api_Table::validate_string_filter_value( $param );
							},
						),
					)
				),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		);
	}

	protected function get_items_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_SEARCH_AND_REPLACE_TABLE );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_str_search' );
		$sql->add_filter( 'filter_str_replace' );
		$sql->add_filter( 'filter_search_type' );
		$sql->add_filter( 'filter_url_filter' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}

		$sql->add_order( 'id' );

		return $sql;
	}


	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Search_Replace_Row( $params );
	}

	function get_editable_columns(): array {
		return array( 'str_search', 'str_replace', 'search_type', 'url_filter' );
	}
}
