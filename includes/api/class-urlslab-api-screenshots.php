<?php

class Urlslab_Api_Screenshots extends Urlslab_Api_Urls {
	public function __construct() {
		$this->base = '/screenshot';
	}

	public function register_routes() {
		register_rest_route( self::NAMESPACE, $this->base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $this->base . '/count', $this->get_count_route( $this->get_route_get_items() ) );

		register_rest_route(
			self::NAMESPACE,
			$this->base . '/(?P<url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'scr_status'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Url_Row::SCR_STATUS_ERROR:
									case Urlslab_Url_Row::SCR_STATUS_NEW:
									case Urlslab_Url_Row::SCR_STATUS_ACTIVE:
										return true;

									default:
										return false;
								}
							},
						),
						'http_status' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param );
							},
						),
						'url_title'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'labels'     => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$this->base . '/(?P<url_id>[0-9]+)',
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

		register_rest_route( self::NAMESPACE, $this->base . '/(?P<screenshot_url_id>[0-9]+)/linked-from', $this->get_route_get_screenshot_usage() );
		register_rest_route( self::NAMESPACE, $this->base . '/(?P<screenshot_url_id>[0-9]+)/linked-from/count', $this->get_count_route( $this->get_route_get_screenshot_usage() ) );
	}

	public function get_editable_columns(): array {
		return array( 'scr_status', 'labels' );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$body = $request->get_json_params();
		if ( ! is_array( $body['filters'] ) ) {
			$body['filters'] = array();
		}
		$body['filters'][] = array(
			'col' => 'scr_status',
			'op'  => '<>',
			'val' => '',
		);
		$request->set_body( json_encode( $body ) );

		return parent::get_items_sql( $request );
	}

	protected function get_custom_columns() {
		return array( 'screenshot_usage_count' => '%d' );
	}
}
