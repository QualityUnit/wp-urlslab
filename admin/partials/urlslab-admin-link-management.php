<?php
?>
<?php
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'link-management' == $_GET['tab'] ) {

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
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
				require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
				?>
			</div>
			Enhance all your links in your pages with Link Enhancer widget with one click:
			<ul>
				<li>
					Add title attribute to all your links in the pages automatically based on the destination
					url that the link is point to.
				</li>
			</ul>
		</div>
		<div id="fragment-2">
			<?php $this->link_management_subpage->render_settings(); ?>
		</div>
	</div>
<?php } ?>
