<?php
?>

<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
			$user = Urlslab_User_Widget::get_instance();
			$widgets = Urlslab_Available_Widgets::get_instance();
			$feature_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-feature-manager' );
		foreach ( $widgets->get_available_widgets() as $widget ) {
			?>
			<div class="urlslab-card-container col-6">
				<div class="urlslab-card-header">
					<h3><?php echo esc_html( $widget->get_widget_title() ); ?></h3>
					<?php
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
				<div class="urlslab-card-content">
					<div class="urlslab-card-content-thumbnail">
						<div class="col-6">
							<p><?php echo esc_html( $widget->get_widget_description() ); ?></p>
							<a class="button button-primary" href="<?php echo esc_url( $widget->admin_widget_page() ); ?>">Manage</a>
						</div>
						<figure class="col-6">
							<img width="100%" src="<?php echo esc_url( $widget->get_thumbnail_demo_url() ); ?>" alt="screenshot demo">
						</figure>
					</div>
				</div>

			</div>

				<?php
		}
		?>
	</section>
</div>
