<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/services/class-urlslab-css-cache-row.php';

class Urlslab_CSS_Optimizer extends Urlslab_Widget {


	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;


	public function __construct() {
		$this->widget_slug        = 'urlslab-css-optimizer';
		$this->widget_title       = __( 'CSS Optimizer' );
		$this->widget_description = __( 'Optimizes speed of CSS loading into page' );
		$this->landing_page_link  = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-header-seo' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_content', $this, 'theContentHook', 100 );
		$loader->add_action( 'urlslab_head_content', $this, 'theContentHook' );
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return $this->widget_title . __( ' Widget' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function theContentHook( DOMDocument $document ) {
		try {
			$xpath     = new DOMXPath( $document );
			$css_links = $xpath->query( "//link[@rel='stylesheet' and (@type='text/css' or not(@type)) and @href ]" );
			$links     = array();
			foreach ( $css_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'href' ) ] ) ) {
					$links[ $link_object->getAttribute( 'href' ) ] = ( new Urlslab_Url( $link_object->getAttribute( 'href' ) ) )->get_url_id();
				}
			}

			$css_files = Urlslab_CSS_Cache_Row::get_css_files( $links );

			foreach ( $css_links as $link_object ) {
				if ( isset( $links[ $link_object->getAttribute( 'href' ) ] ) && isset( $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
					if ( $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ]->get( 'status' ) == Urlslab_CSS_Cache_Row::STATUS_ACTIVE ) {
						$new_elm = $document->createElement( 'style', $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ]->get( 'css_content' ) );
						$new_elm->setAttribute( 'type', 'text/css' );
						if ( $link_object->hasAttribute( 'media' ) ) {
							$new_elm->setAttribute( 'media', $link_object->getAttribute( 'media' ) );
						}
						$link_object->parentNode->insertBefore( $new_elm, $link_object );
						$link_object->parentNode->removeChild( $link_object );
					}
				}
			}

			$this->insert_missing_css_files( $links, $css_files );
		} catch ( Exception $e ) {
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function render_widget_overview() {}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/css-optimizer-demo.png' ) . 'css-optimizer-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'meta-tags';
	}

	public static function update_settings( array $new_settings ) {}

	public static function add_option() {}


	public function is_api_key_required() {
		return false;
	}

	private function insert_missing_css_files( array $links, array $css_files ) {
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();
		foreach ( $links as $url => $urld_id ) {
			if ( ! isset( $css_files[ $urld_id ] ) ) {
				$placeholders[] = '(%d,%s,%s,%s)';
				array_push(
					$values,
					$urld_id,
					$url,
					Urlslab_CSS_Cache_Row::STATUS_NEW,
					$now
				);
			}
		}
		if ( ! empty( $values ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_CSS_CACHE_TABLE . ' (url_id,url,status,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

}
