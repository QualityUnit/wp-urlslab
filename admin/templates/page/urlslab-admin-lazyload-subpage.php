<?php
$media_page = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-media' );
if ( isset( $_GET['tab'] ) and ( 'lazy-load' == $_GET['tab'] ) ) {
	?>


	<div id="urlslab-vertical-tabs" class="urlslab-container-shadow urlslab-ui-tabs-vertical d-none">
		<ul class="urlslab-tab-topic">
			<li><a href="#fragment-1"><span>How it works?</span></a></li>
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
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-lazy-loading' );
				require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-activation-card-header.php';
				?>
			</div>
			Lazy loading different resources on your page. you can choose to lazy load all kinds of resources. You can lazy load Images, videos and youtube embedded assets.
		</div>
		<div id="fragment-2">
			<?php $this->lazyload_subpage->render_settings(); ?>
		</div>
	</div>
	<?php
	$media_page->render_subpage();
}
?>
