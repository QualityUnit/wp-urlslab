<?php

class Urlslab_User_Widget {
	private array $activated_widgets = array();

	private static Urlslab_User_Widget $instance;


	/**
	 * Returns the singleton instance of this class.
	 *
	 * @return Urlslab_User_Widget The instance.
	 */
	public static function get_instance(): Urlslab_User_Widget {
		if ( empty( self::$instance ) ) {
			self::$instance    = new self();
			$widgets           = Urlslab::get_option( 'user_widgets', array() );
			$available_widgets = Urlslab_Available_Widgets::get_instance();

			if ( ! in_array( Urlslab_Widget_General::SLUG, $widgets ) ) {
				$widgets[] = Urlslab_Widget_General::SLUG;    //by default always active widget
			}
			foreach ( $widgets as $widget ) {
				$widget_detail = $available_widgets->get_widget( $widget );
				if ( null !== $widget_detail ) {
					self::$instance->activated_widgets[ $widget_detail->get_widget_slug() ] = $widget_detail;
				}
			}
		}

		return self::$instance;
	}

	public function activate_widget( Urlslab_Widget $urlslab_widget ) {
		if ( empty( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] ) ) {
			$this->activated_widgets[ $urlslab_widget->get_widget_slug() ] = $urlslab_widget;
			Urlslab::update_option( 'user_widgets', array_keys( $this->activated_widgets ) );
			$urlslab_widget->add_options_on_activate();
			$urlslab_widget->on_activate();
		}
	}

	public function deactivate_widget( Urlslab_Widget $urlslab_widget ) {
		if ( ! empty( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] ) ) {
			$urlslab_widget->on_deactivate();
			unset( $this->activated_widgets[ $urlslab_widget->get_widget_slug() ] );
			Urlslab::update_option( 'user_widgets', array_keys( $this->activated_widgets ) );
		}
	}

	/**
	 *
	 * @return Urlslab_Widget[]|Urlslab_Widget
	 */
	public function get_activated_widgets(): array {
		return array_values( $this->activated_widgets );
	}

	/**
	 * @param string $widget_slug
	 *
	 * @return Urlslab_Widget
	 */
	public function get_widget( string $widget_slug ): ?Urlslab_Widget {
		return $this->activated_widgets[ $widget_slug ] ?? null;
	}

	public function is_widget_activated( string $widget_slug ): bool {
		return array_key_exists( $widget_slug, $this->activated_widgets );
	}
}
