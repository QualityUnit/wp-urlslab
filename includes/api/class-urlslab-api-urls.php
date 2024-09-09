<?php

class Urlslab_Api_Urls extends Urlslab_Api_Table {
	const SLUG = 'url';

	protected $base = '/' . self::SLUG;

	public function register_routes() {
		register_rest_route( self::NAMESPACE, $this->base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $this->base . '/count', $this->get_count_route( $this->get_route_get_items() ) );
		register_rest_route(
			self::NAMESPACE,
			$this->base . '/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_columns',
				)
			)
		);

		register_rest_route( self::NAMESPACE, $this->base . '/screenshot/(?P<screenshot_url_id>[0-9]+)/linked-from', $this->get_route_get_screenshot_usage() );
		register_rest_route( self::NAMESPACE, $this->base . '/screenshot/(?P<screenshot_url_id>[0-9]+)/linked-from/count', $this->get_count_route( $this->get_route_get_screenshot_usage() ) );
		register_rest_route(
			self::NAMESPACE,
			$this->base . '/screenshot/(?P<screenshot_url_id>[0-9]+)/linked-from/columns',
			$this->get_columns_route(
				array(
					$this,
					'get_sorting_screenshot_usage_columns',
				)
			)
		);


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
						'scr_status'           => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Url::SCR_STATUS_ERROR:
									case Urlslab_Data_Url::SCR_STATUS_NEW:
									case Urlslab_Data_Url::SCR_STATUS_ACTIVE:
										return true;

									default:
										return empty( $param );
								}
							},
						),
						'sum_status'           => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Url::SUM_STATUS_ERROR:
									case Urlslab_Data_Url::SUM_STATUS_NEW:
									case Urlslab_Data_Url::SUM_STATUS_ACTIVE:
										return true;

									default:
										return empty( $param );
								}
							},
						),
						'rel_schedule'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Url::REL_AVAILABLE:
									case Urlslab_Data_Url::REL_NOT_REQUESTED_SCHEDULE:
									case Urlslab_Data_Url::REL_ERROR:
									case Urlslab_Data_Url::REL_SCHEDULE_NEW:
									case Urlslab_Data_Url::REL_SCHEDULE_SCHEDULED:
										return true;

									default:
										return empty( $param );
								}
							},
						),
						'http_status'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'visibility'           => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								switch ( $param ) {
									case Urlslab_Data_Url::VISIBILITY_VISIBLE:
									case Urlslab_Data_Url::VISIBILITY_HIDDEN:
										return true;

									default:
										return false;
								}
							},
						),
						'url_title'            => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'url_h1'               => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'url_meta_description' => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'url_summary'          => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_string( $param );
							},
						),
						'url_priority'         => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param ) && 0 <= $param && 100 >= $param;
							},
						),
						'labels'               => array(
							'required'          => false,
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
			$this->base . '/delete-all',
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
			$this->base . '/delete',
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

		register_rest_route( self::NAMESPACE, $this->base . '/(?P<dest_url_id>[0-9]+)/linked-from', $this->get_route_get_url_usage() );
		register_rest_route( self::NAMESPACE, $this->base . '/(?P<dest_url_id>[0-9]+)/linked-from/count', $this->get_count_route( $this->get_route_get_url_usage() ) );
		register_rest_route( self::NAMESPACE, $this->base . '/(?P<src_url_id>[0-9]+)/links', $this->get_route_get_url_usage() );
		register_rest_route( self::NAMESPACE, $this->base . '/(?P<src_url_id>[0-9]+)/links/count', $this->get_count_route( $this->get_route_get_url_usage() ) );
		register_rest_route( self::NAMESPACE, $this->base . '/(?P<url_id>[0-9]+)/changes', $this->get_route_get_url_changes() );
		register_rest_route(
			self::NAMESPACE,
			$this->base . '/status/summary',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'fetch_and_update_summary_status' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'url'             => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								try {
									new Urlslab_Url( $param );

									return is_string( $param );
								} catch ( Exception $e ) {
									return false;
								}
							},
						),
						'with_scheduling' => array(
							'required'          => true,
							'validate_callback' => function ( $param ) {
								return is_bool( $param );
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
	public function get_route_get_items(): array {
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

	/**
	 * @return array[]
	 */
	public function get_route_get_url_usage(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_url_usage' ),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_url_changes(): array {
		return array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'get_url_changes' ),
				'args'     => array_merge(
					$this->get_table_arguments(),
					array(
						'only_changed' => array(
							'required'          => false,
							'default'           => false,
							'validate_callback' => function ( $param ) {
								return is_bool( $param );
							},
						),
						'start_date'   => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
						'end_date'     => array(
							'required'          => false,
							'validate_callback' => function ( $param ) {
								return is_numeric( $param );
							},
						),
					)
				),
			),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name' ) );

		return parent::get_items_sql( $request );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$cron = new Urlslab_Cron_Update_Usage_Stats();
		$cron->reset_locks( 900 );

		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		$recordset = array();

		foreach ( $rows as $row ) {
			$url = new Urlslab_Data_Url( (array) $row );
			$row = (object) array_replace(
				(array) $row,
				$url->get_object_values_as_array()
			);

			$row->screenshot_url                    = $url->get_screenshot_url( Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE );
			$row->screenshot_url_thumbnail          = $url->get_screenshot_url( Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL );
			try {
				$row->url_name = $url->get_url()->get_url_with_protocol();
			} catch ( Exception $e ) {
			}
			$row->url_usage_cnt          = (int) $row->url_usage_cnt;
			$row->screenshot_usage_count = (int) $row->screenshot_usage_count;
			$row->url_links_count        = (int) $row->url_links_count;

			$row->urlslab_scr_timestamp = (int) $row->urlslab_scr_timestamp;
			$row->urlslab_sum_timestamp = (int) $row->urlslab_sum_timestamp;
			$row->url_id                = (int) $row->url_id;
			$row->url_priority          = (int) $row->url_priority;
			$row->http_status           = (int) $row->http_status;
			$row->post_id               = (int) $row->post_id;
			if ( $row->post_id > 0 ) {
				$row->edit_url_name = get_edit_post_link( $row->post_id, 'js' );
			}

			$recordset[] = $row;
		}

		return new WP_REST_Response( $recordset, 200 );
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Data_Url( $params, $loaded_from_db );
	}

	protected function delete_rows( array $rows ): bool {
		foreach ( $rows as $id => $row ) {
			$rows[ $id ]['src_url_id']        = $row['url_id'];
			$rows[ $id ]['dest_url_id']       = $row['url_id'];
			$rows[ $id ]['screenshot_url_id'] = $row['url_id'];
		}

		( new Urlslab_Data_File_Url() )->delete_rows( $rows, array( 'url_id' ) );
		( new Urlslab_Data_Keyword_Map() )->delete_rows( $rows, array( 'url_id' ) );
		( new Urlslab_Data_Keyword_Map() )->delete_rows( $rows, array( 'dest_url_id' ) );
		( new Urlslab_Data_Url_Map() )->delete_rows( $rows, array( 'src_url_id' ) );
		( new Urlslab_Data_Screenshot_Url() )->delete_rows( $rows, array( 'src_url_id' ) );
		( new Urlslab_Data_Screenshot_Url() )->delete_rows( $rows, array( 'screenshot_url_id' ) );
		( new Urlslab_Data_Url_Relation() )->delete_rows( $rows, array( 'src_url_id' ) );
		( new Urlslab_Data_Url_Relation() )->delete_rows( $rows, array( 'dest_url_id' ) );
		( new Urlslab_Data_Generator_Url() )->delete_rows( $rows, array( 'url_id' ) );

		return parent::delete_rows( $rows );
	}


	public function delete_all_items( WP_REST_Request $request ) {
		global $wpdb;

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_URLS_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}

		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_URLS_MAP_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}
		if ( false === $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_RELATED_RESOURCE_TABLE ) ) ) { // phpcs:ignore
			return new WP_Error( 'error', __( 'Failed to delete', 'urlslab' ), array( 'status' => 500 ) );
		}
		$this->on_items_updated();

		return new WP_REST_Response(
			(object) array(
				'message' => __( 'Deleted', 'urlslab' ),
			),
			200
		);
	}

	public function get_editable_columns(): array {
		return array(
			'scr_status',
			'sum_status',
			'http_status',
			'rel_schedule',
			'visibility',
			'url_title',
			'url_h1',
			'url_meta_description',
			'url_summary',
			'url_priority',
			'labels',
		);
	}

	public function get_url_usage( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'dest_url_id', 'src_url_id' ) );
		$rows = $this->get_url_usage_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $id => $row ) {
			$row->src_url_id  = (int) $row->src_url_id;
			$row->dest_url_id = (int) $row->dest_url_id;

			try {
				$url               = new Urlslab_Url( $row->src_url_name, true );
				$row->src_url_name = $url->get_url_with_protocol();
			} catch ( Exception $e ) {
				unset( $rows[ $id ] );
				continue;
			}

			try {
				$url                = new Urlslab_Url( $row->dest_url_name, true );
				$row->dest_url_name = $url->get_url_with_protocol();
			} catch ( Exception $e ) {
				unset( $rows[ $id ] );
				continue;
			}

			$row->src_post_id = (int) $row->src_post_id;
			if ( $row->src_post_id > 0 ) {
				$row->edit_src_url_name = get_edit_post_link( $row->src_post_id, 'js' );
			}
			$row->dest_post_id = (int) $row->dest_post_id;
			if ( $row->dest_post_id > 0 ) {
				$row->edit_dest_url_name = get_edit_post_link( $row->dest_post_id, 'js' );
			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_url_changes( WP_REST_Request $request ) {
		if ( ! Urlslab_Widget_General::is_flowhunt_configured() ) {
			return new WP_Error( 'error', __( 'Api key not set or no credits', 'urlslab' ), array( 'status' => 400 ) );
		}

		$url_obj = new Urlslab_Data_Url( array( 'url_id' => $request->get_param( 'url_id' ) ) );
		if ( ! $url_obj->load() ) {
			return new WP_Error( 'error', __( 'Url not found', 'urlslab' ), array( 'status' => 400 ) );
		}

		if ( ! $url_obj->get_url()->is_url_valid() || $url_obj->get_url()->is_blacklisted() ) {
			return new WP_Error( 'error', __( 'Url is not valid', 'urlslab' ), array( 'status' => 400 ) );
		}

		try {
			$config       = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_API_KEY ) );
			$client       = new SnapshotApi( new GuzzleHttp\Client(), $config );
			$only_changed = null;
			if ( $request->get_param( 'only_changed' ) ) {
				$only_changed = 'true';
			}
			$snapshots = $client->getSnapshotsHistory(
				$url_obj->get_url()->get_url(),
				null,
				$request->get_param( 'start_date' ),
				$request->get_param( 'end_date' ),
				$only_changed,
				500
			);

			$rows = array();

			foreach ( $snapshots->getSnapshots() as $snapshot ) {
				$row                  = array();
				$row['last_seen']     = $snapshot->getSnapshotId();
				$row['url']           = $snapshot->getUrl();
				$row['url_id']        = $snapshot->getUrlId();
				$row['is_changed']    = $snapshot->getIsChanged();
				$row['domain_id']     = $snapshot->getDomainId();
				$row['requests']      = $snapshot->getNumberOfSubRequests();
				$row['load_duration'] = $snapshot->getPageLoadDuration();
				$row['page_size']     = $snapshot->getPageSize();
				$row['last_changed']  = $snapshot->getScreenshotKey();
				$row['word_count']    = $snapshot->getWordCount();
				$row['status_code']   = $snapshot->getStatusCode();

				// screenshot
				$screenshot_row              = array();
				$screenshot_row['thumbnail'] = Urlslab_Data_Url::get_screenshot_image_url(
					$row['domain_id'],
					$row['url_id'],
					$row['last_changed'],
					Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL
				);
				$screenshot_row['full']      = Urlslab_Data_Url::get_screenshot_image_url(
					$row['domain_id'],
					$row['url_id'],
					$row['last_changed'],
					Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE
				);
				$row['screenshot']           = (object) $screenshot_row;
				$rows[]                      = (object) $row;
			}

			return new WP_REST_Response( $rows, 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}
	}

	public function get_url_usage_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'url_name', 'src_url_name', 'dest_url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );

		foreach ( ( new Urlslab_Data_Url_Map() )->get_columns() as $column => $format ) {
			$sql->add_select_column( $column, 'm' );
		}

		$sql->add_select_column( 'url_name', 'u_src', 'src_url_name' );
		$sql->add_select_column( 'url_name', 'u_dest', 'dest_url_name' );
		$sql->add_select_column( 'post_id', 'u_src', 'src_post_id' );
		$sql->add_select_column( 'post_id', 'u_dest', 'dest_post_id' );
		$sql->add_from( URLSLAB_URLS_MAP_TABLE . ' m INNER JOIN ' . URLSLAB_URLS_TABLE . ' u_src ON m.src_url_id = u_src.url_id INNER JOIN ' . URLSLAB_URLS_TABLE . ' u_dest ON m.dest_url_id = u_dest.url_id' ); // phpcs:ignore

		$sql->add_filters( $this->get_filter_url_usage_columns(), $request );
		$sql->add_having_filters( $this->get_having_filter_url_usage_columns(), $request );
		$sql->add_sorting( array_merge( $this->get_filter_url_usage_columns(), $this->get_having_filter_url_usage_columns() ), $request );

		return $sql;
	}

	protected function get_filter_url_usage_columns(): array {
		return $this->prepare_columns( ( new Urlslab_Data_Url_Map() )->get_columns(), 'm' );
	}

	protected function get_having_filter_url_usage_columns(): array {
		return $this->prepare_columns(
			array(
				'src_url_name'  => '%s',
				'dest_url_name' => '%s',
				'src_post_id'   => '%d',
				'dest_post_id'  => '%d',
			)
		);
	}

	public function get_url_usage_count( WP_REST_Request $request ) {
		return new WP_REST_Response(
			$this->get_url_usage_sql( $request )->get_count(),
			200
		);
	}

	public function get_screenshot_usage( WP_REST_Request $request ) {
		$this->add_request_filter( $request, array( 'screenshot_url_id' ) );

		$rows = $this->get_screenshot_usage_sql( $request )->get_results();
		if ( ! is_array( $rows ) ) {
			return new WP_Error(
				'error',
				__( 'Failed to get items', 'urlslab' ),
				array( 'status' => 400 )
			);
		}

		foreach ( $rows as $row ) {
			$row->src_url_id        = (int) $row->src_url_id;
			$row->screenshot_url_id = (int) $row->screenshot_url_id;

			try {
				if ( $row->src_url_name ) {
					$url               = new Urlslab_Url( $row->src_url_name, true );
					$row->src_url_name = $url->get_url_with_protocol();
				}
			} catch ( Exception $e ) {

			}
		}

		return new WP_REST_Response( $rows, 200 );
	}

	public function get_screenshot_usage_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->prepare_url_filter( $request, array( 'src_url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'screenshot_url_id' );
		$sql->add_select_column( 'src_url_id' );
		$sql->add_select_column( 'url_name', 'u', 'src_url_name' );

		$sql->add_from( URLSLAB_SCREENSHOT_URLS_TABLE . ' s INNER JOIN ' . URLSLAB_URLS_TABLE . ' u ON s.src_url_id = u.url_id' ); // phpcs:ignore

		$sql->add_filters( $this->get_filter_screenshot_usage_columns(), $request );
		$sql->add_having_filters( $this->get_having_filter_screenshot_usage_columns(), $request );
		$sql->add_sorting( $this->get_sorting_screenshot_usage_columns(), $request );

		return $sql;
	}

	private function get_sorting_screenshot_usage_columns(): array {
		return array_merge( $this->get_filter_screenshot_usage_columns(), $this->get_having_filter_screenshot_usage_columns() );
	}

	protected function get_filter_screenshot_usage_columns(): array {
		return $this->prepare_columns(
			array(
				'screenshot_url_id' => '%d',
				'src_url_id'        => '%d',
			)
		);
	}

	protected function get_having_filter_screenshot_usage_columns(): array {
		return $this->prepare_columns( array( 'src_url_name' => '%s' ) );
	}

	/**
	 * @throws Exception
	 */
	public function fetch_and_update_summary_status( $request ) {
		// first fetching the result from local
		$url_string       = $request->get_param( 'url' );


		$url  = new Urlslab_Url( $url_string );
		$rows = $this->get_local_summary_status( $url, $request );
		if ( ! is_array( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		if (
			count( $rows ) == 1 &&
			( Urlslab_Data_Url::SUM_STATUS_ACTIVE == $rows[0]->sum_status ||
			  Urlslab_Data_Url::SUM_STATUS_PENDING == $rows[0]->sum_status ||
			  Urlslab_Data_Url::SUM_STATUS_ERROR == $rows[0]->sum_status )
		) {
			return new WP_REST_Response( $rows[0]->sum_status, 200 );
		}

		// starting to process the request and connecting to urlslab service
		Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( array( $url ) );
		global $wpdb;
		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE ' . ' (url_name = %s) LIMIT 1', // phpcs:ignore
				$url->get_url(),
			),
			ARRAY_A
		);

		$row_obj      = new Urlslab_Data_Url( $url_rows[0] );
		$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_NEW );
		$row_obj->update();
		return new WP_REST_Response( Urlslab_Data_Url::SUM_STATUS_ERROR, 200 );
	}

	public function get_local_summary_status( Urlslab_Url $url, $request ) {
		$this->prepare_url_filter( $request, array( 'url_name' ) );
		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( 'sum_status' );
		$sql->add_from( URLSLAB_URLS_TABLE );

		$columns = $this->prepare_columns(
			array(
				'url_name' => '%s',
			)
		);

		$filters = array(
			array(
				'col' => 'url_name',
				'op'  => 'exactly',
				'val' => $url->get_url(),
			),
		);

		$sql->add_filters_raw( $columns, $filters );
		$sql->set_limit( 1 );

		return $sql->get_results();
	}

	public function get_screenshot_usage_count( WP_REST_Request $request ) {
		return new WP_REST_Response(
			$this->get_screenshot_usage_sql( $request )->get_count(),
			200
		);
	}

	/**
	 * @return array[]
	 */
	public function get_route_get_screenshot_usage(): array {
		return array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array(
					$this,
					'get_screenshot_usage',
				),
				'args'                => $this->get_table_arguments(),
				'permission_callback' => array(
					$this,
					'get_items_permissions_check',
				),
			),
		);
	}

	/**
	 * @param Urlslab_Data_Url[] $rows
	 *
	 * @return void
	 */
	protected function on_items_updated( array $rows = array() ) {
		parent::on_items_updated( $rows );

		if ( 1 === count( $rows ) && Urlslab_Data_Url::HTTP_STATUS_NOT_PROCESSED === $rows[0]->get_http_status() ) {
			$rows[0]->update_http_response();
		}
	}
}
