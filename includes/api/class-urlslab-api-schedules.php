<?php

use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\DomainScheduleScheduleConf;
use OpenAPI\Client\Urlslab\ScheduleApi;

class Urlslab_Api_Schedules extends Urlslab_Api_Base {
	const SLUG = 'schedule';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base . '/create',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'args'                => array(
						'urls'                  => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								if ( ! is_array( $param ) ) {
									$param = explode( ',', $param );
								}

								try {
									foreach ( $param as $url_row ) {
										if ( strlen( $url_row ) ) {
											$url_obj = new Urlslab_Url( $url_row, true );
											if ( ! $url_obj->is_url_valid() ) {
												return false;
											}
										}
									}

									return true;
								} catch ( Exception $e ) {
									return false;
								}
							},
						),
						'process_all_sitemaps'  => array(
							'required'          => false,
							'default'           => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param ) || is_numeric( $param );
							},
						),
						'custom_sitemaps'       => array(
							'required'          => false,
							'default'           => array(),
							'validate_callback' => function( $param ) {
								return empty( $param ) || is_string( $param );
							},
						),
						'follow_links'          => array(
							'required'          => false,
							'default'           => DomainScheduleScheduleConf::LINK_FOLLOWING_STRATEGY_NO_LINK,
							'validate_callback' => function( $param ) {
								$conf = new DomainScheduleScheduleConf();

								return in_array( $param, $conf->getLinkFollowingStrategyAllowableValues() );
							},
						),
						'take_screenshot'       => array(
							'required'          => false,
							'default'           => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param ) || is_numeric( $param );
							},
						),
						'analyze_text'          => array(
							'required'          => false,
							'default'           => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param ) || is_numeric( $param );
							},
						),
						'scan_speed_per_minute' => array(
							'required'          => false,
							'default'           => 20,
							'validate_callback' => function( $param ) {
								return empty( trim( $param ) ) || is_numeric( $param );
							},
						),
						'scan_frequency'        => array(
							'required'          => false,
							'default'           => DomainScheduleScheduleConf::SCAN_FREQUENCY_ONE_TIME,
							'validate_callback' => function( $param ) {
								$schedule       = new DomainScheduleScheduleConf();
								$allowed_values = $schedule->getScanFrequencyAllowableValues();

								return in_array( $param, $allowed_values );
							},
						),
					),
					'permission_callback' => array(
						$this,
						'create_item_permissions_check',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<schedule_id>[0-9a-zA-Z\\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array(
						$this,
						'delete_item_permissions_check',
					),
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		try {
			$result = array();
			foreach ( $this->get_client()->listSchedules() as $schedule ) {
				$result[] = (object) array(
					'schedule_id'           => $schedule->getProcessId(),
					'urls'                  => $schedule->getScheduleConf()->getUrls(),
					'process_all_sitemaps'  => $schedule->getScheduleConf()->getAllSitemaps(),
					'custom_sitemaps'       => $schedule->getScheduleConf()->getSitemaps(),
					'follow_links'          => $schedule->getScheduleConf()->getLinkFollowingStrategy(),
					'take_screenshot'       => $schedule->getScheduleConf()->getTakeScreenshot(),
					'analyze_text'          => $schedule->getScheduleConf()->getFetchText(),
					'scan_speed_per_minute' => $schedule->getScheduleConf()->getScanSpeedPerMinute(),
					'scan_frequency'        => $schedule->getScheduleConf()->getScanFrequency(),
				);
			}

			return new WP_REST_Response( $result, 200 );
		} catch ( Throwable $e ) {
			return new WP_Error( 'error', $e->getMessage() );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			$schedule = new DomainScheduleScheduleConf();

			if ( $request->has_param( 'urls' ) ) {

				if ( ! is_array( $request->get_param( 'urls' ) ) ) {
					$urls = explode( ',', $request->get_param( 'urls' ) );
				} else {
					$urls = $request->get_param( 'urls' );
				}

				$schedule->setUrls( $urls );
			} else {
				throw new Exception( 'URLs not defined' );
			}

			if ( $request->has_param( 'follow_links' ) ) {
				$schedule->setLinkFollowingStrategy( $request->get_param( 'follow_links' ) );
			} else {
				$schedule->setLinkFollowingStrategy( DomainScheduleScheduleConf::LINK_FOLLOWING_STRATEGY_NO_LINK );
			}

			if ( $request->has_param( 'custom_sitemaps' ) && strlen( trim( $request->get_param( 'custom_sitemaps' ) ) ) > 0 ) {
				if ( ! is_array( $request->get_param( 'custom_sitemaps' ) ) ) {
					$sitemaps = preg_split( '/(,|\n|\t)\s*/', $request->get_param( 'custom_sitemaps' ) );
				} else {
					$sitemaps = $request->get_param( 'custom_sitemaps' );
				}
				$schedule->setSitemaps( $sitemaps );
			} else {
				$schedule->setSitemaps( array() );
			}

			if ( $request->has_param( 'process_all_sitemaps' ) && $request->get_param( 'process_all_sitemaps' ) ) {
				$schedule->setAllSitemaps( true );
			} else {
				$schedule->setAllSitemaps( false );
			}

			if ( $request->has_param( 'take_screenshot' ) && $request->get_param( 'take_screenshot' ) ) {
				$schedule->setTakeScreenshot( true );
			} else {
				$schedule->setTakeScreenshot( false );
			}

			if ( $request->has_param( 'analyze_text' ) && $request->get_param( 'analyze_text' ) ) {
				$schedule->setFetchText( true );
			} else {
				$schedule->setFetchText( false );
			}

			if ( $request->has_param( 'scan_speed_per_minute' ) ) {
				$schedule->setScanSpeedPerMinute( (int) $request->get_param( 'scan_speed_per_minute' ) );
			} else {
				$schedule->setScanSpeedPerMinute( 20 );
			}

			if ( $request->has_param( 'scan_frequency' ) ) {
				$schedule->setScanFrequency( $request->get_param( 'scan_frequency' ) );
			} else {
				$schedule->setScanFrequency( DomainScheduleScheduleConf::SCAN_FREQUENCY_ONE_TIME );
			}

			return new WP_REST_Response( $this->get_client()->createSchedule( $schedule ), 200 );
		} catch ( Throwable $e ) {
			return new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_item( $request ) {
		try {
			$this->get_client()->deleteSchedule( $request->get_param( 'schedule_id' ) );

			return new WP_REST_Response( 'Deleted', 200 );
		} catch ( Throwable $e ) {
			return new WP_Error( 'error', $e->getMessage() );
		}
	}

	private function get_client() {
		if ( ! Urlslab_General::is_urlslab_active() ) {
			throw new Exception( 'Urlslab API key not set or no credits' );
		}

		return new ScheduleApi( new GuzzleHttp\Client(), Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) );
	}
}
