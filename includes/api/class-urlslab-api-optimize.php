<?php

class Urlslab_Api_Optimize extends Urlslab_Api_Base {
	const SLUG = 'optimize';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route(
			self::NAMESPACE,
			$base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array(
						$this,
						'get_items_permissions_check',
					),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<task>[0-9a-zA-Z_\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'optimize' ),
					'permission_callback' => array(
						$this,
						'get_optimize_permissions_check',
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
	public function get_items( $request ) {
		$tasks = array(
			'clean_post_revisions',
			'clean_post_autodrafts',
			'clean_post_trash',
			'clean_expired_transient',
			'clean_orphaned_rel_data',
			'clean_orphaned_comment_meta',
		);

		return new WP_REST_Response( $tasks, 200 );
	}

	public function optimize( WP_REST_Request $request ) {
		try {
			if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Optimize::SLUG ) ) {
				return new WP_Error( 'exception', __( 'Optimization module disabled', 'urlslab' ) );
			}
			$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Optimize::SLUG );

			$task_name  = $request->get_param( 'task' );
			$start_time = time();

			switch ( $task_name ) {
				case 'clean_post_revisions':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_revisions() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_post_autodrafts':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_auto_drafts() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_post_trash':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_trashed() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_expired_transient':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_expired_transient() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_all_transient':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_all_transient() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_orphaned_rel_data':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_orphaned_rel_data() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				case 'clean_orphaned_comment_meta':
					while ( Urlslab_Optimize::DELETE_LIMIT === $widget->optimize_orphaned_comment_metadata() && ( time() - $start_time ) < 20 ) {
						// do nothing
					}
					break;
				default:
					return new WP_Error( 'exception', __( 'Invalid task id', 'urlslab' ) );
			}

			return new WP_REST_Response( __( 'Optimization finished' ), 200 );
		} catch ( Exception $e ) {
			return new WP_Error( 'exception', __( 'Optimization failed with exception', 'urlslab' ) );
		}
	}

	public function get_optimize_permissions_check( WP_REST_Request $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}
}
