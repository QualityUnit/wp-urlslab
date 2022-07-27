<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-content-seo' );
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'link-building' == $_GET['tab'] ) ) {
	?>
	<div class="urlslab-card-container col-12">
		<div class="urlslab-card-header">
			<h3>Settings</h3>
			<?php
			if ( $user->is_widget_activated( 'urlslab-keywords-links' ) ) {
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
			<div class="mar-bottom-1">
				Generate Internal links automatically based on the keywords you provide in here
			</div>
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
