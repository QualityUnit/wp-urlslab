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
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private string $urlslab;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private string $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string    $urlslab       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 *@since    1.0.0
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
		wp_enqueue_style( $this->urlslab, plugin_dir_url( __FILE__ ) . 'css/urlslab-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->urlslab, plugin_dir_url( __FILE__ ) . 'js/urlslab-public.js', array( 'jquery' ), $this->version, false );
	}

	public function the_content_image_alt_attribute( $content ) {
		$image_alt_attributes = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-image-alt-attribute' );
		return $image_alt_attributes->theContentHook( $content );
	}

	public function the_content_link_enhancer( $content ) {
		$link_enhancer = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
		return $link_enhancer->theContentHook( $content );
	}

	public function the_content_keywords_links( $content ) {
		$keywords_links = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-keywords-links' );
		return $keywords_links->theContentHook( $content );
	}

	public function the_content_og_meta_tag() {
		remove_action( 'wp_head', array( $this, 'the_content_og_meta_tag' ) );
		ob_start();
		do_action( 'wp_head' );
		remove_all_actions( 'wp_head' );
		$content = ob_get_contents();
		ob_end_clean();

		$og_meta_tag = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-og-meta-tag' );
		echo $og_meta_tag->theContentHook( $content ); // phpcs:ignore
	}

}
