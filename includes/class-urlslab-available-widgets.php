<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

class Urlslab_Available_Widgets {

	private array $available_widgets;

	private Urlslab $urlslab;

	private static Urlslab_Available_Widgets $instance;

	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Available_Widgets The instance.
	 */
	public static function get_instance(): Urlslab_Available_Widgets {
		if ( empty( self::$instance ) ) {
			self::$instance                    = new self;
			self::$instance->available_widgets = array(
				'urlslab-screenshot' => new Urlslab_Screenshot_Widget(
					'urlslab-screenshot',
					'Screenshot',
					'Urlslab Widget to integrate any screenshot of other websites on your website',
					'https://www.urlslab.com'
				),
			);
		}

		return self::$instance;
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

