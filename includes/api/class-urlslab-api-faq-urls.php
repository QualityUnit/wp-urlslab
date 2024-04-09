<?php

class Urlslab_Api_Faq_Urls extends Urlslab_Api_Table {
	const SLUG = 'faqurls';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
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
							'validate_callback' => function ( $param ) {
								return is_array( $param ) && self::MAX_ROWS_PER_PAGE >= count( $param );
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<faq_id>[0-9]+)/(?P<url_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'sorting' => array(
							'required'          => false,
							'default'           => 10,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param ) && 0 <= $param && 100 >= $param;
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/suggest-urls/',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'suggest_faq_urls' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'answer'   => array(
							'required'          => false,
							'default'           => '',
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'question' => array(
							'required'          => false,
							'default'           => '',
							'validate_callback' => function ( $param ) {
								return ! empty( $param ) && is_string( $param );
							},
						),
						'faq_id'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param ) && 0 < $param;
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
				'url_name' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'faq_id'   => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param );
					},
				),
				'sorting'  => array(
					'required'          => false,
					'default'           => 10,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param ) && 0 <= $param && 100 >= $param;
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
		return new Urlslab_Data_Faq_Url( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'sorting' );
	}

	public function create_item( $request ) {
		try {
			$url = new Urlslab_Url( $request->get_param( 'url_name' ), true );
			$request->set_param( 'url_id', $url->get_url_id() );

			// changing adding the url to urls table
			Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( $url );

		} catch ( Exception $e ) {
		}

		return parent::create_item( $request );
	}


	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name' ) );

		// changing all faq_id to fu.faq_id
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_name', 'u' );
		$sql->add_select_column( 'post_id', 'u' );
		$sql->add_select_column( 'faq_id', 'fu' );
		$sql->add_select_column( 'url_id', 'fu' );
		$sql->add_select_column( 'question', 'f' );
		$sql->add_select_column( 'sorting', 'fu' );
		$sql->add_from( URLSLAB_FAQ_URLS_TABLE . ' as fu' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_FAQS_TABLE . ' as f ON f.faq_id = fu.faq_id' );
		$sql->add_from( 'INNER JOIN ' . URLSLAB_URLS_TABLE . ' as u ON fu.url_id = u.url_id' );

		$sql->add_filters( $this->get_filter_columns(), $request );
		$sql->add_having_filters( $this->get_having_columns(), $request );
		$sql->add_sorting( $this->get_sorting_columns(), $request );

		return $sql;
	}

	protected function get_filter_columns(): array {
		return array_merge(
			$this->prepare_columns(
				array(
					'url_name' => '%s',
					'post_id'  => '%d',
				),
				'u'
			),
			$this->prepare_columns(
				array(
					'url_id'  => '%d',
					'faq_id'  => '%d',
					'sorting' => '%d',
				),
				'fu'
			),
			$this->prepare_columns( array( 'question' => '%s' ), 'f' )
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
			$row->faq_id  = (int) $row->faq_id;
			$row->url_id  = (int) $row->url_id;
			$row->sorting = (int) $row->sorting;
			$row->post_id = (int) $row->post_id;
			if ( $row->post_id > 0 ) {
				$row->edit_url_name = get_edit_post_link( $row->post_id, 'js' );
			}

			try {
				$row->url_name = Urlslab_Url::add_current_page_protocol( $row->url_name );
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function before_import( Urlslab_Data $row_obj, array $row ): Urlslab_Data {
		try {
			$url = new Urlslab_Url( $row['url_name'], true );
			$row_obj->set_public( 'url_id', $url->get_url_id() );
			Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_url( $url );
		} catch ( Exception $e ) {
		}

		return parent::before_import( $row_obj, $row );
	}

	public function suggest_faq_urls( WP_REST_Request $request ) {
		if ( $request->has_param( 'answer' ) || $request->has_param( 'question' ) ) {
			$query = trim( $request->get_param( 'question' ) . ' ' . $request->get_param( 'answer' ) );
		} else if ( $request->has_param( 'faq_id' ) ) {
			$faq = new Urlslab_Data_Faq( array( 'faq_id' => $request->get_param( 'faq_id' ) ), false );
			if ( ! $faq->load() ) {
				return new WP_Error( 'error', __( 'FAQ not found!', 'urlslab' ), array( 'status' => 404 ) );
			}
			$query = trim( $faq->get_question() . ' ' . $faq->get_answer() );
		} else {
			return new WP_Error( 'error', __( 'No question or answer provided!', 'urlslab' ), array( 'status' => 400 ) );
		}

		$related_urls_conn = Urlslab_Connection_Related_Urls::get_instance();
		$widget            = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Faq::SLUG );
		$searching_domains = $widget->get_option( Urlslab_Widget_Faq::SETTING_NAME_FAQ_DOMAINS );
		$not_older_than    = $widget->get_option( Urlslab_Widget_Faq::SETTING_NAME_FAQ_URL_ASSIGNMENT_LAST_SEEN );
		$urls              = $related_urls_conn->get_related_urls_to_query( $query, 1, $searching_domains, $not_older_than );

		return new WP_REST_Response( $urls, 200 );
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
