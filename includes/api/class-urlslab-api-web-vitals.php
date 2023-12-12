<?php

class Urlslab_Api_Web_Vitals extends Urlslab_Api_Table {
	const SLUG = 'web-vitals';

	public function register_public_routes() {
		$base = '/' . self::SLUG;
		register_rest_route(
			self::NAMESPACE,
			$base . '/wvmetrics',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'log_web_vitals' ),
					'permission_callback' => array(
						$this,
						'create_item_permissions_check',
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
		register_rest_route( self::NAMESPACE, $base . '/columns', $this->get_columns_route( array( $this, 'get_sorting_columns' ) ) );

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
			$row->wv_id = (int) $row->wv_id;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function log_web_vitals( $request ) {
		$body = json_decode( $request->get_body(), true );
		try {
			if (
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Web_Vitals::SLUG )->get_option( Urlslab_Widget_Web_Vitals::SETTING_NAME_WEB_VITALS ) &&
				@preg_match( '|' . str_replace( '|', '\\|', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Web_Vitals::SLUG )->get_option( Urlslab_Widget_Web_Vitals::SETTING_NAME_WEB_VITALS_URL_REGEXP ) ) . '|uim', $body['url'] )
			) {
				$url               = new Urlslab_Url( $body['url'], true );
				$store_attribution = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Web_Vitals::SLUG )->get_option( Urlslab_Widget_Web_Vitals::SETTING_NAME_WEB_VITALS_ATTRIBUTION );
				$entries           = array();
				foreach ( $body['entries'] as $metric ) {
					$entries[] = new Urlslab_Data_Web_Vital(
						array(
							'event_id'    => $metric['id'],
							'metric_type' => $metric['name'],
							'nav_type'    => $metric['navigationType'],
							'rating'      => $metric['rating'],
							'url_id'      => $url->get_url_id(),
							'url_name'    => $body['url'],
							'value'       => $metric['value'],
							'post_type'   => $body['pt'] ?? '',
							'attribution' => ( 'good' !== $metric['rating'] && $store_attribution ) ? json_encode( $metric['attribution'] ) : '',
							'element'     => $metric['attribution']['element'] ?? $metric['attribution']['largestShiftTarget'] ?? $metric['attribution']['eventTarget'] ?? '',
							'entries'     => ( 'good' !== $metric['rating'] && $store_attribution ) ? json_encode( $metric['entries'] ) : '',
						),
						false
					);
				}
			}
			if ( ! empty( $entries ) ) {
				$entries[0]->insert_all( $entries, false );
			}
		} catch ( Exception $e ) {
		}

		return new WP_REST_Response( '', 200 );
	}

	public function create_item_permissions_check( $request ) {
		return true;
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Web_Vital( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array();
	}
}
