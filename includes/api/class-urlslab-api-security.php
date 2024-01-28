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
			$base . '/add_to_csp_settings/(?P<violated_directive>[a-z\-]+)/(?P<blocked_url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'add_to_csp_settings' ),
					'permission_callback' => array(
						$this,
						'add_to_csp_settings_permissions_check',
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


	public function add_to_csp_settings_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION ) || current_user_can( 'administrator' );
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

	public function add_to_csp_settings( $request ) {
		$violated_directive = $request->get_param( 'violated_directive' );
		$blocked_url_id     = $request->get_param( 'blocked_url_id' );
		$csp_violation      = new Urlslab_Data_Csp(
			array(
				'violated_directive' => $violated_directive,
				'blocked_url_id'     => $blocked_url_id,
			),
			false
		);

		if ( ! $csp_violation->load() ) {
			return new WP_Error( 'error', __( 'Failed to load item', 'urlslab' ), array( 'status' => 404 ) );
		}

		/** @var Urlslab_Widget_Security $widget */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Security::SLUG );
		if ( $widget->add_to_csp_settings( $csp_violation ) ) {
			return new WP_REST_Response( '', 200 );
		}

		return new WP_REST_Response( __( 'Failed to enhance the CSP settings, edit value manually in Settings section', 'urlslab' ), 400 );
	}


	public function report_permissions_check( $request ) {
		return Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Security::SLUG );
	}

	public function report_csp( $request ) {
		$json = json_decode( $request->get_body(), true );
		if ( ! is_array( $json ) ) {
			return new WP_Error( 'invalid_json', 'Invalid JSON', array( 'status' => 400 ) );
		}

		if ( isset( $json['csp-report'] ) ) {
			$csp_reports = array( $json['csp-report'] );
		} else {
			$csp_reports = $json;
		}

		$insert_reports = array();
		foreach ( $csp_reports as $csp_report ) {
			try {
				if ( ! isset( $csp_report['blocked-uri'] ) || ! isset( $csp_report['violated-directive'] ) ) {
					continue;
				}

				$violated_directive = $csp_report['violated-directive'];
				if ( strpos( $violated_directive, ' ' ) !== false ) {
					$violated_directive = explode( ' ', $violated_directive )[0];
				}

				$url = new Urlslab_Url( $csp_report['blocked-uri'], true );
				if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Security::SLUG )->get_option( Urlslab_Widget_Security::SETTING_NAME_CSP_REPORT_URL_DETAIL ) ) {
					$url_id    = $url->get_url_id();
					$url_value = $url->get_url();
				} else {
					$url_id    = $url->get_domain_id();
					$url_value = $url->get_domain_name();
				}
			} catch ( Exception $e ) {
				$url_id    = crc32( md5( $csp_report['blocked-uri'] ) );
				$url_value = sanitize_url( $csp_report['blocked-uri'] );
			}

			$insert_reports[] = $this->get_row_object(
				array(
					'violated_directive' => $violated_directive,
					'blocked_url'        => $url_value,
					'blocked_url_id'     => $url_id,
				)
			);
		}
		if ( ! empty( $insert_reports ) ) {
			$insert_reports[0]->insert_all( $insert_reports, true, array( 'updated' ) );
		}

		return new WP_REST_Response( '', 200, $this->get_headers_no_cache() );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Csp( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
