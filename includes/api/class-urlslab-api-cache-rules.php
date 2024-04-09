<?php

class Urlslab_Api_Cache_Rules extends Urlslab_Api_Table {
	const SLUG = 'cache-rules';
	private \Aws\CloudFront\CloudFrontClient $cloudfront;

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
			$base . '/invalidate',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'invalidate_cache' ),
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
			$base . '/invalidate',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'invalidate_cache_object' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(
						'url' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_string( $param ) && strlen( $param ) > 0;
							},
						),
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/validate-cloudfront',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'validate_cloudfront' ),
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
			$base . '/drop-cloudfront',
			array(
				array(
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => array( $this, 'drop_cloudfront' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(
						'pattern' => array(
							'required'          => false,
							'default'           => '',
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
					),
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
			$base . '/(?P<rule_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'match_type'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::MATCH_TYPE_SUBSTRING == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_EXACT == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_REGEXP == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES == $param;
							},
						),
						'match_url'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'is_active'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_bool( $param ) || Urlslab_Data_Cache_Rule::ACTIVE_YES == $param || Urlslab_Data_Cache_Rule::ACTIVE_NO == $param;
							},
						),
						'ip'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'browser'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'cookie'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'headers'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'params'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'labels'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'valid_from'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'rule_order'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'cache_ttl'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'post_types'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'is_single'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_singular'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_attachment' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_page'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_home'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_front_page' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_category'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_search'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_tag'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_author'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_archive'    => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_sticky'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_tax'        => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_feed'       => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
						'is_paged'      => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
							},
						),
					),
				),
			)
		);
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION ) || current_user_can( 'administrator' );
	}

	public function delete_item_permissions_check( $request ) {
		return $this->update_item_permissions_check( $request );
	}

	/**
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'match_type'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::MATCH_TYPE_SUBSTRING == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_EXACT == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_REGEXP == $param || Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES == $param;
					},
				),
				'match_url'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'is_active'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_bool( $param ) || Urlslab_Data_Cache_Rule::ACTIVE_YES == $param || Urlslab_Data_Cache_Rule::ACTIVE_NO == $param;
					},
				),
				'ip'            => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'browser'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'cookie'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'headers'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'params'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'labels'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'valid_from'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param );
					},
				),
				'rule_order'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param );
					},
				),
				'cache_ttl'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_numeric( $param );
					},
				),
				'post_types'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return is_string( $param );
					},
				),
				'is_single'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_singular'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_attachment' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_page'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_home'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_front_page' => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_category'   => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_search'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_tag'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_author'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_archive'    => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_sticky'     => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_tax'        => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_feed'       => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
				'is_paged'      => array(
					'required'          => false,
					'validate_callback' => function ( $param ) {
						return Urlslab_Data_Cache_Rule::ANY === $param || Urlslab_Data_Cache_Rule::YES === $param || Urlslab_Data_Cache_Rule::NO === $param;
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
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
			$row->rule_id    = (int) $row->rule_id;
			$row->cache_ttl  = (int) $row->cache_ttl;
			$row->rule_order = (int) $row->rule_order;
			$row->valid_from = (int) $row->valid_from;
			$row->is_active  = Urlslab_Data_Cache_Rule::ACTIVE_YES === $row->is_active;
		}

		return new WP_REST_Response( $rows, 200 );
	}


	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Cache_Rule( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array(
			'match_type',
			'match_url',
			'is_active',
			'ip',
			'browser',
			'cookie',
			'headers',
			'params',
			'labels',
			'valid_from',
			'rule_order',
			'cache_ttl',
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

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		if ( 'import' == $request->get_param( 'rule_id' ) ) {
			return $this->import_items( $request );
		}
		$request->set_param( 'valid_from', time() );

		return parent::update_item( $request );
	}

	protected function on_items_updated( array $rows = array() ) {
		Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG )->update_option( Urlslab_Widget_Cache::SETTING_NAME_CACHE_VALID_FROM, time() );

		return parent::on_items_updated( $rows );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( Urlslab_Data_Cache_Rule::MATCH_TYPE_REGEXP == $row->get_public( 'match_type' ) ) {
			@preg_match( '|' . str_replace( '|', '\\|', $row->get_public( 'match_url' ) ) . '|uim', 'any text to match' );
			if ( PREG_NO_ERROR !== preg_last_error() ) {
				throw new Exception( esc_html( __( 'Invalid regular expression', 'urlslab' ) ) );
			}
		}
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

	public function invalidate_cache( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_CACHE_RULES_TABLE . ' SET valid_from=%d ', time() ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to invalidate cache', 'urlslab' ), array( 'status' => 400 ) );
		}

		Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG )->update_option( Urlslab_Widget_Cache::SETTING_NAME_CACHE_VALID_FROM, time() );
		Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG )->invalidate_old_cache();
		Urlslab_Cache::get_instance()->delete_group( Urlslab_Widget_Cache::CACHE_RULES_GROUP );
		Urlslab_Cache::get_instance()->delete_group( Urlslab_Widget_Cache::PAGE_CACHE_GROUP );

		return new WP_REST_Response( array( 'message' => __( 'Cache invalidated', 'urlslab' ) ), 200 );
	}

	public function invalidate_cache_object( WP_REST_Request $request ) {
		/** @var Urlslab_Widget_Cache $widget */
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
		if ( $widget ) {
			if ( $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_MULTISERVER ) ) {
				return new WP_REST_Response( array( 'message' => __( 'In multi server installation is not possible to invalidate single object in cache. Invalidate all objects in case.', 'urlslab' ) ), 200 );
			}
			$widget->invalidate_cache_object( $request->get_param( 'url' ) );
		}

		return new WP_REST_Response( array( 'message' => __( 'Cache invalidated', 'urlslab' ) ), 200 );
	}

	public function validate_cloudfront( WP_REST_Request $request ) {
		if ( ! $this->init_cloudfront_client() ) {
			return new WP_Error( 'error', __( 'CloudFront is not configured', 'urlslab' ), array( 'status' => 400 ) );
		}
		try {
			$widget            = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
			$arr_distributions = array();
			$distributions     = $this->cloudfront->listDistributions();
			if ( count( $distributions ) > 0 ) {
				foreach ( $distributions['DistributionList']['Items'] as $distribution ) {
					$uri = '';
					if ( is_array( $distribution['Aliases']['Items'] ) ) {
						$uri = ' ' . implode( ', ', $distribution['Aliases']['Items'] );
					}
					$arr_distributions[ $distribution['Id'] ] = $distribution['Id'] . ' (' . $distribution['Status'] . ')' . $uri;
				}
			}
			$widget->update_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_DISTRIBUTIONS, $arr_distributions );
		} catch ( Aws\Exception\AwsException $e ) {
			return new WP_Error( 'error', __( 'Failed to connect to CloudFront: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
		}

		return new WP_REST_Response( array( 'message' => __( 'Connected to CloudFront', 'urlslab' ) ), 200 );
	}

	public function drop_cloudfront( WP_REST_Request $request ) {
		if ( ! $this->init_cloudfront_client() ) {
			return new WP_Error( 'error', __( 'CloudFront is not configured yet', 'urlslab' ), array( 'status' => 400 ) );
		}
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );

		if ( empty( $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID ) ) ) {
			return new WP_Error( 'error', __( 'Distribution ID is not set', 'urlslab' ), array( 'status' => 400 ) );
		}

		$pattern_paths = array();
		if ( strlen( $request->get_param( 'pattern' ) ) ) {
			$str_pattern = $request->get_param( 'pattern' );
		} else {
			$str_pattern = $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_PATTERN_DROP );
		}
		$paths = preg_split( '/(,|\n|\t)\s*/', $str_pattern );
		foreach ( $paths as $path ) {
			$path = trim( $path );
			if ( strlen( $path ) > 0 ) {
				$pattern_paths[] = $path;
			}
		}
		if ( empty( $pattern_paths ) ) {
			return new WP_Error( 'error', __( 'Pattern is not set. If you want to drop all cache objects, use as pattern value: /*', 'urlslab' ), array( 'status' => 400 ) );
		}

		try {
			$result = $this->cloudfront->createInvalidation(
				array(
					'DistributionId'    => $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID ),
					'InvalidationBatch' => array(
						'CallerReference' => time() . '-' . $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_DISTRIBUTION_ID ) . '-urlslab-invalidation',
						'Paths'           => array(
							'Quantity' => count( $pattern_paths ),
							'Items'    => $pattern_paths,
						),
					),
				)
			);
			$this->invalidate_cache( $request );
		} catch ( Aws\Exception\AwsException $e ) {
			return new WP_Error( 'error', __( 'Failed to drop cache: ', 'urlslab' ) . $e->getMessage(), array( 'status' => 400 ) );
		}

		return new WP_REST_Response( array( 'message' => __( 'Cache invalidation scheduled', 'urlslab' ) ), 200 );
	}

	private function init_cloudfront_client(): bool {
		if ( ! empty( $this->cloudfront ) ) {
			return true;
		}

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Cache::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
		if ( ! strlen( $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_REGION ) ) ) {
			return false;
		}

		try {
			// Create an instance of the AWS SDK for PHP client.
			$configuration = array(
				'version' => 'latest',
				'region'  => $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_REGION ),
			);

			if ( strlen( $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_ACCESS_KEY ) ) && strlen( $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_SECRET ) ) ) {
				$configuration['credentials'] = array(
					'key'    => $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_ACCESS_KEY ),
					'secret' => $widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_CLOUDFRONT_SECRET ),
				);
			}

			$this->cloudfront = new Aws\CloudFront\CloudFrontClient( $configuration );

		} catch ( Aws\Exception\AwsException $e ) {
			return false;
		}

		return true;
	}
}
