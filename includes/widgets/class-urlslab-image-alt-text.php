<?php

// phpcs:disable WordPress

class Urlslab_Image_Alt_Text extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private array $default_permissions = array(
		'generation' => 10
	);

	/**
	 */
	public function __construct( Urlslab_Widget_Permission_Manager $widget_permission_manager) {
		parent::__construct( $widget_permission_manager );
		$this->widget_slug        = 'urlslab-image-alt-attribute';
		$this->widget_title       = 'Image Alt Attributes';
		$this->widget_description = 'Urlslab Image Alt Attributes - automatic enhancing of image alt atribute with name of heading, where is image included';
		$this->landing_page_link  = 'https://www.urlslab.com';
		$this->parent_page        = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-image-seo' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'urlslab_content', $this, 'theContentHook', 13 );
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
		return $this->widget_title . ' Widget';
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

	public function is_widget_permitted(): bool {
		$permissions = $this->widget_permission_manager->get_limitation(
			$this,
			$this->default_permissions
		);
		if (is_string( $permissions['generation'] ) && $permissions['generation'] == 'unlimited') {
			return true;
		}
		return $this->cnt_generated_alt_lt( $permissions['generation'] );
	}

	public function theContentHook( DOMDocument $document) {
		try {
			$xpath = new DOMXPath( $document );
			$table_data = $xpath->query( "//img[not(@alt) or @alt='']|//*[starts-with(name(),'h')]" );
			$title = get_the_title();

			if (!empty( $table_data )) {
				foreach ($table_data as $element) {
					if (substr( $element->nodeName, 0, 1 ) == 'h') {
						$title = $element->nodeValue;
					} elseif ('img' == $element->nodeName && !$this->is_skip_elemenet( $element )) {
						if (isset( $element->parentNode ) && $element->parentNode->nodeName == 'a' && $element->parentNode->hasAttribute( 'title' ) && ( !$element->hasAttribute( 'urlslab-skip' ) && !$element->get )) {
							$element->setAttribute( 'alt', $title . ' - ' . $element->parentNode->getAttribute( 'title' ) );
						} elseif (strlen( $title )) {
							$element->setAttribute( 'alt', $title );
						}
					}
				}
			} else {
				return;
			}
			return;
		} catch (Exception $e) {
			//TODO logging errors
			return;
		}
	}

	private function cnt_generated_alt_lt( int $limit ): bool {
		global $wpdb;
		$table_name = URLSLAB_FEATURE_TRACKING_TABLE;
		return count(
			$wpdb->get_results(
				$wpdb->prepare(
					"SELECT 1 FROM $table_name WHERE widget_slug = %s GROUP BY widget_slug, url LIMIT $limit",
					$this->widget_slug
				),
				ARRAY_N
			)
		) < $limit;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = ''): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/image-alt-text-demo.png' ) . 'image-alt-text-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'image-alt-text';
	}

	public static function update_settings( array $new_settings ) {}
}
