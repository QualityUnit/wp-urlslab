<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'keyword-linking' == $_GET['tab'] ) ) {
	?>

	<div id="urlslab-vertical-tabs" class="urlslab-container-shadow urlslab-ui-tabs-vertical d-none">
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
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-keywords-links' );
				require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-activation-card-header.php';
				?>
			</div>
			<p>Generate Internal links automatically based on the keywords you provide in here.</p>
		</div>
		<div id="fragment-2">
			<?php $this->link_building_subpage->render_settings(); ?>
		</div>
	</div>
	<?php
	$page_data->render_subpage();
}
//# Internal Linking tab
?>

<?php
//# Modal for import/export of goods
?>
