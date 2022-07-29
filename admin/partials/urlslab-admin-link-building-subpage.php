<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-content-seo' );
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'link-building' == $_GET['tab'] ) ) {
	?>
	<div class="urlslab-card-container col-12">
		<?php
		$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-keywords-links' );
		require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
		?>
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
