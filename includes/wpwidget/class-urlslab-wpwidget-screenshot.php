<?php

class Urlslab_Wpwidget_Screenshot extends WP_Widget {
	public function __construct() {
		parent::__construct(
			'urlslab_screenshot',         // Base ID
			__( 'Screenshot (URLsLab)' ), // Name
			array(
				'description'                 => __( 'URLsLab Screenshot.' ),
				'customize_selective_refresh' => true,
				'show_instance_in_rest'       => true,
			),
			array(
				'width'  => 400,
				'height' => 200,
			)
		);
	}

	public function widget( $args, $instance ) {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Urls::SLUG ) ) {
			return;
		}
		if ( empty( $instance['url'] ) ) {
			$instance['url'] = get_the_permalink();
		}
		echo wp_kses(
			Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_shortcode_content( $instance ),
			array(
				'div' => array( 'border', 'style', 'class' ),
				'b' => array(),
				'img' => array( 'src', 'alt', 'width', 'height' ),
			)
		);
	}

	public function form( $instance ) {
		$instance = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_screenshot_attribute_values( $instance );
		$this->print_form_field( $instance, 'url', __( 'URL', 'wp-urlslab' ) );
		$this->print_form_field( $instance, 'width', __( 'Width', 'wp-urlslab' ) );
		$this->print_form_field( $instance, 'height', __( 'Height', 'wp-urlslab' ) );
		$this->print_form_field( $instance, 'alt', __( 'Alt text', 'wp-urlslab' ) );
		$this->print_form_field( $instance, 'default-image', __( 'Default image URL', 'wp-urlslab' ) );
		$this->print_form_field( $instance, 'screenshot-type', __( 'Image Type', 'wp-urlslab' ) );
	}

	private function print_form_field( $instance, $field_name, $field_label ) {
		?>
		<p><label
					for="
					<?php
					echo esc_attr( $this->get_field_id( $field_name ) );
					?>
					">
				<?php
				echo esc_html( $field_label );
				?>
			</label>
			<input class="widefat" id="
			<?php
			echo esc_attr( $this->get_field_id( $field_name ) );
			?>
			"
				   name="
				   <?php
					echo esc_attr( $this->get_field_name( $field_name ) );
					?>
				   "
				   type="text"
				   value="
				   <?php
					echo esc_attr( $instance[ $field_name ] );
					?>
				   "/></p>
		<?php
	}

	public function update( $new_instance, $old_instance ) {
		$instance = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_screenshot_attribute_values( $new_instance );

		return $instance;
	}
}
