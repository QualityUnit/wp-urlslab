<?php

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Api_Keywords extends Urlslab_Api_Table {
	const SLUG = 'keyword';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/create', $this->get_route_create_item() );
		register_rest_route( self::NAMESPACE, $base . '/suggest', $this->get_route_suggest_urls() );
		register_rest_route(
			self::NAMESPACE,
			$base . '/count',
			$this->get_count_route( array( $this->get_route_get_items() ) )
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
			$base . '/(?P<kw_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'kwType'      => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								switch ( $param ) {
									case Urlslab_Keywords_Links::KW_TYPE_MANUAL:
									case Urlslab_Keywords_Links::KW_TYPE_IMPORTED_FROM_CONTENT:
									case Urlslab_Keywords_Links::KW_TYPE_NONE:
										return true;

									default:
										return false;
								}
							},
						),
						'kw_priority' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_numeric( $param ) && 0 <= $param && 100 >= $param;
							},
						),
						'lang'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 10 > strlen( $param );
							},
						),
						'urlFilter'   => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 250 > strlen( $param );
							},
						),
						'urlLink'     => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return strlen( $param );
							},
						),
						'keyword'     => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return strlen( $param );
							},
						),
						'labels'      => array(
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
			$base . '/(?P<kw_id>[0-9]+)/(?P<dest_url_id>[0-9]+)',
			$this->get_route_get_kw_mapping()
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<kw_id>[0-9]+)/(?P<dest_url_id>[0-9]+)/count',
			$this->get_count_route( $this->get_route_get_kw_mapping() )
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_items(): array {
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
	 * @return array[]
	 */
	public function get_route_create_item(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'create_item' ),
			'args'                => array(
				'keyword'     => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'urlLink'     => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						try {
							$url_obj = new Urlslab_Url( $param );

							return $url_obj->is_url_valid();
						} catch ( Exception $e ) {
							return false;
						}
					},
				),
				'kwType'      => array(
					'required'          => false,
					'default'           => Urlslab_Keywords_Links::KW_TYPE_MANUAL,
					'validate_callback' => function( $param ) {
						switch ( $param ) {
							case Urlslab_Keywords_Links::KW_TYPE_MANUAL:
							case Urlslab_Keywords_Links::KW_TYPE_IMPORTED_FROM_CONTENT:
							case Urlslab_Keywords_Links::KW_TYPE_NONE:
								return true;

							default:
								return false;
						}
					},
				),
				'kw_priority' => array(
					'required'          => false,
					'default'           => 10,
					'validate_callback' => function( $param ) {
						return is_numeric( $param ) && 0 <= $param && 100 >= $param;
					},
				),
				'lang'        => array(
					'required'          => false,
					'default'           => 'all',
					'validate_callback' => function( $param ) {
						return 10 > strlen( $param );
					},
				),
				'urlFilter'   => array(
					'required'          => false,
					'default'           => '.*',
					'validate_callback' => function( $param ) {
						return 250 > strlen( $param );
					},
				),
				'labels'      => array(
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

	/**
	 * @return array[]
	 */
	public function get_route_suggest_urls(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'suggest_urls' ),
			'args'                => array(
				'keyword' => array(
					'required'          => true,
					'validate_callback' => function( $param ) {
						return is_string( $param ) && strlen( $param );
					},
				),
				'url'     => array(
					'required'          => false,
					'validate_callback' => function( $param ) {
						return is_string( $param );
					},
				),
				'count'   => array(
					'required'          => false,
					'default'           => 5,
					'validate_callback' => function( $param ) {
						return is_numeric( $param ) && 0 < ( (int) $param );
					},
				),
			),
			'permission_callback' => array(
				$this,
				'create_item_permissions_check',
			),
		);
	}

	private function search_local_wp_db( $search_query, $count ) {
		$args = array(
			's'              => $search_query,
			'post_type'      => array( 'post', 'page' ),
			'post_status'    => 'publish',
			'posts_per_page' => $count,
		);

		$query = new WP_Query( $args );
		if ( $query->have_posts() ) {
			$result_posts = array();
			while ( $query->have_posts() ) {
				$query->the_post();
				$result_posts[] = get_permalink();
			}
			wp_reset_postdata();

			return new WP_REST_Response( $result_posts, 200 );
		}

		return new WP_REST_Response( array(), 200 );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function suggest_urls( $api_request ) {
		//# Sanitization
		$sanitized_req = $api_request->sanitize_params();
		if ( is_wp_error( $sanitized_req ) ) {
			return $sanitized_req;
		}
		//# Sanitization

		$replace_chars = array(
			'/',
			'-',
			'_',
			':',
			'.',
			'https',
			'http',
		);

		$search_query = trim( str_replace( $replace_chars, ' ', $api_request->get_param( 'keyword' ) ) );
		$max_count    = (int) $api_request->get_param( 'count' );

		try {
			if ( ! Urlslab_General::is_urlslab_active() ) {
				throw new Exception( 'API key is not set or no credits.' );
			}


			$config         = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) );
			$content_client = new ContentApi( new GuzzleHttp\Client(), $config );


			$request = new DomainDataRetrievalRelatedUrlsRequest();

			$request->setQuery( $search_query );
			$request->setChunkLimit( 1 );
			$request->setRenewFrequency( DomainDataRetrievalRelatedUrlsRequest::RENEW_FREQUENCY_ONE_TIME );

			$query = new DomainDataRetrievalContentQuery();
			$query->setLimit( $max_count * 3 );

			$query_must_conditions   = array();
			$query_must_conditions[] = (object) array( 'term' => (object) array( 'metadata.chunk_id' => (object) array( 'value' => 1 ) ) );

			if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_LAST_SEEN ) > 0 ) {
				$query_must_conditions[] = (object) array( 'range' => (object) array( 'metadata.lastSeen' => (object) array( 'gte' => time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_LAST_SEEN ) ) ) );
			}

			$domains = array();
			if ( $api_request->get_param( 'url' ) ) {
				if ( str_starts_with( $api_request->get_param( 'url' ), 'http' ) ) {
					try {
						$url_obj = new Urlslab_Url( $api_request->get_param( 'url' ) );
						if ( $url_obj->is_url_valid() ) {
							$domain                  = $url_obj->get_domain_name();
							$domains[ $domain ]      = $domain;
							$query_must_conditions[] = (object) array( 'match' => (object) array( 'metadata.url' => $url_obj->get_url() ) );
						} else {
							$query_must_conditions[] = (object) array( 'match' => (object) array( 'metadata.url' => $api_request->get_param( 'url' ) ) );
						}
					} catch ( Exception $e ) {
						$query_must_conditions[] = (object) array( 'match' => (object) array( 'metadata.url' => $api_request->get_param( 'url' ) ) );
					}
				} else {
					$query_must_conditions[] = (object) array( 'match' => (object) array( 'metadata.url' => $api_request->get_param( 'url' ) ) );
				}
			} else {
				$domain             = Urlslab_Url::get_current_page_url()->get_domain_name();
				$domains[ $domain ] = $domain;
			}
			$query->setAdditionalQuery( (object) array( 'bool' => (object) array( 'must' => $query_must_conditions ) ) );

			if ( ! empty( $domains ) ) {
				$query->setDomains( array_keys( $domains ) );
			}
			$request->setFilter( $query );

			$response  = $content_client->getRelatedUrls( $request );
			$dest_urls = array();
			foreach ( $response->getUrls() as $chunk ) {
				foreach ( $chunk as $dest_url ) {
					if ( count( $dest_urls ) < $max_count ) {
						try {
							$dest_url_obj = new Urlslab_Url( $dest_url, true );
							if ( ! $dest_url_obj->is_domain_blacklisted() ) {
								$dest_urls[ $dest_url_obj->get_url_with_protocol_relative() ] = 1;
							}
						} catch ( Exception $e ) {
						}
					}
				}
			}

			if ( ! empty( $dest_urls ) ) {
				return new WP_REST_Response( array_keys( $dest_urls ), 200 );
			}
		} catch ( Exception $e ) {
		}

		// fallback to local db
		return $this->search_local_wp_db( $search_query, $max_count );
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_kw_mapping(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_kw_mapping' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
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
			try {
				$row_url          = new Urlslab_Url( $row->urlLink ); // phpcs:ignore
				$row->dest_url_id = $row_url->get_url_id();
			} catch ( Exception $e ) {
			}
			$row->kw_id              = (int) $row->kw_id;
			$row->kw_length          = (int) $row->kw_length;
			$row->kw_priority        = (int) $row->kw_priority;
			$row->kw_usage_count     = (int) $row->kw_usage_count;
			$row->comp_intersections = (int) $row->comp_intersections;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'kw_id', 'v', 'kw_id' );
		$sql->add_select_column( 'kw_hash', 'v', 'kw_hash' );
		$sql->add_select_column( 'keyword', 'v', 'keyword' );
		$sql->add_select_column( 'kw_priority', 'v', 'kw_priority' );
		$sql->add_select_column( 'kw_length', 'v', 'kw_length' );
		$sql->add_select_column( 'lang', 'v', 'lang' );
		$sql->add_select_column( 'labels', 'v', 'labels' );
		$sql->add_select_column( 'urlLink', 'v', 'urlLink' );
		$sql->add_select_column( 'urlFilter', 'v', 'urlFilter' );
		$sql->add_select_column( 'kwType', 'v', 'kwType' );
		$sql->add_select_column( 'IFNULL(kw_usage_cnt, 0)', false, 'kw_usage_count' );

		$sql->add_select_column( 'comp_intersections', 'q' );


		$sql->add_from( URLSLAB_KEYWORDS_TABLE . ' AS v' );
		$sql->add_from(
			'LEFT JOIN (SELECT kw_id, COUNT(dest_url_id) as kw_usage_cnt FROM '
			. URLSLAB_KEYWORDS_MAP_TABLE
			. ' GROUP BY kw_id) d ON d.kw_id = v.kw_id '
		);
		$sql->add_from(
			'LEFT JOIN ' . URLSLAB_SERP_QUERIES_TABLE . ' q ON v.query_id = q.query_id '
		);

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'v' );
		$columns = array_merge(
			$columns,
			$this->prepare_columns(
				array(
					'kw_usage_count'     => '%d',
					'comp_intersections' => '%d',
				)
			)
		);

		$sql->add_having_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}


	protected function after_row_deleted( array $row ) {
		global $wpdb;

		if ( isset( $row['kw_id'] ) ) {
			$delete_params          = array();
			$delete_params['kw_id'] = $row['kw_id'];

			$wpdb->delete( URLSLAB_KEYWORDS_TABLE, $delete_params );
			$wpdb->delete( URLSLAB_KEYWORDS_MAP_TABLE, $delete_params );
		}
		parent::after_row_deleted( $row );
	}

	protected function on_items_updated( array $row = array() ) {
		Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Keywords_Links::SLUG )->update_option( Urlslab_Keywords_Links::SETTING_NAME_KWS_VALID_FROM, time() );

		return parent::on_items_updated( $row );
	}

	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KEYWORDS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KEYWORDS_MAP_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}
		$this->on_items_updated();

		return new WP_REST_Response( __( 'Deleted' ), 200 );
	}

	public function import_items( WP_REST_Request $request ) {
		$schedule_urls = array();
		$rows          = array();

		foreach ( $request->get_json_params()['rows'] as $row ) {
			$obj = $this->get_row_object( (array) $row, false );

			try {
				$schedule_urls[ $obj->get_url_link() ] = new Urlslab_Url( $obj->get_url_link() );
				$rows[]                                = $obj;
			} catch ( Exception $e ) {
			}
		}

		$url_row_obj = new Urlslab_Url_Row();
		if ( ! $url_row_obj->insert_urls( $schedule_urls ) ) {
			return new WP_REST_Response( 'Import failed.', 500 );
		}

		$result = $this->get_row_object()->import( $rows );

		if ( false == $result ) {
			return new WP_REST_Response( 'Import failed', 500 );
		}

		$this->on_items_updated();

		return new WP_REST_Response( $result, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Keyword_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'kwType', 'kw_priority', 'lang', 'urlFilter', 'labels', 'urlLink', 'keyword' );
	}


	public function get_kw_mapping( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'kw_id', 'dest_url_id' ) );

		$rows = $this->get_kw_mapping_sql( $request )->get_results();

		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->url_id = (int) $row->url_id;

			try {
				if ( strlen( $row->url_name ) ) {
					$url           = new Urlslab_Url( $row->url_name, true );
					$row->url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_kw_mapping_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'url_id', 'm' );
		$sql->add_select_column( 'link_type', 'm' );
		$sql->add_select_column( 'url_name', 'u' );

		$sql->add_from(
			URLSLAB_KEYWORDS_MAP_TABLE
			. ' m LEFT JOIN '
			. URLSLAB_URLS_TABLE
			. ' u ON m.url_id = u.url_id'
		);

		$columns = $this->prepare_columns( $this->get_row_object()->get_columns(), 'm' );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_name' => '%s' ), 'u' ) );
		$columns = array_merge( $columns, $this->prepare_columns( array( 'url_id' => '%d' ), 'm' ) );

		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	public function get_kw_mapping_count( WP_REST_Request $request ) {
		return new WP_REST_Response( $this->get_kw_mapping_sql( $request )->get_count(), 200 );
	}
}
