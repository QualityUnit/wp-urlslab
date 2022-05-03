<?php

abstract class Urlslab_Widget {

	/**
	 * @param $menu_slug
	 *
	 * @return string
	 */
	protected function menu_page_url( $menu_slug ): string {
		return admin_url() . 'admin.php?page=' . urlencode( $menu_slug );
	}

	/**
	 * @return string Widget slug for identifying the widget
	 */
	public abstract function get_widget_slug(): string;

	/**
	 * @return string Widget Title for Integration page
	 */
	public abstract function get_widget_title(): string;

	/**
	 * @return string Widget Description
	 */
	public abstract function get_widget_description(): string;

	/**
	 * @return string External landing page introduction of the widget
	 */
	public abstract function get_landing_page_link(): string;

	/**
	 * @return string Wordpress submenu widget URL
	 */
	public abstract function get_admin_menu_page_slug(): string;

	/**
	 * @return string Wordpress submenu widget URL
	 */
	public abstract function get_admin_menu_page_url(): string;

	/**
	 * @return string Wordpress submenu widget URL
	 */
	public abstract function get_admin_menu_page_title(): string;

	/**
	 * @return string Wordpress submenu widget URL
	 */
	public abstract function get_admin_menu_title(): string;


	/**
	 * @param $action array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public abstract function get_integration_page_url( $action = '' ): string;

	/**
	 * @param mixed $api_key
	 *
	 * @return mixed rendering HTML Form of the current widget
	 */
	public abstract function render_form( $api_key = '' );


	/**
	 * @return mixed Logic for accepting API Key entered by the user
	 */
	public abstract function widget_configuration_response( $action = '' );

	/**
	 * @param string $message
	 *
	 * @return mixed Admin notice message
	 */
	public abstract function admin_notice( string $message = '' );

}
