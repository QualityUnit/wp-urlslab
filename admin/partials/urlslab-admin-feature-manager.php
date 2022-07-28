<?php
?>

<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
			$user_widgets = Urlslab_User_Widget::get_instance();
		foreach ( $user_widgets->get_activated_widget() as $widget ) {
			?>
			<div class="urlslab-card-container col-6">
				<div class="urlslab-card-header">
					<h3><?php echo esc_html( $widget->get_widget_title() ); ?></h3>
					<?php
					if ( $user_widgets->is_widget_activated( 'urlslab-keywords-links' ) ) {
						?>
						<a class="urlslab-btn-error" href="#">Deactivate</a>
						<?php
					} else {
						?>
						<a class="urlslab-btn-success" href="#">Activate</a>
						<?php
					}
					?>
				</div>
				<div class="urlslab-card-content">
					<div class="urlslab-card-content-thumbnail">
						<div class="col-6">
							<p><?php echo esc_html( $widget->get_widget_description() ); ?></p>
                            <a class="button button-primary" href="#">Manage</a>
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
