<?php

class Urlslab_Widget {

	private static $instance;

	private $services = array();


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Widget The instance.
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
	public function add_widget( $name, Urlslab_Service $service ) {
		$name = sanitize_key( $name );

		if ( empty( $name )
			 or isset( $this->services[ $name ] ) ) {
			return false;
		}

		$this->services[ $name ] = $service;
	}

	/**
	 * Returns true if a service with the name exists in the services list.
	 *
	 * @param string $name The name of service to search.
	 */
	public function widget_exists( string $name = '' ): bool {
		if ( '' == $name ) {
			return (bool) count( $this->services );
		} else {
			return isset( $this->services[ $name ] );
		}
	}

	/**
	 * Returns a service object with the name.
	 *
	 * @param string $name The name of service.
	 *
	 * @return Urlslab_Service|bool The service object if it exists,
	 *                            false otherwise.
	 */
	public function get_service( string $name ) {
		if ( $this->widget_exists( $name ) ) {
			return $this->services[ $name ];
		} else {
			return false;
		}
	}




}
