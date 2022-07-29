<?php
?>
<div class="urlslab-card-header">
	<h3>Settings</h3>
	<?php
	$user = Urlslab_User_Widget::get_instance();
	$feature_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-feature-manager' );
	if ( $user->is_widget_activated( $widget->get_widget_slug() ) ) {
		?>
		<a class="urlslab-btn-error" href="<?php echo esc_url( $feature_page->menu_page( '', 'action=deactivate&widget=' . $widget->get_widget_slug() ) ); ?>">Deactivate</a>
		<?php
	} else {
		?>
		<a class="urlslab-btn-success" href="<?php echo esc_url( $feature_page->menu_page( '', 'action=activate&widget=' . $widget->get_widget_slug() ) ); ?>">Activate</a>
		<?php
	}
	?>
</div>

