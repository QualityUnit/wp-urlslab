<?php

class Urlslab_Api_Youtube_Cache extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/youtube-cache';
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'status' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Youtube_Row::STATUS_NEW:
									case Urlslab_Youtube_Row::STATUS_DISABLED:
									case Urlslab_Youtube_Row::STATUS_AVAILABLE:
									case Urlslab_Youtube_Row::STATUS_PROCESSING:
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
			$base . '/(?P<videoid>[0-9a-zA-Z_\-]+)',
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
	}

	public function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Youtube_Row( $params );
	}

	public function get_editable_columns(): array {
		return array( 'status' );
	}

	protected function get_items_sql( $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_YOUTUBE_CACHE_TABLE );

		$sql->add_filters( $this->get_row_object()->get_columns(), $request );
		$sql->add_sorting( $this->get_row_object()->get_columns(), $request );

		return $sql;
	}

	private function get_route_get_items(): array {
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
}
