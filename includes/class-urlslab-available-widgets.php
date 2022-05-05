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


	/**
	 * Prints HTML representation of all the widgets available to the user
	 * @return void
	 */
	public function list_widgets( $action = '', $active_widget = '' ) {
		foreach ( $this->available_widgets as $i => $available_widget ) {
			$widget_slug              = $available_widget->get_widget_slug();
			$widget_title             = $available_widget->get_widget_title();
			$widget_desc              = $available_widget->get_widget_description();
			$widget_landing_page_link = $available_widget->get_landing_page_link();
			$widget_submenu_link      = $available_widget->get_admin_menu_page_url();
			$user_urlslab     = Urlslab_User_Widget::get_instance();
			$is_widget_active = $user_urlslab->is_widget_active( $widget_slug );
			?>
		<div class="card<?php echo $is_widget_active ? ' active' : ''; ?>" id="<?php echo esc_attr( $widget_slug ); ?>">
			<h2 class="title"><?php echo esc_html( $widget_title ); ?></h2>
			<div class="infobox">
				<?php echo $is_widget_active ? 'Widget is active' : esc_html( $widget_desc ); ?>.
				for more details see <a href="<?php echo esc_url( $widget_landing_page_link ); ?>" target="_blank">
					<?php echo esc_html( $widget_title ); ?>
				</a>
			</div>
			<br class="clear"/>
			<?php
			if ( 'setup-widget' == $action and
				 '' != $active_widget and
				 $active_widget->get_widget_slug() == $widget_slug ) {
				$api_key = '';
				if ( $user_urlslab->has_api_key() ) {
					$api_key = $user_urlslab->get_api_key();
				}
				$available_widget->render_form( $api_key );
			} else {
				?>
				<a class="button" href="<?php echo esc_url( $widget_submenu_link ); ?>"><?= esc_html( __( 'Info', 'urlslab' ) ); ?></a>
				<a class="button"
				   href="<?php echo esc_url( $available_widget->get_integration_page_url( 'action=setup-widget' ) ); ?>"
				   id="widget-integration-<?php echo esc_attr( $widget_slug ); ?>">
					<?= esc_html( __( 'Setup Widget', 'urlslab' ) ); ?></a>
				</div>
				<?php
			}
		}
	}


}

