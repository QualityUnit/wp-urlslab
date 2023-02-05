<?php

class Urlslab_Api_Css_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/css-cache';
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(
						array(
							'filter_url'    => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 255 >= strlen( $param );
								},
							),
							'filter_status' => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									switch ( $param ) {
										case Urlslab_CSS_Cache_Row::STATUS_ACTIVE:
										case Urlslab_CSS_Cache_Row::STATUS_DISABLED:
										case Urlslab_CSS_Cache_Row::STATUS_NEW:
										case Urlslab_CSS_Cache_Row::STATUS_PENDING:
											return true;
										default:
											return false;
									}
								},
							),
						)
					),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'status' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_CSS_Cache_Row::STATUS_ACTIVE:
									case Urlslab_CSS_Cache_Row::STATUS_DISABLED:
									case Urlslab_CSS_Cache_Row::STATUS_NEW:
									case Urlslab_CSS_Cache_Row::STATUS_PENDING:
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
					'callback'            => array( $this, 'detele_all_items' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	public function get_items( $request ) {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_CSS_CACHE_TABLE );

		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_url', '%s', 'LIKE' );
		$sql->add_filter( 'filter_status' );

		$order_data = array();
		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}
		$sql->add_order( 'url_id' );

		$rows = $sql->get_results();

		if ( null == $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id   = (int) $row->url_id;
			$row->filesize = (int) $row->filesize;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_CSS_Cache_Row( $params );
	}

	function get_editable_columns(): array {
		return array( 'status' );
	}
}
