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
	public function enqueue_styles() {
		wp_enqueue_style( $this->urlslab, plugin_dir_url( __FILE__ ) . 'build/css/urlslab-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->urlslab, plugin_dir_url( __FILE__ ) . 'build/js/urlslab-public.js', array( 'jquery' ), $this->version, false );
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( 'urlslab-media-offloader' ) ) {
			wp_enqueue_style( 'urlslab_youtube_loader', plugin_dir_url( __FILE__ ) . 'build/css/urlslab_youtube_loader.css', array(), $this->version, 'all' );
			add_action(
				'wp_footer',
				function () {
					wp_enqueue_script( 'urlslab', plugin_dir_url( __FILE__ ) . 'build/js/urlslab-lazyload.js', array( 'jquery' ), URLSLAB_VERSION, false );}
			);
		}
	}

	public function download_offloaded_file() {
		if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], Urlslab_Driver::DOWNLOAD_URL_PATH ) !== false ) {
			Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' )->output_content();
			exit();
		}
	}

}
