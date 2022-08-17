<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		$user = Urlslab_User_Widget::get_instance();
		$widgets = Urlslab_Available_Widgets::get_instance();
		$offloader_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-media-offloader' );
		if ( ! isset( $_GET['tab'] ) or ( 'media-offloader' == $_GET['tab'] ) ) {
			?>


			<div id="urlslab-vertical-tabs" class="urlslab-container-shadow urlslab-ui-tabs-vertical">
				<ul class="urlslab-tab-topic">
					<li><a href="#fragment-1"><span>How it works?</span></a></li>
					<li>
						<a href="#fragment-2">
							<span>Media offloading</span>
						</a>
					</li>
					<li>
						<a href="#fragment-3">
							<span>Storage Drivers</span>
						</a>
					</li>
					<li>
						<a href="#fragment-4">
							<span>Image Optimisation</span>
						</a>
					</li>
					<li>
						<a href="#fragment-5">
							<span>Lazy Loading</span>
						</a>
					</li>
				</ul>
				<div id="fragment-1">
					<div class="urlslab-tab-content-heading">
						<h3>How it Works?</h3>
						<?php
						$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' );
						require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
						?>
					</div>
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
				<div id="fragment-2">
					<?php $this->render_settings(); ?>
				</div>
				<div id="fragment-3">
					<?php $this->render_driver_settings(); ?>
				</div>
				<div id="fragment-4">
					<?php $this->render_image_optimisation_settings(); ?>
				</div>
				<div id="fragment-5">
					<?php $this->render_lazy_loading_settings(); ?>
				</div>
			</div>
			<?php
			$offloader_page->render_subpage();
		}
		?>
	</section>
</div>

