<?php
?>
<div class="urlslab-wrap">
	<?php require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-header-seo' );
		$user = Urlslab_User_Widget::get_instance();
		?>


		<div id="urlslab-vertical-tabs" class="urlslab-container-shadow urlslab-ui-tabs-vertical">
			<ul class="urlslab-tab-topic">
				<li><a href="#fragment-1"><span>Overview</span></a></li>
				<li>
					<a href="#fragment-2">
						<span>Settings</span>
					</a>
				</li>
			</ul>
			<div id="fragment-1">
				<div class="urlslab-tab-content-heading">
					<h3>How it Works?</h3>
					<?php
					$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-meta-tag' );
					require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-activation-card-header.php';
					?>
				</div>
				<p>Generate Meta tags automatically from the content summary of your pages. Activate the plugin and sit
					back. never worry about a missing meta description or OG tags.</p>
				<figure style="display: flex">
					<img width="60%"
						 src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/sc-meta.png' ) . 'sc-meta.png' ); ?>"
						 alt="demo screenshot">
					<img width="40%"
						 src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/og-demo.png' ) . 'og-demo.png' ); ?>"
						 alt="demo screenshot">
				</figure>
			</div>
			<div id="fragment-2">
				<?php $page_data->render_widget_form(); ?>
			</div>
		</div>
	</section>
</div>

