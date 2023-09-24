<?php

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
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function init_widgets() {
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-cache-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-general.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-optimize.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-content-generator-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-serp.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-related-resources-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-media-offloader-widget.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-lazy-loading.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-link-enhancer.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-keywords-links.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-image-alt-text.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-meta-tag.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-html-optimizer.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-search-replace.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-redirects.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-custom-html.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-faq.php';


		$urlslab_cache              = new Urlslab_Cache_Widget();
		$urlslab_general            = new Urlslab_General();
		$urlslab_generator          = new Urlslab_Content_Generator_Widget();
		$urlslab_optimize           = new Urlslab_Optimize();
		$urlslab_screenshot         = new Urlslab_Screenshot_Widget();
		$urlslab_related_resources  = new Urlslab_Related_Resources_Widget();
		$urlslab_link_enhancer      = new Urlslab_Link_Enhancer();
		$urlslab_keyword_links      = new Urlslab_Keywords_Links();
		$urlslab_image_alt_text     = new Urlslab_Image_Alt_Text();
		$urlslab_og_meta_tag        = new Urlslab_Meta_Tag();
		$urlslab_media_offloader    = new Urlslab_Media_Offloader_Widget();
		$urlslab_lazy_loading       = new Urlslab_Lazy_Loading();
		$urlslab_optimizer          = new Urlslab_Html_Optimizer();
		$urlslab_search_and_replace = new Urlslab_Search_Replace();
		$urlslab_redirects          = new Urlslab_Redirects();
		$urlslab_custom_html        = new Urlslab_Custom_HTML();
		$urlslab_faq        = new Urlslab_Faq();
		$urlslab_serp        = new Urlslab_Serp();

		$this->available_widgets = array(
			$urlslab_general->get_widget_slug()            => $urlslab_general,
			$urlslab_link_enhancer->get_widget_slug()      => $urlslab_link_enhancer,
			$urlslab_keyword_links->get_widget_slug()      => $urlslab_keyword_links,
			$urlslab_generator->get_widget_slug()          => $urlslab_generator,
			$urlslab_serp->get_widget_slug()               => $urlslab_serp,
			$urlslab_related_resources->get_widget_slug()  => $urlslab_related_resources,
			$urlslab_faq->get_widget_slug()                => $urlslab_faq,
			$urlslab_og_meta_tag->get_widget_slug()        => $urlslab_og_meta_tag,
			$urlslab_media_offloader->get_widget_slug()    => $urlslab_media_offloader,
			$urlslab_screenshot->get_widget_slug()         => $urlslab_screenshot,
			$urlslab_image_alt_text->get_widget_slug()     => $urlslab_image_alt_text,
			$urlslab_redirects->get_widget_slug()          => $urlslab_redirects,
			$urlslab_cache->get_widget_slug()              => $urlslab_cache,
			$urlslab_lazy_loading->get_widget_slug()       => $urlslab_lazy_loading,
			$urlslab_optimizer->get_widget_slug()          => $urlslab_optimizer,
			$urlslab_search_and_replace->get_widget_slug() => $urlslab_search_and_replace,
			$urlslab_custom_html->get_widget_slug()        => $urlslab_custom_html,
			$urlslab_optimize->get_widget_slug()           => $urlslab_optimize,
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
	 * @return null|Urlslab_Widget
	 */
	public function get_widget( string $widget_slug ): ?Urlslab_Widget {
		if ( $this->widget_exists( $widget_slug ) ) {
			return $this->available_widgets[ $widget_slug ];
		} else {
			return null;
		}
	}

}
