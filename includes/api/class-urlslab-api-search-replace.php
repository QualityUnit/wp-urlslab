<?php

class Urlslab_Api_Search_Replace extends Urlslab_Api_Table {
	const SLUG = 'search-replace';

	public function register_routes() {
		$base = '/' . self::SLUG;
		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );
		register_rest_route( self::NAMESPACE, $base . '/columns', $this->get_columns_route( array( $this, 'get_sorting_columns' ) ) );


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
			$base . '/(?P<id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'str_search'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'str_replace'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'url_filter'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'search_type'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Search_Replace::TYPE_PLAIN_TEXT:
									case Urlslab_Data_Search_Replace::TYPE_REGEXP:
										return true;

									default:
										return false;
								}
							},
						),
						'login_status'  => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Search_Replace::LOGIN_STATUS_ALL:
									case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_IN:
									case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_OUT:
										return true;

									default:
										return false;
								}
							},
						),
						'labels'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'post_types'    => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_string( $param );
							},
						),
						'is_single'     => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_singular'   => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_attachment' => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_page'       => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_home'       => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_front_page' => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_category'   => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_search'     => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_tag'        => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_author'     => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_archive'    => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_sticky'     => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_tax'        => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_feed'       => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
							},
						),
						'is_paged'      => array(
							'required'          => false,
							'default'           => Urlslab_Data_Search_Replace::ANY,
							'validate_callback' => function( $param ) {
								return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
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
				'str_search'    => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'str_replace'   => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'search_type'   => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::TYPE_PLAIN_TEXT,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Data_Search_Replace::TYPE_PLAIN_TEXT:
							case Urlslab_Data_Search_Replace::TYPE_REGEXP:
								return true;

							default:
								return false;
						}
					},
				),
				'login_status'  => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Data_Search_Replace::LOGIN_STATUS_ALL:
							case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_IN:
							case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_OUT:
								return true;

							default:
								return false;
						}
					},
				),
				'urlFilter'     => array(
					'required'          => false,
					'default'           => '.*',
					'validate_callback' => function( $param ) {
						return 250 > strlen( $param );
					},
				),
				'labels'        => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'post_types'    => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'is_single'     => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_singular'   => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_attachment' => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_page'       => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_home'       => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_front_page' => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_category'   => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_search'     => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_tag'        => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_author'     => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_archive'    => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_sticky'     => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_tax'        => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_feed'       => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
					},
				),
				'is_paged'      => array(
					'required'          => false,
					'default'           => Urlslab_Data_Search_Replace::ANY,
					'validate_callback' => function( $param ) {
						return Urlslab_Data_Search_Replace::ANY === $param || Urlslab_Data_Search_Replace::YES === $param || Urlslab_Data_Search_Replace::NO === $param;
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
		return new Urlslab_Data_Search_Replace( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'str_search',
			'str_replace',
			'search_type',
			'login_status',
			'url_filter',
			'labels',
			'post_types',
			'is_single',
			'is_singular',
			'is_attachment',
			'is_page',
			'is_home',
			'is_front_page',
			'is_category',
			'is_search',
			'is_tag',
			'is_author',
			'is_archive',
			'is_sticky',
			'is_tax',
			'is_feed',
			'is_paged',
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


	protected function on_items_updated( array $row = array() ) {
		Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Search_Replace::SLUG )->update_option( Urlslab_Widget_Search_Replace::SETTING_NAME_RULES_VALID_FROM, time() );

		return parent::on_items_updated( $row );
	}
}
