<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Urlslab_Screenshot_Public
 * @subpackage Urlslab_Screenshot_Public/public
 */
class Urlslab_Public {
	public static bool $enqueued = false;

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private string $urlslab;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private string $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $urlslab The name of the plugin.
	 * @param string $version The version of this plugin.
	 *
	 * @since    1.0.0
	 */
	public function __construct( $urlslab, $version ) {

		$this->urlslab = $urlslab;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		if (
			Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ||
			Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Lazy_Loading::SLUG ) ||
			Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Cache::SLUG )
		) {
			add_action(
				'wp_footer',
				function () {
					if ( Urlslab_Public::$enqueued ) {
						return;
					}
					wp_enqueue_script(
						'urlslab',
						URLSLAB_PLUGIN_URL . 'public/build/js/urlslab-lazyload.js',
						array(),
						URLSLAB_VERSION,
						array(
							'in_footer' => true,
							'strategy'  => 'defer',
						)
					);
					// Localize the script with new data
					$wp_vars = array(
						'base_url'       => home_url( '/' ),
						'has_permalinks' => ! empty( get_option( 'permalink_structure' ) ),
					);
					wp_localize_script( 'urlslab', 'wp_vars', $wp_vars );
					Urlslab_Public::$enqueued = true;
				}
			);
		}
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( 'urlslab-media-offloader' ) ) {
			add_filter(
				'script_loader_tag',
				function ( $tag, $handle ) {
					if ( false === strpos( $handle, 'urlslab' ) || false !== strpos( $tag, 'async' ) || false !== strpos( $tag, 'defer' ) ) {
						return $tag;
					}

					return str_replace( ' src', ' async defer src', $tag );
				},
				10,
				2
			);
		}
	}
}
