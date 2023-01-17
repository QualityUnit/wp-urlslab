<?php

class Urlslab_Api_Router {
	private Urlslab $urlslab;

	public function register_routes( Urlslab $urlslab ) {
		$this->urlslab = $urlslab;

		$urlslab->get_loader()->add_action( 'wp_ajax_urlslab_exec_cron', $urlslab, 'execute_cron_tasks' );
		$urlslab->get_loader()->add_action( 'wp_ajax_urlslab_exec_restart_url_scanning', $this, 'urlslab_exec_restart_url_scanning' );


		add_action(
			'rest_api_init',
			function() {
				register_rest_route(
					'urlslab/v1',
					'/modules',
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => array( $this, 'get_modules' ),
						'args'                => array(),
						'permission_callback' => function() {
							//TODO return current_user_can( 'urlslab_read' );
							return true;
						},
					)
				);
			}
		);

	}

	public function urlslab_exec_restart_url_scanning() {
		update_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START, Urlslab_Data::get_now() );
	}

	/**
	 * Get a collection of modules
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_modules( $request ) {
		$data = array();

		foreach ( Urlslab_Available_Widgets::get_instance()->get_available_widgets() as $widget ) {
			$data[] = (object) array(
				'id'          => $widget->get_widget_slug(),
				'title'       => $widget->get_widget_title(),
				'apikey'      => false,
				'description' => $widget->get_widget_description(),
				'active'      => Urlslab_User_Widget::get_instance()->is_widget_activated( $widget->get_widget_slug() ),
			);
		}

		return new WP_REST_Response( $data, 200 );
	}

}
