<?php

class Urlslab_User_Widget {

	private array $user_widgets = array();

	private static Urlslab_User_Widget $instance;


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_User_Widget The instance.
	 */
	public static function get_instance() {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Adds a service to the services list.
	 */
	public function add_widget( Urlslab_Widget $widget ) {
		if ( empty( $widget->get_widget_slug() )
			 or isset( $this->user_widgets[ $widget->get_widget_slug() ] )
			 or ! Urlslab_Available_Widgets::widget_exists( $widget->get_widget_slug() ) ) {
			return false;
		}

		$this->user_widgets[ $widget->get_widget_slug() ] = $widget;
	}

	/**
	 * Returns true if a service with the name exists in the services list.
	 *
	 * @param string $name The name of service to search.
	 */
	public function is_widget_added( string $name = '' ): bool {
		if ( '' == $name ) {
			return (bool) count( $this->user_widgets );
		} else {
			return isset( $this->user_widgets[ $name ] );
		}
	}

}
