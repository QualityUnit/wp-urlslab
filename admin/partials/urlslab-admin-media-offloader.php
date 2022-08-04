<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		$user = Urlslab_User_Widget::get_instance();
		$widgets = Urlslab_Available_Widgets::get_instance();
		$feature_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-media-offloader' );
		if ( ! isset( $_GET['tab'] ) or ( 'media-offloader' == $_GET['tab'] ) ) {
			?>

			<div id="urlslab-collapsed-accordion" class="accordion col-12">
				<!-- Section 1 -->
				<div class="urlslab-accordion-header col-12">
					<div>
						<h3>Settings</h3>
						<?php
						$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' );
						require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
						?>
					</div>
				</div>
				<div class="urlslab-card-container">
					<div class="urlslab-card-content">
						<?php $this->render_settings(); ?>
					</div>
				</div>

				<!-- Section 2 -->
				<div class="urlslab-accordion-header col-12">
					<h3>Explanation</h3>
				</div>
				<div class="urlslab-card-container">
					<div class="urlslab-card-content">
						<div class="mar-bottom-1">
							Offload different resources in your page either to Database or file system or S3.
							This can help you in different ways:
							<ol>
								<li>
									By enabling offloading content from external domains, you will take control of the
									resources of your own page and you will have the resource anytime without relying on
									externally-provided resource, plus it enhances your website speed
								</li>
								<li>
									For multi-wordpress installations, It's the best way to sync the files and resources
									together for different installations.
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
			<?php
		}

		?>
	</section>
</div>

