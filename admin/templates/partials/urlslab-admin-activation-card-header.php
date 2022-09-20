<?php
?>
	<?php
	$user = Urlslab_User_Widget::get_instance();
	$dashboard = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-dashboard' );
	if ( $user->is_widget_activated( $widget->get_widget_slug() ) ) {
		?>
		<form method="post" action="<?php echo esc_url( $dashboard->menu_page( '', 'action=deactivate' ) ); ?>">
			<?php wp_nonce_field( 'urlslab-widget-activation' ); ?>
			<input type="hidden" name="widget" value="<?php echo esc_attr( $widget->get_widget_slug() ); ?>">
			<button type="submit" class="urlslab-btn-error">Deactivate</button>
		</form>
		<?php
	} else {
		?>
		<form method="post" action="<?php echo esc_url( $dashboard->menu_page( '', 'action=activate' ) ); ?>">
			<?php wp_nonce_field( 'urlslab-widget-activation' ); ?>
			<input type="hidden" name="widget" value="<?php echo esc_attr( $widget->get_widget_slug() ); ?>">
			<button type="submit" class="urlslab-btn-success">Activate</button>
		</form>
		<?php
	}
	?>
