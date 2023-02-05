<?php

class Urlslab_Api_Youtube_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/youtube-cache';
		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(
						array(
							'filter_videoid' => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 0 == strlen( $param ) || 32 >= strlen( $param );
								},
							),
							'filter_status'  => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									switch ( $param ) {
										case Urlslab_Youtube_Data::STATUS_AVAILABLE:
										case Urlslab_Youtube_Data::STATUS_NEW:
										case Urlslab_Youtube_Data::STATUS_DISABLED:
										case Urlslab_Youtube_Data::STATUS_PROCESSING:
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
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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
									case Urlslab_Youtube_Data::STATUS_NEW:
									case Urlslab_Youtube_Data::STATUS_DISABLED:
									case Urlslab_Youtube_Data::STATUS_AVAILABLE:
									case Urlslab_Youtube_Data::STATUS_PROCESSING:
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
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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
		$sql->add_from( URLSLAB_YOUTUBE_CACHE_TABLE );


		$this->add_filter_table_fields( $sql );

		$sql->add_filter( 'filter_videoid' );
		$sql->add_filter( 'filter_status' );

		if ( $request->get_param( 'sort_column' ) ) {
			$sql->add_order( $request->get_param( 'sort_column' ), $request->get_param( 'sort_direction' ) );
		}

		$sql->add_order( 'videoid' );

		$rows = $sql->get_results();

		if ( null == $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Youtube_Data( $params );
	}

	function get_editable_columns(): array {
		return array( 'status' );
	}
}
