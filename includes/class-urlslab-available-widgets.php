<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-screenshot-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';

class Urlslab_Available_Widgets {

	private static array $available_widgets;

	private static Urlslab_Available_Widgets $instance;

	/**
	 * @return array|Urlslab_Screenshot_Widget[]
	 */
	public static function get_available_widgets(): array {
		return self::$available_widgets;
	}

	/**
	 * @param $widget_name string The name of the widget
	 *
	 * @return bool returns if this widget name exists
	 */
	public static function widget_exists( string $widget_name ): bool {
		return array_key_exists( $widget_name, self::$available_widgets );
	}


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_Available_Widgets The instance.
	 */
	public static function get_instance(): Urlslab_Available_Widgets {
		if ( empty( self::$instance ) ) {
			self::$instance = new self;
			self::$available_widgets = array(
				'urlslab-screenshot' => new Urlslab_Screenshot_Widget(
					'urlslab-screenshot',
					'Urlslab Screenshot',
					'Urlslab Widget to integrate any screenshot of other websites on your website'
				),
			);
		}

		return self::$instance;
	}

	/**
	 * Prints HTML representation of all the widgets available to the user
	 * @return void
	 */
	public static function list_widgets() {
		foreach ( self::$available_widgets as $i => $available_widget ) {
			$get_widget_slug = $available_widget->get_widget_slug();
			$widget_title = $available_widget->get_widget_title();
			$widget_desc = $available_widget->get_widget_description();
			$is_widget_active = Urlslab_User_Widget::get_instance()->is_widget_added( $get_widget_slug );
			?>
<div class="card<?php echo $is_widget_active ? ' active' : ''; ?>" id="<?php echo esc_attr( $get_widget_slug ); ?>">
	<h2 class="title"><?php echo esc_html( $widget_title ); ?></h2>
	<div class="infobox">
			<?php echo esc_html( $widget_desc ); ?>
	</div>
	<br class="clear" />
</div>
			<?php

		}
	}


}

