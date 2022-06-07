<?php

abstract class Urlslab_Widget {

	/**
	 * @return string Widget slug for identifying the widget
	 */
	public abstract function get_widget_slug(): string;

	/**
	 * @return string Widget Title
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
	 * @return string Wordpress submenu widget page title
	 */
	public abstract function get_admin_menu_page_title(): string;

	/**
	 * @return string Wordpress submenu widget title
	 */
	public abstract function get_admin_menu_title(): string;

	/**
	 * @param $atts array attributes of the shortcode
	 * @param $content string the content of the shortcode
	 * @param $tag string the tag related to shortcode
	 *
	 * @return string
	 */
	public abstract function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string;

	/**
	 * @return bool indicates if this widget generates any shortcode
	 */
	public abstract function has_shortcode(): bool;

}
