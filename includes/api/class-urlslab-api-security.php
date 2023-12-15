<?php

class Urlslab_Api_Security extends Urlslab_Api_Table {
	const SLUG = 'security';

	public function register_public_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base . '/report_csp',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'report_csp' ),
					'permission_callback' => array(
						$this,
						'report_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route(
			self::NAMESPACE,
			$base . '/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->blocked_url_id = (int) $row->blocked_url_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function report_permissions_check( $request ) {
		return Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Security::SLUG );
	}

	public function report_csp( $request ) {
		$json = json_decode( $request->get_body(), true );
		if ( ! isset( $json['csp-report']['violated-directive'] ) || ! isset( $json['csp-report']['blocked-uri'] ) ) {
			return new WP_Error( 'invalid_json', 'Invalid JSON', array( 'status' => 400 ) );
		}

		try {
			$url = new Urlslab_Url( $json['csp-report']['blocked-uri'], true );
			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Security::SLUG )->get_option( Urlslab_Widget_Security::SETTING_NAME_CSP_REPORT_URL_DETAIL ) ) {
				$url_id    = $url->get_url_id();
				$url_value = $url->get_url();
			} else {
				$url_id    = $url->get_domain_id();
				$url_value = $url->get_domain_name();
			}
		} catch ( Exception $e ) {
			$url_id    = crc32( md5( $json['csp-report']['blocked-uri'] ) );
			$url_value = sanitize_url( $json['csp-report']['blocked-uri'] );
		}

		$obj = $this->get_row_object(
			array(
				'violated_directive' => $json['csp-report']['violated-directive'],
				'blocked_url'        => $url_value,
				'blocked_url_id'     => $url_id,
			)
		);
		$obj->insert_all( array( $obj ), true, array( 'updated' ) );

		return new WP_REST_Response( '', 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Csp( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
