<?php

class Urlslab_Api_Keywords extends Urlslab_Api_Table {
	public function register_routes() {
		$base = '/keyword';

		register_rest_route(
			self::NAMESPACE,
			$base . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => $this->get_table_arguments(
						array(
							'filter_keyword'          => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 0 == strlen( $param ) || 250 >= strlen( $param );
								},
							),
							'filter_urlLink'          => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return 0 == strlen( $param ) || 250 >= strlen( $param );
								},
							),
							'filter_kw_priority'      => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
							'filter_kw_length'        => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
							'filter_lang'             => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_string( $param ) && 11 > strlen( $param );
								},
							),
							'filter_urlFilter'        => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_string( $param ) && 251 > strlen( $param );
								},
							),
							'filter_kwType'           => array(
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
							'filter_kw_usage_count'   => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
							'filter_link_usage_count' => array(
								'required'          => false,
								'validate_callback' => function( $param ) {
									return is_numeric( $param );
								},
							),
						)
					),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<kw_id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
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
								return is_numeric( $param );
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
					),
				),
			)
		);


		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<kw_id>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'detele_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);


	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	public function get_items( $request ) {
		global $wpdb;
		$query_data = array();
		$where_data = array();

		if ( $request->get_param( 'from_id' ) ) {
			$where_data[] = 'kw_id>%d';
			$query_data[] = (int) $request->get_param( 'from_id' );
		}
		if ( $request->get_param( 'from_sort_column' ) ) {
			if ( 'DESC' == $request->get_param( 'sort_direction' ) ) {
				$where_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . '<%s';
			} else {
				$where_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . '>%s';
			}
			$query_data[] = $request->get_param( 'from_sort_column' );
		}

		if ( strlen( $request->get_param( 'filter_keyword' ) ) ) {
			$where_data[] = 'keyword LIKE %s';
			$query_data[] = $request->get_param( 'filter_keyword' );
		}
		if ( strlen( $request->get_param( 'filter_urlLink' ) ) ) {
			$where_data[] = 'urlLink LIKE %s';
			$query_data[] = $request->get_param( 'filter_urlLink' );
		}
		if ( strlen( $request->get_param( 'filter_kw_priority' ) ) ) {
			$where_data[] = 'kw_priority=%d';
			$query_data[] = (int) $request->get_param( 'filter_kw_priority' );
		}
		if ( strlen( $request->get_param( 'filter_kw_length' ) ) ) {
			$where_data[] = 'kw_length=%d';
			$query_data[] = (int) $request->get_param( 'filter_kw_length' );
		}
		if ( strlen( $request->get_param( 'filter_lang' ) ) ) {
			$where_data[] = 'lang=%s';
			$query_data[] = $request->get_param( 'filter_lang' );
		}
		if ( strlen( $request->get_param( 'filter_urlFilter' ) ) ) {
			$where_data[] = 'urlFilter LIKE %s';
			$query_data[] = $request->get_param( 'filter_urlFilter' );
		}
		if ( strlen( $request->get_param( 'filter_kwType' ) ) ) {
			$where_data[] = 'kwType=%s';
			$query_data[] = $request->get_param( 'filter_kwType' );
		}

		$having_data = array();
		if ( strlen( $request->get_param( 'filter_kw_usage_count' ) ) ) {
			$having_data[] = 'kw_usage_count=%d';
			$query_data[]  = (int) $request->get_param( 'filter_kw_usage_count' );
		}
		if ( strlen( $request->get_param( 'filter_link_usage_count' ) ) ) {
			$having_data[] = 'link_usage_count=%d';
			$query_data[]  = (int) $request->get_param( 'filter_link_usage_count' );
		}

		$order_data = array();
		if ( $request->get_param( 'sort_column' ) ) {
			$order_data[] = sanitize_key( $request->get_param( 'sort_column' ) ) . ( $request->get_param( 'sort_direction' ) ? ' ' . $request->get_param( 'sort_direction' ) : '' );
			$order_data[] = 'kw_id ASC';
		}

		$limit_string = '';
		if ( $request->get_param( 'rows_per_page' ) ) {
			$limit_string = '%d';
			$query_data[] = (int) $request->get_param( 'rows_per_page' );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT
						v.kw_id				   AS kw_id,
						v.keyword              AS keyword,
						v.kw_priority          AS kw_priority,
						v.kw_length            AS kw_length,
						v.lang                 AS lang,
						v.urlLink              AS urlLink,
						v.urlFilter            AS urlFilter,
						v.kwType               AS kwType,
						SUM(!ISNULL(d.urlMd5)) AS kw_usage_count,
						SUM(!ISNULL(d.destUrlMd5)) AS link_usage_count
					FROM ' . URLSLAB_KEYWORDS_TABLE . ' AS v LEFT JOIN ' . URLSLAB_KEYWORDS_MAP_TABLE . ' AS d ON d.kw_id = v.kw_id' . // phpcs:ignore

				// phpcs:ignore
				( ! empty( $where_data ) ? ' WHERE ' . implode( ' AND ', $where_data ) : '' ) . // phpcs:ignore
				' GROUP BY kw_id' .
				( ! empty( $having_data ) ? ' HAVING ' . implode( ' AND ', $having_data ) : '' ) . // phpcs:ignore
				( ! empty( $order_data ) ? ' ORDER BY ' . implode( ',', $order_data ) : '' ) . // phpcs:ignore
				( strlen( $limit_string ) ? ' LIMIT ' . $limit_string : '' ), // phpcs:ignore
				$query_data
			),
			OBJECT ); // phpcs:ignore
		if ( null == $rows || false === $rows ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response( $rows, 200 );
	}

	function get_row_object( $params = array() ): Urlslab_Data {
		return new Urlslab_Keyword_Data( $params );
	}

	function get_editable_columns(): array {
		return array( 'kwType', 'kw_priority', 'lang', 'urlFilter' );
	}
}
