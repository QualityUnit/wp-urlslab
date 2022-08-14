<?php

abstract class Urlslab_Widget {

	/**
	 * @param Urlslab_Loader $loader
	 *
	 * @return void
	 */
	public abstract function init_widget( Urlslab_Loader $loader);

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
	 * @return Urlslab_Admin_Page urlslab_admin page where the widget exists
	 */
	public abstract function get_parent_page(): Urlslab_Admin_Page;

	/**
	 * @return string get tab slug that the widget is located in
	 */
	public abstract function get_widget_tab(): string;

	/**
	 * @param $args array|string extra arguments by the user
	 *
	 * @return string the url of the subpage where the widget exists in
	 */
	public function admin_widget_page( $args = '' ): string {
		$args = wp_parse_args( $args, array() );
		$url = $this->get_parent_page()->menu_page( $this->get_widget_tab() );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

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

	/**
	 * @return mixed
	 */
	public abstract function render_widget_overview();

	/**
	 * @return string
	 */
	public abstract function get_thumbnail_demo_url(): string;

	/**
	 * @param array $new_settings
	 *
	 * @return void
	 */
	public abstract static function update_settings( array $new_settings );
}
