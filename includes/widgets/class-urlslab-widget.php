<?php

abstract class Urlslab_Widget {

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
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public abstract function get_conf_page_url( $args = '' ): string;


	public abstract function get_shortcode_content($atts = array(), $content = null, $tag = '' ): string;

	public abstract function has_shortcode(): bool;

}
