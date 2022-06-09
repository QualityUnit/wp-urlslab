<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-related-resources-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-link-enhancer.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-keywords-links.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-image-alt-text.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-screenshot-api.php';

class Urlslab_Available_Widgets {

	private array $available_widgets;

	private static Urlslab_Available_Widgets $instance;

	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Available_Widgets The instance.
	 */
	public static function get_instance(): Urlslab_Available_Widgets {
		if ( empty( self::$instance ) ) {
			self::$instance                    = new self;
		}

		return self::$instance;
	}

	/**
	 * @param $api_key
	 *
	 * @return void
	 */
	public function init_widgets( Urlslab_Url_Data_Fetcher $url_fetcher ) {
		$urlslab_screenshot = new Urlslab_Screenshot_Widget( $url_fetcher );
		$urlslab_related_resources = new Urlslab_Related_Resources_Widget( $url_fetcher );
		$urlslab_link_enhancer = new Urlslab_Link_Enhancer( $url_fetcher );
		$urlslab_keyword_links = new Urlslab_Keywords_Links();
		$urlslab_image_alt_text = new Urlslab_Image_Alt_Text();


		$this->available_widgets = array(
			$urlslab_screenshot->get_widget_slug() => $urlslab_screenshot,
			$urlslab_related_resources->get_widget_slug() => $urlslab_related_resources,
			$urlslab_link_enhancer->get_widget_slug() => $urlslab_link_enhancer,
			$urlslab_keyword_links->get_widget_slug() => $urlslab_keyword_links,
			$urlslab_image_alt_text->get_widget_slug() => $urlslab_image_alt_text,
		);
	}

	/**
	 * @return array|Urlslab_Widget[]
	 */
	public function get_available_widgets(): array {
		return $this->available_widgets;
	}

	/**
	 * @param $widget_slug string The slug of the widget
	 *
	 * @return bool returns if this widget name exists
	 */
	public function widget_exists( string $widget_slug ): bool {
		return array_key_exists( $widget_slug, $this->available_widgets );
	}

	/**
	 * @param string $widget_slug
	 *
	 * @return false|mixed
	 */
	public function get_widget( string $widget_slug ) {
		if ( $this->widget_exists( $widget_slug ) ) {
			return $this->available_widgets[ $widget_slug ];
		} else {
			return false;
		}
	}

	/**
	 * @return array returns all widgets
	 */
	public function get_all_widgets(): array {
		return $this->available_widgets;
	}

}

