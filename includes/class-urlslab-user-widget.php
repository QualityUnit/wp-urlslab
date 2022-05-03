<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-api-key.php';

class Urlslab_User_Widget {

	private array $user_widgets = array();

	private $user_api_key;

	private static Urlslab_User_Widget $instance;


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_User_Widget The instance.
	 */
	public static function get_instance(): Urlslab_User_Widget {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function add_api_key( Urlslab_Api_Key $api_key ): bool {
		if ( empty( $this->user_api_key ) ) {
			$this->user_api_key = $api_key;
			return true;
		}

		return false;
	}

	public function has_api_key(): bool {
		if ( empty( $this->user_api_key ) ) {
			return false;
		}
		return true;
	}

	public function get_api_key(): Urlslab_Api_Key {
		return $this->user_api_key;
	}

	public function remove_api_key() {
		$this->user_api_key = null;
	}

	/**
	 * Adds a widget to the widgets list.
	 */
	public function add_widget( Urlslab_Widget $widget ) {


//		if ( empty( $widget->get_widget_slug() )
//			 or isset( $this->user_widgets[ $widget->get_widget_slug() ] )
//			 or ! Urlslab_Available_Widgets::get_instance()->widget_exists( $widget->get_widget_slug() ) ) {
//			return false;
//		}

		$this->user_widgets[ $widget->get_widget_slug() ] = $widget;
	}

	/**
	 * Removes a widget from the widgets list.
	 */
	public function remove_widget( Urlslab_Widget $widget ) {
		if ( empty( $widget->get_widget_slug() )
			 or ! isset( $this->user_widgets[ $widget->get_widget_slug() ] )
			 or ! Urlslab_Available_Widgets::get_instance()->widget_exists( $widget->get_widget_slug() ) ) {
			return false;
		}

		unset( $this->user_widgets[ $widget->get_widget_slug() ] );
	}


	/**
	 * Returns true if a service with the name exists in the services list.
	 *
	 * @param string $name The name of service to search.
	 */
	public function is_widget_active( string $name = '' ): bool {
		do_action( 'qm/debug', $this->user_widgets );
		do_action( 'qm/debug', $this->user_api_key );
		if ( '' == $name ) {
			return (bool) count( $this->user_widgets );
		} else {
			return isset( $this->user_widgets[ $name ] );
		}
	}

}
