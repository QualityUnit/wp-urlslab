<?php

abstract class Urlslab_Widget {

	/**
	 * @param Urlslab_Loader $loader
	 *
	 * @return mixed
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
	 * @return mixed Callback when widget menu is clicked
	 */
	public abstract function load_widget_page();

	public abstract function widget_admin_load();

	public function admin_widget_menu_page( $args = '' ): string {
		$args = wp_parse_args( $args, array() );
		$url = urlslab_admin_menu_page_url( $this->get_widget_slug() );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	/**
	 * @return string Wordpress submenu widget page title
	 */
	public abstract function get_admin_menu_page_title(): string;

	/**
	 * @param $args mixed the query args to be executed on the widget
	 *
	 * @return string the url string of the page
	 */
	public function get_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args = wp_parse_args( $args, array() );
		$url = urlslab_admin_menu_page_url( $main_menu_slug );
		$url = add_query_arg( array( 'component' => $this->get_widget_slug() ), $url );

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
