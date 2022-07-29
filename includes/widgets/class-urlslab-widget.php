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
	 * @param $action string action to be applied to url
	 *
	 */
	public function widget_management_response( string $action = '' ) {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'activation' == $action and 'POST' == $_SERVER['REQUEST_METHOD'] ) {
			check_admin_referer( 'widget-activation-' . $this->get_widget_slug() );

			if ( ! empty( $_POST['activate'] ) ) {
				Urlslab_User_Widget::get_instance()->activate_widget( $this );
				$redirect_to = $this->get_conf_page_url(
					array(
						'message' => 'success',
					)
				);
			} else if ( ! empty( $_POST['deactivate'] ) ) {
				Urlslab_User_Widget::get_instance()->deactivate_widget( $this );
				$redirect_to = $this->get_conf_page_url(
					array(
						'message' => 'success',
					)
				);
			} else {
				$redirect_to = $this->get_conf_page_url(
					array(
						'action' => 'activation',
						'message' => 'invalid',
					)
				);
			}

			wp_safe_redirect( $redirect_to );
			exit();
		}
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

}
