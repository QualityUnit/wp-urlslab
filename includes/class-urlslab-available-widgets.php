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
		$urlslab_cache              = new Urlslab_Widget_Cache();
		$urlslab_general            = new Urlslab_Widget_General();
		$urlslab_generator          = new Urlslab_Widget_Content_Generator();
		$urlslab_optimize           = new Urlslab_Widget_Optimize();
		$urlslab_related_resources  = new Urlslab_Widget_Related_Resources();
		$urlslab_link_enhancer      = new Urlslab_Widget_Urls();
		$urlslab_keyword_links      = new Urlslab_Widget_Link_Builder();
		$urlslab_image_alt_text     = new Urlslab_Widget_Image_Alt_Text();
		$urlslab_og_meta_tag        = new Urlslab_Widget_Meta_Tag();
		$urlslab_media_offloader    = new Urlslab_Widget_Media_Offloader();
		$urlslab_lazy_loading       = new Urlslab_Widget_Lazy_Loading();
		$urlslab_optimizer          = new Urlslab_Widget_Html_Optimizer();
		$urlslab_search_and_replace = new Urlslab_Widget_Search_Replace();
		$urlslab_redirects          = new Urlslab_Widget_Redirects();
		$urlslab_custom_html        = new Urlslab_Widget_Custom_Html();
		$urlslab_web_vitals         = new Urlslab_Widget_Web_Vitals();
		$urlslab_faq                = new Urlslab_Widget_Faq();
		$urlslab_serp               = new Urlslab_Widget_Serp();

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
			$urlslab_image_alt_text->get_widget_slug()     => $urlslab_image_alt_text,
			$urlslab_redirects->get_widget_slug()          => $urlslab_redirects,
			$urlslab_cache->get_widget_slug()              => $urlslab_cache,
			$urlslab_lazy_loading->get_widget_slug()       => $urlslab_lazy_loading,
			$urlslab_optimizer->get_widget_slug()          => $urlslab_optimizer,
			$urlslab_search_and_replace->get_widget_slug() => $urlslab_search_and_replace,
			$urlslab_custom_html->get_widget_slug()        => $urlslab_custom_html,
			$urlslab_optimize->get_widget_slug()           => $urlslab_optimize,
			$urlslab_web_vitals->get_widget_slug()         => $urlslab_web_vitals,
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
