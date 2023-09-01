<?php

class Urlslab_Api_Faq extends Urlslab_Api_Table {
	const SLUG = 'faq';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

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

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<faq_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'question' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'answer'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'language' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'status'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Faq_Row::STATUS_EMPTY:
									case Urlslab_Faq_Row::STATUS_NEW:
									case Urlslab_Faq_Row::STATUS_ACTIVE:
									case Urlslab_Faq_Row::STATUS_DISABLED:
									case Urlslab_Faq_Row::STATUS_PROCESSING:
									case Urlslab_Faq_Row::STATUS_WAITING_FOR_APPROVAL:
										return true;

									default:
										return false;
								}
							},
						),
						'labels'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
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
				'question' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'answer'   => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'language' => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'status'   => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Faq_Row::STATUS_EMPTY:
							case Urlslab_Faq_Row::STATUS_NEW:
							case Urlslab_Faq_Row::STATUS_ACTIVE:
							case Urlslab_Faq_Row::STATUS_DISABLED:
							case Urlslab_Faq_Row::STATUS_PROCESSING:
							case Urlslab_Faq_Row::STATUS_WAITING_FOR_APPROVAL:
								return true;

							default:
								return false;
						}
					},
				),
				'labels'   => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Faq_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'question',
			'answer',
			'language',
			'status',
			'labels',
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		foreach ( $this->get_row_object()->get_columns() as $column => $type ) {
			$sql->add_select_column( $column, 'f' );
		}
		$sql->add_select_column( 'COUNT(*)', false, 'urls_count' );

		$sql->add_from( URLSLAB_FAQS_TABLE . ' f' );
		$sql->add_from( 'LEFT JOIN ' . URLSLAB_FAQ_URLS_TABLE . ' u ON u.faq_id = f.faq_id' );

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'f' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'urls_count' => '%d',
				)
			)
		);

		$sql->add_group_by( 'faq_id', 'f' );

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

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

	public function delete_all_items( WP_REST_Request $request ) {
		//# Sanitization
		$sanitized_req = $request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( $this->get_row_object()->get_table_name() ) ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . sanitize_key( URLSLAB_FAQ_URLS_TABLE ) ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}

		$this->on_items_updated();

		return new WP_REST_Response( __( 'Truncated' ), 200 );
	}


	protected function after_row_deleted( array $row ) {
		global $wpdb;
		$faq_url = new Urlslab_Faq_Url_Row();
		if ( false === $wpdb->delete( $faq_url->get_table_name(), array( 'faq_id' => $row['faq_id'] ) ) ) {
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 400 ) );
		}
		parent::after_row_deleted( $row );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( ! strlen( $row->get_public( 'question' ) ) ) {
			throw new Exception( __( 'Question is required', 'urlslab' ) );
		}
	}
}
