<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-css-cache-row.php';

class Urlslab_CSS_Optimizer extends Urlslab_Widget {
	public const SLUG = 'urlslab-css-optimizer';

	public const SETTING_NAME_CSS_MAX_SIZE = 'urlslab_css_max_size';
	public const DEFAULT_CSS_MAX_SIZE = 250000;

	public const SETTING_NAME_CSS_CACHE_TTL = 'urlslab_css_ttl';
	public const DEFAULT_CSS_CACHE_TTL = 604800;

	public function __construct() {}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'theContentHook', 100 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'theContentHook' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function get_widget_slug(): string {
		return Urlslab_CSS_Optimizer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'CSS Optimiser' );
	}

	public function get_widget_description(): string {
		return __( 'Improve page performance and reduce content-blocker requests using inline CSS instead of external CSS files' );
	}

	public function theContentHook( DOMDocument $document ) {
		if ( is_admin() ) {
			return;
		}
		try {
			$xpath     = new DOMXPath( $document );
			$css_links = $xpath->query( "//link[@rel='stylesheet' and (@type='text/css' or not(@type)) and @href ]" );
			$links     = array();
			foreach ( $css_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'href' ) ] ) ) {
					try {
						$url = new Urlslab_Url( $link_object->getAttribute( 'href' ) );
						if ( $url->is_same_domain_url() ) {
							$links[ $link_object->getAttribute( 'href' ) ] = $url->get_url_id();
						}
					} catch ( Exception $e ) {
					}
				}
			}

			$css_files = Urlslab_CSS_Cache_Row::get_css_files( $links );

			$remove_elements = array();
			foreach ( $css_links as $link_object ) {
				if ( isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
					$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
					if ( Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_object->get_status() && $this->get_option( self::SETTING_NAME_CSS_MAX_SIZE ) > $css_object->get_filesize() ) {
						$new_elm = $document->createElement( 'style', $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ]->get_css_content() );
						$new_elm->setAttribute( 'type', 'text/css' );
						if ( $link_object->hasAttribute( 'media' ) ) {
							$new_elm->setAttribute( 'media', $link_object->getAttribute( 'media' ) );
						}
						if ( $link_object->hasAttribute( 'id' ) ) {
							$new_elm->setAttribute( 'id', $link_object->getAttribute( 'id' ) );
						}
						$link_object->setAttribute( 'urlslab-old', 'should-remove' );
						$new_elm->setAttribute( 'urlslab-css', '1' );
						$link_object->parentNode->insertBefore( $new_elm, $link_object );
						$remove_elements[] = $link_object;
					}
				}
			}
			foreach ( $remove_elements as $element ) {
				$element->parentNode->removeChild( $element );
			}

			$this->insert_missing_css_files( $links, $css_files );
		} catch ( Exception $e ) {
		}
	}

	public static function update_settings( array $new_settings ) {}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'CSS Optimiser Settings' ), __( 'Optimising external resources like CSS files is key to ensuring a fast website. Setting up a size limit and expiration date for those files helps maximize the website\'s performance and loading speed. These settings can significantly reduce the amount of time needed for a page to load and enhance the user experience.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_CSS_MAX_SIZE,
			self::DEFAULT_CSS_MAX_SIZE,
			true,
			__( 'CSS Max Size (bytes)' ),
			__( 'Define the size limit of the CSS file, which file will be switched to the content. Mind that the size is without compression, so if the current request has 30 kb, without the compression, it can be even 210 kb.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_CACHE_TTL,
			self::DEFAULT_CSS_CACHE_TTL,
			true,
			__( 'CSS Expiration' ),
			__( 'Define how long the CSS file will be stored in the database.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				3600     => __( 'One hour' ),
				28800    => __( 'Eight hours' ),
				86400    => __( 'One day' ),
				604800   => __( 'One week' ),
				2592000  => __( 'One moth' ),
				7776000  => __( 'Three months' ),
				15552000 => __( 'Six months' ),
				31536000 => __( 'One year' ),
				0        => __( 'No cache' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'main'
		);
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
