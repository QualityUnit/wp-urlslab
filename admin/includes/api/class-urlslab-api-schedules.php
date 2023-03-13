<?php

class Urlslab_Api_Schedules extends Urlslab_Api_Base {
	public function register_routes() {
		$base = '/schedule';

		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'args'                => array(
						'urls'                   => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								if ( ! is_array( $param ) ) {
									return false;
								}
								try {
									foreach ( $param as $url_row ) {
										$url_obj = new Urlslab_Url( $url_row );
										if ( ! $url_obj->is_url_valid() ) {
											return false;
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
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
						'custom_sitemaps'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
						'follow_links'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return 0 === $param || 1 === $param;
							},
						),
						'take_screenshot'       => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
						'analyze_text'          => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param );
							},
						),
						'scan_speed_per_minute' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_int( $param );
							},
						),
						'scan_frequency'        => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								$schedule       = new \Swagger\Client\Model\DomainScheduleScheduleConf();
								$allowed_values = $schedule->getScanFrequencyAllowableValues();

								return in_array( $param, $allowed_values );
							},
						),
					),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
				),
			)
		);


		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<schedule_id>[0-9a-zA-Z]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}


	private function get_client() {
		if ( ! strlen( get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) ) {
			throw new Exception( 'Urlslab API key not defined' );
		}

		return new Swagger\Client\Urlslab\ScheduleApi( new GuzzleHttp\Client(), Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY ) ) );
	}

	public function get_items( $request ) {
		try {
			return new WP_REST_Response( $this->get_client()->listSchedules(), 200 );
		} catch ( Throwable $e ) {
			return new WP_Error( 'error', $e->getMessage() );
		}
	}

	public function create_item( $request ) {
		try {
			$params = $request->get_json_params();

			$schedule = new \Swagger\Client\Model\DomainScheduleScheduleConf();

			$schedule->setUrls( $params['urls'] );

			if ( isset( $params['follow_links'] ) ) {
				$schedule->setLinkFollowingStrategy( $params['follow_links'] );
			} else {
				$schedule->setLinkFollowingStrategy( 0 );
			}

			if ( isset( $params['process_all_sitemaps'] ) && ! $params['process_all_sitemaps'] && isset( $params['custom_sitemaps'] ) && ! empty( $params['custom_sitemaps'] ) ) {
				$schedule->setSitemaps( $params['custom_sitemaps'] );
			} else {
				$schedule->setSitemaps( array() );
			}

			if ( isset( $params['process_all_sitemaps'] ) ) {
				$schedule->setAllSitemaps( $params['process_all_sitemaps'] );
			} else {
				$schedule->setAllSitemaps( false );
			}

			if ( isset( $params['take_screenshot'] ) ) {
				$schedule->setTakeScreenshot( $params['take_screenshot'] );
			} else {
				$schedule->setTakeScreenshot( false );
			}

			if ( isset( $params['analyze_text'] ) ) {
				$schedule->setFetchText( $params['analyze_text'] );
			} else {
				$schedule->setFetchText( false );
			}

			if ( isset( $params['scan_speed_per_minute'] ) ) {
				$schedule->setScanSpeedPerMinute( $params['scan_speed_per_minute'] );
			}
			if ( isset( $params['scan_frequency'] ) ) {
				$schedule->setScanFrequency( $params['scan_frequency'] );
			} else {
				$schedule->setScanFrequency( 'ONE_TIME' );
			}

			return new WP_REST_Response( $this->get_client()->createSchedule( $schedule ), 200 );
		} catch ( Throwable $e ) {
			return new WP_REST_Response( $e->getMessage(), 500 );
		}
	}

	public function delete_item( $request ) {
		try {
			return new WP_REST_Response( $this->get_client()->deleteSchedule( $request->get_param( 'schedule_id' ) ), 200 );
		} catch ( Throwable $e ) {
			return new WP_Error( 'error', $e->getMessage() );
		}
	}

}
